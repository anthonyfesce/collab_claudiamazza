#!/usr/bin/env bash
# Controllo prima di ogni commit. La repository è pubblica: qui si blocca tutto ciò che non deve uscire.
#   bash scripts/check-repo.sh
set -u
cd "$(dirname "$0")/.."
fail=0

# 1. File che non devono stare nella repository (originali, segreti)
bad=$(git ls-files --cached --others --exclude-standard | grep -Ei '\.(tif|tiff|psd|psb|raw|cr2|cr3|nef|arw|dng|heic|pem|key)$|(^|/)\.env|\.dev\.vars$' || true)
if [ -n "$bad" ]; then echo "ERRORE: file che non devono stare nella repository:"; echo "$bad"; fail=1; fi

# 2. File troppo pesanti (le foto web sono già ottimizzate: oltre 1,5 MB c'è un errore)
big=$(git ls-files --cached --others --exclude-standard | while read -r f; do
  [ -f "$f" ] && [ "$(wc -c < "$f")" -gt 1572864 ] && echo "$f ($(( $(wc -c < "$f") / 1024 )) KB)"
done)
if [ -n "$big" ]; then echo "ERRORE: file oltre 1,5 MB (usare tools/optimize-images.mjs):"; echo "$big"; fail=1; fi

# 3. Segreti nel testo
sec=$(git ls-files --cached --others --exclude-standard | grep -vE '^(tools/package-lock\.json|scripts/check-repo\.sh)$' | xargs -r grep -InE 'password *[:=] *[^ ]+|passwd|api[_-]?key|secret|token *[:=] *[A-Za-z0-9]{12,}|BEGIN (RSA|OPENSSH|PRIVATE)' 2>/dev/null | grep -v 'docs/' || true)
if [ -n "$sec" ]; then echo "ATTENZIONE: possibili segreti (controllare a mano):"; echo "$sec"; fail=1; fi

# 4. Foto senza testo alternativo
noalt=$(grep -rnP '<img(?![^>]*alt=)' public --include=*.html || true)
if [ -n "$noalt" ]; then echo "ERRORE: immagini senza attributo alt:"; echo "$noalt"; fail=1; fi

# 5. Segnaposto ancora presenti (solo informativo: non blocca)
ph=$(grep -rn 'DA SCRIVERE\|DA CONFERMARE\|ALT DA SCRIVERE\|noindex' public --include=*.html | wc -l | tr -d ' ')
echo "Segnaposto/noindex ancora nel sito: $ph (prima del lancio devono essere 0)"

[ $fail -eq 0 ] && echo "OK" || exit 1

# Sito di Claudia Mazza (fotografa)

Sito vetrina/portfolio in HTML, CSS e JavaScript semplice, senza framework e senza build. Pubblicato su Cloudflare Workers (static assets) dall'account di Claudia. Lavoriamo in italiano.

## Persone e ruoli
- **Claudia Mazza**: titolare del sito. Carica foto, testi e reference su Google Drive. Non usa GitHub.
- **Anthony (Another Perspective)**: coordina, approva ciò che si vede a schermo, ha accesso come amministratore a Cloudflare.
- **Claude**: costruisce e aggiorna il sito in questa repository e scrive le indicazioni per Claudia nel documento "Indicazioni da Claude" sul Drive.

## La repository è PUBBLICA (per ora)
Quello che entra qui lo può leggere chiunque, anche se poi cancellato (resta nella cronologia). Quindi:
- mai password, token, codici, accessi, anche se Claudia li scrive su Drive;
- mai originali fotografici ad alta risoluzione: qui vanno solo le versioni web (max 2400 px, WebP) prodotte da `tools/optimize-images.mjs`;
- mai dati personali di terzi (clienti, persone nelle foto con nome e cognome nei file o nei commenti);
- prima di ogni commit: `bash scripts/check-repo.sh`.
Quando il sito è online la repository diventa privata: Cloudflare Workers Builds e Claude Code continuano a funzionare con il collegamento GitHub già autorizzato.

## Struttura
- `public/`: il sito, esattamente ciò che viene pubblicato. `index.html`, `css/style.css`, `js/main.js`, `fonts/`, `images/<serie>/`, `_headers`. In `images/demo/` ci sono immagini di PROVA generate da codice: vanno sostituite dalle foto di Claudia e la cartella cancellata.
- `wrangler.jsonc`: configurazione Cloudflare (cartella `public`, pagina 404).
- `tools/`: strumenti locali (ottimizzazione foto). Non fanno parte del sito.
- `scripts/check-repo.sh`: controllo prima del commit.
- `docs/WORKFLOW.md`: come i contenuti passano da Drive al sito e come si pubblica.
- `docs/DECISIONI.md`: scelte fatte e domande aperte.

## Drive (fonte dei contenuti)
Cartella radice "Drive" ID `0AFI0E0kFHMNKUk9PVA`, dentro `Creazione Sito` (`1aazwQEwihI1QcaTSkyKcwJ4En2JbnmwQ`) con: Archivio Fotografico, Contenuti di Testo, References Siti Internet, Accessi Sito, Indicazioni, Output.
Nella radice stanno la "Guida dominio e hosting Cloudflare per il sito" e "Indicazioni da Claude" (diario datato per Claudia, voce più recente in alto).

### Chi ha scritto cosa nei documenti Drive
Claudia scrive nei documenti in carattere nero normale. Tutto ciò che scrive Claude è in **verde** (RGB 0.1, 0.5, 0.25), con una riga di legenda in cima al documento. Quando si aggiunge testo a un documento condiviso con lei: colorare di verde solo il testo nuovo di Claude, non modificare né ricolorare il suo, e preferire una scheda (tab) o una sezione separata. Prima di rispondere a Claudia, rileggere il documento e distinguere i due autori dal colore. Documenti già marcati: "References Claude". "Indicazioni da Claude" è interamente di Claude: se Claudia comincia a scriverci, marcare anche quello.

## Regole di lavoro
- Contenuti veri solo da Drive. Se manca un testo o una foto, resta il segnaposto `[DA SCRIVERE]` e si segna in "Indicazioni da Claude". Non inventare testi, date, premi, clienti o prezzi.
- Ogni `<img>` ha `alt` descrittivo, `width` e `height`; sotto la prima schermata `loading="lazy"`.
- Nessun cookie né strumenti di tracciamento senza accordo esplicito (così non serve il banner). Se serve una statistica: Cloudflare Web Analytics, senza cookie.
- Stile: colori e caratteri solo nei token `:root` di `style.css`. Fino alle reference di Claudia il look resta neutro.
- Accessibilità: contrasto AA, navigazione da tastiera, `prefers-reduced-motion` rispettato, testi leggibili su telefono (si controlla sempre a 390 px e a 1440 px).
- `noindex` resta nell'`index.html` finché Anthony non dice che si lancia. Al lancio: togliere `noindex`, aggiungere `robots.txt`, `sitemap.xml`, `og:image`, `og:url`, dati JSON-LD completi, e verificare che `check-repo.sh` segni 0 segnaposto.
- Le modifiche visibili si mostrano ad Anthony (anteprima o screenshot) prima di considerarle chiuse.
- Branch: si lavora sul branch indicato dalla sessione; `main` è quello pubblicato da Cloudflare. Niente pull request se non richiesta.

## Dopo ogni giornata di lavoro
Aggiungere in cima a "Indicazioni da Claude" una voce con la data: cosa è stato fatto, cosa manca da Claudia (con la cartella giusta), cosa è in attesa di decisione.

# Come funziona

```
Claudia  →  Google Drive  →  Claude (questa repository)  →  GitHub  →  Cloudflare  →  sito online
 carica      Creazione Sito    costruisce e aggiorna        push        Workers Builds   dominio di Claudia
```

## 1. Contenuti (Drive)
| Cartella | Cosa ci mette Claudia | Come lo usa il sito |
|---|---|---|
| Archivio Fotografico | Una sottocartella per serie, foto numerate (`01-`, `02-`...). | Una sezione "serie" nella galleria. L'ordine dei numeri è l'ordine sul sito. |
| Contenuti di Testo | Bio, frase di presentazione, descrizione delle serie, contatti, dati di legge. | Testi del sito, copiati senza riscriverli. |
| References Siti Internet | Link e screenshot di siti che le piacciono, con due righe su cosa le piace. | Guidano lo stile (token in `style.css`). |
| Accessi Sito | Solo l'elenco di quali servizi esistono (Instagram, ecc.). Mai password. | Link nel sito. Gli accessi veri si danno con inviti. |
| Indicazioni | Note di Anthony. | Contesto per Claude. |
| Output | Anteprime e consegne da Claude per Claudia. | Revisione. |

## 2. Foto: dal Drive al sito
1. Scaricare la cartella della serie dal Drive in un posto **fuori dalla repository** (per esempio `~/originali/nome-serie`).
2. `cd tools && npm install` (solo la prima volta), poi `node optimize-images.mjs ~/originali/nome-serie nome-serie`.
3. Il comando crea `public/images/nome-serie/` (WebP a 480, 960, 1600, 2400 px, senza metadati GPS) e stampa il blocco HTML. Si incolla nella `section.series` giusta di `public/index.html`.
4. Si scrivono i testi `alt` (cosa si vede, in una frase) e le didascalie dal documento di Claudia.
5. `bash scripts/check-repo.sh`, poi commit.

Le foto passano dal computer di Anthony (Google Drive per desktop o scaricamento dalla cartella), non dalla chat: i file pesano troppo.

## 3. Pubblicazione
- Un push su `main` fa partire Workers Builds su Cloudflare, che esegue `npx wrangler deploy` e aggiorna il sito in circa un minuto.
- Il collegamento si crea una volta sola nel pannello Cloudflare: Workers & Pages → Create → Import a repository → `anthonyfesce/collab_claudiamazza`, branch `main`, build command vuoto, deploy command `npx wrangler deploy`. Il nome del Worker deve essere uguale a `name` in `wrangler.jsonc`.
- Il dominio si collega al Worker da Settings → Domains & Routes (sia senza www sia con www).
- Ogni branch diverso da `main` ottiene un indirizzo di anteprima: serve per mostrare i lavori a Claudia prima del lancio.

## 4. Provare in locale
```bash
npx wrangler dev        # serve public/ su http://localhost:8787
```

## 5. Quando la repository diventa privata
GitHub → Settings → General → Danger Zone → Change visibility. Prima: controllare che la cronologia non contenga niente di sensibile (`git log -p | grep -i password`). Cloudflare mantiene il collegamento.

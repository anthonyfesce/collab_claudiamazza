# Decisioni e domande aperte

Aggiornato il 30 ottobre 2026.

## Decisioni prese
- **Sito di una sola pagina** (Lavori, Chi sono, Contatti) con ancore. Più pagine solo se Claudia ha molte serie.
- **Statico, senza build** per la base di partenza: HTML, CSS, JS a mano. Si modifica in fretta, si pubblica da solo, nessuna dipendenza che si rompe. Non è un vincolo: Anthony ha detto che si può usare uno stack più avanzato (come per anotherperspective.ai) se il costo in token è contenuto. Candidato: Astro (resta un sito statico su Cloudflare, ottimizza le foto da solo, permette transizioni e animazioni di scroll). Si decide dopo le reference di Claudia, spostando `public/` in componenti senza perdere nulla.
- **Galleria a righe giustificate** in CSS puro, senza ritagliare le foto, con ingrandimento a schermo intero (`<dialog>`, tastiera e telefono).
- **Foto**: WebP a più larghezze generate da `tools/optimize-images.mjs`; originali solo su Drive.
- **Contatto**: email diretta (mailto) e link ai social. Nessun modulo, quindi nessun servizio esterno né dati raccolti.
- **Nessun cookie**: niente banner. Statistiche, se servono, con Cloudflare Web Analytics.
- **Look neutro provvisorio** (carta calda, nero, carattere con grazie per i titoli) finché non arrivano le reference.
- **noindex** attivo fino al lancio.

## Domande aperte per Anthony
1. ~~Lingua~~ Deciso da Anthony il 30 ottobre 2026: solo italiano.
2. Che tipo di fotografia fa Claudia (ritratto, reportage, matrimoni, fine art, commerciale)? Cambia l'ordine delle sezioni e cosa si mette in primo piano.
3. Il sito deve solo mostrare i lavori e farla contattare, o anche vendere stampe / prenotare servizi?
4. Dominio: scelta e nome Worker (`claudiamazza-site` provvisorio).
5. Claudia ha partita IVA? Se sì, servono ragione sociale, P.IVA e indirizzo in fondo al sito.

## Reference estetiche
Claudia ha indicato (1 novembre 2026, Scheda 2 di "References Claude") un sito Awwwards: [Beauty Creative Team Bibibi](https://www.awwwards.com/sites/beauty-creative-team-bibibi-web-site). Da quello che ha scritto le piace: scritta minimale ma con carattere in prima pagina, poche parole e molte immagini, ogni galleria con una copertina d'impatto e un titolo, tutto simmetrico e facile da scorrere. Il sito non è raggiungibile dalla sessione di Claude (rete), quindi l'impaginazione parte dalla sua descrizione e non da una copia del sito.

Impaginazione attuale (provvisoria, con immagini di prova):
- Prima pagina: immagine a tutto schermo e nome in Cormorant Garamond (peso 300, "Mazza" in corsivo).
- Lavori: griglia 2x2 simmetrica di copertine 4:5 con titolo; ogni copertina apre la serie a tutto schermo (`:target`, funziona anche senza JavaScript, link condivisibili `#serie-1`).
- Dentro la serie: righe di foto senza ritagli, foto grande con frecce da tastiera.
- Sezioni Chi sono, Servizi (di cosa mi occupo / come lavoro / cosa non faccio) e Contatti.
- Carattere: Cormorant Garamond (licenza OFL, ospitato in `public/fonts/`, niente Google Fonts per evitare problemi di privacy).

Le immagini di prova stanno in `public/images/demo/` e sono generate da `tools/make-demo-images.mjs`: non sono fotografie, vanno cancellate quando arrivano quelle di Claudia.

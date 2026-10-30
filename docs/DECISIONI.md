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
1. Il sito è solo in italiano o anche in inglese?
2. Che tipo di fotografia fa Claudia (ritratto, reportage, matrimoni, fine art, commerciale)? Cambia l'ordine delle sezioni e cosa si mette in primo piano.
3. Il sito deve solo mostrare i lavori e farla contattare, o anche vendere stampe / prenotare servizi?
4. Dominio: scelta e nome Worker (`claudiamazza-site` provvisorio).
5. Claudia ha partita IVA? Se sì, servono ragione sociale, P.IVA e indirizzo in fondo al sito.

## Reference estetiche
Nessuna ancora in `References Siti Internet`. Le proposte di Claude, quando approvate da Anthony, vanno nel documento "References Claude" nella stessa cartella.

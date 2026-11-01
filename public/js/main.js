// Miglioramenti senza i quali il sito funziona comunque: le serie si aprono con i link (#serie-N)
// e le foto grandi si aprono come immagine. Qui si aggiungono tastiera, fuoco e foto ingrandita.
(() => {
  // Serie aperta: sposta il fuoco dentro, chiudi con Esc, ripristina il fuoco sulla copertina
  let lastCover = null;
  document.addEventListener('click', (e) => {
    const c = e.target.closest('a.cover');
    if (c) lastCover = c;
  });
  const syncFocus = () => {
    const open = document.querySelector('.series-view:target');
    if (open) {
      open.scrollTop = 0;
      open.focus({ preventScroll: true });
    } else if (lastCover) {
      lastCover.focus({ preventScroll: true });
      lastCover = null;
    }
  };
  window.addEventListener('hashchange', syncFocus);
  syncFocus();
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('lightbox')?.open && document.querySelector('.series-view:target')) {
      location.hash = '#lavori';
    }
  });

  // Foto ingrandita
  const dialog = document.getElementById('lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const img = dialog.querySelector('img');
  const caption = dialog.querySelector('.lb-caption');
  let links = [];
  let index = 0;

  const show = (i) => {
    index = (i + links.length) % links.length;
    const link = links[index];
    const thumb = link.querySelector('img');
    img.src = link.href;
    img.alt = thumb ? thumb.alt : '';
    caption.textContent = link.dataset.caption || '';
  };

  document.addEventListener('click', (e) => {
    const link = e.target.closest('.photo a');
    if (!link) return;
    e.preventDefault();
    links = [...link.closest('.gallery').querySelectorAll('.photo a')];
    show(links.indexOf(link));
    dialog.showModal();
  });

  dialog.querySelector('.lb-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
  dialog.querySelector('.lb-next').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  dialog.addEventListener('close', () => { img.removeAttribute('src'); });
})();

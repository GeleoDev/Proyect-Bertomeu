/* Inicio: texto que se reescribe, video, buscador, destacadas y carrusel de reseñas */
(function () {
  const reduce = BP.reduceMotion();

  /* ---------- Texto que se reescribe ---------- */
  const typedEl = document.getElementById('typed');
  const phrases = ['comprar tu casa', 'vender tu propiedad', 'alquilar en Zona Oeste', 'tasar tu propiedad', 'encontrar tu lugar'];
  const caret = '<span class="caret" aria-hidden="true"></span>';
  let pi = 0, ci = phrases[0].length, del = false;
  function tick() {
    const p = phrases[pi];
    let wait = 70;
    if (!del) {
      ci++;
      if (ci >= p.length) { ci = p.length; del = true; wait = 2200; }
    } else {
      ci--; wait = 35;
      if (ci <= 0) { ci = 0; del = false; pi = (pi + 1) % phrases.length; wait = 400; }
    }
    typedEl.innerHTML = BP.esc(p.slice(0, ci)) + caret;
    setTimeout(tick, wait);
  }
  if (typedEl && !reduce) setTimeout(tick, 2200);

  /* ---------- Video: pausa manual y respeto a "reducir movimiento" ---------- */
  const video = document.getElementById('hero-video');
  const vBtn = document.getElementById('video-toggle');
  function setVideo(play) {
    if (!video) return;
    if (play) { const pr = video.play(); if (pr && pr.catch) pr.catch(() => {}); } else video.pause();
    vBtn.innerHTML = '<i class="fa-solid ' + (play ? 'fa-pause' : 'fa-play') + '" aria-hidden="true"></i>';
    vBtn.setAttribute('aria-label', play ? 'Pausar video' : 'Reproducir video');
  }
  if (video) {
    video.muted = true;
    setVideo(!reduce);
    vBtn.addEventListener('click', () => setVideo(video.paused));
  }

  /* ---------- Buscador ---------- */
  const opInput = document.getElementById('search-op');
  document.querySelectorAll('[data-op]').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('[data-op]').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    opInput.value = b.dataset.op;
  }));
  document.querySelector('.search').addEventListener('submit', (e) => {
    /* No mandar parámetros vacíos */
    e.target.querySelectorAll('select').forEach((s) => { s.disabled = !s.value; });
  });

  /* ---------- Destacadas ---------- */
  const grid = document.getElementById('featured');
  const FEATURED = ['libertad', 'ph', 'lima', 'suipacha', 'padua', 'argentina'];
  let all = [];
  function renderFeatured(filter) {
    let list = all.filter((p) => FEATURED.includes(p.id));
    if (!list.length) list = all.slice(0, 6);
    if (filter !== 'todas') list = list.filter((p) => p.op === filter);
    grid.innerHTML = list.map((p) => BP.card(p, false)).join('');
  }
  document.querySelectorAll('[data-feat]').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('[data-feat]').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    renderFeatured(b.dataset.feat);
  }));
  BP.api.getProperties().then((list) => { all = list; renderFeatured('todas'); });

  /* ---------- Carrusel de reseñas ---------- */
  const track = document.getElementById('rv-track');
  const dots = document.getElementById('rv-dots');
  const reviews = BP.RESENAS;
  let index = 0, hover = false;
  const per = () => (window.innerWidth <= 720 ? 1 : window.innerWidth <= 1100 ? 2 : 3);
  const maxIndex = () => Math.max(0, reviews.length - per());
  const stars = '<span class="g-stars" role="img" aria-label="5 de 5 estrellas">' + '<i class="fa-solid fa-star"></i>'.repeat(5) + '</span>';

  track.innerHTML = reviews.map((r, i) => {
    const long = r.text.length > 260;
    return '<article class="rv-card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center">' + stars + '<i class="fa-brands fa-google" aria-hidden="true" style="color:#8A938D"></i></div>' +
      '<p class="rv-text" id="rv-text-' + i + '">' + BP.esc(r.text) + '</p>' +
      (long ? '<button type="button" class="rv-more" data-more="' + i + '" aria-expanded="false" aria-controls="rv-text-' + i + '">Leer completa</button>' : '') +
      '<div class="rv-who"><img src="assets/resenas/' + BP.esc(r.img) + '" alt="" width="46" height="46" loading="lazy"><span><strong>' + BP.esc(r.name) + '</strong><span class="muted small">' + BP.esc(r.meta) + '</span></span></div>' +
      '</article>';
  }).join('');

  function go(i, wrap) {
    const m = maxIndex();
    if (i > m) i = wrap ? 0 : m;
    if (i < 0) i = wrap ? m : 0;
    index = i;
    const card = track.children[0];
    const step = card ? card.getBoundingClientRect().width + 20 : 0;
    track.style.transform = 'translateX(' + (-index * step) + 'px)';
    renderDots();
  }
  function renderDots() {
    const m = maxIndex();
    dots.innerHTML = Array.from({ length: m + 1 }, (_, i) =>
      '<button type="button" class="rv-dot' + (i === index ? ' is-on' : '') + '" data-dot="' + i + '" aria-label="Ir a la opinión ' + (i + 1) + '"' + (i === index ? ' aria-current="true"' : '') + '></button>').join('');
  }
  dots.addEventListener('click', (e) => { const d = e.target.closest('[data-dot]'); if (d) go(Number(d.dataset.dot), false); });
  document.getElementById('rv-prev').addEventListener('click', () => go(index - 1, true));
  document.getElementById('rv-next').addEventListener('click', () => go(index + 1, true));
  track.addEventListener('click', (e) => {
    const b = e.target.closest('[data-more]');
    if (!b) return;
    const p = document.getElementById('rv-text-' + b.dataset.more);
    const open = p.classList.toggle('open');
    b.textContent = open ? 'Leer menos' : 'Leer completa';
    b.setAttribute('aria-expanded', open);
  });
  const section = document.getElementById('resenas');
  section.addEventListener('mouseenter', () => { hover = true; });
  section.addEventListener('mouseleave', () => { hover = false; });
  section.addEventListener('focusin', () => { hover = true; });
  section.addEventListener('focusout', () => { hover = false; });
  window.addEventListener('resize', () => go(Math.min(index, maxIndex()), false));
  go(0, false);
  if (!reduce) setInterval(() => { if (!hover && !track.querySelector('.rv-text.open')) go(index + 1, true); }, 6500);
})();

/* Contacto: motivo, buscador de propiedades con miniaturas y envío del formulario.
   Acepta ?prop=<id> (viene desde la ficha) y ?motivo=<motivo>. */
(function () {
  const $ = (s) => document.querySelector(s);
  const input = $('#prop-input');
  const list = $('#prop-list');
  const picked = $('#picked');
  const combo = $('#combo');
  const msg = $('#msg');
  let ALL = [], matches = [], active = -1, chosen = null, motivo = 'comprar', canal = 'WhatsApp';

  /* Botones de selección única */
  function single(groupSel, attr, set) {
    $(groupSel).addEventListener('click', (e) => {
      const b = e.target.closest('[data-' + attr + ']');
      if (!b) return;
      $(groupSel).querySelectorAll('button').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
      set(b.dataset[attr]);
    });
  }
  single('#motivos', 'motivo', (v) => { motivo = v; });
  single('#canales', 'canal', (v) => { canal = v; });

  const optHTML = (p, i) => {
    const specs = [p.m2 + ' m²'];
    if (p.amb) specs.push(p.amb + ' amb.');
    if (p.dorm) specs.push(p.dorm + ' dorm.');
    return '<button type="button" class="popt' + (i === active ? ' is-active' : '') + '" role="option" id="opt-' + i + '" aria-selected="' + (i === active) + '" data-i="' + i + '">' +
      '<img src="' + BP.esc(BP.img(p)) + '" alt="">' +
      '<span style="min-width:0"><span class="opt-title">' + BP.esc(p.title) + '</span><span class="opt-addr">' + BP.esc(p.addr + ', ' + p.zone) + '</span>' +
      '<span class="opt-specs">' + specs.map((s) => '<span>' + s + '</span>').join('') + '</span></span>' +
      '<span class="opt-price"><span class="opt-badge ' + p.op + '">' + (p.op === 'venta' ? 'Venta' : 'Alquiler') + '</span><span class="price">' + BP.priceHTML(p, true) + '</span></span></button>';
  };

  function open(show) {
    list.hidden = !show;
    input.setAttribute('aria-expanded', show);
  }
  function renderList() {
    const q = input.value.trim().toLowerCase();
    matches = ALL.filter((p) => !q || (p.title + ' ' + p.addr + ' ' + p.zone + ' ' + p.type + ' ' + p.ref).toLowerCase().includes(q));
    if (active >= matches.length) active = matches.length - 1;
    list.innerHTML = '<div class="combo-head"><span>' + matches.length + (matches.length === 1 ? ' propiedad' : ' propiedades') + '</span><button type="button" class="btn btn-line btn-sm" data-close style="min-height:34px;padding:0 14px;font-size:13px">Cerrar</button></div>' +
      (matches.length ? matches.map(optHTML).join('') : '<p class="muted small" style="padding:16px 10px;margin:0">No encontramos propiedades con “' + BP.esc(input.value) + '”. Contanos qué buscás en el mensaje.</p>');
    input.setAttribute('aria-activedescendant', active >= 0 ? 'opt-' + active : '');
    const el = document.getElementById('opt-' + active);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }
  function choose(p) {
    chosen = p;
    open(false);
    combo.hidden = true;
    picked.hidden = false;
    picked.innerHTML = '<div class="picked"><img src="' + BP.esc(BP.img(p)) + '" alt="">' +
      '<div style="display:flex;flex-direction:column;gap:4px;min-width:0"><span class="ptype">' + BP.esc(p.type) + ' · ' + (p.op === 'venta' ? 'Venta' : 'Alquiler') + '</span>' +
      '<strong style="font-size:16px">' + BP.esc(p.title) + '</strong>' +
      '<span class="paddr"><i class="fa-solid fa-location-dot" aria-hidden="true"></i>' + BP.esc(p.addr + ', ' + p.zone) + '</span>' +
      '<span class="price" style="font-size:21px;margin-top:2px">' + BP.priceHTML(p) + '</span></div>' +
      '<button type="button" class="icon-btn" id="unpick" aria-label="Quitar propiedad"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>';
    msg.value = 'Hola, me interesa la propiedad “' + p.title + '” (' + p.addr + ', cód. ' + p.ref + '). ¿Me pasan más información?';
    $('#unpick').addEventListener('click', () => {
      chosen = null; picked.hidden = true; picked.innerHTML = ''; combo.hidden = false; input.value = ''; msg.value = ''; input.focus();
    });
  }

  input.addEventListener('focus', () => { renderList(); open(true); });
  input.addEventListener('input', () => { active = -1; renderList(); open(true); });
  input.addEventListener('keydown', (e) => {
    if (list.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { renderList(); open(true); }
    if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(matches.length - 1, active + 1); renderList(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(0, active - 1); renderList(); }
    if (e.key === 'Enter' && active >= 0 && !list.hidden) { e.preventDefault(); choose(matches[active]); }
    if (e.key === 'Escape') open(false);
  });
  list.addEventListener('mousedown', (e) => e.preventDefault());
  list.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) return open(false);
    const b = e.target.closest('.popt');
    if (b) choose(matches[Number(b.dataset.i)]);
  });
  document.addEventListener('click', (e) => { if (!combo.contains(e.target)) open(false); });

  /* Envío (en producción, mandarlo a un endpoint, a Tokko o por email) */
  const form = $('#contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = Array.from(form.querySelectorAll('[required]')).find((f) => !f.value.trim());
    if (bad) { $('#c-error').textContent = 'Completá tu nombre y teléfono para que podamos responderte.'; bad.focus(); return; }
    const data = Object.assign(Object.fromEntries(new FormData(form).entries()), { motivo, canal, propiedad: chosen ? chosen.ref : '' });
    console.info('[Bertomeu] Consulta', data);
    const first = (data.nombre || '').trim().split(' ')[0];
    $('#c-success-title').textContent = '¡Gracias' + (first ? ', ' + first : '') + '!';
    $('#c-success-text').textContent = 'Recibimos tu mensaje' + (chosen ? ' sobre “' + chosen.title + '”' : '') + '. Te respondemos por ' + (canal === 'Llamada' ? 'teléfono' : canal) + '.';
    form.hidden = true;
    $('#c-success').hidden = false;
  });
  $('#c-reset').addEventListener('click', () => {
    form.reset(); form.hidden = false; $('#c-success').hidden = true; $('#c-error').textContent = '';
    if (chosen) $('#unpick').click();
  });

  /* Carga + parámetros de la URL */
  const m = BP.param('motivo');
  if (m) { const b = document.querySelector('[data-motivo="' + m + '"]'); if (b) b.click(); }
  BP.api.getProperties().then((all) => {
    ALL = all;
    const id = BP.param('prop');
    const p = id && ALL.find((x) => x.id === id);
    if (p) choose(p);
  });
})();

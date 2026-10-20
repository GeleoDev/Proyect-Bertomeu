/* Listado de propiedades con filtros dinámicos.
   La URL guarda la búsqueda (?op=venta&tipo=Casa&zona=Libertad&amb=3) para poder compartirla. */
(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const TYPES = ['Casa', 'Departamento', 'PH', 'Local', 'Quinta', 'Terreno'];
  const EXTRAS = [
    { k: 'pool', label: 'Pileta', test: (p) => p.pool },
    { k: 'garage', label: 'Cochera', test: (p) => p.garage > 0 },
    { k: 'credit', label: 'Apto crédito', test: (p) => p.credit },
    { k: 'pets', label: 'Acepta mascotas', test: (p) => p.pets }
  ];
  const USD_ARS = 1450; /* solo para ordenar por precio cuando se mezclan monedas */
  const HEADINGS = {
    todas: ['Propiedades', 'Casas, departamentos, locales y terrenos en venta y alquiler en Zona Oeste.'],
    venta: ['Propiedades en venta', 'Casas, departamentos, locales y quintas en Merlo, Moreno y alrededores.'],
    alquiler: ['Propiedades en alquiler', 'Departamentos, PH, casas y locales disponibles en Zona Oeste.']
  };

  const P = new URLSearchParams(location.search);
  const S = {
    op: ['venta', 'alquiler'].includes(P.get('op')) ? P.get('op') : 'todas',
    types: P.get('tipo') ? [P.get('tipo')] : [],
    zones: P.get('zona') ? [P.get('zona')] : [],
    cur: 'USD', min: '', max: '',
    amb: Number(P.get('amb')) || 0, dorm: 0, extras: [],
    q: P.get('q') || '', sort: 'recientes', view: 'grid'
  };
  let ALL = [];

  const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : arr.concat([v]));

  function syncURL() {
    const q = new URLSearchParams();
    if (S.op !== 'todas') q.set('op', S.op);
    if (S.types.length === 1) q.set('tipo', S.types[0]);
    if (S.zones.length === 1) q.set('zona', S.zones[0]);
    if (S.amb) q.set('amb', S.amb);
    if (S.q) q.set('q', S.q);
    history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
  }

  function filtered() {
    const min = S.min === '' ? null : Number(S.min);
    const max = S.max === '' ? null : Number(S.max);
    const q = S.q.trim().toLowerCase();
    let res = ALL.filter((p) => {
      if (S.op !== 'todas' && p.op !== S.op) return false;
      if (S.types.length && !S.types.includes(p.type)) return false;
      if (S.zones.length && !S.zones.includes(p.zone)) return false;
      if (min !== null || max !== null) {
        if (p.cur !== S.cur) return false;
        if (min !== null && p.price < min) return false;
        if (max !== null && p.price > max) return false;
      }
      if (S.amb && (S.amb === 5 ? p.amb < 5 : p.amb !== S.amb)) return false;
      if (S.dorm && (S.dorm === 4 ? p.dorm < 4 : p.dorm !== S.dorm)) return false;
      for (const k of S.extras) { if (!EXTRAS.find((e) => e.k === k).test(p)) return false; }
      if (q && !(p.title + ' ' + p.addr + ' ' + p.ref + ' ' + p.zone).toLowerCase().includes(q)) return false;
      return true;
    });
    const usd = (p) => (p.cur === 'USD' ? p.price : p.price / USD_ARS);
    if (S.sort === 'precio-asc') res.sort((a, b) => usd(a) - usd(b));
    if (S.sort === 'precio-desc') res.sort((a, b) => usd(b) - usd(a));
    if (S.sort === 'sup') res.sort((a, b) => b.m2 - a.m2);
    return res;
  }

  function render() {
    const byOp = ALL.filter((p) => S.op === 'todas' || p.op === S.op);
    const res = filtered();

    /* Encabezado */
    $('#heading').textContent = HEADINGS[S.op][0];
    $('#subheading').textContent = HEADINGS[S.op][1];
    $('#crumb-op').innerHTML = S.op === 'todas' ? '' : '<i class="fa-solid fa-chevron-right" aria-hidden="true" style="margin:0 10px"></i>' + (S.op === 'venta' ? 'Venta' : 'Alquiler');
    document.title = HEADINGS[S.op][0] + ' · Bertomeu Propiedades';
    ['todas', 'venta', 'alquiler'].forEach((k) => {
      $('[data-count="' + k + '"]').textContent = ALL.filter((p) => k === 'todas' || p.op === k).length;
    });
    $$('[data-op-tab]').forEach((b) => { const on = b.dataset.opTab === S.op; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    $$('[data-op-chip]').forEach((b) => { const on = b.dataset.opChip === S.op; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });

    /* Filtros con contadores */
    $('#f-types').innerHTML = TYPES.map((t) => '<button type="button" class="chip' + (S.types.includes(t) ? ' is-on' : '') + '" data-type="' + t + '" aria-pressed="' + S.types.includes(t) + '">' + t + ' <span class="f-n">' + byOp.filter((p) => p.type === t).length + '</span></button>').join('');
    const zones = [...new Set(ALL.map((p) => p.zone))].sort((a, b) => a.localeCompare(b, 'es'));
    $('#f-zones').innerHTML = zones.map((z) => '<label class="check"><input type="checkbox" data-zone="' + BP.esc(z) + '"' + (S.zones.includes(z) ? ' checked' : '') + '><span>' + BP.esc(z) + '</span><span class="f-count">' + byOp.filter((p) => p.zone === z).length + '</span></label>').join('');
    $$('[data-cur]').forEach((b) => { const on = b.dataset.cur === S.cur; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    $('#f-amb').innerHTML = [1, 2, 3, 4, 5].map((n) => '<button type="button" class="pill' + (S.amb === n ? ' is-on' : '') + '" data-amb="' + n + '" aria-pressed="' + (S.amb === n) + '">' + (n === 5 ? '5+' : n) + '</button>').join('');
    $('#f-dorm').innerHTML = [1, 2, 3, 4].map((n) => '<button type="button" class="pill' + (S.dorm === n ? ' is-on' : '') + '" data-dorm="' + n + '" aria-pressed="' + (S.dorm === n) + '">' + (n === 4 ? '4+' : n) + '</button>').join('');
    $('#f-extras').innerHTML = EXTRAS.map((x) => '<label class="check"><input type="checkbox" data-extra="' + x.k + '"' + (S.extras.includes(x.k) ? ' checked' : '') + '><span>' + x.label + '</span></label>').join('');

    /* Chips de filtros activos */
    const chips = [];
    if (S.op !== 'todas') chips.push(['op', S.op === 'venta' ? 'Venta' : 'Alquiler']);
    S.types.forEach((t) => chips.push(['type:' + t, t]));
    S.zones.forEach((z) => chips.push(['zone:' + z, z]));
    if (S.min !== '' || S.max !== '') chips.push(['price', (S.cur === 'USD' ? 'USD ' : '$ ') + (S.min !== '' ? BP.fmt(S.min) : '0') + ' – ' + (S.max !== '' ? BP.fmt(S.max) : 'sin tope')]);
    if (S.amb) chips.push(['amb', (S.amb === 5 ? '5+' : S.amb) + ' amb.']);
    if (S.dorm) chips.push(['dorm', (S.dorm === 4 ? '4+' : S.dorm) + ' dorm.']);
    S.extras.forEach((k) => chips.push(['extra:' + k, EXTRAS.find((e) => e.k === k).label]));
    if (S.q) chips.push(['q', '“' + S.q + '”']);
    $('#active-chips').innerHTML = chips.length ? chips.map((c) => '<button type="button" class="chip chip-x" data-remove="' + BP.esc(c[0]) + '">' + BP.esc(c[1]) + ' <i class="fa-solid fa-xmark" aria-hidden="true"></i></button>').join('') + '<button type="button" class="text-btn" data-clear>Limpiar todo</button>' : '';
    $('#active-count').textContent = chips.length ? '(' + chips.length + ')' : '';

    /* Resultados */
    $$('[data-total]').forEach((el) => { el.textContent = res.length; });
    $('#total-label').textContent = res.length === 1 ? 'propiedad' : 'propiedades';
    $('#results').className = 'rgrid' + (S.view === 'list' ? ' list' : '');
    $('#results').innerHTML = res.map((p) => BP.card(p, true)).join('');
    $('#results').hidden = !res.length;
    $('#empty').hidden = !!res.length;
    syncURL();
  }

  /* ---------- Eventos ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.dataset.opTab) { S.op = t.dataset.opTab; render(); }
    else if (t.dataset.opChip) { S.op = S.op === t.dataset.opChip ? 'todas' : t.dataset.opChip; render(); }
    else if (t.dataset.type) { S.types = toggle(S.types, t.dataset.type); render(); }
    else if (t.dataset.cur) { S.cur = t.dataset.cur; render(); }
    else if (t.dataset.amb) { const n = Number(t.dataset.amb); S.amb = S.amb === n ? 0 : n; render(); }
    else if (t.dataset.dorm) { const n = Number(t.dataset.dorm); S.dorm = S.dorm === n ? 0 : n; render(); }
    else if (t.dataset.view) {
      S.view = t.dataset.view;
      $$('[data-view]').forEach((b) => { const on = b === t; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
      render();
    }
    else if (t.hasAttribute('data-clear')) {
      Object.assign(S, { op: 'todas', types: [], zones: [], min: '', max: '', amb: 0, dorm: 0, extras: [], q: '' });
      $('#f-min').value = ''; $('#f-max').value = ''; $('#f-q').value = '';
      render();
    }
    else if (t.dataset.remove) {
      const [k, v] = t.dataset.remove.split(/:(.*)/);
      if (k === 'op') S.op = 'todas';
      if (k === 'type') S.types = toggle(S.types, v);
      if (k === 'zone') S.zones = toggle(S.zones, v);
      if (k === 'price') { S.min = ''; S.max = ''; $('#f-min').value = ''; $('#f-max').value = ''; }
      if (k === 'amb') S.amb = 0;
      if (k === 'dorm') S.dorm = 0;
      if (k === 'extra') S.extras = toggle(S.extras, v);
      if (k === 'q') { S.q = ''; $('#f-q').value = ''; }
      render();
    }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset.zone) { S.zones = toggle(S.zones, t.dataset.zone); render(); }
    if (t.dataset.extra) { S.extras = toggle(S.extras, t.dataset.extra); render(); }
    if (t.id === 'sort') { S.sort = t.value; render(); }
  });
  let qTimer;
  $('#f-q').addEventListener('input', (e) => { clearTimeout(qTimer); qTimer = setTimeout(() => { S.q = e.target.value; render(); }, 200); });
  $('#f-min').addEventListener('input', (e) => { S.min = e.target.value; render(); });
  $('#f-max').addEventListener('input', (e) => { S.max = e.target.value; render(); });

  /* Panel de filtros en celular */
  const panel = $('#filters');
  const openBtn = $('#open-filters');
  const setPanel = (open) => {
    panel.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) $('#close-filters').focus(); else openBtn.focus();
  };
  openBtn.addEventListener('click', () => setPanel(true));
  $('#close-filters').addEventListener('click', () => setPanel(false));
  $('#apply-filters').addEventListener('click', () => setPanel(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panel.classList.contains('is-open')) setPanel(false); });

  $('#f-q').value = S.q;
  BP.api.getProperties().then((list) => { ALL = list; render(); });
})();

/* Ficha de propiedad: se arma a partir de ?id= */
(function () {
  const $ = (s) => document.querySelector(s);
  const WA = 'https://api.whatsapp.com/send?phone=5491152267955&text=';
  let P = null, idx = 0, slot = 'mañana', day = 0;

  function li(items) { return items.map((t) => '<li><i class="fa-solid fa-check" aria-hidden="true"></i>' + BP.esc(t) + '</li>').join(''); }

  function renderGallery() {
    const imgs = P.imgs.map((_, i) => BP.img(P, i));
    const total = Math.max(P.photos || 0, imgs.length);
    const thumbs = [1, 2, 3, 4].filter((i) => imgs[i]);
    $('#gallery').innerHTML =
      '<div class="g-main"><img id="g-main-img" src="' + BP.esc(imgs[idx]) + '" alt="Foto ' + (idx + 1) + ' de ' + BP.esc(P.title) + '">' +
      '<span class="g-counter">' + (idx + 1) + ' / ' + total + '</span>' +
      '<div class="g-nav"><button type="button" class="icon-btn" data-g="prev" aria-label="Foto anterior"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button><button type="button" class="icon-btn" data-g="next" aria-label="Foto siguiente"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button><button type="button" class="icon-btn" data-g="zoom" aria-label="Ver fotos en grande"><i class="fa-solid fa-expand" aria-hidden="true"></i></button></div></div>' +
      thumbs.map((i, k) => '<button type="button" class="g-thumb' + (i === idx ? ' is-on' : '') + '"' + (thumbs.length === 2 ? ' style="grid-row:span 2"' : thumbs.length === 1 ? ' style="grid-column:span 2;grid-row:span 2"' : thumbs.length === 3 && k === 2 ? ' style="grid-column:span 2"' : '') + ' data-thumb="' + i + '" aria-label="Ver foto ' + (i + 1) + '"><img src="' + BP.esc(imgs[i]) + '" alt="" loading="lazy">' +
        (k === thumbs.length - 1 && total > 5 ? '<span class="g-more"><strong>+' + (total - 5) + '</strong>Ver todas</span>' : '') + '</button>').join('');
  }

  function nextDays() {
    const out = [], names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], long = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const d = new Date();
    while (out.length < 5) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) out.push({ dow: names[d.getDay()], n: d.getDate(), label: long[d.getDay()] + ' ' + d.getDate() });
    }
    return out;
  }
  const DAYS = nextDays();
  function renderDays() {
    $('#days').innerHTML = DAYS.map((d, i) => '<button type="button" class="day' + (i === day ? ' is-on' : '') + '" data-day="' + i + '" aria-pressed="' + (i === day) + '"><span>' + d.dow + '</span><strong>' + d.n + '</strong></button>').join('');
  }

  function render() {
    const opName = P.op === 'venta' ? 'Venta' : 'Alquiler';
    document.title = P.title + ' · Bertomeu Propiedades';
    $('#crumb-op').textContent = opName;
    $('#crumb-op').href = 'propiedades.html?op=' + P.op;
    $('#crumb-title').textContent = P.type + ' en ' + P.zone;
    $('#p-tags').innerHTML = '<span class="tag" style="background:#173B29;color:#fff">' + opName + '</span><span class="tag tag-sand">' + BP.esc(P.type) + '</span>' + (P.condicion ? '<span class="tag">Estado: ' + BP.esc(P.condicion.toLowerCase()) + '</span>' : '');
    $('#p-title').textContent = P.title;
    $('#p-addr').textContent = P.addr + ' · ' + P.zone + (P.partido && P.partido !== P.zone ? ', ' + P.partido : '');
    renderGallery();

    const kf = [['fa-ruler-combined', P.m2 + ' m²', 'Totales']];
    if (P.cubierta && P.cubierta !== P.m2) kf.push(['fa-house', P.cubierta + ' m²', 'Cubiertos']);
    if (P.amb) kf.push(['fa-door-closed', P.amb, 'Ambientes']);
    if (P.dorm) kf.push(['fa-bed', P.dorm, 'Dormitorios']);
    if (P.baths) kf.push(['fa-bath', P.baths, P.baths === 1 ? 'Baño' : 'Baños']);
    if (P.garage) kf.push(['fa-car', P.garage, P.garage === 1 ? 'Cochera' : 'Cocheras']);
    $('#keyfacts').innerHTML = kf.map((k) => '<div class="kf"><i class="fa-solid ' + k[0] + '" aria-hidden="true"></i><strong>' + k[1] + '</strong><span>' + k[2] + '</span></div>').join('');

    const desc = P.descripcion || [];
    $('#desc').innerHTML = desc.map((p, i) => '<p class="desc"' + (i > 0 ? ' data-extra hidden' : '') + '>' + BP.esc(p) + '</p>').join('');
    $('#desc-toggle').hidden = desc.length < 2;

    const cols = [['Servicios', P.servicios, '#E1F2E5'], ['Ambientes', P.ambientes, '#F2EADD'], ['Adicionales', P.adicionales, '#F8E7DA']].filter((c) => c[1] && c[1].length);
    $('#features').innerHTML = cols.map((c) => '<div class="feat-col" style="background:' + c[2] + '"><h3 class="h-s">' + c[0] + '</h3><ul>' + li(c[1]) + '</ul></div>').join('');

    const rows = [['Superficie total', P.m2 + ' m²'], ['Cubierta', P.cubierta ? P.cubierta + ' m²' : ''], ['Terreno', P.terreno ? P.terreno + ' m²' : ''], ['Frente × fondo', P.frenteFondo], ['Plantas', P.plantas], ['Antigüedad', P.antiguedad], ['Condición', P.condicion], ['Apto crédito', P.credit ? 'Sí' : 'No especificado'], ['Código', P.ref]].filter((r) => r[1]);
    $('#specs').innerHTML = rows.map((r) => '<div class="spec-row"><dt>' + r[0] + '</dt><dd>' + BP.esc(r[1]) + '</dd></div>').join('');

    const q = encodeURIComponent((P.lat && P.lng) ? P.lat + ',' + P.lng : P.addr + ', ' + P.zone + ', Buenos Aires, Argentina');
    $('#map').innerHTML = '<iframe title="Mapa de ' + BP.esc(P.addr) + '" src="https://maps.google.com/maps?q=' + q + '&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

    $('#price-label').textContent = P.op === 'venta' ? 'Precio de venta' : 'Alquiler mensual';
    $('#p-ref').textContent = 'Cód. ' + P.ref;
    $('#p-price').innerHTML = BP.priceHTML(P, true);
    if (P.expensas) { $('#p-exp').hidden = false; $('#p-exp').textContent = '+ $ ' + BP.fmt(P.expensas) + ' de expensas'; }
    $('#wa-link').href = WA + encodeURIComponent('Hola, me interesa la propiedad de ' + P.addr + ' (cód. ' + P.ref + ').');
    $('#contact-link').href = 'contacto.html?prop=' + encodeURIComponent(P.id);
    $('#visit-msg').value = 'Hola, me interesa la propiedad de ' + P.addr + ' y quisiera coordinar una visita.';
    const fav = BP.favs.has(P.id);
    $('#fav').setAttribute('aria-pressed', fav);
    $('#fav').innerHTML = '<i class="' + (fav ? 'fa-solid' : 'fa-regular') + ' fa-heart" aria-hidden="true"' + (fav ? ' style="color:#D9534F"' : '') + '></i>';
    renderDays();
  }

  /* Galería y lightbox */
  const lb = $('#lightbox');
  function show(i) {
    idx = (i + P.imgs.length) % P.imgs.length;
    renderGallery();
    if (lb.classList.contains('open')) $('#lb-img').src = BP.img(P, idx);
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || !P) return;
    if (b.dataset.thumb) show(Number(b.dataset.thumb));
    if (b.dataset.g === 'prev') show(idx - 1);
    if (b.dataset.g === 'next') show(idx + 1);
    if (b.dataset.g === 'zoom' || (b.dataset.thumb && b.querySelector('.g-more'))) { $('#lb-img').src = BP.img(P, idx); $('#lb-img').alt = 'Foto ' + (idx + 1) + ' de ' + P.title; lb.classList.add('open'); $('#lb-close').focus(); }
    if (b.dataset.day) { day = Number(b.dataset.day); renderDays(); }
    if (b.dataset.slot) { slot = b.dataset.slot; document.querySelectorAll('[data-slot]').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); }); }
  });
  $('#lb-close').addEventListener('click', () => lb.classList.remove('open'));
  $('#lb-prev').addEventListener('click', () => show(idx - 1));
  $('#lb-next').addEventListener('click', () => show(idx + 1));
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowRight') show(idx + 1);
    if (e.key === 'ArrowLeft') show(idx - 1);
  });

  $('#desc-toggle').addEventListener('click', (e) => {
    const extra = document.querySelectorAll('#desc [data-extra]');
    const open = extra.length && extra[0].hidden;
    extra.forEach((p) => { p.hidden = !open; });
    e.currentTarget.textContent = open ? 'Leer menos' : 'Leer descripción completa';
  });

  $('#fav').addEventListener('click', () => { BP.favs.toggle(P.id); render(); });
  $('#print').addEventListener('click', () => window.print());
  $('#share').addEventListener('click', async () => {
    const data = { title: P.title, text: P.title + ' · Bertomeu Propiedades', url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(location.href); $('#share').setAttribute('aria-label', 'Enlace copiado'); }
    } catch (e) {}
  });

  /* Pedido de visita (en producción, enviar a un endpoint o al CRM) */
  $('#visit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    $('#visit-form').hidden = true;
    $('#visit-ok').hidden = false;
    $('#visit-ok-text').textContent = 'Pediste el ' + DAYS[day].label + ' por la ' + slot + '. Te confirmamos el horario por WhatsApp.';
  });
  $('#visit-reset').addEventListener('click', () => { $('#visit-form').hidden = false; $('#visit-ok').hidden = true; });

  /* Carga */
  const id = BP.param('id') || 'libertad';
  Promise.all([BP.api.getProperty(id), BP.api.getProperties()]).then(([prop, all]) => {
    P = prop;
    render();
    const sim = all.filter((p) => p.id !== P.id && p.op === P.op).slice(0, 3);
    $('#similar-title').textContent = P.op === 'venta' ? 'Otras propiedades en venta' : 'Otras propiedades en alquiler';
    $('#similar-link').href = 'propiedades.html?op=' + P.op;
    $('#similar').innerHTML = sim.map((p) => BP.card(p, false)).join('');
  });
})();

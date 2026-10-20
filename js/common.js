/*
 * Funciones compartidas: navbar, footer, botón de WhatsApp y tarjetas de propiedad.
 * Cada página tiene <div id="site-nav"> y <div id="site-footer">, y en <body>
 * el atributo data-page con la sección activa (inicio, nosotros, propiedades, tasacion, contacto).
 */
window.BP = window.BP || {};

(function () {
  const WA = 'https://api.whatsapp.com/send?phone=5491152267955';

  BP.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  BP.fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  BP.img = (p, i) => {
    const name = p.imgs[i || 0];
    return p.imgIsUrl ? name : 'assets/img/' + name + '.jpg';
  };
  BP.priceHTML = (p, big) => {
    const cur = p.cur === 'USD' ? 'USD' : '$';
    const per = p.op === 'alquiler' ? '<small style="margin-left:6px">/ mes</small>' : '';
    return '<small>' + cur + '</small>' + BP.fmt(p.price) + (big ? '' : per);
  };
  BP.reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  BP.param = (k) => new URLSearchParams(location.search).get(k);

  BP.specs = (p, max) => {
    const s = ['<span><i class="fa-solid fa-ruler-combined" aria-hidden="true"></i>' + p.m2 + ' m²</span>'];
    if (p.amb) s.push('<span><i class="fa-solid fa-door-closed" aria-hidden="true"></i>' + p.amb + ' amb.</span>');
    if (p.dorm) s.push('<span><i class="fa-solid fa-bed" aria-hidden="true"></i>' + p.dorm + ' dorm.</span>');
    if (p.baths) s.push('<span><i class="fa-solid fa-bath" aria-hidden="true"></i>' + p.baths + (p.baths === 1 ? ' baño' : ' baños') + '</span>');
    if (p.garage) s.push('<span><i class="fa-solid fa-car" aria-hidden="true"></i>' + p.garage + ' coch.</span>');
    return s.slice(0, max || 4).join('');
  };

  /* Tarjeta de propiedad. withFav agrega el botón de favoritos. */
  BP.card = (p, withFav) => {
    const fav = withFav ? '<button type="button" class="fav' + (BP.favs.has(p.id) ? ' is-on' : '') + '" data-fav="' + BP.esc(p.id) + '" aria-label="Guardar en favoritos" aria-pressed="' + BP.favs.has(p.id) + '"><i class="' + (BP.favs.has(p.id) ? 'fa-solid' : 'fa-regular') + ' fa-heart" aria-hidden="true"></i></button>' : '';
    return '<article class="pcard">' +
      '<a href="propiedad.html?id=' + encodeURIComponent(p.id) + '">' +
        '<div class="pcard-media"><img src="' + BP.esc(BP.img(p)) + '" alt="' + BP.esc(p.shortTitle || p.title) + '" loading="lazy">' +
        '<span class="badge ' + (p.op === 'venta' ? 'badge-venta' : 'badge-alquiler') + '">' + (p.op === 'venta' ? 'Venta' : 'Alquiler') + '</span></div>' +
        '<div class="pcard-body"><span class="ptype">' + BP.esc(p.type) + ' · ' + BP.esc(p.zone) + '</span>' +
        '<div class="price">' + BP.priceHTML(p) + '</div>' +
        '<h3 class="ptitle">' + BP.esc(p.shortTitle || p.title) + '</h3>' +
        '<div class="paddr"><i class="fa-solid fa-location-dot" aria-hidden="true"></i>' + BP.esc(p.addr) + '</div>' +
        '<div class="pspecs">' + BP.specs(p) + '</div></div>' +
      '</a>' + fav + '</article>';
  };

  /* Favoritos guardados en el navegador del visitante */
  BP.favs = (function () {
    let set = new Set();
    try { set = new Set(JSON.parse(localStorage.getItem('bp_favs') || '[]')); } catch (e) {}
    const save = () => { try { localStorage.setItem('bp_favs', JSON.stringify([...set])); } catch (e) {} };
    return {
      has: (id) => set.has(id),
      toggle: (id) => { set.has(id) ? set.delete(id) : set.add(id); save(); return set.has(id); },
      size: () => set.size
    };
  })();

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    e.preventDefault();
    const on = BP.favs.toggle(b.dataset.fav);
    b.classList.toggle('is-on', on);
    b.setAttribute('aria-pressed', on);
    b.innerHTML = '<i class="' + (on ? 'fa-solid' : 'fa-regular') + ' fa-heart" aria-hidden="true"></i>';
  });

  /* ---------- Navbar ---------- */
  function navHTML(active) {
    const c = (k) => 'nav-link' + (k === active ? ' is-active' : '');
    return '<nav class="nav" aria-label="Principal"><div class="container"><div class="nav-pill">' +
      '<a class="nav-logo" href="index.html" aria-label="Bertomeu Propiedades, inicio"><img src="assets/img/logo.png" alt="Bertomeu Propiedades"></a>' +
      '<ul class="nav-links">' +
        '<li><a class="' + c('inicio') + '" href="index.html">Inicio</a></li>' +
        '<li><a class="' + c('nosotros') + '" href="nosotros.html">Nosotros</a></li>' +
        '<li class="nav-item"><a class="' + c('propiedades') + '" href="propiedades.html">Propiedades <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></a>' +
          '<div class="dropdown"><div class="dropdown-panel">' +
            '<a class="dd-item" href="propiedades.html?op=venta"><span class="dd-icon"><i class="fa-solid fa-house" aria-hidden="true"></i></span><span><span class="dd-title">En venta</span><span class="dd-desc">Casas, departamentos, locales y terrenos.</span></span></a>' +
            '<a class="dd-item sand" href="propiedades.html?op=alquiler"><span class="dd-icon"><i class="fa-solid fa-key" aria-hidden="true"></i></span><span><span class="dd-title">En alquiler</span><span class="dd-desc">Departamentos, PH, casas y locales.</span></span></a>' +
            '<div class="dd-foot"><a class="link" href="propiedades.html">Ver todas las propiedades <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></div>' +
          '</div></div></li>' +
        '<li><a class="' + c('tasacion') + '" href="tasacion.html">Tasaciones</a></li>' +
        '<li><a class="' + c('contacto') + '" href="contacto.html">Contacto</a></li>' +
      '</ul>' +
      '<div class="nav-actions">' +
        '<a class="icon-btn" href="' + WA + '" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp" style="background:#E1F2E5;color:#156B37"><i class="fa-brands fa-whatsapp" aria-hidden="true" style="font-size:18px"></i></a>' +
        '<a class="btn btn-primary btn-sm nav-cta" href="tasacion.html">Tasar mi propiedad</a>' +
        '<button class="icon-btn nav-burger" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav-mobile"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>' +
      '</div></div>' +
      '<div class="nav-mobile" id="nav-mobile">' +
        '<a href="index.html">Inicio <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>' +
        '<a href="nosotros.html">Nosotros <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>' +
        '<a href="propiedades.html">Propiedades <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>' +
        '<a class="sub" href="propiedades.html?op=venta">En venta</a>' +
        '<a class="sub" href="propiedades.html?op=alquiler">En alquiler</a>' +
        '<a href="tasacion.html">Tasaciones <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>' +
        '<a href="contacto.html">Contacto <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></a>' +
        '<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">' +
          '<a class="btn btn-primary" href="tasacion.html" style="flex:1 1 200px">Tasar mi propiedad</a>' +
          '<a class="btn btn-forest" href="' + WA + '" target="_blank" rel="noopener" style="flex:1 1 200px"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i>WhatsApp</a>' +
        '</div></div>' +
      '</div></nav>';
  }

  /* ---------- Footer ---------- */
  function footerHTML() {
    return '<footer class="footer on-dark"><div class="container">' +
      '<div class="footer-top"><div style="display:flex;flex-direction:column;gap:14px;max-width:640px">' +
        '<h2 class="h-xl">¿Hablamos?</h2><p class="lead">Escribinos por WhatsApp, llamanos o pasá por la oficina de Maipú 785, en Merlo.</p></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-primary" href="' + WA + '&text=Hola%2C%20quisiera%20hacer%20una%20consulta" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i>Escribir por WhatsApp</a><a class="btn btn-glass" href="contacto.html">Ir a contacto</a></div></div>' +
      '<div class="footer-cols">' +
        '<div style="display:flex;flex-direction:column;gap:20px"><img src="assets/img/logo-white.png" alt="Bertomeu Propiedades" style="height:60px;width:auto;align-self:flex-start">' +
          '<p style="margin:0;color:#C9D9CE;font-size:15px;max-width:320px">Inmobiliaria en Merlo. Venta, alquiler, tasaciones y administración de propiedades en Zona Oeste.</p>' +
          '<div style="display:flex;gap:8px"><a class="social" href="https://www.instagram.com/bertomeuprop/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a><a class="social" href="https://www.facebook.com/bertomeupropiedades" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i></a><a class="social" href="https://www.youtube.com/@bertomeupropiedades8187" target="_blank" rel="noopener" aria-label="YouTube"><i class="fa-brands fa-youtube" aria-hidden="true"></i></a></div></div>' +
        '<div><h3 class="footer-h">Secciones</h3><ul class="footer-list"><li><a href="index.html">Inicio</a></li><li><a href="nosotros.html">Nosotros</a></li><li><a href="propiedades.html">Propiedades</a></li><li><a href="tasacion.html">Tasaciones</a></li><li><a href="contacto.html">Contacto</a></li></ul></div>' +
        '<div><h3 class="footer-h">Propiedades</h3><ul class="footer-list"><li><a href="propiedades.html?op=venta">En venta</a></li><li><a href="propiedades.html?op=alquiler">En alquiler</a></li><li><a href="propiedades.html?tipo=Casa">Casas y quintas</a></li><li><a href="propiedades.html?tipo=Departamento">Departamentos y PH</a></li><li><a href="propiedades.html?tipo=Local">Locales y terrenos</a></li></ul></div>' +
        '<div><h3 class="footer-h">Oficina</h3><ul class="footer-list">' +
          '<li class="footer-contact"><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>Maipú 785, Merlo<br><span style="color:#C9D9CE">Provincia de Buenos Aires</span></span></li>' +
          '<li class="footer-contact"><i class="fa-solid fa-phone" aria-hidden="true"></i><a href="tel:+542204825501">(0220) 482-5501</a></li>' +
          '<li class="footer-contact"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i><a href="' + WA + '" target="_blank" rel="noopener">+54 9 11 5226-7955</a></li>' +
          '<li class="footer-contact"><i class="fa-regular fa-envelope" aria-hidden="true"></i><a href="mailto:info@bertomeupropiedades.com">info@bertomeupropiedades.com</a></li></ul></div>' +
      '</div>' +
      '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:20px;padding-bottom:36px">' +
        '<div class="assoc"><span class="assoc-chip"><img src="assets/img/martilleros.png" alt="Colegio de Martilleros de Morón"></span><span class="assoc-chip"><img src="assets/img/crs.png" alt="CRS"></span><span class="assoc-chip">CIA</span><span class="assoc-chip">REALTOR®</span></div>' +
        '<p style="margin:0;max-width:540px;font-size:12.5px;line-height:1.6;color:#C9D9CE">Las medidas son aproximadas y prevalecen las del título de propiedad. Fotos de carácter ilustrativo. Precios orientativos, sujetos a modificación.</p></div>' +
      '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' Bertomeu Propiedades · Matrícula [N.º CMCPM]</span><span style="display:inline-flex;gap:20px;flex-wrap:wrap"><a href="contacto.html">Política de privacidad</a><a href="contacto.html">Defensa del consumidor</a></span></div>' +
      '</div></footer>';
  }

  function mount() {
    const active = document.body.dataset.page || '';
    const nav = document.getElementById('site-nav');
    const foot = document.getElementById('site-footer');
    if (nav) nav.innerHTML = navHTML(active);
    if (foot) foot.innerHTML = footerHTML();

    const burger = document.querySelector('.nav-burger');
    const mobile = document.getElementById('nav-mobile');
    if (burger && mobile) {
      burger.addEventListener('click', () => {
        const open = !mobile.classList.contains('is-open');
        mobile.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open);
        burger.innerHTML = '<i class="fa-solid ' + (open ? 'fa-xmark' : 'fa-bars') + '" aria-hidden="true"></i>';
      });
    }

    /* Botón flotante de WhatsApp */
    const wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = WA + '&text=Hola%2C%20quisiera%20hacer%20una%20consulta';
    wa.target = '_blank'; wa.rel = 'noopener';
    wa.setAttribute('aria-label', 'Escribinos por WhatsApp');
    wa.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i>';
    document.body.appendChild(wa);

    /* Animaciones de entrada al hacer scroll */
    const els = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window && !BP.reduceMotion()) {
      const io = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      }), { rootMargin: '0px 0px -8% 0px' });
      els.forEach((el) => io.observe(el));
    } else {
      els.forEach((el) => el.classList.add('is-in'));
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();

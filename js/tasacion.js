/* Tasaciones: formulario en 4 pasos y preguntas frecuentes */
(function () {
  const form = document.getElementById('wizard');
  const steps = Array.from(form.querySelectorAll('[data-step]'));
  const dots = Array.from(form.querySelectorAll('.w-dot'));
  const back = document.getElementById('w-back');
  const next = document.getElementById('w-next');
  const foot = document.getElementById('w-foot');
  const err = document.getElementById('w-error');
  let step = 1;

  /* Grupos de opciones (tiles, píldoras, chips) */
  form.addEventListener('click', (e) => {
    const b = e.target.closest('[data-group] > button');
    if (!b) return;
    const group = b.parentElement;
    if (group.hasAttribute('data-multi')) {
      b.classList.toggle('is-on');
      b.setAttribute('aria-pressed', b.classList.contains('is-on'));
    } else {
      group.querySelectorAll('button').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    }
  });
  const val = (g) => {
    const on = Array.from(form.querySelectorAll('[data-group="' + g + '"] .is-on')).map((b) => b.dataset.value);
    return form.querySelector('[data-group="' + g + '"]').hasAttribute('data-multi') ? on : on[0];
  };

  function show(n) {
    step = n;
    steps.forEach((s) => { s.hidden = Number(s.dataset.step) !== n; });
    dots.forEach((d, i) => { d.classList.toggle('done', i + 1 < n); d.classList.toggle('now', i + 1 === n); });
    document.getElementById('w-label').textContent = n < 5 ? 'Paso ' + n + ' de 4' : 'Enviado';
    back.classList.toggle('is-hidden', n === 1);
    foot.hidden = n === 5;
    next.innerHTML = (n === 4 ? 'Enviar' : 'Siguiente') + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>';
    err.textContent = '';
    const first = steps[n - 1].querySelector('input, button, select');
    if (first && n > 1) first.focus({ preventScroll: true });
  }

  function valid() {
    const fields = Array.from(steps[step - 1].querySelectorAll('[required]'));
    const bad = fields.find((f) => (f.type === 'checkbox' ? !f.checked : !f.value.trim()));
    if (bad) {
      err.textContent = bad.type === 'checkbox' ? 'Necesitamos tu autorización para responderte.' : 'Completá los campos marcados para seguir.';
      bad.focus();
      return false;
    }
    return true;
  }

  next.addEventListener('click', () => {
    if (!valid()) return;
    if (step < 4) return show(step + 1);
    /* Envío: en producción, mandar estos datos a un endpoint, a Tokko o por email */
    const data = Object.fromEntries(new FormData(form).entries());
    Object.assign(data, { objetivo: val('objetivo'), tipo: val('tipo'), ambientes: val('ambientes'), banos: val('banos'), estado: val('estado'), extras: val('extras').join(', '), canal: val('canal') });
    console.info('[Bertomeu] Pedido de tasación', data);
    const first = (data.nombre || '').trim().split(' ')[0];
    document.getElementById('done-title').textContent = '¡Gracias' + (first ? ', ' + first : '') + '!';
    document.getElementById('done-text').textContent = 'Recibimos tu pedido. Te vamos a escribir por ' + (data.canal === 'Llamada' ? 'teléfono' : data.canal) + ' para coordinar la visita.';
    document.getElementById('done-chips').innerHTML = [data.objetivo, data.tipo, data.direccion + ', ' + data.localidad, 'Estado: ' + data.estado].map((t) => '<span class="chip">' + BP.esc(t) + '</span>').join('');
    show(5);
  });
  back.addEventListener('click', () => show(Math.max(1, step - 1)));
  document.getElementById('w-restart').addEventListener('click', () => { form.reset(); show(1); });

  /* Preguntas frecuentes */
  document.getElementById('faq').addEventListener('click', (e) => {
    const q = e.target.closest('.faq-q');
    if (!q) return;
    const open = q.getAttribute('aria-expanded') !== 'true';
    document.querySelectorAll('.faq-q').forEach((x) => { x.setAttribute('aria-expanded', 'false'); document.getElementById(x.getAttribute('aria-controls')).hidden = true; });
    q.setAttribute('aria-expanded', open);
    document.getElementById(q.getAttribute('aria-controls')).hidden = !open;
  });
})();

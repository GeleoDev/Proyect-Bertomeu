/*
 * Conexión con Tokko Broker.
 *
 * Todas las páginas piden las propiedades a BP.api.getProperties() y
 * BP.api.getProperty(id). Si no hay API key configurada, devuelven los datos de
 * muestra de js/data.js. Con la key, consultan la API v1 de Tokko y adaptan la
 * respuesta al formato que usa el sitio (ver BP.PROPIEDADES en js/data.js).
 *
 * IMPORTANTE: la API key no debería quedar expuesta en el navegador en producción.
 * Lo ideal es un pequeño proxy en el servidor (PHP, Node o una función serverless)
 * que agregue la key y reenvíe la consulta. En ese caso, cambiá BASE_URL por la
 * URL del proxy y dejá API_KEY vacía.
 */
window.BP = window.BP || {};

(function () {
  const CONFIG = {
    API_KEY: '',                                        // key de Tokko (o vacía si se usa proxy)
    BASE_URL: 'https://www.tokkobroker.com/api/v1',     // o la URL de tu proxy
    LIMIT: 60
  };

  const useMock = () => !CONFIG.API_KEY && CONFIG.BASE_URL.includes('tokkobroker.com');

  /* Convierte una propiedad de Tokko al formato del sitio.
     Revisá los nombres de campo con una respuesta real de tu cuenta: pueden variar. */
  function fromTokko(p) {
    const op = (p.operations && p.operations[0]) || {};
    const price = (op.prices && op.prices[0]) || {};
    const tags = (p.tags || []).map((t) => (t.name || '').toLowerCase());
    const has = (word) => tags.some((t) => t.includes(word));
    return {
      id: String(p.id),
      op: /alquiler|rent/i.test(op.operation_type || '') ? 'alquiler' : 'venta',
      type: (p.type && p.type.name) || 'Propiedad',
      zone: (p.location && p.location.name) || '',
      partido: (p.location && p.location.full_location || '').split('|').slice(-2, -1)[0] || '',
      cur: price.currency === 'ARS' ? 'ARS' : 'USD',
      price: Number(price.price) || 0,
      expensas: Number(p.expenses) || 0,
      m2: Number(p.total_surface) || Number(p.roofed_surface) || 0,
      cubierta: Number(p.roofed_surface) || 0,
      terreno: Number(p.surface) || 0,
      amb: Number(p.room_amount) || 0,
      dorm: Number(p.suite_amount) || 0,
      baths: Number(p.bathroom_amount) || 0,
      garage: Number(p.parking_lot_amount) || 0,
      pool: has('pileta'),
      credit: !!p.credit_eligible || has('apto crédito'),
      pets: has('mascota'),
      title: p.publication_title || p.address || 'Propiedad',
      addr: p.fake_address || p.address || '',
      ref: p.reference_code || String(p.id),
      photos: (p.photos || []).length,
      antiguedad: p.age === 0 ? 'A estrenar' : p.age ? p.age + ' años' : '',
      condicion: p.property_condition || '',
      imgs: (p.photos || []).map((ph) => ph.image),
      imgIsUrl: true,
      descripcion: String(p.description || '').split(/\n{2,}/).filter(Boolean),
      servicios: (p.tags || []).filter((t) => t.type === 1).map((t) => t.name),
      ambientes: (p.tags || []).filter((t) => t.type === 2).map((t) => t.name),
      adicionales: (p.tags || []).filter((t) => t.type === 3).map((t) => t.name),
      lat: Number(p.geo_lat) || null,
      lng: Number(p.geo_long) || null
    };
  }

  async function request(path, params) {
    const q = new URLSearchParams(Object.assign({ format: 'json', lang: 'es_ar' }, params || {}));
    if (CONFIG.API_KEY) q.set('key', CONFIG.API_KEY);
    const res = await fetch(CONFIG.BASE_URL + path + '?' + q.toString());
    if (!res.ok) throw new Error('Tokko respondió ' + res.status);
    return res.json();
  }

  BP.api = {
    async getProperties() {
      if (useMock()) return BP.PROPIEDADES;
      try {
        const data = await request('/property/', { limit: CONFIG.LIMIT });
        return (data.objects || []).map(fromTokko);
      } catch (e) {
        console.warn('[Bertomeu] No se pudo leer Tokko, uso datos de muestra.', e);
        return BP.PROPIEDADES;
      }
    },
    async getProperty(id) {
      if (useMock()) return BP.PROPIEDADES.find((p) => p.id === id) || BP.PROPIEDADES[0];
      try {
        return fromTokko(await request('/property/' + encodeURIComponent(id) + '/'));
      } catch (e) {
        console.warn('[Bertomeu] No se pudo leer la propiedad en Tokko.', e);
        return BP.PROPIEDADES.find((p) => p.id === id) || BP.PROPIEDADES[0];
      }
    }
  };
})();

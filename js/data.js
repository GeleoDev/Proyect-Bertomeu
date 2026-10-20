/*
 * Datos de muestra del sitio.
 *
 * Mientras no esté conectada la API de Tokko Broker, el sitio usa estos datos.
 * Cuando se conecte la API, js/tokko.js transforma la respuesta al mismo
 * formato que tienen estos objetos, así que las páginas no cambian.
 */
window.BP = window.BP || {};

BP.PROPIEDADES = [
  {
    id: 'libertad', op: 'venta', type: 'Casa', zone: 'Libertad', partido: 'Merlo',
    cur: 'USD', price: 130000, m2: 395, cubierta: 200, terreno: 395,
    amb: 5, dorm: 4, baths: 4, garage: 2, pool: true, credit: false, pets: false,
    title: 'Casa de 5 ambientes con quincho y pileta', shortTitle: 'Casa con quincho y pileta',
    addr: 'Finochietto 1220', ref: 'ZP-M-56853406', photos: 33,
    antiguedad: '20 años', condicion: 'Excelente', plantas: 2, frenteFondo: '10 × 39,55 m',
    imgs: ['libertad-1', 'libertad-2', 'libertad-3', 'libertad-4', 'libertad-5', 'libertad-6'],
    descripcion: [
      'Casa en dos plantas. En planta baja: amplio living, cocina comedor, dos baños y escritorio. En planta alta: tres dormitorios, uno de ellos con vestidor, y baño completo. Cochera cubierta para dos autos y altillo.',
      'En el exterior, pileta automatizada y quincho con parrilla, baño y dormitorio adicional. Lote de 10 x 39,55 m.'
    ],
    servicios: ['Agua corriente', 'Cloaca', 'Gas natural', 'Electricidad', 'Pavimento'],
    ambientes: ['Living comedor', 'Cocina', 'Comedor diario', 'Lavadero', 'Vestidor', 'Jardín y patio'],
    adicionales: ['Pileta', 'Parrilla', 'Quincho']
  },
  {
    id: 'ph', op: 'alquiler', type: 'PH', zone: 'Parque San Martín', partido: 'Merlo',
    cur: 'ARS', price: 800000, expensas: 50000, m2: 100, cubierta: 70,
    amb: 4, dorm: 3, baths: 2, garage: 0, pool: false, credit: false, pets: true,
    title: 'PH de 4 ambientes a estrenar', addr: 'Arenales y Libertad 600', ref: 'ZP-M-59975013',
    antiguedad: 'A estrenar', condicion: 'A estrenar',
    imgs: ['ph-1', 'ph-2', 'ph-3'],
    descripcion: [
      'PH de 4 ambientes a estrenar: living, cocina comedor equipada, tres dormitorios (uno en suite), baño completo, lavadero y patio con parrilla. Medidores de luz y gas independientes, a 50 m de paradas de colectivo.',
      'Contrato de 2 años con ajustes cuatrimestrales por IPC o ICL. Máximo 5 personas; se acepta una mascota pequeña.'
    ],
    servicios: ['Luz y gas independientes', 'Transporte a 50 m'],
    ambientes: ['Living', 'Cocina comedor', 'Lavadero', 'Patio'],
    adicionales: ['Parrilla', 'Acepta mascotas']
  },
  {
    id: 'lima', op: 'venta', type: 'Casa', zone: 'Francisco Álvarez', partido: 'Moreno',
    cur: 'USD', price: 150000, m2: 270, cubierta: 270,
    amb: 6, dorm: 5, baths: 4, garage: 4, pool: true, credit: true, pets: true,
    title: 'Casa quinta con pileta y quincho', addr: 'Lima 1248', ref: 'ZP-M-54524493',
    antiguedad: 'A estrenar', condicion: 'Excelente',
    imgs: ['lima-1', 'lima-2', 'lima-3'],
    descripcion: [
      'Casa quinta de 6 ambientes con pileta de 8 x 4 m con solárium, quincho cerrado de 10 x 8 m y cochera cubierta para 4 autos. Living amplio, cocina comedor integrada, escritorio y lavadero con baño.',
      'Dos dormitorios en suite en planta baja y tres en planta alta con placard. Aire acondicionado frío/calor y calefactores tiro balanceado. Agua de pozo y pozo ciego. Entradas por Lima y por Semana de Mayo.'
    ],
    servicios: ['Electricidad', 'Gas natural', 'Agua de pozo'],
    ambientes: ['Living', 'Cocina comedor', 'Escritorio', 'Lavadero'],
    adicionales: ['Pileta con solárium', 'Quincho cerrado', 'Aire acondicionado']
  },
  {
    id: 'suipacha', op: 'alquiler', type: 'Local', zone: 'Merlo Centro', partido: 'Merlo',
    cur: 'ARS', price: 8000000, m2: 455, cubierta: 455, terreno: 163,
    amb: 0, dorm: 0, baths: 5, garage: 0, pool: false, credit: false, pets: false,
    title: 'Local comercial en tres plantas', addr: 'Suipacha al 400', ref: 'BLO10341164', photos: 28,
    antiguedad: '20 años', condicion: 'Excelente', plantas: 3, frenteFondo: '8,24 × 20,25 m',
    imgs: ['suipacha-1', 'suipacha-2', 'suipacha-3'],
    descripcion: [
      'Local en tres plantas pensado para empresas que necesitan atención al público, oficinas y espacio para el personal. Planta baja: recepción, box de atención, cajas y baño accesible.',
      'Primer piso: varios consultorios y dos baños. Segundo piso: lockers, cocina, comedor para el personal y terraza. Cuenta con energía trifásica y calefacción central.'
    ],
    servicios: ['Agua corriente', 'Cloaca', 'Gas natural', 'Electricidad trifásica'],
    ambientes: ['Recepción', 'Consultorios', 'Cocina', 'Terraza'],
    adicionales: ['Apto profesional', 'Calefacción central']
  },
  {
    id: 'padua', op: 'venta', type: 'Casa', zone: 'San Antonio de Padua', partido: 'Merlo',
    cur: 'USD', price: 115000, m2: 170, cubierta: 140, terreno: 207,
    amb: 5, dorm: 4, baths: 2, garage: 4, pool: false, credit: false, pets: false,
    title: 'Casa en dos plantas con parque', addr: 'El Algarrobo 285', ref: 'BHO11828903',
    antiguedad: '30 años', condicion: 'Excelente', plantas: 2,
    imgs: ['padua-1', 'padua-2', 'padua-3'],
    descripcion: [
      'Casa en dos plantas en excelente estado. Amplio living comedor y cocina equipada.',
      'Retiro al frente con lugar para estacionar y parque, y pasillo lateral que lleva al fondo.'
    ],
    servicios: ['Electricidad', 'Gas natural', 'Pavimento', 'Internet', 'Cable', 'Teléfono'],
    ambientes: ['Living comedor', 'Cocina', 'Parque'],
    adicionales: ['Cochera para varios autos']
  },
  {
    id: 'argentina', op: 'alquiler', type: 'Departamento', zone: 'Merlo Centro', partido: 'Merlo',
    cur: 'ARS', price: 490000, m2: 40, cubierta: 40,
    amb: 2, dorm: 1, baths: 1, garage: 0, pool: false, credit: false, pets: false,
    title: 'Departamento de 2 ambientes', addr: 'Av. Argentina al 1100', ref: 'BAP11176224',
    antiguedad: '30 años', condicion: 'Bueno',
    imgs: ['argentina-1', 'argentina-2', 'argentina-3'],
    descripcion: [
      'Departamento de 2 ambientes en segundo piso por escalera, a pocas cuadras de El Mástil y Av. Libertador. Cocina comedor equipada, baño y dormitorio con placard.',
      'Contrato de 2 años con ajustes cuatrimestrales por IPC o ICL. Máximo 2 personas; no se aceptan mascotas.'
    ],
    servicios: ['Agua corriente', 'Cloaca', 'Gas natural', 'Electricidad', 'Calefacción'],
    ambientes: ['Cocina comedor', 'Dormitorio con placard'],
    adicionales: []
  },
  {
    id: 'campora', op: 'venta', type: 'Local', zone: 'Merlo Norte', partido: 'Merlo',
    cur: 'USD', price: 125000, m2: 120, cubierta: 120,
    amb: 3, dorm: 2, baths: 1, garage: 1, pool: false, credit: false, pets: false,
    title: 'Cuatro locales + departamento', addr: 'Cámpora 1601, esq. Medrano', ref: 'ZP-M-51696987',
    antiguedad: 'A estrenar', condicion: 'A estrenar',
    imgs: ['campora-1', 'campora-2', 'campora-3'],
    descripcion: [
      'Edificio en esquina con cuatro locales en planta baja, cada uno con acceso independiente, y un departamento de 3 ambientes en planta alta con escalera propia.',
      'El departamento tiene cocina, living comedor, 2 dormitorios, baño completo y terraza. Además, entrada vehicular que puede usarse como depósito.'
    ],
    servicios: ['Agua corriente', 'Cloaca', 'Electricidad', 'Pavimento'],
    ambientes: ['4 locales', 'Departamento', 'Terraza'],
    adicionales: ['Depósito / cochera']
  },
  {
    id: 'rodeo', op: 'venta', type: 'Quinta', zone: 'Francisco Álvarez', partido: 'Moreno',
    cur: 'USD', price: 90000, m2: 140, cubierta: 140, terreno: 550,
    amb: 5, dorm: 3, baths: 2, garage: 3, pool: true, credit: false, pets: true,
    title: 'Quinta en 550 m² con pileta', addr: 'El Rodeo 1377', ref: 'ZP-M-53678779',
    antiguedad: 'A estrenar', condicion: 'A estrenar',
    imgs: ['rodeo-1', 'rodeo-2', 'rodeo-3'],
    descripcion: [
      'Casa quinta en lote de 550 m², tranquila y con buenos accesos. Tres dormitorios (uno en suite con vestidor), dos baños, living amplio y luminoso, escritorio, parrilla y lavadero.',
      'Estacionamiento para varios autos y pileta automatizada de 6 x 3 m. Instalación eléctrica nueva y dos aires acondicionados nuevos. Se aceptan ofertas en efectivo o departamento como parte de pago.'
    ],
    servicios: ['Electricidad'],
    ambientes: ['Living', 'Escritorio', 'Lavadero', 'Vestidor'],
    adicionales: ['Pileta', 'Parrilla', 'Acepta mascotas']
  },
  {
    id: 'pasodelrey', op: 'venta', type: 'Casa', zone: 'Paso del Rey', partido: 'Moreno',
    cur: 'USD', price: 72000, m2: 120, cubierta: 120, terreno: 350,
    amb: 3, dorm: 2, baths: 1, garage: 2, pool: true, credit: false, pets: false,
    title: 'Chalet con casa de huéspedes', addr: 'Santiago del Estero al 1800', ref: 'BHO12025704',
    antiguedad: '30 años', condicion: 'Bueno', frenteFondo: '10 × 35 m',
    imgs: ['pasodelrey-1', 'pasodelrey-2', 'pasodelrey-3'],
    descripcion: [
      'Chalet de 3 ambientes con living comedor y cocina integrados, 2 dormitorios y baño completo. Galería cubierta, patio con parrilla y pileta de fibra, y cochera cubierta para 2 autos con portón automático.',
      'Además, una casa de huéspedes de unos 80 m² en dos plantas con cocina comedor, toilette, 2 dormitorios y baño.'
    ],
    servicios: ['Gas natural', 'Electricidad'],
    ambientes: ['Living comedor', 'Galería', 'Patio'],
    adicionales: ['Pileta', 'Parrilla', 'Casa de huéspedes']
  },
  {
    id: 'constitucion', op: 'venta', type: 'Departamento', zone: 'Merlo Centro', partido: 'Merlo',
    cur: 'USD', price: 55000, m2: 42, cubierta: 32,
    amb: 2, dorm: 1, baths: 1, garage: 0, pool: false, credit: false, pets: false,
    title: 'Departamento de 2 ambientes con balcón', addr: 'Constitución 561', ref: 'ZP-M-49839374',
    antiguedad: '40 años', condicion: 'Bueno',
    imgs: ['constitucion-1', 'constitucion-2'],
    descripcion: [
      'Departamento de 2 ambientes al frente, entre Chacabuco y Bolívar. Living y cocina semi integrados, dormitorio con placard, baño completo y balcón.'
    ],
    servicios: ['Agua corriente', 'Cloaca', 'Gas natural', 'Electricidad', 'Pavimento', 'Teléfono', 'Cable'],
    ambientes: ['Living', 'Cocina', 'Balcón'],
    adicionales: []
  }
];

/* Reseñas reales de Google (5 estrellas). Fuente: ficha de Bertomeu Propiedades en Google. */
BP.RESENAS = [
  { name: 'Lucas Maximiliano Jardi', meta: 'Local Guide · hace 2 meses', img: 'lucas-maximiliano-jardi.jpg', text: 'Finalmente concretamos la venta de la casa! Agradecer a Emanuel por todo el acompañamiento durante este proceso. Desde el primer día demostró un gran profesionalismo, pero lo que más valoramos fue su calidad humana. Siempre estuvo disponible para responder nuestras dudas, acompañarnos en cada etapa y ayudarnos a resolver cada situación que fue apareciendo. Contar con alguien honesto, comprometido y cercano hizo una gran diferencia. Gracias Emanuel!!! por tu dedicación, transparencia y por estar siempre presente. Sin dudas, te recomendamos y volveríamos a elegirte.' },
  { name: 'Christian Recavarren', meta: 'Hace 4 meses', img: 'christian-recavarren.jpg', text: 'Sinceramente agradecido con la atención brindada es la segunda vez que realizo una operación con ellos son super recomendables. Un agradecimiento muy especial a Marian siempre atenta y eficaz ante cualquier duda, siempre predispuesta a resolver mis inquietudes con esa amabilidad y optimismo que la caracteriza. Toda la operación fue transparente y clara, me sentí muy seguro de trabajar con ellos. Sin dudas los volveré a recomendar. Muchas gracias!!!' },
  { name: 'Melina Cabral', meta: 'Hace un año', img: 'melina-cabral.png', text: 'Tuvimos una excelente experiencia con Inmobiliaria Bertomeu. Desde el primer momento nos sentimos acompañados y muy bien asesorados. Lore fue una guía fundamental en todo el proceso, siempre atenta, clara y con una calidez que hizo todo mucho más fácil. Estuvo con nosotros hasta el último día, brindándonos apoyo y tranquilidad en cada paso. Estamos muy conformes y agradecidos!!!' },
  { name: 'Susana Puente', meta: 'Local Guide · hace 4 meses', img: 'susana-puente.png', text: 'Quiero destacar la profesionalidad de quienes atienden, son muy amables y se toman su tiempo en explicar todo lo que uno necesita. Además, son detallistas, investigan y resuelven todo. Muy buen lugar. Consulté por algo que después no hice, pero no por ellos. Porque sinceramente fueron excelentes.' },
  { name: 'Tatiana Clemente', meta: 'Hace 9 meses', img: 'tatiana-clemente.jpg', text: 'Completa y totalmente agradecida con Emanuel, nos ayudó desde el primer momento con la búsqueda de nuestra casa, atento, servicial y honesto. Hizo que la experiencia sea súper linda y nos ayudó a cumplir nuestro sueño de nuestra casa propia. Sin duda recomiendo el servicio de la inmobiliaria.' },
  { name: 'Dario Sbaglia', meta: 'Local Guide · hace un año', img: 'dario-sbaglia.png', text: 'Que placer cuando haces una consulta y te atienden con profesionalismo, seriedad, buena onda, transparencia, celeridad y responsabilidad! He consultado varias veces, por tasaciones de propiedades, dudas respecto de contratos de alquiler y demás cuestiones, siempre una atención ESPECTACULAR! Lorena una genia, muy didáctica para explicar y asesora. Se nota cuando la gente trabaja con amor por lo que hace y eso siempre se agradece! Muy recomendables!!!!' },
  { name: 'Viviana Brizuela', meta: 'Hace 4 meses', img: 'viviana-brizuela.png', text: 'Excelente atención de Lorena y su equipo, asesoramiento y acompañamiento en cada paso que dimos, vendimos una Propiedad y fue todo con mucho Profesionalismo. La recomiendo una y mil veces. Muchas Gracias Bertomeu' },
  { name: 'Leonardo Antunez', meta: 'Hace 4 meses', img: 'leonardo-antunez.png', text: 'Quiero compartir mi experiencia con Lorena y su equipo de colaboradores. Contaba con un dto. en la zona de Ciudadela el cual se concretó la venta, en primer lugar distingo su profesionalidad en su trabajo y su calidez como persona en estar siempre para acompañarte en todo momento. Y ahora la vuelvo a elegir para continuar en el camino de conseguir el sueño de una casa. Recomiendo un 100 %. MUCHAS GRACIAS' },
  { name: 'Mariano', meta: 'Hace un año', img: 'mariano.png', text: 'Me sentí acompañado desde el primer momento, son un grupo de profesionales que están en cada paso de la operación, dando seguridad y excelencia en cada duda que exprese. Hoy puedo decir que ya soy propietario gracias a ellos. Trabajan con amor y respeto. Súper recomendables!!!!' },
  { name: 'Diego Gomez', meta: 'Hace 10 meses', img: 'diego-gomez.png', text: 'Sin duda una cumplidora de sueños, muchas gracias Lorena por todo el trabajo hecho, si tenés el sueño de tener tu propio hogar no dudes en hablar con ella, sin duda la mejor. Si estás con ganas o dudas de meterte en un hipotecario es la indicada para asesorarte, compré mi casa a través del hipotecario del Banco Nación.' },
  { name: 'Miguel Angel Gomez', meta: 'Local Guide · hace un año', img: 'miguel-angel-gomez.png', text: 'Desde el primer día que llamé, en seguida, mostraron interés y me mandaron información. Emanuel un fenómeno, estuvo atento a todos los detalles de la compra/venta de la propiedad. Excelente predisposición, respondiendo a la brevedad, gestionando y resolviendo. Estoy muy conforme y agradecido por el excelente trabajo de la inmobiliaria. Todo se fue dando como lo explicaban y como era pautado. Muy buena experiencia.' },
  { name: 'Juan Francolino', meta: 'Local Guide · hace 3 años', img: 'juan-francolino.jpg', text: 'Queremos expresar el agradecimiento a todo el equipo de Bertomeu Propiedades, por toda la contención, calidad humana y profesionalismo con el que nos guiaron en el proceso de la venta de nuestra propiedad. Nos dieron herramientas para entender cuál era la opción más correcta que nos llevaría a concretar nuestro proyecto. Han sido el mejor compañero que pudimos tener en este camino. Gracias.' }
];

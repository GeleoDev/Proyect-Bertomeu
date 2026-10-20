# Bertomeu Propiedades · Sitio web

Sitio estático (HTML, CSS y JavaScript, sin frameworks ni build) basado en la **Variante 2 · Suave** del rediseño.

## Cómo verlo

Abrí `index.html` en el navegador. Para que todo funcione igual que en un hosting (mapas, video, rutas), conviene levantar un servidor local desde esta carpeta:

```bash
npx serve .
# o
python -m http.server 8080
```

## Estructura

```
index.html          Inicio: hero en video, buscador, servicios, destacadas, reseñas de Google
nosotros.html       Historia, misión, visión, valores, equipo y asociaciones
propiedades.html    Listado con filtros dinámicos y fijos al hacer scroll (?op=venta|alquiler, ?tipo, ?zona, ?amb, ?q)
propiedad.html      Ficha de propiedad (?id=)
tasacion.html       Pedido de tasación en 4 pasos + preguntas frecuentes
contacto.html       Formulario con buscador de propiedades (?prop=<id>, ?motivo=)

css/base.css        Sistema visual compartido: colores, tipografías, botones, tarjetas, navbar, footer, fondo animado, scroll
css/<pagina>.css    Estilos propios de cada página

js/data.js          Propiedades de muestra y reseñas reales de Google
js/tokko.js         Conexión con la API de Tokko Broker (usa los datos de muestra si no hay API key)
js/common.js        Navbar, footer, botón de WhatsApp, tarjetas de propiedad, favoritos, animaciones de entrada
js/<pagina>.js      Lógica de cada página

assets/img/         Logo, fotos de propiedades y logos de asociaciones
assets/resenas/     Fotos de perfil de las reseñas de Google
assets/video/       Video del hero (hero.mp4) y su imagen de carga (hero-poster.jpg)
```

La navbar y el footer se escriben una sola vez en `js/common.js` y se insertan en todas las páginas.

## Conectar Tokko Broker

1. En `js/tokko.js`, completá `API_KEY` con la key de la cuenta de Bertomeu.
2. Recomendado para producción: no dejar la key en el navegador. Crear un proxy en el servidor que agregue la key y cambiar `BASE_URL` por la URL del proxy.
3. Revisar la función `fromTokko()` con una respuesta real de la cuenta: transforma cada propiedad de Tokko al formato que usa el sitio (el mismo de `js/data.js`).

Las páginas no necesitan cambios: piden los datos a `BP.api.getProperties()` y `BP.api.getProperty(id)`.

## Formularios

Los formularios de Contacto, Tasación y visita (en la ficha) muestran la confirmación y dejan los datos en la consola. Para producción hay que enviarlos a un destino real: un endpoint propio, un servicio como Formspree o la API de contactos de Tokko.

## Pendientes de contenido

- Equipo: nombres, cargos y fotos (en `nosotros.html`).
- Matrícula (footer, en `js/common.js`) y horario de atención (`contacto.html`).
- Confirmar el texto de «¿La tasación tiene costo?» en `tasacion.html`.

## Créditos

- Video del hero: Mixkit (licencia gratuita).
- Iconos: Font Awesome Free 6.7.2.
- Tipografías: Fraunces y Figtree (Google Fonts).
- Reseñas: opiniones públicas de Bertomeu Propiedades en Google.

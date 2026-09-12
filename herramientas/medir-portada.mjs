/**
 * Qué cuesta la portada de verdad, en la red de la audiencia del contrato:
 * «un teléfono de gama baja, a plena luz del día, con prisa».
 *
 * Mide lo que decide si esa persona se queda: cuánto pesa, cuánto tarda en pintar
 * lo grande (LCP), qué se descarga antes de la primera pantalla, y cuánto hay que
 * bajar para llegar a la primera acción de contacto.
 *
 * Uso:  node herramientas/medir-portada.mjs [url]
 */
import { abrirChromium } from './navegador.mjs';

const BASE = process.argv[2] ?? process.env.BASE ?? 'http://127.0.0.1:8124';
/* La ruta era fija en '/'. Se abrió al llegar la galería del ADR-0022: empeño es hoy
   la página más pesada del sitio y no había forma de pesarla con esta herramienta.
   Por omisión sigue midiendo la portada, así que nada de lo escrito cambia. */
const RUTA = process.env.RUTA ?? '/';

// 4G flojo, que es lo que hay en la calle y no en una oficina.
const RED = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150
};

const kb = (n) => +(n / 1024).toFixed(1);

const navegador = await abrirChromium();

/**
 * ── SE CALIENTA EL SERVIDOR, NO EL NAVEGADOR ────────────────────────────────
 *
 * Contra un despliegue recién hecho, la primera carga pega con la CDN de Vercel
 * dormida y el TTFB se dispara: así salió un LCP de 4464 ms que no medía el sitio
 * sino el primer golpe a un servidor frío, y con ese número se sacó una conclusión
 * equivocada sobre el mapa.
 *
 * El primer arreglo fue peor: cargar dos veces en la MISMA pestaña. Eso calentaba el
 * servidor, sí, pero también dejaba el detector de respuestas contando las dos
 * vueltas, y el peso oscilaba entre 225 y 266 KB según lo que quedara en caché. Un
 * medidor que da dos respuestas distintas para la misma página no mide nada.
 *
 * Lo correcto son dos contextos: uno de usar y tirar para despertar al servidor, y
 * otro LIMPIO —sin caché— donde se mide. Eso es lo que vive de verdad alguien que
 * llega por primera vez a un sitio que ya está en uso.
 */
const calentar = await navegador.newContext();
try {
  const q = await calentar.newPage();
  await q.goto(BASE + RUTA, { waitUntil: 'load', timeout: 60000 });
} catch { /* si no calienta, se mide igual y se nota en el TTFB */ }
await calentar.close();

/**
 * `deviceScaleFactor: 2` tampoco es un detalle. Sin él Playwright mide con densidad 1,
 * el navegador elige el archivo más chico de cada `srcset` y el informe sale optimista:
 * daba el LCP sobre `fachada-400.jpg`, que en un teléfono de verdad no se usa nunca.
 * Un teléfono de gama baja de hoy sigue teniendo pantalla de densidad 2 o 3.
 */
const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();

const cdp = await ctx.newCDPSession(p);
await cdp.send('Network.emulateNetworkConditions', RED);
// Gama baja: el procesador también es lento, no solo la red.
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

const pedidos = [];
p.on('response', async (r) => {
  /**
   * EL PESO SALE DE LO TRANSFERIDO, NO DE UNA CABECERA.
   *
   * Aquí se leía `content-length` y se daba 0 cuando faltaba. `npx serve` no la manda
   * en todas las respuestas: comprobado el 11 de septiembre, `monedas.js` viajaba con
   * 21018 bytes de cuerpo y esta herramienta informaba **js 0 KB** en la única página
   * del sitio que sirve JavaScript. Un cero no se distingue de «no hay».
   *
   * Es el mismo defecto que tenía el guardia de CA-10, en otra herramienta y el mismo
   * día: medir por donde es cómodo y callar lo que no cabe por ahí.
   *
   * `sizes().responseBodySize` es lo que de verdad viajó por el cable. La cabecera se
   * queda de respaldo por si la petición ya no está disponible.
   */
  let bytes = 0;
  try { bytes = (await r.request().sizes()).responseBodySize || 0; } catch { /* ya no está */ }
  if (!bytes) {
    try { bytes = Number((await r.allHeaders())['content-length'] ?? 0); } catch { /* sin cabecera */ }
  }
  const u = r.url();
  pedidos.push({
    url: u,
    tipo: /\.(jpg|jpeg|png|webp|avif|svg)/i.test(u) ? 'imagen'
      : /\.(woff2?|ttf)/i.test(u) ? 'fuente'
      : /\.css/i.test(u) ? 'css'
      : /\.js/i.test(u) ? 'js'
      : 'otro',
    tercero: !u.startsWith(BASE),
    bytes
  });
});

/**
 * ── HUELLA DE LA MÁQUINA · y por qué hace falta ───────────────────────────
 *
 * Este script frena la CPU 4× ENCIMA de lo que la máquina ya esté haciendo. Si hay
 * un navegador abierto con treinta pestañas, el freno se aplica sobre una máquina ya
 * cargada y el resultado no es el del sitio: es el del momento.
 *
 * Pasó el 11 de septiembre. La portada midió 1372 ms de FCP por la mañana y 4048 ms
 * por la tarde CON EL MISMO COMMIT — comprobado recorriendo cuatro commits hacia
 * atrás y viendo la cifra plana en todos. No había regresión: la máquina tenía 2 GB
 * libres y Chrome ocupando 2.9.
 *
 * Se midió una regresión que no existía y casi se culpa a un cambio de diseño.
 *
 * Esto ejecuta un bucle fijo y reporta cuánto tarda. No corrige nada — no se puede—
 * pero deja la cifra al lado del resultado, así que dos mediciones solo se comparan
 * si su huella se parece. Lo que SÍ es comparable siempre es un A/B dentro de una
 * misma corrida, que es como mide `medir-animacion.mjs`.
 */
const huella = await p.evaluate(() => {
  const t = performance.now();
  let x = 0;
  for (let i = 0; i < 4_000_000; i++) x += Math.sqrt(i);
  return Math.round(performance.now() - t);
});

// Una sola carga, en contexto limpio. El servidor ya viene despierto de arriba.
await p.goto(BASE + RUTA, { waitUntil: 'load' });

/**
 * El LCP a secas no dice nada accionable. Lo que hace falta es QUÉ elemento es y
 * DÓNDE se fue el tiempo: si el cuello es la red, el servidor, la fuente o la imagen,
 * cada uno se arregla distinto y tres de los cuatro no se arreglan tocando la imagen.
 */
const lcp = await p.evaluate(() => new Promise((res) => {
  let e = null;
  new PerformanceObserver((l) => { for (const x of l.getEntries()) e = x; })
    .observe({ type: 'largest-contentful-paint', buffered: true });
  setTimeout(() => {
    const n = performance.getEntriesByType('navigation')[0] ?? {};
    const pintados = Object.fromEntries(
      performance.getEntriesByType('paint').map((x) => [x.name, Math.round(x.startTime)])
    );
    const recurso = e?.url ? performance.getEntriesByName(e.url)[0] : null;
    res({
      ms: Math.round(e?.startTime ?? 0),
      elemento: e?.element ? `${e.element.tagName.toLowerCase()}${e.element.className ? '.' + String(e.element.className).split(' ')[0] : ''}` : '—',
      url: e?.url ? e.url.replace(location.origin, '') : '(texto, sin archivo)',
      ttfb: Math.round(n.responseStart ?? 0),
      htmlListo: Math.round(n.domContentLoadedEventEnd ?? 0),
      primerPintado: pintados['first-contentful-paint'] ?? 0,
      recurso: recurso ? {
        pedido: Math.round(recurso.startTime),
        empezoAlLlegar: Math.round(recurso.responseStart),
        termino: Math.round(recurso.responseEnd)
      } : null
    });
  }, 3500);
}));

const primeraPantalla = await p.evaluate(() => {
  const alto = window.innerHeight;
  const visible = (el) => {
    const b = el.getBoundingClientRect();
    return b.top < alto && b.bottom > 0 && b.width > 0 && b.height > 0;
  };
  const contacto = [...document.querySelectorAll('a[href^="https://wa.me"], a[href^="tel:"]')];
  const primero = contacto.map((el) => Math.round(el.getBoundingClientRect().top + window.scrollY))
    .filter((y) => y >= 0).sort((a, b) => a - b)[0];
  return {
    altoTotal: document.body.scrollHeight,
    pantallas: +(document.body.scrollHeight / alto).toFixed(1),
    huecosVisibles: [...document.querySelectorAll('[data-pendiente]')].filter(visible).length,
    huecosTotales: document.querySelectorAll('[data-pendiente]').length,
    primerContactoY: primero ?? null,
    contactosTotales: contacto.length,
    // Cuánto de la primera pantalla se lo lleva el aviso de borrador.
    avisoAlto: Math.round(document.querySelector('[class*="aviso"], [data-borrador]')?.getBoundingClientRect().height ?? 0)
  };
});

await p.waitForTimeout(2500);
await navegador.close();

const total = pedidos.reduce((a, b) => a + b.bytes, 0);
const porTipo = {};
for (const r of pedidos) porTipo[r.tipo] = (porTipo[r.tipo] ?? 0) + r.bytes;
const terceros = pedidos.filter((r) => r.tercero);

console.log(`\nPortada · 390 px · 4G a 1.6 Mbps con 150 ms · CPU a 1/4\n`);
console.log(`  Huella de la máquina   ${huella} ms  · dos corridas solo se comparan si esta cifra se parece`);
console.log('');

const veredicto = lcp.ms < 2500 ? '✓ bueno' : lcp.ms < 4000 ? '△ mejorable' : '✗ malo';
console.log(`  LCP                    ${lcp.ms} ms      ${veredicto}  (umbral 2500)`);
console.log(`    elemento             ${lcp.elemento}  ${lcp.url}`);
console.log(`    TTFB                 ${lcp.ttfb} ms  · lo que tarda el servidor en contestar`);
console.log(`    primer pintado       ${lcp.primerPintado} ms`);
console.log(`    HTML listo           ${lcp.htmlListo} ms`);
if (lcp.recurso) {
  console.log(`    el archivo del LCP   se pide a ${lcp.recurso.pedido} ms · empieza a llegar a ` +
              `${lcp.recurso.empezoAlLlegar} ms · termina a ${lcp.recurso.termino} ms`);
}
console.log('');
console.log(`  Peso total             ${kb(total)} KB en ${pedidos.length} peticiones`);
for (const [t, b] of Object.entries(porTipo).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${t.padEnd(20)} ${String(kb(b)).padStart(7)} KB`);
}
console.log(`  De terceros            ${kb(terceros.reduce((a, b) => a + b.bytes, 0))} KB en ${terceros.length} peticiones`);
console.log('');
console.log(`  Alto de la página      ${primeraPantalla.altoTotal} px = ${primeraPantalla.pantallas} pantallas`);
console.log(`  Primer contacto a      ${primeraPantalla.primerContactoY} px del inicio`);
console.log(`  Enlaces de contacto    ${primeraPantalla.contactosTotales}`);
console.log(`  Huecos visibles        ${primeraPantalla.huecosVisibles} de ${primeraPantalla.huecosTotales} en la primera pantalla`);
console.log('');

console.log('  Las 8 peticiones más pesadas:');
for (const r of [...pedidos].sort((a, b) => b.bytes - a.bytes).slice(0, 8)) {
  console.log(`    ${String(kb(r.bytes)).padStart(7)} KB  ${r.tercero ? '3ro ' : '    '} ${r.url.replace(BASE, '').slice(0, 64)}`);
}
console.log('');

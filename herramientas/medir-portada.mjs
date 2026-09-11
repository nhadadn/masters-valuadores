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
const RUTA = '/';

// 4G flojo, que es lo que hay en la calle y no en una oficina.
const RED = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150
};

const kb = (n) => +(n / 1024).toFixed(1);

const navegador = await abrirChromium();
const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 } });
const p = await ctx.newPage();

const cdp = await ctx.newCDPSession(p);
await cdp.send('Network.emulateNetworkConditions', RED);
// Gama baja: el procesador también es lento, no solo la red.
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

const pedidos = [];
p.on('response', async (r) => {
  let bytes = 0;
  try { bytes = Number((await r.allHeaders())['content-length'] ?? 0); } catch { /* sin cabecera */ }
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

await p.goto(BASE + RUTA, { waitUntil: 'load' });

const lcp = await p.evaluate(() => new Promise((res) => {
  let v = 0;
  new PerformanceObserver((l) => { for (const e of l.getEntries()) v = e.startTime; })
    .observe({ type: 'largest-contentful-paint', buffered: true });
  setTimeout(() => res(Math.round(v)), 3000);
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
console.log(`  LCP                    ${lcp} ms      ${lcp < 2500 ? '✓ bueno' : lcp < 4000 ? '△ mejorable' : '✗ malo'}  (umbral 2500)`);
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

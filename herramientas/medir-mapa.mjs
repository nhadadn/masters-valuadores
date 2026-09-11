/**
 * Qué cuesta el mapa incrustado · ADR-0015.
 *
 * Es la primera pieza del sitio que carga un tercero, así que el costo se MIDE, no
 * se estima. Tres cosas, en la red de la audiencia real —gama baja, 4G flojo—:
 *
 *   1. Qué se descarga ANTES de bajar al mapa. Es lo que paga quien no llega ahí.
 *   2. Qué se descarga DESPUÉS. Es lo que paga quien sí llega.
 *   3. Cuánto se mueve la maqueta al montarse el iframe (CLS).
 *
 * Uso:  npx serve build -l 8124   y luego   node herramientas/medir-mapa.mjs
 */
import { abrirChromium } from './navegador.mjs';

const BASE = process.env.BASE ?? 'http://127.0.0.1:8124';
const RUTAS = ['/', '/contacto/', '/empeno-y-prestamo/'];

// 4G flojo de verdad, que es donde esto se nota.
const RED = { offline: false, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 };

const kb = (n) => +(n / 1024).toFixed(1);
const filas = [];

const navegador = await abrirChromium();

for (const ruta of RUTAS) {
  const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();

  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.emulateNetworkConditions', RED);

  const pedidos = [];
  p.on('response', async (r) => {
    let bytes = 0;
    try { bytes = Number((await r.allHeaders())['content-length'] ?? 0); } catch { /* sin cabecera */ }
    pedidos.push({ url: r.url(), tercero: !r.url().startsWith(BASE), bytes, cuando: Date.now() });
  });

  await p.goto(BASE + ruta, { waitUntil: 'networkidle' });

  // CLS acumulado desde el inicio, con el observador real de desplazamiento.
  await p.evaluate(() => {
    window.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });

  const antes = pedidos.filter((x) => x.tercero);
  const bytesAntes = antes.reduce((a, b) => a + b.bytes, 0);

  // Ahora sí: bajar hasta el mapa y dejar que el lazy dispare.
  await p.evaluate(() => document.querySelector('iframe')?.scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(6000);

  const despues = pedidos.filter((x) => x.tercero);
  const bytesDespues = despues.reduce((a, b) => a + b.bytes, 0);

  const cls = await p.evaluate(() => window.__cls);
  const cookies = (await ctx.cookies()).filter((c) => !c.domain.includes('127.0.0.1'));
  const hayIframe = await p.locator('iframe').count();

  filas.push({
    ruta, hayIframe,
    tercerosAntes: antes.length, kbAntes: kb(bytesAntes),
    tercerosDespues: despues.length, kbDespues: kb(bytesDespues),
    cls: +cls.toFixed(4),
    cookies: cookies.length,
    dominios: [...new Set(despues.map((x) => new URL(x.url).hostname))]
  });

  await ctx.close();
}

await navegador.close();

console.log('\nCosto del mapa incrustado · 390 px · 4G a 1.6 Mbps, 150 ms de latencia\n');
console.log('| Ruta | iframe | 3ros antes | KB antes | 3ros después | KB después | CLS | cookies |');
console.log('|---|---|---|---|---|---|---|---|');
for (const f of filas) {
  console.log(`| ${f.ruta} | ${f.hayIframe} | ${f.tercerosAntes} | ${f.kbAntes} | ${f.tercerosDespues} | ${f.kbDespues} | ${f.cls} | ${f.cookies} |`);
}

console.log('\nDominios de tercero que aparecen al bajar al mapa:');
for (const d of [...new Set(filas.flatMap((f) => f.dominios))]) console.log('  ·', d);

const peorCls = Math.max(...filas.map((f) => f.cls));
const sinLazy = filas.some((f) => f.kbAntes > 0);

console.log(`\nCLS peor: ${peorCls} · umbral 0.1 · ${peorCls < 0.1 ? '✓ CUMPLE' : '✗ NO CUMPLE'}`);
console.log(`Antes de bajar al mapa se descargan ${filas.reduce((a, b) => a + b.kbAntes, 0)} KB de terceros` +
            ` · ${sinLazy ? '✗ el lazy NO está funcionando' : '✓ el lazy funciona: cero'}`);
process.exit(peorCls < 0.1 && !sinLazy ? 0 : 1);

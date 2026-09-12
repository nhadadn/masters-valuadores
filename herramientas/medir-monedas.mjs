/**
 * Qué cuesta la banda de monedas de empeño · ADR-0021.
 *
 * POR QUÉ NO SIRVE EL TEST DEL DESTELLO. `medir-animacion.mjs` comprueba que el
 * destello vive en el COMPOSITOR: anima `transform`, no recalcula estilo ni maqueta.
 * Aplicarle ese criterio a un lienzo daría verde siempre sin probar nada — dibujar en
 * `<canvas>` tampoco recalcula estilo ni maqueta, y aun así gasta hilo principal en
 * cada cuadro, que es lo que se paga en batería.
 *
 * ── LAS DOS VECES QUE ESTE INSTRUMENTO MINTIÓ ───────────────────────────────
 *
 * 1 · «Fuera de pantalla» no lo estaba. La banda queda a 758 px y el viewport mide
 *     844: a scroll 0 está EN pantalla. El test medía dos veces lo mismo y culpaba
 *     al código de no pausarse.
 *
 * 2 · Peor, y es la que importa: comparaba la CAÍDA —medida desde que carga— contra
 *     una base medida con la página ya en reposo, y todo bajo el estrangulador de
 *     CPU. Dio 4721 ms «de la animación». Perfilado después:
 *
 *         freno 4x · SIN lienzo ninguno ........ 4070 ms
 *         freno 4x · cayendo .................... 4512 ms
 *         sin freno · SIN lienzo ................. 301 ms
 *         sin freno · cayendo .................... 661 ms
 *
 *     El estrangulador FRENA el hilo y esa frenada se cuenta como trabajo. Casi todo
 *     aquel número era la página cargando y el freno, no las monedas.
 *
 * De ahí las tres reglas de este archivo:
 *   · cada escenario se compara con una base medida EN SU MISMA FASE;
 *   · el número que se declara sale SIN freno, que es el único fiable;
 *   · con freno se miran cuadros por segundo y tareas largas, que es lo que de verdad
 *     siente alguien con un teléfono lento, y no se convierten en milisegundos.
 *
 * Uso:  npx serve build -l 5180   y luego
 *       node herramientas/medir-monedas.mjs [url]
 */
import { readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { abrirChromium } from './navegador.mjs';

const BASE = process.argv[2] ?? process.env.BASE ?? 'http://127.0.0.1:5180';
const RUTA = process.env.RUTA ?? '/empeno-y-prestamo/';
const VENTANA = 6000;
const GUION = 'static/animacion/monedas.js';

const navegador = await abrirChromium();

/** Cuenta píxeles de oro y dónde están. No se le cree al código: se miran. */
const CONTAR = () => {
  const c = document.querySelector('canvas[data-monedas]');
  if (!c) return { arriba: 0, abajo: 0, total: 0 };
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  let arriba = 0, abajo = 0;
  const corte = Math.floor(c.height / 3);
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x += 2) {
      if (d[(y * c.width + x) * 4 + 3] > 16) { if (y < corte) arriba++; else abajo++; }
    }
  }
  return { arriba, abajo, total: arriba + abajo };
};

/** Cuadros y tareas largas durante la ventana: lo que de verdad se siente. */
const SENTIR = (ms) => new Promise((res) => {
  let cuadros = 0, largas = 0;
  let po = null;
  try {
    po = new PerformanceObserver((l) => { largas += l.getEntries().length; });
    po.observe({ entryTypes: ['longtask'] });
  } catch { /* el navegador no lo soporta: se reporta 0 */ }
  const t0 = performance.now();
  (function tic() {
    cuadros++;
    if (performance.now() - t0 < ms) requestAnimationFrame(tic);
    else { if (po) po.disconnect(); res({ cuadros, largas, transcurrido: performance.now() - t0 }); }
  })();
});

async function medir({ posicion = 'a-la-vista', espera, freno = 1, sinLienzo = false, reducido = false }) {
  const ctx = await navegador.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    reducedMotion: reducido ? 'reduce' : 'no-preference'
  });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  if (freno > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: freno });

  await p.goto(BASE + RUTA, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);

  if (sinLienzo) {
    await p.evaluate(() => document.querySelector('.mostrador')?.remove());
  } else if (posicion === 'fuera') {
    // LEJOS DE VERDAD: al fondo del documento. Ver la nota 1 del encabezado.
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  } else {
    const l = p.locator('canvas[data-monedas]');
    if (await l.count()) await l.scrollIntoViewIfNeeded();
  }

  await p.waitForTimeout(espera);

  await cdp.send('Performance.enable');
  const a = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  const sentido = await p.evaluate(SENTIR, VENTANA);
  const b = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));

  const pixeles = await p.evaluate(CONTAR);
  await ctx.close();
  return {
    hiloMs: Math.round((b.TaskDuration - a.TaskDuration) * 1000),
    fps: +(sentido.cuadros / (sentido.transcurrido / 1000)).toFixed(1),
    largas: sentido.largas,
    pixeles
  };
}

/** Un escenario y SU base, en la misma fase y con el mismo freno. */
async function contra(etiqueta, opciones) {
  const conLienzo = await medir(opciones);
  const base = await medir({ ...opciones, sinLienzo: true });
  return { etiqueta, ...conLienzo, base, delta: conLienzo.hiloMs - base.hiloMs, deltaFps: +(conLienzo.fps - base.fps).toFixed(1) };
}

// Fase temprana: la caída, desde que carga. Fase tardía: todo ya asentado.
const cayendo = await contra('mientras caen', { espera: 0 });
const reposo = await contra('ya asentadas', { espera: 9000 });
const fuera = await contra('fuera de pantalla', { espera: 9000, posicion: 'fuera' });
const quieto = await contra('reduced-motion', { espera: 9000, reducido: true });
// El teléfono lento: solo durante la caída, que es cuando podría notarse.
const lento = await contra('caída · CPU a 1/4', { espera: 0, freno: 4 });

await navegador.close();
const kb = existsSync(GUION) ? +(gzipSync(readFileSync(GUION)).length / 1024).toFixed(2) : NaN;

console.log(`\nLa banda de monedas · ${RUTA} · 390 px · ventanas de ${VENTANA / 1000} s\n`);
console.log(`  ${'escenario'.padEnd(22)} ${'hilo ms'.padStart(8)} ${'base'.padStart(6)} ${'añade'.padStart(7)} ${'fps'.padStart(6)} ${'vs base'.padStart(8)} ${'t.largas'.padStart(9)}  oro`);
for (const m of [cayendo, reposo, fuera, quieto, lento]) {
  const reparto = m.pixeles.total ? `${m.pixeles.total} px · ${Math.round((m.pixeles.abajo / m.pixeles.total) * 100)} % abajo` : '—';
  console.log(
    `  ${m.etiqueta.padEnd(22)} ${String(m.hiloMs).padStart(8)} ${String(m.base.hiloMs).padStart(6)} ` +
    `${String((m.delta >= 0 ? '+' : '') + m.delta).padStart(7)} ${String(m.fps).padStart(6)} ` +
    `${String((m.deltaFps >= 0 ? '+' : '') + m.deltaFps).padStart(8)} ${String(m.largas).padStart(9)}  ${reparto}`
  );
}

/**
 * LOS CRITERIOS. Ninguno es «que sea gratis»: no lo es, y decirlo sería un eslogan.
 * Son los que hacen que el costo sea DEFENDIBLE en el teléfono del contrato.
 */
const problemas = [];
const MARGEN = 120;        // ruido del navegador en 6 s, sin freno

if (reposo.pixeles.total < 400) problemas.push('no pinta: el lienzo salió casi vacío');
else if (reposo.pixeles.abajo / reposo.pixeles.total < 0.7) problemas.push('no se amontona: el oro no se acumula abajo');

if (reposo.delta > MARGEN) problemas.push(`en reposo sigue gastando (+${reposo.delta} ms en 6 s)`);
if (fuera.delta > MARGEN) problemas.push(`fuera de pantalla sigue gastando (+${fuera.delta} ms en 6 s)`);
if (quieto.delta > MARGEN) problemas.push(`con reduced-motion sigue animando (+${quieto.delta} ms en 6 s)`);
if (quieto.pixeles.total < 400) problemas.push('con reduced-motion no se ve nada: debería dibujar el montón quieto');

/**
 * LAS TAREAS LARGAS SE CUENTAN SIN FRENO, Y ESTA ES LA TERCERA VEZ QUE EL FRENO
 * ENGAÑA A ESTE ARCHIVO.
 *
 * «Tarea larga» está definida como más de 50 ms. Con el reloj a 1/4, cualquier tarea
 * de 13 ms de trabajo real cruza ese umbral: no mide el código, mide el freno.
 *
 * Medido tres veces seguidas, con freno, la misma página:
 *
 *     vuelta 1   con lienzo: 50, 53 ms          sin lienzo: ninguna
 *     vuelta 2   con lienzo: ninguna            sin lienzo: ninguna
 *     vuelta 3   con lienzo: 59, 51, 50, 51, 55 sin lienzo: 145, 55 ms
 *
 * En la vuelta 3 la página SIN el lienzo salió peor que con él. Todas rondan el
 * umbral, y la carga de la propia máquina las mueve — el mismo efecto que ya
 * falseó una medición de LCP en este repo.
 *
 * Así que: las tareas largas se cuentan sin freno, donde 50 ms son 50 ms. Con freno
 * se miran los CUADROS POR SEGUNDO, que es lo que de verdad siente alguien con un
 * teléfono lento y no se inventa al frenar el reloj.
 */
if (cayendo.largas > cayendo.base.largas) problemas.push(`la caída añade ${cayendo.largas - cayendo.base.largas} tarea(s) larga(s) sin freno`);
if (reposo.largas > reposo.base.largas) problemas.push('en reposo aparecen tareas largas');
// Con el reloj a 1/4 el adorno puede ir a menos cuadros; lo que no puede es
// arrastrar la página por debajo de lo usable.
if (lento.fps < 24) problemas.push(`con CPU a 1/4 la página cae a ${lento.fps} fps durante la caída`);

console.log(`\n  peso del script: ${kb} KB gzip · el runtime de Svelte que NO se usa: ~46 KB`);
console.log(`  lo paga 1 de 8 páginas; las otras 7 siguen en 0 KB`);
console.log(`  «añade» y «vs base» son contra la MISMA página sin el lienzo, medida en la misma fase\n`);

if (problemas.length) {
  for (const x of problemas) console.error(`  ✗ ${x}`);
  console.error('');
  process.exit(1);
}
console.log('  ✓ se amontona · en reposo y fuera de pantalla no cuesta · reduced-motion no anima · sin tareas largas\n');

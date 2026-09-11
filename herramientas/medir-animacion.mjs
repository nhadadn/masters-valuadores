/**
 * Qué cuesta de verdad el destello permanente de las tarjetas de bienes.
 *
 * POR QUÉ HACE FALTA MEDIRLO. El repo tiene una regla escrita en el `CLAUDE.md`: la
 * audiencia usa «un teléfono de gama baja». Una animación en bucle sobre seis
 * elementos es exactamente el tipo de decisión que ahí se paga, y decir «es
 * compositor, no cuesta» sin medirlo es repetir un eslogan.
 *
 * Lo que se mide, con el mismo reloj del navegador:
 *
 *   RecalcStyleCount   cuántas veces recalcula estilo. Una animación de `transform`
 *                      no debería moverlo: si sube, algo la sacó del compositor.
 *   LayoutCount        cuántas veces rehace la maqueta. Igual: debe quedarse quieto.
 *   TaskDuration       segundos de hilo principal gastados en la ventana medida.
 *
 * Se compara la página CON la animación contra la MISMA página con la animación
 * apagada a mano, para que el número sea una diferencia y no una cifra suelta.
 *
 * Uso:  npx serve build -l 8124   y luego
 *       node herramientas/medir-animacion.mjs [url]
 */
import { abrirChromium } from './navegador.mjs';

const BASE = process.argv[2] ?? process.env.BASE ?? 'http://127.0.0.1:8124';
const RUTA = '/empeno-y-prestamo/';
const VENTANA_MS = Number(process.env.VENTANA ?? 6000);

const navegador = await abrirChromium();

async function medir(apagar) {
  const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  // Gama baja: el procesador también es lento.
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await p.goto(BASE + RUTA, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  // Las tarjetas TIENEN que estar a la vista: fuera de pantalla el navegador
  // puede no componer nada y el número saldría regalado.
  await p.locator('.bienes').scrollIntoViewIfNeeded();
  await p.waitForTimeout(500);

  if (apagar) {
    await p.evaluate(() => {
      for (const el of document.querySelectorAll('.destello')) el.style.animation = 'none';
    });
  }

  const cuantos = await p.evaluate(() =>
    [...document.querySelectorAll('.destello')].filter((e) => getComputedStyle(e).display !== 'none').length
  );

  await cdp.send('Performance.enable');
  const antes = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
  await p.waitForTimeout(VENTANA_MS);
  const despues = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));

  await ctx.close();
  const d = (k) => +(despues[k] - antes[k]).toFixed(3);
  return {
    destellos: cuantos,
    recalculosDeEstilo: d('RecalcStyleCount'),
    maquetados: d('LayoutCount'),
    hiloPrincipalMs: Math.round(d('TaskDuration') * 1000)
  };
}

const con = await medir(false);
const sin = await medir(true);
await navegador.close();

console.log(`\nEl destello permanente · ${RUTA} · 390 px · CPU a 1/4 · ventana de ${VENTANA_MS / 1000} s\n`);
console.log(`  ${''.padEnd(22)} ${'CON'.padStart(8)} ${'SIN'.padStart(8)}   diferencia`);
const fila = (etiqueta, k) => {
  const a = con[k], b = sin[k];
  console.log(`  ${etiqueta.padEnd(22)} ${String(a).padStart(8)} ${String(b).padStart(8)}   ${a - b >= 0 ? '+' : ''}${+(a - b).toFixed(3)}`);
};
console.log(`  ${'bandas animadas'.padEnd(22)} ${String(con.destellos).padStart(8)} ${String(sin.destellos).padStart(8)}`);
fila('recálculos de estilo', 'recalculosDeEstilo');
fila('maquetados', 'maquetados');
fila('hilo principal (ms)', 'hiloPrincipalMs');

/**
 * EL UMBRAL, Y POR QUÉ EL PRIMERO ESTABA MAL.
 *
 * La primera versión daba por «repintado» cualquier diferencia de más de 5
 * recálculos de estilo, y marcó fallo con 12 en 6 segundos. Eso son 2 por segundo.
 *
 * Una animación que repinta recalcula EN CADA CUADRO: a 60 cuadros por segundo
 * serían ~360 en esa misma ventana, no 12. Los 12 son otra cosa — seis elementos
 * que arrancan su animación una vez cada uno, más el cruce del fotograma clave del
 * 16 %. Son eventos del ciclo, no trabajo por cuadro.
 *
 * El criterio correcto no es el total: es el RITMO. Si el recálculo va atado al
 * cuadro, la cifra escala con la duración de la ventana; si va atado al ciclo de la
 * animación, se queda donde está. Se corta en 20 por segundo, un tercio de 60, que
 * deja sitio de sobra para los eventos de ciclo y ninguno para el repintado.
 */
const segundos = VENTANA_MS / 1000;
const ritmo = (con.recalculosDeEstilo - sin.recalculosDeEstilo) / segundos;
const ritmoMaquetado = (con.maquetados - sin.maquetados) / segundos;
const repinta = ritmo > 20 || ritmoMaquetado > 20;

console.log(`\n  recálculos por segundo que añade la animación: ${ritmo.toFixed(1)}`);
console.log(`  maquetados por segundo:                        ${ritmoMaquetado.toFixed(1)}`);
console.log(`  referencia: repintar por cuadro daría ~60 por segundo de cada uno`);
console.log(`\n  ${repinta ? '✗ LA ANIMACIÓN REPINTA' : '✓ la animación vive en el compositor'}` +
            ` · lo que se paga en batería es recalcular o maquetar en cada cuadro\n`);
process.exit(repinta ? 1 : 0);

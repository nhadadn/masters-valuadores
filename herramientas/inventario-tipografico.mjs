/**
 * INVENTARIO TIPOGRÁFICO · ADR-0053.
 *
 * Qué hace: abre las nueve páginas a 390 y a 1280, junta TODO texto visible —con los
 * desplegables abiertos— y lo agrupa por familia, tamaño, peso, espaciado y caja. Cada
 * combinación sale con cuántas veces aparece y dónde.
 *
 * Por qué existe: el 16 de septiembre de 2026 había 31 combinaciones distintas. Parte era
 * escala de la casa y parte mezcolanza acumulada sin que nadie la decidiera: un 15 px entre
 * el 14 y el 17, un peso 800 que el sitio ni carga, una cinta en mayúsculas delgadas porque
 * heredó los tokens del titular Garamond. Ningún test lo veía: son estilos computados.
 *
 * El guardia: lo que no está en PERMITIDAS de abajo es mezcolanza y sale con código 1. Si una
 * combinación nueva es a propósito, se añade aquí CON SU RAZÓN. Así la próxima deja de
 * colarse en silencio.
 *
 * Uso:  npx serve build -l <puerto> --no-port-switching   y luego
 *       BASE=http://127.0.0.1:<puerto> node herramientas/inventario-tipografico.mjs
 */
import { abrirChromium } from './navegador.mjs';

const BASE = process.env.BASE ?? 'http://127.0.0.1:5180';
const RUTAS = ['/', '/empeno-y-prestamo/', '/venta/', '/financiamiento/', '/fletes/', '/taller/', '/contacto/', '/aviso-de-privacidad/', '/terminos/'];

/** familia · tamaño · peso · espaciado [· MAYÚS] → por qué está permitida. */
const PERMITIDAS = new Map([
  // ── La escala de la casa, en tokens.css ──
  ['Archivo · 13px · 700 · 0.12em', 'etiqueta: cejas y rótulos, escritos ya en mayúsculas'],
  ['Archivo · 14px · 400 · 0', 'pie: texto de apoyo'],
  ['Archivo · 14px · 600 · 0', 'pie con énfasis: enlaces de acción chicos'],
  ['Archivo · 14px · 700 · 0', 'numeral de los discos de pregunta'],
  ['Archivo · 17px · 400 · 0', 'cuerpo'],
  ['Archivo · 17px · 600 · 0', 'cuerpo fuerte: botones y títulos de pieza en lista'],
  ['Archivo · 18px · 600 · 0', 'h3: título de pieza'],
  ['Archivo · 22px · 700 · 0', 'h2: título de sección'],
  ['Archivo · 28px · 700 · 0', 'h1 de las páginas sin titular Garamond'],
  ['Archivo · 34px · 700 · 0', 'display: la pieza mayor del mosaico en escritorio'],
  ['Archivo · 18px · 700 · 0.12em · MAYÚS', 'la cinta de palabras: mayúsculas de etiqueta, a h3'],
  // ── La marca escrita: es logotipo, sigue su lockup y no la escala ──
  ['Archivo · 19px · 700 · 0.03em', 'lockup de la cabecera: MASTER'],
  ['Archivo · 9px · 700 · 0.20em', 'lockup de la cabecera: VALUADORES'],
  ['Archivo · 17px · 700 · 0.03em', 'lockup del pie: MASTER VALUADORES'],
  ['Archivo · 40px · 700 · 0.03em', 'lockup del lienzo de ubicación, teléfono: MASTER'],
  ['Archivo · 19px · 700 · 0.20em', 'lockup del lienzo de ubicación, teléfono: VALUADORES'],
  ['Archivo · 64px · 700 · 0.03em', 'lockup del lienzo de ubicación, escritorio: MASTER'],
  ['Archivo · 30px · 700 · 0.20em', 'lockup del lienzo de ubicación, escritorio: VALUADORES'],
  // ── La segunda familia, solo en titular y promesa · ADR-0029 ──
  ['Garamond Display · 34px · 400 · -0.01em', 'titular largo de la portada, teléfono'],
  ['Garamond Display · 44px · 400 · -0.01em', 'titular, teléfono'],
  ['Garamond Display · 68px · 400 · -0.01em', 'titular, escritorio'],
  ['Garamond Display · 24px · 400 · 0', 'promesa, teléfono'],
  ['Garamond Display · 28px · 400 · 0', 'promesa, escritorio'],
  // ── Fuera de escala, a sabiendas ──
  ['Archivo · 10px · 700 · 0', 'rótulos del planeta, teléfono: el disco no da para más. Pendiente de revisar'],
  ['Archivo · 12.5px · 700 · 0', 'rótulos del planeta, escritorio'],
]);

const navegador = await abrirChromium();
const grupos = new Map();
for (const ancho of [390, 1280]) {
  const movil = ancho < 768;
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: 900 }, isMobile: movil, hasTouch: movil, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  for (const ruta of RUTAS) {
    await p.goto(BASE + ruta, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    // Los desplegables abiertos, menos el mapa: su texto también es del sitio.
    await p.evaluate(() => { for (const d of document.querySelectorAll('details:not(.mapa)')) d.open = true; });
    await p.waitForTimeout(150);
    const filas = await p.evaluate(() => {
      const salida = [];
      const donde = (el) => {
        const partes = [];
        for (let n = el; n && n !== document.body && partes.length < 3; n = n.parentElement) {
          const c = [...n.classList].filter((x) => !x.startsWith('svelte-'))[0];
          partes.unshift(n.tagName.toLowerCase() + (c ? '.' + c : ''));
        }
        return partes.join(' > ');
      };
      for (const el of document.querySelectorAll('body *')) {
        const texto = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
        if (!texto) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || el.closest('[hidden], svg, script, style')) continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        const px = parseFloat(cs.fontSize);
        const tracking = cs.letterSpacing === 'normal' ? '0' : (parseFloat(cs.letterSpacing) / px).toFixed(2) + 'em';
        const clave = `${cs.fontFamily.split(',')[0].replace(/["']/g, '').trim()} · ${Math.round(px * 10) / 10}px · ${cs.fontWeight} · ${tracking}` +
          (cs.textTransform === 'uppercase' ? ' · MAYÚS' : '') + (cs.fontStyle === 'italic' ? ' · itálica' : '');
        salida.push({ clave, texto: texto.slice(0, 40), donde: donde(el) });
      }
      return salida;
    });
    for (const f of filas) {
      const g = grupos.get(f.clave) ?? { n: 0, rutas: new Set(), ejemplo: `${f.donde} «${f.texto}»` };
      g.n++; g.rutas.add(`${ruta}@${ancho}`);
      grupos.set(f.clave, g);
    }
  }
  await ctx.close();
}
await navegador.close();

const lista = [...grupos].sort((a, b) => b[1].n - a[1].n);
const intrusas = lista.filter(([clave]) => !PERMITIDAS.has(clave));
console.log(`\nInventario tipográfico · ${RUTAS.length} páginas × 390 y 1280 · ${lista.length} combinaciones\n`);
for (const [clave, g] of lista) {
  console.log(`  ${PERMITIDAS.has(clave) ? '✓' : '✗'} ${String(g.n).padStart(4)}  ${clave.padEnd(46)} ${PERMITIDAS.get(clave) ?? g.ejemplo}`);
}
if (intrusas.length) {
  console.log(`\n✗ ${intrusas.length} combinación(es) fuera de la escala. Se corrigen, o se añaden a PERMITIDAS con su razón.\n`);
  process.exit(1);
}
console.log('\n✓ Ninguna combinación fuera de la escala.\n');

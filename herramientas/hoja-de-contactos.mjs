/**
 * Hoja de contactos numerada del material que llega en `docs/00-inbox/`.
 *
 * POR QUÉ. Una tanda del cliente son veinte o treinta fotos con nombres de WhatsApp
 * —«WhatsApp Image 2026-09-11 at 4.54.38 PM (3).jpeg»— que no dicen nada. Mirarlas de
 * una en una es lento y deja sin forma de referirse a ellas: «la tercera de la
 * segunda tanda» no es una referencia.
 *
 * Esto arma una rejilla numerada. El número de la hoja es el mismo que el orden
 * alfabético del archivo, así que sirve para hablar: «la 7 y la 19 son la fachada».
 *
 *   node herramientas/hoja-de-contactos.mjs [carpeta] [destino]
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { abrirChromium } from './navegador.mjs';

const DIR = process.argv[2] ?? 'docs/00-inbox';
const DESTINO = process.argv[3] ?? 'hoja-de-contactos.png';
const COLUMNAS = 4;
const CELDA = 320;

const archivos = readdirSync(DIR).filter((n) => /\.(jpe?g|png|webp)$/i.test(n)).sort();
if (!archivos.length) { console.error(`✗ No hay imágenes en ${DIR}`); process.exit(1); }

const datos = archivos.map((n, i) => ({
  n: i + 1,
  nombre: n,
  kb: Math.round(statSync(join(DIR, n)).size / 1024),
  uri: 'data:image/jpeg;base64,' + readFileSync(join(DIR, n)).toString('base64')
}));

const filas = Math.ceil(datos.length / COLUMNAS);
const navegador = await abrirChromium();
const p = await navegador.newPage({
  viewport: { width: COLUMNAS * CELDA, height: filas * (CELDA + 26) }
});

await p.setContent(`
  <style>
    body { margin:0; background:#111417; font-family: system-ui, sans-serif; }
    .rejilla { display:grid; grid-template-columns: repeat(${COLUMNAS}, ${CELDA}px); }
    figure { margin:0; position:relative; }
    img { width:${CELDA}px; height:${CELDA}px; object-fit:cover; display:block; }
    figcaption {
      height:26px; line-height:26px; color:#e7c041; background:#000;
      font-size:13px; font-weight:700; padding-left:8px;
    }
    .n {
      position:absolute; top:6px; left:6px; background:#e7c041; color:#000;
      font-size:15px; font-weight:800; padding:2px 8px; border-radius:3px;
    }
  </style>
  <div class="rejilla">
    ${datos.map((d) => `
      <figure>
        <span class="n">${d.n}</span>
        <img src="${d.uri}">
        <figcaption>${d.n} · ${d.kb} KB</figcaption>
      </figure>`).join('')}
  </div>
`);
await p.waitForTimeout(600);
await p.screenshot({ path: DESTINO, fullPage: true });
await navegador.close();

console.log(`\n  ${datos.length} imágenes · ${DESTINO}\n`);
for (const d of datos) console.log(`  ${String(d.n).padStart(2)}  ${d.nombre}`);
console.log('');

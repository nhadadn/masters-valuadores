/**
 * Genera los anchos chicos de cada foto · 400 y 600 px.
 *
 * POR QUÉ HACEN FALTA. Las tarjetas de «Elige la línea que buscas» miden unos 175 px
 * de ancho en un teléfono y unos 280 en escritorio. Las únicas versiones que existían
 * eran de 800 y 1600 px, así que cada tarjeta habría descargado una foto entre tres y
 * nueve veces más grande de lo que puede enseñar.
 *
 * Con cuatro tarjetas eso son cientos de kilobytes por una fila de miniaturas, en la
 * página que acaba de bajar de 590 a 140 KB. No se pone una imagen a costa de eso.
 *
 * Los anchos salen de la medida, no del gusto:
 *   · tarjeta en teléfono   175 px CSS × 2 de densidad = 350 → cabe en 400
 *   · tarjeta en escritorio 280 px CSS × 2 de densidad = 560 → cabe en 600
 *
 * Se corre a mano cuando cambien las fotos. El resultado se versiona.
 *   node herramientas/hacer-miniaturas.mjs
 */
import { readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { abrirChromium } from './navegador.mjs';

const FOTOS = ['empeno', 'maquinaria', 'fletes', 'taller', 'fachada'];
const ANCHOS = [400, 600];
const CALIDAD = 0.78;

const navegador = await abrirChromium();
const p = await navegador.newPage();
const kb = (f) => (statSync(f).size / 1024).toFixed(1);
const filas = [];

for (const nombre of FOTOS) {
  const origen = `static/fotos/${nombre}-1600.jpg`;
  if (!existsSync(origen)) { console.log(`  ⚠ no existe ${origen}`); continue; }
  const dataUri = 'data:image/jpeg;base64,' + readFileSync(origen).toString('base64');

  for (const ancho of ANCHOS) {
    const destino = `static/fotos/${nombre}-${ancho}.jpg`;
    const base64 = await p.evaluate(async (a) => {
      const img = new Image();
      img.src = a.dataUri;
      await img.decode();
      const alto = Math.round((img.naturalHeight / img.naturalWidth) * a.ancho);
      const c = document.createElement('canvas');
      c.width = a.ancho; c.height = alto;
      const cx = c.getContext('2d');
      cx.imageSmoothingQuality = 'high';
      cx.drawImage(img, 0, 0, a.ancho, alto);
      return c.toDataURL('image/jpeg', a.CALIDAD).split(',')[1];
    }, { dataUri, ancho, CALIDAD });
    writeFileSync(destino, Buffer.from(base64, 'base64'));
    filas.push({ archivo: destino, kb: kb(destino) });
  }
}

await navegador.close();

console.log(`\nMiniaturas · calidad ${CALIDAD}\n`);
for (const f of filas) console.log(`  ${String(f.kb).padStart(6)} KB  ${f.archivo}`);
const suma400 = filas.filter((f) => f.archivo.includes('-400')).reduce((a, b) => a + +b.kb, 0);
const suma600 = filas.filter((f) => f.archivo.includes('-600')).reduce((a, b) => a + +b.kb, 0);
console.log(`\n  Las cuatro de giro a 400: ~${(suma400 - +(filas.find((f) => f.archivo.includes('fachada-400'))?.kb ?? 0)).toFixed(1)} KB`);
console.log(`  Las cuatro de giro a 600: ~${(suma600 - +(filas.find((f) => f.archivo.includes('fachada-600'))?.kb ?? 0)).toFixed(1)} KB\n`);

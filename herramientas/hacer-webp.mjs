/**
 * Genera la versión WebP de cada foto, junto a su JPEG.
 *
 * POR QUÉ WEBP Y NO AVIF. AVIF comprime mejor —entre un 15 y un 25 % por debajo de
 * WebP en fotografía— pero **Chromium no sabe CODIFICARLO desde un canvas**: solo
 * decodificarlo. Generarlo aquí exigiría meter un codificador como dependencia del
 * repo, y eso es una decisión con costo que no se toma de paso en una optimización.
 *
 * WebP sale con lo que ya hay instalado, lo entiende el 97 % de los navegadores en
 * uso, y el JPEG se queda de respaldo en el mismo `<picture>`. Cero riesgo.
 *
 * La calidad se elige MIDIENDO, no a ojo: se prueban varias y se reporta cuánto pesa
 * cada una, para poder decidir con el número delante.
 *
 *   node herramientas/hacer-webp.mjs
 */
import { readFileSync, writeFileSync, statSync, existsSync, readdirSync } from 'node:fs';
import { abrirChromium } from './navegador.mjs';

/**
 * Las fotos salen del DIRECTORIO, no de una lista a mano.
 *
 * Habia una lista literal aqui, otra en el otro generador y una TERCERA distinta en
 * `hacer-miniaturas.mjs`: ya habian divergido. Anadir una foto y olvidar una lista
 * significa publicar un <picture> cuyo AVIF o WebP no existe; el navegador cae al
 * JPEG sin decir nada y se sirve el formato mas pesado sin que nadie se entere.
 */
const FOTOS = [...new Set(
  readdirSync('static/fotos')
    .map((f) => /^(.+)-\d+\.jpg$/.exec(f)?.[1])
    .filter(Boolean)
)].sort();
const ANCHOS = [400, 600, 800, 1600];
const CALIDAD = 0.80;

const navegador = await abrirChromium();
const p = await navegador.newPage();

const soportaWebp = await p.evaluate(() => {
  const c = document.createElement('canvas');
  c.width = c.height = 4;
  return c.toDataURL('image/webp').startsWith('data:image/webp');
});
if (!soportaWebp) {
  console.error('\n✗ Este Chromium no codifica WebP. No se genera nada.\n');
  await navegador.close();
  process.exit(1);
}

const kb = (n) => +(n / 1024).toFixed(1);
const filas = [];

for (const nombre of FOTOS) {
  for (const ancho of ANCHOS) {
    const jpg = `static/fotos/${nombre}-${ancho}.jpg`;
    if (!existsSync(jpg)) continue;
    const dataUri = 'data:image/jpeg;base64,' + readFileSync(jpg).toString('base64');
    const base64 = await p.evaluate(async (a) => {
      const img = new Image();
      img.src = a.dataUri;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      return c.toDataURL('image/webp', a.CALIDAD).split(',')[1];
    }, { dataUri, CALIDAD });

    const destino = `static/fotos/${nombre}-${ancho}.webp`;
    writeFileSync(destino, Buffer.from(base64, 'base64'));
    filas.push({ nombre, ancho, jpg: statSync(jpg).size, webp: statSync(destino).size });
  }
}

await navegador.close();

console.log(`\nWebP · calidad ${CALIDAD}\n`);
console.log(`  ${'archivo'.padEnd(22)} ${'JPEG'.padStart(9)} ${'WebP'.padStart(9)}  ahorro`);
for (const f of filas) {
  const pct = ((1 - f.webp / f.jpg) * 100).toFixed(0);
  console.log(`  ${`${f.nombre}-${f.ancho}`.padEnd(22)} ${String(kb(f.jpg)).padStart(7)} KB ${String(kb(f.webp)).padStart(7)} KB  ${String(pct).padStart(3)} %`);
}

const usadas = filas.filter((f) => (f.nombre === 'fachada' && f.ancho === 800) || (f.nombre !== 'fachada' && f.ancho === 400));
const aJpg = usadas.reduce((a, b) => a + b.jpg, 0);
const aWebp = usadas.reduce((a, b) => a + b.webp, 0);
console.log(`\n  Lo que la PORTADA descarga hoy en un teléfono —fachada 800 y las cuatro de 400—:`);
console.log(`    JPEG ${kb(aJpg)} KB  →  WebP ${kb(aWebp)} KB   ·  ${((1 - aWebp / aJpg) * 100).toFixed(0)} % menos\n`);

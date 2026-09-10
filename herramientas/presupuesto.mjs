/**
 * CA-10 · Presupuesto de JavaScript inicial.
 *
 * «JS inicial» es lo que el navegador descarga para pintar UNA página, no la suma
 * de todos los chunks del sitio. La primera versión de este script sumaba el
 * directorio entero y daba 41.48 KB — un número que no le pasa a ningún visitante.
 *
 * Ahora se mide como se vive: se abre cada HTML prerenderizado, se junta lo que
 * ESA página referencia, y se reporta la peor. Si la peor se pasa, el build falla.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const LIMITE_KB = 40;
const BUILD = 'build';

if (!existsSync(BUILD)) { console.error(`✗ No existe ${BUILD}/. ¿Corrió el build?`); process.exit(1); }

const paginas = [];
(function caminar(d) {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) { if (n !== '_app') caminar(p); }
    else if (n.endsWith('.html')) paginas.push(p);
  }
})(BUILD);

const gz = (p) => gzipSync(readFileSync(p)).length;

const medidas = paginas.map((pagina) => {
  const html = readFileSync(pagina, 'utf8');
  const refs = new Set(html.match(/_app\/immutable\/[A-Za-z0-9/_.-]+\.js/g) ?? []);
  let bytes = 0; const faltantes = [];
  for (const r of refs) {
    const f = join(BUILD, r);
    if (existsSync(f)) bytes += gz(f); else faltantes.push(r);
  }
  return {
    ruta: '/' + relative(BUILD, pagina).replace(/index\.html$/, '').replace(/\\/g, '/'),
    archivos: refs.size,
    kb: +(bytes / 1024).toFixed(2),
    htmlKb: +(gz(pagina) / 1024).toFixed(2),
    faltantes
  };
}).sort((a, b) => b.kb - a.kb);

console.log(`\nPresupuesto de JS inicial · CA-10 · límite ${LIMITE_KB} KB gzip por página\n`);
console.log(`   ${'JS'.padStart(8)}  ${'HTML'.padStart(7)}  ${'arch.'.padStart(5)}  RUTA`);
for (const m of medidas) {
  console.log(`   ${String(m.kb).padStart(8)}  ${String(m.htmlKb).padStart(7)}  ${String(m.archivos).padStart(5)}  ${m.ruta}`);
}

const peor = medidas[0];
console.log(`   ${'─'.repeat(56)}`);
console.log(`   Peor página: ${peor.ruta} con ${peor.kb} KB de JS gzip.`);
console.log(`   ${paginas.length} páginas prerenderizadas.`);

if (peor.kb > LIMITE_KB) {
  console.error(`\n✗ CA-10 INCUMPLIDO: ${peor.kb} KB > ${LIMITE_KB} KB en ${peor.ruta}\n`);
  process.exit(1);
}
console.log(`   ✓ CA-10 cumplido · margen de ${(LIMITE_KB - peor.kb).toFixed(2)} KB en la peor página\n`);

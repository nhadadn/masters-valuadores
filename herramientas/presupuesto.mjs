/**
 * CA-10 · Presupuesto de lo que descarga el visitante.
 *
 * «JS inicial» es lo que el navegador descarga para pintar UNA página, no la suma
 * de todos los chunks del sitio. La primera versión de este script sumaba el
 * directorio entero y daba 41.48 KB — un número que no le pasa a ningún visitante.
 *
 * Ahora se mide como se vive: se abre cada HTML prerenderizado, se junta lo que
 * ESA página referencia, y se reporta la peor. Si la peor se pasa, el build falla.
 *
 * ── POR QUÉ ESTE GUARDIA CRECIÓ · 11 de septiembre ──────────────────────────
 *
 * Durante meses este script reportó «0 KB de JS · margen de 40 KB» y era cierto.
 * El 11 de septiembre entró el mapa incrustado (ADR-0015) y siguió reportando lo
 * mismo, mientras `herramientas/medir-portada.mjs` medía sobre el sitio en vivo:
 *
 *     425.6 KB de JavaScript · 450.1 KB de terceros · LCP de 4464 ms
 *
 * El guardia no falló: se quedó midiendo lo que ya no era el problema. Contaba el
 * bundle propio —lo único que existía cuando se escribió— y un tercero entero le
 * pasó por al lado sin encender una luz.
 *
 * La lección, que es la misma del validador de accesibilidad y su lista a mano: un
 * verificador que mide una parte da una falsa tranquilidad PEOR que no medir nada,
 * porque alguien confía en él.
 *
 * Así que ahora vigila dos cosas:
 *   1 · El JS propio por página, como siempre.
 *   2 · Que NO aparezca un origen de tercero sin declarar. Cada tercero entra con
 *       nombre, ADR y razón, o el build falla.
 *
 * El PESO real de cada tercero no se puede leer del HTML: hay que cargar la página.
 * Eso lo mide `medir-portada.mjs`, que se corre contra el sitio servido.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const LIMITE_KB = 40;

/**
 * Por omisión mide `build/`, que es lo que corre `npm run build`. Se puede apuntar a
 * otro directorio para PROBAR EL GUARDIA CONTRA PÁGINAS FALSAS — ver
 * `tests/presupuesto.test.ts`. Un verificador que nadie verifica es una creencia.
 */
const BUILD = process.argv[2] ?? 'build';

/**
 * TERCEROS DECLARADOS. Uno por línea, con quién lo autorizó.
 *
 * Añadir un origen aquí es una decisión, no un trámite: cada uno carga código en el
 * navegador del visitante, puede registrar la visita, y ninguno cuenta contra el
 * presupuesto de 40 KB porque ese presupuesto mide el bundle propio.
 *
 * Si el build falla por esta lista, la pregunta no es «¿cómo lo añado?» sino
 * «¿quién decidió que esto entre y dónde está escrito?».
 */
const TERCEROS_DECLARADOS = [
  // ADR-0015 · el mapa de Google. Desde el ADR-0016 no se descarga hasta que
  // alguien lo toca, así que el visitante que no lo pide no paga ninguno de estos.
  { origen: 'maps.google.com', porQue: 'ADR-0015 · mapa incrustado' },
  { origen: 'www.google.com', porQue: 'ADR-0015 · redirección del mapa' },
  { origen: 'maps.googleapis.com', porQue: 'ADR-0015 · JS del mapa' },
  { origen: 'maps.gstatic.com', porQue: 'ADR-0015 · azulejos del mapa' },
  { origen: 'fonts.googleapis.com', porQue: 'ADR-0015 · tipografía del mapa' },
  { origen: 'fonts.gstatic.com', porQue: 'ADR-0015 · tipografía del mapa' },
  // La ficha del negocio: es un enlace de salida, no carga nada.
  { origen: 'schema.org', porQue: 'vocabulario del JSON-LD · no se descarga' }
];

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
const gzTexto = (s) => gzipSync(Buffer.from(s, 'utf8')).length;

/**
 * ¿Ese <script> ejecuta código, o solo transporta datos?
 *
 * El grafo se sirve en <script type="application/ld+json">: son datos, el navegador
 * no ejecuta nada, y su peso ya está contado en la columna HTML. Hay 8, uno por
 * página, y contarlos como JavaScript sería mentir en la otra dirección.
 *
 * La regla va al revés de como se escribiría por comodidad: solo se descarta lo que
 * se RECONOCE como datos, y un `type` desconocido cuenta como JavaScript. Si mañana
 * aparece uno nuevo, el guardia se pasa de pesimista —que se nota y se arregla— en
 * vez de callarse, que es exactamente como se le fue el mapa por al lado.
 */
const TIPOS_DE_DATOS = /^(application\/(ld\+)?json|text\/(template|plain)|importmap|speculationrules)$/i;
const ejecuta = (tipo) => !tipo || !TIPOS_DE_DATOS.test(tipo.trim());

/**
 * ── EL HUECO QUE ESTO TAPA · 11 de septiembre, segunda vez ───────────────────
 *
 * Hasta hoy aquí solo se leía `_app/immutable/…*.js`, el bundle del marco. Medido
 * contra cinco formas de meter JavaScript en la página, tres pasaban invisibles:
 *
 *     bundle de SvelteKit                       SÍ · contaba bytes
 *     librería propia servida desde static/     NO — INVISIBLE
 *     librería de node_modules copiada a static NO — INVISIBLE
 *     <script> en línea                         NO — INVISIBLE
 *     librería desde un CDN                     SÍ · exigía declararla
 *
 * O sea: el camino más barato para animar —un script propio, sin marco— era también
 * el único que el guardia no sabía ver. Habría impreso «✓ CA-10 cumplido · margen de
 * 40 KB» mientras mandaba la librería entera al teléfono de gama baja del contrato.
 *
 * Es la MISMA falla del encabezado, cometida dos veces en el mismo archivo: medir la
 * parte que existía cuando se escribió el verificador. Ahora se cuenta todo lo que el
 * navegador va a ejecutar, venga de donde venga.
 */
const medidas = paginas.map((pagina) => {
  const html = readFileSync(pagina, 'utf8');
  const ruta = '/' + relative(BUILD, pagina).replace(/index\.html$/, '').replace(/\\/g, '/');

  // Archivos que ESTA página descarga. Es un Set: un archivo referenciado dos veces
  // se descarga una vez, y el visitante lo paga una vez.
  const archivos = new Set(html.match(/_app\/immutable\/[A-Za-z0-9/_.-]+\.js/g) ?? []);
  let bytesEnLinea = 0;
  let bloquesEnLinea = 0;

  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, atributos, cuerpo] = m;
    if (!ejecuta(/\btype\s*=\s*["']?([^"'\s>]+)/i.exec(atributos)?.[1])) continue;

    const src = /\bsrc\s*=\s*["']([^"']+)["']/i.exec(atributos)?.[1];
    if (src === undefined) {
      // En línea: pesa lo que pese su cuerpo, comprimido como llega.
      if (cuerpo.trim()) { bytesEnLinea += gzTexto(cuerpo); bloquesEnLinea++; }
    } else if (!/^(https?:)?\/\//i.test(src)) {
      // Del mismo dominio. Se normaliza a ruta dentro de build/ para que el Set
      // reconozca «/x.js» y «x.js» como el mismo archivo.
      archivos.add(src.split(/[?#]/)[0].replace(/^\//, ''));
    }
    // Los de otro dominio no se pesan aquí: no se pueden leer del disco. Los caza
    // el bloque de TERCEROS, que exige declararlos con ADR.
  }

  let bytes = bytesEnLinea;
  const faltantes = [];
  for (const r of archivos) {
    const f = join(BUILD, r);
    if (existsSync(f)) bytes += gz(f); else faltantes.push(r);
  }
  return {
    ruta,
    archivos: archivos.size + bloquesEnLinea,
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

/**
 * ── TERCEROS ────────────────────────────────────────────────────────────────
 * Se buscan los orígenes externos que cada página REFERENCIA: `src` y `href` de
 * iframe, script, link e img. No se miran los enlaces de texto (`<a href>`): un
 * enlace de salida no descarga nada, lo abre el visitante si quiere.
 */
const declarados = new Set(TERCEROS_DECLARADOS.map((t) => t.origen));
const hallados = new Map();

for (const pagina of paginas) {
  const html = readFileSync(pagina, 'utf8');
  const ruta = '/' + relative(BUILD, pagina).replace(/index\.html$/, '').replace(/\\/g, '/');
  for (const m of html.matchAll(/<(iframe|script|link|img)\b[^>]*?\b(?:src|href)=["'](https?:\/\/[^"']+)["']/gi)) {
    let host;
    try { host = new URL(m[2]).hostname; } catch { continue; }
    if (!hallados.has(host)) hallados.set(host, new Set());
    hallados.get(host).add(ruta);
  }
}

const sinDeclarar = [...hallados.keys()].filter((h) => !declarados.has(h));

console.log(`\nTerceros que el HTML carga · CA-10\n`);
if (hallados.size === 0) {
  console.log('   ninguno · el visitante solo descarga de este dominio');
} else {
  for (const [host, rutas] of hallados) {
    const d = TERCEROS_DECLARADOS.find((t) => t.origen === host);
    console.log(`   ${d ? '·' : '✗'} ${host.padEnd(24)} ${rutas.size} página(s)  ${d ? d.porQue : 'SIN DECLARAR'}`);
  }
}

if (sinDeclarar.length) {
  console.error(
    `\n✗ CA-10 INCUMPLIDO · ${sinDeclarar.length} tercero(s) sin declarar: ${sinDeclarar.join(', ')}\n\n` +
    `  Un tercero carga código en el navegador del visitante y no cuenta contra el\n` +
    `  presupuesto de ${LIMITE_KB} KB, que mide el bundle propio. Por eso entra con\n` +
    `  nombre y ADR en TERCEROS_DECLARADOS de este archivo, o no entra.\n\n` +
    `  Para saber cuánto pesa de verdad: node herramientas/medir-portada.mjs\n`
  );
  process.exit(1);
}

/**
 * `faltantes` se venía calculando desde siempre y no se imprimía en ningún lado.
 * Un <script src> que apunta a un archivo que no está en build/ pesaba CERO y no
 * decía nada: el peor resultado posible, porque el número sale bajo y parece bueno.
 * O el archivo existe y se pesa, o el guardia lo dice.
 */
const rotos = medidas.filter((m) => m.faltantes.length);
if (rotos.length) {
  console.error(`\n✗ CA-10 INCUMPLIDO · ${rotos.length} página(s) piden JS que no está en ${BUILD}/\n`);
  for (const m of rotos) console.error(`  ${m.ruta}  →  ${m.faltantes.join(', ')}`);
  console.error(`\n  No se puede pesar lo que no existe. Mientras esté roto, el número de\n  arriba sale más bajo de lo que el visitante va a pagar.\n`);
  process.exit(1);
}

if (peor.kb > LIMITE_KB) {
  console.error(`\n✗ CA-10 INCUMPLIDO: ${peor.kb} KB > ${LIMITE_KB} KB en ${peor.ruta}\n`);
  process.exit(1);
}
console.log(`   ✓ CA-10 cumplido · margen de ${(LIMITE_KB - peor.kb).toFixed(2)} KB en la peor página\n`);

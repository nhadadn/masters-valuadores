/**
 * Genera la versión AVIF de cada foto, junto al WebP y al JPEG.
 *
 * ── POR QUÉ ESTA NO USA EL NAVEGADOR, COMO LAS OTRAS ───────────────────────
 * `hacer-webp.mjs` y `hacer-miniaturas.mjs` codifican con el canvas de Chromium,
 * que ya está instalado para los verificadores. Con AVIF eso NO funciona, y falla
 * de la peor manera: **en silencio**. Comprobado el 11 de septiembre —
 *
 *     canvas.toDataURL('image/avif')        →  devuelve  image/png
 *     OffscreenCanvas.convertToBlob(avif)   →  devuelve  image/png
 *
 * Chromium sabe DECODIFICAR AVIF; no sabe codificarlo. Y en vez de avisar, entrega
 * un PNG con el nombre que le pediste. Un archivo llamado `.avif` que en realidad es
 * un PNG sería más pesado que el JPEG que venía a sustituir.
 *
 * Así que esto usa **ffmpeg**, que sí trae `libaom-av1` y el muxer `avif`.
 *
 * ── LO QUE ESO CUESTA, Y HAY QUE DECIRLO ──────────────────────────────────
 * ffmpeg es una herramienta DEL SISTEMA, no una dependencia del repo. Este script
 * solo corre donde esté instalado. Es exactamente la clase de defecto que ya se
 * arregló una vez aquí —los cuatro verificadores que importaban Playwright desde
 * `/opt/` y solo corrían en una máquina— así que se acota igual:
 *
 *   · Se comprueba ffmpeg ANTES de hacer nada y se falla diciendo qué falta.
 *   · Se corre A MANO cuando cambian las fotos, nunca en el build.
 *   · El resultado se versiona, así que quien no tenga ffmpeg igual construye y
 *     despliega el sitio completo. Solo no puede REGENERAR.
 *
 * ── LA CALIDAD SE ELIGE MIDIENDO ──────────────────────────────────────────
 * Con SSIM contra el JPEG del mismo ancho, no a ojo. Barrido sobre `fachada-800`:
 *
 *     crf 24   51.9 KB   0.988        crf 38   26.9 KB   0.961
 *     crf 30   41.0 KB   0.980        crf 42   21.6 KB   0.948
 *     crf 34   33.5 KB   0.971
 *
 * Se toma **crf 30**: 0.980 es el umbral donde la diferencia deja de verse, y ahí
 * el archivo pesa un tercio menos que el WebP.
 *
 * `yuv444p` y no `yuv420p`: la fachada tiene el amarillo de la marca a plena
 * saturación y el submuestreo de color lo emborrona en los bordes. Medido, cuesta
 * 4.4 KB y sube el SSIM de 0.980 a 0.984. Barato para la única foto real que hay.
 *
 *   node herramientas/hacer-avif.mjs
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { statSync, existsSync } from 'node:fs';

const FOTOS = ['fachada', 'empeno', 'maquinaria', 'fletes', 'taller', 'patio'];
const ANCHOS = [400, 600, 800, 1600];
const CRF = 30;
const PIX = 'yuv444p';

function hayFfmpeg() {
  try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); return true; }
  catch { return false; }
}

if (!hayFfmpeg()) {
  console.error(
    '\n✗ No hay ffmpeg, y este script no puede hacer su trabajo sin él.\n\n' +
    '  Chromium —que es lo que usan los otros generadores— NO codifica AVIF:\n' +
    '  devuelve un PNG disfrazado, sin avisar. Ver la nota de arriba.\n\n' +
    '  Se instala desde https://ffmpeg.org o con el gestor de paquetes del sistema.\n\n' +
    '  NO HACE FALTA PARA CONSTRUIR NI DESPLEGAR: los .avif están versionados.\n' +
    '  Solo hace falta para regenerarlos cuando cambien las fotos.\n'
  );
  process.exit(1);
}

const kb = (p) => +(statSync(p).size / 1024).toFixed(1);
const filas = [];

for (const nombre of FOTOS) {
  for (const ancho of ANCHOS) {
    const jpg = `static/fotos/${nombre}-${ancho}.jpg`;
    if (!existsSync(jpg)) continue;
    const avif = `static/fotos/${nombre}-${ancho}.avif`;

    // Se recodifica solo si hace falta. libaom es lento y regenerar veinte imágenes
    // sin motivo son minutos tirados cada vez que se quiere releer una medida.
    const alDia = existsSync(avif) && statSync(avif).mtimeMs >= statSync(jpg).mtimeMs;
    if (!alDia) {
      execFileSync('ffmpeg', [
        '-y', '-hide_banner', '-loglevel', 'error',
        '-i', jpg,
        '-c:v', 'libaom-av1',
        '-crf', String(CRF),
        '-cpu-used', '4',
        '-still-picture', '1',
        '-pix_fmt', PIX,
        avif
      ], { stdio: ['ignore', 'ignore', 'inherit'] });
    }

    /**
     * SSIM contra el JPEG del mismo ancho: no es «igual al original» —el JPEG ya es
     * lossy— sino «igual a lo que el visitante ve hoy», que es la comparación útil.
     *
     * SE LEE DE stderr, Y ESO COSTÓ UNA COLUMNA VACÍA. La primera versión leía la
     * salida estándar y la tabla entera reportó «—» sin fallar: ffmpeg escribe las
     * medidas del filtro en el canal de error, no en el de salida. Una medición que
     * no mide y tampoco protesta es peor que no tenerla.
     */
    const m = spawnSync('ffmpeg', [
      '-hide_banner', '-i', jpg, '-i', avif, '-lavfi', 'ssim', '-f', 'null', '-'
    ], { encoding: 'utf8' });
    const ssim = (String(m.stderr ?? '').match(/All:([0-9.]+)/) ?? [])[1] ?? '—';

    const webp = `static/fotos/${nombre}-${ancho}.webp`;
    filas.push({
      archivo: `${nombre}-${ancho}`,
      jpg: kb(jpg),
      webp: existsSync(webp) ? kb(webp) : null,
      avif: kb(avif),
      ssim
    });
  }
}

console.log(`\nAVIF · libaom-av1 · crf ${CRF} · ${PIX}\n`);
console.log(`  ${'archivo'.padEnd(18)} ${'JPEG'.padStart(8)} ${'WebP'.padStart(8)} ${'AVIF'.padStart(8)}   vs WebP   SSIM`);
for (const f of filas) {
  const pct = f.webp ? `${(((f.webp - f.avif) / f.webp) * 100).toFixed(0)} %` : '—';
  console.log(
    `  ${f.archivo.padEnd(18)} ${String(f.jpg).padStart(6)} KB ${String(f.webp ?? '—').padStart(6)} KB ` +
    `${String(f.avif).padStart(6)} KB   ${pct.padStart(6)}   ${f.ssim}`
  );
}

// Lo que la portada descarga de verdad en un teléfono: la fachada de 800 y las
// cuatro miniaturas de 400.
const usadas = filas.filter((f) => f.archivo === 'fachada-800' || /-(400)$/.test(f.archivo) && !f.archivo.startsWith('fachada'));
const t = (k) => usadas.reduce((a, b) => a + (b[k] ?? 0), 0).toFixed(1);
console.log(`\n  La PORTADA en un teléfono —fachada 800 y las cuatro de 400—:`);
console.log(`    JPEG ${t('jpg')} KB  →  WebP ${t('webp')} KB  →  AVIF ${t('avif')} KB\n`);

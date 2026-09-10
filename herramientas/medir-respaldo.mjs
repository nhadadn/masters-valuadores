/**
 * Calibración del respaldo tipográfico · el `size-adjust` de `fuentes.css`.
 *
 * ADR-0002: «La fuente de respaldo lleva size-adjust calibrado contra Archivo, para que
 * el cambio al cargar no mueva el texto. Sin eso, el CLS se paga en el titular.»
 *
 * El método es el que ya está descrito en `src/lib/estilos/fuentes.css`: se mide el
 * ancho de tres frases reales del proyecto en Archivo y en la familia métrica de
 * respaldo, peso por peso, en navegador. `size-adjust = ancho(Archivo) / ancho(respaldo)`.
 *
 * Corre los cuatro pesos, no solo el nuevo: si los tres viejos no reproducen los números
 * que ya están en fuentes.css, entonces el método de medición no es el mismo y el número
 * nuevo tampoco vale. Es la comprobación de que se está midiendo lo que se dice.
 *
 * Uso:  node herramientas/medir-respaldo.mjs
 */
import { abrirChromium } from './navegador.mjs';
import { readFileSync } from 'node:fs';

const PESOS = [400, 600, 700, 900];
const DECLARADO = { 400: 98.3, 600: 95.1, 700: 98.3, 900: null };

// Las mismas tres frases reales del proyecto que usa el resto de la medición.
const FRASES = [
  'Empeño y préstamo · Renta de maquinaria y equipo',
  'Aceptamos joyería, herramienta y maquinaria en Torreón',
  'MAQUINARIA LISTA PARA TRABAJAR'
];

const b64 = (p) => readFileSync(p).toString('base64');
const css = PESOS.map(
  (w) =>
    `@font-face{font-family:'Archivo';font-weight:${w};font-style:normal;font-display:block;` +
    `src:url(data:font/woff2;base64,${b64(`static/fuentes/archivo-latin-${w}-normal.woff2`)}) format('woff2');}`
).join('\n');

const navegador = await abrirChromium();
const p = await navegador.newPage({ viewport: { width: 1200, height: 600 } });
await p.setContent(`<style>${css}</style><body><span id="m"></span></body>`);
await p.evaluate(async (PESOS) => {
  for (const w of PESOS) await document.fonts.load(`${w} 17px "Archivo"`);
  await document.fonts.ready;
}, PESOS);

const filas = await p.evaluate(
  ({ PESOS, FRASES }) => {
    const m = document.getElementById('m');
    // La familia métrica a la que resuelve el stack: Arial en escritorio, y lo más
    // cercano a Roboto en Android. Arial no tiene 600 ni 900: el navegador cae a su 700.
    const RESPALDO = 'Arial, Helvetica, "Liberation Sans", sans-serif';
    const ancho = (fam, w, txt) => {
      m.style.cssText = `font-family:${fam};font-weight:${w};font-size:17px;white-space:pre;`;
      m.textContent = txt;
      return m.getBoundingClientRect().width;
    };
    return PESOS.map((w) => {
      const razones = FRASES.map((f) => ancho("'Archivo'", w, f) / ancho(RESPALDO, w, f));
      const media = razones.reduce((a, b) => a + b, 0) / razones.length;
      const disp = Math.max(...razones) - Math.min(...razones);
      return { peso: w, media: +(media * 100).toFixed(2), dispersion: +(disp * 100).toFixed(2) };
    });
  },
  { PESOS, FRASES }
);
await navegador.close();

console.log('\nCalibración del respaldo · size-adjust = ancho(Archivo) ÷ ancho(Arial)\n');
console.log('| Peso | Medido | En fuentes.css | Δ |');
console.log('|---|---|---|---|');
for (const f of filas) {
  const d = DECLARADO[f.peso];
  console.log(
    `| ${f.peso} | **${f.media.toFixed(1)}%** | ${d === null ? '— (nuevo)' : d + '%'} | ` +
      `${d === null ? '—' : (f.media - d >= 0 ? '+' : '') + (f.media - d).toFixed(1) + ' pp'} |`
  );
}
console.log(
  `\nDispersión entre las tres frases: ${filas.map((f) => f.peso + ' → ' + f.dispersion.toFixed(2) + ' pp').join(' · ')}`
);
console.log(
  '\nEl respaldo se calibra contra la familia métrica Arial / Liberation / Helvetica.\n' +
    'En un teléfono con otra métrica el ajuste es aproximado, no exacto.\n'
);

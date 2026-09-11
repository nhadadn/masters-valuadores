/**
 * Genera la imagen de la tarjeta de enlace: `static/marca/tarjeta-fachada.jpg`.
 *
 * POR QUÉ NO SE USA LA FOTO TAL CUAL. `fachada-1600.jpg` es 16:9 y pesa 253 KB.
 * Las dos cosas estorban en una tarjeta:
 *   · Open Graph pide 1200×630 (1.91:1). Con 16:9 el recorte lo hace cada
 *     plataforma a su gusto, y ninguna avisa qué cortó.
 *   · WhatsApp es el canal por el que este sitio va a circular de verdad, y su
 *     lector de vistas previas deja de generar miniatura con imágenes grandes.
 *     Se apunta a quedar holgadamente por debajo de 200 KB.
 *
 * El recorte quita 20 px de cielo arriba y 40 de grava abajo: el edificio entero
 * —contenedor, logotipo, banda del letrero y vitrina— queda dentro.
 *
 * Se corre a mano cuando cambie la foto, no en cada build. El resultado se versiona.
 *   node herramientas/hacer-tarjeta.mjs
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { abrirChromium } from './navegador.mjs';

const ORIGEN = 'static/fotos/fachada-1600.jpg';
const DESTINO = 'static/marca/tarjeta-fachada.jpg';
const ANCHO = 1200, ALTO = 630;
const RECORTE = { x: 0, y: 20, w: 1600, h: 840 };  // 1600/840 = 1.905 = 1200/630
const CALIDAD = 0.82;

const dataUri = 'data:image/jpeg;base64,' + readFileSync(ORIGEN).toString('base64');

const navegador = await abrirChromium();
const p = await navegador.newPage();
const base64 = await p.evaluate(async (a) => {
  const img = new Image();
  img.src = a.dataUri;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = a.ANCHO; c.height = a.ALTO;
  const cx = c.getContext('2d');
  cx.imageSmoothingQuality = 'high';
  cx.drawImage(img, a.RECORTE.x, a.RECORTE.y, a.RECORTE.w, a.RECORTE.h, 0, 0, a.ANCHO, a.ALTO);
  return c.toDataURL('image/jpeg', a.CALIDAD).split(',')[1];
}, { dataUri, ANCHO, ALTO, RECORTE, CALIDAD });
await navegador.close();

writeFileSync(DESTINO, Buffer.from(base64, 'base64'));

const kb = (n) => (statSync(n).size / 1024).toFixed(1);
console.log(`\n  ${ORIGEN}  ${kb(ORIGEN)} KB  1600×900`);
console.log(`  ${DESTINO}  ${kb(DESTINO)} KB  ${ANCHO}×${ALTO}  · calidad ${CALIDAD}`);
console.log(`  ${statSync(DESTINO).size < 200 * 1024 ? '✓' : '✗'} CA-S8 · por debajo de 200 KB\n`);

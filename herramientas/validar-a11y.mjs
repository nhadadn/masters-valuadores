/**
 * Validación de accesibilidad sobre el SITIO CONSTRUIDO, no sobre el dibujo.
 *
 * Recorre cada página prerenderizada en un navegador real, con la fuente cargada,
 * y mide tres cosas: el contraste de todo texto contra su fondo resuelto, el
 * tamaño de todos los objetivos táctiles, y si algún dato de negocio se coló.
 *
 * Uso:  npx serve build -l 8123   y luego   node herramientas/validar-a11y.mjs
 */
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { abrirChromium } from './navegador.mjs';

const BASE = process.env.BASE ?? 'http://127.0.0.1:8123';

/**
 * LAS RUTAS SE LEEN DEL BUILD, no de una lista a mano.
 *
 * Aquí había un arreglo escrito a mano con su propia advertencia:
 *
 *   «Esta lista está a mano y es una trampa: si alguien cambia giros.ts y olvida
 *    esto, el validador pide páginas que ya no existen y reporta menos cobertura
 *    de la que cree tener.»
 *
 * Escribir la advertencia no desarma la trampa. Al añadir el sitemap (SPEC-0003)
 * la lista habría sido la TERCERA copia del inventario, así que se quitó: el
 * validador recorre 'build/' y valida lo que de verdad se construyó. Una página
 * nueva entra sola, y una que desaparece deja de pedirse sola.
 *
 * Que el inventario de 'src/lib/seo/enlaces.ts' coincida con el disco lo vigila
 * 'tests/seo.test.ts' · CA-S10.
 */
const BUILD = 'build';
const RUTAS = (function rutas(dir = BUILD, ruta = '/') {
  const salida = existsSync(join(dir, 'index.html')) ? [ruta] : [];
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (n === '_app' || !statSync(p).isDirectory()) continue;
    salida.push(...rutas(p, `${ruta}${n}/`));
  }
  return salida;
})();

if (RUTAS.length === 0) {
  console.error('✗ No hay páginas en build/. Corre primero «npm run build:revision».');
  process.exit(1);
}

const ANCHOS = [390, 1280];

const navegador = await abrirChromium();
const filas = [];

for (const ancho of ANCHOS) {
  for (const ruta of RUTAS) {
    const p = await navegador.newPage({ viewport: { width: ancho, height: 900 } });
    await p.goto(BASE + ruta, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);

    const r = await p.evaluate(() => {
      const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
      const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
      const cr = (a, b) => { const la = L(a), lb = L(b), hi = Math.max(la, lb), lo = Math.min(la, lb); return (hi + 0.05) / (lo + 0.05); };
      const rgb = (s) => { const m = s.match(/[\d.]+/g); return m ? [+m[0], +m[1], +m[2], m[3] === undefined ? 1 : +m[3]] : null; };
      // UN FONDO PUEDE VIVIR EN UN PSEUDO-ELEMENTO, y este validador no lo veía.
      //
      // El ADR-0007 §5 obliga a que el recorte de la arista vaya en un ::before, no
      // sobre el elemento, porque clip-path recorta también el área sensible. La
      // consecuencia es que el relleno del botón deja de estar en su backgroundColor.
      // Este recorrido solo leía backgroundColor y llegaba al fondo del ancestro, así
      // que reportaba 1:1 en un control que en pantalla da 9.29:1. Comprobado
      // muestreando los píxeles del render, no deduciéndolo.
      //
      // Es una ceguera anterior a esa pieza: le pasaba a cualquier elemento con fondo
      // en pseudo-elemento. Se arregla aquí y no en el componente.
      // SOLO cuenta el pseudo-elemento que REALMENTE TAPA al elemento. La primera
      // versión de esto tomaba cualquier ::before o ::after con fondo, y un separador
      // decorativo de 2 px —el de la cinta de palabras— se leía como si fuera el fondo
      // del renglón: reportó 1:1 sobre un texto que en pantalla da 11.12:1.
      // El criterio es geométrico: posicionado y pegado a los cuatro lados.
      const fondoPseudo = (el) => {
        for (const p of ['::before', '::after']) {
          const cs = getComputedStyle(el, p);
          if (!cs || cs.content === 'none') continue;
          // NI `display: none` NI `visibility: hidden` · ADR-0041. Un pseudo-elemento
          // apagado conserva `position`, sus insets y su `background` en el árbol de
          // estilo, así que este recorrido lo tomaba por el fondo real. Medido: dio
          // 1.17:1 en un botón secundario cuyo texto en pantalla da 11.6:1 sobre
          // mármol. Es el mismo tipo de ceguera que ya se arregló dos veces arriba.
          if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          if (cs.position !== 'absolute' && cs.position !== 'fixed') continue;
          if (!['top', 'right', 'bottom', 'left'].every((l) => cs[l] === '0px')) continue;
          const c = rgb(cs.backgroundColor);
          if (c && c[3] > 0.5) return c.slice(0, 3);
        }
        return null;
      };
      const fondoDe = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const c = rgb(getComputedStyle(n).backgroundColor);
          if (c && c[3] > 0.5) return c.slice(0, 3);
          const p = fondoPseudo(n);
          if (p) return p;
          n = n.parentElement;
        }
        return [255, 255, 255];
      };

      const contraste = [];
      let minR = 99;
      for (const el of document.querySelectorAll('*')) {
        const txt = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('');
        if (!txt) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        if (el.closest('[hidden]') || el.offsetParent === null && cs.position !== 'fixed' && cs.position !== 'sticky') continue;
        const fg = rgb(cs.color); if (!fg) continue;
        const ratio = cr(fg.slice(0, 3), fondoDe(el));
        const px = parseFloat(cs.fontSize), peso = parseInt(cs.fontWeight) || 400;
        const piso = (px >= 24 || (px >= 18.66 && peso >= 700)) ? 3 : 4.5;
        if (ratio < minR) minR = ratio;
        if (ratio < piso) contraste.push({ txt: txt.slice(0, 40), ratio: +ratio.toFixed(2), piso, px, peso, color: cs.color });
      }

      const tactil = [];
      let minT = 9999;
      for (const el of document.querySelectorAll('a, button, summary, input, [role="button"]')) {
        if (el.closest('[aria-hidden="true"]')) continue;
        const b = el.getBoundingClientRect();
        if (b.width < 1 || b.height < 1) continue;
        const m = Math.min(b.width, b.height);
        if (m < minT) minT = m;
        if (m < 44) tactil.push({ txt: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 32), w: Math.round(b.width), h: Math.round(b.height) });
      }

      // LAS CIFRAS QUE VIENEN DE LA FUENTE ÚNICA NO SON FUGA.
      //
      // Este guardia se escribió cuando NINGÚN dato de negocio estaba confirmado, así
      // que cualquier teléfono en la página era un error. El 11 de septiembre se
      // confirmó el de D-08 y empezó a aparecer legítimamente — y el guardia lo marcó.
      //
      // La solución no es bajar el listón: es que la página DECLARE la procedencia.
      // Lo que va dentro de `[data-negocio]` sale de `negocio.ts` y se tolera; todo lo
      // demás sigue siendo fuga. Si alguien escribe un teléfono a mano en una ruta,
      // este guardia lo sigue cazando.
      const cuerpoSinDatos = document.body.cloneNode(true);
      for (const e of cuerpoSinDatos.querySelectorAll('[data-negocio]')) e.remove();
      const cuerpo = cuerpoSinDatos.innerText;
      return {
        minR: +minR.toFixed(2), contraste,
        minT: Math.round(minT), tactil,
        pendientes: document.querySelectorAll('[data-pendiente]').length,
        h1: document.querySelectorAll('h1').length,
        idioma: document.documentElement.lang,
        titulo: document.title.length > 0,
        cifras: (cuerpo.match(/\b\d{3}[ .-]?\d{3}[ .-]?\d{4}\b|\$\s?\d|\b\d{1,2}:\d{2}\b/g) ?? [])
      };
    });
    filas.push({ ancho, ruta, ...r });
    await p.close();
  }
}
await navegador.close();

const malo = (f) => f.contraste.length || f.tactil.length || f.cifras.length || f.h1 !== 1 || f.idioma !== 'es-MX' || !f.titulo;

console.log('| Ancho | Ruta | Contraste mín. | Táctil mín. | Huecos | h1 | Veredicto |');
console.log('|---|---|---|---|---|---|---|');
for (const f of filas) {
  console.log(`| ${f.ancho} | ${f.ruta} | ${f.minR}:1 | ${f.minT} px | ${f.pendientes} | ${f.h1} | ${malo(f) ? 'NO CUMPLE' : 'CUMPLE'} |`);
}
const fallidas = filas.filter(malo);
if (fallidas.length) {
  console.log('\n--- detalle ---');
  for (const f of fallidas) {
    console.log(`\n${f.ancho}px ${f.ruta}`);
    f.contraste.forEach((x) => console.log('  contraste:', JSON.stringify(x)));
    f.tactil.forEach((x) => console.log('  táctil:', JSON.stringify(x)));
    if (f.cifras.length) console.log('  cifras:', f.cifras.join(' | '));
    if (f.h1 !== 1) console.log('  h1:', f.h1);
  }
}
console.log(`\nVEREDICTO: ${fallidas.length ? 'NO CUMPLE' : 'CUMPLE'} · ${filas.length} combinaciones página × ancho`);
process.exit(fallidas.length ? 1 : 0);

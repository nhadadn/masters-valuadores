/**
 * AUDITOR DE FONDOS · ADR-0043
 *
 * Imprime, para las OCHO páginas, el fondo REAL de cada bloque de primer nivel: color
 * computado, si pinta imagen y cuánto mide. Sirve para ver de un vistazo cuántos
 * registros distintos tiene el sitio y dónde cae cada uno.
 *
 * POR QUÉ EXISTE. Se escribió para contestar «el background se ve mal» con datos en vez
 * de con opiniones, y encontró dos cosas que nadie había visto leyendo el código: que el
 * sitio pintaba TRES negros casi iguales en superficies grandes, y que la losa de mármol
 * caía a media página en tres de las cuatro páginas de giro.
 *
 * Ninguna de las dos se deduce del fuente: la primera porque los tres negros viven en
 * tokens distintos y hay que resolverlos, y la segunda porque el índice de la sección
 * depende de cuántas secciones condicionales se pintan en cada giro.
 *
 *   npx serve build -l 5180        # en una terminal…
 *   node herramientas/auditar-fondos.mjs   # …y esto en otra
 */
import { abrirChromium } from './navegador.mjs';
const RUTAS = ['/', '/empeno-y-prestamo/', '/venta/', '/financiamiento/', '/fletes/',
               '/taller/', '/contacto/', '/aviso-de-privacidad/', '/terminos/'];
const nav = await abrirChromium();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
for (const r of RUTAS) {
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:5180' + r, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(x => setTimeout(x, 90)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(400);
  const d = await p.evaluate(() => {
    const clase = (e) => (typeof e.className === 'string' ? e.className.replace(/svelte-\w+/g, '').trim() : '');
    const bloques = [...document.querySelectorAll('body > div > main > *, body > div > footer, body > div > header, body > div > .barra-fija')];
    return {
      cuerpo: getComputedStyle(document.body).backgroundColor,
      filas: bloques.map((e) => {
        const cs = getComputedStyle(e);
        return { q: e.tagName.toLowerCase() + (clase(e) ? '.' + clase(e).split(/\s+/).join('.') : ''),
                 color: cs.backgroundColor, img: cs.backgroundImage === 'none' ? '—' : 'imagen',
                 alto: Math.round(e.getBoundingClientRect().height) };
      })
    };
  });
  console.log('\n' + r + '   cuerpo ' + d.cuerpo);
  d.filas.forEach((f, i) => console.log(`   ${String(i).padStart(2)} ${String(f.alto).padStart(5)}px  ${f.color.padEnd(22)} ${f.img.padEnd(7)} ${f.q}`));
  await p.close();
}
await nav.close();

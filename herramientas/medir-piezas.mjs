/**
 * Medición de las piezas del lenguaje visual · SPEC-0002, CA-01, CA-05 y CA-11.
 *
 * El validador de accesibilidad no cubre estos tres criterios:
 *
 *   CA-11 · CLS. Cambiar el peso del h1 a 900 y meter círculos de 48 px CAMBIA ALTOS.
 *           `clip-path` no reflowea, pero eso no es excusa para no medir lo que sí.
 *           Este script imprime los altos para poder comparar ANTES contra DESPUÉS.
 *
 *   CA-05 · Área sensible. `clip-path` recorta TAMBIÉN el hit-testing. El validador
 *           mide con getBoundingClientRect(), que devuelve el rectángulo completo e
 *           ignora el recorte: no puede ver esta regresión. Aquí se pregunta con
 *           elementFromPoint() quién responde en la esquina recortada.
 *
 *   CA-01 · Desbordamiento horizontal de la banda inclinada.
 *
 * Uso:  node <servidor estático sobre build/>   y luego   node herramientas/medir-piezas.mjs
 */
import { abrirChromium } from './navegador.mjs';

const BASE = process.env.BASE ?? 'http://127.0.0.1:8123';
// /contacto/ entra porque es la única página con un botón primario real:
// `contacto/+page.svelte:53`, el submit del formulario. Sin ella CA-05 no se puede ver.
const RUTAS = ['/', '/empeno-y-prestamo/', '/renta-de-maquinaria/', '/contacto/'];
const ANCHOS = [390, 1280];

const navegador = await abrirChromium();
const filas = [];

for (const ancho of ANCHOS) {
  for (const ruta of RUTAS) {
    const p = await navegador.newPage({ viewport: { width: ancho, height: 900 } });
    await p.goto(BASE + ruta, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);

    filas.push({
      ancho,
      ruta,
      ...(await p.evaluate(() => {
        const alto = (sel) => {
          const el = document.querySelector(sel);
          return el ? +el.getBoundingClientRect().height.toFixed(1) : null;
        };
        const altos = (sel) =>
          [...document.querySelectorAll(sel)].map((e) => +e.getBoundingClientRect().height.toFixed(1));

        // CA-05 · ¿quién responde en la esquina de salida del botón primario?
        // Se pregunta 4 px adentro de la esquina inferior derecha, que es justo el
        // trozo que un clip-path sobre el elemento se comería.
        // CA-05 · SONDA SINTÉTICA, y hay que decir por qué lo es.
        //
        // Hoy el sitio no renderiza NINGÚN botón primario: el submit del formulario
        // está bloqueado por D-13 (`contacto/+page.svelte:49`) y el de WhatsApp sale
        // inerte porque falta el número (D-08). No hay nada que medir en la página.
        //
        // Así que se clona un botón real que sí está en el DOM y se le cambia la
        // variante. El clon conserva la clase de ámbito de Svelte, así que recibe
        // EXACTAMENTE el CSS publicado; lo sintético es la presencia del botón, no
        // la regla que se está verificando.
        const sensible = [];
        const probar = (molde, quitar, poner, nombre) => {
          if (!molde) return;
          const c = molde.cloneNode(true);
          if (quitar) c.classList.remove(quitar);
          if (poner) c.classList.add(poner);
          c.style.width = '200px';
          molde.parentElement.insertBefore(c, molde);
          c.scrollIntoView({ block: 'center' });        // elementFromPoint solo ve lo visible
          const r = c.getBoundingClientRect();
          const punto = document.elementFromPoint(r.right - 4, r.bottom - 4);
          sensible.push({
            que: nombre,
            arista: getComputedStyle(c, '::before').clipPath,
            sobreElElemento: getComputedStyle(c).clipPath,
            responde: punto === c || c.contains(punto) ? 'el botón' : 'OTRO: ' + (punto?.tagName ?? 'nada')
          });
          c.remove();
        };
        probar(document.querySelector('.boton.secundario'), 'secundario', 'primario', 'boton.primario');
        probar(document.querySelector('.wa.inerte'), 'inerte', null, 'wa (activo)');

        const tarjetas = altos('.tarjeta');
        return {
          h1: alto('h1'),
          tarjetaMin: tarjetas.length ? Math.min(...tarjetas) : null,
          tarjetaMax: tarjetas.length ? Math.max(...tarjetas) : null,
          pie: alto('footer'),
          barra: alto('.barra-fija'),
          desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          sensible
        };
      }))
    });
    await p.close();
  }
}
await navegador.close();

console.log('\nSPEC-0002 · altos en px y desbordamiento horizontal\n');
console.log('| Ancho | Ruta | h1 | tarjeta mín | tarjeta máx | pie | barra | desborde |');
console.log('|---|---|---|---|---|---|---|---|');
for (const f of filas) {
  const v = (x) => (x === null ? '—' : x);
  console.log(
    `| ${f.ancho} | ${f.ruta} | ${v(f.h1)} | ${v(f.tarjetaMin)} | ${v(f.tarjetaMax)} | ${v(f.pie)} | ${v(f.barra)} | ${f.desborde} |`
  );
}

console.log('\nCA-05 · la arista es visual · sonda sintética, ver la nota en el script\n');
console.log('| Ancho | Ruta | Botón | clip-path del ::before | clip-path del elemento | Responde en la esquina |');
console.log('|---|---|---|---|---|---|');
const raros = [];
for (const f of filas) {
  for (const s of f.sensible) {
    const corto = (x) => (x === 'none' ? 'none' : String(x).replace(/\s+/g, ' ').slice(0, 34));
    console.log(
      `| ${f.ancho} | ${f.ruta} | ${s.que} | ${corto(s.arista)} | ${corto(s.sobreElElemento)} | ${s.responde} |`
    );
    // Falla si el recorte se puso sobre el elemento interactivo —eso SÍ come objetivo—
    // o si en la esquina responde algo que no es el botón.
    if (s.responde !== 'el botón' || s.sobreElElemento !== 'none') raros.push({ ...f, ...s });
  }
}

const desbordan = filas.filter((f) => f.desborde > 0);
if (desbordan.length) {
  console.log('\n✗ CA-01 · desbordamiento horizontal:');
  for (const f of desbordan) console.log(`   ${f.ancho}px ${f.ruta} → ${f.desborde} px`);
}

const mal = raros.length + desbordan.length;
console.log(`\nVEREDICTO: ${mal ? 'NO CUMPLE' : 'CUMPLE'} · ${filas.length} combinaciones`);
process.exit(mal ? 1 : 0);

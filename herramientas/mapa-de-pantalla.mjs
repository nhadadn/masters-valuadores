/**
 * EL MAPA CON NOMBRES DE LA PANTALLA.
 *
 * Para qué sirve: para que cliente y consultoría puedan decir «cambia LA PROMESA» o
 * «el bloque de consulta está muy abajo» y los dos estén hablando de lo mismo. Sin un
 * vocabulario común, «la cabecera» puede significar cuatro cosas distintas.
 *
 * Cómo funciona, y por qué así: las chinchetas NO se colocan a mano. El script abre la
 * página de verdad, le pregunta al navegador dónde está cada pieza y clava el número
 * en esa coordenada. Un mapa dibujado a ojo envejece en silencio en cuanto alguien
 * mueve una sección; este se vuelve a correr y ya está.
 *
 *   node herramientas/mapa-de-pantalla.mjs
 *
 * Sale en `capturas/mapa-*.png`. La tabla de nombres vive en
 * `docs/60-diseno/mapa-de-la-pantalla.md` y las dos tienen que coincidir.
 */
import { mkdirSync } from 'node:fs';
import { abrirChromium } from './navegador.mjs';

const BASE = process.argv[2] ?? process.env.BASE ?? 'http://127.0.0.1:5180';
const RUTA = process.env.RUTA ?? '/empeno-y-prestamo/';

/**
 * Cada pieza con nombre. El orden es el de lectura, de arriba abajo.
 *
 * `donde` es un selector de verdad, no una descripción: si alguien renombra una clase,
 * este script deja de encontrarla y AVISA, en vez de pintar un mapa mentiroso.
 */
const PIEZAS = [
  { n: 1,  donde: 'header',                 nombre: 'Cabecera' },
  { n: 2,  donde: 'header .marca',          nombre: 'Marca' },
  { n: 3,  donde: 'header .nav-escritorio', nombre: 'Navegación', soloAncho: 1280 },
  { n: 4,  donde: '.aviso',                 nombre: 'Banda de borrador' },
  { n: 5,  donde: '.migas',                 nombre: 'Migas de pan' },
  { n: 6,  donde: 'section:nth-of-type(1)', nombre: 'Sección de entrada' },
  { n: 7,  donde: 'section:nth-of-type(1) .etiqueta', nombre: 'Etiqueta de sección' },
  { n: 8,  donde: 'h1',                     nombre: 'Titular' },
  { n: 9,  donde: '.promesa',               nombre: 'Promesa' },
  { n: 10, donde: '.tira',                  nombre: 'Tira de pasos' },
  { n: 11, donde: '.acciones',              nombre: 'Botones de entrada' },
  { n: 12, donde: '.foto-giro',             nombre: 'Foto de entrada' },
  { n: 13, donde: '.mostrador',             nombre: 'Banda de monedas' },
  { n: 14, donde: 'section:has([data-planeta])', nombre: 'Sección de bienes' },
  { n: 15, donde: '[data-planeta]',         nombre: 'Planeta de bienes' },
  { n: 16, donde: '.revision',              nombre: 'Bloque de revisión' },
  { n: 17, donde: '.consulta',              nombre: 'Bloque de consulta' },
  { n: 18, donde: '.pista',                 nombre: 'Carrusel del patio' },
  { n: 19, donde: '.saltos',                nombre: 'Puntos del carrusel' },
  { n: 20, donde: '.pasos',                 nombre: 'Pasos del proceso' },
  { n: 21, donde: '.cifras',                nombre: 'Bloque de cifras' },
  { n: 22, donde: '.requisitos',            nombre: 'Bloque de requisitos' },
  { n: 23, donde: '.marco',                 nombre: 'Mapa' },
  { n: 24, donde: '.ubicacion .datos',      nombre: 'Datos del local' },
  { n: 25, donde: '.acordeon',              nombre: 'Acordeón' },
  { n: 26, donde: '.cruzados',              nombre: 'Otras líneas' },
  { n: 27, donde: 'footer .banda',          nombre: 'Banda de contacto' },
  { n: 28, donde: 'footer',                 nombre: 'Pie' },
  { n: 29, donde: '.barra-fija',            nombre: 'Barra fija', soloAncho: 390 },
  { n: 30, donde: '.flotante',              nombre: 'Botón flotante', soloAncho: 1280 }
];

mkdirSync('capturas', { recursive: true });
const navegador = await abrirChromium();

for (const ancho of [1280, 390]) {
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(BASE + RUTA, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);

  /* Se recorre la pagina entera para que lo diferido cargue y las alturas sean las
     de verdad. Un mapa con imagenes sin cargar mide otra pagina. */
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    scrollTo(0, 0);
  });
  await p.waitForTimeout(700);

  /* El planeta se congela: un mapa con una animacion a medias confunde. */
  await p.evaluate(() => {
    const e = document.querySelector('[data-planeta]');
    if (!e) return;
    document.getAnimations()
      .filter((a) => a.effect && e.contains(a.effect.target))
      .forEach((a) => { a.pause(); a.currentTime = 9000; });
  });

  const faltan = await p.evaluate((piezas) => {
    const noEncontradas = [];
    /* Donde ya hay una chincheta, para no clavar dos encima. Pasaba con la banda de
       contacto y el pie, que empiezan en la misma coordenada: una tapaba a la otra y
       el mapa se volvia mentiroso justo donde hace falta que no lo sea. */
    const ocupadas = [];
    const capa = document.createElement('div');
    capa.id = 'capa-mapa';
    capa.style.cssText = 'position:absolute;inset:0;z-index:99999;pointer-events:none';
    document.body.style.position = 'relative';
    document.body.appendChild(capa);

    for (const pieza of piezas) {
      const el = document.querySelector(pieza.donde);
      if (!el) { noEncontradas.push(pieza.donde); continue; }
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) { noEncontradas.push(pieza.donde + ' (sin tamaño)'); continue; }
      const arriba = r.top + scrollY;
      const izq = r.left + scrollX;

      /* El recuadro marca la extension de la pieza; la chincheta, su nombre. */
      const caja = document.createElement('div');
      caja.style.cssText =
        'position:absolute;border:2px dashed rgba(231,192,65,.95);border-radius:3px;' +
        'background:rgba(231,192,65,.07);' +
        'left:' + izq + 'px;top:' + arriba + 'px;width:' + r.width + 'px;height:' + r.height + 'px';
      capa.appendChild(caja);

      /* Se busca sitio libre: si choca con otra, se corre a la derecha. */
      let x = Math.max(4, izq - 13);
      let y = Math.max(4, arriba - 13);
      while (ocupadas.some((o) => Math.abs(o.x - x) < 30 && Math.abs(o.y - y) < 30)) x += 30;
      ocupadas.push({ x, y });

      const chincheta = document.createElement('div');
      chincheta.textContent = String(pieza.n);
      chincheta.style.cssText =
        'position:absolute;display:flex;align-items:center;justify-content:center;' +
        'width:26px;height:26px;border-radius:50%;background:#E7C041;color:#0C0D0F;' +
        'font:800 14px/1 system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.5);' +
        /* Acotada al lienzo: las piezas pegadas al borde izquierdo —cabecera, migas,
           secciones— dejaban media chincheta fuera de la imagen. Se vio en la primera
           tirada del mapa. */
        'left:' + x + 'px;top:' + y + 'px';
      capa.appendChild(chincheta);
    }
    return noEncontradas;
  }, PIEZAS.filter((x) => !x.soloAncho || x.soloAncho === ancho));

  if (faltan.length) {
    console.log(`  ${ancho} px · NO ENCONTRADAS: ${faltan.join(', ')}`);
  } else {
    console.log(`  ${ancho} px · las ${PIEZAS.filter((x) => !x.soloAncho || x.soloAncho === ancho).length} piezas localizadas`);
  }

  /* La pagina entera de un tiron. Partirla en mitades legibles es trabajo de
     `ffmpeg`, abajo: `clip` de Playwright recorta dentro del viewport, no del
     documento, y pedirle una franja de mas abajo falla. Comprobado. */
  const alto = await p.evaluate(() => document.documentElement.scrollHeight);
  await p.screenshot({ path: `capturas/mapa-${ancho}-entero.png`, fullPage: true });
  console.log(`      capturas/mapa-${ancho}-entero.png · ${ancho}×${alto} px`);
  await ctx.close();
}

await navegador.close();

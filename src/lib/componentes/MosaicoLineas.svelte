<script lang="ts">
  /**
   * EL MOSAICO DE LÍNEAS · ADR-0048
   *
   * Sustituye a la reja de tarjetas de «Elige la línea que buscas». Nadir eligió el
   * bento entre dos prototipos: la foto manda y cada pieza ABRE WHATSAPP con la línea
   * ya escrita en el mensaje, en vez de llevar a la página de la línea.
   *
   * ── QUÉ HACE, POR ANCHO ────────────────────────────────────────────────────
   *   · Teléfono: dos columnas, la primera línea a lo ancho.
   *   · Tableta: las mismas dos columnas, más holgadas y con la frase visible.
   *   · Escritorio: cuatro columnas por tres filas, sin huecos — la primera en 2×2, la
   *     segunda y la quinta a lo ancho, la tercera y la cuarta altas.
   *
   * LAS POSICIONES SON POR ORDEN, NO POR SLUG, y solo se aplican si hay EXACTAMENTE
   * cinco. Con cuatro o seis, el mosaico no deja huecos a medias: cae a dos por fila.
   *
   * ── EL HOVER, SOLO DONDE HAY PUNTERO ───────────────────────────────────────
   * Con ratón, la foto crece a 1.03 y aparece la flecha. En táctil no existe «encima»:
   * ahí la flecha se ve siempre, que es la única señal de que la pieza es un botón.
   *
   * ── LA FOTO DE ARCHIVO SIGUE MARCADA ───────────────────────────────────────
   * Se usa `Foto` tal cual, así que la de archivo conserva su rótulo, su tinte y su
   * `data-provisional` (ADR-0009). El prototipo los había perdido por extraer solo la
   * <picture>; aquí no se pierden.
   *
   * ── SIN WHATSAPP CONFIRMADO, LA PÁGINA ─────────────────────────────────────
   * `enlaceWhatsApp` devuelve `undefined` si el número no está confirmado. Entonces la
   * pieza lleva a la página de su línea: nunca queda un enlace muerto.
   */
  import Foto from './Foto.svelte';
  import Icono from './Icono.svelte';
  import type { Giro } from '$lib/datos/giros';
  import { enlaceWhatsApp } from '$lib/datos/whatsapp';

  interface Props { lineas: Giro[]; }
  let { lineas }: Props = $props();
</script>

<ul class="mosaico">
  {#each lineas as g, i}
    {@const wa = enlaceWhatsApp(`Hola, escribo por ${g.nombre.toLowerCase()}.`)}
    <li class="pieza" class:mayor={i === 0}>
      <a class="enlace" href={wa ?? `/${g.slug}/`} rel={wa ? 'noopener' : undefined} data-origen="mosaico-{g.slug}">
        {#if g.fotoProvisional}
          <span class="foto-pieza">
            <Foto
              nombre={g.fotoProvisional}
              alt={g.fotoAlt ?? ''}
              provisional={!g.fotoEsSuya}
              compacto
              maxAncho={g.fotoMaxAncho ?? 1600}
              tamanos="(min-width: 1024px) 50vw, 90vw"
            />
          </span>
        {/if}
        <span class="texto">
          <span class="titulo">{g.nombreCorto}</span>
          {#if g.frasePropuesta}<span class="frase">{g.frasePropuesta}</span>{/if}
        </span>
        <span class="flecha" aria-hidden="true"><Icono nombre="flecha" tam={22} grosor={2.2} /></span>
        {#if wa}<span class="solo-lectores"> · escribir por WhatsApp</span>{/if}
      </a>
    </li>
  {/each}
</ul>

<style>
  .mosaico {
    list-style: none;
    margin: var(--e-4) 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--e-2);
  }
  .pieza { position: relative; min-width: 0; aspect-ratio: 4 / 5; }
  .pieza.mayor { grid-column: 1 / -1; aspect-ratio: 16 / 10; }

  .enlace {
    position: relative;
    display: block;
    height: 100%;
    overflow: hidden;
    isolation: isolate;
    color: var(--blanco);
    background: var(--carbon);
  }
  /* EL VELO. Por debajo del 62 % de la pieza no baja de 0.72 de negro, que es donde vive
     el texto: una foto blanca pura bajo él da #505152 — blanco 7.95:1, negro-200 5.49:1. */
  .enlace::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: var(--velo-foto);
  }

  /* La foto LLENA la pieza. `Foto` trae su propia proporción en línea y su rótulo abajo a
     la izquierda —donde aquí vive el título—, así que se le ajusta desde fuera. */
  .foto-pieza,
  .foto-pieza :global(.foto),
  .foto-pieza :global(.lienzo),
  .foto-pieza :global(picture) {
    position: absolute;
    inset: 0;
    display: block;
    margin: 0;
  }
  .foto-pieza :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: auto !important;
    transform: scale(1);
    transition: transform 420ms var(--mov-curva);
  }
  .foto-pieza :global(figcaption) {
    top: auto;
    right: auto;
    left: var(--e-3);
    bottom: calc(var(--e-3) + 30px);
  }

  .texto {
    position: absolute;
    left: var(--e-3);
    right: var(--e-3);
    bottom: var(--e-3);
    z-index: 2;
    display: grid;
    gap: 4px;
  }
  .titulo { font-size: var(--h3-tam); line-height: 1.15; font-weight: 700; letter-spacing: -0.01em; }
  .frase { display: none; font-size: 15px; line-height: 1.35; color: var(--negro-200); }
  .mayor .frase { display: block; }
  .mayor .texto { right: calc(var(--e-3) + 56px); }

  /* La flecha va en el verde de WhatsApp: dice a dónde lleva la pieza. En las piezas
     chicas del teléfono sube a la esquina: abajo chocaba con «Financiamiento». */
  .flecha {
    position: absolute;
    right: var(--e-3);
    top: var(--e-3);
    z-index: 2;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    background: var(--accion-whatsapp);
    color: var(--tinta-sobre-whatsapp);
    transition: transform 260ms var(--mov-curva), opacity 260ms var(--mov-curva);
  }
  .mayor .flecha { top: auto; bottom: var(--e-3); }

  .solo-lectores {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  @media (hover: hover) and (pointer: fine) {
    .flecha { opacity: 0; transform: translateX(-8px); }
    .enlace:hover .foto-pieza :global(img),
    .enlace:focus-visible .foto-pieza :global(img) { transform: scale(1.03); }
    .enlace:hover .flecha,
    .enlace:focus-visible .flecha { opacity: 1; transform: translateX(0); }
  }

  /* TABLETA · dos columnas holgadas. En cuatro, las piezas altas medían 159 px:
     «Financiamiento» se cortaba y la frase se partía palabra por palabra. */
  @media (min-width: 768px) and (max-width: 1023px) {
    .mosaico { grid-auto-rows: 240px; gap: var(--e-3); }
    .pieza, .pieza.mayor { aspect-ratio: auto; }
    .frase { display: block; }
    .titulo { font-size: var(--h2-tam); }
    /* Con `.mayor` delante: la regla de teléfono tiene dos clases y le ganaría a esta. */
    .texto, .mayor .texto { left: var(--e-4); right: calc(var(--e-4) + 56px); bottom: var(--e-4); }
    .flecha, .mayor .flecha { top: auto; right: var(--e-4); bottom: var(--e-4); }
    .foto-pieza :global(figcaption) { top: var(--e-3); bottom: auto; }
  }

  /* ESCRITORIO · cuatro por tres. Sin cinco piezas exactas, dos por fila. */
  @media (min-width: 1024px) {
    .mosaico { grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: 210px; gap: var(--e-3); }
    .pieza, .pieza.mayor { aspect-ratio: auto; grid-column: span 2; }
    .mosaico:has(> .pieza:nth-child(5):last-child) > .pieza:nth-child(1) { grid-column: 1 / 3; grid-row: 1 / 3; }
    .mosaico:has(> .pieza:nth-child(5):last-child) > .pieza:nth-child(2) { grid-column: 3 / 5; grid-row: 1; }
    .mosaico:has(> .pieza:nth-child(5):last-child) > .pieza:nth-child(3) { grid-column: 3; grid-row: 2 / 4; }
    .mosaico:has(> .pieza:nth-child(5):last-child) > .pieza:nth-child(4) { grid-column: 4; grid-row: 2 / 4; }
    .mosaico:has(> .pieza:nth-child(5):last-child) > .pieza:nth-child(5) { grid-column: 1 / 3; grid-row: 3; }
    .frase { display: block; }
    .titulo { font-size: var(--h2-tam); }
    .mayor .titulo { font-size: var(--display-tam); }
    .texto, .mayor .texto { left: var(--e-4); right: calc(var(--e-4) + 56px); bottom: var(--e-4); }
    .flecha, .mayor .flecha { top: auto; right: var(--e-4); bottom: var(--e-4); }
    .foto-pieza :global(figcaption) { top: var(--e-3); bottom: auto; }
  }
</style>

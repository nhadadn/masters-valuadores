<script lang="ts">
  /**
   * EL MOSAICO DE LÍNEAS · ADR-0048 · ADR-0049 · ADR-0057
   *
   * Sustituye a la reja de tarjetas de «Elige la línea que buscas». Nadir eligió el
   * bento entre dos prototipos: la foto manda.
   *
   * ── UN SOLO DESTINO · ADR-0057 ─────────────────────────────────────────────
   * La pieza lleva a la PÁGINA de su línea, y nada más. Desde el ADR-0049 cada pieza
   * llevaba además un botón verde que abría WhatsApp con la línea escrita; salieron los
   * cinco porque eran excesivos. WhatsApp sigue en la entrada, en la sección de contacto,
   * en la barra fija del teléfono y en el flotante de escritorio.
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
   * Con ratón, la foto crece a 1.03. Con teclado crece al entrar en la pieza.
   *
   * ── LA FOTO DE ARCHIVO, SIN RÓTULO · ADR-0061 ─────────────────────────────
   * Se usa `Foto` tal cual, así que la de archivo conserva su tinte y su
   * `data-provisional` (ADR-0009). El rótulo «FOTO DE ARCHIVO» salió por decisión de
   * Nadir, con el mismo criterio que el ADR-0054 aplicó al planeta.
   */
  import Foto from './Foto.svelte';
  import type { Giro } from '$lib/datos/giros';

  interface Props { lineas: Giro[]; }
  let { lineas }: Props = $props();
</script>

<ul class="mosaico">
  {#each lineas as g, i}
    <li class="pieza" class:mayor={i === 0}>
      <a class="enlace" href="/{g.slug}/">
        {#if g.fotoProvisional}
          <span class="foto-pieza">
            <Foto
              nombre={g.fotoProvisional}
              alt={g.fotoAlt ?? ''}
              provisional={!g.fotoEsSuya}
              maxAncho={g.fotoMaxAncho ?? 1600}
              tamanos="(min-width: 1024px) 50vw, 90vw"
            />
          </span>
        {/if}
        <span class="texto">
          <span class="titulo">{g.nombreCorto}</span>
          {#if g.frasePropuesta}<span class="frase">{g.frasePropuesta}</span>{/if}
        </span>
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
  /* Aquí iba `isolation: isolate` para que el botón de WhatsApp no subiera a competir con
     la cabecera fija. Salió con el botón · ADR-0057. */
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

  /* La foto LLENA la pieza. `Foto` trae su propia proporción en línea, así que se le
     ajusta desde fuera. Su rótulo, que aquí había que subir por encima del título, salió
     con el ADR-0061 y sus tres reglas con él. */
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
  .texto {
    position: absolute;
    left: var(--e-3);
    right: var(--e-3);
    bottom: var(--e-3);
    z-index: 2;
    display: grid;
    /* `minmax(0, 1fr)`: sin tope, «Financiamiento» ensancha la columna en la pieza alta de
       1024 px y la frase se reparte en ese ancho. Así la frase se queda en su caja; la
       palabra larga sobresale solo en su renglón. */
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
  /* LA ESCALA DE LA CASA · ADR-0053. Llevaba 700 fijo con −0.01em —el espaciado que solo
     usa el titular en Garamond— y la frase a 15 px, entre el 14 de apoyo y el 17 de cuerpo.
     Ahora cada tamaño trae su peso: h3 en teléfono, h2 y display desde tableta. */
  .titulo { font-size: var(--h3-tam); line-height: 1.15; font-weight: var(--h3-peso); }
  .frase { display: none; font-size: var(--pie-tam); line-height: var(--pie-alto); color: var(--negro-200); }
  .mayor .frase { display: block; }
  /* AQUÍ VIVÍA EL BOTÓN DE WHATSAPP · ADR-0049, y con él los 56 px que el texto le dejaba a
     la derecha. Salió · ADR-0057: el texto ya usa el ancho de la pieza. */

  @media (hover: hover) and (pointer: fine) {
    .pieza:hover .foto-pieza :global(img),
    .pieza:focus-within .foto-pieza :global(img) { transform: scale(1.03); }
  }

  /* TABLETA · dos columnas holgadas. En cuatro, las piezas altas medían 159 px:
     «Financiamiento» se cortaba y la frase se partía palabra por palabra. */
  @media (min-width: 768px) and (max-width: 1023px) {
    .mosaico { grid-auto-rows: 240px; gap: var(--e-3); }
    .pieza, .pieza.mayor { aspect-ratio: auto; }
    .frase { display: block; }
    .titulo { font-size: var(--h2-tam); font-weight: var(--h2-peso); }
    /* Con `.mayor` delante: la regla de teléfono tiene dos clases y le ganaría a esta. */
    .texto, .mayor .texto { left: var(--e-4); right: var(--e-4); bottom: var(--e-4); }
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
    .titulo { font-size: var(--h2-tam); font-weight: var(--h2-peso); }
    .mayor .titulo { font-size: var(--display-tam); font-weight: var(--display-peso); }
    .texto, .mayor .texto { left: var(--e-4); right: var(--e-4); bottom: var(--e-4); }
  }
</style>

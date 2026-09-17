<script lang="ts">
  /**
   * EL MOSAICO DE LÍNEAS · ADR-0048 · ADR-0049
   *
   * Sustituye a la reja de tarjetas de «Elige la línea que buscas». Nadir eligió el
   * bento entre dos prototipos: la foto manda.
   *
   * ── DOS DESTINOS, DOS ENLACES · ADR-0049 ───────────────────────────────────
   * La pieza lleva a la PÁGINA de su línea. Solo el botón verde abre WHATSAPP, con la
   * línea ya escrita en el mensaje. Hasta el ADR-0049 la pieza entera abría WhatsApp.
   *
   * Son dos <a> HERMANOS dentro del <li>, no uno dentro de otro: un enlace dentro de
   * otro es HTML inválido y cada navegador lo repara a su manera. El botón se coloca
   * encima de la pieza desde el <li>.
   *
   * El botón lleva el glifo de WhatsApp —el mismo de `BotonWhatsApp`— y no la flecha:
   * una flecha se lee «ir a», y eso ahora lo hace la pieza.
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
   * Con ratón, la foto crece a 1.03 y aparece el botón. En táctil no existe «encima»:
   * ahí el botón se ve siempre. Con teclado aparece al entrar en la pieza.
   *
   * ── LA FOTO DE ARCHIVO SIGUE MARCADA ───────────────────────────────────────
   * Se usa `Foto` tal cual, así que la de archivo conserva su rótulo, su tinte y su
   * `data-provisional` (ADR-0009). El prototipo los había perdido por extraer solo la
   * <picture>; aquí no se pierden.
   *
   * ── SIN WHATSAPP CONFIRMADO, SIN BOTÓN ─────────────────────────────────────
   * `enlaceWhatsApp` devuelve `undefined` si el número no está confirmado. Entonces no se
   * pinta el botón y la pieza sigue llevando a su página: nunca queda un enlace muerto.
   */
  import Foto from './Foto.svelte';
  import type { Giro } from '$lib/datos/giros';
  import { iconoWhatsApp } from '$lib/datos/iconos';
  import { enlaceWhatsApp } from '$lib/datos/whatsapp';

  interface Props { lineas: Giro[]; }
  let { lineas }: Props = $props();
</script>

<ul class="mosaico">
  {#each lineas as g, i}
    {@const wa = enlaceWhatsApp(`Hola, escribo por ${g.nombre.toLowerCase()}.`)}
    <li class="pieza" class:mayor={i === 0}>
      <a class="enlace" href="/{g.slug}/">
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
      </a>
      {#if wa}
        <a class="wa-pieza" href={wa} rel="noopener" data-origen="mosaico-{g.slug}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{@html iconoWhatsApp}</svg>
          <span class="solo-lectores">Escribir por WhatsApp sobre {g.nombreCorto.toLowerCase()}</span>
        </a>
      {/if}
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
  /* `isolation`: el botón sube con z-index, y así no sale de la pieza a competir con la
     cabecera fija. */
  .pieza { position: relative; min-width: 0; aspect-ratio: 4 / 5; isolation: isolate; }
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
    /* `minmax(0, 1fr)`: sin tope, «Financiamiento» ensancha la columna en la pieza alta de
       1024 px y la frase se reparte en ese ancho, hasta debajo del botón. Así la frase se
       queda en su caja; la palabra larga sobresale solo en su renglón, que va encima del botón. */
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
  /* LA ESCALA DE LA CASA · ADR-0053. Llevaba 700 fijo con −0.01em —el espaciado que solo
     usa el titular en Garamond— y la frase a 15 px, entre el 14 de apoyo y el 17 de cuerpo.
     Ahora cada tamaño trae su peso: h3 en teléfono, h2 y display desde tableta. */
  .titulo { font-size: var(--h3-tam); line-height: 1.15; font-weight: var(--h3-peso); }
  .frase { display: none; font-size: var(--pie-tam); line-height: var(--pie-alto); color: var(--negro-200); }
  .mayor .frase { display: block; }
  .mayor .texto { right: calc(var(--e-3) + 56px); }

  /* EL BOTÓN DE WHATSAPP · ADR-0049. Es lo único de la pieza que abre WhatsApp, así que ya
     no es una señal sino un objetivo táctil. Mide el PISO (44), no los 48 de la casa: es la
     acción SECUNDARIA de la pieza —la primera es ir a su página— y el WhatsApp principal
     sigue en la barra fija y el flotante. En las piezas chicas del teléfono sube a la
     esquina: abajo chocaba con «Financiamiento». */
  .wa-pieza {
    position: absolute;
    right: var(--e-3);
    top: var(--e-3);
    z-index: 2;
    width: var(--tactil-piso);
    height: var(--tactil-piso);
    display: grid;
    place-items: center;
    background: var(--accion-whatsapp);
    color: var(--tinta-sobre-whatsapp);
    transition: transform 260ms var(--mov-curva), opacity 260ms var(--mov-curva);
  }
  .mayor .wa-pieza { top: auto; bottom: var(--e-3); }
  /* EL FOCO, SOBRE FOTO. El anillo de la casa es negro-950 y sobre una foto oscura no se ve.
     Aquí va blanco entre dos filos de negro-950: uno de los dos contrasta con cualquier foto. */
  .wa-pieza:focus-visible {
    outline-color: var(--blanco);
    box-shadow: 0 0 0 calc(var(--foco-separacion) + var(--foco-grosor) + 3px) var(--negro-950);
  }

  .solo-lectores {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* El hover se escucha en el <li> y no en el enlace: el botón no está dentro del enlace,
     y al llevarle el ratón se apagaría justo debajo del cursor. */
  @media (hover: hover) and (pointer: fine) {
    .wa-pieza { opacity: 0; transform: translateX(-8px); }
    .pieza:hover .foto-pieza :global(img),
    .pieza:focus-within .foto-pieza :global(img) { transform: scale(1.03); }
    .pieza:hover .wa-pieza,
    .pieza:focus-within .wa-pieza { opacity: 1; transform: translateX(0); }
  }

  /* TABLETA · dos columnas holgadas. En cuatro, las piezas altas medían 159 px:
     «Financiamiento» se cortaba y la frase se partía palabra por palabra. */
  @media (min-width: 768px) and (max-width: 1023px) {
    .mosaico { grid-auto-rows: 240px; gap: var(--e-3); }
    .pieza, .pieza.mayor { aspect-ratio: auto; }
    .frase { display: block; }
    .titulo { font-size: var(--h2-tam); font-weight: var(--h2-peso); }
    /* Con `.mayor` delante: la regla de teléfono tiene dos clases y le ganaría a esta. */
    .texto, .mayor .texto { left: var(--e-4); right: calc(var(--e-4) + 56px); bottom: var(--e-4); }
    .wa-pieza, .mayor .wa-pieza { top: auto; right: var(--e-4); bottom: var(--e-4); }
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
    .titulo { font-size: var(--h2-tam); font-weight: var(--h2-peso); }
    .mayor .titulo { font-size: var(--display-tam); font-weight: var(--display-peso); }
    .texto, .mayor .texto { left: var(--e-4); right: calc(var(--e-4) + 56px); bottom: var(--e-4); }
    .wa-pieza, .mayor .wa-pieza { top: auto; right: var(--e-4); bottom: var(--e-4); }
    .foto-pieza :global(figcaption) { top: var(--e-3); bottom: auto; }
  }
</style>

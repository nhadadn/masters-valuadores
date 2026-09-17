<script lang="ts">
  /**
   * El mapa incrustado · ADR-0015. Decisión de Nadir, 11 de septiembre.
   *
   * ES LA PRIMERA PIEZA DEL SITIO QUE CARGA UN TERCERO. Hasta hoy no había ninguna:
   * fuentes autoalojadas, cero librerías, cero analítica, cero JavaScript. Lo que
   * cuesta está medido en el ADR, no estimado.
   *
   * Lo que sí se pudo acotar, y cómo:
   *
   *   `loading="lazy"`      No se pide hasta que el visitante se acerca. En móvil el
   *                         mapa vive muy abajo, así que la mayoría nunca lo paga.
   *   hueco fijo            El mapa se abre DENTRO del lienzo, que ya tiene su alto
   *                         antes de que el iframe cargue: no hay desplazamiento de
   *                         maqueta. ADR-0051.
   *   `title`               Un iframe sin título es un marco anónimo para un lector de
   *                         pantalla. Con él se puede saltar o entrar a propósito.
   *   `referrerpolicy`      No se le manda a Google la ruta completa de la página.
   *
   * Lo que NO se pudo acotar: el iframe pone cookies de Google en la visita, y eso no
   * se apaga con un atributo. Está anotado en el ADR y en el documento de
   * requerimientos, porque el aviso de privacidad tiene que decirlo.
   *
   * ── DENTRO DEL LIENZO · ADR-0051 ──────────────────────────────────────────
   * Ya no es una caja con borde dorado —se leía como un campo de formulario—: es un
   * control sobre el lienzo de `Ubicacion`, y al abrirse el mapa cubre ese lienzo. Por
   * eso el marco va en `position: absolute` contra el lienzo, que es quien pone el alto.
   * Si el mapa se usara fuera de `Ubicacion`, necesitaría un contenedor posicionado.
   *
   * Sin coordenadas confirmadas no hay control: el lienzo se queda con la marca sola.
   */
  import { mapaEmbed, estaConfirmado, negocio } from '$lib/config/negocio';
  import Icono from './Icono.svelte';

  const src = $derived(mapaEmbed());
</script>

{#if estaConfirmado(src)}
  <!--
    EL MAPA NO SE DESCARGA HASTA QUE ALGUIEN LO PIDE · medido, no supuesto.

    `<details>` nativo, cero JavaScript, igual que el acordeón de preguntas. Mientras
    está cerrado el navegador NO pide el iframe, y eso es la diferencia entera:

                          a la vista      al tocar
      peso de la portada    590.4 KB       140.3 KB
      peticiones                  31             14
      JavaScript              425.6 KB          0 KB
      de terceros             450.1 KB          0 KB

    El mapa sigue siendo un mapa de Google real e incrustado. Lo que cambia es quién
    paga: antes lo pagaba todo el que abría la portada, ahora solo quien lo pide.
  -->
  <details class="mapa">
    <summary>
      <Icono nombre="mapa" tam={18} grosor={1.9} />
      <span class="abrir">Ver el mapa</span>
      <!-- Abierto, el mismo control lo cierra: sin esto quedaba un mapa encima de la
           marca y ninguna forma visible de quitarlo. -->
      <span class="cerrar">Ocultar el mapa</span>
      <!-- Se dice quién lo carga ANTES de cargarlo. Es un tercero y el visitante
           merece saberlo antes de tocar, no después. -->
      <span class="nota">lo carga Google</span>
    </summary>
    <div class="marco">
      <iframe
        {src}
        title="Mapa de ubicación de {negocio.nombreComercial} VALUADORES"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </details>
{/if}

<style>
  .mapa { padding: 0 var(--e-3) var(--e-3); }

  /* CONTORNO DORADO Y NO FONDO NEGRO: sobre el acero oscuro del lienzo un control negro
     se pierde. Oro sobre el peor punto del pavonado, 4.0:1 —pide 3:1 un borde—; la
     etiqueta en blanco, 7.0:1, y la nota en negro-200, 4.8:1. */
  summary {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: var(--e-2);
    min-height: var(--tactil-piso);
    padding: 0 var(--e-4) 0 var(--e-3);
    box-shadow: inset 0 0 0 2px var(--oro-500);
    color: var(--blanco);
    /* Etiqueta de control al tamaño de los botones de la casa: 17 y 600 · ADR-0053. */
    font-size: var(--cuerpo-tam);
    font-weight: var(--cuerpo-fuerte-peso);
    cursor: pointer;
    list-style: none;
  }
  summary::-webkit-details-marker { display: none; }
  summary :global(svg) { color: var(--oro-500); flex-shrink: 0; }
  .nota { font-size: var(--pie-tam); font-weight: 400; color: var(--negro-200); }
  .cerrar { display: none; }
  details[open] .abrir,
  details[open] .nota { display: none; }
  details[open] .cerrar { display: inline; }
  /* Abierto, el control queda encima del mapa: fondo sólido para que se lea sobre las
     calles. */
  details[open] summary { background: var(--negro-950); }

  /* El mapa cubre el lienzo entero. El alto ya lo tiene el lienzo: CLS en cero. */
  .marco {
    position: absolute;
    inset: 0;
    background: var(--panel);
  }
  iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>

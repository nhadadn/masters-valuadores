<script lang="ts">
  /**
   * Cinta de palabras clave · lo que el negocio ofrece, en movimiento.
   *
   * DE DÓNDE SALEN LAS PALABRAS. Del letrero de su propia fachada, leído en la foto
   * que entregó el cliente el 10 de septiembre. Ni una es invención:
   *
   *     «EMPEÑO, COMPRA Y VENTA / MAQUINARIA, HERRAMIENTAS, AUTOS Y MÁS…»
   *     insignias: VALUACIONES CONFIABLES · CONTENEDORES MARÍTIMOS
   *
   * LO QUE SE DEJÓ FUERA A PROPÓSITO: «COMPRA Y VENDE AL MEJOR PRECIO» y «SEGUROS Y
   * RESISTENTES» también están en el letrero, y son superlativos y afirmaciones de
   * calidad. El CLAUDE.md los prohíbe en el sitio. Que el cliente los ponga en su
   * fachada es cosa suya; repetirlos aquí sería suscribirlos. Van solo los
   * sustantivos: qué ofrece, no qué tan bueno es.
   *
   * CERO JAVASCRIPT. Es una animación CSS sobre `transform`, que no reflowea. La
   * lista va duplicada para que el ciclo cierre sin salto; la segunda copia es
   * `aria-hidden` para que un lector de pantalla no la lea dos veces.
   *
   * ACCESIBILIDAD · LO QUE CUMPLE Y LO QUE NO:
   *   · `prefers-reduced-motion` detiene la animación por completo y la cinta pasa a
   *     lista estática. Eso sí es total.
   *   · Se pausa al pasar el cursor y al enfocar con teclado.
   *   · LÍMITE CONOCIDO: la WCAG 2.2.2 pide un mecanismo para pausar contenido que se
   *     mueve más de 5 segundos. Pausar al pasar o al enfocar es un mecanismo
   *     PARCIAL: no sirve a quien lee con el cursor lejos y sin tocar teclado. Un
   *     botón de pausa necesitaría JavaScript, y `csr = false`. Queda anotado.
   */
  /* ADR-0047 · LAS PALABRAS YA NO SALEN DEL LETRERO sino de la oferta que el cliente
     acotó: cinco líneas y ninguna otra. El letrero de la fachada sigue diciendo
     «contenedores marítimos» y «valuaciones» en la foto; el sitio ya no. */
  const PALABRAS = ['Empeño', 'Venta', 'Financiamiento', 'Fletes', 'Taller'];
</script>

<div class="cinta">
  <div class="pista">
    <ul class="grupo">
      {#each PALABRAS as p}<li>{p}</li>{/each}
    </ul>
    <ul class="grupo" aria-hidden="true">
      {#each PALABRAS as p}<li>{p}</li>{/each}
    </ul>
  </div>
</div>

<style>
  .cinta {
    overflow: hidden;
    /* `--carbon` y no `--superficie-oscura` · ADR-0043. Esto es una BANDA a sangre,
       o sea un registro de página, y los registros de página llevan el único negro del
       sitio. `--superficie-oscura` se queda para lo que es: el relleno que va DEBAJO
       de una fotografía mientras carga, en el carrusel, el planeta y `Foto`. */
    background: var(--carbon);
    color: var(--oro-500);            /* 11.12:1 sobre negro-950 */
    padding-block: var(--e-3);
    border-block: var(--regla-dorada) solid var(--oro-500);
  }
  .pista {
    display: flex;
    width: max-content;
    animation: correr 34s linear infinite;
  }
  /* Pausa al pasar y al enfocar. Parcial, y está dicho en la nota de arriba. */
  .cinta:hover .pista,
  .cinta:focus-within .pista { animation-play-state: paused; }

  .grupo {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  li {
    display: flex;
    align-items: center;
    gap: var(--e-4);
    padding-inline: var(--e-4);
    font-size: var(--h3-tam);
    line-height: 1.2;
    /* MAYÚSCULAS DE ETIQUETA, NO DE TITULAR · ADR-0053. Tomaba `--titular-peso` y
       `--titular-tracking`, que el ADR-0029 cambió a 400 y −0.01em para la Garamond del
       titular: la cinta, que es Archivo, quedó en mayúsculas delgadas y apretadas, la única
       así en el sitio. Las mayúsculas del sitio van en 700 y con aire, como las cejas. */
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    text-transform: uppercase;
    white-space: nowrap;
  }
  /* El separador es la regla dorada del ADR-0007 §6, puesta de canto. */
  li::after {
    content: '';
    width: var(--regla-dorada);
    height: 1em;
    background: var(--oro-500);
  }

  /* Cada grupo mide la mitad de la pista, así que −50% cierra el ciclo exacto. */
  @keyframes correr {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .pista { animation: none; width: auto; flex-wrap: wrap; }
    /* Sin movimiento la copia duplicada sobra y solo sería ruido visual. */
    .grupo[aria-hidden='true'] { display: none; }
    .grupo { flex-wrap: wrap; }
  }
</style>

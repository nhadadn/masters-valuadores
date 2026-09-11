<script lang="ts">
  /**
   * El destello · la banda de luz que cruza una tarjeta en bucle, como el reflejo
   * que recorre una vitrina.
   *
   * UNA SOLA DEFINICIÓN. Nació dentro de la hoja de estilos de la página de giro y
   * al pedirse también en la portada había dos caminos: copiar veinte líneas de CSS,
   * o extraerlo. Copiado, las dos versiones se separan en cuanto alguien ajuste la
   * duración de una — y nadie se entera hasta que se ven juntas. Es el mismo criterio
   * que ya sacó `ReglaDorada` a su propio archivo.
   *
   * QUIÉN LO USA TIENE QUE PONER TRES COSAS en el contenedor, o esto no funciona:
   *   position: relative    · la banda se posiciona contra él
   *   overflow: hidden      · si no, la banda se sale por los lados de la tarjeta
   *   isolation: isolate    · encierra el `z-index: -1` para que no se hunda detrás
   *                           del fondo de la sección
   *
   * VA DEBAJO DEL CONTENIDO, a propósito. `z-index: -1` lo deja sobre el fondo de la
   * tarjeta y bajo su texto. La alternativa —pasarlo por encima, como luz sobre el
   * cristal— se ve más literal pero le resta contraste al texto durante el segundo
   * que dura el cruce, y eso ningún validador lo caza: todos miden un estado quieto.
   * No se arriesga legibilidad por un reflejo.
   *
   * El costo está medido en `herramientas/medir-animacion.mjs`: vive en el
   * compositor, no recalcula estilo ni maqueta por cuadro.
   */
  interface Props {
    /**
     * Posición en la fila. Escalona el arranque medio segundo por tarjeta: todas a
     * la vez se leen como un parpadeo de la pantalla, no como un reflejo.
     */
    indice?: number;
  }
  let { indice = 0 }: Props = $props();
</script>

<span class="destello" aria-hidden="true" style="--i: {indice}"></span>

<style>
  .destello { display: none; }

  @media (prefers-reduced-motion: no-preference) {
    .destello {
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      background: linear-gradient(
        105deg,
        transparent 38%,
        rgba(231, 192, 65, 0.16) 50%,
        transparent 62%
      );
      transform: translateX(-140%);
      animation: cruzar 8s linear infinite;
      animation-delay: calc(var(--i, 0) * 0.5s);
    }
  }

  /* El movimiento ocupa el primer 16 % del ciclo —1.3 s de 8— y el resto la banda
     espera fuera de cuadro. Comprimir el gesto y alargar la pausa es lo que separa
     un reflejo de un parpadeo. */
  @keyframes cruzar {
    0%   { transform: translateX(-140%); }
    16%  { transform: translateX(140%); }
    100% { transform: translateX(140%); }
  }
</style>

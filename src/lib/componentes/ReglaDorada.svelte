<script lang="ts">
  /**
   * La regla dorada · ADR-0007 §6.
   *
   * Dos píxeles de oro. Es la pieza más barata de las seis y de las que más los
   * identifican: aparece bajo el wordmark en las cinco publicaciones y repetida como
   * divisor bajo el titular, encima de la lista de insignias.
   *
   * UNA sola definición, no tres reglas parecidas repartidas por los componentes.
   *
   * Es DECORATIVA: `aria-hidden`. No separa contenido para quien no ve la pantalla,
   * así que no es un `<hr>` — un separador anunciado donde no hay cambio de tema es
   * ruido para un lector de pantalla.
   *
   * Sobre el acento suelto: la restricción 2 del ADR prohíbe el oro como TEXTO sobre
   * claro y como bloque sin etiqueta oscura encima. Una regla decorativa no es
   * ninguna de las dos, y es el mismo uso que ya hacen `Tarjeta.svelte:37` y el
   * borde de los diferenciadores.
   *
   * No lleva margen propio: el espacio lo pone quien la usa, con sus tokens.
   */
  interface Props {
    /** `corto` es el gesto de sus piezas: un tramo, no una línea de lado a lado. */
    ancho?: 'corto' | 'completo';
  }
  let { ancho = 'corto' }: Props = $props();
</script>

<span class="regla {ancho}" aria-hidden="true"></span>

<style>
  .regla {
    display: block;
    height: var(--regla-dorada);
    background: var(--oro-500);
  }
  .corto { width: var(--e-12); }
  .completo { width: 100%; }
</style>

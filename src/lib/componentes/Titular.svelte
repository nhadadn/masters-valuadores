<script lang="ts">
  /**
   * Titular a dos tintas · ADR-0007 §4.
   *
   * Caja alta, peso 900, interlínea 1.05, tracking −0.01em. Primer renglón en tinta,
   * segundo en oro. Es su gesto más reconocible: «MAQUINARIA / LISTA PARA TRABAJAR».
   *
   * Solo portada y encabezado de giro. No en subsecciones: si todo grita, nada grita.
   *
   * LA CAJA ALTA ES PRESENTACIÓN, NO CONTENIDO. El texto del DOM queda como lo dan
   * los datos —«Empeño y préstamo»— y eso es lo que lee un lector de pantalla.
   *
   * EL SEGUNDO RENGLÓN ES OPCIONAL Y HOY NO SE PASA EN NINGÚN LADO. Partir
   * «Empeño y préstamo» en dos y teñir la mitad de oro sería inventar un énfasis que
   * el cliente no autorizó, y cuatro de los siete giros son una sola palabra. La
   * segunda tinta espera copy. Ver CA-04 en SPEC-0002.
   *
   * El oro sale de --oro-texto, que cada superficie resuelve: sobre crema el oro-800
   * da 4.05:1 y no pasa AA, así que ahí no hay oro. Ver la nota de --oro-800.
   */
  interface Props {
    primera: string;
    /** El renglón en oro. Sin copy aprobado no se pasa. */
    segunda?: string;
    /** `display` es el de portada; `h1` el del encabezado de giro. */
    tam?: 'display' | 'h1';
    como?: 'h1' | 'h2';
  }
  let { primera, segunda, tam = 'h1', como = 'h1' }: Props = $props();
</script>

<svelte:element this={como} class="titular {tam}">
  <span class="linea">{primera}</span>{#if segunda}<span class="linea oro">{segunda}</span>{/if}
</svelte:element>

<style>
  .titular {
    margin: 0;
    font-family: var(--fuente-display);
    font-size: var(--titular-tam);
    font-weight: var(--titular-peso);
    line-height: var(--titular-alto);
    letter-spacing: var(--titular-tracking);
    /* SIN MAYÚSCULAS. En un palo seco de peso 900 la caja alta daba autoridad; en
       una serif de peso 400 aplasta el ritmo de la palabra y pierde justo lo que se
       viene a buscar. Se vio en la comparación de las seis. */
    /* HEREDA de la superficie, no escribe --tinta a pelo. Al poner la entrada en
       oscuro (ADR-0011) el titular se quedó en negro-950 sobre negro: 1.92:1, y el
       validador lo cazó. La sección ya declara la tinta que le toca. */
    color: inherit;
    /* Sin esto, una palabra larga en caja alta a 900 desborda el margen lateral en
       un teléfono angosto, y el validador revienta por desbordamiento horizontal. */
    overflow-wrap: break-word;
  }
  /* El tamaño lo manda `--titular-tam`, arriba: el titular ya no sigue la escala
     de los h2, que es de palo seco y otra cosa. */
  .display { font-size: var(--display-tam); }

  /* La escala de tokens no tenía punto de ruptura —era 28 px a todos los anchos—.
     Con 68 px hace falta: en un teléfono de 390 no cabe y en escritorio 44 se queda
     corto al lado de los 64 y 107 de las referencias. */
  @media (min-width: 768px) {
    .titular { font-size: var(--titular-tam-ancho); }
  }

  .linea { display: block; }
  /* Texto grande en peso 900: usa el oro de texto grande, que pasa 3:1 sobre
     las tres superficies claras. Ver la nota del token. */
  .oro { color: var(--oro-texto-grande); }
</style>

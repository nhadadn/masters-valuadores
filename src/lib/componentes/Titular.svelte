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
    font-weight: var(--titular-peso);
    line-height: var(--titular-alto);
    letter-spacing: var(--titular-tracking);
    text-transform: uppercase;
    color: var(--tinta);
    /* Sin esto, una palabra larga en caja alta a 900 desborda el margen lateral en
       un teléfono angosto, y el validador revienta por desbordamiento horizontal. */
    overflow-wrap: break-word;
  }
  .h1 { font-size: var(--h1-tam); }
  .display { font-size: var(--display-tam); }

  .linea { display: block; }
  .oro { color: var(--oro-texto); }
</style>

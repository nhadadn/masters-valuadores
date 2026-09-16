<script lang="ts">
  /**
   * El monograma M, plano y de dos tonos · ADR-0001 · ADR-0051.
   *
   * Vivía dibujado a mano dentro de la cabecera. El lienzo de «DÓNDE ESTAMOS» lo pinta
   * en grande, y dos copias del mismo trazo se separan en cuanto alguien retoque una:
   * por eso sale aquí, una sola vez. Cuando llegue el vectorial del cliente (D-06), se
   * cambia en este archivo y cambia en los dos sitios.
   *
   * Sin `tam`, el SVG no lleva ancho ni alto: lo mide el CSS de quien lo usa, que es lo
   * que necesita un lienzo que cambia de tamaño con la pantalla.
   */
  interface Props { tam?: number; }
  let { tam }: Props = $props();
</script>

<svg width={tam} height={tam} viewBox="0 0 260 258" aria-hidden="true">
  <path fill="var(--oro-500)" d="M0,24 L130,154 L130,220 L46,152 L46,258 L0,258 Z M130,74 L196,8 L244,8 L260,24 L130,154 Z" />
  <path fill="var(--negro-100)" d="M16,8 L64,8 L130,74 L130,154 L0,24 Z M260,24 L260,258 L214,258 L214,152 L130,220 L130,154 Z" />
</svg>

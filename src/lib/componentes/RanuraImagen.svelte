<script lang="ts">
  /**
   * Dónde va una foto que todavía no existe.
   *
   * Bloque gris con la relación de aspecto reservada y una etiqueta de qué foto
   * va ahí. Nada de banco de imágenes ni marcadores fotorrealistas: una foto de
   * archivo en una maqueta se convierte en una expectativa que el cliente no
   * puede cumplir, y reservar el alto correcto es lo que evita el CLS cuando la
   * foto real entre.
   */
  interface Props { relacion?: string; etiqueta: string; }
  let { relacion = '16 / 9', etiqueta }: Props = $props();
</script>

<figure class="ranura" style="aspect-ratio: {relacion}" data-pendiente="true">
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" />
    <path d="M4 17l5-4 4 3 3-2 4 3" />
  </svg>
  <figcaption>
    {etiqueta}
    <span class="relacion">relación {relacion.replace(' / ', ':')}</span>
  </figcaption>
</figure>

<style>
  .ranura {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--e-1);
    margin: 0;
    padding: var(--e-3);
    background: var(--negro-100);
    border: 1px solid var(--negro-400);
    color: var(--tinta-secundaria);
    text-align: center;
  }
  figcaption {
    display: grid;
    gap: var(--e-1);
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
  }
  /* Sube de --negro-500 a tinta secundaria · ADR-0010. Sobre blanco daba 5.90:1,
     pero el campo de acero lo tumba a 4.26:1 y no pasa AA. Tinta secundaria da
     6.27:1 en el punto más oscuro de la rampa. */
  .relacion { font-size: var(--pie-tam); color: var(--tinta-secundaria); }
</style>

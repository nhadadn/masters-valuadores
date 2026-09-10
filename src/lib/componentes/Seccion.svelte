<script lang="ts">
  /**
   * La unidad de la página. Alterna blanco y crema entre secciones consecutivas:
   * el contraste de superficie basta y no cuesta pintura ni sombras.
   * El margen lateral de 20 vive aquí y en ningún otro lado.
   */
  import type { Snippet } from 'svelte';

  interface Props {
    fondo?: 'blanco' | 'crema' | 'oscuro';
    amplia?: boolean;
    etiqueta?: string;
    id?: string;
    children: Snippet;
  }
  let { fondo = 'blanco', amplia = false, etiqueta, id, children }: Props = $props();
</script>

<section {id} class="seccion {fondo}" class:amplia>
  <div class="caja">
    {#if etiqueta}<p class="etiqueta">{etiqueta}</p>{/if}
    {@render children()}
  </div>
</section>

<style>
  .seccion { padding: var(--seccion-vertical) var(--margen-lateral); }
  .amplia { padding-block: var(--seccion-vertical-amplia); }
  .caja { max-width: var(--ancho-maximo); margin-inline: auto; }

  .blanco { background: var(--superficie); color: var(--tinta); }
  .crema  { background: var(--superficie-alterna); color: var(--tinta); }
  .oscuro { background: var(--superficie-oscura); color: var(--tinta-sobre-oscuro); }

  .etiqueta {
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    color: var(--tinta-secundaria);
    margin-bottom: var(--e-3);
  }
  .oscuro .etiqueta { color: var(--tinta-tenue-oscuro); }

  @media (min-width: 768px) {
    .seccion { padding-inline: var(--e-12); }
  }
</style>

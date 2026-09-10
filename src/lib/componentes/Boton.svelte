<script lang="ts">
  /**
   * Botón. 48 de alto de casa; 44 es el piso absoluto y solo para secundarios.
   * Si recibe `href` se renderiza como enlace, porque navegar no es accionar.
   *
   * La variante `acento` existe pero se usa con cuidado: el oro sostiene 3.47:1
   * como relleno sobre blanco, y la etiqueta encima va en negro-950 (5.60:1).
   * Nunca al revés.
   */
  import type { Snippet } from 'svelte';

  type Variante = 'primario' | 'secundario' | 'terciario' | 'acento';
  interface Props {
    variante?: Variante;
    href?: string;
    tipo?: 'button' | 'submit';
    sobreOscuro?: boolean;
    anchoCompleto?: boolean;
    etiqueta?: string;
    children: Snippet;
    onclick?: () => void;
  }
  let {
    variante = 'primario', href, tipo = 'button', sobreOscuro = false,
    anchoCompleto = true, etiqueta, children, onclick
  }: Props = $props();
</script>

{#if href}
  <a
    {href}
    aria-label={etiqueta}
    class="boton {variante}"
    class:oscuro={sobreOscuro}
    class:completo={anchoCompleto}
  >{@render children()}</a>
{:else}
  <button
    type={tipo}
    aria-label={etiqueta}
    class="boton {variante}"
    class:oscuro={sobreOscuro}
    class:completo={anchoCompleto}
    {onclick}
  >{@render children()}</button>
{/if}

<style>
  .boton {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--e-2);
    min-height: var(--tactil);
    padding: 0 var(--e-4);
    border: 0;
    border-radius: var(--radio-boton);
    background: transparent;
    font-size: var(--cuerpo-tam);
    font-weight: var(--cuerpo-fuerte-peso);
    line-height: 1;
    cursor: pointer;
    transition: background-color var(--mov-tactil) var(--mov-curva);
  }
  .completo { width: 100%; }

  .primario { background: var(--accion); color: var(--tinta-sobre-oscuro); }
  .primario:hover { background: var(--accion-hover); }
  .primario:active { background: var(--accion-presionada); }

  .secundario { background: var(--superficie); color: var(--tinta); box-shadow: inset 0 0 0 2px var(--accion); }
  .secundario:hover { background: var(--negro-100); }

  .terciario { color: var(--tinta); text-decoration: underline; text-underline-offset: 3px; padding: 0 var(--e-2); }

  .acento { background: var(--oro-500); color: var(--negro-950); }
  .acento:hover { background: var(--oro-700); color: var(--blanco); }

  /* Sobre superficie oscura el primario se invierte: blanco con tinta negra. */
  .oscuro.primario { background: var(--blanco); color: var(--negro-950); }
  .oscuro.primario:hover { background: var(--negro-100); }
  .oscuro.secundario { background: transparent; color: var(--blanco); box-shadow: inset 0 0 0 2px var(--blanco); }
  .oscuro.secundario:hover { background: rgba(255, 255, 255, 0.12); }
  .oscuro.terciario { color: var(--blanco); }
</style>

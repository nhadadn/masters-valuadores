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

  /* ── La arista · ADR-0007 §5 ────────────────────────────────────────────
     Solo el primario. El secundario y el terciario NO la llevan: si todo la lleva,
     deja de significar «esta es la acción».

     EL RECORTE NO VA SOBRE EL ELEMENTO. `clip-path` recorta también el hit-testing,
     así que un clip-path sobre el <button> se comería el triángulo del objetivo
     táctil, y el ADR dice que si el recorte comiera objetivo, no se hace. Va sobre
     un pseudo-elemento de fondo con `pointer-events: none`: el rectángulo completo
     sigue siendo el objetivo, y el recorte es solo pintura.

     `isolation: isolate` contiene el z-index negativo dentro del botón, para que el
     fondo no se hunda detrás del fondo de un ancestro.

     Sin radio: el sello de sus piezas es un paralelogramo de arista viva, no una
     pastilla. El anillo de foco sigue el rectángulo, que es lo correcto: es el
     objetivo real. */
  .primario {
    position: relative;
    isolation: isolate;
    background: transparent;
    border-radius: var(--radio-bloque);
    color: var(--tinta-sobre-oscuro);
    /* Que la etiqueta no se meta debajo del corte cuando el botón no es de ancho
       completo. Medio corte basta: a media altura el recorte ha comido la mitad. */
    padding-inline-end: calc(var(--e-4) + var(--diagonal-corte) / 2);
  }
  .primario::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: var(--accion);
    clip-path: polygon(0 0, 100% 0, calc(100% - var(--diagonal-corte)) 100%, 0 100%);
    transition: background-color var(--mov-tactil) var(--mov-curva);
  }
  .primario:hover::before { background: var(--accion-hover); }
  .primario:active::before { background: var(--accion-presionada); }

  .secundario { background: var(--superficie); color: var(--tinta); box-shadow: inset 0 0 0 2px var(--accion); }
  .secundario:hover { background: var(--negro-100); }

  .terciario { color: var(--tinta); text-decoration: underline; text-underline-offset: 3px; padding: 0 var(--e-2); }

  .acento { background: var(--oro-500); color: var(--negro-950); }
  .acento:hover { background: var(--oro-700); color: var(--blanco); }

  /* Sobre superficie oscura el primario se invierte: blanco con tinta negra.
     El fondo vive en el pseudo-elemento, así que la inversión también. */
  .oscuro.primario { color: var(--negro-950); }
  .oscuro.primario::before { background: var(--blanco); }
  .oscuro.primario:hover::before { background: var(--negro-100); }
  .oscuro.secundario { background: transparent; color: var(--blanco); box-shadow: inset 0 0 0 2px var(--blanco); }
  .oscuro.secundario:hover { background: rgba(255, 255, 255, 0.12); }
  .oscuro.terciario { color: var(--blanco); }
</style>

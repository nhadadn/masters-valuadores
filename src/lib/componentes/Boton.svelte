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
    /** Abre en otra pestaña: «Cómo llegar» lleva a Google Maps · ADR-0051. */
    externo?: boolean;
    children: Snippet;
    onclick?: () => void;
  }
  let {
    variante = 'primario', href, tipo = 'button', sobreOscuro = false,
    anchoCompleto = true, etiqueta, externo = false, children, onclick
  }: Props = $props();
</script>

{#if href}
  <a
    {href}
    target={externo ? '_blank' : undefined}
    rel={externo ? 'noopener' : undefined}
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
    transition:
      background-color var(--mov-tactil) var(--mov-curva),
      transform var(--mov-tactil) var(--mov-curva);
  }
  /* Respuesta al toque. En un teléfono lento el cambio de color tarda en
     verse; el hundimiento se siente de inmediato y evita el doble toque. */
  .boton:active { transform: translateY(1px); }
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
  /* RELLENO, TINTA Y HOVER SALEN DEL REGISTRO · ADR-0051. Aquí decía «la etiqueta va en
     tinta oscura» porque, desde el ADR-0012, la acción era oro. El ADR-0028 devolvió la
     acción a carbón en el registro claro y cambió `--tinta-sobre-accion` a blanco, pero
     este botón seguía pintando oro fijo: blanco sobre oro, 1.75:1. Nadie lo vio porque
     ningún primario se dibujaba hasta «Cómo llegar». Ahora los tres salen de roles:
     carbón con tinta blanca en claro, oro metálico con tinta negra en oscuro. */
  .primario {
    position: relative;
    isolation: isolate;
    background: transparent;
    border-radius: var(--radio-bloque);
    color: var(--tinta-sobre-accion);
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
    /* ACABADO METÁLICO · ADR-0019, solo en el registro oscuro desde el ADR-0051. El
       color plano va SIEMPRE con el degradado y lleva el stop más oscuro: un
       background-image deja el background-color en transparente y la medición de
       contraste se va al fondo del ancestro. Aquí ya pasó una vez y se reportó 1:1
       sobre un botón que daba 9.29:1. */
    background-color: var(--accion-relleno);
    background-image: var(--accion-metal);
    box-shadow: var(--metal-filo);
    clip-path: polygon(0 0, 100% 0, calc(100% - var(--diagonal-corte)) 100%, 0 100%);
    transition: background-color var(--mov-tactil) var(--mov-curva);
  }
  .primario:hover::before { background: var(--accion-hover); }
  .primario:active::before { background: var(--accion-presionada); }

  /* El secundario es contorno sobre el campo, no un bloque claro. */
  .secundario { background: transparent; color: var(--tinta); box-shadow: inset 0 0 0 2px var(--tinta); }
  .secundario:hover { background: rgba(255, 255, 255, 0.10); }

  .terciario { color: var(--tinta); text-decoration: underline; text-underline-offset: 3px; padding: 0 var(--e-2); }

  /* `acento` y `primario` son ya lo mismo desde el ADR-0012. Se conserva la
     variante para no romper llamadas, y su hover deja de usar --oro-700 con blanco
     encima, que daba 4.05:1 y nunca pasó AA. */
  .acento { background: var(--oro-500); color: var(--tinta-sobre-accion); }
  .acento:hover { background: var(--accion-hover); color: var(--tinta-sobre-accion); }

  /* `sobreOscuro` ya no invierte nada: el sitio entero es oscuro desde el ADR-0012,
     así que la variante oscura y la normal coinciden. La bandera se conserva porque
     la usan las páginas y quitarla sería ruido; el día que vuelva una superficie
     clara, aquí es donde se diferencia otra vez. */
  .oscuro.terciario { color: var(--blanco); }
</style>

<script lang="ts">
  /**
   * Insignia circular · ADR-0007 §3, con el alcance enmendado por SPEC-0002.
   *
   * VA en la banda de contacto y en el bloque de diferenciadores.
   * NO va en la tarjeta de giro: la tarjeta ya lleva su Icono de 26, ocho círculos
   * negros en retícula se leen como una cuadrícula de lunares, y 48 px rompen el alto
   * fijo que `Tarjeta.svelte` mantiene justamente para no pagar CLS.
   *
   * DOS TRATAMIENTOS, y los dos salen de sus piezas, no de simetría:
   *   sobre claro   círculo RELLENO en negro-950 con glifo dorado · 11.12:1
   *   sobre oscuro  ANILLO dorado sobre el fondo, glifo dorado     · 11.12:1
   * Un círculo negro relleno sobre la banda negra sería invisible. Ellos lo resuelven
   * así en la banda de contacto de las cinco piezas.
   *
   * El círculo es DECORATIVO: `aria-hidden`. El significado lo carga la etiqueta.
   *
   * La segunda línea en oro NO se escribe con --oro-800 a pelo: usa --oro-texto, que
   * cada superficie resuelve. Sobre crema el oro-800 da 4.05:1 y no pasa AA, así que
   * ahí la superficie lo baja a tinta secundaria. La restricción es estructural, no
   * un comentario que alguien tenga que acordarse de leer.
   */
  import type { Snippet } from 'svelte';
  import Icono from './Icono.svelte';

  interface Props {
    icono: string;
    /** Versalitas. Es la que carga el significado del círculo. */
    etiqueta?: string;
    /** Segunda línea, en oro. */
    segunda?: string;
    sobreOscuro?: boolean;
    /** Para cuando el texto todavía es un hueco y no hay copy aprobado. */
    children?: Snippet;
  }
  let { icono, etiqueta, segunda, sobreOscuro = false, children }: Props = $props();
</script>

<div class="insignia" class:oscuro={sobreOscuro}>
  <span class="circulo" aria-hidden="true">
    <Icono nombre={icono} tam={24} grosor={1.8} />
  </span>
  <div class="texto">
    {#if etiqueta}
      <p class="et">{etiqueta}</p>
      {#if segunda}<p class="seg">{segunda}</p>{/if}
    {:else if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .insignia {
    display: flex;
    align-items: center;
    gap: var(--e-3);
  }
  .circulo {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--insignia-tam);
    height: var(--insignia-tam);
    border-radius: var(--radio-pastilla);
    background: var(--negro-950);
    color: var(--oro-500);            /* el glifo hereda con currentColor · 11.12:1 */
  }
  /* Sobre oscuro el relleno desaparece y queda el anillo, como en su banda de pie. */
  .oscuro .circulo {
    background: transparent;
    box-shadow: inset 0 0 0 var(--regla-dorada) var(--oro-500);
  }

  .texto { min-width: 0; }
  .et {
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    text-transform: uppercase;
    color: var(--tinta);
  }
  .seg {
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    text-transform: uppercase;
    color: var(--oro-texto);
    margin-top: var(--e-1);
  }
  .oscuro .et { color: var(--tinta-sobre-oscuro); }
</style>

<script lang="ts">
  /**
   * La unidad de la página. Alterna blanco y crema entre secciones consecutivas:
   * el contraste de superficie basta y no cuesta pintura ni sombras.
   * El margen lateral de 20 vive aquí y en ningún otro lado.
   */
  import type { Snippet } from 'svelte';
  import ReglaDorada from './ReglaDorada.svelte';

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
    <!-- ADR-0007 §6: la regla se repite como divisor entre bloques. Va con la
         etiqueta, que es donde empieza el bloque, y solo si hay etiqueta: una regla
         suelta sin nada que separar es adorno, no lenguaje. -->
    {#if etiqueta}
      <p class="etiqueta">{etiqueta}</p>
      <div class="divisor"><ReglaDorada /></div>
    {/if}
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

  /* Cada superficie resuelve qué es «oro como texto» sobre ella. Calculado:
       blanco #FFFFFF → --oro-800  4.65:1  pasa AA          (el valor de tokens.css)
       crema  #F0EFED → --oro-800  4.05:1  NO PASA          → baja a tinta secundaria
       oscuro #0C0D0F → --oro-500 11.12:1  pasa de sobra
     Sobre crema el oro de texto simplemente no existe, y es preferible a un renglón
     que no se lee a plena luz. No se inventa un oro más oscuro para taparlo. */
  .crema  { --oro-texto: var(--tinta-secundaria); }
  .oscuro { --oro-texto: var(--oro-500); }

  .etiqueta {
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    color: var(--tinta-secundaria);
    margin-bottom: var(--e-2);
  }
  .divisor { margin-bottom: var(--e-3); }
  .oscuro .etiqueta { color: var(--tinta-tenue-oscuro); }

  @media (min-width: 768px) {
    .seccion { padding-inline: var(--e-12); }
  }
</style>

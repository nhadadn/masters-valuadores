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

  /* Degradados dentro de una banda de luminancia · ADR-0010. El peor extremo de
     cada uno está calculado en tokens.css; ninguno baja de 15:1 con su tinta. */
  /* Las claras NO pintan fondo: dejan pasar el degradado continuo de `body`. Pintar
     aquí era lo que producía el bandeo —cada sección reiniciaba su rampa—.
     La alterna solo añade un velo del 4.5 %, que oscurece sin cortar la rampa y
     empuja el contraste hacia arriba, nunca hacia abajo. */
  .blanco { background: transparent; color: var(--tinta); }
  .crema  { background: var(--velo-alterno); color: var(--tinta); }

  /* La oscura sí es opaca: es otro mundo, no una variación del claro.
     `background-color` con el extremo PEOR, para que la medición sea pesimista. */
  .oscuro {
    background-color: var(--grafito);         /* peor extremo · blanco 15.23:1 */
    background-image: var(--grad-oscuro);
    color: var(--tinta-sobre-oscuro);
  }

  /* Cada superficie resuelve qué es «oro como texto» sobre ella. Calculado:
       blanco  #FFFFFF → --oro-800  4.65:1  pasa AA
       crema   #F0EFED → --oro-800  4.05:1  NO PASA
       acero   #ECEEF0 → --oro-800  4.00:1  NO PASA  ← extremo de los dos degradados claros
       oscuro  #0C0D0F → --oro-500 11.12:1  pasa de sobra

     Desde el ADR-0010 las superficies claras son DEGRADADOS que terminan en acero,
     así que el oro de texto no pasa en ninguna de las dos: las dos bajan a tinta
     secundaria. El titular de portada conserva su oro porque es texto GRANDE en
     peso 900, y ahí el piso de la WCAG baja a 3:1.
     Sobre crema el oro de texto simplemente no existe, y es preferible a un renglón
     que no se lee a plena luz. No se inventa un oro más oscuro para taparlo. */
  .blanco,
  .crema  { --oro-texto: var(--tinta-secundaria); }
  .oscuro { --oro-texto: var(--oro-500); --oro-texto-grande: var(--oro-500); }

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

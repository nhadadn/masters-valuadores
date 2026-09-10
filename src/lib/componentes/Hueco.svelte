<script lang="ts">
  /**
   * Contenido no aprobado. La etiqueta dice qué TRABAJO hace ese texto, no qué dice.
   *
   * Existe para que la ausencia de contenido sea visible en vez de disimulada.
   * Cuando llegue el copy, este componente desaparece de esa posición; mientras
   * tanto, cualquiera que abra la página ve exactamente qué falta.
   */
  /**
   * `como` decide con qué elemento se rotula el hueco. Importa: una página sin h1
   * no tiene encabezado, y que el titular esté pendiente no es excusa para que el
   * elemento no exista. Cuando llegue el copy, cambia el texto, no la estructura.
   */
  interface Props {
    etiqueta: string;
    renglones?: number;
    sobreOscuro?: boolean;
    como?: 'p' | 'h1' | 'h2' | 'h3';
  }
  let { etiqueta, renglones = 2, sobreOscuro = false, como = 'p' }: Props = $props();

  const anchos = [100, 72, 88, 64];
</script>

<div class="hueco" class:oscuro={sobreOscuro} data-pendiente="true">
  <svelte:element this={como} class="etiqueta">[PENDIENTE: contenido no aprobado] {etiqueta}</svelte:element>
  {#each Array(renglones) as _, i}
    <span class="barra" style="width: {anchos[i % anchos.length]}%"></span>
  {/each}
</div>

<style>
  .hueco {
    border: 1px dashed var(--negro-400);
    background: var(--crema-050);
    padding: var(--e-3) var(--e-3);
  }
  .etiqueta {
    margin: 0;
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    color: var(--tinta-secundaria);
  }
  .barra {
    display: block;
    height: 14px;
    border-radius: 2px;
    background: var(--negro-200);
    margin-top: var(--e-2);
  }
  .oscuro { border-color: var(--negro-600); background: rgba(255, 255, 255, 0.04); }
  .oscuro .etiqueta { color: var(--tinta-tenue-oscuro); }
  .oscuro .barra { background: var(--negro-500); }
</style>

<script lang="ts">
  /**
   * Migas de pan. Existe porque el sitio es multigiro (ADR-0003): en una landing
   * de una sola página no habría jerarquía que mostrar.
   *
   * El objetivo táctil es CADA ENLACE, no la barra que los contiene: un <nav> de
   * 44 con enlaces de 20 dentro no cumple 2.5.5, porque lo que se toca es el enlace.
   * Los nombres largos se abrevian aquí, y solo aquí: esto es navegación, no promesa.
   */
  interface Paso { texto: string; href?: string; }
  interface Props { pasos: Paso[]; }
  let { pasos }: Props = $props();
</script>

<nav aria-label="Ruta">
  <ol>
    {#each pasos as paso, i}
      <li>
        {#if i > 0}<span class="sep" aria-hidden="true">›</span>{/if}
        {#if paso.href}
          <a href={paso.href}>{paso.texto}</a>
        {:else}
          <span aria-current="page">{paso.texto}</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>

<style>
  ol { display: flex; flex-wrap: wrap; align-items: center; margin-left: calc(var(--e-2) * -1); }
  li { display: flex; align-items: center; }
  a, [aria-current] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--tactil-piso);
    min-width: var(--tactil-piso);
    padding: 0 var(--e-2);
    font-size: var(--pie-tam);
  }
  a { color: var(--tinta-secundaria); text-decoration: underline; text-underline-offset: 3px; }
  [aria-current] { color: var(--tinta); }
  .sep { color: var(--negro-500); font-size: var(--pie-tam); }
</style>

<script lang="ts">
  /**
   * Un dato de negocio que falta. Se ve a propósito.
   *
   * Si estuviera disimulado, alguien publicaría el sitio sin darse cuenta.
   * Sobre superficie oscura la tinta sube a negro-300: negro-500 da 3.02:1 ahí
   * y no pasa AA.
   */
  interface Props { que: string; decision?: string; sobreOscuro?: boolean; }
  let { que, decision, sobreOscuro = false }: Props = $props();
</script>

<span class="pc" class:oscuro={sobreOscuro} data-pendiente="true">
  <code>__POR_CONFIRMAR__</code>
  <span class="nota">· {que}{#if decision}{' · '}{decision}{/if}</span>
</span>

<style>
  .pc { display: inline-flex; align-items: baseline; gap: var(--e-2); flex-wrap: wrap; }
  code {
    font-family: ui-monospace, Menlo, monospace;
    font-size: var(--pie-tam);
    background: var(--negro-100);
    border: 1px solid var(--negro-400);
    color: var(--tinta-secundaria);
    padding: 1px 6px;
  }
  /* Sube de --negro-500 a tinta secundaria · ADR-0010. Sobre blanco daba 5.90:1,
     pero el campo de acero lo tumba a 4.26:1 y no pasa AA. Tinta secundaria da
     6.27:1 en el punto más oscuro de la rampa. */
  .nota { font-size: var(--pie-tam); line-height: var(--pie-alto); color: var(--tinta-secundaria); }
  .oscuro code { background: var(--negro-800); border-color: var(--negro-600); color: var(--negro-200); }
  .oscuro .nota { color: var(--tinta-tenue-oscuro); }
</style>

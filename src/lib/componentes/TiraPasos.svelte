<script lang="ts">
  /**
   * La mecánica del negocio, en tres palabras y en la primera pantalla · ADR-0024.
   *
   * ── POR QUÉ EXISTE ────────────────────────────────────────────────────────
   * Medido antes de esto: la respuesta a «¿qué pasa si llevo algo?» vivía a unos
   * 2400 px, pantalla 3 de 6 en un teléfono. El visitante del contrato —alguien con
   * prisa que necesita liquidez hoy— tomaba la decisión de quedarse o irse mucho
   * antes de llegar ahí.
   *
   * Esto NO sustituye a la sección del proceso: es su titular. Abajo siguen los tres
   * pasos completos, con sus condiciones («si aceptas, firmas…»), que es donde tienen
   * que estar. Aquí solo van tres etiquetas.
   *
   * Es una lista ordenada de verdad: para un lector de pantalla son «1, 2, 3», y las
   * flechas son decoración que no se anuncia.
   */
  interface Props {
    pasos: string[];
  }
  let { pasos }: Props = $props();
</script>

<ol class="tira" data-propuesta="true">
  {#each pasos as paso, i}
    <li>
      <span class="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      <span class="que">{paso}</span>
      {#if i < pasos.length - 1}
        <span class="flecha" aria-hidden="true"></span>
      {/if}
    </li>
  {/each}
</ol>

<style>
  .tira {
    list-style: none;
    margin: var(--e-4) 0;
    padding: 0;
    display: grid;
    gap: var(--e-2);
  }

  li {
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: var(--e-3);
    padding: var(--e-2) var(--e-3);
    background: var(--panel, var(--superficie-oscura));
    border: 1px solid var(--panel-borde);
  }

  .num {
    font-size: 1.375rem;
    font-weight: 900;
    line-height: 1;
    /* `--oro-texto-grande` y no `--oro-500`: en el registro claro el oro de marca
       sobre panel da 1.87:1 y deja de ser texto. El token ya resuelve los dos
       registros; escribir el color aquí sería la bomba de siempre. */
    color: var(--oro-texto-grande);
    font-variant-numeric: tabular-nums;
  }

  .que {
    font-size: var(--cuerpo-tam);
    font-weight: var(--cuerpo-fuerte-peso);
    line-height: 1.25;
  }

  /* La flecha entre pasos. En teléfono apunta hacia abajo porque la secuencia baja;
     en escritorio gira, porque avanza. Es un triángulo CSS: cero bytes y no pide
     ícono nuevo. */
  .flecha {
    position: absolute;
    left: 50%;
    bottom: calc(var(--e-2) * -1);
    width: 0;
    height: 0;
    transform: translate(-50%, 50%);
    border-inline: 7px solid transparent;
    border-top: 8px solid var(--oro-500);
    z-index: 1;
  }

  @media (min-width: 768px) {
    .tira {
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      gap: var(--e-4);
    }
    .flecha {
      left: auto;
      right: calc(var(--e-4) * -1);
      bottom: auto;
      top: 50%;
      transform: translate(50%, -50%);
      border-block: 7px solid transparent;
      border-top: 0;
      border-left: 8px solid var(--oro-500);
    }
  }
</style>

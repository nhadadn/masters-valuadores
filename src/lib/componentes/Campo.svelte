<script lang="ts">
  /**
   * Campo de formulario. Cuatro estados.
   *
   * El borde es negro-500, no negro-300: el gris bonito da 2.09:1 y a plena luz
   * del día desaparece, que es la condición de uso real de esta audiencia.
   * El error nunca se comunica solo con color: siempre ícono más texto.
   */
  interface Props {
    id: string;
    etiqueta: string;
    tipo?: string;
    ayuda?: string;
    error?: string;
    inactivo?: boolean;
    valor?: string;
  }
  let { id, etiqueta, tipo = 'text', ayuda, error, inactivo = false, valor = $bindable('') }: Props = $props();
</script>

<div class="campo">
  <label for={id}>{etiqueta}</label>
  <input
    {id} {tipo} bind:value={valor} placeholder={ayuda}
    disabled={inactivo}
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={error ? `${id}-error` : undefined}
    class:conError={!!error}
  />
  {#if error}
    <p class="error" id="{id}-error">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.01" />
      </svg>
      {error}
    </p>
  {/if}
</div>

<style>
  .campo { display: flex; flex-direction: column; gap: var(--e-2); }
  label { font-size: var(--cuerpo-tam); font-weight: var(--cuerpo-fuerte-peso); }
  input {
    min-height: 52px;
    padding: 0 var(--e-4);
    border: 2px solid var(--borde-campo);
    border-radius: var(--radio-campo);
    background: var(--superficie);
    color: var(--tinta);
  }
  input::placeholder { color: var(--negro-500); }
  input:disabled { background: var(--crema-050); border-color: var(--negro-300); color: var(--negro-500); }
  .conError { border-color: var(--error); }
  .error { display: flex; gap: var(--e-2); align-items: flex-start; font-size: var(--pie-tam); color: var(--error); }
  .error svg { flex-shrink: 0; margin-top: 2px; }
</style>

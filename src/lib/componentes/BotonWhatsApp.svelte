<script lang="ts">
  /**
   * El CTA de WhatsApp. Tres variantes: bloque, en línea y barra fija.
   *
   * El número NO vive aquí: sale de negocio.ts. Mientras esté sin confirmar,
   * el enlace no se arma y el botón queda inerte y marcado — es preferible a
   * mandar a la gente a un número inventado.
   */
  import { sucursalPrincipal, estaConfirmado } from '$lib/config/negocio';
  import { iconoWhatsApp } from '$lib/datos/iconos';

  interface Props {
    variante?: 'bloque' | 'linea' | 'barra';
    sobreOscuro?: boolean;
    /** De qué sección salió el contacto. Es la respuesta a «¿de dónde vino este cliente?». */
    origen: string;
    texto?: string;
  }
  let { variante = 'bloque', sobreOscuro = false, origen, texto = 'WhatsApp' }: Props = $props();

  const numero = $derived(sucursalPrincipal.whatsapp);
  const listo = $derived(estaConfirmado(numero));
  const enlace = $derived(listo ? `https://wa.me/${String(numero).replace(/\D/g, '')}` : undefined);
</script>

{#if listo}
  <a href={enlace} class="wa {variante}" class:oscuro={sobreOscuro} data-origen={origen} rel="noopener">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{@html iconoWhatsApp}</svg>
    {texto}
  </a>
{:else}
  <span class="wa {variante} inerte" class:oscuro={sobreOscuro} data-origen={origen}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{@html iconoWhatsApp}</svg>
    {texto}
    <span class="marca">__POR_CONFIRMAR__</span>
  </span>
{/if}

<style>
  .wa {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--e-2);
    min-height: var(--tactil);
    padding: 0 var(--e-4);
    border-radius: var(--radio-boton);
    background: var(--accion);
    color: var(--tinta-sobre-oscuro);
    font-weight: var(--cuerpo-fuerte-peso);
    line-height: 1;
  }
  .bloque { width: 100%; }
  .linea { min-height: var(--tactil-piso); }
  .barra { width: 100%; }
  .oscuro { background: var(--blanco); color: var(--negro-950); }

  /* Inerte a propósito: sin número confirmado no hay a dónde mandar a nadie. */
  .inerte { background: var(--negro-300); color: var(--negro-950); cursor: not-allowed; flex-wrap: wrap; }
  .marca {
    font-family: ui-monospace, Menlo, monospace;
    font-size: var(--pie-tam);
    background: var(--negro-100);
    border: 1px solid var(--negro-500);
    padding: 1px 6px;
  }
</style>

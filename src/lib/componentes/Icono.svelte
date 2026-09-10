<script lang="ts">
  /**
   * Ícono en línea. Hereda la tinta con `currentColor`, así que nunca escribe un color.
   * Decorativo por omisión: si comunica algo que el texto no dice, se le pasa `etiqueta`.
   */
  import { iconos } from '$lib/datos/iconos';

  interface Props { nombre: string; tam?: number; grosor?: number; etiqueta?: string; }
  let { nombre, tam = 24, grosor = 1.6, etiqueta }: Props = $props();

  const trazo = $derived(iconos[nombre] ?? '');
</script>

<svg
  width={tam} height={tam} viewBox="0 0 24 24"
  fill="none" stroke="currentColor" stroke-width={grosor}
  stroke-linecap="round" stroke-linejoin="round"
  role={etiqueta ? 'img' : undefined}
  aria-label={etiqueta}
  aria-hidden={etiqueta ? undefined : 'true'}
>{@html trazo}</svg>

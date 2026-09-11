<script lang="ts">
  /**
   * El mapa incrustado · ADR-0015. Decisión de Nadir, 11 de septiembre.
   *
   * ES LA PRIMERA PIEZA DEL SITIO QUE CARGA UN TERCERO. Hasta hoy no había ninguna:
   * fuentes autoalojadas, cero librerías, cero analítica, cero JavaScript. Lo que
   * cuesta está medido en el ADR, no estimado.
   *
   * Lo que sí se pudo acotar, y cómo:
   *
   *   `loading="lazy"`      No se pide hasta que el visitante se acerca. En móvil el
   *                         mapa vive muy abajo, así que la mayoría nunca lo paga.
   *   `aspect-ratio` fijo   El hueco existe antes de que el iframe cargue, así que no
   *                         hay desplazamiento de maqueta. El CLS medido sigue en cero.
   *   `title`               Un iframe sin título es un marco anónimo para un lector de
   *                         pantalla. Con él se puede saltar o entrar a propósito.
   *   `referrerpolicy`      No se le manda a Google la ruta completa de la página.
   *
   * Lo que NO se pudo acotar: el iframe pone cookies de Google en la visita, y eso no
   * se apaga con un atributo. Está anotado en el ADR y en el documento de
   * requerimientos, porque el aviso de privacidad tiene que decirlo.
   *
   * Sin coordenadas confirmadas no hay iframe: cae a la ranura etiquetada de siempre.
   */
  import { mapaEmbed, estaConfirmado, negocio } from '$lib/config/negocio';
  import RanuraImagen from './RanuraImagen.svelte';

  const src = $derived(mapaEmbed());
</script>

{#if estaConfirmado(src)}
  <div class="marco">
    <iframe
      {src}
      title="Mapa de ubicación de {negocio.nombreComercial} VALUADORES"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
{:else}
  <RanuraImagen relacion="4 / 3" etiqueta="MAPA — FALTAN LAS COORDENADAS (D-11)" />
{/if}

<style>
  /* El alto se reserva ANTES de cargar. Es lo que mantiene el CLS en cero. */
  .marco {
    aspect-ratio: 4 / 3;
    width: 100%;
    overflow: hidden;
    border-radius: var(--radio-bloque);
    border: var(--regla-dorada) solid var(--oro-500);
    background: var(--panel);
  }
  iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }
</style>

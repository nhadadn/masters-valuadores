<script lang="ts">
  /**
   * Fotografía de archivo · ADR-0009, PROVISIONAL.
   *
   * Esto revierte una parte del ADR-0007, que decía «En el sitio van fotos suyas o va
   * hueco». La decisión es de Nadir, del 10 de septiembre, con la objeción registrada
   * en el ADR-0009. No es una foto del negocio y no pretende serlo.
   *
   * CUATRO LÍMITES QUE VIENEN CON LA DECISIÓN:
   *
   *   1 · Se marca en pantalla. El rótulo dice que es de archivo y que se sustituye.
   *       Mismo criterio que la banda de BORRADOR del copy.
   *   2 · NINGUNA finge ser la fachada. Ese hueco no se rellena con un local ajeno:
   *       poner el escaparate de otro, con su rótulo, es el negocio de otro
   *       presentado como el de Cristóbal. `RanuraImagen` sigue ahí para eso.
   *   3 · Sin logotipos de terceros ni personas identificables.
   *   4 · Se revierte borrando `static/fotos/` y este archivo.
   *
   * PESO. La portada pesaba 4.5 KB de HTML y 0 KB de JavaScript; una foto de 68 KB es
   * quince veces eso. Por eso `srcset` con dos anchos —un teléfono de 390 baja el de
   * 800, no el de 1600—, `lazy` en todo lo que no sea la entrada, y `width`/`height`
   * declarados para que el hueco quede reservado y el CLS siga en cero.
   *
   * EL `alt` DESCRIBE LA FOTO, NO EL NEGOCIO. Decir «nuestro taller» en el alt sería
   * mentirle a quien no ve la pantalla, que es a quien menos se le puede mentir.
   */
  interface Props {
    /** Nombre base en `static/fotos/`, sin ancho ni extensión. */
    nombre: string;
    /** Describe LA FOTO. Nunca afirma que el local sea de Masters. */
    alt: string;
    relacion?: string;
    /** La de la entrada se carga de inmediato: es el LCP. El resto, diferida. */
    prioritaria?: boolean;
    /**
     * `true` = foto de archivo del ADR-0009: lleva rótulo y `data-provisional`.
     * `false` = foto REAL del negocio. Sin rótulo, porque no hay nada que advertir.
     */
    provisional?: boolean;
    /** Alto real del archivo, para reservar el hueco sin CLS. */
    alto?: number;
  }
  let {
    nombre, alt, relacion = '16 / 9', prioritaria = false,
    provisional = true, alto = 1067
  }: Props = $props();
</script>

<figure class="foto" data-provisional={provisional ? 'true' : undefined}>
  <img
    src="/fotos/{nombre}-800.jpg"
    srcset="/fotos/{nombre}-800.jpg 800w, /fotos/{nombre}-1600.jpg 1600w"
    sizes="(min-width: 768px) 50vw, 100vw"
    {alt}
    width="1600"
    height={alto}
    loading={prioritaria ? 'eager' : 'lazy'}
    fetchpriority={prioritaria ? 'high' : 'auto'}
    decoding="async"
    style="aspect-ratio: {relacion}"
  />
  {#if provisional}
    <figcaption>
      FOTO DE ARCHIVO · PROVISIONAL — se sustituye por una foto real del negocio
    </figcaption>
  {/if}
</figure>

<style>
  .foto { margin: 0; }
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    background: var(--negro-100);   /* el hueco mientras carga, sin salto */
  }
  /* El rótulo va sobre tierra oscura con tinta blanca: 19.44:1. No se disimula. */
  figcaption {
    background: var(--superficie-oscura);
    color: var(--tinta-sobre-oscuro);
    padding: var(--e-2) var(--e-3);
    font-size: var(--pie-tam);
    line-height: var(--pie-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
  }
</style>

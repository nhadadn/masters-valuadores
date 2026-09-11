<script lang="ts">
  /**
   * EL <head> DE TODAS LAS PÁGINAS · SPEC-0003.
   *
   * Va UNA VEZ en el layout, no una por ruta. Antes cada página escribía su propio
   * `<svelte:head>` y el resultado fue el previsible: la portada y contacto tenían
   * `__POR_CONFIRMAR__` en el título, las dos legales tenían `noindex` pero ninguna
   * descripción, y ninguna de las ocho tenía canónica ni tarjeta de enlace.
   *
   * Centralizado, una página nueva no puede nacer sin `<head>`: o está en el
   * inventario de `enlaces.ts` y tiene ficha, o `meta.ts` lanza excepción durante
   * el prerender y el build no sale.
   *
   * Cero JavaScript: son etiquetas, se resuelven al construir.
   */
  import { page } from '$app/state';
  import { negocio } from '$lib/config/negocio';
  import { fichaDe } from '$lib/seo/meta';
  import { paginaDe, absoluta, hayOrigen, IMAGEN_TARJETA } from '$lib/seo/enlaces';

  const ruta = $derived(page.url.pathname);
  const ficha = $derived(fichaDe(ruta));
  const indexable = $derived(paginaDe(ruta)?.indexable ?? false);

  const canonica = $derived(hayOrigen ? String(absoluta(ruta)) : null);
  const imagen = $derived(hayOrigen ? String(absoluta(IMAGEN_TARJETA.ruta)) : null);

  /**
   * `noindex` mientras no haya dominio · ADR-0013. No es prudencia de más: hoy el
   * sitio son huecos etiquetados y un aviso de borrador, y cualquier URL donde
   * esté colgado es provisional. Se abre solo al cerrar D-07.
   */
  const robots = $derived(!hayOrigen ? 'noindex, nofollow' : indexable ? 'index, follow' : 'noindex, follow');

  const porQue = '<!-- robots=noindex: el dominio (D-07) sigue abierto y no hay canonica que proteja esta URL. Ver ADR-0013. Se abre solo al escribir el dominio en negocio.ts. -->';
</script>

<svelte:head>
  {#if ficha}
    <title>{ficha.titulo}</title>
    <meta name="description" content={ficha.descripcion} />
    <meta property="og:title" content={ficha.titulo} />
    <meta property="og:description" content={ficha.descripcion} />
  {/if}

  <meta name="robots" content={robots} />
  {#if !hayOrigen}{@html porQue}{/if}
  {#if canonica}
    <link rel="canonical" href={canonica} />
    <meta property="og:url" content={canonica} />
  {/if}

  <meta property="og:site_name" content="{negocio.nombreComercial} VALUADORES" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_MX" />

  {#if imagen}
    <meta property="og:image" content={imagen} />
    <meta property="og:image:width" content={String(IMAGEN_TARJETA.ancho)} />
    <meta property="og:image:height" content={String(IMAGEN_TARJETA.alto)} />
    <meta property="og:image:alt" content={IMAGEN_TARJETA.alt} />
    <meta property="og:image:type" content="image/jpeg" />
    <meta name="twitter:card" content="summary_large_image" />
  {:else}
    <!-- Sin origen no hay imagen: og:image EXIGE URL absoluta. Una tarjeta sin
         imagen sigue mostrando título y descripción, que es mejor que nada y
         permite verificar el cableado hoy. -->
    <meta name="twitter:card" content="summary" />
  {/if}
</svelte:head>

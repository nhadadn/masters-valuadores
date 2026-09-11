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
  import { paginaDe, absoluta, hayOrigen, seIndexa, ORIGEN_TARJETA, IMAGEN_TARJETA } from '$lib/seo/enlaces';

  const ruta = $derived(page.url.pathname);
  const ficha = $derived(fichaDe(ruta));
  const indexable = $derived(paginaDe(ruta)?.indexable ?? false);

  /**
   * La canónica SOLO sale con el dominio de verdad. Apuntarla a la dirección de
   * vista previa sería declarar que la versión buena vive en Vercel — la trampa
   * exacta que el ADR-0013 evita.
   */
  const canonica = $derived(hayOrigen ? String(absoluta(ruta)) : null);

  /**
   * La TARJETA sí usa la vista previa, porque `og:url` y `og:image` exigen URL
   * absoluta y sin ellas el enlace llega pelado a WhatsApp — que es el canal por el
   * que este borrador se le pasa al cliente. No abre la indexación: el `noindex` de
   * abajo no depende de esto.
   */
  const urlTarjeta = $derived(`${ORIGEN_TARJETA}${ruta}`);
  const imagen = $derived(`${ORIGEN_TARJETA}${IMAGEN_TARJETA.ruta}`);

  /**
   * `noindex` mientras no haya dominio · ADR-0013. No es prudencia de más: hoy el
   * sitio son huecos etiquetados y un aviso de borrador, y cualquier URL donde
   * esté colgado es provisional. Se abre solo al cerrar D-07.
   */
  const robots = $derived(!seIndexa ? 'noindex, nofollow' : indexable ? 'index, follow' : 'noindex, follow');

  const porQue = '<!-- robots=noindex a proposito. Hacen falta DOS cosas: dominio (D-07) e INDEXACION_ABIERTA en src/lib/seo/enlaces.ts. Van separadas desde el ADR-0017: tener dominio no es lo mismo que tener contenido listo. -->';
</script>

<svelte:head>
  {#if ficha}
    <title>{ficha.titulo}</title>
    <meta name="description" content={ficha.descripcion} />
    <meta property="og:title" content={ficha.titulo} />
    <meta property="og:description" content={ficha.descripcion} />
  {/if}

  <meta name="robots" content={robots} />
  {#if !seIndexa}{@html porQue}{/if}
  {#if canonica}
    <link rel="canonical" href={canonica} />
  {/if}

  <meta property="og:url" content={urlTarjeta} />
  <meta property="og:site_name" content="{negocio.nombreComercial} VALUADORES" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="es_MX" />

  <meta property="og:image" content={imagen} />
  <meta property="og:image:width" content={String(IMAGEN_TARJETA.ancho)} />
  <meta property="og:image:height" content={String(IMAGEN_TARJETA.alto)} />
  <meta property="og:image:alt" content={IMAGEN_TARJETA.alt} />
  <meta property="og:image:type" content="image/jpeg" />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

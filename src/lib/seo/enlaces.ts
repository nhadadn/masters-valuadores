/**
 * EL ORIGEN DEL SITIO Y EL INVENTARIO DE PÁGINAS.
 *
 * Tres cosas necesitan una URL absoluta y hoy ninguna la tiene: la canónica, la
 * tarjeta de enlace (`og:url`, `og:image`) y el `sitemap.xml`. Todas dependen del
 * mismo dato —el dominio, D-07— y por eso viven aquí y no repartidas.
 *
 * El grafo JSON-LD ya resolvía esto mismo con `https://${negocio.dominio}`. Se
 * extrae a este módulo para que haya UNA definición de origen y no dos que se
 * puedan separar.
 *
 * ── EL INVENTARIO ─────────────────────────────────────────────────────────
 * La lista de páginas estaba escrita a mano en DOS lugares: `entries()` de la
 * ruta `[giro]` y el arreglo `RUTAS` de `herramientas/validar-a11y.mjs`, que
 * llevaba este comentario:
 *
 *   «Esta lista está a mano y es una trampa: si alguien cambia giros.ts y olvida
 *    esto, el validador pide páginas que ya no existen.»
 *
 * El sitemap habría sido la tercera copia, y la más cara: un sitemap que apunta a
 * una página que no existe es un 404 que le enseñas a Google tú mismo. Así que el
 * inventario se deriva de `giros.ts` y lo consumen los tres.
 *
 * Ver ADR-0013 y SPEC-0003.
 */

import { negocio, POR_CONFIRMAR, estaConfirmado, type Dato } from '$lib/config/negocio';
import { girosConstruibles } from '$lib/datos/giros';

/** `https://dominio` o la marca. Nunca una cadena inventada. */
export const ORIGEN: Dato<string> = estaConfirmado(negocio.dominio)
  ? `https://${negocio.dominio}`
  : POR_CONFIRMAR;

export const hayOrigen = estaConfirmado(ORIGEN);

/**
 * ORIGEN DE VISTA PREVIA · no es el dominio del negocio, y la diferencia importa.
 *
 * El sitio se despliega en Vercel para que Nadir lo vea en su teléfono y se lo pase a
 * Cristóbal. Esa dirección **no es un dato de negocio**: es dónde está colgado el
 * borrador hoy. No entra en `negocio.ts` y no cierra D-07.
 *
 * Sirve para UNA sola cosa: darle URL absoluta a `og:url` y `og:image`, que la exigen.
 * Sin ella, mandar el enlace por WhatsApp llega como texto pelado — sin fachada, sin
 * título y sin descripción, que es justo lo que se construyó en SPEC-0003.
 *
 * LO QUE **NO** HACE, y por eso no contradice al ADR-0013:
 *   · No emite canónica. Una canónica apuntando a un dominio provisional es la
 *     trampa exacta que ese ADR evita.
 *   · No abre la indexación. Las páginas siguen `noindex, nofollow`.
 *   · No entra al sitemap.
 *
 * Se borra el día que cierre D-07.
 */
export const ORIGEN_VISTA_PREVIA = 'https://masters-valuadores-borrador.vercel.app';

/** Solo para la tarjeta de enlace. El dominio real manda en cuanto exista. */
export const ORIGEN_TARJETA: string = hayOrigen ? String(ORIGEN) : ORIGEN_VISTA_PREVIA;

export interface Pagina {
  /** Con barra final: `trailingSlash: 'always'` en `src/routes/+layout.ts:9`. */
  ruta: string;
  /**
   * Si Google debe indexarla. Los textos legales no: no responden a ninguna
   * búsqueda y diluyen el poco peso que un sitio nuevo tiene para repartir.
   */
  indexable: boolean;
}

/**
 * TODAS las rutas que el build produce. Si aparece una página nueva y no está
 * aquí, el test `seo.test.ts` la caza comparando contra el disco.
 */
export const paginas: Pagina[] = [
  { ruta: '/', indexable: true },
  ...girosConstruibles.map((g) => ({ ruta: `/${g.slug}/`, indexable: true })),
  { ruta: '/contacto/', indexable: true },
  { ruta: '/aviso-de-privacidad/', indexable: false },
  { ruta: '/terminos/', indexable: false }
];

export const paginasIndexables = paginas.filter((p) => p.indexable);

export function paginaDe(ruta: string): Pagina | undefined {
  return paginas.find((p) => p.ruta === ruta);
}

/** URL absoluta de una ruta, o la marca si el dominio sigue abierto. */
export function absoluta(ruta: string, origen: Dato<string> = ORIGEN): Dato<string> {
  return estaConfirmado(origen) ? `${origen}${ruta}` : POR_CONFIRMAR;
}

/**
 * LA IMAGEN DE LA TARJETA DE ENLACE · una sola para todo el sitio, y es la fachada.
 *
 * Las otras cuatro fotos son de banco (ADR-0009) y en la página salen rotuladas
 * como provisionales. Una tarjeta de WhatsApp no tiene dónde poner ese rótulo: se
 * vería una excavadora de catálogo firmada por Masters, sin aviso. La fachada es
 * la única foto real que existe, es la ventaja que ninguna cadena puede copiar
 * (`docs/60-diseno/brief-de-fotos.md`) y es la que va en las ocho páginas.
 */
export const IMAGEN_TARJETA = {
  ruta: '/marca/tarjeta-fachada.jpg',
  ancho: 1200,
  alto: 630,
  alt: 'Fachada del local de MASTERS VALUADORES en Torreón, con el letrero a la vista'
} as const;

/**
 * El `sitemap.xml`.
 *
 * SOLO LLEVA `<loc>`. No lleva `priority` ni `changefreq` —Google declara
 * públicamente que los ignora— y no lleva `lastmod` porque el único valor que
 * podríamos poner es la hora del build, y eso no es cuándo cambió el contenido:
 * es cuándo compilamos. Google descarta el `lastmod` de un sitio que lo reporta
 * mal, y descartarlo cuesta más que no ponerlo.
 *
 * Sin dominio sale vacío a propósito. Ver ADR-0013.
 */
export function construirSitemap(origen: Dato<string> = ORIGEN): string {
  const cuerpo = estaConfirmado(origen)
    ? paginasIndexables.map((p) => `  <url><loc>${absoluta(p.ruta, origen)}</loc></url>`).join('\n')
    : '  <!-- Vacío a propósito: el dominio (D-07) sigue sin decidirse y cada entrada\n' +
      '       de un sitemap necesita URL absoluta. No se inventa. Ver ADR-0013. -->';
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cuerpo}
</urlset>
`;
}

/**
 * El `robots.txt`.
 *
 * Mientras no haya dominio, PROHÍBE TODO. No es prudencia de más: hoy el sitio
 * son 27 huecos, marcas `__POR_CONFIRMAR__` visibles y un aviso de borrador. Si
 * eso se despliega en una URL de vista previa y Google lo indexa, la primera
 * impresión del proyecto queda hecha con el borrador, y luego compite contra el
 * dominio bueno. Ver ADR-0013.
 */
export function construirRobots(origen: Dato<string> = ORIGEN): string {
  if (!estaConfirmado(origen)) {
    return `# Sitio EN CONSTRUCCIÓN. No se indexa nada todavía.
#
# El dominio definitivo no está decidido (D-07), así que cualquier URL donde esto
# esté colgado hoy es provisional. Indexar una URL provisional crea un duplicado
# que después compite contra el dominio bueno.
#
# Esto se abre solo: en cuanto «dominio» deje de ser __POR_CONFIRMAR__ en
# src/lib/config/negocio.ts, este archivo pasa a permitir el rastreo y aparece la
# línea Sitemap. No hay que acordarse de nada.

# Los lectores de VISTA PREVIA sí pasan, y son la excepción a propósito. No indexan:
# solo leen las etiquetas Open Graph para dibujar la tarjeta cuando alguien pega el
# enlace en WhatsApp. Sin esto, pasarle el borrador al cliente llega como texto
# pelado — sin fachada, sin título y sin descripción.
User-agent: facebookexternalhit
User-agent: WhatsApp
User-agent: Twitterbot
User-agent: Slackbot-LinkExpanding
User-agent: TelegramBot
Allow: /

# Todo lo demás —buscadores incluidos— fuera. Y además cada página lleva su propio
# «noindex», así que son dos cerrojos y no uno.
User-agent: *
Disallow: /
`;
  }
  const noIndexables = paginas.filter((p) => !p.indexable);
  return `# ${negocio.nombreComercial} VALUADORES

User-agent: *
Allow: /
${noIndexables.map((p) => `Disallow: ${p.ruta}`).join('\n')}

Sitemap: ${absoluta('/sitemap.xml', origen)}
`;
}

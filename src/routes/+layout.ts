/**
 * Sitio completamente estático: cada ruta se prerenderiza a HTML durante el build.
 * Es lo que hace que la excepción del módulo JSON-LD reviente la publicación en
 * vez de aparecer en producción.
 */
export const prerender = true;
export const trailingSlash = 'always';

/**
 * CERO JAVASCRIPT EN EL CLIENTE.
 *
 * Medido: el runtime de Svelte 5 más el enrutador pesan ~46 KB gzip por página.
 * El presupuesto del contrato es 40 KB (CA-10), así que el marco solo ya no cabía.
 *
 * La salida no fue subir el presupuesto: fue preguntarse qué necesita JavaScript
 * en este sitio. La respuesta es NADA. Enlaces, secciones y datos estructurados son
 * HTML; el único componente que parecía necesitarlo —el acordeón de preguntas— se
 * resuelve con <details> nativo, que además llega accesible de fábrica.
 *
 * Con esto cada página se sirve como HTML prerenderizado y hoja de estilo, y la
 * audiencia —teléfono de gama baja, 4G, a plena luz— no paga hidratación ninguna.
 * El costo asumido: cada navegación es una carga completa. Con páginas de 4 KB
 * comprimidas, es más barato que hidratar.
 *
 * Si algún día una pantalla necesita interacción real, se le pone `csr = true`
 * a ESA ruta y solo esa paga el runtime.
 */
export const csr = false;

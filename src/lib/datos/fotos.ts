/**
 * De dónde sale el `srcset` de una foto. UN solo sitio.
 *
 * Este cálculo vivía dentro de `Foto.svelte`, y al llegar la galería hacía falta
 * otra vez. Copiarlo habría repetido el defecto que se acababa de arreglar en los
 * generadores de imagen, donde había tres listas de fotos a mano y ya habían
 * divergido: el día que cambien los anchos, uno de los dos se queda viejo y sirve un
 * `srcset` que apunta a archivos que no existen. El navegador no avisa — se queda con
 * el que sí exista, o con ninguno.
 */

/**
 * Los anchos que generan `hacer-miniaturas.mjs`, `hacer-webp.mjs` y `hacer-avif.mjs`.
 * Si aquí se añade uno, hay que generarlo; si allá se genera uno, hay que añadirlo.
 */
/* 1200 entra con el original vertical de joyería · ADR-0032. Ese archivo mide 1206 px
   reales, así que 1200 es su tope honesto y 1600 no existe para él.

   OJO, y lo digo porque aquí escribí lo contrario y el build me corrigió: añadir un
   peldaño **SÍ** cambia el `srcset` de TODAS las fotos con `fotoMaxAncho` >= 1200.
   El prerender falló con `404 /fotos/fachada-1200.avif`. Por eso el 1200 existe ahora
   para las cinco que tenían 1600. Un ancho en esta lista es una promesa de archivo. */
export const ANCHOS = [400, 600, 800, 1200, 1600] as const;

/**
 * Hasta qué ancho existe ese archivo.
 *
 * NO todas llegan a 1600, y eso NO se arregla escalando: las fotos reales de su
 * inventario vienen dentro de piezas de redes que WhatsApp ya comprimió, así que la
 * fuente mide entre 440 y 985 px. Pedirle al navegador un archivo de 1600 que no
 * existe rompe el `srcset`; generarlo escalando sería inventar píxeles y pesar más
 * por una imagen más borrosa.
 */
export function anchosDe(maxAncho: number): number[] {
  return ANCHOS.filter((a) => a <= maxAncho);
}

/** `srcset` para un formato, con los anchos que de verdad existen. */
export function srcset(nombre: string, extension: string, maxAncho: number): string {
  return anchosDe(maxAncho)
    .map((a) => `/fotos/${nombre}-${a}.${extension} ${a}w`)
    .join(', ');
}

/**
 * Las fotografías REALES de su patio y su inventario · ADR-0022.
 *
 * De dónde salen: de las piezas 22 y 23 de la tanda del 11 de septiembre, recortadas.
 * No son fotos de archivo y NO llevan el rótulo del ADR-0009 ni el tinte: son suyas,
 * es su patio y es su equipo. Mismo criterio que ya se aplicó a la pieza 21.
 *
 * ── LO QUE ESTAS FOTOS NO DICEN ─────────────────────────────────────────────
 *
 * **No son una lista de existencias.** Están dentro de piezas de redes de fecha
 * desconocida, y nadie ha confirmado que ese equipo siga ahí. Que alguien venga por
 * el rodillo Benford y no esté es exactamente el daño que el CLAUDE.md describe: el
 * visitante llega, se va y no vuelve.
 *
 * Por eso ni un pie de foto dice «en venta», «disponible» ni «lo tenemos». Describen
 * la MÁQUINA que se ve, y la nota de la galería dice lo demás.
 *
 * ── LOS PIES SON PROPUESTA ──────────────────────────────────────────────────
 * Cristóbal no los dictó: los escribimos mirando la foto. Un `310D` o un `Yale` se
 * leen en la carrocería, así que son casi hechos; el resto es descripción. Van con
 * `data-propuesta` como el resto del copy sin aprobar.
 *
 * ── EL LÍMITE DE RESOLUCIÓN, QUE NO SE ARREGLA AQUÍ ─────────────────────────
 * Vienen dentro de arte que WhatsApp ya comprimió: la fuente mide entre 440 y 985 px.
 * Por eso `maxAncho` es bajo y por eso la retícula no crece más. Con los ORIGINALES
 * de Cristóbal esto se ve mejor sin tocar una línea de código.
 */

export interface FotoDeGaleria {
  /** Nombre base en `static/fotos/`. */
  nombre: string;
  /** Hasta qué ancho existe el archivo. No se escala hacia arriba. */
  maxAncho: number;
  /** Describe LA FOTO. No afirma disponibilidad. */
  alt: string;
  /** Pie visible · PROPUESTA SIN APROBAR. */
  pie: string;
}

export const galeriaInventario: FotoDeGaleria[] = [
  {
    nombre: 'inv-rodillo',
    maxAncho: 600,
    alt: 'Rodillo compactador Benford de doble tambor en un patio de grava, con un brazo articulado y una retroexcavadora detrás',
    pie: 'Rodillo compactador Benford'
  },
  {
    nombre: 'inv-toldo',
    maxAncho: 400,
    alt: 'Un rodillo Benford y una retroexcavadora John Deere 310D estacionados bajo un toldo',
    pie: 'Rodillo y retroexcavadora, bajo techo'
  },
  {
    nombre: 'inv-montacargas',
    maxAncho: 400,
    alt: 'Montacargas Yale junto a la reja amarilla del patio',
    pie: 'Montacargas Yale'
  },
  {
    /**
     * Esta es la de la pieza 21, la que ya usa maquinaria. Ocupa el sitio de un
     * recorte panorámico que se probó y se tiró: medía 985×246 y en una celda 3:2
     * se recortaba al centro, así que salía borrosa Y su pie dejaba de describir lo
     * que se veía — prometía «la 310D y el rodillo» y se veía una cuchara.
     * Repetir una foto entre dos páginas es menos malo que publicar una mala.
     */
    nombre: 'patio',
    maxAncho: 800,
    alt: 'Patio con una retroexcavadora John Deere 310D, un rodillo Benford y montacargas',
    pie: 'El patio, con la 310D y el rodillo'
  },
  {
    nombre: 'inv-brazo',
    maxAncho: 400,
    alt: 'Brazo articulado JLG, dos torres de iluminación y un generador en el patio',
    pie: 'Brazo articulado y torres de iluminación'
  },
  {
    nombre: 'inv-soldadoras',
    maxAncho: 400,
    alt: 'Varias máquinas de soldar alineadas contra una pared, bajo techo',
    pie: 'Máquinas de soldar'
  }
];

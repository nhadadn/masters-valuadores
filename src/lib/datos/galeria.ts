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
  /**
   * TRUE = imagen de REFERENCIA generada, no fotografía del negocio · ADR-0034.
   *
   * Nadir decidió publicarlas tras plantearse la objeción dos veces por escrito. El
   * `ADR-0034` registra la objeción y el costo; aquí vive el HECHO, en el dato y no
   * solo en un comentario, para que cualquiera pueda contarlas o rotularlas mañana
   * sin volver a deducir cuál es cuál mirando píxeles.
   *
   * La nota del carrusel se calcula de este campo, así que no se puede quedar
   * desactualizada al añadir o quitar imágenes.
   */
  referencia?: boolean;
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


/**
 * Joyería · TRES VISTAS DE UNA MISMA FOTOGRAFÍA · ADR-0033.
 *
 * Y hay que decirlo así, sin adornos: **no son tres fotos, son tres recortes del
 * mismo original** —`fotos-origen/bien-joyeria-original-1206.jpg`, 1206×1518—, que
 * es la ÚNICA fotografía de joyería suya que existe. `bien-joyeria` y `bien-oro`,
 * que el ADR-0024 contó como dos, también son recortes de esta misma toma: se
 * comprobó mirándolas.
 *
 * ── POR QUÉ ES LEGÍTIMO, Y DÓNDE ESTÁ EL LÍMITE ───────────────────────
 * La técnica es la del ADR-0022: recortar sus propias piezas. Todo lo que se ve
 * aquí es una pieza real que pasó por su mostrador, fotografiada por ellos.
 *
 * El límite, dicho antes de que lo diga nadie: detalle, detalle y plano de conjunto
 * es una secuencia editorial normal, pero **no es lo mismo que las seis del patio**,
 * donde un rodillo y un montacargas son objetos distintos. Con una cámara y cuatro
 * piezas más esto se vuelve una galería de verdad. Hoy es una sola toma, bien vista.
 *
 * ── TRES RECORTES QUE SE TIRARON, Y POR QUÉ ────────────────────────────
 * Se intentaron tres más, uno por pareja de anillos de la charola. Los tres salieron
 * mal, y el motivo está en el original: la charola queda pegada al borde derecho del
 * encuadre, así que **los anillos vienen ya cortados en la foto**. Ningún recorte
 * arregla eso. Se vieron y se tiraron.
 *
 * ── LA RESOLUCIÓN SÍ DA, y se midió antes de recortar ───────────────────
 * El listón no es teórico: la celda del carrusel del patio mide 262×177 px en un
 * teléfono y se sirve con un archivo de 288×180 —densidad real 1.1×—, y 320×213 en
 * escritorio con uno de 320. Estos recortes salen de 624 y 1000 px nativos, o sea
 * por encima de lo que el patio cumple hoy.
 *
 * ── LOS PIES SON PROPUESTA, y ninguno dice «en venta» ──────────────────
 * Mismo criterio que `galeriaInventario`: describen la PIEZA que se ve. Nadie ha
 * confirmado que siga ahí, y prometerlo es el daño que el CLAUDE.md describe.
 * «Breitling» se lee en la carátula, igual que el `310D` se lee en la carrocería.
 */
export const galeriaJoyeria: FotoDeGaleria[] = [
  {
    nombre: 'joy-reloj',
    maxAncho: 600,
    alt: 'Carátula de un cronógrafo Breitling con bisel de diamantes y números romanos, sobre fondo negro',
    pie: 'Cronógrafo Breitling con bisel de diamantes'
  },
  {
    nombre: 'joy-cadena',
    maxAncho: 600,
    alt: 'Cadena de oro de eslabón cubano, en diagonal sobre terciopelo negro',
    pie: 'Cadena de eslabón cubano en oro'
  },
  {
    nombre: 'joy-conjunto',
    maxAncho: 800,
    alt: 'Cronógrafo con bisel de diamantes junto a una cadena de oro y una charola con anillos de esmeraldas y zafiros',
    pie: 'Reloj, cadena y anillos'
  },

  /* ── DE AQUÍ EN ADELANTE, IMÁGENES DE REFERENCIA · ADR-0034 ────────────────
     No son suyas ni son fotografías: son generadas. Entran por decisión de Nadir,
     reafirmada dos veces, y con la objeción registrada en el ADR-0034.

     Van DESPUÉS de las tres suyas a propósito: la secuencia va de lo propio a lo
     ilustrativo, no mezclado, para que la nota del final cubra una cola y no un
     surtido.

     Topadas a 600 px, y esto no es un detalle técnico: cada tarjeta del carrusel
     ENLAZA al archivo más grande que exista, así que publicar el original de 1200
     dejaba la versión inspeccionable a un toque. A 600 los defectos no se resuelven.

     Los pies describen el OBJETO que se ve. Ninguno dice «tenemos», «en venta» ni
     «disponible», que es la misma regla que `galeriaInventario`. */
  {
    nombre: 'lujo-vitrina',
    maxAncho: 600,
    referencia: true,
    alt: 'Mostrador de relojería con una fila de relojes de oro y cadenas, con la tienda desenfocada al fondo',
    pie: 'Vitrina de relojería y joyería'
  },
  {
    nombre: 'lujo-cronografo',
    maxAncho: 600,
    referencia: true,
    alt: 'Cronógrafo de oro con bisel de diamantes y carátula negra, sobre fondo oscuro',
    pie: 'Cronógrafo de oro con bisel de diamantes'
  },
  {
    nombre: 'lujo-esqueleto',
    maxAncho: 600,
    referencia: true,
    alt: 'Reloj de esqueleto en oro rosa, con el movimiento a la vista, sobre tela negra',
    pie: 'Reloj de esqueleto en oro rosa'
  },
  {
    nombre: 'lujo-piel',
    maxAncho: 600,
    referencia: true,
    alt: 'Reloj de oro con carátula negra y correa de piel, sobre fondo oscuro',
    pie: 'Reloj de oro con correa de piel'
  },

  /* MONEDAS · y aquí el riesgo es de otra clase, así que queda anotado.
     En los relojes el defecto vivía en texto diminuto de carátula. En una moneda
     mexicana **el texto ES el tema** y la inscripción está fijada por ley: un
     Centenario dice «1821 1947», no «19S07», y el 10 pesos de esta imagen trae un
     literal «SUBJ» en el exergo. Ampliadas al 100 % son errores evidentes para
     cualquiera que haya empeñado un centenario, que en la Laguna es mucha gente.

     Se midió antes de publicarlas: a 320×213, la celda real del carrusel, **lo
     legible es lo correcto** —«ORO PURO», «PLATA PURA», «1000 g»— y lo erróneo
     desaparece. Por eso van topadas a 600 y nunca al tamaño del original. */
  {
    nombre: 'lujo-monedas-claro',
    maxAncho: 600,
    referencia: true,
    alt: 'Monedas mexicanas de oro y plata —entre ellas una onza Libertad— apiladas sobre mármol claro con vetas doradas',
    pie: 'Monedas de oro y plata'
  },
  {
    nombre: 'lujo-monedas-oscuro',
    maxAncho: 600,
    referencia: true,
    alt: 'Lingotes de oro y plata junto a monedas mexicanas de oro y plata, sobre mármol oscuro',
    pie: 'Lingotes y monedas'
  }
];

/**
 * La nota del carrusel de joyería, calculada · ADR-0034.
 *
 * Se calcula del campo `referencia` para que NO pueda quedarse desactualizada. Si
 * mañana entran fotos de Cristóbal y salen las generadas, la nota desaparece sola.
 *
 * Y es deliberadamente una nota, no el rótulo «FOTO DE ARCHIVO» que Nadir pidió
 * quitar de la interfaz: una línea de crédito al pie de la secuencia, como la que
 * lleva cualquier publicación, en vez de una etiqueta encima de cada imagen.
 */
export const notaJoyeria: string | undefined = (() => {
  const n = galeriaJoyeria.filter((f) => f.referencia).length;
  if (!n) return undefined;
  return n === galeriaJoyeria.length
    ? 'Imágenes de referencia, no de nuestro inventario.'
    : `Las últimas ${n} son imágenes de referencia, no de nuestro inventario.`;
})();

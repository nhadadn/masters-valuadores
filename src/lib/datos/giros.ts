/**
 * Los giros del grupo. La ESTRUCTURA está cerrada por ADR-0003 (multigiro);
 * lo que sigue abierto son los slugs y la prioridad, y esos NO se inventan:
 * el slug es la promesa que el sitio le hace a Google sobre qué contiene la
 * página, y elegirlo antes de saber qué se busca es apostar el posicionamiento
 * de esa página a una corazonada. Salen de la Etapa 1.
 *
 * Los `slug` de abajo son PROVISIONALES y están marcados como tales. Renombrar
 * una ruta antes de publicar no cuesta nada; después sí.
 *
 * Mapa completo: docs/40-seo/mapa-de-paginas.md
 */

export type EstadoGiro = 'construible' | 'bloqueado';

export interface Giro {
  /** Slug provisional. Definitivo pendiente de la Etapa 1. */
  slug: string;
  /** Nombre de la línea, documentado por el cliente. No es copy inventado. */
  nombre: string;
  /** Nombre corto para navegación y migas, cuando el largo no cabe. */
  nombreCorto: string;
  /**
   * Frase de la tarjeta · PROPUESTA SIN APROBAR.
   *
   * Sale de `docs/70-contenido/propuesta-textos.md`, que Cristóbal todavía no
   * corrige. Cada una dice qué es ese giro POR DEFINICIÓN —no qué tan bueno es—,
   * así que ninguna afirma nada que él tenga que sostener.
   *
   * Se distingue del resto de este archivo a propósito: `nombre` está documentado
   * por el cliente, esto es borrador nuestro. Ver `AvisoBorrador.svelte`.
   */
  frasePropuesta?: string;
  /**
   * Foto de archivo PROVISIONAL · ADR-0009. Nombre base en `static/fotos/`.
   * NO es una foto del negocio. Sale entera cuando lleguen las de Cristóbal:
   * ver `docs/60-diseno/brief-de-fotos.md`.
   */
  fotoProvisional?: string;
  /** Describe LA FOTO, nunca afirma que el local sea de Masters. */
  fotoAlt?: string;
  /**
   * Subtitular del giro · PROPUESTA SIN APROBAR.
   * Dice lo que ese giro es POR DEFINICIÓN. Ni una cifra, ni un plazo, ni una lista
   * de bienes, ni una promesa de calidad. Ver `AvisoBorrador.svelte`.
   */
  subtitularPropuesto?: string;
  /**
   * Qué reciben en esa línea · DEDUCIDO, no dictado por el cliente.
   *
   * Nadir lo autorizó el 11 de septiembre: «tú dedúcelo, después lo retrabajamos».
   * Cada renglón lleva DE DÓNDE SALE, y esa es la parte importante: un bien sacado
   * del letrero es casi un hecho, uno deducido es una apuesta que Cristóbal tiene
   * que confirmar o tachar. Se muestran los dos, distinguidos, en la página.
   *
   *   letrero      está escrito en la fachada
   *   publicacion  aparece en una de sus cinco piezas
   *   deducido     NO hay fuente. Lo pusimos nosotros
   */
  bienesPropuestos?: { que: string; fuente: 'letrero' | 'publicacion' | 'deducido' }[];
  /**
   * Los tres pasos del proceso · PROPUESTA SIN APROBAR.
   * NINGUNO dice cuánto ni cuándo: eso va en el bloque de cifras, que sigue
   * bloqueado. Cada uno asume algo y esos supuestos están listados en
   * `docs/30-cliente/requerimientos-cristobal.md`.
   */
  pasosPropuestos?: [string, string, string];
  icono: string;
  estado: EstadoGiro;
  /** Qué decisión lo destraba, si está bloqueado. */
  bloqueadoPor?: string;
}

export const giros: Giro[] = [
  // CUATRO GIROS · ADR-0008. El orden es el que dijo el cliente, NO una prioridad
  // de búsqueda: esa sale de la Etapa 1 y sigue sin ejecutarse.
  { slug: 'empeno-y-prestamo',   nombre: 'Empeño y préstamo',            nombreCorto: 'Empeño',      frasePropuesta: 'Dejas un bien en garantía y sales con efectivo', fotoProvisional: 'empeno', fotoAlt: 'Relojes de oro y joyería antigua sobre una superficie oscura', subtitularPropuesto: 'Traes un bien, lo valuamos y te decimos cuánto. Si te sirve, sales con tu efectivo y tu bien queda resguardado hasta que lo recuperes.', pasosPropuestos: ['Traes tu bien y una identificación oficial vigente.', 'Lo valuamos y te decimos cuánto te podemos prestar.', 'Si aceptas, firmas tu contrato y te llevas el efectivo.'], bienesPropuestos: [{ que: 'Oro y joyería', fuente: 'publicacion' }, { que: 'Relojes', fuente: 'publicacion' }, { que: 'Monedas', fuente: 'publicacion' }, { que: 'Herramienta', fuente: 'letrero' }, { que: 'Maquinaria', fuente: 'letrero' }, { que: 'Autos', fuente: 'letrero' }], icono: 'empeno',  estado: 'construible' },
  { slug: 'compra-venta-de-maquinaria', nombre: 'Compra venta de maquinaria', nombreCorto: 'Maquinaria', frasePropuesta: 'Compra y venta de maquinaria y equipo', fotoProvisional: 'maquinaria', fotoAlt: 'Cargador frontal amarillo en un terreno de obra', subtitularPropuesto: 'Compramos maquinaria y equipo, y vendemos lo que tenemos disponible. Si quieres vender, lo valuamos antes de hablar de precio.', pasosPropuestos: ['Nos dices qué máquina tienes, o qué estás buscando.', 'La revisamos y la valuamos.', 'Acordamos el precio y cerramos la operación.'], bienesPropuestos: [{ que: 'Maquinaria pesada', fuente: 'letrero' }, { que: 'Equipo industrial', fuente: 'publicacion' }, { que: 'Equipo agrícola', fuente: 'publicacion' }, { que: 'Herramienta', fuente: 'letrero' }, { que: 'Maquinaria de importación', fuente: 'publicacion' }], icono: 'renta', estado: 'construible' },
  { slug: 'fletes-y-logistica',  nombre: 'Fletes y logística',           nombreCorto: 'Fletes',      frasePropuesta: 'Transporte y movimiento de carga', fotoProvisional: 'fletes', fotoAlt: 'Camión de carga transportando un contenedor por una carretera', subtitularPropuesto: 'Transportamos y movemos carga. Dinos qué necesitas mover y a dónde, y te decimos si podemos hacerlo.', pasosPropuestos: ['Nos dices qué hay que mover, desde dónde y hasta dónde.', 'Revisamos si entra en nuestro equipo y te cotizamos.', 'Acordamos la fecha y hacemos el traslado.'], bienesPropuestos: [{ que: 'Contenedores marítimos', fuente: 'letrero' }, { que: 'Maquinaria pesada', fuente: 'deducido' }, { que: 'Carga general', fuente: 'deducido' }], icono: 'fletes',  estado: 'construible' },
  { slug: 'taller-y-refaccionaria', nombre: 'Taller y refaccionaria',    nombreCorto: 'Taller',      frasePropuesta: 'Servicio de taller y venta de refacciones', fotoProvisional: 'taller', fotoAlt: 'Manos de un mecánico eligiendo dados de una caja de herramienta', subtitularPropuesto: 'Servicio de taller y venta de refacciones. Lo traes, lo revisamos y te decimos qué necesita.', pasosPropuestos: ['Traes la unidad o nos dices qué refacción buscas.', 'La revisamos y te decimos qué necesita.', 'Autorizas el trabajo y lo hacemos.'], icono: 'taller',  estado: 'construible' },

  // SALIERON el 10 de septiembre por el ADR-0008: joyería, bazar y financiera.
  // No se borran de la historia: el ADR registra qué se soltó y qué costó.
  // Joyería era el giro con el material vivo más fuerte —dos de sus cinco
  // publicaciones— y con ella se queda sin casa la D-15, «Compramos monedas».

  // No se construyen hasta que se cierren sus decisiones. Aparecen en la portada
  // como bloqueados a propósito: lo que falta decidir se ve, no se esconde.
  { slug: 'importaciones',       nombre: 'Importaciones',               nombreCorto: 'Importaciones', icono: 'bloq', estado: 'bloqueado', bloqueadoPor: 'D-04' },
  { slug: 'valuacion',           nombre: 'Avalúos periciales',          nombreCorto: 'Avalúos',       icono: 'bloq', estado: 'bloqueado', bloqueadoPor: 'D-03' }
];

/** Los que sí se prerenderizan. Los bloqueados no generan ruta. */
export const girosConstruibles = giros.filter((g) => g.estado === 'construible');
export const girosBloqueados  = giros.filter((g) => g.estado === 'bloqueado');

export function giroPorSlug(slug: string): Giro | undefined {
  return girosConstruibles.find((g) => g.slug === slug);
}

/** Los slugs son provisionales: se marca en el código, no solo en un documento. */
export const SLUGS_PROVISIONALES = true;

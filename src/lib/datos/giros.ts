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
  icono: string;
  estado: EstadoGiro;
  /** Qué decisión lo destraba, si está bloqueado. */
  bloqueadoPor?: string;
}

export const giros: Giro[] = [
  { slug: 'empeno-y-prestamo',   nombre: 'Empeño y préstamo',           nombreCorto: 'Empeño',      frasePropuesta: 'Dejas un bien en garantía y sales con efectivo', icono: 'empeno',  estado: 'construible' },
  { slug: 'joyeria',             nombre: 'Joyería',                     nombreCorto: 'Joyería',     frasePropuesta: 'Compra y venta de joyería', icono: 'joyeria', estado: 'construible' },
  { slug: 'bazar',               nombre: 'Bazar',                       nombreCorto: 'Bazar',       frasePropuesta: 'Artículos de segunda mano en venta', icono: 'bazar',   estado: 'construible' },
  { slug: 'taller-y-refaccionaria', nombre: 'Taller y refaccionaria',   nombreCorto: 'Taller',      frasePropuesta: 'Servicio de taller y venta de refacciones', icono: 'taller',  estado: 'construible' },
  { slug: 'fletes-y-logistica',  nombre: 'Fletes y logística',          nombreCorto: 'Fletes',      frasePropuesta: 'Transporte y movimiento de carga', icono: 'fletes',  estado: 'construible' },
  { slug: 'renta-de-maquinaria', nombre: 'Renta de maquinaria y equipo', nombreCorto: 'Maquinaria', frasePropuesta: 'Maquinaria y equipo en renta', icono: 'renta',   estado: 'construible' },
  { slug: 'financiera',          nombre: 'Financiera',                  nombreCorto: 'Financiera',  frasePropuesta: 'Servicios financieros', icono: 'finan',   estado: 'construible' },

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

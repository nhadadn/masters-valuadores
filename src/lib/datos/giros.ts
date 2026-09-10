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
  icono: string;
  estado: EstadoGiro;
  /** Qué decisión lo destraba, si está bloqueado. */
  bloqueadoPor?: string;
}

export const giros: Giro[] = [
  { slug: 'empeno-y-prestamo',   nombre: 'Empeño y préstamo',           nombreCorto: 'Empeño',      icono: 'empeno',  estado: 'construible' },
  { slug: 'joyeria',             nombre: 'Joyería',                     nombreCorto: 'Joyería',     icono: 'joyeria', estado: 'construible' },
  { slug: 'bazar',               nombre: 'Bazar',                       nombreCorto: 'Bazar',       icono: 'bazar',   estado: 'construible' },
  { slug: 'taller-y-refaccionaria', nombre: 'Taller y refaccionaria',   nombreCorto: 'Taller',      icono: 'taller',  estado: 'construible' },
  { slug: 'fletes-y-logistica',  nombre: 'Fletes y logística',          nombreCorto: 'Fletes',      icono: 'fletes',  estado: 'construible' },
  { slug: 'renta-de-maquinaria', nombre: 'Renta de maquinaria y equipo', nombreCorto: 'Maquinaria', icono: 'renta',   estado: 'construible' },
  { slug: 'financiera',          nombre: 'Financiera',                  nombreCorto: 'Financiera',  icono: 'finan',   estado: 'construible' },

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

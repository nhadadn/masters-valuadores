/**
 * ÚNICA FUENTE DE DATOS DEL NEGOCIO.
 *
 * Ningún componente ni ninguna ruta escribe un teléfono, una dirección, un
 * horario, un precio ni un nombre legal. Todo sale de aquí. Si un dato se filtra
 * a un componente, el test que bloquea la publicación deja de servir.
 *
 * `POR_CONFIRMAR` no es un valor por defecto: es una marca. El módulo JSON-LD
 * lanza excepción si encuentra una en un build de producción, y como el grafo se
 * arma durante el prerender, esa excepción revienta el build · CA-08.
 *
 * Cada campo pendiente lleva el número de decisión que lo destraba, para que se
 * sepa a quién preguntarle. Tablero: docs/30-cliente/decisiones-pendientes.md
 */

export const POR_CONFIRMAR = '__POR_CONFIRMAR__' as const;
export type PorConfirmar = typeof POR_CONFIRMAR;

/** Un dato que puede estar confirmado o no. Nunca `string` a secas. */
export type Dato<T = string> = T | PorConfirmar;

export function estaConfirmado<T>(v: Dato<T>): v is T {
  return v !== POR_CONFIRMAR;
}

export interface Horario {
  /** Día en formato schema.org: Monday, Tuesday… */
  dias: Dato<string[]>;
  abre: Dato<string>;
  cierra: Dato<string>;
}

export interface Sucursal {
  id: string;
  nombre: Dato<string>;
  calle: Dato<string>;
  colonia: Dato<string>;
  ciudad: Dato<string>;
  estado: Dato<string>;
  codigoPostal: Dato<string>;
  pais: string;
  telefono: Dato<string>;
  whatsapp: Dato<string>;
  latitud: Dato<number>;
  longitud: Dato<number>;
  horarios: Dato<Horario[]>;
}

export interface Negocio {
  /** Grafía comercial. Cerrada por ADR-0004. */
  nombreComercial: string;
  /** Razón social para avisos legales y ficha de Google. D-01. */
  nombreLegal: Dato<string>;
  /** D-07: dominio y hospedaje corren por cuenta del cliente. */
  dominio: Dato<string>;
  /**
   * Categoría primaria de Google y segundo @type del LocalBusiness.
   * Es el factor número uno de posicionamiento local y sale de la Etapa 1. D-02.
   */
  tipoLocalBusiness: Dato<string>;
  descripcion: Dato<string>;
  sucursales: Sucursal[];
  /** URLs de Instagram y Facebook para `sameAs`. D-10. */
  redes: Dato<string[]>;
  /** A dónde llegan los envíos del formulario. Un sitio estático no los procesa. D-13. */
  destinoFormulario: Dato<string>;
}

export const negocio: Negocio = {
  nombreComercial: 'MASTERS',
  nombreLegal: POR_CONFIRMAR,        // D-01 · ¿Master o Masters?
  dominio: POR_CONFIRMAR,            // D-07
  tipoLocalBusiness: POR_CONFIRMAR,  // D-02 · sale de la Etapa 1
  descripcion: POR_CONFIRMAR,        // copy, no se inventa
  redes: POR_CONFIRMAR,              // D-10
  destinoFormulario: POR_CONFIRMAR,  // D-13
  sucursales: [
    {
      id: 'torreon',
      nombre: POR_CONFIRMAR,
      calle: POR_CONFIRMAR,          // D-08 · todo este bloque se cierra con un solo dato escrito
      colonia: POR_CONFIRMAR,
      ciudad: 'Torreón',             // documentado por el cliente en su propio material
      estado: 'Coahuila',            // documentado
      codigoPostal: POR_CONFIRMAR,
      pais: 'MX',
      telefono: POR_CONFIRMAR,
      whatsapp: POR_CONFIRMAR,
      latitud: POR_CONFIRMAR,        // D-11 · verificable en Maps al cerrar D-08
      longitud: POR_CONFIRMAR,
      horarios: POR_CONFIRMAR
    }
  ]
};

/** La sucursal principal. Hoy hay una; D-09 dirá si hay más. */
export const sucursalPrincipal = negocio.sucursales[0];

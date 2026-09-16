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
  /** La ficha de Google de esta sucursal. Va al `hasMap` del grafo. */
  mapaUrl: Dato<string>;
  /**
   * Líneas que atienden en OTRO número. No es lo normal y por eso es una lista y
   * no un campo: la mayoría comparte el teléfono del local.
   */
  telefonosDeLinea: { linea: string; telefono: Dato<string>; nota?: string }[];
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
  /**
   * D-01 · CERRADA el 11 de septiembre de 2026 por Cristóbal, vía Nadir: «Es MASTER».
   *
   * REVIERTE la grafía del ADR-0004, que había cerrado `MASTERS` siguiendo el
   * logotipo. La evidencia acumulada le daba la razón al cliente: de los cuatro
   * lugares donde la marca está escrita, **tres van sin S**.
   *
   *   su ficha de Google      Master valuadores
   *   su correo publicado     mastervaluadores@outlook.com
   *   su Facebook, en el letrero   MASTER VALUADORES
   *   su logotipo             MASTERS VALUADORES   ← el único con S
   *
   * Gana la consistencia del NAP, que es factor de posicionamiento local: el nombre
   * tiene que ser IDÉNTICO en todas partes, y ahora lo es en cuatro de cinco.
   *
   * LO QUE QUEDA DESALINEADO, y hay que decirlo: **el logotipo de su propia fachada
   * dice MASTERS**, y esa foto es el héroe de la portada y la tarjeta de WhatsApp.
   * El sitio dirá MASTER junto a una imagen que dice MASTERS. No se retoca la foto:
   * es la única real que hay y alterarla sería falsificar su local. Se resuelve el
   * día que cambien el letrero, o no se resuelve.
   *
   * Por eso los `alt` de esas dos fotos SIGUEN diciendo MASTERS: describen lo que se
   * ve en la imagen, no cómo se llama la empresa. Ver ADR-0018.
   */
  nombreComercial: 'MASTER',
  /**
   * SIGUE ABIERTA. D-01 eran dos preguntas y solo se contestó una: cuál se lee en el
   * sitio. La razón social es la del acta constitutiva —algo como «… S.A. de C.V.»—
   * y esa no la decide el gusto, la dice un documento. Sin ella no se puede publicar.
   */
  nombreLegal: POR_CONFIRMAR,        // D-01b · la del acta, no la comercial
  dominio: POR_CONFIRMAR,            // D-07
  /**
   * D-02 · ALINEADO A SU FICHA DE GOOGLE el 11 de septiembre · ADR-0014.
   *
   * Google los clasifica como **Bazar**. schema.org no tiene un tipo «Bazaar»; el
   * equivalente honesto y más cercano es `Store`. Poner `PawnShop` habría sido más
   * específico y habría dicho lo contrario de lo que Google dice hoy — y el punto de
   * esta decisión es dejar de contarle dos negocios distintos.
   *
   * Sigue siendo PROVISIONAL en un sentido: la categoría definitiva se fija cuando
   * Cristóbal reclame la ficha (D-17) y con lo que diga la Etapa 1. Lo que cambió es
   * que ya no es un hueco: es un dato alineado con la realidad observable.
   */
  tipoLocalBusiness: 'Store',
  descripcion: POR_CONFIRMAR,        // copy, no se inventa
  redes: POR_CONFIRMAR,              // D-10
  destinoFormulario: POR_CONFIRMAR,  // D-13
  sucursales: [
    {
      id: 'torreon',
      nombre: POR_CONFIRMAR,
      /**
       * D-08 · CERRADA el 11 de septiembre de 2026. Nadir mandó la ficha de Google
       * del negocio: «Aquí viene el mapa y su dirección».
       *
       *   https://maps.app.goo.gl/djEokVRJBvrUFGoh7   →   CID 14719324602987260743
       *
       * La ficha dice, literal: «Lerdo 97, Laguna Sur, 27110 Torreón, Coah.»
       *
       * Coincide con una de las dos formas que aparecían en sus publicaciones y que
       * el documento de requerimientos preguntaba (BLOQUE 1.1). La otra —«Libramiento
       * Periférico Raúl López Sánchez casi esquina con El Tajito»— NO está en la
       * ficha; queda por saber si es referencia cruzada del mismo local o un segundo
       * domicilio. Google conoce UNO.
       *
       * SALVEDAD QUE HAY QUE TENER PRESENTE: la ficha está SIN RECLAMAR —muestra
       * «Reclamar esta empresa»—, así que estos campos pudo escribirlos Google o un
       * usuario, no necesariamente Cristóbal. La dirección está corroborada por sus
       * propias publicaciones; los horarios de abajo NO lo están. Ver la nota ahí.
       */
      calle: 'Lerdo 97',
      colonia: 'Laguna Sur',
      ciudad: 'Torreón',             // documentado por el cliente en su propio material
      estado: 'Coahuila',            // documentado
      codigoPostal: '27110',
      pais: 'MX',
      /**
       * CONFIRMADO por Nadir el 11 de septiembre de 2026: «el teléfono es el mismo
       * para todos, y ya lo tienes».
       *
       * Tres fuentes independientes coinciden y ninguna es nuestra:
       *   · las cinco publicaciones del cliente, en cinco giros distintos
       *   · el letrero de su fachada — `static/fotos/fachada-1600.jpg`
       *   · el ícono de WhatsApp junto a ese mismo número en ese mismo letrero
       *
       * El formato lleva lada de país porque `wa.me` la exige: sin `+52` el enlace
       * no abre. Lo que se MUESTRA lo formatea quien lo pinta; aquí vive el dato.
       */
      telefono: '+52 871 507 3005',
      whatsapp: '+52 871 507 3005',
      /**
       * D-11 · CERRADA. Coordenadas que Google usa para esta ficha, leídas de la URL
       * del lugar: `/@25.5818511,-103.4188845,17z`. Plus code «HHJJ+PC Torreón».
       */
      latitud: 25.5818511,
      longitud: -103.4188845,
      /**
       * HORARIOS · el dato MÁS DÉBIL de este bloque, y hay que decirlo.
       *
       * Tiene UNA sola fuente —la ficha de Google— y esa ficha está **sin reclamar**.
       * El teléfono lo respaldan cuatro fuentes y la dirección dos; estos horarios,
       * ninguna más. Nadie de Masters los ha puesto por escrito.
       *
       * Se entran igual, por una razón concreta: Google ya se los está enseñando hoy
       * a cualquiera que busque el negocio. Que el sitio diga lo mismo no añade daño;
       * decir algo distinto sí lo añadiría. Pero es el primer renglón que Cristóbal
       * tiene que confirmar o corregir, y así está puesto en el documento de
       * requerimientos.
       *
       * Literal de la ficha: lunes a viernes 9 a.m.–6 p.m. · sábado 9 a.m.–3 p.m. ·
       * domingo cerrado.
       *
       * El domingo se declara con `00:00`–`00:00`, que es la forma documentada de
       * schema.org para un día cerrado. Omitirlo diría «no sabemos», y sí sabemos.
       */
      horarios: [
        { dias: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], abre: '09:00', cierra: '18:00' },
        { dias: ['Saturday'], abre: '09:00', cierra: '15:00' },
        { dias: ['Sunday'], abre: '00:00', cierra: '00:00' }
      ],
      /**
       * Forma por CID, no el enlace corto que llegó por WhatsApp: un `maps.app.goo.gl`
       * es un acortador y puede caducar o cambiar de destino. El CID identifica el
       * lugar y no depende de quién comparta. Sale del `ftid` de la redirección:
       * `0xcc458bbd76b92b47` → 14719324602987260743.
       */
      mapaUrl: 'https://maps.google.com/?cid=14719324602987260743',
      /**
       * SIN SEGUNDO NÚMERO · ADR-0047. Aquí vivía el de joyería, con cita, confirmado por
       * Nadir el 11 de septiembre. El 16 el cliente acotó su oferta a cinco líneas y
       * joyería no está, así que el número sale del sitio. La lista se conserva vacía: es
       * la forma de dar un teléfono por línea si alguna lo necesita.
       */
      telefonosDeLinea: []
    }
  ]
};

/** La sucursal principal. Hoy hay una; D-09 dirá si hay más. */
export const sucursalPrincipal = negocio.sucursales[0];

/**
 * ── CÓMO SE LEEN ESTOS DATOS EN PANTALLA ──────────────────────────────────
 *
 * Las dos funciones de abajo existen para que NINGÚN componente arme una dirección
 * ni un horario por su cuenta. Si cada pantalla lo formatea a su manera, el sitio
 * enseña la misma dirección de tres formas distintas — y la consistencia exacta del
 * NAP (nombre, dirección, teléfono, idénticos en todas partes) es justamente uno de
 * los factores de posicionamiento local que se están cuidando.
 *
 * Devuelven `__POR_CONFIRMAR__` si falta cualquier pieza. No devuelven media
 * dirección: media dirección lleva a alguien a la esquina equivocada.
 */

/** «Lerdo 97, Laguna Sur, 27110 Torreón, Coahuila» */
export function direccionCompleta(s: Sucursal = sucursalPrincipal): Dato<string> {
  const piezas = [s.calle, s.colonia, s.codigoPostal, s.ciudad, s.estado];
  if (!piezas.every(estaConfirmado)) return POR_CONFIRMAR;
  return `${s.calle}, ${s.colonia}, ${s.codigoPostal} ${s.ciudad}, ${s.estado}`;
}

/**
 * La URL del mapa INCRUSTABLE · ADR-0015.
 *
 * Se arma con las coordenadas, no con la dirección en texto: un geocodificado a
 * partir de texto puede caer en la calle equivocada, y las coordenadas salen de la
 * propia ficha del negocio.
 *
 * `output=embed` es la forma que no pide clave de API. La alternativa oficial
 * —Maps Embed API— sí la pide, y una clave es una cuenta, una tarjeta y una cuota
 * que alguien tiene que vigilar. Para dibujar un alfiler no lo vale.
 */
export function mapaEmbed(s: Sucursal = sucursalPrincipal): Dato<string> {
  if (!estaConfirmado(s.latitud) || !estaConfirmado(s.longitud)) return POR_CONFIRMAR;
  return `https://maps.google.com/maps?q=${s.latitud},${s.longitud}&z=17&hl=es&output=embed`;
}

const DIAS_ES: Record<string, string> = {
  Monday: 'Lunes', Tuesday: 'Martes', Wednesday: 'Miércoles', Thursday: 'Jueves',
  Friday: 'Viernes', Saturday: 'Sábado', Sunday: 'Domingo'
};

/**
 * «9 a.m.» y no «9:00». Dos razones y las dos importan:
 *   · Es como lo lee el visitante, y como lo muestra su propia ficha de Google.
 *   · El guardia de fugas caza el patrón `H:MM` en la página. Este formato no lo
 *     dispara por accidente — aunque el elemento lleva `data-negocio` igual, que es
 *     lo que de verdad declara la procedencia.
 */
function reloj(hhmm: string): string {
  const [h, m] = hhmm.split(':');
  const hora = Number(h);
  const sufijo = hora < 12 ? 'a.m.' : 'p.m.';
  const h12 = hora % 12 === 0 ? 12 : hora % 12;
  return m === '00' ? `${h12} ${sufijo}` : `${h12}:${m} ${sufijo}`;
}

export interface HorarioLegible {
  /** «Lunes a viernes», «Sábado», «Domingo» */
  dias: string;
  /** «9 a.m. a 6 p.m.» o «Cerrado» */
  horas: string;
  cerrado: boolean;
}

export function horariosLegibles(s: Sucursal = sucursalPrincipal): Dato<HorarioLegible[]> {
  if (!estaConfirmado(s.horarios)) return POR_CONFIRMAR;
  const filas: HorarioLegible[] = [];
  for (const h of s.horarios) {
    if (!estaConfirmado(h.dias) || !estaConfirmado(h.abre) || !estaConfirmado(h.cierra)) {
      return POR_CONFIRMAR;
    }
    const dias = h.dias.length > 2
      ? `${DIAS_ES[h.dias[0]]} a ${DIAS_ES[h.dias[h.dias.length - 1]].toLowerCase()}`
      : h.dias.map((d) => DIAS_ES[d]).join(' y ');
    const cerrado = h.abre === h.cierra;
    filas.push({ dias, horas: cerrado ? 'Cerrado' : `${reloj(h.abre)} a ${reloj(h.cierra)}`, cerrado });
  }
  return filas;
}

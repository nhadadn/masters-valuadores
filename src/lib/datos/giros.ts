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
  /**
   * Qué registro visual le toca · ADR-0020.
   *
   *   industrial  campo crema, palo seco pesado. Maquinaria, fletes, taller
   *   lujo        mármol, para lo que su marca trata como lujo: empeño y joyería
   *
   * Sale del DATO y no del slug: los slugs son provisionales hasta la Etapa 1, y
   * atar el diseño a una cadena que va a cambiar es garantizar que se rompa.
   */
  registro?: 'industrial' | 'lujo';
  /**
   * TRUE = este giro enseña la retícula de fotos reales del patio · ADR-0022.
   *
   * Del DATO y no del slug, igual que `registro`. Hoy solo empeño: la pieza 23 de la
   * tanda es literalmente de empeño de maquinaria. Maquinaria es la siguiente
   * candidata obvia y es una línea de cambio, pero esa decisión no es mía.
   */
  /**
   * Título y entradilla de la sección de bienes · PROPUESTA SIN APROBAR · ADR-0024.
   *
   * Por omisión la sección usa la pregunta del visitante —«¿Aceptan lo que traigo?»—
   * que es el sistema que ordena toda la página. Empeño la sustituye por petición
   * expresa de Nadir. No se ata al slug: es dato, como el registro y la galería.
   */
  /**
   * La promesa del hero · PROPUESTA SIN APROBAR · ADR-0024.
   * Dice lo que el giro es POR DEFINICIÓN, en la voz del visitante. Ni cifra ni plazo.
   */
  promesaPropuesta?: string;
  /**
   * Las tres etiquetas de la tira del hero · PROPUESTA SIN APROBAR · ADR-0024.
   *
   * «Sales con tu efectivo» y no «recibe tu efectivo»: la segunda promete sin
   * condición, y la primera es literalmente la frase que ya estaba en
   * `subtitularPropuesto` —«si te sirve, sales con tu efectivo»—. El paso completo,
   * con su condición, sigue abajo en la sección del proceso.
   */
  pasosCortos?: [string, string, string];
  tituloBienes?: string;
  subtituloBienes?: string;
  muestraInventario?: boolean;
  fotoProvisional?: string;
  /**
   * TRUE = la foto es SUYA, no de archivo. Sin tinte, sin rotulo y sin el ADR-0009
   * encima. Hoy solo la del patio, recortada de la pieza 21 de la tanda del 11 de
   * septiembre: su propio inventario en su propio patio.
   */
  fotoEsSuya?: boolean;
  /** Hasta que ancho existe el archivo. Las de WhatsApp no llegan a 1600. */
  fotoMaxAncho?: number;
  /**
   * Relacion de aspecto REAL del archivo · ADR-0032.
   *
   * `Foto.svelte` fuerza `16 / 9` por defecto con `object-fit: cover`. Eso valia
   * cuando las cuatro fotos de giro eran apaisadas. El original vertical de joyeria
   * mide 1206x1518 —casi 4:5— y a 16/9 se le cortaba justo la charola de anillos,
   * que es medio tema de la foto. Cada giro declara la suya y nadie recorta a ciegas.
   */
  fotoRelacion?: string;
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
  bienesPropuestos?: {
    que: string;
    fuente: 'letrero' | 'publicacion' | 'deducido';
    icono: string;
    /**
     * Microdescripción · PROPUESTA SIN APROBAR · ADR-0024.
     *
     * Solo dice lo que el negocio hace POR DEFINICIÓN con ese bien: «valuamos».
     * Ni una cifra, ni un plazo, ni una promesa de aceptación. La lista de bienes ya
     * es una deducción nuestra; ponerle encima un adjetivo comercial sería apilar una
     * invención sobre otra.
     */
    micro?: string;
    /** Nombre base en `static/fotos/`. Sin foto, la tarjeta usa campo de metal. */
    foto?: string;
    /** Hasta qué ancho existe el archivo. No se escala hacia arriba. */
    fotoMaxAncho?: number;
    /** TRUE = es SUYA. Sin tinte y sin el rótulo del ADR-0009. */
    fotoEsSuya?: boolean;
    /** Describe LA FOTO. Nunca afirma disponibilidad ni propiedad. */
    fotoAlt?: string;
    /**
     * Ocupa el ancho completo de la retícula · ADR-0025.
     *
     * Solo para lo que tenga una fotografía que aguante ese tamaño. Un bien SIN foto
     * puesto de banda son cuatrocientos píxeles de rectángulo vacío: se probó con
     * autos en el mockup y era el peor bloque de la página.
     */
    banda?: boolean;
  }[];
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
  { slug: 'empeno-y-prestamo',   registro: 'lujo', muestraInventario: true, promesaPropuesta: 'Convierte lo que tienes en efectivo.', pasosCortos: ['Trae tu bien', 'Lo valuamos', 'Sales con tu efectivo'], tituloBienes: '¿Qué puedes empeñar?', subtituloBienes: 'Valuamos diferentes tipos de bienes y te decimos cuánto podemos prestarte.', nombre: 'Empeño y préstamo',            nombreCorto: 'Empeño',      frasePropuesta: 'Dejas un bien en garantía y sales con efectivo', fotoProvisional: 'bien-joyeria', fotoEsSuya: true, fotoMaxAncho: 1200, fotoRelacion: '1206 / 1518', fotoAlt: 'Reloj cronografo con bisel de diamantes, cadena de oro y una charola de anillos sobre fondo negro', subtitularPropuesto: 'Traes un bien, lo valuamos y te decimos cuánto. Si te sirve, sales con tu efectivo y tu bien queda resguardado hasta que lo recuperes.', pasosPropuestos: ['Traes tu bien y una identificación oficial vigente.', 'Lo valuamos y te decimos cuánto te podemos prestar.', 'Si aceptas, firmas tu contrato y te llevas el efectivo.'], bienesPropuestos: [{ que: 'Oro y joyería', fuente: 'publicacion', icono: 'joyeria', micro: 'Valuamos tus piezas de oro y joyería.', banda: true, foto: 'bien-oro', fotoMaxAncho: 800, fotoEsSuya: true, fotoAlt: 'Cadena de oro de eslabón cubano sobre terciopelo negro, junto a una charola de anillos con piedras' }, { que: 'Relojes', fuente: 'publicacion', icono: 'reloj', micro: 'Valuamos tu reloj.', foto: 'empeno', fotoMaxAncho: 1600, fotoAlt: 'Relojes de oro y joyería antigua sobre una superficie oscura' }, { que: 'Monedas', fuente: 'publicacion', icono: 'moneda', micro: 'Valuamos tus monedas.', foto: 'bien-monedas', fotoMaxAncho: 800, fotoAlt: 'Columnas de monedas de oro sobre una superficie metálica, con luz rasante' }, { que: 'Herramienta', fuente: 'letrero', icono: 'herramienta', micro: 'Valuamos tu herramienta.', foto: 'inv-soldadoras', fotoMaxAncho: 400, fotoEsSuya: true, fotoAlt: 'Máquinas de soldar alineadas contra una pared, bajo techo' }, { que: 'Autos', fuente: 'letrero', icono: 'auto', micro: 'Valuamos tu auto.' }, { que: 'Maquinaria', fuente: 'letrero', icono: 'maquinaria', micro: 'Valuamos tu maquinaria y equipo.', banda: true, foto: 'bien-maquinaria', fotoMaxAncho: 600, fotoEsSuya: true, fotoAlt: 'Rodillo compactador Benford de doble tambor entre otras máquinas, en el patio' }], icono: 'empeno',  estado: 'construible' },
  { slug: 'compra-venta-de-maquinaria', nombre: 'Compra venta de maquinaria', nombreCorto: 'Maquinaria', frasePropuesta: 'Compra y venta de maquinaria y equipo', fotoProvisional: 'patio', fotoEsSuya: true, fotoMaxAncho: 800, fotoAlt: 'Patio de MASTER VALUADORES con una retroexcavadora John Deere 310D, un rodillo Benford y montacargas', subtitularPropuesto: 'Compramos maquinaria y equipo, y vendemos lo que tenemos disponible. Si quieres vender, lo valuamos antes de hablar de precio.', pasosPropuestos: ['Nos dices qué máquina tienes, o qué estás buscando.', 'La revisamos y la valuamos.', 'Acordamos el precio y cerramos la operación.'], bienesPropuestos: [{ que: 'Maquinaria pesada', fuente: 'letrero', icono: 'maquinaria' }, { que: 'Equipo industrial', fuente: 'publicacion', icono: 'industrial' }, { que: 'Equipo agrícola', fuente: 'publicacion', icono: 'agricola' }, { que: 'Herramienta', fuente: 'letrero', icono: 'herramienta' }, { que: 'Maquinaria de importación', fuente: 'publicacion', icono: 'contenedor' }], icono: 'renta', estado: 'construible' },
  { slug: 'fletes-y-logistica',  nombre: 'Fletes y logística',           nombreCorto: 'Fletes',      frasePropuesta: 'Transporte y movimiento de carga', fotoProvisional: 'fletes', fotoAlt: 'Camión de carga transportando un contenedor por una carretera', subtitularPropuesto: 'Transportamos y movemos carga. Dinos qué necesitas mover y a dónde, y te decimos si podemos hacerlo.', pasosPropuestos: ['Nos dices qué hay que mover, desde dónde y hasta dónde.', 'Revisamos si entra en nuestro equipo y te cotizamos.', 'Acordamos la fecha y hacemos el traslado.'], bienesPropuestos: [{ que: 'Contenedores marítimos', fuente: 'letrero', icono: 'contenedor' }, { que: 'Maquinaria pesada', fuente: 'deducido', icono: 'maquinaria' }, { que: 'Carga general', fuente: 'deducido', icono: 'carga' }], icono: 'fletes',  estado: 'construible' },
  { slug: 'taller-y-refaccionaria', nombre: 'Taller y refaccionaria',    nombreCorto: 'Taller',      frasePropuesta: 'Servicio de taller y venta de refacciones', fotoProvisional: 'taller', fotoAlt: 'Manos de un mecánico eligiendo dados de una caja de herramienta', subtitularPropuesto: 'Servicio de taller y venta de refacciones. Lo traes, lo revisamos y te decimos qué necesita.', pasosPropuestos: ['Traes la unidad o nos dices qué refacción buscas.', 'La revisamos y te decimos qué necesita.', 'Autorizas el trabajo y lo hacemos.'], icono: 'taller',  estado: 'construible' },

  // SALIERON el 10 de septiembre por el ADR-0008: joyería, bazar y financiera.
  // No se borran de la historia: el ADR registra qué se soltó y qué costó.
  // Joyería era el giro con el material vivo más fuerte —dos de sus cinco
  // publicaciones— y con ella se queda sin casa la D-15, «Compramos monedas».

  // No se construyen hasta que se cierren sus decisiones. Aparecen en la portada
  // como bloqueados a propósito: lo que falta decidir se ve, no se esconde.
  { slug: 'importaciones',       nombre: 'Importaciones',               nombreCorto: 'Importaciones', icono: 'bloq', estado: 'bloqueado', bloqueadoPor: 'D-04' },
  { slug: 'valuacion',           nombre: 'Avalúos periciales',          nombreCorto: 'Avalúos',       icono: 'bloq', estado: 'bloqueado', bloqueadoPor: 'D-03' },
  // BAZAR VUELVE, pero como PREGUNTA, no como página · ADR-0014.
  //
  // El ADR-0008 lo sacó el 10 de septiembre y dejó escrita su propia advertencia:
  // Cristóbal había pedido «salir en el mapa de Google al buscar giros como bazar y
  // joyería», y sacarlo soltaba justo eso. El 11 de septiembre llegó su ficha de
  // Google y resultó que **Google ya los clasifica como Bazar**, y que la única
  // reseña que tienen llegó por ahí.
  //
  // Entra como BLOQUEADO: aparece en el tablero y en la portada como decisión
  // visible, y NO genera ruta. Reabrir la pregunta no es lo mismo que publicar una
  // página sobre un giro del que no sabemos qué vende.
  { slug: 'bazar',               nombre: 'Bazar',                       nombreCorto: 'Bazar',         icono: 'bloq', estado: 'bloqueado', bloqueadoPor: 'D-18' }
];

/** Los que sí se prerenderizan. Los bloqueados no generan ruta. */
export const girosConstruibles = giros.filter((g) => g.estado === 'construible');
export const girosBloqueados  = giros.filter((g) => g.estado === 'bloqueado');

export function giroPorSlug(slug: string): Giro | undefined {
  return girosConstruibles.find((g) => g.slug === slug);
}

/** Los slugs son provisionales: se marca en el código, no solo en un documento. */
export const SLUGS_PROVISIONALES = true;

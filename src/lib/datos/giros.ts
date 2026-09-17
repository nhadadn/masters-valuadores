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

/**
 * Un momento del proceso · ADR-0042.
 *
 * DOS CAMPOS DE TEXTO Y NO UNO, porque hacen trabajos distintos: `que` es lo que se
 * lee de un vistazo —cuatro palabras o menos, y hay un test que lo vigila— y `dato`
 * es la condición que el paso arrastra y que nadie necesita en el primer barrido.
 * Juntarlos otra vez en una frase es volver al párrafo que esto vino a sustituir.
 */
export interface PasoFlujo {
  /** La acción, en CUATRO PALABRAS O MENOS. `tests/flujo.test.ts` lo verifica. */
  que: string;
  /** La condición o el requisito. Va en el chip. Opcional: no todo paso arrastra uno. */
  dato?: string;
  /** Nombre en `iconos.ts`. El test comprueba que exista: un ícono ausente pinta un hueco mudo. */
  icono: string;
}

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
  /** Título de la sección del proceso. Sin él sale la pregunta de empeño —«¿Cuánto me
      dan y cuándo?»—, que en venta, fletes o taller dice lo contrario de lo que pasa ·
      ADR-0047. */
  tituloProceso?: string;
  /** Arranque del mensaje de WhatsApp de cada disco del planeta. Sin él sale el de
      empeño, «quiero saber cuánto me pueden prestar» · ADR-0047. */
  preguntaBien?: string;
  /** Verbo de la frase que enumera los bienes bajo el titular. Sin él, «Valuamos», que
      es el de empeño · ADR-0047. */
  verboBienes?: string;
  muestraInventario?: boolean;
  /**
   * Enseña la secuencia de joyería · ADR-0033. Mismo interruptor que
   * `muestraInventario`, para que la plantilla no pregunte por el slug.
   */
  muestraJoyeria?: boolean;
  /**
   * Texto del botón principal del hero · ADR-0041 · PROPUESTA SIN APROBAR.
   *
   * VA EN EL DATO Y NO EN LA PLANTILLA, y no es purismo: esta plantilla pinta las
   * CUATRO páginas de giro. «Quiero saber cuánto me prestan» es cierto en empeño y
   * **falso** en compra-venta, fletes y taller, que no prestan dinero. Escribirlo en
   * el marcado lo habría publicado en las cuatro.
   *
   * Su presencia es además el interruptor del bloque de acción del hero: donde no
   * hay texto de CTA, no hay botones ni línea de dónde y cuándo.
   */
  ctaPrestamo?: string;
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
   * NINGUNO dice cuánto ni cuándo: eso iba en el bloque de cifras, que el ADR-0040
   * borró junto con su CSS. Hoy la pregunta del encabezado **no tiene respuesta en
   * la página** y no la tendrá hasta que cierren la tasa, el plazo y el aforo.
   * Cada paso asume algo y esos supuestos están listados en
   * `docs/30-cliente/requerimientos-cristobal.md`.
   *
   * SIGUE SIENDO LA FUENTE cuando el giro no tiene `flujo`: ver abajo.
   */
  pasosPropuestos?: [string, string, string];
  /**
   * EL MISMO PROCESO, PARTIDO EN DOS · ADR-0042 · PROPUESTA SIN APROBAR.
   *
   * No es copy nuevo: son las frases de `pasosPropuestos` repartidas en la acción
   * (`que`, que se lee de un vistazo) y el dato que esa acción arrastra (`dato`, que
   * se lee si interesa). Ni una afirmación que no estuviera ya escrita arriba.
   *
   * POR QUÉ PARTIRLO Y NO ACORTARLO. Tres datos del proceso aparecen UNA sola vez en
   * toda la página —la identificación vigente, el contrato y el resguardo— porque las
   * secciones que los repetían se borraron en el ADR-0040. Recortar las frases los
   * habría borrado del sitio. El chip existe para cargarlos sin que pesen en la
   * lectura rápida.
   */
  flujo?: PasoFlujo[];
  /**
   * EL PASO QUE CIERRA EL CÍRCULO · ADR-0042. Solo empeño.
   *
   * VA EN EL DATO Y NO EN LA PLANTILLA, por la misma razón que `ctaPrestamo`: esta
   * plantilla pinta las CUATRO páginas de giro. «Lo recuperas» es cierto en empeño y
   * **falso** en compra-venta, fletes y taller — una máquina que vendes no vuelve, un
   * flete no vuelve—. Escrito en el marcado se habría publicado en las cuatro.
   *
   * Su presencia es además lo que dibuja el corchete punteado: donde no hay retorno,
   * el flujo es una línea recta, que es lo que esos tres procesos son.
   */
  retorno?: PasoFlujo;
  icono: string;
  estado: EstadoGiro;
  /** Qué decisión lo destraba, si está bloqueado. */
  bloqueadoPor?: string;
}

export const giros: Giro[] = [
  // CUATRO GIROS · ADR-0008. El orden es el que dijo el cliente, NO una prioridad
  // de búsqueda: esa sale de la Etapa 1 y sigue sin ejecutarse.
  // ADR-0054 · el disco «Autos» lleva foto de archivo —Unsplash, recortada a 400 en cuadro— y sin
  // marca de que no es suya: lo decidió Nadir. Sin `fotoEsSuya`, porque no lo es.
  { slug: 'empeno-y-prestamo',   registro: 'lujo', muestraInventario: true, muestraJoyeria: true, promesaPropuesta: 'Convierte tus bienes en efectivo.', ctaPrestamo: 'Quiero saber cuánto me prestan', pasosCortos: ['Trae tu bien', 'Lo valuamos', 'Sales con tu efectivo'], tituloBienes: '¿Qué puedes empeñar?', subtituloBienes: 'Valuamos diferentes tipos de bienes y te decimos cuánto podemos prestarte.', nombre: 'Empeño y préstamo',            nombreCorto: 'Empeño',      frasePropuesta: 'Dejas un bien en garantía y sales con efectivo', fotoProvisional: 'bien-joyeria', fotoEsSuya: true, fotoMaxAncho: 1200, fotoRelacion: '1206 / 1518', fotoAlt: 'Reloj cronografo con bisel de diamantes, cadena de oro y una charola de anillos sobre fondo negro', subtitularPropuesto: 'Traes un bien, lo valuamos y te decimos cuánto. Si te sirve, sales con tu efectivo y tu bien queda resguardado hasta que lo recuperes.', pasosPropuestos: ['Traes tu bien y una identificación oficial vigente.', 'Lo valuamos y te decimos cuánto te podemos prestar.', 'Si aceptas, firmas tu contrato y te llevas el efectivo.'], flujo: [{ que: 'Traes tu bien', dato: 'con identificación oficial vigente', icono: 'identificacion' }, { que: 'Lo valuamos', dato: 'te decimos cuánto te podemos prestar', icono: 'balanza' }, { que: 'Sales con efectivo', dato: 'si aceptas, firmas tu contrato', icono: 'efectivo' }], retorno: { que: 'Lo recuperas', dato: 'tu bien queda resguardado', icono: 'retorno' }, bienesPropuestos: [{ que: 'Oro y joyería', fuente: 'publicacion', icono: 'joyeria', micro: 'Valuamos tus piezas de oro y joyería.', banda: true, foto: 'bien-oro', fotoMaxAncho: 800, fotoEsSuya: true, fotoAlt: 'Cadena de oro de eslabón cubano sobre terciopelo negro, junto a una charola de anillos con piedras' }, { que: 'Relojes', fuente: 'publicacion', icono: 'reloj', micro: 'Valuamos tu reloj.', foto: 'empeno', fotoMaxAncho: 1600, fotoAlt: 'Relojes de oro y joyería antigua sobre una superficie oscura' }, { que: 'Monedas', fuente: 'publicacion', icono: 'moneda', micro: 'Valuamos tus monedas.', foto: 'bien-monedas', fotoMaxAncho: 800, fotoAlt: 'Columnas de monedas de oro sobre una superficie metálica, con luz rasante' }, { que: 'Herramienta', fuente: 'letrero', icono: 'herramienta', micro: 'Valuamos tu herramienta.', foto: 'inv-soldadoras', fotoMaxAncho: 400, fotoEsSuya: true, fotoAlt: 'Máquinas de soldar alineadas contra una pared, bajo techo' }, { que: 'Autos', fuente: 'letrero', icono: 'auto', micro: 'Valuamos tu auto.', foto: 'bien-autos', fotoMaxAncho: 400, fotoAlt: 'Una mano entrega un llavero de control remoto a otra mano abierta, sobre fondo gris claro' }, { que: 'Maquinaria', fuente: 'letrero', icono: 'maquinaria', micro: 'Valuamos tu maquinaria y equipo.', banda: true, foto: 'bien-maquinaria', fotoMaxAncho: 600, fotoEsSuya: true, fotoAlt: 'Rodillo compactador Benford de doble tambor entre otras máquinas, en el patio' }], icono: 'empeno',  estado: 'construible' },
  // ADR-0047 · VENTA Y FINANCIAMIENTO. El cliente acotó su oferta a cinco líneas. «Compra
  // venta de maquinaria» pasa a VENTA de todo lo que tienen, y FINANCIAMIENTO vuelve —el
  // ADR-0008 había sacado «financiera»— como financiamiento de la maquinaria que venden,
  // que es lo que anuncia su publicación «FINANCIAMIENTO · IMPORTACIÓN · VENTA». Sin tasas,
  // plazos ni requisitos: no los ha dado nadie.
  { slug: 'venta',               nombre: 'Venta de maquinaria, herramienta y autos', nombreCorto: 'Venta', frasePropuesta: 'Maquinaria, herramienta, autos y prendas de empeño', fotoProvisional: 'patio', fotoEsSuya: true, fotoMaxAncho: 800, fotoAlt: 'Patio de MASTER VALUADORES con una retroexcavadora John Deere 310D, un rodillo Benford y montacargas', subtitularPropuesto: 'Vendemos lo que tenemos: maquinaria, herramienta, autos y lo que no se recupera del empeño. Pregúntanos qué hay disponible.', pasosPropuestos: ['Nos dices qué estás buscando.', 'Te decimos qué tenemos disponible y en cuánto.', 'Acordamos el precio y cerramos la venta.'], flujo: [{ que: 'Nos dices qué buscas', dato: 'maquinaria, herramienta o auto', icono: 'maquinaria' }, { que: 'Te decimos qué hay', dato: 'y en cuánto', icono: 'balanza' }, { que: 'Cerramos la venta', dato: 'con el precio acordado', icono: 'efectivo' }], tituloBienes: '¿Qué tienen a la venta?', tituloProceso: '¿Cómo compro?', verboBienes: 'Vendemos', preguntaBien: 'Hola, me interesa comprar. Busco: ', bienesPropuestos: [{ que: 'Maquinaria pesada', fuente: 'letrero', icono: 'maquinaria' }, { que: 'Equipo industrial', fuente: 'publicacion', icono: 'industrial' }, { que: 'Equipo agrícola', fuente: 'publicacion', icono: 'agricola' }, { que: 'Herramienta', fuente: 'letrero', icono: 'herramienta' }, { que: 'Autos', fuente: 'letrero', icono: 'auto' }, { que: 'Prendas de empeño', fuente: 'deducido', icono: 'empeno' }], icono: 'renta', estado: 'construible' },
  { slug: 'financiamiento',      nombre: 'Financiamiento de maquinaria', nombreCorto: 'Financiamiento', frasePropuesta: 'Para comprar la maquinaria que vendemos', fotoProvisional: 'bien-maquinaria', fotoEsSuya: true, fotoMaxAncho: 600, fotoAlt: 'Rodillo compactador Benford de doble tambor entre otras máquinas, en el patio', subtitularPropuesto: 'Financiamos la maquinaria que vendemos. Dinos qué equipo te interesa y te explicamos cómo funciona el financiamiento.', pasosPropuestos: ['Nos dices qué máquina te interesa.', 'Te explicamos cómo funciona el financiamiento.', 'Si te conviene, cerramos la operación.'], flujo: [{ que: 'Eliges la máquina', dato: 'de la que tenemos a la venta', icono: 'maquinaria' }, { que: 'Te explicamos cómo funciona', dato: 'antes de que decidas', icono: 'finan' }, { que: 'Cerramos la operación', dato: 'si te conviene', icono: 'efectivo' }], tituloProceso: '¿Cómo funciona?', icono: 'finan', estado: 'construible' },
  // ADR-0054 · «Carga general» lleva foto de archivo, igual que «Autos» en empeño. «Maquinaria
  // pesada» sigue con ícono: espera la foto de su unidad con una máquina arriba.
  { slug: 'fletes',              nombre: 'Fletes',           nombreCorto: 'Fletes',      frasePropuesta: 'Transporte y movimiento de carga', fotoProvisional: 'fletes', fotoAlt: 'Camión de carga transportando un contenedor por una carretera', subtitularPropuesto: 'Transportamos y movemos carga. Dinos qué necesitas mover y a dónde, y te decimos si podemos hacerlo.', pasosPropuestos: ['Nos dices qué hay que mover, desde dónde y hasta dónde.', 'Revisamos si entra en nuestro equipo y te cotizamos.', 'Acordamos la fecha y hacemos el traslado.'], flujo: [{ que: 'Nos dices qué mover', dato: 'desde dónde y hasta dónde', icono: 'carga' }, { que: 'Revisamos y cotizamos', dato: 'si entra en nuestro equipo', icono: 'balanza' }, { que: 'Hacemos el traslado', dato: 'en la fecha acordada', icono: 'fletes' }], tituloBienes: '¿Qué transportan?', tituloProceso: '¿Cómo lo cotizo?', verboBienes: 'Movemos', preguntaBien: 'Hola, quiero cotizar un flete. Lo que hay que mover: ', bienesPropuestos: [{ que: 'Maquinaria pesada', fuente: 'deducido', icono: 'maquinaria' }, { que: 'Carga general', fuente: 'deducido', icono: 'carga', foto: 'bien-carga', fotoMaxAncho: 400, fotoAlt: 'Costales blancos sobre tarimas, en la plataforma roja de un camión' }], icono: 'fletes',  estado: 'construible' },
  { slug: 'taller',              nombre: 'Taller',                    nombreCorto: 'Taller',      frasePropuesta: 'Servicio de taller', fotoProvisional: 'taller', fotoAlt: 'Manos de un mecánico eligiendo dados de una caja de herramienta', subtitularPropuesto: 'Traes tu unidad, la revisamos y te decimos qué necesita antes de hacer el trabajo.', pasosPropuestos: ['Traes la unidad.', 'La revisamos y te decimos qué necesita.', 'Autorizas el trabajo y lo hacemos.'], flujo: [{ que: 'Traes tu unidad', icono: 'taller' }, { que: 'La revisamos', dato: 'te decimos qué necesita', icono: 'balanza' }, { que: 'Hacemos el trabajo', dato: 'cuando tú lo autorizas', icono: 'herramienta' }], tituloProceso: '¿Cómo es el servicio?', icono: 'taller',  estado: 'construible' },

  // SALIERON el 10 de septiembre por el ADR-0008: joyería, bazar y financiera.
  //
  // Y EL 16 DE SEPTIEMBRE SALIERON LOS BLOQUEADOS · ADR-0047. Importaciones (D-04),
  // avalúos periciales (D-03) y bazar (D-18) esperaban decisión y la tomó el cliente:
  // su oferta son cinco líneas y ninguna de esas tres está. Financiamiento, que el
  // ADR-0008 sacó como «financiera», vuelve arriba con otra definición. El tipo
  // `bloqueado` se conserva: es la forma de enseñar una línea sin prometer su página.
];

/** Los que sí se prerenderizan. Los bloqueados no generan ruta. */
export const girosConstruibles = giros.filter((g) => g.estado === 'construible');
export const girosBloqueados  = giros.filter((g) => g.estado === 'bloqueado');

export function giroPorSlug(slug: string): Giro | undefined {
  return girosConstruibles.find((g) => g.slug === slug);
}

/** Los slugs son provisionales: se marca en el código, no solo en un documento. */
export const SLUGS_PROVISIONALES = true;

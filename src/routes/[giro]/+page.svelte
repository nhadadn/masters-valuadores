<script lang="ts">
  /**
   * Plantilla de página de giro.
   *
   * EL ORDEN DE LAS SECCIONES NO ES UN TEMARIO: es el orden en que llegan las
   * preguntas del visitante. Es la única decisión de composición que se tomó sin
   * el cliente, y se tomó así porque el orden del temario le sirve al negocio y
   * este le sirve a quien busca.
   */
  import Seccion from '$componentes/Seccion.svelte';
  import Boton from '$componentes/Boton.svelte';
  /* `Hueco` solo vive en ramas de reserva que hoy no pinta ningún giro: los cuatro
     tienen subtitular y pasos. Se queda por si entra un giro sin copy. */
  import Hueco from '$componentes/Hueco.svelte';
  import Migas from '$componentes/Migas.svelte';
  import Icono from '$componentes/Icono.svelte';
  import Titular from '$componentes/Titular.svelte';
  import Foto from '$componentes/Foto.svelte';
  import Ubicacion from '$componentes/Ubicacion.svelte';
  import PlanetaBienes from '$componentes/PlanetaBienes.svelte';
  import TiraPasos from '$componentes/TiraPasos.svelte';
  import FlujoProceso from '$componentes/FlujoProceso.svelte';
  import MonedasQueCaen from '$componentes/MonedasQueCaen.svelte';
  import Carrusel from '$componentes/Carrusel.svelte';
  import { galeriaInventario, galeriaJoyeria, notaJoyeria } from '$lib/datos/galeria';
  import { sucursalPrincipal, estaConfirmado, horariosLegibles } from '$lib/config/negocio';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import { negocio } from '$lib/config/negocio';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const giro = $derived(data.giro);
  /* Cuánta veta lleva la ENTRADA de este giro · ADR-0020, adaptado por el 0028.
     Ya no decide si la sección es clara —ahora lo es toda la página— sino cuánto
     habla la piedra: lo que su marca trata como lujo la enseña, el resto la calla.
     Sigue saliendo del DATO y no del slug. */
  /* LA PIEDRA ES DE LA ENTRADA, Y DE LAS CUATRO · ADR-0043.
     Valía `registro === 'lujo' ? 'marmol' : 'tenue'`, o sea que solo empeño entraba
     sobre piedra y las otras tres sobre blanco. Auditadas las ocho páginas salió el
     resultado al revés de lo que el ADR-0030 decidió: en maquinaria y fletes la losa
     de mármol caía en el índice 4 y en taller en el 3 — **a media página**, con el hero
     en blanco. Tres de cuatro páginas tenían la piedra flotando en el medio.

     Ahora la entrada la lleva siempre. El registro `lujo` sigue existiendo para lo que
     sí distingue —qué bienes, qué galería—, no para el fondo.

     ACERO PAVONADO · ADR-0046. Sigue siendo de las cuatro; cambia el material. */
  const veta = 'pavonado';

  /* ── EL HERO ORIENTADO A INTENCIÓN · ADR-0041 ────────────────────────────
     NADA DE ESTO SE ESCRIBE AQUÍ. La ciudad, los horarios y la lista de bienes salen
     de `negocio.ts` y de `giros.ts`; si el dato cambia, el hero cambia solo. Es la
     misma regla del NAP: un dato tecleado dos veces se desincroniza una vez. */

  /* El titular lleva la ciudad · «Empeño y préstamo en Torreón». Si la ciudad no
     estuviera confirmada, el titular se queda como estaba en vez de pintar el
     centinela en un `h1`. */
  const titular = $derived(
    estaConfirmado(sucursalPrincipal.ciudad)
      ? `${giro.nombre} en ${sucursalPrincipal.ciudad}`
      : giro.nombre
  );

  /* La lista de bienes en prosa, DERIVADA de la misma fuente que pinta el planeta.
     Escribirla a mano habría creado dos listas que se contradicen el día que alguien
     añada una categoría. Con menos de dos no hay frase: «Valuamos oro.» no es una
     enumeración, es un recorte raro. */
  const valuamos = $derived.by(() => {
    const qs = (giro.bienesPropuestos ?? []).map((b) => b.que.toLowerCase());
    if (qs.length < 2) return null;
    /* EL VERBO ES DE LA LÍNEA · ADR-0047. Era «Valuamos» para todas, y en fletes publicaba
       «Valuamos maquinaria pesada y carga general»: un servicio que esa página no da. */
    return `${giro.verboBienes ?? 'Valuamos'} ${qs.slice(0, -1).join(', ')} y ${qs[qs.length - 1]}.`;
  });

  /* Dónde y cuándo, en un renglón. Se quita el día cerrado: «domingo cerrado» es
     información del pie —desde el ADR-0059 el único que da el horario completo—, no de
     la primera pantalla. */
  const cuando = $derived.by(() => {
    const h = horariosLegibles();
    if (!estaConfirmado(h)) return null;
    return h.filter((x) => !x.cerrado).map((x) => `${x.dias} ${x.horas}`).join(' · ');
  });
  const donde = $derived(
    estaConfirmado(sucursalPrincipal.ciudad) && estaConfirmado(sucursalPrincipal.estado)
      ? `${sucursalPrincipal.ciudad}, ${sucursalPrincipal.estado}`
      : null
  );

  /**
   * ¿Se pinta la segunda mitad de la entrada? · ADR-0038.
   *
   * Es el bloque de CTA + foto grande + banda de monedas del ADR-0027. Se quita de
   * los giros que YA tienen galería propia, y hoy eso es solo empeño:
   *
   *   · su foto grande era **la misma fotografía** que tres tarjetas de la tira,
   *     así que la página ensañaba dos veces lo mismo con distinto tamaño;
   *   · y las monedas dibujadas eran «ocho discos planos en fila», dicho por Nadir.
   *
   * NO se quita de los otros tres. Medido en vivo antes de tocar: maquinaria, fletes
   * y taller tienen **cero carruseles**, o sea que esta sección es su Única
   * fotografía y su único botón. Borrarla de la plantilla los dejaba sin imagen.
   */
  const segundaMitad = $derived(!(giro.muestraJoyeria || giro.muestraInventario));

  /* «¿Dónde están?» era «¿Dónde están y están abiertos?» hasta el ADR-0059: la sección
     ya no dice el horario —lo dice el pie, justo debajo— y la pregunta no puede prometer
     lo que el bloque no contesta. */
  const PREGUNTAS = [
    '¿Aceptan lo que traigo?',
    '¿Cuánto me dan y cuándo?',
    '¿Qué necesito llevar?',
    '¿Dónde están?',
    '¿Puedo recuperar mi bien?'
  ];

  /* LA NUMERACIÓN NO SALTA · ADR-0059. Iba escrita a mano —1, 2 y 3— y la sección 1 solo
     existe si la línea tiene bienes: en financiamiento y taller la primera sección
     numerada era la «2». Ahora cuenta las que se pintan. */
  const numProceso = $derived(giro.bienesPropuestos?.length ? 2 : 1);
  const numUbicacion = $derived(numProceso + 1);
  // Sin estado ni JavaScript: <details> nativo. Ver la nota de csr en +layout.ts.
  const PREGUNTAS_FRECUENTES = [
    '¿Qué pasa si no pago a tiempo?',
    '¿Puedo pagar solo los intereses?',
    '¿Cómo recupero mi bien?',
    '¿Qué documento me dan?'
  ];
</script>

<div class="migas"><Migas pasos={[{ texto: 'Inicio', href: '/' }, { texto: giro.nombreCorto }]} /></div>

<Seccion etiqueta="LÍNEA DE NEGOCIO" fondo={veta}>
  <!-- ADR-0007 §4. Sin `segunda`: los nombres de giro son de un renglón —cuatro de
       los siete son una sola palabra— y partirlos para teñir la mitad sería inventar
       un énfasis que nadie autorizó. La segunda tinta espera copy. -->
  <div class="encabezado"><Titular primera={titular} /></div>
  <!-- PROPUESTA SIN APROBAR. Dice lo que el giro es POR DEFINICIÓN: ni una cifra, ni
       un plazo, ni una lista de bienes. El CLAUDE.md lo permite con la condición de
       que vaya marcado, y la banda de BORRADOR de arriba es esa marca. -->
  <!-- ADR-0024 · LA PROMESA Y LA MECÁNICA, EN LA PRIMERA PANTALLA.
       El h1 dice una categoría —«Empeño y préstamo»—, que no contesta «¿qué gano
       yo?». Debajo van la promesa y los tres pasos, y las acciones suben por delante
       de la foto: así el nombre, la promesa, la mecánica y el botón caben antes del
       primer scroll en un teléfono. -->
  {#if giro.promesaPropuesta}
    <p class="promesa" data-propuesta="true">{giro.promesaPropuesta}</p>
  {/if}
  <!-- QUÉ VALUAMOS · ADR-0041. Derivado de `bienesPropuestos`, la MISMA fuente que
       pinta el planeta de la sección 1. Dos listas escritas a mano se contradicen el
       día que alguien añada una categoría; ésta no puede. -->
  {#if valuamos}
    <p class="valuamos" data-propuesta="true">{valuamos}</p>
  {/if}
  {#if giro.pasosCortos}
    <TiraPasos pasos={giro.pasosCortos} />
  {/if}

  <!-- LAS DOS ACCIONES Y EL DÓNDE · ADR-0041.
       Atadas a `ctaPrestamo`, que solo tiene empeño: «cuánto me prestan» es falso en
       venta, financiamiento, fletes y taller. Los dos botones van al MISMO canal con mensajes
       distintos —cuánto, y foto— y por eso el segundo es de línea y no de bloque: son
       dos intenciones, no dos botones iguales compitiendo.

       El de la foto es el que el ADR-0036 quitó del panel de consulta. Vuelve, y al
       hero: lo que sobraba era un BLOQUE de contacto a media página, no el canal. -->
  {#if giro.ctaPrestamo}
    <div class="acciones-hero">
      <BotonWhatsApp
        origen="giro-{giro.slug}-hero-cuanto"
        texto={giro.ctaPrestamo}
        mensaje="Hola, quiero saber cuánto me pueden prestar."
      />
      <BotonWhatsApp
        secundario
        origen="giro-{giro.slug}-hero-foto"
        texto="Enviar foto por WhatsApp"
        mensaje="Hola, quiero saber si aceptan este artículo. Les mando una foto."
      />
    </div>
    {#if donde || cuando}
      <p class="donde-cuando">
        {#if donde}
          <span><Icono nombre="mapa" tam={17} grosor={1.8} /> {donde} · Atención presencial</span>
        {/if}
        {#if cuando}
          <span><Icono nombre="reloj" tam={17} grosor={1.8} /> {cuando}</span>
        {/if}
      </p>
    {/if}
  {/if}
</Seccion>

<!-- ADR-0027 · La sección de bienes sube entre la tira de pasos y los botones, y
     solo existe si el giro tiene bienes. Antes, un giro sin ellos —taller— pintaba
     cuatro huecos «BIEN ACEPTADO — PENDIENTE»; eso era una marca de borrador y salió
     con las demás. Una sección vacía no informa: informa su ausencia. -->
{#if giro.bienesPropuestos?.length}
  <Seccion fondo="tenue">
    <h2><span class="num">1</span> {giro.tituloBienes ?? PREGUNTAS[0]}</h2>
    {#if giro.subtituloBienes}
      <p class="entradilla" data-propuesta="true">{giro.subtituloBienes}</p>
    {/if}
    <PlanetaBienes bienes={giro.bienesPropuestos} giro={giro.slug} pregunta={giro.preguntaBien} />

    <!-- AQUÍ VIVÍA EL PANEL DE CONSULTA · ADR-0036, y era del ADR-0024.
         Un `aside` de carbón con «¿No sabes si aceptamos lo que traes?» y un botón
         amarillo de «Enviar foto por WhatsApp».

         Sale por exceso de contacto, no por estar mal. Medido en vivo a 390 px, esta
         página tenía **14 puntos de contacto**: 9 de WhatsApp, 3 de teléfono y 2 al
         formulario. De los 9, seis son los discos del planeta —que no se leen como
         un bloque de contacto— y los otros tres sí: este panel, la barra fija y el
         pie. Se va el que menos falta hace, porque la barra fija cubre WhatsApp de
         forma permanente (el argumento del ADR-0027).

         LO QUE SE PIERDE, y hay que decirlo: era el único sitio de la página que
         atendía a quien trae algo **que no está en las seis categorías**. El planeta
         enumera; esto acogía el resto. Ver el ADR-0036. -->
  </Seccion>
{/if}
<!-- ADR-0022 · LA RETÍCULA DE FOTOS REALES.
     Va DESPUÉS de la lista de bienes, que es la respuesta a la pregunta; esto la
     ilustra. Y va en el campo oscuro, no en el mármol: el mármol es el registro de
     lujo del ADR-0020 y estas son fotos de maquinaria en un patio de grava. Vestir
     una retroexcavadora de boutique contradice su propia marca. -->
<!-- ADR-0027 · LA SEGUNDA MITAD DE LA ENTRADA.
     Los botones, la foto y la banda de monedas bajan por debajo de los bienes: la
     sección 14 entera sube entre la tira de pasos y estos botones, por petición de
     Nadir sobre el mapa de pantalla.
     La foto YA NO es `prioritaria`: lo era por ser el elemento LCP cuando abría la
     página, y ahora vive muy por debajo del pliegue. Dejarla eager habría sido pedir
     con prisa algo que nadie ve al entrar. -->
{#if segundaMitad}
<!-- BLANCO, NO MÁRMOL · ADR-0043. Esta sección solo se pinta en los giros SIN galería
     propia, y ahí caía a media página: una segunda losa de piedra, lejos de la entrada
     y sin nada que la justifique. La piedra es de la entrada y de ningún otro sitio.
     La foto grande se apoya en blanco, que es lo que pide el ADR-0031: el color lo
     ponen las fotografías. -->
<Seccion fondo="blanco">
  <div class="entrada-b">
  <!-- AQUÍ VIVÍA UN TERCER BOTÓN DE WHATSAPP · ADR-0033.
       Medido en vivo a 390 px, en esta misma pantalla cabían TRES llamadas a
       WhatsApp a la vez: «Enviar foto por WhatsApp» del panel de consulta (y=-44),
       este (y=92) y el de la barra fija (y=788) — dos con etiqueta idéntica.
       Sale este, no los otros dos: el del panel lleva su propio mensaje y la barra
       fija es la que garantiza que la página nunca se queda sin CTA (ADR-0027).
       Queda «Llamar», que es otro canal y no se repite en ningún sitio. -->
  <div class="acciones">
    <Boton variante="secundario" href="/contacto/">
      <Icono nombre="telefono" tam={20} grosor={1.9} /> Llamar
    </Boton>
  </div>
  <!-- ADR-0009. Las páginas de giro NO tenían ranura de foto: el CLAUDE.md pedía
       «fachada y una por giro» y solo existía la de la portada. Aquí se abre, con
       foto de archivo provisional y rotulada. -->
  {#if giro.fotoProvisional}
    <div class="foto-giro">
      <!-- `prioritaria` · ESTA FOTO ES EL LCP DE LA PAGINA, y llevaba `loading="lazy"`
           desde que se abrio la ranura. La prop existia y su propio comentario lo
           decia —«la de la entrada se carga de inmediato: es el LCP»— pero solo la
           usaba la portada. Medido en las cuatro paginas de giro: el navegador no
           pedia la imagen hasta ~2000 ms porque nadie le habia dicho que corria
           prisa. -->
      <Foto nombre={giro.fotoProvisional} alt={giro.fotoAlt ?? ''} provisional={!giro.fotoEsSuya} maxAncho={giro.fotoMaxAncho ?? 1600} relacion={giro.fotoRelacion ?? '16 / 9'} tamanos="(min-width: 768px) 60vw, 100vw" />
    </div>
  {/if}
  </div>
  <!-- LA TIRA DE JOYERÍA SE FUE DE AQUÍ · ADR-0037.
       El ADR-0033 la puso dentro de esta rejilla para rellenar 152 px de mármol
       vacío, y funcionó para eso. El problema era otro: vivía en una sección **sin
       etiqueta y sin título** —contenido huérfano de 1187 px— mientras la del patio,
       con seis fotos, tenía el armazón completo. Ahora las dos comparten sección,
       título y registro, más abajo.
       NO se subió el patio al mármol, y el motivo es del ADR-0022: «vestir una
       retroexcavadora de boutique contradice su propia marca». -->
  <!-- ADR-0021 · va DESPUÉS de las acciones, nunca antes: lo primero que tiene que
       encontrar alguien con prisa es el botón, no el adorno.
       Del DATO y no del slug, igual que el mármol del ADR-0020: `lujo` es lo que su
       marca trata como valor. Si joyería vuelve, la banda ya la está esperando. -->
  {#if giro.registro === 'lujo'}
    <MonedasQueCaen />
  {/if}
</Seccion>
{/if}

<!-- UNA SOLA SECCIÓN PARA LAS DOS TIRAS · ADR-0037.
     Medído antes de unificarlas: la de joyería estaba en una sección de 1187 px SIN
     etiqueta y SIN título, y la del patio tenía etiqueta + título para 435 px. Las dos
     enseñan lo mismo —cosas que pasaron por su mostrador— con armazones distintos.

     El título se queda como estaba, «Algo de lo que han tenido», porque ya era correcto
     para las dos: pasado, sin prometer que siga ahí. La etiqueta cambia porque «SU PATIO
     Y SU EQUIPO» dejaba fuera la joyería.

     Cada tira lleva su propio rótulo en `h3`: sin ellos, catorce fotos seguidas de un
     reloj y una retroexcavadora no dicen que son dos conjuntos. -->
{#if giro.muestraInventario || giro.muestraJoyeria}
  <!-- EN BLANCO · ADR-0060. Era `tenue`, igual que el planeta de encima, y los dos
       escaparates se leían como un solo bloque de 1 311 px con 21 imágenes. -->
  <Seccion etiqueta="PIEZAS Y EQUIPO" fondo="blanco">
    <h2 class="titulo-galeria" data-propuesta="true">Algo de lo que han tenido</h2>

    {#if giro.muestraJoyeria}
      <h3 class="tira-titulo">Relojería, joyería y monedas</h3>
      <Carrusel
        fotos={galeriaJoyeria}
        etiqueta="Relojería, joyería y monedas"
        nota={notaJoyeria}
      />
    {/if}

    {#if giro.muestraInventario}
      <h3 class="tira-titulo">Patio y equipo</h3>
      <Carrusel
        fotos={galeriaInventario}
        etiqueta="Su patio y su equipo"
      />
    {/if}
  </Seccion>
{/if}

<!-- SALA PAVONADA · ADR-0046. El proceso en otro registro, como hace Suttons & Robertsons. -->
<Seccion fondo="pavonado">
  <h2><span class="num">{numProceso}</span> {giro.tituloProceso ?? PREGUNTAS[1]}</h2>
  <!-- ADR-0024 · este párrafo vivía en el hero, entre la tira de pasos y el botón,
       diciendo en prosa lo mismo que la tira dice en tres palabras. Aquí sí describe
       algo: es la entradilla del proceso.

       ADR-0043 · PERO NO CUANDO EL HERO YA LO DIJO. Donde hay `pasosCortos` —hoy solo
       empeño— la tira del ADR-0024 ya contó la mecánica en la primera pantalla, y
       este párrafo la volvía a contar veinticinco palabras más abajo. Se comprobó en
       el HTML construido, no de memoria: `/empeno-y-prestamo/index.html` servía el
       mismo proceso CUATRO veces —promesa, tira, subtitular y pasos—.

       La condición es `pasosCortos` y no el slug porque la duplicación la CAUSA la
       tira: el día que otro giro reciba una, hereda el arreglo sin tocar esto. Lo que
       el subtitular decía y nadie más decía —que el bien queda resguardado— no se
       perdió: bajó al chip del retorno, que es donde se lee mirando. -->
  {#if giro.subtitularPropuesto && !giro.pasosCortos}
    <p class="subtitular" data-propuesta="true">{giro.subtitularPropuesto}</p>
  {:else if !giro.subtitularPropuesto}
    <Hueco etiqueta="SUBTITULAR — QUÉ RESUELVE, EN DOS RENGLONES" renglones={2} />
  {/if}
  <!-- NINGUNO dice cuánto ni cuándo, y el encabezado de esta sección pregunta las dos
       cosas. No es un descuido de este bloque: el bloque de cifras que las contestaba
       lo borró el ADR-0040 y la tasa, el plazo y el aforo siguen sin cerrar. Queda
       anotado aquí porque un flujo más limpio hace el hueco MÁS visible, no menos. -->
  {#if giro.flujo}
    <FlujoProceso pasos={giro.flujo} retorno={giro.retorno} />
  {:else if giro.pasosPropuestos}
    <!-- LA LISTA DE ANTES, viva a propósito · ADR-0043. Un giro sin `flujo` escrito no
         se queda sin proceso: cae aquí. Borrar esta rama convertiría «falta partir el
         copy» en «la sección desaparece». -->
    <ol class="pasos">
      {#each giro.pasosPropuestos as paso, i}
        <li data-propuesta="true">
          <span class="paso-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <p>{paso}</p>
        </li>
      {/each}
    </ol>
  {:else}
    <ol class="pasos">
      {#each Array(3) as _, i}
        <li><Hueco etiqueta="PASO {i + 1} — QUÉ PASA Y CUÁNTO TARDA" renglones={2} /></li>
      {/each}
    </ol>
  {/if}
</Seccion>

<Seccion fondo="marfil">
  <h2><span class="num">{numUbicacion}</span> {PREGUNTAS[3]}</h2>
  <!-- EL LIENZO PARTIDO · ADR-0051, sin título propio: la pregunta numerada ya lo es.
       EN FRANJA · ADR-0059: el mapa, la dirección y «Cómo llegar». El horario lo dice el
       pie. Medido a 390 px antes del cambio, esta sección y el pie sumaban 1 277 px con
       los mismos datos. -->
  <Ubicacion franja />
</Seccion>

<!-- AQUÍ ESTABA «OTRAS LÍNEAS DEL GRUPO» · ADR-0055. Cuatro tarjetas con el nombre largo
     de las otras líneas, justo encima del pie. Salió porque repetía navegación: el pie de
     las nueve páginas lleva los cinco enlaces desde el ADR-0053, y en escritorio también la
     cabecera. En teléfono medía 328 px y la tarjeta se separaba del acero a 1.49:1.

     Su razón —que sin estos enlaces cada página quedaba aislada— era cierta cuando nada
     más las unía. Hoy las une el pie. La página de línea termina como contacto: la
     ubicación y el pie. -->


<style>
  /* CAMBIO 03 · navegación editorial: sin recuadro y con aire. Tenía `--superficie`
     de fondo y sobre la piedra se leía como una banda blanca aparte. */
  .migas { padding: var(--e-4) var(--margen-lateral) var(--e-2); background: transparent; }
  /* El titular vive en su propio componente desde el ADR-0007 §4. Aquí solo el
     espacio de abajo, que es composición de esta página y no del primitivo. */
  .encabezado { margin-bottom: var(--e-4); }
  h2 {
    display: flex; align-items: center; gap: var(--e-3);
    font-size: var(--h2-tam); line-height: var(--h2-alto); font-weight: var(--h2-peso);
    margin-bottom: var(--e-4);
  }
  .num {
    flex-shrink: 0; width: 30px; height: 30px; border-radius: var(--radio-pastilla);
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--oro-500); color: var(--negro-950); line-height: 1;
    /* 14 y no 15 · ADR-0053: el numeral del disco va al tamaño de apoyo, en peso de título. */
    font-size: var(--pie-tam); font-weight: var(--h2-peso);
  }
  /* CAMBIO 05 · la fotografía contrasta CONTRA la piedra, no dentro de una tarjeta
     blanca. Radio moderado, sombra muy suave y contraste algo subido: el objeto de
     valor tiene que separarse del mármol sin que haga falta enmarcarlo. */
  /* ── LA FOTO SALE DEL MARCO · ADR-0032 ───────────────────────────────
     Estaba puesta como un rectángulo con esquinas redondeadas, sombra grande y aire
     simétrico a los cuatro lados, flotando en el centro del mármol. Eso es composición
     de formulario, y es exactamente lo que se llamó «plano y básico».

     Ninguna de las tres referencias del ADR-0029 enmarca una fotografía: la dejan
     cortarse contra el borde. Aquí hace lo mismo, y la piedra queda de zócalo.

     NO SE FUERZA A VERTICAL. Esta plantilla pinta las CUATRO páginas de giro y las
     otras tres llevan foto apaisada; cada giro declara la suya en `fotoRelacion`.
     Lo que cambia es el encuadre de la PÁGINA, no el de la foto. */
  /* `minmax(0, 1fr)` Y `min-width: 0` NO SON ADORNO · ADR-0034.
     Un ítem de rejilla tiene `min-width: auto`, o sea que **no baja de su ancho
     mínimo de contenido**. La pista del carrusel son 7 tarjetas de 262 px en fila,
     así que su mínimo son ~1834 px: al meter la secuencia dentro de la rejilla, la
     columna se estiró y el `overflow-x: auto` del carrusel nunca llegó a actuar.

     Medido en la página construida, a 390 px de ventana: `scrollWidth` 1920 y la
     foto de entrada con 1920×2417 px en vez de 390×491. La sección pasó de 1061 a
     3044 px de alto. No dio ningún error: solo se desbordó la página entera. */
  /* ── EL HERO DE INTENCIÓN · ADR-0041 ────────────────────────────── */
  .valuamos {
    max-width: 44ch;
    /* SIN margen negativo arriba. Se copió de `.entradilla`, donde sube el texto
       contra un `h2`; aquí lo pegaba a la promesa y las dos frases se tocaban. */
    margin: var(--e-3) 0 var(--e-4);
    font-size: var(--cuerpo-tam);
    line-height: var(--cuerpo-alto);
    color: var(--tinta-secundaria);
  }
  .acciones-hero { display: grid; gap: var(--e-3); margin-top: var(--e-6); }

  /* Dónde y cuándo. Iconos del set, no emoji: el sistema no tiene ni uno y meter dos
     aquí serían los únicos del sitio, con su propio tipo y su propio color. */
  .donde-cuando {
    display: grid;
    gap: var(--e-1);
    margin: var(--e-4) 0 0;
    font-size: var(--pie-tam);
    line-height: 1.4;
    color: var(--tinta-secundaria);
  }
  .donde-cuando span { display: flex; align-items: center; gap: var(--e-2); }

  @media (min-width: 768px) {
    .acciones-hero { grid-auto-flow: column; justify-content: start; }
    .donde-cuando { grid-auto-flow: column; justify-content: start; gap: var(--e-6); }
  }

  .entrada-b { display: grid; gap: var(--e-6); grid-template-columns: minmax(0, 1fr); }

  /* A SANGRE en teléfono: cancela el acolchado lateral de la sección y toca los dos
     bordes de la pantalla. */
  .foto-giro { margin-inline: calc(var(--margen-lateral) * -1); }
  .foto-giro :global(img) { filter: contrast(1.08) saturate(1.04); }
  .acciones { display: grid; gap: var(--e-3); }

  @media (min-width: 768px) {
    /* Dos columnas otra vez · ADR-0037. Las áreas del ADR-0033 existían para colocar
       la tira de joyería en la columna izquierda; con la tira fuera, sobran.
       EL COSTO, dicho: la izquierda vuelve a ser mármol con un botón apoyado en el
       pie de la foto. Se acepta a cambio de que las dos tiras vivan juntas. */
    .entrada-b {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
      align-items: end;
      gap: var(--e-12);
    }
    /* Los botones se apoyan en el pie de la foto, no flotan a media altura. */
    .acciones { align-self: end; padding-bottom: var(--e-8); }

    /* SANGRA HASTA EL BORDE DE LA VENTANA, no hasta el filo del acolchado.
       Cancelar solo el acolchado NO basta: `.caja` está limitada a `--ancho-maximo`
       y centrada, así que sobra un hueco que crece con la pantalla. Medido: 32 px a
       1280, 112 a 1440 y 352 a 1920. Un filo de 32 px de piedra no se lee como
       composición, se lee como un error de cálculo.

       VA EN LA REJILLA, NO EN LA FOTO, y esto costó una medición: en un ítem de
       rejilla el `50%` de un margen resuelve contra SU COLUMNA, no contra `.caja`.
       Puesto en `.foto-giro` daba -347 px y la imagen se salía 268 px de la ventana.
       En `.entrada-b` el porcentaje sí resuelve contra `.caja`, que es lo que la
       fórmula supone. */
    .entrada-b { margin-right: calc(50% - 50vw); }
    /* Y se anula el sangrado de teléfono: si se queda, la foto se pasa 20 px por
       cada lado de su columna. Medido —terminaba en 1300 sobre una ventana de 1280. */
    .foto-giro { margin-inline: 0; }
  }
  /* Aquí vivían `.nota`, `.et`, `.bienes` y `.ranura-ico`: el CSS de la rama que
     pintaba «BIEN ACEPTADO — PENDIENTE» cuando un giro no tenía bienes, y el de la
     nota de «esta lista la dedujimos». Las dos eran marcas de borrador y salieron
     con el ADR-0027. Su CSS se va con ellas; el historial lo guarda. */

  /* Entradilla de la sección de bienes · ADR-0024. Una sola frase que lleva la
     promesa —«te decimos cuánto»— antes de la retícula. */
  /* El rótulo de cada tira · ADR-0037. Por debajo del `h2` de la sección y por encima
     del pie de foto: es una división dentro del bloque, no un bloque nuevo. */
  .tira-titulo {
    margin: var(--e-8) 0 var(--e-2);
    font-size: var(--cuerpo-tam);
    font-weight: var(--cuerpo-fuerte-peso);
    line-height: 1.3;
    color: var(--tinta-secundaria);
  }
  .tira-titulo:first-of-type { margin-top: var(--e-4); }

  .entradilla {
    max-width: 46ch;
    margin: calc(var(--e-2) * -1) 0 var(--e-4);
    font-size: var(--cuerpo-tam);
    line-height: 1.5;
    color: var(--tinta-secundaria);
  }

  /* La promesa del hero · ADR-0024. Grande, pero por debajo del h1. */
  /* LA PROMESA ES PARTE DEL TITULAR, no un párrafo suelto · ADR-0029. Se quedó en
     palo seco peso 800 y justo debajo de una serif de 400 chocaba: dos voces en dos
     renglones seguidos. En el panel que se eligió, el subtítulo iba en la misma
     familia que el titular. Aquí hace lo mismo, un cuerpo más abajo. */
  .promesa {
    max-width: 24ch;
    margin: var(--e-3) 0 0;
    font-family: var(--fuente-display);
    font-size: 1.5rem;
    line-height: 1.3;
    font-weight: 400;
    letter-spacing: 0;
    color: var(--tinta-secundaria);
  }
  @media (min-width: 768px) {
    .promesa { font-size: 1.75rem; }
  }

  /* ── AQUÍ VIVÍA EL CSS DE LO QUE YA NO SE PINTA · ADR-0040 ────────────────
     Dieciocho selectores muertos, todos del mismo origen: secciones que se quitaron
     y dejaron su hoja. Svelte los reportaba en cada build, dos veces cada uno.

       · `.revision`, `.rev-et`, `.rev-lista`  — el recado para Cristóbal · ADR-0025,
         retirado por el ADR-0027
       · `.requisitos`                         — la sección «¿Qué necesito llevar?»
       · `.cifras`, `.casilla`                 — el bloque de porcentaje, plazo y tasa
       · `.acordeon *`, `.signo*`, `.respuesta` — el acordeón «¿Puedo recuperar mi bien?»,
         que tenía cuatro preguntas y ni una respuesta escrita
       · `.datos p`, `.bienes`                 — restos de la retícula y del bloque de datos
       · `.consulta` y sus dos hijos           — el panel del ADR-0024, retírado por el 0036

     Un selector muerto no cuesta bytes que se noten: cuesta que el próximo que lea
     esto crea que existe un bloque que no existe. El historial guarda lo borrado. */

  .pasos { display: grid; gap: var(--e-4); }
  .pasos li {
    display: grid; grid-template-columns: auto 1fr; gap: var(--e-3); align-items: center;
    border-left: 2px solid var(--oro-500); padding-left: var(--e-3);
  }
  /* EL NUMERAL, EN GRANDE · ADR-0024. Era una pastilla de 26 px con el número dentro
     y se leía como una viñeta cualquiera. El proceso es lo que hay que entender de un
     vistazo, así que el número pesa lo que pesa el paso. */
  .paso-num {
    flex-shrink: 0;
    min-width: 2ch;
    font-size: 1.75rem;
    font-weight: 900;
    line-height: 1;
    /* Token y no `--oro-500`: en el registro claro ese oro no es texto. */
    color: var(--oro-texto-grande);
    font-variant-numeric: tabular-nums;
  }
  .subtitular { max-width: 56ch; margin: calc(var(--e-2) * -1) 0 var(--e-6); font-size: var(--cuerpo-tam); line-height: var(--cuerpo-alto); color: var(--tinta-suave); }

  /* `.cruzados` salió con su sección · ADR-0055. */

  @media (min-width: 768px) {
    .acciones { grid-auto-flow: column; justify-content: start; }
  }
</style>

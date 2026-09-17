<script lang="ts">
  /**
   * Portada REPARTIDORA. Su trabajo no es vender: es mandar al giro correcto.
   * Por eso la retícula de líneas es la sección más grande de la página.
   *
   * El copy que hay es PROPUESTA SIN APROBAR, literal de
   * `docs/70-contenido/propuesta-textos.md`. Lo que no está propuesto sigue siendo
   * hueco etiquetado, y lo que es dato de negocio sigue en `__POR_CONFIRMAR__`.
   */
  import Seccion from '$componentes/Seccion.svelte';
  import Boton from '$componentes/Boton.svelte';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import MosaicoLineas from '$componentes/MosaicoLineas.svelte';
  import Icono from '$componentes/Icono.svelte';
  import Insignia from '$componentes/Insignia.svelte';
  import Foto from '$componentes/Foto.svelte';
  import CintaPalabras from '$componentes/CintaPalabras.svelte';
  import Titular from '$componentes/Titular.svelte';
  import Ubicacion from '$componentes/Ubicacion.svelte';
  import { girosConstruibles } from '$lib/datos/giros';
  import { negocio } from '$lib/config/negocio';
  import { enlaceTelefono } from '$lib/datos/telefono';

  /**
   * TEXTO PROPUESTO, SIN APROBAR · docs/70-contenido/propuesta-textos.md
   *
   * Va literal del borrador. No lo reescribo: el trabajo de Cristóbal es corregir
   * encima, y para eso tiene que leer lo que se le propuso, no mi versión.
   *
   * LA GRAFÍA DE LA MARCA NO SE ESCRIBE AQUÍ. El borrador dice «Todo MÁSTER» y el
   * El ADR-0004 había cerrado `MASTERS` y el ADR-0018 lo revirtió a `MASTER` al
   * cerrarse D-01. Ese choque nunca lo resolvió esta página: sale de
   * `negocio.nombreComercial`, que es la fuente única, y cambió con una sola línea.
   *
   * EL NÚMERO DE LÍNEAS SE DERIVA, NO SE ESCRIBE. El borrador decía «Siete líneas»
   * y el ADR-0008 lo dejó en cuatro el mismo día. Escribir el número a mano ya se
   * quedó mal una vez; ahora sale de `girosConstruibles.length` y no puede mentir.
   * El propio borrador ya había señalado ese riesgo para otra alternativa.
   */
  /* «LLAMAR» LLAMA · ADR-0052. Los dos botones de esta página llevaban a contacto, y el de
     contacto traía de vuelta aquí. Sin número confirmado, contacto sigue siendo el destino. */
  const llamar = enlaceTelefono() ?? '/contacto/';

  const CUANTAS = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const lineas = $derived(CUANTAS[girosConstruibles.length] ?? String(girosConstruibles.length));

  const DIFERENCIADORES = $derived([
    {
      icono: 'mapa',
      titulo: 'Todo en un mismo lugar',
      linea: `${lineas[0].toUpperCase()}${lineas.slice(1)} líneas de negocio bajo la misma marca. No te mandamos a otro lado.`
    },
    {
      icono: 'empeno',
      titulo: 'Aquí hay local, cara y vitrina',
      linea: 'No somos una aplicación ni un número que nadie contesta. Puedes venir y vernos.'
    },
    // El tercero NO se rellena. El borrador es explícito: necesita un dato de
    // Cristóbal —años, si es negocio familiar, qué hacen distinto, o cobertura—.
    // Sin ese dato el bloque se queda vacío, pero no se inventa.
    { icono: 'reloj', titulo: null, linea: null }
  ]);
</script>


<!-- ENTRADA OSCURA · ADR-0011. Se aparta de sus cinco piezas, donde el panel del
     titular es claro y lo oscuro es la fotografía. Decidido por Nadir el 10 de
     septiembre, con el argumento y el costo en el ADR. -->
<!-- LA PUERTA DEL SITIO, EN PIEDRA · ADR-0043.
     Valía `oscuro`. Auditadas las ocho páginas quedó a la vista que la entrada al SITIO
     era carbón y la entrada a cada LÍNEA era mármol: dos puertas distintas para la misma
     casa. Ahora es una. La fotografía de la fachada se conserva — es el activo que el
     ADR-0009 dejó abierto y el ADR-0032 dio por cerrado, y sobre piedra clara se lee
     como material de marca en vez de como un banner sobre negro. -->
<!-- LA PUERTA, EN ACERO PAVONADO · ADR-0046.
     Vuelve a ser oscura, y el ADR-0043 la había pasado a piedra clara el mismo día. Lo
     que cambió es el material: el acero de su propia M es oscuro, y es la única forma
     de una entrada de acero fuerte sin crear un oro más oscuro. Queda pegada a la cinta
     de carbón, y se dijo antes de elegir. -->
<Seccion fondo="pavonado" etiqueta="GRUPO MÁSTER · TORREÓN, COAHUILA">
  <div class="entrada">
    <div class="palabra">
      <!-- El corte a dos tintas no es invención: el borrador ya escribió el titular
           en dos frases —qué hacen y dónde, luego la marca—. Es el mismo patrón de
           «MAQUINARIA / LISTA PARA TRABAJAR» de sus cinco piezas. ADR-0007 §4. -->
      <div data-propuesta="true">
        <!-- AJUSTADO por el ADR-0008. El borrador decía «Empeño, joyería y
             maquinaria», y joyería ya no es un giro del sitio: habría quedado
             prometiendo algo que no existe. El propio borrador anticipaba este
             ajuste —«si Cristóbal sabe que la gente llega más por X, se reordena»—,
             así que la estructura es suya y solo cambian las líneas nombradas. -->
        <Titular
          tam="display"
          primera="Empeño, venta, financiamiento, fletes y taller en Torreón."
          segunda="Todo {negocio.nombreComercial}."
        />
      </div>
      <p class="subtitular" data-propuesta="true">
        Cada línea tiene su propia página: qué hacemos, qué necesitas traer y cómo
        encontrarnos. Si tienes una duda, escríbenos por WhatsApp.
      </p>
      <div class="acciones">
        <BotonWhatsApp origen="portada-entrada" />
        <Boton variante="secundario" href={llamar}>
          <Icono nombre="telefono" tam={20} grosor={1.9} /> Llamar
        </Boton>
      </div>
    </div>
    <!-- Aquí NO va la diagonal, y conviene dejar escrito por qué se intentó y se
         quitó. En sus piezas la diagonal es el borde de una FOTOGRAFÍA: nace de que
         hay una masa oscura que cortar. Puesta como remate sobre esta ranura gris se
         convertía en una barra negra con una mancha amarilla encima de una caja gris,
         sin cortar ni enmarcar nada.

         La geometría lo explica y es la misma de la enmienda 5: una recta inclinada
         desde la vertical necesita ALTO, y una banda de remate no lo tiene. Los
         números están en la SPEC-0002.

         La foto ya existe, así que el gesto ya tiene dónde vivir: cortando esta foto
         contra el panel del titular, como en sus cinco piezas. Es trabajo aparte y
         con su propia medición, no un remate. -->
    <!-- LA FACHADA REAL. Entregada por el cliente el 10 de septiembre y con ella se
         cierra el hueco más caro del proyecto. Va de héroe y no de ilustración: es
         la única respuesta que ninguna cadena puede dar, y por eso es lo primero.
         NO lleva rótulo de provisional porque no lo es. -->
    <Foto
      nombre="fachada"
      alt="Fachada del local: un contenedor amarillo sobre la entrada negra, con el logotipo de MASTERS VALUADORES y el letrero de servicios"
      alto={900}
      provisional={false}
      prioritaria
      diagonal
    />
  </div>
</Seccion>

<!-- Las palabras salen del letrero de su propia fachada. Ver CintaPalabras.svelte. -->
<CintaPalabras />

<Seccion fondo="crema" etiqueta="NUESTRAS LÍNEAS">
  <!-- «Es una instrucción, no un eslogan: es exactamente lo que esa sección le pide
       al visitante.» — del borrador. -->
  <h2 class="titulo-seccion" data-propuesta="true">Elige la línea que buscas</h2>
  <!-- EL MOSAICO · ADR-0048 · ADR-0049 · ADR-0057. Aquí vivía la reja de tarjetas. Cada
       pieza lleva a la página de su línea. Los botones verdes de WhatsApp de cada pieza
       salieron en el ADR-0057, por excesivos. -->
  <MosaicoLineas lineas={girosConstruibles} />
  <!-- AQUÍ HABÍA UNA NOTA Y SE QUITÓ: «El orden es provisional. La prioridad la
       decide el estudio de búsqueda, no la intuición.»

       Era una nota escrita para NOSOTROS que acabó impresa para el visitante.
       Alguien que llega buscando dinero hoy no sabe qué es un estudio de búsqueda
       ni por qué debería importarle nuestro método. Que el orden sea provisional es
       cierto y sigue dicho donde toca: en giros.ts, en el mapa de páginas y en el
       ADR-0008. En la pantalla solo ocupaba sitio. -->
</Seccion>

<!-- SALA PAVONADA · ADR-0046. Parte los ~2000 px de suelo en habitaciones. -->
<Seccion fondo="pavonado" etiqueta="POR QUÉ AQUÍ">
  <!-- Etiqueta de sección: el CLAUDE.md la permite redactar. No afirma nada del
       negocio, solo dice qué hace esa sección. -->
  <h2 class="titulo-seccion" data-propuesta="true">Por qué venir aquí</h2>
  <!-- ADR-0007 §3: aquí la insignia SÍ entra, y sustituye la regla dorada que este
       bloque llevaba de borde. El texto sigue siendo hueco: la etiqueta en versalitas
       y la segunda línea en oro llegan con el copy, no antes. -->
  <ul class="diferenciadores">
    <!-- ADR-0027 · solo los que TIENEN texto. El tercero está vacío a propósito —le
         falta un dato de Cristóbal— y pintaba un hueco rotulado; eso era una marca de
         borrador y salió con las demás. Cuando llegue el dato, vuelve solo. -->
    {#each DIFERENCIADORES.filter((d) => d.titulo) as d}
      <li>
        <Insignia icono={d.icono} sobreOscuro={false}>
          <div data-propuesta="true">
            <p class="dif-titulo">{d.titulo}</p>
            <p class="dif-linea">{d.linea}</p>
          </div>
        </Insignia>
      </li>
    {/each}
  </ul>
</Seccion>

<Seccion fondo="crema" etiqueta="DÓNDE ESTAMOS">
  <!-- EL LIENZO PARTIDO · ADR-0051. La marca y «Ver el mapa» en una mitad, la dirección,
       los horarios y «Cómo llegar» en la otra. La fachada real sigue arriba, de héroe. -->
  <Ubicacion titulo="Aquí nos encuentras" />
</Seccion>

<!-- AQUÍ IBA LA DIAGONAL Y SE RETIRÓ · 10 de septiembre, decisión de Nadir.
     Se intentó dos veces —como remate de la ranura de foto y como banda entrando a
     esta sección— y las dos se leyó como un parche amarillo flotando, sin cortar ni
     enmarcar nada. La razón es la misma que descartó la arista de sección: una recta
     a 30° de la vertical necesita ALTO, y en una banda de 48 px recorre 27.7 px.

     La pieza no está mal pensada: está mal alojada. En sus cinco publicaciones la
     diagonal es el BORDE DE UNA FOTOGRAFÍA. Ahora que la fachada existe, ese gesto ya
     tiene dónde vivir de verdad. Hasta entonces, no hay diagonal: es mejor que no
     esté a que esté de adorno. Ver CA-01 en la SPEC-0002. -->

<!-- AQUÍ ESTABA «TE ATENDEMOS POR WHATSAPP» · ADR-0052, decisión de Nadir.
     Una línea por giro con su botón, tomada de la referencia del cliente. Desde el ADR-0049
     sus cinco botones abrían WhatsApp con los MISMOS cinco mensajes que los botones verdes
     del mosaico, y los nombres y frases de cada línea ya estaban arriba: 895 px, casi la
     quinta parte de la portada en teléfono, repitiendo. El día que haya un número por línea, los
     botones del mosaico son los que lo reciben. -->

<!-- BLANCO · ADR-0043. Era el tercero de tres bloques oscuros seguidos —CONTACTO,
     la banda de datos y el pie—: unos 1040 px de masa negra con las costuras dentro.
     El pie ya es el ancla de contacto; esto no necesitaba serlo también.

     Y SALE LA CLASE `oscuro` DEL `h2`: forzaba `--tinta-sobre-oscuro`, o sea blanco.
     Sobre blanco desaparece. Es la quinta vez en este repo que un color forzado en el
     marcado explota al cambiar la superficie de debajo, y la quinta vez que la
     respuesta es dejar que el token del registro decida. -->
<Seccion fondo="blanco" etiqueta="CONTACTO">
  <h2 class="titulo-seccion" data-propuesta="true">
    ¿Tienes una duda? Escríbenos y te contestamos.
  </h2>
  <div class="acciones">
    <BotonWhatsApp origen="portada-contacto" />
    <Boton variante="secundario" href={llamar}>
      <Icono nombre="telefono" tam={20} grosor={1.9} /> Llamar
    </Boton>
  </div>
</Seccion>

<style>
  .entrada { display: grid; gap: var(--e-6); }

  /* ── Texto propuesto ──────────────────────────────────────────────────────
     Sin tratamiento especial: propuesto no significa provisional en lo visual.
     Se ve como se va a ver cuando Cristóbal lo apruebe, y lo que dice que es
     borrador es la banda de arriba. */
  /* `--tinta-suave` y no `--tinta-secundaria`: en la entrada oscura el negro-600
     desaparecería sobre el negro. La superficie resuelve cuál toca. */
  .subtitular {
    font-size: var(--cuerpo-tam);
    line-height: var(--cuerpo-alto);
    color: var(--tinta-suave);
  }
  .titulo-seccion {
    font-size: var(--h2-tam);
    line-height: var(--h2-alto);
    font-weight: var(--h2-peso);
    margin-bottom: var(--e-4);
  }
  /* `.titulo-seccion.oscuro` se fue con su único uso · ADR-0043. Forzaba blanco para
     el `h2` de CONTACTO cuando esa sección era carbón; en blanco lo habría borrado.
     No quedan más usos: los otros cuatro `titulo-seccion` nunca la llevaron. */
  .dif-titulo {
    font-size: var(--cuerpo-tam);
    line-height: var(--h3-alto);
    font-weight: var(--cuerpo-fuerte-peso);
  }
  .dif-linea {
    margin-top: var(--e-1);
    font-size: var(--pie-tam);
    line-height: var(--pie-alto);
    color: var(--tinta-secundaria);
  }
  .palabra { display: grid; gap: var(--e-3); }
  .acciones { display: grid; gap: var(--e-3); margin-top: var(--e-2); }



  /* Sin borde dorado: la insignia es la que trae el acento ahora. Dos gestos de oro
     en el mismo bloque compiten y ninguno significa nada. */
  .diferenciadores { display: grid; gap: var(--e-6); margin-top: var(--e-4); }

  /* `.lineas` salió con su sección · ADR-0052. */

  /* `.ubicacion` y `.datos` se fueron a `Ubicacion.svelte` · ADR-0051. */

  @media (min-width: 768px) {
    .entrada { grid-template-columns: 1fr 1fr; align-items: center; gap: var(--e-16); }
    .acciones { grid-auto-flow: column; justify-content: start; }
    .diferenciadores { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
</style>

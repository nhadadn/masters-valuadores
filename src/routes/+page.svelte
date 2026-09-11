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
  import Hueco from '$componentes/Hueco.svelte';
  import RanuraImagen from '$componentes/RanuraImagen.svelte';
  import Boton from '$componentes/Boton.svelte';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import Tarjeta from '$componentes/Tarjeta.svelte';
  import Icono from '$componentes/Icono.svelte';
  import Insignia from '$componentes/Insignia.svelte';
  import Foto from '$componentes/Foto.svelte';
  import CintaPalabras from '$componentes/CintaPalabras.svelte';
  import Titular from '$componentes/Titular.svelte';
  import AvisoBorrador from '$componentes/AvisoBorrador.svelte';
  import DatosDelLocal from '$componentes/DatosDelLocal.svelte';
  import { girosConstruibles, girosBloqueados } from '$lib/datos/giros';
  import { negocio } from '$lib/config/negocio';

  /**
   * TEXTO PROPUESTO, SIN APROBAR · docs/70-contenido/propuesta-textos.md
   *
   * Va literal del borrador. No lo reescribo: el trabajo de Cristóbal es corregir
   * encima, y para eso tiene que leer lo que se le propuso, no mi versión.
   *
   * LA GRAFÍA DE LA MARCA NO SE ESCRIBE AQUÍ. El borrador dice «Todo MÁSTER» y el
   * ADR-0004 decidió que la grafía del sitio es `MASTERS`. Ese choque no lo resuelvo
   * yo: sale de `negocio.nombreComercial`, que es la fuente única, y cambia solo
   * cuando cierre D-01.
   *
   * EL NÚMERO DE LÍNEAS SE DERIVA, NO SE ESCRIBE. El borrador decía «Siete líneas»
   * y el ADR-0008 lo dejó en cuatro el mismo día. Escribir el número a mano ya se
   * quedó mal una vez; ahora sale de `girosConstruibles.length` y no puede mentir.
   * El propio borrador ya había señalado ese riesgo para otra alternativa.
   */
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

<AvisoBorrador />

<!-- ENTRADA OSCURA · ADR-0011. Se aparta de sus cinco piezas, donde el panel del
     titular es claro y lo oscuro es la fotografía. Decidido por Nadir el 10 de
     septiembre, con el argumento y el costo en el ADR. -->
<Seccion fondo="oscuro" etiqueta="GRUPO MÁSTER · TORREÓN, COAHUILA">
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
          primera="Empeño, maquinaria, fletes y taller en Torreón."
          segunda="Todo {negocio.nombreComercial}."
        />
      </div>
      <p class="subtitular" data-propuesta="true">
        Cada línea tiene su propia página: qué hacemos, qué necesitas traer y cómo
        encontrarnos. Si tienes una duda, escríbenos por WhatsApp.
      </p>
      <div class="acciones">
        <BotonWhatsApp origen="portada-entrada" sobreOscuro />
        <Boton variante="secundario" href="/contacto/" sobreOscuro>
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
    />
  </div>
</Seccion>

<!-- Las palabras salen del letrero de su propia fachada. Ver CintaPalabras.svelte. -->
<CintaPalabras />

<Seccion fondo="crema" etiqueta="NUESTRAS LÍNEAS">
  <!-- «Es una instrucción, no un eslogan: es exactamente lo que esa sección le pide
       al visitante.» — del borrador. -->
  <h2 class="titulo-seccion" data-propuesta="true">Elige la línea que buscas</h2>
  <ul class="reticula">
    {#each girosConstruibles as g}
      <li><Tarjeta href="/{g.slug}/" titulo={g.nombre} icono={g.icono} nota={g.frasePropuesta} /></li>
    {/each}
    <li>
      <div class="bloqueados">
        <p class="cabeza"><Icono nombre="bloq" tam={18} /> BLOQUEADOS</p>
        {#each girosBloqueados as g}
          <p class="fila"><span>{g.nombre}</span><code>{g.bloqueadoPor}</code></p>
        {/each}
        <p class="nota">Entran cuando se cierren esas dos decisiones.</p>
      </div>
    </li>
  </ul>
  <p class="aviso">El orden es provisional. La prioridad la decide el estudio de búsqueda, no la intuición.</p>
</Seccion>

<Seccion etiqueta="POR QUÉ AQUÍ">
  <!-- Etiqueta de sección: el CLAUDE.md la permite redactar. No afirma nada del
       negocio, solo dice qué hace esa sección. -->
  <h2 class="titulo-seccion" data-propuesta="true">Por qué venir aquí</h2>
  <!-- ADR-0007 §3: aquí la insignia SÍ entra, y sustituye la regla dorada que este
       bloque llevaba de borde. El texto sigue siendo hueco: la etiqueta en versalitas
       y la segunda línea en oro llegan con el copy, no antes. -->
  <ul class="diferenciadores">
    {#each DIFERENCIADORES as d, i}
      <li>
        <Insignia icono={d.icono} sobreOscuro={false}>
          {#if d.titulo}
            <div data-propuesta="true">
              <p class="dif-titulo">{d.titulo}</p>
              <p class="dif-linea">{d.linea}</p>
            </div>
          {:else}
            <Hueco etiqueta="DIFERENCIADOR {i + 1} — NECESITA UN DATO DE CRISTÓBAL" renglones={2} />
          {/if}
        </Insignia>
      </li>
    {/each}
  </ul>
</Seccion>

<Seccion fondo="crema" etiqueta="DÓNDE ESTAMOS">
  <div class="ubicacion">
    <!-- El hueco de la fachada se cerró: la foto real está arriba, de héroe. Lo que
         sigue abierto aquí es el mapa, y depende de D-08. -->
    <RanuraImagen relacion="4 / 3" etiqueta="MAPA — D-08 YA CERRÓ; INCRUSTARLO ES OTRA DECISIÓN" />
    <div class="datos">
      <DatosDelLocal />
    </div>
  </div>
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

<!-- ── LÍNEAS DE WHATSAPP · tomado de la referencia que le gusta al cliente ──────
     De `prestamoexpress.com.mx` se toma ESTRUCTURA, no aspecto: una línea por
     categoría, cada una con su ícono y con LA LISTA DE LO QUE CUBRE. Allí dice
     «Línea Autos y Maquinaria — Retroexcavadora, Cargadores, Excavadoras…».

     Hace tres cosas a la vez: el mensaje llega preclasificado, el visitante ve que
     hay alguien que entiende SU caso, y —lo que más importa aquí— esa lista es
     exactamente el «qué bienes aceptan» que a Masters le falta. Le da casa a la
     información que de todos modos hay que pedirle a Cristóbal.

     DIFERENCIA CON LA REFERENCIA: ellos tienen cuatro números distintos. Masters
     tiene uno solo, así que lo que separa las líneas es el MENSAJE PREVIO, no el
     número. Cuando el cliente confirme si hay más de un número, esto ya está listo. -->
<Seccion etiqueta="TE ATENDEMOS POR WHATSAPP">
  <h2 class="titulo-seccion" data-propuesta="true">Escríbenos por la línea que te toca</h2>
  <ul class="lineas">
    {#each girosConstruibles as g}
      <li>
        <!-- La imagen entra porque la referencia que le gusta al cliente apoya cada
             línea en una foto, y porque sin ella este bloque es solo texto. Sigue
             siendo de archivo y rotulada: ADR-0009.
             Se reusa la del giro a propósito — la misma imagen aquí y en su página
             ayuda a reconocer, no a confundir. -->
        {#if g.fotoProvisional}
          <Foto nombre={g.fotoProvisional} alt={g.fotoAlt ?? ''} relacion="3 / 2" compacto />
        {/if}
        <Insignia icono={g.icono} sobreOscuro etiqueta={g.nombre} segunda={g.frasePropuesta} />
        <Hueco etiqueta="QUÉ ENTRA EN ESTA LÍNEA — LA LISTA DE BIENES, LA DA CRISTÓBAL" renglones={3} />
        <BotonWhatsApp
          origen="linea-{g.slug}"
          texto="Escribir por {g.nombreCorto.toLowerCase()}"
          mensaje="Hola, escribo por {g.nombre.toLowerCase()}."
        />
      </li>
    {/each}
  </ul>
</Seccion>

<Seccion fondo="oscuro" etiqueta="CONTACTO">
  <h2 class="titulo-seccion oscuro" data-propuesta="true">
    ¿Tienes una duda? Escríbenos y te contestamos.
  </h2>
  <div class="acciones">
    <BotonWhatsApp origen="portada-contacto" sobreOscuro />
    <Boton variante="secundario" href="/contacto/" sobreOscuro>
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
  .titulo-seccion.oscuro { color: var(--tinta-sobre-oscuro); }
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

  .reticula { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--e-2); margin-top: var(--e-4); }
  .aviso { font-size: var(--pie-tam); color: var(--tinta-secundaria); margin-top: var(--e-4); }

  .bloqueados {
    display: flex; flex-direction: column;
    min-height: 176px; padding: var(--e-4) var(--e-3);
    border: 1px dashed var(--negro-400); background: var(--superficie);
  }
  .cabeza {
    display: flex; align-items: center; gap: var(--e-2);
    font-size: 11px; font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking); color: var(--tinta-secundaria);
  }
  .fila { display: flex; align-items: baseline; justify-content: space-between; gap: var(--e-2); margin-top: var(--e-2); font-size: var(--pie-tam); font-weight: 600; color: var(--tinta-secundaria); }
  .fila code { font-family: ui-monospace, Menlo, monospace; font-size: 11px; border: 1px solid var(--negro-400); padding: 1px 5px; }
  .nota { margin-top: auto; font-size: 11px; line-height: 1.3; color: var(--tinta-secundaria); }

  /* Sin borde dorado: la insignia es la que trae el acento ahora. Dos gestos de oro
     en el mismo bloque compiten y ninguno significa nada. */
  .diferenciadores { display: grid; gap: var(--e-6); margin-top: var(--e-4); }

  /* Una línea por giro. En móvil van apiladas; a partir de 768 en cuatro columnas,
     como en la referencia. */
  .lineas { display: grid; gap: var(--e-6); margin-top: var(--e-4); }
  /* `1fr` en la fila del medio empuja el botón al fondo, así los cuatro quedan a la
     misma altura aunque las listas midan distinto. Sin esto la retícula se desalinea
     igual que se desalinearon las tarjetas de giro. */
  .lineas li {
    display: grid;
    grid-template-rows: auto auto 1fr auto;   /* foto · insignia · lista · botón */
    gap: var(--e-3);
  }

  .ubicacion { display: grid; gap: var(--e-6); }
  .datos { display: grid; gap: var(--e-3); justify-items: start; }
  .datos p { display: flex; gap: var(--e-2); align-items: flex-start; }

  @media (min-width: 768px) {
    .entrada { grid-template-columns: 1fr 1fr; align-items: center; gap: var(--e-16); }
    .acciones { grid-auto-flow: column; justify-content: start; }
    .reticula { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--e-3); }
    .bloqueados { min-height: 150px; }
    .diferenciadores { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .lineas { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--e-4); }
    .ubicacion { grid-template-columns: 1fr 1fr; align-items: center; gap: var(--e-16); }
  }
</style>

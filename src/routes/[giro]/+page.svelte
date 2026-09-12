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
  import Hueco from '$componentes/Hueco.svelte';
  import Boton from '$componentes/Boton.svelte';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import Migas from '$componentes/Migas.svelte';
  import Icono from '$componentes/Icono.svelte';
  import PorConfirmar from '$componentes/PorConfirmar.svelte';
  import Titular from '$componentes/Titular.svelte';
  import Foto from '$componentes/Foto.svelte';
  import AvisoBorrador from '$componentes/AvisoBorrador.svelte';
  import DatosDelLocal from '$componentes/DatosDelLocal.svelte';
  import Mapa from '$componentes/Mapa.svelte';
  import GaleriaBienes from '$componentes/GaleriaBienes.svelte';
  import TiraPasos from '$componentes/TiraPasos.svelte';
  import MonedasQueCaen from '$componentes/MonedasQueCaen.svelte';
  import Carrusel from '$componentes/Carrusel.svelte';
  import { galeriaInventario } from '$lib/datos/galeria';
  import { girosConstruibles } from '$lib/datos/giros';
  import { negocio } from '$lib/config/negocio';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const giro = $derived(data.giro);
  const otras = $derived(girosConstruibles.filter((g) => g.slug !== giro.slug));
  /* El registro de este giro. Ver ADR-0020: mármol para lo que su marca trata como
     lujo, crema industrial para el resto. Por omisión, industrial. */
  const claro = $derived(giro.registro === 'lujo' ? 'marmol' : 'crema');

  const PREGUNTAS = [
    '¿Aceptan lo que traigo?',
    '¿Cuánto me dan y cuándo?',
    '¿Qué necesito llevar?',
    '¿Dónde están y están abiertos?',
    '¿Puedo recuperar mi bien?'
  ];
  // Sin estado ni JavaScript: <details> nativo. Ver la nota de csr en +layout.ts.
  const PREGUNTAS_FRECUENTES = [
    '¿Qué pasa si no pago a tiempo?',
    '¿Puedo pagar solo los intereses?',
    '¿Cómo recupero mi bien?',
    '¿Qué documento me dan?'
  ];
</script>

<AvisoBorrador />

<div class="migas"><Migas pasos={[{ texto: 'Inicio', href: '/' }, { texto: giro.nombreCorto }]} /></div>

<Seccion etiqueta="LÍNEA DE NEGOCIO">
  <!-- ADR-0007 §4. Sin `segunda`: los nombres de giro son de un renglón —cuatro de
       los siete son una sola palabra— y partirlos para teñir la mitad sería inventar
       un énfasis que nadie autorizó. La segunda tinta espera copy. -->
  <div class="encabezado"><Titular primera={giro.nombre} /></div>
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
  {#if giro.pasosCortos}
    <TiraPasos pasos={giro.pasosCortos} />
  {/if}
  <div class="acciones">
    <BotonWhatsApp origen="giro-{giro.slug}-entrada" />
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
      <Foto nombre={giro.fotoProvisional} alt={giro.fotoAlt ?? ''} provisional={!giro.fotoEsSuya} maxAncho={giro.fotoMaxAncho ?? 1600} prioritaria />
    </div>
  {/if}
  <!-- ADR-0021 · va DESPUÉS de las acciones, nunca antes: lo primero que tiene que
       encontrar alguien con prisa es el botón, no el adorno.
       Del DATO y no del slug, igual que el mármol del ADR-0020: `lujo` es lo que su
       marca trata como valor. Si joyería vuelve, la banda ya la está esperando. -->
  {#if giro.registro === 'lujo'}
    <MonedasQueCaen />
  {/if}
</Seccion>

<Seccion fondo={claro}>
  <h2><span class="num">1</span> {giro.tituloBienes ?? PREGUNTAS[0]}</h2>
  {#if giro.subtituloBienes}
    <p class="entradilla" data-propuesta="true">{giro.subtituloBienes}</p>
  {/if}
  <!-- ADR-0024 · CATÁLOGO VISUAL, no lista de texto. El criterio de aceptación es que
       alguien que solo MIRA las tarjetas entienda qué puede llevar, sin leer.
       La procedencia de cada bien sigue a la vista, ahora en distintivo: lo del
       letrero es casi un hecho, lo deducido es una apuesta que Cristóbal confirma
       o tacha. Eso no se toca mientras esto sea borrador. -->
  {#if giro.bienesPropuestos?.length}
    <GaleriaBienes bienes={giro.bienesPropuestos} giro={giro.slug} />

    <!-- ADR-0025 · EL BLOQUE DE REVISIÓN.
         Los rótulos «EN SU LETRERO», «FOTO DE ARCHIVO» y demás salían en cada tarjeta.
         Son notas para Cristóbal, no interfaz pública, y por decisión de Nadir bajan
         aquí — pero NO se borran: el ADR-0009 obliga a que una foto de banco se sepa,
         y la procedencia de cada bien es lo que permite tachar lo que no sea cierto.
         Tiene el mismo estatus que la banda BORRADOR de arriba: cuando el sitio deje
         de ser borrador, se van los dos juntos. -->
    <aside class="revision">
      <p class="rev-et">SOLO PARA LA REVISIÓN — no va en el sitio publicado</p>
      <p class="nota">
        Esta lista la <strong>dedujimos</strong> de su letrero y de sus publicaciones; el
        cliente no la ha dictado. Si algo no es cierto, se tacha: que el sitio diga que
        aceptan algo que no aceptan es el daño más caro que puede hacer una página.
      </p>
      <ul class="rev-lista">
        {#each giro.bienesPropuestos as bien}
          <li>
            <b>{bien.que}</b>
            · {#if bien.fuente === 'letrero'}está en su letrero{:else if bien.fuente === 'publicacion'}sale de una publicación suya{:else}<strong>DEDUCIDO — sin fuente, confirmar</strong>{/if}
            · {#if !bien.foto}<strong>falta fotografía</strong>{:else if bien.fotoEsSuya}foto suya{:else}foto de archivo, se sustituye{/if}
          </li>
        {/each}
      </ul>
    </aside>
  {:else}
    <ul class="bienes">
      {#each Array(4) as _, i}
        <li data-pendiente="true">
          <span class="ranura-ico" aria-hidden="true"></span>
          <span class="et">BIEN ACEPTADO {i + 1} — PENDIENTE</span>
        </li>
      {/each}
    </ul>
    <p class="nota">
      <strong>De este giro no hay ni una fuente.</strong> Ni el letrero ni las cinco
      publicaciones dicen qué recibe el taller, así que aquí no se dedujo nada: habría
      sido inventar. Lo tiene que dictar el cliente.
    </p>
  {/if}

  <!-- ADR-0024 · EL CTA QUE CONTESTA LA PREGUNTA QUE TRAE LA GENTE.
       Los tres enlaces a WhatsApp que ya había eran genéricos. Quien llega a esta
       página trae UNA pregunta concreta —«¿cuánto me dan por esto?»— y aquí acaba de
       ver la lista de lo que se acepta, que es justo donde le nace la duda. -->
  <aside class="consulta">
    <p class="titulo" data-propuesta="true">¿No sabes si aceptamos lo que traes?</p>
    <p class="dice" data-propuesta="true">Mándanos una foto por WhatsApp y lo vemos.</p>
    <BotonWhatsApp
      origen="giro-{giro.slug}-consulta-foto"
      texto="Enviar foto por WhatsApp"
      mensaje="Hola, quiero saber si aceptan este artículo. Les mando una foto."
    />
  </aside>
</Seccion>

<!-- ADR-0022 · LA RETÍCULA DE FOTOS REALES.
     Va DESPUÉS de la lista de bienes, que es la respuesta a la pregunta; esto la
     ilustra. Y va en el campo oscuro, no en el mármol: el mármol es el registro de
     lujo del ADR-0020 y estas son fotos de maquinaria en un patio de grava. Vestir
     una retroexcavadora de boutique contradice su propia marca. -->
{#if giro.muestraInventario}
  <Seccion etiqueta="SU PATIO Y SU EQUIPO">
    <h2 class="titulo-galeria" data-propuesta="true">Algo de lo que han tenido</h2>
    <Carrusel
      fotos={galeriaInventario}
      etiqueta="Su patio y su equipo"
      nota="Son fotografías de su patio, sacadas de sus propias publicaciones: por eso no llevan rótulo de archivo. NO son una lista de existencias — no sabemos de qué fecha son ni qué sigue ahí, así que lo que haya hoy se pregunta. Los pies de foto los escribimos nosotros mirando la imagen."
    />
  </Seccion>
{/if}

<Seccion>
  <h2><span class="num">2</span> {PREGUNTAS[1]}</h2>
  <!-- ADR-0024 · este párrafo vivía en el hero, entre la tira de pasos y el botón,
       diciendo en prosa lo mismo que la tira dice en tres palabras. Aquí sí describe
       algo: es la entradilla del proceso. -->
  {#if giro.subtitularPropuesto}
    <p class="subtitular" data-propuesta="true">{giro.subtitularPropuesto}</p>
  {:else}
    <Hueco etiqueta="SUBTITULAR — QUÉ RESUELVE, EN DOS RENGLONES" renglones={2} />
  {/if}
  <!-- NINGUNO dice cuánto ni cuándo: eso es cifra y va en el bloque de abajo, que
       sigue bloqueado. Lo que cada paso ASUME está listado en los requerimientos. -->
  <ol class="pasos">
    {#if giro.pasosPropuestos}
      {#each giro.pasosPropuestos as paso, i}
        <li data-propuesta="true">
          <span class="paso-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <p>{paso}</p>
        </li>
      {/each}
    {:else}
      {#each Array(3) as _, i}
        <li><Hueco etiqueta="PASO {i + 1} — QUÉ PASA Y CUÁNTO TARDA" renglones={2} /></li>
      {/each}
    {/if}
  </ol>
  <div class="cifras">
    <p class="et">PORCENTAJE, PLAZO Y TASA</p>
    <PorConfirmar que="ninguna cifra se dibuja sin autorización escrita" />
  </div>
</Seccion>

<Seccion fondo={claro}>
  <h2><span class="num">3</span> {PREGUNTAS[2]}</h2>
  <!-- ADR-0024 · UN bloque y no CUATRO cajas vacías. Medído: ocupaban 591 px en un
       teléfono —una novena parte de la página— para decir cuatro veces lo mismo, y el
       guardia de fugas cazó la cifra con signo que había aquí: hace bien, así atraparía
       una tasa. Sigue siendo
       visible que falta —eso lo exige el contrato— pero cuesta un décimo. -->
  <div class="requisitos">
    <span class="casilla" aria-hidden="true"></span>
    <Hueco etiqueta="QUÉ HAY QUE LLEVAR — LO DICTA EL CLIENTE" renglones={2} />
  </div>
</Seccion>

<Seccion>
  <h2><span class="num">4</span> {PREGUNTAS[3]}</h2>
  <div class="ubicacion">
    <Mapa />
    <div class="datos">
      <DatosDelLocal />
    </div>
  </div>
</Seccion>

<Seccion fondo={claro}>
  <h2><span class="num">5</span> {PREGUNTAS[4]}</h2>
  <ul class="acordeon">
    {#each PREGUNTAS_FRECUENTES as p, i}
      <li>
        <details open={i === 0}>
          <summary>
            <span>{p}</span>
            <span class="signo" aria-hidden="true"></span>
          </summary>
          <div class="respuesta"><Hueco etiqueta="RESPUESTA" renglones={2} /></div>
        </details>
      </li>
    {/each}
  </ul>
</Seccion>

<Seccion etiqueta="OTRAS LÍNEAS DEL GRUPO">
  <!-- AQUÍ HABÍA OTRA: «Sin estos enlaces cada página queda aislada y el multigiro
       no reparte autoridad.» Es la justificación SEO del bloque, escrita para el
       equipo y publicada por accidente. El visitante no necesita que le expliquen
       por qué hay enlaces: necesita los enlaces. La razón vive en el ADR-0003. -->
  <ul class="cruzados">
    {#each otras as g}
      <li><a href="/{g.slug}/"><Icono nombre={g.icono} tam={20} /> {g.nombre}</a></li>
    {/each}
  </ul>
</Seccion>

<style>
  .migas { padding: 0 var(--margen-lateral); background: var(--superficie); }
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
    background: var(--oro-500); color: var(--negro-950); font-size: 15px; line-height: 1;
  }
  .foto-giro { margin-top: var(--e-4); }
  .acciones { display: grid; gap: var(--e-3); margin-top: var(--e-4); }
  .nota { font-size: var(--pie-tam); color: var(--tinta-secundaria); margin-top: var(--e-4); }
  .et { font-size: var(--etiqueta-tam); font-weight: var(--etiqueta-peso); letter-spacing: var(--etiqueta-tracking); color: var(--tinta-secundaria); }

  .bienes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--e-2); }
  .bienes li {
    position: relative; isolation: isolate; overflow: hidden;
    display: grid; gap: var(--e-2); min-height: 96px; padding: var(--e-3);
    background: var(--superficie); border: 1px solid var(--panel-borde);
    align-content: start;
  }

  /* Aquí vivían la marca de agua, el destello y las tintas de las tarjetas de bien.
     Todo eso se fue con el ADR-0024: esas tarjetas ahora son fotografía y su CSS vive
     en `GaleriaBienes.svelte`. El destello sigue en la portada, vía `Tarjeta.svelte`;
     sobre una fotografía se leía a efecto y el brief pide justo evitar eso.
     Lo que queda abajo lo usa el hueco de «pendiente», que sí sigue en pie. */
  .ranura-ico { width: 26px; height: 26px; border: 1px dashed var(--panel-borde); background: var(--negro-900); }

  /* Entradilla de la sección de bienes · ADR-0024. Una sola frase que lleva la
     promesa —«te decimos cuánto»— antes de la retícula. */
  .entradilla {
    max-width: 46ch;
    margin: calc(var(--e-2) * -1) 0 var(--e-4);
    font-size: var(--cuerpo-tam);
    line-height: 1.5;
    color: var(--tinta-secundaria);
  }

  /* La promesa del hero · ADR-0024. Grande, pero por debajo del h1. */
  .promesa {
    max-width: 20ch;
    margin: var(--e-3) 0 0;
    font-size: 1.5rem;
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--tinta);
  }

  /* El bloque de revisión · ADR-0025. Deliberadamente sobrio y sin gracia: no es
     producto, es un recado para Cristóbal. Se va con la banda BORRADOR. */
  .revision {
    margin-top: var(--e-6);
    padding: var(--e-3) var(--e-4);
    border: 1px dashed var(--panel-borde);
    background: var(--superficie-alterna);
  }
  .rev-et {
    margin: 0 0 var(--e-2);
    font-size: var(--etiqueta-tam);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    color: var(--tinta-secundaria);
  }
  .rev-lista {
    margin: var(--e-3) 0 0;
    padding-left: var(--e-4);
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--tinta-secundaria);
  }

  /* El bloque de consulta por WhatsApp · ADR-0024. */
  .consulta {
    margin-top: var(--e-6);
    padding: var(--e-4);
    background: var(--panel);
    border: 1px solid var(--panel-borde);
    /* La arista del ADR-0007 §5, la misma del botón primario. */
    border-left: 3px solid var(--oro-500);
  }
  .consulta .titulo {
    margin: 0;
    font-size: var(--cuerpo-tam);
    font-weight: var(--cuerpo-fuerte-peso);
    line-height: 1.3;
    color: var(--tinta);
  }
  .consulta .dice {
    margin: var(--e-1) 0 var(--e-3);
    font-size: var(--cuerpo-tam);
    line-height: 1.45;
    color: var(--tinta-secundaria);
  }

  .requisitos {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--e-3);
    align-items: start;
  }

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
  .cifras { border: 1px solid var(--negro-400); padding: var(--e-4); margin-top: var(--e-6); display: grid; gap: var(--e-3); }

  /* La regla de `li` se fue con las cuatro cajas: ahora es UN bloque. La de arriba,
     junto a `.consulta`, es la que manda. */
  .casilla { width: 22px; height: 22px; border: 2px solid var(--borde-campo); border-radius: var(--radio-campo); }

  .ubicacion { display: grid; gap: var(--e-6); }
  .datos { display: grid; gap: var(--e-3); justify-items: start; }
  .datos p { display: flex; gap: var(--e-2); align-items: flex-start; }

  .acordeon li { border-bottom: 1px solid var(--borde-sutil); }
  .acordeon summary {
    display: flex; align-items: center; justify-content: space-between; gap: var(--e-3);
    min-height: 56px; padding: var(--e-3) var(--e-1);
    cursor: pointer; list-style: none;
    font-weight: var(--cuerpo-fuerte-peso);
  }
  .acordeon summary::-webkit-details-marker { display: none; }
  /* El signo se dibuja con CSS: dos trazos que se cruzan y uno se esconde al abrir. */
  .signo { position: relative; width: 22px; height: 22px; flex-shrink: 0; }
  .signo::before, .signo::after {
    content: ''; position: absolute; background: var(--tinta);
    left: 50%; top: 50%; transform: translate(-50%, -50%);
  }
  .signo::before { width: 16px; height: 2px; }
  .signo::after { width: 2px; height: 16px; transition: opacity var(--mov-tactil) var(--mov-curva); }
  details[open] .signo::after { opacity: 0; }
  .respuesta { padding: 0 var(--e-1) var(--e-4); }

  .cruzados { display: grid; gap: var(--e-2); margin-top: var(--e-4); }
  .cruzados a {
    display: flex; align-items: center; gap: var(--e-2);
    min-height: var(--tactil); padding: 0 var(--e-4);
    background: var(--superficie); border: 1px solid var(--negro-400);
    font-weight: var(--cuerpo-fuerte-peso);
  }
  .cruzados a:hover { border-color: var(--negro-950); }

  @media (min-width: 768px) {
    .acciones { grid-auto-flow: column; justify-content: start; }
    .bienes { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .ubicacion { grid-template-columns: 1fr 1fr; align-items: center; gap: var(--e-16); }
    .cruzados { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }
</style>

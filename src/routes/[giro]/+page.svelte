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
  import Destello from '$componentes/Destello.svelte';
  import { girosConstruibles } from '$lib/datos/giros';
  import { negocio } from '$lib/config/negocio';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const giro = $derived(data.giro);
  const otras = $derived(girosConstruibles.filter((g) => g.slug !== giro.slug));

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
  {#if giro.subtitularPropuesto}
    <p class="subtitular" data-propuesta="true">{giro.subtitularPropuesto}</p>
  {:else}
    <Hueco etiqueta="SUBTITULAR — QUÉ RESUELVE, EN DOS RENGLONES" renglones={2} />
  {/if}
  <!-- ADR-0009. Las páginas de giro NO tenían ranura de foto: el CLAUDE.md pedía
       «fachada y una por giro» y solo existía la de la portada. Aquí se abre, con
       foto de archivo provisional y rotulada. -->
  {#if giro.fotoProvisional}
    <div class="foto-giro">
      <Foto nombre={giro.fotoProvisional} alt={giro.fotoAlt ?? ''} provisional={!giro.fotoEsSuya} maxAncho={giro.fotoMaxAncho ?? 1600} />
    </div>
  {/if}
  <div class="acciones">
    <BotonWhatsApp origen="giro-{giro.slug}-entrada" />
    <Boton variante="secundario" href="/contacto/">
      <Icono nombre="telefono" tam={20} grosor={1.9} /> Llamar
    </Boton>
  </div>
</Seccion>

<Seccion fondo="crema">
  <h2><span class="num">1</span> {PREGUNTAS[0]}</h2>
  <!-- DEDUCIDO, no dictado. Cada renglón dice de dónde sale, y esa es la parte que
       hace esto corregible de un vistazo: lo del letrero es casi un hecho, lo
       deducido es una apuesta nuestra. -->
  {#if giro.bienesPropuestos?.length}
    <ul class="bienes">
      {#each giro.bienesPropuestos as bien, i}
        <li data-propuesta="true" class:apuesta={bien.fuente === 'deducido'}>
          <!-- MARCA DE AGUA · el ícono del bien, grande y tenue al fondo.
               `aria-hidden`: no aporta nada a quien no ve la pantalla — el nombre
               del bien ya está escrito al lado, y anunciar «imagen de una moneda»
               antes de «Monedas» solo estorba. -->
          <span class="agua" aria-hidden="true"><Icono nombre={bien.icono} tam={96} grosor={1.1} /></span>
          <Destello indice={i} />
          <span class="que">{bien.que}</span>
          <span class="fuente">
            {#if bien.fuente === 'letrero'}Está en su letrero
            {:else if bien.fuente === 'publicacion'}Sale de una publicación suya
            {:else}DEDUCIDO — sin fuente, confirmar{/if}
          </span>
        </li>
      {/each}
    </ul>
    <p class="nota">
      Esta lista la <strong>dedujimos</strong> de su letrero y de sus publicaciones; el
      cliente no la ha dictado. Cada renglón dice de dónde sale. Si algo no es cierto,
      se tacha: que el sitio diga que aceptan algo que no aceptan es el daño más caro
      que puede hacer una página.
    </p>
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
</Seccion>

<Seccion>
  <h2><span class="num">2</span> {PREGUNTAS[1]}</h2>
  <!-- NINGUNO dice cuánto ni cuándo: eso es cifra y va en el bloque de abajo, que
       sigue bloqueado. Lo que cada paso ASUME está listado en los requerimientos. -->
  <ol class="pasos">
    {#if giro.pasosPropuestos}
      {#each giro.pasosPropuestos as paso, i}
        <li data-propuesta="true">
          <span class="paso-num">{i + 1}</span>
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

<Seccion fondo="crema">
  <h2><span class="num">3</span> {PREGUNTAS[2]}</h2>
  <ul class="requisitos">
    {#each Array(4) as _, i}
      <li>
        <span class="casilla" aria-hidden="true"></span>
        <Hueco etiqueta="REQUISITO {i + 1}" renglones={1} />
      </li>
    {/each}
  </ul>
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

<Seccion fondo="crema">
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

  /* ── LA MARCA DE AGUA ────────────────────────────────────────────────────
     Sale por la esquina inferior derecha, recortada por el `overflow`. Va detrás
     del texto con `z-index: -1` y no toca el contraste: el texto sigue midiéndose
     contra `--superficie`, que es opaca. */
  .agua {
    position: absolute; right: -18px; bottom: -22px; z-index: -1;
    color: var(--oro-texto); opacity: 0.13;
    pointer-events: none; line-height: 0;
  }
  .apuesta .agua { opacity: 0.09; }   /* lo deducido pesa menos, también de fondo */

  /* El destello vive en «Destello.svelte» desde que se pidió también para las
     tarjetas de la portada. Aquí quedaban veinte líneas de CSS que habrían sido la
     segunda copia, y dos copias se separan en cuanto alguien ajusta una.
     Lo que esta tarjeta SÍ tiene que aportar es el contenedor —«position»,
     «overflow» e «isolation»—, arriba en «.bienes li». */
  /* Lo deducido se marca: borde punteado, el mismo lenguaje de «esto falta». */
  .bienes li.apuesta { border-style: dashed; border-color: var(--oro-700); }
  .que { font-size: var(--cuerpo-tam); font-weight: var(--cuerpo-fuerte-peso); line-height: 1.25; }
  .fuente {
    font-size: var(--etiqueta-tam); line-height: var(--etiqueta-alto);
    letter-spacing: var(--etiqueta-tracking); color: var(--tinta-secundaria);
  }
  /* `--oro-texto` y no `--oro-500`: el 500 sobre un panel claro da 1.87:1 y deja de
     ser texto. Es la misma bomba de relojería de siempre —un color literal escrito en
     un componente— y esta vez la destapó el registro claro del ADR-0019. */
  .apuesta .fuente { color: var(--oro-texto); }
  .ranura-ico { width: 26px; height: 26px; border: 1px dashed var(--panel-borde); background: var(--negro-900); }

  .pasos { display: grid; gap: var(--e-4); }
  .pasos li {
    display: grid; grid-template-columns: auto 1fr; gap: var(--e-3); align-items: start;
    border-left: 2px solid var(--oro-500); padding-left: var(--e-3);
  }
  .paso-num {
    flex-shrink: 0; width: 26px; height: 26px; border-radius: var(--radio-pastilla);
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--oro-500); color: var(--tinta-sobre-accion);
    font-size: var(--pie-tam); font-weight: var(--etiqueta-peso); line-height: 1;
  }
  .subtitular { font-size: var(--cuerpo-tam); line-height: var(--cuerpo-alto); color: var(--tinta-suave); }
  .cifras { border: 1px solid var(--negro-400); padding: var(--e-4); margin-top: var(--e-6); display: grid; gap: var(--e-3); }

  .requisitos { display: grid; }
  .requisitos li { display: grid; grid-template-columns: auto 1fr; gap: var(--e-3); align-items: start; padding: var(--e-4) 0; border-top: 1px solid var(--borde-sutil); }
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

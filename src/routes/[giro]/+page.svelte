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
  import RanuraImagen from '$componentes/RanuraImagen.svelte';
  import Boton from '$componentes/Boton.svelte';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import Migas from '$componentes/Migas.svelte';
  import Icono from '$componentes/Icono.svelte';
  import PorConfirmar from '$componentes/PorConfirmar.svelte';
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

<svelte:head>
  <title>{giro.nombre} · {negocio.nombreComercial} VALUADORES</title>
  <meta name="description" content="__POR_CONFIRMAR__ · descripción de {giro.nombre}" />
</svelte:head>

<div class="migas"><Migas pasos={[{ texto: 'Inicio', href: '/' }, { texto: giro.nombreCorto }]} /></div>

<Seccion etiqueta="LÍNEA DE NEGOCIO">
  <h1>{giro.nombre}</h1>
  <Hueco etiqueta="SUBTITULAR — QUÉ RESUELVE, EN DOS RENGLONES" renglones={2} />
  <div class="acciones">
    <BotonWhatsApp origen="giro-{giro.slug}-entrada" />
    <Boton variante="secundario" href="/contacto/">
      <Icono nombre="telefono" tam={20} grosor={1.9} /> Llamar
    </Boton>
  </div>
</Seccion>

<Seccion fondo="crema">
  <h2><span class="num">1</span> {PREGUNTAS[0]}</h2>
  <ul class="bienes">
    {#each Array(6) as _, i}
      <li>
        <span class="ranura-ico" aria-hidden="true"></span>
        <span class="et">BIEN ACEPTADO {i + 1} — PENDIENTE</span>
      </li>
    {/each}
  </ul>
  <p class="nota">
    La lista real la da el cliente. Aquí no se inventa ni un bien: si el sitio dice que
    aceptan algo que no aceptan, el visitante llega, se va, y no vuelve.
  </p>
</Seccion>

<Seccion>
  <h2><span class="num">2</span> {PREGUNTAS[1]}</h2>
  <ol class="pasos">
    {#each Array(3) as _, i}
      <li><Hueco etiqueta="PASO {i + 1} — QUÉ PASA Y CUÁNTO TARDA" renglones={2} /></li>
    {/each}
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
    <RanuraImagen relacion="4 / 3" etiqueta="MAPA — SE DIBUJA AL CERRAR D-08" />
    <div class="datos">
      <p><Icono nombre="mapa" tam={20} /> <PorConfirmar que="dirección exacta" decision="D-08" /></p>
      <p><Icono nombre="reloj" tam={20} /> <PorConfirmar que="horarios de cada día" decision="D-08" /></p>
      <Boton variante="secundario" href="/contacto/" anchoCompleto={false}>Cómo llegar</Boton>
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
  <p class="nota">Sin estos enlaces cada página queda aislada y el multigiro no reparte autoridad.</p>
  <ul class="cruzados">
    {#each otras as g}
      <li><a href="/{g.slug}/"><Icono nombre={g.icono} tam={20} /> {g.nombre}</a></li>
    {/each}
  </ul>
</Seccion>

<style>
  .migas { padding: 0 var(--margen-lateral); background: var(--superficie); }
  h1 { font-size: var(--h1-tam); line-height: var(--h1-alto); font-weight: var(--h1-peso); margin-bottom: var(--e-4); }
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
  .acciones { display: grid; gap: var(--e-3); margin-top: var(--e-4); }
  .nota { font-size: var(--pie-tam); color: var(--tinta-secundaria); margin-top: var(--e-4); }
  .et { font-size: var(--etiqueta-tam); font-weight: var(--etiqueta-peso); letter-spacing: var(--etiqueta-tracking); color: var(--tinta-secundaria); }

  .bienes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--e-2); }
  .bienes li { display: grid; gap: var(--e-2); min-height: 96px; padding: var(--e-3); background: var(--superficie); border: 1px solid var(--negro-400); align-content: start; }
  .ranura-ico { width: 26px; height: 26px; border: 1px dashed var(--negro-400); background: var(--negro-100); }

  .pasos { display: grid; gap: var(--e-4); }
  .pasos li { border-left: 2px solid var(--oro-500); padding-left: var(--e-3); }
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

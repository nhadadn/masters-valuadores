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
  import BandaDiagonal from '$componentes/BandaDiagonal.svelte';
  import PorConfirmar from '$componentes/PorConfirmar.svelte';
  import Titular from '$componentes/Titular.svelte';
  import AvisoBorrador from '$componentes/AvisoBorrador.svelte';
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

<svelte:head>
  <title>{negocio.nombreComercial} VALUADORES · __POR_CONFIRMAR__</title>
  <meta name="description" content="__POR_CONFIRMAR__ · descripción de la portada, no se inventa" />
</svelte:head>

<AvisoBorrador />

<Seccion etiqueta="GRUPO MÁSTER · TORREÓN, COAHUILA">
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
        <BotonWhatsApp origen="portada-entrada" />
        <Boton variante="secundario" href="/contacto/">
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
         números están en `BandaDiagonal.svelte` y en la SPEC-0002.

         Vuelve aquí el día que exista la foto de la fachada, que es cuando habrá algo
         que cortar. Ver D-06 y el hueco de la fachada. -->
    <RanuraImagen relacion="16 / 9" etiqueta="FOTO — FACHADA DEL LOCAL, DE DÍA, CON EL LETRERO LEGIBLE" />
  </div>
</Seccion>

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
  <Hueco etiqueta="TÍTULO DE SECCIÓN — UNA LÍNEA" renglones={1} como="h2" />
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
    <RanuraImagen relacion="4 / 3" etiqueta="MAPA — NO SE DIBUJA HASTA CERRAR D-08" />
    <div class="datos">
      <p><Icono nombre="mapa" tam={20} /> <PorConfirmar que="calle, número, colonia y CP" decision="D-08" /></p>
      <p><Icono nombre="reloj" tam={20} /> <PorConfirmar que="horarios de cada día" decision="D-08" /></p>
      <Boton variante="secundario" href="/contacto/" anchoCompleto={false}>Cómo llegar</Boton>
    </div>
  </div>
</Seccion>

<!-- ADR-0007 §1. LA ÚNICA diagonal del sitio. Entra a la sección oscura, que es la
     única masa oscura y alta que hay hoy en la portada: 30° de la vertical necesitan
     alto, y el oro sobre negro da 11.12:1. Si alguien la repite en otra pantalla, deja
     de ser un gesto y pasa a ser ruido. -->
<BandaDiagonal />

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
  .subtitular {
    font-size: var(--cuerpo-tam);
    line-height: var(--cuerpo-alto);
    color: var(--tinta-secundaria);
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
    border: 1px dashed var(--negro-400); background: var(--crema-050);
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

  .ubicacion { display: grid; gap: var(--e-6); }
  .datos { display: grid; gap: var(--e-3); justify-items: start; }
  .datos p { display: flex; gap: var(--e-2); align-items: flex-start; }

  @media (min-width: 768px) {
    .entrada { grid-template-columns: 1fr 1fr; align-items: center; gap: var(--e-16); }
    .acciones { grid-auto-flow: column; justify-content: start; }
    .reticula { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--e-3); }
    .bloqueados { min-height: 150px; }
    .diferenciadores { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .ubicacion { grid-template-columns: 1fr 1fr; align-items: center; gap: var(--e-16); }
  }
</style>

<script lang="ts">
  /**
   * «DÓNDE ESTAMOS» como lienzo partido · ADR-0051.
   *
   * ── QUÉ ES ────────────────────────────────────────────────────────────────
   * Un solo objeto en dos mitades pegadas:
   *   · EL LIENZO: la marca que ya usa la cabecera —el monograma plano y MASTER
   *     VALUADORES— en grande sobre acero pavonado, con «Ver el mapa» dentro. Al tocarlo,
   *     el mapa de Google se abre encima, en el mismo hueco.
   *   · LA FICHA: dirección, horarios y «Cómo llegar», de `DatosDelLocal`.
   * En teléfono van una bajo la otra; desde 768 px, lado a lado.
   *
   * Vivía repetido a mano en la portada, en contacto y en la plantilla de línea, cada
   * copia con su propio CSS de rejilla. Ahora es uno.
   *
   * ── POR QUÉ EL LOGO Y NO LA FACHADA ───────────────────────────────────────
   * Lo eligió Nadir entre la foto del local y la marca. Lo que se pierde, dicho: con el
   * logo nadie reconoce el local desde la calle, que es lo que la fachada sí daba. Lo
   * que se gana: presencia de marca y cero bytes de foto.
   *
   * Y POR QUÉ ESTE LOGO Y NO EL DE LAS BANDERAS. El «rugged con banderas» fue una
   * propuesta y se descartó con tres documentos: el ADR-0004 dejó fuera del sitio los
   * tratamientos que no son el plano, el ADR-0001 sacó las banderas de la marca porque
   * «anclan la marca a comercio transfronterizo», y el ADR-0018 fijó la grafía MASTER.
   *
   * ── EL TÍTULO ES OPCIONAL ─────────────────────────────────────────────────
   * La portada y contacto lo traen. La página de línea no: ya tiene su pregunta numerada
   * encima, «¿Dónde están?», como el resto de sus secciones.
   *
   * ── LA FRANJA · ADR-0059 ──────────────────────────────────────────────────
   * En las páginas de línea esto es el penúltimo bloque, y el pie —justo debajo— ya trae
   * dirección, referencia, horario, teléfono y «Cómo llegar». Medido a 390 px: 704 px de
   * sección más 573 de pie diciendo lo mismo, el 53 % de la página de taller.
   *
   * Con `franja` se queda lo que el pie NO tiene —el mapa, dentro del lienzo— y lo que
   * se busca con prisa: la dirección y el botón. El lienzo baja de 4:3 a un alto fijo y el
   * horario se queda solo en el pie. Portada y contacto siguen con la versión completa.
   */
  import { negocio } from '$lib/config/negocio';
  import Monograma from './Monograma.svelte';
  import ReglaDorada from './ReglaDorada.svelte';
  import Mapa from './Mapa.svelte';
  import DatosDelLocal from './DatosDelLocal.svelte';

  interface Props {
    titulo?: string;
    conTelefono?: boolean;
    /** La versión corta de las páginas de línea · ADR-0059. */
    franja?: boolean;
  }
  let { titulo, conTelefono = false, franja = false }: Props = $props();
</script>

<div class="ubicacion" class:con-titulo={!!titulo} class:franja>
  {#if titulo}
    <!-- Etiqueta de sección: el CLAUDE.md la permite redactar. No afirma nada del negocio. -->
    <h2 class="titulo" data-propuesta="true">{titulo}</h2>
  {/if}

  <div class="lienzo registro-oscuro">
    <!-- `aria-hidden`: la marca ya se anuncia en la cabecera de cada página. Aquí es
         imagen, no un segundo nombre que leer. -->
    <div class="lockup" aria-hidden="true">
      <Monograma />
      <span class="texto">
        <span class="nombre">{negocio.nombreComercial}</span>
        <span class="bajada">VALUADORES</span>
        <ReglaDorada ancho="completo" />
      </span>
    </div>
    <Mapa />
  </div>

  <div class="ficha">
    <DatosDelLocal {conTelefono} {franja} />
  </div>
</div>

<style>
  .ubicacion { display: grid; grid-template-areas: "lienzo" "ficha"; }
  .con-titulo { grid-template-areas: "titulo" "lienzo" "ficha"; }

  .titulo {
    grid-area: titulo;
    margin-bottom: var(--e-4);
    font-size: var(--h2-tam);
    line-height: var(--h2-alto);
    font-weight: var(--h2-peso);
    text-wrap: balance;
  }

  /* EL LIENZO. Es el contenedor posicionado del mapa: `Mapa` abre su marco en absoluto
     contra él. El alto lo pone aquí la proporción, y por eso abrir el mapa no mueve nada. */
  .lienzo {
    grid-area: lienzo;
    position: relative;
    display: grid;
    grid-template-rows: 1fr auto;
    aspect-ratio: 4 / 3;
    color: var(--tinta);
    background-color: var(--pavonado-peor);
    background-image: var(--pavonado);
    background-size: var(--pavonado-tam);
    background-repeat: var(--pavonado-repeticion);
    /* Sobre acero oscuro el anillo de la casa, negro-950, no se ve. */
    --foco-color: var(--blanco);
  }

  /* EL LOCKUP DE LA CABECERA, EN GRANDE. Misma proporción entre nombre y bajada que
     arriba —19 a 9—. La bajada nunca baja de 19 px en peso 700: así cuenta como texto
     grande y el oro sobre el peor punto del pavonado, 4.0:1, cumple su piso de 3:1. */
  .lockup {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--e-4);
    padding: var(--e-6) var(--e-4) 0;
  }
  .lockup :global(svg) { width: 72px; height: 72px; flex-shrink: 0; }
  .texto { display: flex; flex-direction: column; gap: 6px; }
  .nombre { font-size: 40px; font-weight: 700; letter-spacing: 0.03em; line-height: 1; color: var(--blanco); }
  .bajada { font-size: 19px; font-weight: 700; letter-spacing: 0.2em; line-height: 1; color: var(--oro-500); }

  /* LA FICHA, pegada al lienzo. La regla dorada es la costura entre las dos mitades. */
  .ficha {
    grid-area: ficha;
    padding: var(--e-6) var(--e-4);
    background: var(--panel);
    border-top: var(--regla-dorada) solid var(--oro-500);
  }

  /* LADO A LADO desde 768. Con título, el título encabeza la mitad de la ficha y la
     costura dorada sube con él. */
  @media (min-width: 768px) {
    .ubicacion { grid-template-columns: 1fr 1fr; grid-template-areas: "lienzo ficha"; }
    .con-titulo { grid-template-rows: auto 1fr; grid-template-areas: "lienzo titulo" "lienzo ficha"; }
    .lienzo { aspect-ratio: auto; min-height: 360px; }
    .ficha { padding: var(--e-8) var(--e-6); }
    .con-titulo .titulo {
      margin: 0;
      padding: var(--e-8) var(--e-6) 0;
      background: var(--panel);
      border-top: var(--regla-dorada) solid var(--oro-500);
    }
    .con-titulo .ficha { border-top: 0; padding-top: var(--e-4); }
  }

  @media (min-width: 1024px) {
    .ubicacion { grid-template-columns: 1.15fr 1fr; }
    .lienzo { min-height: 400px; }
    .ficha { padding-inline: var(--e-8); }
    .con-titulo .titulo { padding-inline: var(--e-8); }
    .lockup { gap: 28px; padding: var(--e-12) var(--e-8) 0; }
    .lockup :global(svg) { width: 120px; height: 120px; }
    .texto { gap: 10px; }
    .nombre { font-size: 64px; }
    .bajada { font-size: 30px; }
  }

  /* ── LA FRANJA · ADR-0059 ────────────────────────────────────────────────
     El lienzo deja la proporción 4:3 —263 px de alto a 390, medido— por un alto que
     solo tiene que alojar la marca y «Ver el mapa». La marca NO se encoge: la bajada
     en oro necesita sus 19 px en peso 700 para contar como texto grande (ver arriba). */
  .franja .lienzo { aspect-ratio: auto; min-height: 190px; }
  @media (min-width: 768px) {
    .franja .lienzo { min-height: 240px; }
  }
  @media (min-width: 1024px) {
    .franja .lienzo { min-height: 280px; }
    .franja .lockup { padding-top: var(--e-8); }
  }
</style>

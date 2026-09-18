<script lang="ts">
  /**
   * Dirección, horarios y cómo llegar · el bloque «DÓNDE ESTAMOS».
   *
   * Existe porque el mismo bloque estaba repetido a mano en tres pantallas —portada,
   * contacto y cada página de giro— y cada copia escribía sus propios `PorConfirmar`.
   * Al cerrarse D-08 había que tocar las tres, y la cuarta que alguien añada se
   * olvidaría. Ahora hay uno.
   *
   * NADA SE ESCRIBE AQUÍ. La dirección y los horarios los formatea `negocio.ts`, para
   * que el sitio entero enseñe la misma dirección con las mismas palabras: la
   * consistencia exacta del NAP es uno de los factores de posicionamiento local que
   * se están cuidando, y tres redacciones distintas la rompen.
   *
   * `data-negocio` declara la procedencia de cada cifra ante el guardia de fugas.
   * Ver la nota en `herramientas/validar-a11y.mjs`.
   *
   * ── LA FICHA DEL LIENZO · ADR-0051 ────────────────────────────────────────
   * Vive dentro de `Ubicacion`, pegada al lienzo de la marca. Tres cosas cambiaron, las
   * tres medidas en el sitio publicado antes de tocar:
   *   · Los horarios eran filas flexibles con el día a `10ch`, y «Lunes a viernes» pasa
   *     de 10: su hora empezaba 21 px más a la derecha que las de sábado y domingo. Ahora
   *     son una lista de definición en rejilla, con la columna al día más largo.
   *   · «Cómo llegar» era texto subrayado con el espaciado de las etiquetas —2.04 px en
   *     minúsculas de 17 px— y una ↗ que el iPhone pinta como emoji. Ahora es el botón
   *     primario de la casa, con la flecha dibujada.
   *   · La dirección sube a título de pieza: es lo que se va a buscar.
   */
  import {
    negocio, sucursalPrincipal, estaConfirmado, direccionCompleta, horariosLegibles
  } from '$lib/config/negocio';
  import Icono from './Icono.svelte';
  import Boton from './Boton.svelte';
  import PorConfirmar from './PorConfirmar.svelte';

  interface Props {
    /** Contacto lo muestra; la portada y los giros ya lo tienen en la banda. */
    conTelefono?: boolean;
    /**
     * La ficha de la franja · ADR-0059. En las páginas de línea el pie, justo debajo, ya
     * dice el horario: aquí no se repite, y la dirección baja a cuerpo en peso fuerte.
     */
    franja?: boolean;
  }
  let { conTelefono = false, franja = false }: Props = $props();

  const direccion = $derived(direccionCompleta());
  const horarios = $derived(horariosLegibles());
  const mapa = $derived(sucursalPrincipal.mapaUrl);
  const tel = $derived(sucursalPrincipal.telefono);
  const otrasLineas = $derived(sucursalPrincipal.telefonosDeLinea ?? []);
  /* ADR-0058 · la referencia va junto a la dirección; el correo, con el teléfono. */
  const referencia = $derived(sucursalPrincipal.referencia);
  const correo = $derived(negocio.correo);
</script>

<div class="datos" class:franja>
  <div class="linea">
    <Icono nombre="mapa" tam={20} />
    {#if estaConfirmado(direccion)}
      <div>
        <p class="direccion" data-negocio="direccion">{direccion}</p>
        {#if estaConfirmado(referencia)}<p class="referencia" data-negocio="referencia">{referencia}</p>{/if}
      </div>
    {:else}
      <PorConfirmar que="calle, número, colonia y CP" decision="D-08" />
    {/if}
  </div>

  <!-- EL HORARIO NO VA EN LA FRANJA · ADR-0059: el pie de la misma pantalla lo dice. -->
  {#if !franja}
    <div class="linea">
      <Icono nombre="reloj" tam={20} />
      {#if estaConfirmado(horarios)}
        <dl class="horarios" data-negocio="horarios">
          {#each horarios as h}
            <dt class="dias">{h.dias}</dt>
            <dd class="horas" class:cerrado={h.cerrado}>{h.horas}</dd>
          {/each}
        </dl>
      {:else}
        <PorConfirmar que="horarios de cada día" decision="D-08" />
      {/if}
    </div>
  {/if}

  {#if conTelefono}
    <div class="linea">
      <Icono nombre="telefono" tam={20} />
      {#if estaConfirmado(tel)}
        <a class="telefono" href="tel:{String(tel).replace(/\s/g, '')}" data-negocio="telefono">{tel}</a>
      {:else}
        <PorConfirmar que="teléfono y WhatsApp" decision="D-08" />
      {/if}
    </div>

    {#if estaConfirmado(correo)}
      <div class="linea">
        <Icono nombre="correo" tam={20} />
        <a class="correo" href="mailto:{correo}" data-negocio="correo">{correo}</a>
      </div>
    {/if}

    <!-- UN TELÉFONO POR LÍNEA, si alguna lo tiene. Hoy ninguna · ADR-0047: el de joyería
         salió cuando el cliente acotó su oferta a cinco líneas. -->
    {#each otrasLineas as l}
      {#if estaConfirmado(l.telefono)}
        <div class="linea">
          <Icono nombre="telefono" tam={20} />
          <span>
            <a class="telefono" href="tel:{String(l.telefono).replace(/\s/g, '')}" data-negocio="telefono">{l.telefono}</a>
            <span class="cual">{l.linea}{l.nota ? ` · ${l.nota}` : ''}</span>
          </span>
        </div>
      {/if}
    {/each}
  {/if}

  {#if estaConfirmado(mapa)}
    <!-- Enlace, no mapa incrustado. Abre la app de mapas del teléfono —que es lo que la
         persona con prisa iba a hacer de todas formas— y cuesta cero bytes. El mapa
         dibujado vive aparte, en el lienzo, y solo se carga si alguien lo pide. -->
    <Boton href={mapa} externo>
      <Icono nombre="ir" tam={20} grosor={2} />
      Cómo llegar
    </Boton>
  {/if}
</div>

<style>
  .datos { display: grid; gap: var(--e-6); align-content: start; }
  .linea { display: grid; grid-template-columns: 20px 1fr; gap: var(--e-3); align-items: start; }
  .linea > :global(svg) { margin-top: 3px; color: var(--tinta-secundaria); }

  /* Título de pieza: es lo que alguien viene a buscar a esta sección. */
  .direccion {
    font-size: var(--h3-tam);
    line-height: 1.35;
    font-weight: var(--h3-peso);
    color: var(--tinta);
  }
  /* En la franja la dirección baja a cuerpo · ADR-0059: el bloque es un recordatorio al
     final de la página, no la sección que la gente vino a buscar. Sigue en tinta y en
     peso fuerte, un escalón por encima de la referencia. */
  .franja .direccion {
    font-size: var(--cuerpo-tam);
    line-height: var(--cuerpo-alto);
    font-weight: var(--cuerpo-fuerte-peso);
  }

  .horarios {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--e-1) var(--e-4);
    margin: 0;
    font-size: var(--cuerpo-tam);
    line-height: 1.45;
  }
  .dias { color: var(--tinta-secundaria); }
  .horas { margin: 0; font-weight: var(--cuerpo-fuerte-peso); color: var(--tinta); font-variant-numeric: tabular-nums; }
  .horas.cerrado { font-weight: 400; color: var(--tinta-secundaria); }

  /* La referencia para llegar · ADR-0058: debajo de la dirección, en tinta secundaria. */
  .referencia {
    margin-top: var(--e-1);
    font-size: var(--cuerpo-tam);
    line-height: var(--cuerpo-alto);
    color: var(--tinta-secundaria);
  }

  .telefono, .correo {
    display: inline-flex;
    align-items: center;
    min-height: var(--tactil-piso);
    font-weight: var(--cuerpo-fuerte-peso);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .correo { overflow-wrap: anywhere; }
  .cual { display: block; font-size: var(--pie-tam); color: var(--tinta-secundaria); }
</style>

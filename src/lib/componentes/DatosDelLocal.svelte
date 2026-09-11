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
   */
  import {
    sucursalPrincipal, estaConfirmado, direccionCompleta, horariosLegibles
  } from '$lib/config/negocio';
  import Icono from './Icono.svelte';
  import PorConfirmar from './PorConfirmar.svelte';

  interface Props {
    /** Contacto lo muestra; la portada y los giros ya lo tienen en la banda. */
    conTelefono?: boolean;
  }
  let { conTelefono = false }: Props = $props();

  const direccion = $derived(direccionCompleta());
  const horarios = $derived(horariosLegibles());
  const mapa = $derived(sucursalPrincipal.mapaUrl);
  const tel = $derived(sucursalPrincipal.telefono);
  const otrasLineas = $derived(sucursalPrincipal.telefonosDeLinea ?? []);
</script>

<div class="datos">
  <p class="linea">
    <Icono nombre="mapa" tam={20} />
    {#if estaConfirmado(direccion)}
      <span data-negocio="direccion">{direccion}</span>
    {:else}
      <PorConfirmar que="calle, número, colonia y CP" decision="D-08" />
    {/if}
  </p>

  <div class="linea">
    <Icono nombre="reloj" tam={20} />
    {#if estaConfirmado(horarios)}
      <ul class="horarios" data-negocio="horarios">
        {#each horarios as h}
          <li class:cerrado={h.cerrado}>
            <span class="dias">{h.dias}</span>
            <span class="horas">{h.horas}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <PorConfirmar que="horarios de cada día" decision="D-08" />
    {/if}
  </div>

  {#if conTelefono}
    <p class="linea">
      <Icono nombre="telefono" tam={20} />
      {#if estaConfirmado(tel)}
        <a href="tel:{String(tel).replace(/\s/g, '')}" data-negocio="telefono">{tel}</a>
      {:else}
        <PorConfirmar que="teléfono y WhatsApp" decision="D-08" />
      {/if}
    </p>

    <!-- LA JOYERÍA ATIENDE EN OTRO NÚMERO Y CON CITA.
         Sale de la tanda del 11 de septiembre: siete piezas de MÁSTER JOYERÍA con
         un número propio. Va aquí y no en la banda de contacto porque la banda es
         la acción rápida —llamar ya— y esto es lo contrario: pedir una cita. -->
    {#each otrasLineas as l}
      {#if estaConfirmado(l.telefono)}
        <p class="linea">
          <Icono nombre="joyeria" tam={20} />
          <span>
            <a href="tel:{String(l.telefono).replace(/\s/g, '')}" data-negocio="telefono">{l.telefono}</a>
            <span class="cual">{l.linea}{l.nota ? ` · ${l.nota}` : ''}</span>
          </span>
        </p>
      {/if}
    {/each}
  {/if}

  {#if estaConfirmado(mapa)}
    <!-- Enlace, no mapa incrustado. Un iframe de Maps carga un tercero, pone cookies
         de Google en la visita y desplaza la maqueta al montarse. Este abre la app de
         mapas del teléfono —que es lo que la persona con prisa iba a hacer de todas
         formas— y cuesta cero bytes. Si algún día se quiere el mapa dibujado, es una
         decisión aparte y con costo medible. -->
    <p class="linea">
      <a class="comollegar" href={mapa} target="_blank" rel="noopener">
        Cómo llegar <span aria-hidden="true">↗</span>
      </a>
    </p>
  {/if}
</div>

<style>
  .datos { display: grid; gap: var(--e-4); align-content: start; }
  .linea { display: flex; gap: var(--e-3); align-items: start; }
  .linea :global(svg) { flex-shrink: 0; margin-top: 2px; color: var(--oro-texto); }

  .horarios { display: grid; gap: var(--e-1); }
  .horarios li { display: flex; flex-wrap: wrap; gap: var(--e-1) var(--e-3); }
  .dias { min-width: 10ch; color: var(--tinta-secundaria); }
  .horas { font-weight: 700; }
  .cerrado .horas { font-weight: 400; color: var(--tinta-secundaria); }

  .datos a {
    min-height: var(--tactil-piso);
    display: inline-flex;
    align-items: center;
  }
  .cual { display: block; font-size: var(--etiqueta-tam); letter-spacing: var(--etiqueta-tracking); color: var(--tinta-secundaria); }
  .comollegar {
    color: var(--oro-texto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    text-decoration: underline;
    gap: var(--e-1);
  }
</style>

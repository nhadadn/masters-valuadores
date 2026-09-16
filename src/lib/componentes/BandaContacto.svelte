<script lang="ts">
  /**
   * Banda de contacto · ADR-0007 §2.
   *
   * Es un patrón, no un pie cualquiera: fondo negro-950, tinta blanca, teléfono
   * prominente, dirección al lado, cada uno con su insignia circular. Es la tira que
   * cierra las cinco publicaciones del cliente, y es lo primero que alguien busca
   * cuando ya decidió llamar.
   *
   * NI EL TELÉFONO NI LA DIRECCIÓN SE ESCRIBEN AQUÍ. Salen de `negocio.ts` y hoy
   * están sin confirmar (D-08), así que la banda se construye con `PorConfirmar`.
   * En sus piezas el número aparece grande y repetido; en el sitio no aparece hasta
   * que Cristóbal lo dé por escrito. Un número mal puesto es tráfico que se pierde
   * sin que nadie se entere.
   */
  import { sucursalPrincipal, estaConfirmado, direccionCompleta } from '$lib/config/negocio';
  import Insignia from './Insignia.svelte';
  import Icono from './Icono.svelte';
  import PorConfirmar from './PorConfirmar.svelte';

  const tel = $derived(sucursalPrincipal.telefono);
  const listo = $derived(estaConfirmado(tel));
  const direccion = $derived(direccionCompleta());
  const mapa = $derived(sucursalPrincipal.mapaUrl);
</script>

<div class="banda">
  <div class="caja">
    <div class="dato">
      <Insignia icono="telefono" sobreOscuro>
        <p class="et">LLÁMANOS</p>
        {#if listo}
          <!-- `data-negocio` declara que esta cifra SALE DE `negocio.ts` y no de aquí.
               El validador la tolera solo por eso; cualquier otra cifra en la página
               sigue siendo una fuga. Ver la nota del guardia en validar-a11y.mjs. -->
          <p class="numero" data-negocio="telefono">
            <a href="tel:{String(tel).replace(/\s/g, '')}">{tel}</a>
          </p>
        {:else}
          <p class="pendiente"><PorConfirmar que="teléfono" decision="D-08" sobreOscuro /></p>
        {/if}
      </Insignia>
    </div>

    <span class="separador" aria-hidden="true"></span>

    <div class="dato">
      <Insignia icono="mapa" sobreOscuro>
        <p class="et">DÓNDE ESTAMOS</p>
        {#if estaConfirmado(direccion)}
          <!-- `data-negocio`: la dirección SALE de `negocio.ts`. Ver la nota de arriba. -->
          <p class="direccion" data-negocio="direccion">{direccion}</p>
          {#if estaConfirmado(mapa)}
            <!-- Enlace, no iframe. Un mapa incrustado carga un tercero, pone cookies
                 y mueve la maqueta al montarse; este abre la app de mapas del
                 teléfono y cuesta cero bytes. -->
            <p class="comollegar">
              <a href={mapa} target="_blank" rel="noopener">Cómo llegar <Icono nombre="ir" tam={16} grosor={2} /></a>
            </p>
          {/if}
        {:else}
          <p class="pendiente">
            <PorConfirmar que="calle, número, colonia y CP" decision="D-08" sobreOscuro />
          </p>
        {/if}
      </Insignia>
    </div>
  </div>
</div>

<style>
  .banda {
    /* Misma tierra que la sección oscura, no un negro aparte. El pie era negro-900,
       la banda negro-950 y la sección grafito: tres negros distintos pegados. */
    background-color: var(--campo-alto);
    /* SIN RESPLANDOR · ADR-0044. Llevaba `--resplandor-fijo`, un radial de oro al
       0.16 heredado del sitio oscuro. Medido en la página construida: teñía la banda
       hasta **rgb(47,43,28)** por la derecha contra el **rgb(23,23,23)** plano del pie,
       que está pegado debajo. Mismo token, distinto aspecto: una mitad parda y la otra
       negra, con la costura a la vista.
       El propio `tokens.css` ya avisaba de esto para el resplandor claro —«se lee como
       una mancha sucia en vez de como luz»—. Aquí el pie es el ancla y un ancla no
       tiene dos colores. */
    color: var(--tinta-sobre-oscuro);
    /* Superficie oscura: aquí el oro sí puede ser texto, a 11.12:1. */
    --oro-texto: var(--oro-500);
    padding: var(--e-6) var(--margen-lateral);
  }
  .caja {
    max-width: var(--ancho-maximo);
    margin-inline: auto;
    display: grid;
    gap: var(--e-4);
  }
  .et {
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    color: var(--oro-texto);
  }
  /* El teléfono es lo prominente de la banda, como en sus cinco piezas. */
  .numero {
    font-size: var(--h2-tam);
    line-height: var(--h2-alto);
    font-weight: var(--titular-peso);
    letter-spacing: var(--titular-tracking);
  }
  .numero a { display: inline-flex; align-items: center; min-height: var(--tactil); }
  .pendiente { margin-top: var(--e-1); }
  .direccion { margin-top: var(--e-1); color: var(--tinta-sobre-oscuro); }
  /* SIN ESPACIADO DE ETIQUETA · ADR-0051. Llevaba el de las cejas —0.12 em— en un
     enlace en minúsculas, y ese espaciado es solo para las etiquetas de 13 px en
     mayúsculas. Lo mismo que se corrigió en la ficha de «DÓNDE ESTAMOS». */
  .comollegar a {
    display: inline-flex; align-items: center; gap: var(--e-1); min-height: var(--tactil-piso);
    font-size: var(--pie-tam); font-weight: var(--cuerpo-fuerte-peso);
    color: var(--oro-texto);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* El separador vertical de sus piezas. Solo cuando los dos datos van en fila. */
  .separador { display: none; }

  @media (min-width: 768px) {
    .banda { padding-inline: var(--e-12); }
    .caja {
      grid-auto-flow: column;
      justify-content: start;
      align-items: center;
      gap: var(--e-12);
    }
    .separador {
      display: block;
      width: 1px;
      align-self: stretch;
      background: var(--negro-700);
    }
  }
</style>

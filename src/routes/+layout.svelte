<script lang="ts">
  import '../app.css';
  import { dev } from '$app/environment';
  import { grafoSerializado } from '$lib/seo/jsonld';
  import { negocio, sucursalPrincipal, estaConfirmado } from '$lib/config/negocio';
  import { girosConstruibles } from '$lib/datos/giros';
  import Icono from '$componentes/Icono.svelte';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import PorConfirmar from '$componentes/PorConfirmar.svelte';
  import ReglaDorada from '$componentes/ReglaDorada.svelte';
  import BandaContacto from '$componentes/BandaContacto.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  // En dev se deja pasar para poder trabajar. En producción es estricto y truena,
  // salvo que alguien escriba VITE_PENDIENTES_OK=1 a mano para medir o revisar.
  const permisivo = import.meta.env.VITE_PENDIENTES_OK === '1';
  const grafo = grafoSerializado(!dev, permisivo);
  const tel = sucursalPrincipal.telefono;
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${grafo}</` + `script>`}
</svelte:head>

<a class="salto-contenido" href="#contenido">Saltar al contenido</a>

<header>
  <a href="/" class="marca" aria-label="{negocio.nombreComercial} — inicio">
    <svg width="26" height="26" viewBox="0 0 260 258" aria-hidden="true">
      <path fill="var(--oro-500)" d="M0,24 L130,154 L130,220 L46,152 L46,258 L0,258 Z M130,74 L196,8 L244,8 L260,24 L130,154 Z" />
      <path fill="var(--negro-100)" d="M16,8 L64,8 L130,74 L130,154 L0,24 Z M260,24 L260,258 L214,258 L214,152 L130,220 L130,154 Z" />
    </svg>
    <span class="lockup">
      <span class="nombre">{negocio.nombreComercial}</span>
      <span class="bajada">VALUADORES</span>
      <!-- ADR-0007 §6: la regla va BAJO el lockup. La de ENTRE «MASTERS» y
           «VALUADORES», que es la que traen sus cinco piezas, espera al vectorial
           (D-06): no se reconstruye a ojo lo que un archivo va a dar exacto. -->
      <ReglaDorada ancho="completo" />
    </span>
  </a>

  <nav aria-label="Líneas de negocio" class="nav-escritorio">
    {#each girosConstruibles.slice(0, 4) as g}
      <a href="/{g.slug}/">{g.nombreCorto}</a>
    {/each}
    <a href="/contacto/">Contacto</a>
  </nav>

  {#if estaConfirmado(tel)}
    <a class="llamar" href="tel:{String(tel).replace(/\s/g, '')}" aria-label="Llamar">
      <Icono nombre="telefono" tam={22} grosor={1.9} />
    </a>
  {:else}
    <span class="llamar inerte" aria-label="Teléfono por confirmar">
      <Icono nombre="telefono" tam={22} grosor={1.9} />
    </span>
  {/if}
</header>

<main id="contenido">{@render children()}</main>

<footer>
  <!-- ADR-0007 §2. La banda va arriba del pie, no dentro: es lo que alguien busca
       cuando ya decidió llamar, y en sus piezas cierra la composición. -->
  <BandaContacto />
  <div class="regla-pie"><ReglaDorada ancho="completo" /></div>
  <div class="caja">
    <div class="bloque">
      <p class="nombre-pie">{negocio.nombreComercial} VALUADORES</p>
      <p class="dato">Razón social <PorConfirmar que="nombre legal" decision="D-01" sobreOscuro /></p>
    </div>
    <div class="bloque">
      <p class="etiqueta">HORARIOS Y REDES</p>
      <!-- Dirección y teléfono ya no se repiten aquí: viven en la banda de arriba. -->
      <p class="dato"><PorConfirmar que="horarios de cada día" decision="D-08" sobreOscuro /></p>
      <p class="dato"><PorConfirmar que="WhatsApp" decision="D-08" sobreOscuro /></p>
      <p class="dato"><PorConfirmar que="Instagram y Facebook" decision="D-10" sobreOscuro /></p>
    </div>
    <div class="bloque">
      <p class="etiqueta">LÍNEAS</p>
      <ul>
        {#each girosConstruibles as g}<li><a href="/{g.slug}/">{g.nombre}</a></li>{/each}
      </ul>
    </div>
    <div class="bloque">
      <p class="etiqueta">LEGAL</p>
      <ul>
        <li><a href="/aviso-de-privacidad/">Aviso de privacidad</a></li>
        <li><a href="/terminos/">Términos</a></li>
      </ul>
    </div>
  </div>
</footer>

<!-- ADR-0007 §2: la banda de contacto «sirve dos veces: el pie de cada página y la
     barra fija inferior en móvil». Esta es la segunda vez. Misma tierra negro-950,
     misma regla dorada, mismo vocabulario de insignia circular — condensado a lo que
     cabe en una tira: la acción de llamar y la de escribir.
     Es además la única pieza de marca que está SIEMPRE en pantalla. -->
<div class="barra-fija">
  <!-- La insignia aparece SOLO con el teléfono confirmado, y hay que decir por qué.
       Se probó con un anillo apagado mientras D-08 sigue abierta y salió peor en las
       dos cuentas: un anillo gris no aporta marca —era el objetivo del cambio— y le
       robaba 60 px al botón, que a 360 pasaba a envolver en dos renglones dentro de
       una caja de 48. Un adorno que rompe la maqueta no es media pieza: es ruido.
       El patrón queda cableado y aparece en oro el día que entre el número. -->
  {#if estaConfirmado(tel)}
    <a class="llamar-barra" href="tel:{String(tel).replace(/\s/g, '')}" aria-label="Llamar">
      <Icono nombre="telefono" tam={24} grosor={1.8} />
    </a>
  {/if}
  <div class="cta"><BotonWhatsApp variante="barra" origen="barra-fija" sobreOscuro /></div>
</div>

<style>
  header {
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: center; justify-content: space-between; gap: var(--e-4);
    min-height: 56px; padding: 0 var(--margen-lateral);
    background: var(--superficie-oscura); color: var(--tinta-sobre-oscuro);
  }
  .marca { display: flex; align-items: center; gap: var(--e-3); min-height: var(--tactil); }
  .lockup { display: flex; flex-direction: column; gap: 3px; }
  .nombre { font-size: 19px; font-weight: 700; letter-spacing: 0.03em; line-height: 1; }
  .bajada { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; line-height: 1; color: var(--oro-500); }

  .nav-escritorio { display: none; }
  .llamar {
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--tactil); height: var(--tactil);
    border: 2px solid var(--blanco); border-radius: var(--radio-boton);
  }
  .inerte { border-color: var(--negro-500); color: var(--negro-400); }

  /* El pie es el FONDO de la rampa de página, no un bloque aparte · ADR-0010.
     Antes era negro-900 y se leía como un cuarto negro suelto, después de la banda
     (negro-950), la sección oscura (grafito→negro-950) y la barra fija. Ahora el pie
     es el punto más oscuro y la rampa termina donde tiene que terminar. */
  footer {
    background: var(--superficie-oscura); color: var(--tinta-sobre-oscuro);
    --oro-texto: var(--oro-500);   /* superficie oscura: 11.12:1 */
  }
  .regla-pie { background: var(--superficie-oscura); }
  .caja {
    max-width: var(--ancho-maximo); margin-inline: auto; display: grid; gap: var(--e-6);
    padding: var(--e-8) var(--margen-lateral) var(--e-12);
    background: var(--negro-900);   /* un escalón, para que la banda se lea como banda */
  }
  .nombre-pie { font-weight: 700; letter-spacing: 0.03em; }
  .etiqueta {
    font-size: var(--etiqueta-tam); font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking); color: var(--tinta-tenue-oscuro);
    margin-bottom: var(--e-3);
  }
  .dato { margin-top: var(--e-2); }
  footer li a {
    display: block; min-height: var(--tactil-piso);
    display: flex; align-items: center;
    font-size: var(--pie-tam); color: var(--negro-200);
  }
  footer li a:hover { color: var(--blanco); }

  .barra-fija {
    position: sticky; bottom: 0; z-index: 10;
    display: flex; align-items: center; gap: var(--e-3);
    padding: var(--e-2) var(--margen-lateral);
    background: var(--superficie-oscura);
    border-top: var(--regla-dorada) solid var(--oro-500);
    --oro-texto: var(--oro-500);   /* superficie oscura · 11.12:1 */
  }
  .cta { flex: 1; min-width: 0; }
  /* La insignia de la banda, a escala de tira. Anillo dorado sobre negro: 11.12:1.
     48 px de diámetro, que es el objetivo táctil de casa, no un ícono decorado. */
  .llamar-barra {
    flex-shrink: 0;
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--insignia-tam); height: var(--insignia-tam);
    border-radius: var(--radio-pastilla);
    box-shadow: inset 0 0 0 var(--regla-dorada) var(--oro-500);
    color: var(--oro-500);
  }

  @media (min-width: 768px) {
    header { min-height: 76px; padding-inline: var(--e-12); }
    .nav-escritorio { display: flex; align-items: center; }
    .nav-escritorio a {
      display: inline-flex; align-items: center;
      min-height: var(--tactil-piso); padding: 0 var(--e-3);
      font-size: var(--cuerpo-tam);
    }
    .caja { padding-inline: var(--e-12); }
    .caja { grid-template-columns: 1.2fr 1fr 1fr 0.8fr; gap: var(--e-12); }
    .barra-fija { display: none; }   /* en escritorio el contacto vive en el encabezado */
  }
</style>

<script lang="ts">
  import '../app.css';
  import { dev } from '$app/environment';
  import { grafoSerializado } from '$lib/seo/jsonld';
  import { negocio, sucursalPrincipal, estaConfirmado, horariosLegibles } from '$lib/config/negocio';
  import { girosConstruibles } from '$lib/datos/giros';
  import Icono from '$componentes/Icono.svelte';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import PorConfirmar from '$componentes/PorConfirmar.svelte';
  import Meta from '$componentes/Meta.svelte';
  import ReglaDorada from '$componentes/ReglaDorada.svelte';
  import BandaContacto from '$componentes/BandaContacto.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  // En dev se deja pasar para poder trabajar. En producción es estricto y truena,
  // salvo que alguien escriba VITE_PENDIENTES_OK=1 a mano para medir o revisar.
  const permisivo = import.meta.env.VITE_PENDIENTES_OK === '1';
  const grafo = grafoSerializado(!dev, permisivo);
  const tel = sucursalPrincipal.telefono;
  const horarios = horariosLegibles();
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${grafo}</` + `script>`}
</svelte:head>

<!-- Titulo, descripcion, canonica y tarjeta de enlace de TODA pagina · SPEC-0003.
     Va aqui y no en cada ruta: centralizado, una pagina nueva no puede nacer sin
     <head>. Si no esta en el inventario de enlaces.ts, meta.ts truena el build. -->
<Meta />

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

<footer class="registro-oscuro">
  <!-- ADR-0007 §2. La banda va arriba del pie, no dentro: es lo que alguien busca
       cuando ya decidió llamar, y en sus piezas cierra la composición. -->
  <BandaContacto />
  <div class="regla-pie"><ReglaDorada ancho="completo" /></div>
  <div class="caja">
    <div class="bloque">
      <p class="nombre-pie">{negocio.nombreComercial} VALUADORES</p>
    </div>
    <div class="bloque">
      <p class="etiqueta">HORARIOS Y REDES</p>
      <!-- Dirección y teléfono ya no se repiten aquí: viven en la banda de arriba.
           El WhatsApp tampoco: es el mismo número y el botón está siempre en pantalla. -->
      {#if estaConfirmado(horarios)}
        <ul class="horarios" data-negocio="horarios">
          {#each horarios as h}
            <li><span class="dias">{h.dias}</span> <span>{h.horas}</span></li>
          {/each}
        </ul>
      {:else}
        <p class="dato"><PorConfirmar que="horarios de cada día" decision="D-08" sobreOscuro /></p>
      {/if}
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

<!-- WhatsApp persistente en ESCRITORIO · tomado de la referencia. En móvil ese papel
     ya lo hace la barra fija; en escritorio no había nada permanente y el visitante
     que baja se queda sin acción a la vista. Es un enlace, no un widget: cero
     JavaScript. Se oculta por debajo de 768 para no duplicar la barra. -->
<div class="flotante">
  <BotonWhatsApp variante="linea" origen="flotante-escritorio" texto="WhatsApp" />
</div>

<style>
  /* Fija a la ventana, fuera del flujo: no empuja nada y no cambia ningún alto. */
  .flotante { display: none; }

  /* CABECERA · ADR-0028. Deja de ser una barra oscura independiente y se integra con
     la piedra. Superficie CASI sólida y veta muy tenue a propósito: detrás de un menú
     una textura fuerte compite con lo único que ahí importa, que es el logotipo. */
  header {
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: center; justify-content: space-between; gap: var(--e-4);
    min-height: 56px; padding: 0 var(--margen-lateral);
    /* PLANA, sin resplandor · ADR-0030. Llevaba `--marmol-tenue`, que desde el 0030
       ya no tiene veta pero sí un resplandor radial: aclaraba la cabecera por la
       derecha y dejaba un escalón visible contra la franja de migas de debajo.
       Con la piedra concentrada en la entrada, la cabecera no necesita textura.
       BLANCA desde el ADR-0031, como el cuerpo: lo único que la separa de la página
       es su filete inferior, que es lo que hacen las tres referencias. */
    background-color: var(--blanco);
    background-image: none;
    color: var(--tinta);
    border-bottom: 1px solid var(--negro-200);
  }
  .marca { display: flex; align-items: center; gap: var(--e-3); min-height: var(--tactil); }
  .lockup { display: flex; flex-direction: column; gap: 3px; }
  .nombre { font-size: 19px; font-weight: 700; letter-spacing: 0.03em; line-height: 1; }
  /* `--oro-texto` y NO `--oro-500`: a 9 px esto es texto chico, y el oro de marca
     sobre marfil da 1.61:1 — lo cazó el validador en las ocho páginas al invertir el
     campo. El token ya resuelve los dos registros: grafito en claro, oro en oscuro.
     Es la cuarta vez que un color literal en un componente explota al cambiar de
     superficie, y la cuarta vez que el token era la respuesta. */
  .bajada { font-size: 9px; font-weight: 700; letter-spacing: 0.2em; line-height: 1; color: var(--oro-texto); }

  .nav-escritorio { display: none; }
  .llamar {
    display: inline-flex; align-items: center; justify-content: center;
    width: var(--tactil); height: var(--tactil);
    /* Borde de tinta, no blanco: sobre marfil el blanco desaparece. */
    border: 2px solid var(--tinta); border-radius: var(--radio-boton);
  }
  .inerte { border-color: var(--negro-500); color: var(--negro-400); }

  /* El pie es el FONDO de la rampa de página, no un bloque aparte · ADR-0010.
     Antes era negro-900 y se leía como un cuarto negro suelto, después de la banda
     (negro-950), la sección oscura (grafito→negro-950) y la barra fija. Ahora el pie
     es el punto más oscuro y la rampa termina donde tiene que terminar. */
  /* PIE · ADR-0028. EL ANCLA OSCURA. Si toda la página es clara pierde contraste y
     no termina en ninguna parte; el pie es lo que la cierra.
     Los roles se los da `.registro-oscuro`, puesto en el marcado. */
  footer {
    background-color: var(--carbon);
    color: var(--tinta-sobre-oscuro);
  }
  .regla-pie { background: var(--negro-950); }
  .caja {
    max-width: var(--ancho-maximo); margin-inline: auto; display: grid; gap: var(--e-6);
    padding: var(--e-8) var(--margen-lateral) var(--e-12);
  }
  .nombre-pie { font-weight: 700; letter-spacing: 0.03em; }
  .etiqueta {
    font-size: var(--etiqueta-tam); font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking); color: var(--tinta-tenue-oscuro);
    margin-bottom: var(--e-3);
  }
  .dato { margin-top: var(--e-2); }
  .horarios { margin-top: var(--e-2); display: grid; gap: var(--e-1); font-size: var(--pie-tam); }
  .horarios li { display: flex; flex-wrap: wrap; gap: var(--e-1) var(--e-3); }
  .dias { min-width: 10ch; color: var(--tinta-secundaria); }
  footer li a {
    display: block; min-height: var(--tactil-piso);
    display: flex; align-items: center;
    font-size: var(--pie-tam); color: var(--tinta-secundaria);
  }
  /* En el pie sí cabe el oro de marca: sobre carbón da 11.12:1. */
  footer li a:hover { color: var(--oro-500); }

  .barra-fija {
    position: sticky; bottom: 0; z-index: 10;
    display: flex; align-items: center; gap: var(--e-3);
    padding: var(--e-2) var(--margen-lateral);
    background-color: var(--campo-alto);
    background-image: var(--resplandor-fijo);
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
    /* Grafito, y oro SOLO al pasar por encima. Nada de botones dorados en el menú:
       el dorado se reserva para indicar valor, no para señalar cada enlace. */
    .nav-escritorio a {
      display: inline-flex; align-items: center;
      min-height: var(--tactil-piso); padding: 0 var(--e-3);
      font-size: var(--cuerpo-tam);
      color: var(--tinta);
      transition: color var(--mov-aparicion) var(--mov-curva);
    }
    /* `--oro-800` y no `--oro-500`: sobre marfil el oro de marca da 1.87:1 y deja de
       ser texto. El 800 existe justo para esto — 4.65:1 sobre blanco. */
    .nav-escritorio a:hover { color: var(--oro-800); }
    .caja { padding-inline: var(--e-12); }
    .flotante {
      display: block;
      position: fixed;
      right: var(--e-6);
      bottom: var(--e-6);
      z-index: 20;
    }
    .caja { grid-template-columns: 1.2fr 1fr 1fr 0.8fr; gap: var(--e-12); }
    .barra-fija { display: none; }   /* en escritorio el contacto vive en el encabezado */
  }
</style>

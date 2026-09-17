<script lang="ts">
  import '../app.css';
  import { dev } from '$app/environment';
  import { grafoSerializado } from '$lib/seo/jsonld';
  import { negocio, sucursalPrincipal, estaConfirmado, horariosLegibles, direccionCompleta } from '$lib/config/negocio';
  import { enlaceTelefono } from '$lib/datos/telefono';
  import { girosConstruibles } from '$lib/datos/giros';
  import Icono from '$componentes/Icono.svelte';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import PorConfirmar from '$componentes/PorConfirmar.svelte';
  import Meta from '$componentes/Meta.svelte';
  import ReglaDorada from '$componentes/ReglaDorada.svelte';
  import Monograma from '$componentes/Monograma.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  // En dev se deja pasar para poder trabajar. En producción es estricto y truena,
  // salvo que alguien escriba VITE_PENDIENTES_OK=1 a mano para medir o revisar.
  const permisivo = import.meta.env.VITE_PENDIENTES_OK === '1';
  const grafo = grafoSerializado(!dev, permisivo);
  const tel = sucursalPrincipal.telefono;
  const horarios = horariosLegibles();
  const direccion = direccionCompleta();
  const mapa = sucursalPrincipal.mapaUrl;
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
    <!-- El trazo vive en `Monograma` desde el ADR-0051: el lienzo de «DÓNDE ESTAMOS» lo
         pinta en grande y dos copias a mano se habrían separado. -->
    <Monograma tam={26} />
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
    {#each girosConstruibles as g}
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
  <!-- EL PIE EN UNA FICHA · ADR-0053. Aquí iba `BandaContacto` —«LLÁMANOS · DÓNDE
       ESTAMOS»— encima de un pie con horario, líneas y legal: dos bloques oscuros seguidos,
       902 px en teléfono, repitiendo lo que «DÓNDE ESTAMOS» ya dice arriba. Ahora es uno.
       Lo que NO se pierde, por el ADR-0036: nombre, dirección y teléfono ESCRITOS en cada
       página —en ocho de las nueve el número solo estaba en la banda— y el aviso de
       privacidad enlazado, que el mapa de Google obliga a tener a mano. -->
  <div class="regla-pie"><ReglaDorada ancho="completo" /></div>
  <div class="caja">
    <div class="datos">
      <p class="marca-pie"><Monograma tam={28} /><span>{negocio.nombreComercial} VALUADORES</span></p>
      {#if estaConfirmado(tel)}
        <!-- `data-negocio`: el número SALE de `negocio.ts`. El validador lo tolera solo por
             eso; ver la nota del guardia en validar-a11y.mjs. -->
        <a class="telefono-pie" href={enlaceTelefono()} data-negocio="telefono">
          <Icono nombre="telefono" tam={20} grosor={1.9} />{tel}
        </a>
      {:else}
        <p><PorConfirmar que="teléfono" decision="D-08" sobreOscuro /></p>
      {/if}
      {#if estaConfirmado(direccion)}
        <div class="fila">
          <Icono nombre="mapa" tam={20} />
          <div>
            <p class="direccion-pie" data-negocio="direccion">{direccion}</p>
            {#if estaConfirmado(mapa)}
              <a class="ir" href={mapa} target="_blank" rel="noopener">Cómo llegar <Icono nombre="ir" tam={16} grosor={2} /></a>
            {/if}
          </div>
        </div>
      {:else}
        <p><PorConfirmar que="calle, número, colonia y CP" decision="D-08" sobreOscuro /></p>
      {/if}
    </div>

    <div class="bloque">
      <!-- «HORARIOS Y REDES» se quedó en HORARIO: las redes siguen por confirmar (D-10) y
           la etiqueta prometía algo que no estaba. -->
      <p class="etiqueta">HORARIO</p>
      {#if estaConfirmado(horarios)}
        <dl class="horarios" data-negocio="horarios">
          {#each horarios as h}<dt>{h.dias}</dt><dd>{h.horas}</dd>{/each}
        </dl>
      {:else}
        <p class="dato"><PorConfirmar que="horarios de cada día" decision="D-08" sobreOscuro /></p>
      {/if}
    </div>

    <nav class="bloque lineas" aria-label="Líneas de negocio, al pie">
      <p class="etiqueta">LÍNEAS</p>
      <ul>
        {#each girosConstruibles as g}<li><a href="/{g.slug}/">{g.nombreCorto}</a></li>{/each}
      </ul>
    </nav>

    <div class="legal">
      <a href="/aviso-de-privacidad/">Aviso de privacidad</a>
      <a href="/terminos/">Términos</a>
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
    background-color: var(--suelo);   /* ADR-0046 · sin cepillado: la cabecera es fija y el del cuerpo pasa por debajo */
    background-image: none;
    color: var(--tinta);
    border-bottom: 1px solid var(--negro-500);   /* negro-200 sobre acero desaparece · negro-500 3.09:1 */
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
    padding: var(--e-8) var(--margen-lateral) var(--e-4);
  }

  /* LA FICHA DEL PIE · ADR-0053. Nombre, número y dirección arriba; el número manda, como
     mandaba en la banda: es lo que busca quien ya decidió llamar. */
  .datos { display: grid; gap: var(--e-3); }
  .marca-pie { display: flex; align-items: center; gap: var(--e-3); font-weight: 700; letter-spacing: 0.03em; }
  .telefono-pie {
    display: inline-flex; align-items: center; gap: var(--e-3); justify-self: start;
    min-height: var(--tactil-piso);
    font-size: var(--h2-tam); font-weight: var(--h2-peso); color: var(--tinta);
  }
  .fila { display: grid; grid-template-columns: 20px 1fr; gap: var(--e-3); align-items: start; }
  .telefono-pie :global(svg), .fila > :global(svg) { color: var(--oro-500); flex-shrink: 0; }
  .fila > :global(svg) { margin-top: 1px; }
  .direccion-pie { font-size: var(--pie-tam); line-height: var(--pie-alto); color: var(--tinta-secundaria); }
  .ir {
    display: inline-flex; align-items: center; gap: var(--e-1); min-height: var(--tactil-piso);
    font-size: var(--pie-tam); font-weight: var(--cuerpo-fuerte-peso); color: var(--oro-500);
    text-decoration: underline; text-underline-offset: 3px;
  }

  .etiqueta {
    font-size: var(--etiqueta-tam); font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking); color: var(--tinta-tenue-oscuro);
    margin-bottom: var(--e-2);
  }
  .dato { margin-top: var(--e-2); }
  /* EL HORARIO EN COLUMNA: el día iba a `10ch` y «Lunes a viernes» pasa de 10, así que su
     hora empezaba 17 px más a la derecha que las otras. */
  .horarios {
    display: grid; grid-template-columns: max-content 1fr; gap: 2px var(--e-4);
    font-size: var(--pie-tam); line-height: var(--pie-alto);
  }
  .horarios dt { color: var(--tinta-secundaria); }
  .horarios dd { color: var(--tinta); }

  /* LAS LÍNEAS EN FILA y con su nombre corto, como en el menú de arriba. Eran cinco
     renglones de 44 px con el nombre largo, uno bajo otro. */
  .lineas ul { display: flex; flex-wrap: wrap; gap: 0 var(--e-6); }
  /* 44 × 44 COMO PISO EN LOS DOS LADOS: «Taller» mide 34 px de ancho, y en fila un enlace
     corto se volvía un objetivo más angosto que el dedo. El validador lo cazó. */
  .lineas a, .legal a {
    display: inline-flex; align-items: center; justify-content: center;
    min-height: var(--tactil-piso); min-width: var(--tactil-piso);
    font-size: var(--pie-tam);
  }
  .lineas a { color: var(--tinta); }
  .legal { display: flex; flex-wrap: wrap; gap: 0 var(--e-6); padding-top: var(--e-1); border-top: 1px solid var(--borde-sutil); }
  .legal a { color: var(--tinta-secundaria); }
  /* En el pie sí cabe el oro de marca: sobre carbón da 11.12:1. */
  .lineas a:hover, .legal a:hover { color: var(--oro-500); }

  .barra-fija {
    position: sticky; bottom: 0; z-index: 10;
    display: flex; align-items: center; gap: var(--e-3);
    padding: var(--e-2) var(--margen-lateral);
    background-color: var(--campo-alto);
    /* SIN RESPLANDOR · ADR-0044. Llevaba `--resplandor-fijo`, un radial de oro al
       0.16 heredado del sitio oscuro. Medido en la página construida: teñía la banda
       hasta **rgb(47,43,28)** por la derecha contra el **rgb(23,23,23)** plano del pie,
       que está pegado debajo. Mismo token, distinto aspecto: una mitad parda y la otra
       negra, con la costura a la vista.
       El propio `tokens.css` ya avisaba de esto para el resplandor claro —«se lee como
       una mancha sucia en vez de como luz»—. Aquí el pie es el ancla y un ancla no
       tiene dos colores. */
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
    /* ADR-0047 · SOBRE ACERO EL ORO YA NO ES TEXTO. Aquí iba `--oro-800`, medido sobre
       marfil; el ADR-0046 cambió el suelo y ese hover quedó en 2.44:1. El texto pasa a
       negro-950 —10.19:1— y el oro se queda en el subrayado, que es adorno. */
    .nav-escritorio a:hover {
      color: var(--negro-950);
      text-decoration: underline 2px var(--oro-500);
      text-underline-offset: 6px;
    }
    .caja { padding-inline: var(--e-12); }
    /* CINCO LÍNEAS EN EL MENÚ · ADR-0047. A 768 px la cabecera pedía 729 px en 672: el
       navegador encogía el monograma hasta borrarlo y aplastaba el botón de llamar.
       Ninguno de los dos encoge, y hasta 1023 px los enlaces bajan a 15 px con medio
       relleno: 433 px de menú y 35 libres. */
    .marca, .llamar { flex-shrink: 0; }
    .flotante {
      display: block;
      position: fixed;
      right: var(--e-6);
      bottom: var(--e-6);
      z-index: 20;
    }
    .caja { grid-template-columns: 1.4fr 1fr 1fr; gap: var(--e-6) var(--e-12); padding-top: var(--e-12); }
    .legal { grid-column: 1 / -1; }
    .barra-fija { display: none; }   /* en escritorio el contacto vive en el encabezado */
  }
  @media (min-width: 768px) and (max-width: 1023px) {
    .nav-escritorio a { padding: 0 var(--e-2); font-size: 15px; }
  }
</style>

<script lang="ts">
  /**
   * Los bienes en órbita, con la M al centro · ADR-0026.
   *
   * ── LA GEOMETRÍA SE CALCULA, NO SE TANTEA ─────────────────────────────────
   * La M solo cabe en el centro si el hueco que dejan los discos es mayor que ella:
   *
   *     radio × sen(inclinación)  −  diámetro/2  >  mitad de la M
   *
   * En escritorio: 250 × 0.669 − 66 = 101 px libres, y la M mide 160 (80 de radio).
   * En teléfono:   132 × 0.669 − 46 = 42 px libres, y la M mide 82 (41 de radio).
   *
   * Se llegó a esos números después de dos intentos fallidos que se vieron en las
   * capturas: con el radio corto los mundos se pisaban entre sí y tapaban la M; con
   * el radio largo el anillo se salía de la página. La fórmula quita el tanteo.
   *
   * ── POR QUÉ DOS ANIMACIONES Y NO UNA ──────────────────────────────────────
   * El anillo gira. Si los discos giraran con él acabarían de canto y desaparecerían
   * media vuelta. Tienen que mirar siempre al frente, así que cada uno lleva una
   * animación que **deshace** el giro del anillo.
   *
   * La alternativa era animar una propiedad personalizada y leerla desde los hijos.
   * Eso obliga al navegador a recalcular estilo de siete elementos en cada cuadro.
   * Con dos animaciones de `transform` puras, el trabajo se queda en el compositor.
   *
   * ── SE PARA CUANDO NADIE LA VE ────────────────────────────────────────────
   * Nadir pidió que gire siempre y gira siempre — mientras se vea. Fuera de pantalla
   * se congela: no cambia lo que ve una sola persona y deja de gastar batería en un
   * teléfono de gama baja, que es la audiencia del contrato. Mismo criterio que
   * `monedas.js`. Si el script no carga, gira igual.
   *
   * ── CADA MUNDO LLEVA A WHATSAPP ───────────────────────────────────────────
   * Con su categoría ya escrita en el mensaje. El enlace lo arma
   * `$lib/datos/whatsapp`: aquí no se escribe ni un dígito del número.
   */
  import { srcset } from '$lib/datos/fotos';
  import Icono from './Icono.svelte';
  import { enlaceWhatsApp } from '$lib/datos/whatsapp';

  interface Bien {
    que: string;
    fuente: 'letrero' | 'publicacion' | 'deducido';
    icono: string;
    micro?: string;
    foto?: string;
    fotoMaxAncho?: number;
    fotoEsSuya?: boolean;
    fotoAlt?: string;
  }

  interface Props {
    bienes: Bien[];
    /** Para el mensaje de WhatsApp: de qué línea pregunta. */
    giro: string;
    /** Arranque del mensaje · ADR-0047. Sin él, el de empeño: en venta o fletes pedir un
        préstamo es justo lo que no se quiere. */
    pregunta?: string;
  }
  let { bienes, giro, pregunta }: Props = $props();

  const paso = $derived(360 / bienes.length);

  /* El disco mayor mide 132 px pintado, 264 a densidad doble. El de 400 es el menor
     que existe y ya lo cubre: pedir más sería traer bytes que no se ven. */
  const TAMANOS = '(min-width: 768px) 132px, 92px';

  const mensajeDe = (que: string) =>
    (pregunta ?? 'Hola, quiero saber cuánto me pueden prestar. Es de la categoría: ') + que + '.';
</script>

<div class="escenario" data-planeta>
  <ul class="anillo">
    {#each bienes as bien, i}
      {@const enlace = enlaceWhatsApp(mensajeDe(bien.que))}
      <li class="mundo" style="--a:{paso * i}deg">
        <!-- `.contra` deshace el giro del anillo para que el disco mire siempre al
             frente. Ver la nota de arriba: dos animaciones de transform, cero
             recálculo de estilo por cuadro. -->
        <span class="contra">
          <a class="disco" href={enlace} rel="noopener" data-origen="bien-{giro}-{bien.icono}">
            {#if bien.foto}
              <picture>
                <source type="image/avif" srcset={srcset(bien.foto, 'avif', bien.fotoMaxAncho ?? 1600)} sizes={TAMANOS} />
                <source type="image/webp" srcset={srcset(bien.foto, 'webp', bien.fotoMaxAncho ?? 1600)} sizes={TAMANOS} />
                <img
                  src="/fotos/{bien.foto}-400.jpg"
                  srcset={srcset(bien.foto, 'jpg', bien.fotoMaxAncho ?? 1600)}
                  sizes={TAMANOS}
                  alt={bien.fotoAlt ?? ''}
                  width="400"
                  height="400"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            {:else}
              <span class="vacio" aria-hidden="true"><Icono nombre={bien.icono} tam={46} grosor={1.1} /></span>
            {/if}
            <span class="velo" aria-hidden="true"></span>
            <span class="aro" aria-hidden="true"></span>
            <span class="rotulo">{bien.que}</span>
          </a>
        </span>
      </li>
    {/each}
  </ul>

  <!-- La M. `aria-hidden`: la marca ya está en el encabezado y en el pie; aquí es el
       centro de una composición, no información nueva. -->
  <span class="sol" aria-hidden="true">
    <svg viewBox="0 0 260 258">
      <path fill="var(--oro-500)" d="M0,24 L130,154 L130,220 L46,152 L46,258 L0,258 Z M130,74 L196,8 L244,8 L260,24 L130,154 Z" />
      <path fill="var(--tinta)" d="M16,8 L64,8 L130,74 L130,154 L0,24 Z M260,24 L260,258 L214,258 L214,152 L130,220 L130,154 Z" />
    </svg>
  </span>
</div>

<svelte:head>
  <script src="/animacion/planeta.js" defer></script>
</svelte:head>

<style>
  /* Teléfono primero. Los números salen de la fórmula del encabezado. */
  .escenario {
    --d: 92px;        /* diámetro del mundo */
    --r: 132px;       /* radio de la órbita */
    --s: 82px;        /* tamaño de la M */
    --incl: 42deg;    /* inclinación del anillo */
    --vuelta: 48s;
    position: relative;
    height: 360px;
    perspective: 620px;
    perspective-origin: 50% 50%;
  }

  .anillo {
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform: rotateX(var(--incl)) rotateY(0deg);
    animation: girar var(--vuelta) linear infinite;
  }
  @keyframes girar {
    to { transform: rotateX(var(--incl)) rotateY(360deg); }
  }

  .mundo {
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--d);
    height: var(--d);
    margin: calc(var(--d) / -2);
    transform-style: preserve-3d;
    /* Se coloca en su ángulo, se aleja al radio y se endereza. */
    transform: rotateY(var(--a)) translateZ(var(--r)) rotateY(calc(var(--a) * -1));
  }

  .contra {
    display: block;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transform: rotateY(0deg) rotateX(calc(var(--incl) * -1));
    animation: contragirar var(--vuelta) linear infinite;
  }
  @keyframes contragirar {
    to { transform: rotateY(-360deg) rotateX(calc(var(--incl) * -1)); }
  }

  .disco {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    text-decoration: none;
    /* Color plano debajo de todo: si la foto no carga hay campo oscuro, no el fondo
       claro de la sección. */
    background: var(--superficie-oscura);
    color: var(--tinta-sobre-oscuro);
    border: 2px solid var(--panel-borde);
    box-shadow: 0 16px 34px rgba(12, 13, 15, 0.4);
    transition: border-color 300ms ease;
  }
  .disco:hover { border-color: var(--oro-500); }
  .disco:focus-visible {
    outline: 3px solid var(--oro-500);
    outline-offset: 3px;
  }

  picture { display: contents; }

  img,
  .vacio {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* SIN `filter`. En la galería el grado igualaba fotos grandes; aquí el disco mide
       92 px y va bajo un velo casi opaco, así que no se distingue — y un filtro sobre
       un elemento que gira es trabajo de rasterizado en CADA cuadro de una animación
       que no para. Se quita lo que no se ve. */
  }
  .vacio {
    display: grid;
    place-items: center;
    align-content: center;
    padding-bottom: var(--e-3);
    filter: none;
    color: var(--oro-500);
    background:
      radial-gradient(70% 70% at 50% 38%, rgba(231, 192, 65, 0.26) 0%, rgba(231, 192, 65, 0) 68%),
      linear-gradient(160deg, var(--negro-800) 0%, var(--negro-950) 100%);
  }

  /* El rótulo se apoya en negro casi opaco: el contraste no depende de la foto. */
  .velo {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(
      to top,
      rgba(12, 13, 15, 0.97) 0%,
      rgba(12, 13, 15, 0.86) 30%,
      rgba(12, 13, 15, 0) 58%
    );
  }
  .aro {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(231, 192, 65, 0.5);
  }
  .rotulo {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: 0 var(--e-1) 9px;
    text-align: center;
    font-size: 0.625rem;
    line-height: 1.1;
    /* 700 y no 800 · ADR-0053: el sitio no carga el 800, así que el navegador lo fingía
       con el peso más cercano. Y sin el −0.01em, que solo lleva el titular en Garamond. */
    font-weight: var(--etiqueta-peso);
  }

  .sol {
    position: absolute;
    left: 50%;
    top: 50%;
    width: var(--s);
    height: var(--s);
    margin: calc(var(--s) / -2);
    display: grid;
    place-items: center;
    border-radius: 50%;
    z-index: 5;
    background: radial-gradient(58% 58% at 50% 42%, rgba(231, 192, 65, 0.34) 0%, rgba(231, 192, 65, 0) 72%);
  }
  .sol svg {
    width: 62%;
    height: 62%;
    filter: drop-shadow(0 8px 20px rgba(231, 192, 65, 0.45));
  }

  /* Fuera de pantalla se congela. Lo pone el script; sin él, gira igual.
     ── `:global()` NO ES ADORNO, Y AQUÍ COSTÓ UN FALLO MUDO · ADR-0040 ─────────
     Esto estaba escrito como `.escenario[data-quieto] .anillo` a secas. `data-quieto`
     lo pone `planeta.js` en tiempo de ejecución, así que Svelte NO lo ve en el marcado,
     lo declara selector sin usar y **lo borra del CSS compilado**. No es un aviso
     cosmético: la regla no llegaba al build.

     Comprobado en la página construida antes de arreglarlo: con el planeta fuera de
     pantalla el atributo SÍ estaba —`data-quieto: true`— y la animación seguía en
     `running`. un `grep` de `data-quieto` sobre el CSS construido no encontraba nada.

     O sea que la pausa del ADR-0026 —la que ahorra batería en el teléfono de gama baja
     del contrato— **nunca funcionó en el sitio publicado**. Con `:global()` en la parte
     del atributo, Svelte deja de podarla; `.escenario` y `.anillo` siguen con ámbito,
     así que no se escapa a ningún otro componente. */
  :global {
    .escenario[data-quieto] .anillo,
    .escenario[data-quieto] .contra { animation-play-state: paused; }
  }

  /* Quien pidió menos movimiento recibe el planeta quieto, no menos planeta. */
  @media (prefers-reduced-motion: reduce) {
    .anillo,
    .contra { animation: none; }
  }

  @media (min-width: 768px) {
    .escenario {
      --d: 132px;
      --r: 250px;
      --s: 160px;
      height: 540px;
    }
    .rotulo { font-size: 0.78rem; padding-bottom: 13px; }
  }
</style>

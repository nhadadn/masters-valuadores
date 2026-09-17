<script lang="ts">
  /**
   * Carrusel curvo en 3D · ADR-0023.
   *
   * ── CERO JAVASCRIPT, Y NO ES UN ALARDE: ES LO QUE LO HACE ACCESIBLE ───────
   *
   * La pista es un contenedor de scroll con `scroll-snap`. Eso significa que el
   * arrastre, el gesto del dedo, la rueda del ratón, las flechas del teclado, la
   * barra de desplazamiento y el lector de pantalla funcionan **de fábrica**, sin
   * que nadie los programe. Un carrusel escrito a mano tiene que reimplementar los
   * seis, y es donde fallan casi todos.
   *
   * La curva y la profundidad las pone `view-timeline`: cada tarjeta anima su propio
   * `rotateY` y `translateZ` segun por donde va pasando por el marco. Es una
   * animacion guiada por scroll, del navegador, sin un bucle nuestro.
   *
   * ── QUE PASA DONDE NO HAY `animation-timeline` ────────────────────────────
   * Se queda en un carrusel plano con `scroll-snap`: pierde la curva y no pierde
   * nada mas. Se prueba con `@supports`, no se supone.
   *
   * ── LA PERSPECTIVA VA EN LA PISTA, NO EN UN PADRE ─────────────────────────
   * `overflow` distinto de `visible` fuerza `transform-style: flat`, asi que
   * `preserve-3d` en un contenedor de scroll NO funciona. La `perspective` se
   * declara en la pista misma: sus hijos directos son las tarjetas y la reciben sin
   * necesitar `preserve-3d`. El punto de fuga queda fijo al centro del marco y las
   * tarjetas pasan por delante de el, que es justo el efecto que se busca.
   */
  import { srcset, anchosDe } from '$lib/datos/fotos';
  import type { FotoDeGaleria } from '$lib/datos/galeria';

  interface Props {
    fotos: FotoDeGaleria[];
    /** Para el `aria-label` de la region: qué hay dentro. */
    etiqueta: string;
    /** Qué se dice debajo. Va marcado como propuesta por quien lo use. */
    nota?: string;
  }
  let { fotos, etiqueta, nota }: Props = $props();

  /* El prop `clave` del ADR-0033 se fue con los puntos · ADR-0039: existía para que
     los `id` de dos carruseles no chocaran, y los `id` existían para ser destino de
     las anclas. Sin anclas no hacen falta ni los unos ni el otro. */

  const mayorDe = (f: FotoDeGaleria) => {
    const a = anchosDe(f.maxAncho);
    return a[a.length - 1];
  };
</script>

<!-- `tabindex="0"` NO es decorativo: una region con scroll tiene que poder recorrerse
     con el teclado, y sin el las flechas no llegan aqui nunca. Con `role="group"` y
     su etiqueta, el lector de pantalla anuncia que es y cuantas fotos trae. -->
<ul
  class="pista"
  data-auto
  tabindex="0"
  role="group"
  aria-label="{etiqueta} · {fotos.length} fotografías, se recorren con las flechas"
>
  {#each fotos as foto, i}
    <li>
      <figure>
        <a href="/fotos/{foto.nombre}-{mayorDe(foto)}.jpg">
          <picture>
            <source type="image/avif" srcset={srcset(foto.nombre, 'avif', foto.maxAncho)} sizes="(min-width: 768px) 320px, 74vw" />
            <source type="image/webp" srcset={srcset(foto.nombre, 'webp', foto.maxAncho)} sizes="(min-width: 768px) 320px, 74vw" />
            <img
              src="/fotos/{foto.nombre}-400.jpg"
              srcset={srcset(foto.nombre, 'jpg', foto.maxAncho)}
              sizes="(min-width: 768px) 320px, 74vw"
              alt={foto.alt}
              width="400"
              height="267"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </a>
        <figcaption data-propuesta="true">{foto.pie}</figcaption>
      </figure>
    </li>
  {/each}
</ul>

<!-- AQUÍ VIVÍAN LOS PUNTOS · ADR-0039.
     Eran anclas de verdad, una por foto, con 44 px de objetivo táctil cada una.
     Con nueve tarjetas se comían dos renglones enteros en un teléfono y no aportaban
     nada que el gesto del dedo no hiciera ya.

     LO QUE SE PIERDE: eran el indicador de posición —cuál de nueve vas— y la única
     señal visible de que hay más a los lados, porque la barra de desplazamiento está
     oculta. Lo segundo lo resuelve el avance automático de abajo: un carrusel que se
     mueve se anuncia solo. Lo primero no se sustituye. -->

{#if nota}
  <p class="nota" data-propuesta="true">{nota}</p>
{/if}

<!-- AVANZA SOLO · ADR-0039. Ya no arregla el salto de las anclas —no hay anclas—:
     ahora adelanta una tarjeta cada pocos segundos. Si este archivo no carga, el
     carrusel sigue siendo un contenedor de scroll con snap y se recorre igual con el
     dedo, la rueda y el teclado. Nada depende de que exista. -->
<svelte:head>
  <script src="/animacion/carrusel.js" defer></script>
</svelte:head>

<style>
  .pista {
    list-style: none;
    margin: 0;
    display: flex;
    /* SIN HUECO, Y ES LO QUE LO HACE ARCO. Con separacion las tarjetas se leian
       como tres fotos sueltas, no como una curva: el giro y la profundidad ya
       apartan los lados por si solos, y el hueco encima sumaba el doble. */
    gap: 0;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    /* EL PUNTO DE FUGA. Ver la nota de arriba: aqui y no en un padre. */
    perspective: 900px;
    perspective-origin: 50% 50%;

    /* Aire a los lados para que la PRIMERA y la ULTIMA puedan quedar centradas.
       Sin esto, el carrusel no puede enseñar sus extremos en el centro nunca. */
    padding: var(--e-4) max(var(--e-3), calc(50% - 160px));
    scroll-padding-inline: max(var(--e-3), calc(50% - 160px));

    /* Los extremos se DESVANECEN en vez de cortarse en seco contra el margen. Sin
       esto la tarjeta del borde quedaba partida por la mitad, con su pie cortado a
       media palabra, y el arco parecia un recorte y no una curva. */
    -webkit-mask-image: linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0, #000 9%, #000 91%, transparent 100%);

    /* La barra se oculta · y desde el ADR-0039 hay que decir lo que eso cuesta: sin
       barra y sin puntos, en escritorio NO queda señal estática de que esto se
       desplaza. La señal es el movimiento. */
    scrollbar-width: none;
  }
  .pista::-webkit-scrollbar { display: none; }

  .pista:focus-visible {
    outline: 3px solid var(--oro-500);
    outline-offset: 3px;
  }

  li {
    flex: 0 0 auto;
    /* 320 px es el techo, y lo fija la RESOLUCION, no el gusto: las fuentes miden
       entre 440 y 985 px porque vienen dentro de arte que WhatsApp comprimio. Una
       tarjeta mas grande solo enseñaria la foto mas borrosa. */
    /* 68vw en telefono, no 74: a 390 px las vecinas quedaban casi de canto y con
       tan poca superficie a la vista se leian como barras oscuras. Con la tarjeta
       algo mas estrecha asoman lo suficiente para verse como lo que son. */
    width: min(68vw, 320px);
    scroll-snap-align: center;
    transform-origin: 50% 50%;
  }

  figure { margin: 0; }

  a {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  a:focus-visible {
    outline: 3px solid var(--oro-500);
    outline-offset: 2px;
  }

  img {
    display: block;
    width: 100%;
    /* `height: auto` o los atributos width/height del <img> ganan como hint de
       presentacion y `aspect-ratio` no llega a actuar. Medido: sin esto salian
       de 169x267 en vez de 3:2. */
    height: auto;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    background: var(--superficie-oscura);
    border: 1px solid var(--panel-borde);
    /* RELIEVE · ADR-0039. Estática a propósito: animar `box-shadow` repinta en cada
       cuadro, y con quince tarjetas sobre un teléfono de gama baja eso se nota. La
       sensación de que la central sobresale la da la escala, que es `transform` y la
       resuelve el compositor. */
    box-shadow: var(--sombra-tarjeta);
  }

  figcaption {
    padding: var(--e-2) 0 0;
    /* 14 y no 13 · ADR-0053: 13 px es el tamaño de las cejas en mayúsculas, no de un pie
       de foto en minúsculas. El texto de apoyo del sitio va a `--pie-tam`. */
    font-size: var(--pie-tam);
    line-height: 1.35;
    color: var(--tinta);
    text-align: center;
  }

  /* ── LA CURVA ──────────────────────────────────────────────────────────────
     Cada tarjeta se anima segun su propio paso por el marco. A la izquierda del
     centro mira a la derecha y al reves, asi que todas «miran» al centro: es un
     arco concavo, como el interior de un cilindro.
     El rango por omision de `view()` va de entrar por un lado a salir por el otro,
     asi que el 50 % es exactamente el centro del marco. */
  @supports (animation-timeline: view()) {
    li {
      view-timeline-name: --tarjeta;
      view-timeline-axis: inline;
      animation: curvar linear both;
      animation-timeline: --tarjeta;
    }

    /* EL `translateX` ES LO QUE CIERRA EL ARCO, y costo dos intentos verlo.
       Al girar 48 grados la tarjeta encoge sobre su propio centro —cos(48) = 0.67, de
       320 px a 214— y el hueco que deja no lo quita poner `gap: 0`: la separacion no
       estaba en la maqueta, la creaba el propio giro. Asi que cada lado se tira hacia
       el centro en el mismo fotograma. Al 0 % la tarjeta viene por la derecha y tira
       hacia la izquierda; al 100 % se va por la izquierda y tira hacia la derecha. */
    /* LA ESCALA ENTRA CON EL ADR-0039 · la contracción/dilatación que se pidió.
       El giro ya encogía las laterales —cos(48°) = 0.67— pero solo en horizontal: se
       leían como tarjetas de canto, no como tarjetas lejanas. El `scale` las encoge
       también en vertical, así que la central **crece** de verdad contra las dos
       vecinas. Es `transform`: no reflowea y no repinta. */
    @keyframes curvar {
      0%   { transform: translateX(-86px) rotateY(-48deg) translateZ(-120px) scale(0.84); opacity: 0.55; }
      50%  { transform: translateX(0) rotateY(0deg) translateZ(0) scale(1); opacity: 1; }
      100% { transform: translateX(86px) rotateY(48deg) translateZ(-120px) scale(0.84); opacity: 0.55; }
    }
  }

  /* El CSS de `.saltos`, `.punto` y `.ver-solo-lectores` se fue con los puntos ·
     ADR-0039. Era también donde vivía el `flex-wrap` del ADR-0035; con los puntos
     fuera, ese piso táctil ya no tiene a quién proteger aquí. */

  .nota {
    max-width: 790px;
    margin-top: var(--e-3);
    font-size: var(--pie-tam);
    line-height: 1.5;
    color: var(--tinta-secundaria);
  }

  /* Quien pidio menos movimiento no recibe ni curva ni desplazamiento animado.
     Las fotos siguen todas ahi y se siguen recorriendo igual. */
  @media (prefers-reduced-motion: reduce) {
    .pista { scroll-behavior: auto; perspective: none; }
    li { animation: none; transform: none; opacity: 1; }
  }
</style>

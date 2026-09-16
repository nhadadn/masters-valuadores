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
    /**
     * Prefijo de los `id` de las tarjetas · ADR-0033.
     *
     * Hacía falta al montar un SEGUNDO carrusel en la misma página: los `id` eran
     * `foto-0`, `foto-1`… y con dos instancias se duplicaban. Ids repetidos no dan
     * error visible —simplemente los puntos del segundo carrusel llevaban al
     * primero—. Se deja con valor por defecto para que el del patio no cambie.
     */
    clave?: string;
  }
  let { fotos, etiqueta, nota, clave = 'foto' }: Props = $props();

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
  tabindex="0"
  role="group"
  aria-label="{etiqueta} · {fotos.length} fotografías, se recorren con las flechas"
>
  {#each fotos as foto, i}
    <li id="{clave}-{i}">
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

<!-- Los saltos son enlaces de ancla: el navegador desplaza la pista solo. Sin
     JavaScript y con el boton de atras funcionando. -->
<nav class="saltos" aria-label="Ir a una fotografía">
  {#each fotos as foto, i}
    <a href="#{clave}-{i}"><span class="ver-solo-lectores">{foto.pie}</span><span aria-hidden="true" class="punto"></span></a>
  {/each}
</nav>

{#if nota}
  <p class="nota" data-propuesta="true">{nota}</p>
{/if}

<!-- Arregla SOLO el salto vertical de los puntos y marca cual se esta viendo. Todo lo
     demas del carrusel funciona sin esto; si no carga, los puntos siguen siendo anclas
     de verdad y siguen cambiando de foto. Ver el encabezado del archivo. -->
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

    /* La barra estorba mas de lo que ayuda cuando hay puntos debajo. */
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
  }

  figcaption {
    padding: var(--e-2) 0 0;
    font-size: 0.8125rem;
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
    @keyframes curvar {
      0%   { transform: translateX(-86px) rotateY(-48deg) translateZ(-120px); opacity: 0.6; }
      50%  { transform: translateX(0) rotateY(0deg) translateZ(0); opacity: 1; }
      100% { transform: translateX(86px) rotateY(48deg) translateZ(-120px); opacity: 0.6; }
    }
  }

  .saltos {
    display: flex;
    justify-content: center;
    gap: var(--e-1);
    margin-top: var(--e-3);
  }

  /* 44 px de objetivo tactil, como exige el sistema, aunque el punto se vea de 10. */
  .saltos a {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
  }
  .punto {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--tinta-tenue-oscuro, var(--negro-500));
    border: 1px solid var(--oro-500);
  }
  .saltos a:hover .punto,
  .saltos a:focus-visible .punto { background: var(--oro-500); }

  /* La que se esta viendo. Lo pone el script; sin el, los puntos se quedan todos
     iguales y el carrusel sigue funcionando. */
  .saltos a[aria-current='true'] .punto {
    background: var(--oro-500);
    transform: scale(1.35);
  }

  .ver-solo-lectores {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .nota {
    max-width: 790px;
    margin-top: var(--e-3);
    font-size: 0.875rem;
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

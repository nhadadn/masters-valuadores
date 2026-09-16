/**
 * EL CARRUSEL AVANZA SOLO · ADR-0039
 *
 * Sustituye por completo al script del ADR-0023, que existia para arreglar el salto
 * vertical de los puntos de ancla. Los puntos se fueron, asi que ese trabajo tambien.
 *
 * ── QUE HACE, Y POR QUE ASI ────────────────────────────────────────────────
 * Adelanta UNA tarjeta cada pocos segundos, con el desplazamiento suave que ya
 * declara el CSS.
 *
 * No empuja el scroll cuadro a cuadro a proposito. La pista lleva
 * `scroll-snap-type: x mandatory`, asi que un empujon continuo lo pelearia el snap:
 * cada fotograma tiraria hacia delante y el snap tiraria de vuelta al centro mas
 * cercano. Avanzar de tarjeta en tarjeta trabaja CON el snap en vez de contra el, y
 * deja que la curva del `view-timeline` se anime durante el recorrido, que es
 * exactamente el efecto que se busca.
 *
 * ── VA Y VUELVE, no salta al principio ─────────────────────────────────────
 * Al llegar al final invierte el sentido. La alternativa —volver de golpe a la
 * primera— es un barrido largo de nueve tarjetas que marea; y la otra —clonar la
 * pista para un bucle infinito— duplica el DOM y rompe el `view-timeline`, porque
 * cada clon tendria su propia linea de tiempo.
 *
 * ── SE DETIENE, Y HAY DOS CLASES DE PARADA ─────────────────────────────────
 * Esto importa para la WCAG 2.2.2 («Pause, Stop, Hide»): algo que se mueve solo mas
 * de cinco segundos tiene que poder pararse.
 *
 *   · PAUSA, reversible: el puntero encima. Se reanuda al salir.
 *   · ALTO, definitivo: el usuario toca, arrastra, rueda, pulsa una tecla o entra con
 *     el tabulador. Ahi el carrusel es suyo y no se lo volvemos a mover nunca.
 *
 * La segunda es la que cumple el criterio: cualquier intento de tomar el control lo
 * detiene de forma permanente. No hace falta un boton de pausa que nadie pulsa.
 *
 * ── Y NO SE MUEVE SI NO SE VE, NI SI NO LO QUIEREN ─────────────────────────
 * Fuera de pantalla se congela: mismo criterio que `planeta.js` y `monedas.js`, y por
 * el mismo motivo —la audiencia del contrato es un telefono de gama baja—. Con
 * `prefers-reduced-motion: reduce` no arranca siquiera.
 *
 * ── SIN ESTO EL CARRUSEL SIGUE ENTERO ──────────────────────────────────────
 * Es un contenedor de scroll con snap. Si este archivo no carga, se recorre igual con
 * el dedo, la rueda, la barra y las flechas. Nada depende de que exista.
 */
(function () {
  'use strict';

  /* `Carrusel.svelte` inyecta este <script> por `svelte:head`, una vez por instancia:
     con dos carruseles el HTML trae dos etiquetas identicas y el navegador lo ejecuta
     dos veces. Sin cerrojo se montarian dos temporizadores por pista. */
  if (window.__carruselAuto) return;
  window.__carruselAuto = true;

  var CADA = 4500;   // ms entre tarjeta y tarjeta. «Poco a poco», no un pase de diapositivas.

  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  if (quieto && quieto.matches) return;

  var pistas = document.querySelectorAll('.pista[data-auto]');
  for (var i = 0; i < pistas.length; i++) mover(pistas[i]);

  function mover(pista) {
    var tarjeta = pista.querySelector('li');
    if (!tarjeta) return;

    var sentido = 1;
    var sobre = false;      // el puntero esta encima · pausa reversible
    var visible = true;     // la pista esta en pantalla
    var suyo = false;       // el usuario tomo el control · alto definitivo
    var reloj = window.setInterval(paso, CADA);

    function paso() {
      if (suyo) { window.clearInterval(reloj); return; }
      if (sobre || !visible) return;

      var salto = tarjeta.getBoundingClientRect().width;
      if (!salto) return;   // aun sin maquetar, no se fuerza nada

      /* El margen de 4 px absorbe el redondeo del snap: sin el, la ultima tarjeta
         podia quedarse a medio pixel del final y el sentido no se invertia nunca. */
      var fin = pista.scrollWidth - pista.clientWidth - 4;
      if (sentido > 0 && pista.scrollLeft >= fin) sentido = -1;
      else if (sentido < 0 && pista.scrollLeft <= 4) sentido = 1;

      pista.scrollBy({ left: salto * sentido, behavior: 'smooth' });
    }

    /* ALTO DEFINITIVO. `passive: true` porque no se previene nada: solo se escucha
       que el usuario quiso conducir. */
    function mio() {
      suyo = true;
      window.clearInterval(reloj);
    }
    var propios = ['pointerdown', 'touchstart', 'wheel', 'keydown', 'focusin'];
    for (var j = 0; j < propios.length; j++) {
      pista.addEventListener(propios[j], mio, { passive: true, once: true });
    }

    /* PAUSA REVERSIBLE. Solo puntero: en tactil no existe «encima», y ahi el toque ya
       cae en el alto definitivo. */
    pista.addEventListener('mouseenter', function () { sobre = true; });
    pista.addEventListener('mouseleave', function () { sobre = false; });

    /* FUERA DE PANTALLA, QUIETO. Si el navegador no trae observador, se queda con el
       comportamiento de siempre: se mueve. */
    if (!window.IntersectionObserver) return;
    new IntersectionObserver(function (entradas) {
      visible = entradas[0].isIntersecting;
    }, { threshold: 0.1 }).observe(pista);
  }
})();

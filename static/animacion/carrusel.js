/**
 * LOS PUNTOS DEL CARRUSEL · ADR-0023 · MULTI-INSTANCIA DESDE EL ADR-0033
 *
 * El carrusel entero —la curva, la profundidad, el arrastre, el gesto del dedo, la
 * rueda, el recorrido con el tabulador— funciona sin una linea de JavaScript. Esto
 * arregla UNA cosa concreta que el CSS no puede, y no toca nada mas.
 *
 * ── QUE ARREGLA ────────────────────────────────────────────────────────────
 * Los puntos son enlaces de ancla. Al pulsarlos, el navegador lleva el destino a la
 * vista desplazando TODOS sus contenedores, y eso incluye la pagina: medido, un
 * salto vertical de 325 px cada vez que alguien cambiaba de foto.
 *
 * Se probaron tres arreglos solo con CSS —`scroll-snap-align: none center`,
 * `scroll-snap-type: proximity`, y los dos juntos— y los tres dieron exactamente los
 * mismos 325 px. No es el ajuste del snap: es como funciona la navegacion por ancla.
 *
 * `block: 'nearest'` es la diferencia: si el destino ya se ve en vertical, no mueve
 * la pagina; solo desplaza el carrusel.
 *
 * ── DOS CARRUSELES EN LA MISMA PAGINA · ADR-0033 ───────────────────────────
 * Aqui habia `document.querySelector('.pista')` en singular y
 * `document.querySelectorAll('.saltos a')` en global. Con la secuencia de joyeria
 * eso se rompia de dos maneras a la vez, y ninguna daba error en consola:
 *
 *   1. `pista` era siempre la PRIMERA, asi que los puntos del segundo carrusel
 *      median distancias contra las tarjetas del primero.
 *   2. `saltos` juntaba los puntos de los DOS, asi que `aria-current` se encendia
 *      en el carrusel equivocado.
 *
 * Ahora cada pista se cablea con SU nav de saltos, buscandolo hacia delante entre
 * sus hermanos. No se empareja por indice global a proposito: si manana cambia el
 * orden del marcado, emparejar por indice cruzaria los puntos de un carrusel con
 * las tarjetas de otro, y eso volveria a fallar en silencio.
 *
 * ── Y EL ARCHIVO SE EJECUTA DOS VECES ──────────────────────────────────────
 * `Carrusel.svelte` inyecta este `<script>` por `svelte:head`, asi que con dos
 * instancias el HTML trae dos etiquetas identicas. El navegador lo descarga una vez
 * pero lo EJECUTA dos, y sin cerrojo se duplicarian los oyentes de clic y los
 * observadores. El cerrojo es una marca en `window`, no un contador de instancias:
 * lo unico que hace falta saber es si el cableado ya paso.
 *
 * ── SIN ESTO EL SITIO SIGUE FUNCIONANDO ────────────────────────────────────
 * Los puntos son anclas de verdad. Si este archivo no carga, siguen cambiando de
 * foto — con el salto. Nada depende de que esto exista.
 */
(function () {
  'use strict';

  if (window.__carruselCableado) return;
  window.__carruselCableado = true;

  var pistas = document.querySelectorAll('.pista');
  if (!pistas.length) return;

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  /** El nav de saltos de ESTA pista: el primer hermano posterior que lo sea. */
  function saltosDe(pista) {
    var el = pista.nextElementSibling;
    while (el) {
      if (el.classList && el.classList.contains('saltos')) return el;
      el = el.nextElementSibling;
    }
    return null;
  }

  function cablear(pista) {
    var nav = saltosDe(pista);
    if (!nav) return;
    var saltos = nav.querySelectorAll('a[href^="#"]');
    if (!saltos.length) return;

    for (var i = 0; i < saltos.length; i++) {
      saltos[i].addEventListener('click', function (e) {
        var destino = document.getElementById(this.getAttribute('href').slice(1));
        if (!destino || !destino.scrollIntoView) return;   // sin destino, que haga lo suyo
        e.preventDefault();
        destino.scrollIntoView({
          block: 'nearest',                                 // ESTO es el arreglo
          inline: 'center',
          behavior: mq && mq.matches ? 'auto' : 'smooth'
        });
      });
    }

    /**
     * CUAL SE ESTA VIENDO.
     *
     * Seis puntos iguales no dicen en cual vas, y un carrusel sin esa señal se
     * recorre a ciegas. `aria-current` lo dice tambien en voz alta, no solo en color.
     */
    if (!window.IntersectionObserver) return;
    var tarjetas = pista.querySelectorAll('li');

    /**
     * LA ACTIVA ES LA MAS CERCANA AL CENTRO, no «una que se vea».
     *
     * El primer intento marcaba cualquier tarjeta que intersectara por encima del
     * 60 %. En escritorio caben tres o cuatro a la vez y varias pasan ese umbral,
     * asi que ganaba la ultima que procesara el navegador: se pulsaba el punto 4 y
     * se encendia el 5. Medido.
     *
     * El observador solo sirve de aviso de que algo cambio; quien decide es la
     * distancia al centro del marco, que no es ambigua.
     */
    function marcarLaDelCentro() {
      var caja = pista.getBoundingClientRect();
      var centro = caja.left + caja.width / 2;
      var mejor = 0;
      var minima = Infinity;
      for (var j = 0; j < tarjetas.length; j++) {
        var t = tarjetas[j].getBoundingClientRect();
        var d = Math.abs(t.left + t.width / 2 - centro);
        if (d < minima) { minima = d; mejor = j; }
      }
      for (var k = 0; k < saltos.length; k++) {
        if (k === mejor) saltos[k].setAttribute('aria-current', 'true');
        else saltos[k].removeAttribute('aria-current');
      }
    }

    var observador = new IntersectionObserver(marcarLaDelCentro, {
      root: pista,
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });
    for (var m = 0; m < tarjetas.length; m++) observador.observe(tarjetas[m]);
  }

  for (var p = 0; p < pistas.length; p++) cablear(pistas[p]);
})();

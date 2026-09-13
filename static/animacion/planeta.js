/**
 * EL PLANETA SE PARA CUANDO NADIE LO VE · ADR-0026
 *
 * El anillo de bienes gira siempre, que es lo que se pidio. Esto NO lo detiene: solo
 * lo congela mientras la seccion esta fuera de pantalla, donde no hay nadie mirando.
 * No cambia lo que ve una sola persona y deja de mover el compositor en un telefono
 * de gama baja, que es la audiencia del contrato. Mismo criterio que `monedas.js`.
 *
 * SIN ESTO EL SITIO SIGUE FUNCIONANDO. La animacion vive en el CSS; si este archivo
 * no carga, el planeta gira igual — solo que tambien cuando no se ve.
 */
(function () {
  'use strict';

  var escenario = document.querySelector('[data-planeta]');
  if (!escenario || !window.IntersectionObserver) return;

  /* Arranca quieto: si la seccion esta abajo del todo, no hay razon para mover nada
     antes de que el visitante llegue. El observador lo suelta al entrar. */
  escenario.setAttribute('data-quieto', '');

  var observador = new IntersectionObserver(
    function (entradas) {
      for (var i = 0; i < entradas.length; i++) {
        if (entradas[i].isIntersecting) escenario.removeAttribute('data-quieto');
        else escenario.setAttribute('data-quieto', '');
      }
    },
    /* Un margen generoso: se pone en marcha un poco antes de asomar, para que nadie
       lo vea arrancar de golpe. */
    { rootMargin: '120px 0px' }
  );
  observador.observe(escenario);

  /* La pestaña oculta cuenta igual que fuera de pantalla. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) escenario.setAttribute('data-quieto', '');
  });
})();

/**
 * Y SI EL APARATO NO DA, SE PLANTA · ADR-0026
 *
 * Medido con el reloj a 1/4 —que es lo que simula un telefono de gama baja— el
 * planeta girando baja los cuadros por segundo de unos 55 a unos 25. Recalculos de
 * estilo y de maquetado salen en CERO, asi que no es calculo: es rasterizado. Siete
 * elementos en 3D, con recorte circular y sombra, se vuelven a pintar cada cuadro.
 *
 * Se probaron cuatro recortes de coste y las mediciones salieron demasiado ruidosas
 * para decidir con ellas —la misma configuracion dio 22.6 y 27.7 fps en dos vueltas—.
 * La unica señal firme fue que `will-change: transform` lo EMPEORA hasta 6.3 fps:
 * forzar siete capas con `preserve-3d` cuesta mas de lo que ahorra.
 *
 * Asi que en vez de adivinar, el planeta se mide a si mismo, como la banda de monedas
 * del ADR-0021: si no llega al umbral, deja de girar y se queda de composicion fija.
 * Sigue enseñando las seis categorias, que es lo que tiene que hacer.
 */
(function () {
  'use strict';

  var escenario = document.querySelector('[data-planeta]');
  if (!escenario || !window.requestAnimationFrame) return;

  var UMBRAL = 32;      // cuadros por segundo por debajo de los cuales no compensa
  var VENTANA = 1500;   // cuanto se mira en cada vuelta
  var malas = 0;        // ventanas malas seguidas

  /**
   * DOS VENTANAS MALAS SEGUIDAS, NO UNA.
   *
   * El primer intento media una sola vez a los 900 ms y se rendia hasta con el reloj
   * SIN freno: a esa altura el navegador todavia esta decodificando imagenes, asi que
   * lo que media era la carga y no la animacion. Medido: se rendia en 1/1, 1/4 y 1/6
   * por igual, que es tanto como no medir.
   *
   * Ahora espera mas, y una mala no basta: hace falta que dos vueltas seguidas salgan
   * por debajo del umbral. Un tropiezo puntual no condena la animacion.
   */
  function juzgar() {
    if (escenario.hasAttribute('data-rendido')) return;
    if (escenario.hasAttribute('data-quieto')) { setTimeout(juzgar, 600); return; }
    var cuadros = 0;
    var t0 = performance.now();
    (function tic() {
      cuadros++;
      var va = performance.now() - t0;
      if (va < VENTANA) { requestAnimationFrame(tic); return; }
      var fps = cuadros / (va / 1000);
      if (fps < UMBRAL) {
        malas++;
        if (malas >= 2) {
          /* Se planta para siempre. Un aparato que no da dos veces seguidas no va a
             dar dentro de diez segundos. */
          escenario.setAttribute('data-quieto', '');
          escenario.setAttribute('data-rendido', '');
          return;
        }
      } else {
        malas = 0;
      }
      /* Mientras no se rinda, sigue vigilando de tanto en tanto: el aparato puede
         ponerse lento despues, por otra pestaña o por calor. */
      setTimeout(juzgar, 3000);
    })();
  }

  /* Se juzga bien DESPUES de la carga: medir mientras llegan imagenes seria medir la
     carga, no la animacion. */
  if (document.readyState === 'complete') setTimeout(juzgar, 2500);
  else addEventListener('load', function () { setTimeout(juzgar, 2500); });
})();

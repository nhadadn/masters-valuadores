/**
 * MONEDAS QUE CAEN Y SE JUNTAN · empeño · ADR-0021
 *
 * JavaScript propio, a mano, sin marco y sin librería. Vive en `static/` a
 * propósito: si entrara por el bundle arrastraría el runtime de Svelte, que son
 * ~46 KB gzip medidos contra un presupuesto de 40. Aquí no arrastra nada.
 *
 * ── POR QUÉ NO SON PARTÍCULAS ───────────────────────────────────────────────
 * Monedas flotando al azar detrás de un titular es el efecto por defecto de
 * cualquier plantilla, y se reconoce a un metro. Estas CAEN Y SE AMONTONAN, que es
 * lo que pasa en el negocio: traes un bien y te cuentan el efectivo encima del
 * mostrador. El montón crece, se asienta y se queda. Si lo tocas, se desparrama y
 * se vuelve a juntar.
 *
 * ── DE DÓNDE SALE EL COLOR ──────────────────────────────────────────────────
 * De `getComputedStyle`, nunca escrito aquí. En este repo un color literal dentro
 * de un componente ya explotó cuatro veces al cambiar de superficie. Este archivo
 * no es la excepción: pregunta por `--oro-500` y `--metal-oro-peor` y usa lo que
 * el sistema conteste.
 *
 * ── QUIÉN NO PAGA ESTO ──────────────────────────────────────────────────────
 * La audiencia del contrato es un teléfono de gama baja, con prisa, a plena luz.
 * Así que esto se apaga solo, en este orden:
 *
 *   sin <canvas>            no hace nada
 *   ahorro de datos         no hace nada
 *   prefers-reduced-motion  dibuja el montón YA ASENTADO, quieto. Sin movimiento
 *   pestaña oculta          congela
 *   fuera de pantalla       congela
 *   pocos núcleos           menos monedas
 *
 * Nunca corre sin que alguien lo esté viendo.
 */
(function () {
  'use strict';

  var lienzo = document.querySelector('canvas[data-monedas]');
  if (!lienzo || !lienzo.getContext) return;

  var ctx = lienzo.getContext('2d');
  if (!ctx) return;

  // Quien pidió ahorrar datos no recibe adornos. No hay negociación.
  var conexion = navigator.connection || navigator.webkitConnection || {};
  if (conexion.saveData) return;

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var quieto = !!(mq && mq.matches);

  // ── EL ORO, PREGUNTADO AL SISTEMA ─────────────────────────────────────────
  var estilo = getComputedStyle(lienzo);
  function token(nombre, respaldo) {
    var v = estilo.getPropertyValue(nombre);
    return (v && v.trim()) || respaldo;
  }
  /* `--oro-moneda` y no `--oro-500`: el oro de marca sobre piedra clara da 1.87:1 y
     la moneda se vuelve invisible. El token nuevo cambia con el registro y en oscuro
     devuelve exactamente el oro de siempre. Ver ADR-0028. */
  var ORO = token('--oro-moneda', '#B08A1E');
  var ORO_HONDO = token('--oro-moneda-honda', '#8A6C15');

  // ── CUÁNTAS ───────────────────────────────────────────────────────────────
  var nucleos = navigator.hardwareConcurrency || 2;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  var ancho = 0, alto = 0, radio = 14, MAX = 0;
  var monedas = [];
  var vivo = false, visible = false, enPantalla = false;
  var ultimo = 0, acumulado = 0, sembradas = 0, proxima = 0;
  /**
   * SE ASIENTA Y SE PARA. Esta es la diferencia entre la idea y un salvapantallas,
   * y también la diferencia entre 5.8 s de hilo principal y ~0.
   *
   * Medido antes de existir esta bandera: 5831 ms de hilo en una ventana de 6 s con
   * el procesador a 1/4. El montón ya estaba quieto en pantalla y el bucle seguía
   * corriendo, recalculando colisiones de monedas que no se movían y repintando el
   * mismo cuadro 60 veces por segundo.
   *
   * El dinero se cuenta y se queda en el mostrador. Cuando deja de moverse, el
   * lienzo conserva su último cuadro y el bucle MUERE. Solo lo resucita la mano.
   */
  var asentado = false, quietas = 0;
  /** Falso hasta que la página terminó de cargar. Ver «ARRANQUE», abajo. */
  var listo = false;
  /** Cuenta de cuadros largos seguidos, para degradar solo. Ver «SI EL APARATO NO DA». */
  var lentitud = 0;
  var MINIMO = 8;

  var PASO = 1000 / 60;     // el reloj de la física, fijo
  var GRAVEDAD = 0.34;
  var REBOTE = 0.28;
  var ROCE = 0.82;

  function medir() {
    var caja = lienzo.getBoundingClientRect();
    ancho = Math.max(1, Math.round(caja.width));
    alto = Math.max(1, Math.round(caja.height));
    lienzo.width = Math.round(ancho * dpr);
    lienzo.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    radio = Math.max(9, Math.min(17, Math.round(ancho / 34)));

    /**
     * CUÁNTAS CABEN. Antes era el factor 3.1 —un montón de tres hileras, 54 monedas
     * a 390 px— y la separación circular es O(n²): 54 monedas son 1431 parejas por
     * paso de física, 60 veces por segundo. Se bajó a dos hileras escasas, que es
     * lo que se ve de un montón contado sobre un mostrador, y las parejas caen a
     * menos de un tercio. El factor es visual; el costo, cuadrático.
     */
    MAX = Math.round((ancho / (radio * 2)) * 1.8);
    if (nucleos <= 4) MAX = Math.round(MAX * 0.62);
    // El tope bajó de 34 a 26: agrupadas en el centro se solapan muchas más parejas
    // que repartidas, y la separación es cuadrática. El montón se ve igual.
    MAX = Math.max(MINIMO, Math.min(MAX, 26));

    hacerSello();   // el radio cambió: hay que volver a acuñarla
  }

  // ── UNA MONEDA ────────────────────────────────────────────────────────────
  function nacer() {
    /**
     * SE SIEMBRAN HACIA EL CENTRO, no repartidas por todo el ancho.
     *
     * Repartidas al azar el resultado era una hilera de monedas de borde a borde:
     * una cenefa, que es adorno de plantilla. Concentradas hacen un MONTÓN, que es
     * la idea — el efectivo contado sobre el mostrador.
     *
     * La suma de dos aleatorios da un reparto triangular: denso en medio y raro en
     * los extremos, sin necesitar más código que esto.
     */
    var centro = ancho / 2 + (Math.random() + Math.random() - 1) * ancho * 0.3;
    return {
      x: Math.max(radio, Math.min(ancho - radio, centro)),
      y: -radio - Math.random() * alto * 0.5,
      vx: (Math.random() - 0.5) * 0.6,
      vy: Math.random() * 0.8,
      giro: Math.random() * Math.PI,
      vgiro: (Math.random() - 0.5) * 0.09,
      // Cada moneda se ve un poco distinta: un montón de clones se nota.
      tono: 0.72 + Math.random() * 0.28
    };
  }

  function fisica() {
    /**
     * EL SUELO SE MIDE CON EL SELLO, NO CON EL RADIO.
     *
     * Estaba en `alto - radio`, y el sello que se estampa mide `radio + borde` de
     * medio lado: el trazo exterior caía fuera del lienzo y la hilera de abajo salía
     * recortada. Medido: el oro llegaba a la fila 191 de 192.
     *
     * Es el tipo de fallo que ninguna de las cinco mediciones iba a decir —seguía
     * pintando, seguía amontonándose, seguía sin costar— y que se ve en cuanto se
     * mira una captura.
     */
    var borde = selloMitad || radio;
    var suelo = alto - borde;
    for (var i = 0; i < monedas.length; i++) {
      var m = monedas[i];
      m.px = m.x; m.py = m.y;     // dónde estaba, para saber si de verdad se movió
      m.vy += GRAVEDAD;
      m.x += m.vx;
      m.y += m.vy;
      m.giro += m.vgiro;

      // Paredes · con el mismo criterio del suelo: el sello entero, no el radio
      if (m.x < borde) { m.x = borde; m.vx = -m.vx * REBOTE; }
      else if (m.x > ancho - borde) { m.x = ancho - borde; m.vx = -m.vx * REBOTE; }

      // Suelo
      if (m.y > suelo) {
        m.y = suelo;
        m.vy = -m.vy * REBOTE;
        m.vx *= ROCE;
        m.vgiro *= 0.7;
        if (Math.abs(m.vy) < 0.7) m.vy = 0;
      }
    }

    // ── QUE SE AMONTONEN ──────────────────────────────────────────────────
    // Separación circular, una sola pasada. Dos pasadas se ven mejor y cuestan el
    // doble; con este número de monedas, una basta y el montón no tiembla.
    var d = radio * 2;
    for (var a = 0; a < monedas.length; a++) {
      for (var b = a + 1; b < monedas.length; b++) {
        var p = monedas[a], q = monedas[b];
        var dx = q.x - p.x, dy = q.y - p.y;
        var d2 = dx * dx + dy * dy;
        if (d2 >= d * d || d2 === 0) continue;

        var dist = Math.sqrt(d2);
        var sobra = (d - dist) / dist * 0.5;
        var ex = dx * sobra, ey = dy * sobra;
        p.x -= ex; p.y -= ey;
        q.x += ex; q.y += ey;

        // Un poco de la energía se reparte: si no, el montón queda rígido.
        var t = (q.vy - p.vy) * 0.12;
        p.vy += t; q.vy -= t;
        p.vx -= ex * 0.14; q.vx += ex * 0.14;
      }
    }

    /**
     * ¿SE MOVIÓ, O SOLO TIENE VELOCIDAD?
     *
     * La primera versión sumaba |vx|+|vy| y el montón no se asentaba NUNCA: medido,
     * 5684 ms de hilo en 6 s con todo quieto en pantalla. En un montón la gravedad
     * mete 0.34 de velocidad cada cuadro y la separación la devuelve entera, así que
     * una moneda apoyada conserva velocidad para siempre sin avanzar un píxel.
     *
     * Lo que importa es el DESPLAZAMIENTO: bajar y que te empujen de vuelta suma
     * cero. Y a la que no avanza se le quita la energía que le están reinyectando,
     * que es además lo que hace que el montón deje de temblar.
     */
    var movimiento = 0;
    for (var k = 0; k < monedas.length; k++) {
      var c = monedas[k];
      var paso = Math.abs(c.x - c.px) + Math.abs(c.y - c.py);
      movimiento += paso;
      if (paso < 0.16) {
        c.vx *= 0.5; c.vy = 0; c.vgiro *= 0.5;
        /**
         * LA QUE SE PARA, SE PARA DE CARA.
         *
         * Sin esto el giro se congelaba en el ángulo que tocara, y media docena de
         * monedas quedaban de canto: rayas doradas de dos píxeles que se ven como
         * un fallo de dibujo, no como una moneda. Solo se notó al MIRAR la captura;
         * ninguna de las cinco medidas lo habría dicho nunca.
         *
         * Se lleva el giro al múltiplo de PI más cercano, que es la cara.
         */
        c.giro += (Math.round(c.giro / Math.PI) * Math.PI - c.giro) * 0.14;
      }
    }
    return movimiento;
  }

  // ── DIBUJO ────────────────────────────────────────────────────────────────
  /**
   * SE DIBUJA UNA MONEDA UNA VEZ Y DESPUÉS SE ESTAMPA.
   *
   * La primera versión trazaba cada moneda entera en cada cuadro: `save`, `translate`,
   * `scale`, dos `arc`, un `fill`, dos `stroke`, `restore`. Son doce llamadas por
   * moneda y ~384 por cuadro, y cada cambio de transformación obliga a rasterizar los
   * trazos otra vez. Medido con el reloj a 1/4: 5988 ms de hilo en una ventana de 6 s,
   * el hilo principal saturado de punta a punta mientras caían.
   *
   * Bajar los pasos de física no lo arregló —y era la sospecha obvia—: la caída se
   * alargaba y se pagaba lo mismo durante más rato. El costo estaba en el trazado, no
   * en las cuentas.
   *
   * Ahora la moneda se traza UNA vez en un lienzo aparte y por cuadro solo se copia,
   * que es una operación de textura. El achatamiento del giro sale gratis: es el
   * ancho de destino de la copia.
   *
   * Plana y de trazo, como sus íconos: un aro y un aro interior. Sin degradados
   * radiales ni brillos de plantilla.
   */
  var sello = null, selloMitad = 0;

  function hacerSello() {
    var borde = Math.max(1, radio * 0.13);
    var lado = Math.ceil((radio + borde) * 2);
    var c = document.createElement('canvas');
    c.width = Math.ceil(lado * dpr);
    c.height = Math.ceil(lado * dpr);
    var g = c.getContext('2d');
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.translate(lado / 2, lado / 2);
    g.lineWidth = borde;

    g.beginPath();
    g.arc(0, 0, radio, 0, 6.2832);
    g.fillStyle = ORO_HONDO;
    g.fill();
    g.strokeStyle = ORO;
    g.stroke();

    g.globalAlpha = 0.75;
    g.beginPath();
    g.arc(0, 0, radio * 0.54, 0, 6.2832);
    g.stroke();

    sello = c;
    selloMitad = lado / 2;
  }

  function pintar() {
    ctx.clearRect(0, 0, ancho, alto);
    if (!sello) return;
    var lado = selloMitad * 2;
    for (var i = 0; i < monedas.length; i++) {
      var m = monedas[i];
      // El giro achata la moneda: gira sobre su eje, no rueda por el suelo.
      var w = lado * Math.max(0.22, Math.abs(Math.cos(m.giro)));
      ctx.globalAlpha = m.tono;
      ctx.drawImage(sello, m.x - w / 2, m.y - selloMitad, w, lado);
    }
    ctx.globalAlpha = 1;
  }

  // ── EL RELOJ ──────────────────────────────────────────────────────────────
  function cuadro(ahora) {
    if (!vivo) return;
    var dt = Math.min(ahora - ultimo, 100);   // una pestaña que vuelve no salta
    ultimo = ahora;
    acumulado += dt;

    // Siembra escalonada: aparecen de a poco, como se cuenta el dinero.
    if (sembradas < MAX) {
      proxima -= dt;
      if (proxima <= 0) { monedas.push(nacer()); sembradas++; proxima = 55; }
    }

    /**
     * EL TOPE DE PASOS ES 2, Y ANTES ERA 5. Ese 5 era una espiral de muerte en el
     * teléfono del contrato: procesador lento → cuadros largos → más pasos de física
     * por cuadro → más lento todavía. Justo al revés de lo que hace falta.
     *
     * Medido con el reloj a 1/4: con tope 5, la caída gastaba 4004 ms de hilo en una
     * ventana de 4 s. Saturado. Quien va con prisa abre la página y el hilo está
     * ocupado contando monedas.
     *
     * Con 2, si el aparato no da para más, el montón cae un poco más despacio. Eso
     * es exactamente lo que debe pasar: degrada el adorno, no la página.
     */
    /**
     * ── SI EL APARATO NO DA, SE QUITAN MONEDAS ───────────────────────────
     *
     * `hardwareConcurrency` NO sirve para esto: un teléfono barato reporta ocho
     * núcleos igual que un portátil, y medido con el reloj a 1/4 la página caía a
     * 19.1 fps mientras el contador de núcleos decía que todo iba bien.
     *
     * Así que el script se mide a sí mismo. Si los cuadros vienen largos, tira
     * monedas hasta que dejen de venir largos. La separación es O(n²): quitar
     * cuatro monedas de veintiséis no descuenta un 15 % de trabajo, descuenta un 28 %.
     *
     * En un aparato que va bien esto no se dispara nunca y no cuesta nada.
     */
    if (dt > 30) lentitud++; else lentitud = lentitud > 0 ? lentitud - 1 : 0;
    if (lentitud > 10 && monedas.length > MINIMO) {
      monedas.length = Math.max(MINIMO, monedas.length - 4);
      MAX = monedas.length;
      sembradas = MAX;
      lentitud = 0;
    }

    var vueltas = 0, movimiento = 0;
    while (acumulado >= PASO && vueltas < 2) { movimiento = fisica(); acumulado -= PASO; vueltas++; }
    if (acumulado > PASO * 4) acumulado = PASO;   // no se acumula deuda imposible
    pintar();

    // ── EL BUCLE SE MUERE SOLO ────────────────────────────────────────────
    // Sembradas todas y sin energía: se acabó. El lienzo se queda con su último
    // cuadro pintado —nadie lo borra— y el hilo principal queda libre.
    if (sembradas >= MAX && movimiento < monedas.length * 0.05) quietas++;
    else quietas = 0;
    if (quietas > 24) { asentado = true; parar(); return; }

    requestAnimationFrame(cuadro);
  }

  function arrancar() {
    if (vivo || quieto || !listo) return;
    vivo = true;
    quietas = 0;
    ultimo = performance.now();
    acumulado = 0;
    requestAnimationFrame(cuadro);
  }
  function parar() { vivo = false; }

  /** Sin movimiento: se simula el montón a puerta cerrada y se pinta ya asentado. */
  function montonQuieto() {
    monedas = [];
    for (var i = 0; i < MAX; i++) monedas.push(nacer());
    for (var p = 0; p < 420; p++) fisica();
    pintar();
  }

  function reconsiderar() {
    if (quieto) { parar(); montonQuieto(); return; }
    // `asentado` manda: volver a mirar un montón que ya cayó no lo tira otra vez.
    if (visible && enPantalla && !asentado) arrancar(); else parar();
  }

  // ── CUÁNDO CORRE ──────────────────────────────────────────────────────────
  visible = !document.hidden;
  document.addEventListener('visibilitychange', function () {
    visible = !document.hidden;
    reconsiderar();
  });

  if (window.IntersectionObserver) {
    new IntersectionObserver(function (entradas) {
      enPantalla = entradas[0].isIntersecting;
      reconsiderar();
    }, { threshold: 0.01 }).observe(lienzo);
  } else {
    enPantalla = true;
  }

  if (mq) {
    var cambio = function () { quieto = mq.matches; monedas = []; sembradas = 0; medir(); reconsiderar(); };
    if (mq.addEventListener) mq.addEventListener('change', cambio);
    else if (mq.addListener) mq.addListener(cambio);
  }

  // ── TOCARLO ───────────────────────────────────────────────────────────────
  // Lo único que JavaScript aporta y el CSS no puede: que reaccione a la mano.
  // `pointer-events` lo activa solo el CSS del componente, y solo en punteros finos
  // más el toque directo: nadie que venga con prisa pierde un scroll por esto.
  function empujar(cx, cy, fuerza) {
    if (quieto) return;
    var movido = false;
    var alcance = radio * 7;
    for (var i = 0; i < monedas.length; i++) {
      var m = monedas[i];
      var dx = m.x - cx, dy = m.y - cy;
      var d2 = dx * dx + dy * dy;
      if (d2 > alcance * alcance || d2 === 0) continue;
      var d = Math.sqrt(d2);
      var f = (1 - d / alcance) * fuerza;
      m.vx += (dx / d) * f;
      m.vy += (dy / d) * f - f * 0.35;
      m.vgiro += (Math.random() - 0.5) * 0.2;
      movido = true;
    }
    // La mano es lo único que resucita el bucle después de que se asentó.
    if (movido && asentado) { asentado = false; reconsiderar(); }
  }

  function desde(e) {
    var caja = lienzo.getBoundingClientRect();
    return [e.clientX - caja.left, e.clientY - caja.top];
  }

  lienzo.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;   // el dedo es para desparramar, no para rozar
    var p = desde(e);
    empujar(p[0], p[1], 1.5);
  }, { passive: true });

  lienzo.addEventListener('pointerdown', function (e) {
    var p = desde(e);
    empujar(p[0], p[1], 7);
  }, { passive: true });

  // ── ARRANQUE ──────────────────────────────────────────────────────────────
  medir();
  if (quieto) montonQuieto();

  /**
   * NO EMPIEZA HASTA QUE LA PÁGINA TERMINÓ DE CARGAR.
   *
   * El titular de esta página es su LCP, y la audiencia del contrato llega por 4G
   * con un aparato lento. Un adorno que pelea por el hilo principal mientras se
   * pinta el titular es un adorno que empeora el número que sí importa.
   *
   * Primero carga la página. Después, si sobra, caen las monedas.
   */
  function despertar() {
    if (listo) return;
    listo = true;
    reconsiderar();
  }
  function alRalenti() {
    if (window.requestIdleCallback) requestIdleCallback(despertar, { timeout: 1200 });
    else setTimeout(despertar, 260);
  }
  if (document.readyState === 'complete') alRalenti();
  else window.addEventListener('load', alRalenti, { once: true });

  var temporizador;
  window.addEventListener('resize', function () {
    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
      medir();
      // OJO: `medir()` reasigna `lienzo.width`, y eso BORRA el lienzo. Si el montón
      // ya se había asentado, el bucle está muerto y la banda se quedaría en blanco.
      // Así que después de medir SIEMPRE hay que volver a pintar algo.
      if (quieto) { montonQuieto(); return; }
      // Las que ya no caben se van; el resto se reacomoda solo con la física.
      if (monedas.length > MAX) { monedas.length = MAX; sembradas = MAX; }
      for (var i = 0; i < monedas.length; i++) monedas[i].vy -= 1;
      asentado = false;
      reconsiderar();
    }, 160);
  }, { passive: true });
})();

<script lang="ts">
  /**
   * El proceso como circuito, no como párrafo · ADR-0042.
   *
   * ── QUÉ PROBLEMA RESUELVE ─────────────────────────────────────────────────
   * La sección 2 servía 52 palabras para contar lo que el hero ya había contado en
   * 14: el subtitular y los tres pasos repetían, en prosa, la `TiraPasos` del
   * ADR-0024. Medido en el HTML construido antes de tocar nada — las cuatro
   * versiones del mismo proceso convivían en `/empeno-y-prestamo/index.html`.
   *
   * ── POR QUÉ UN CÍRCULO Y NO UNA LISTA ─────────────────────────────────────
   * La lista numerada dibuja una recta: 01 → 02 → 03. Para alguien que está
   * decidiendo si deja su reloj en un mostrador, una recta dice «tu bien entra y no
   * vuelve a aparecer». Y es falso: el bien vuelve, y eso estaba escrito —una sola
   * vez, al final del subtitular, donde nadie llega con prisa.
   *
   * El corchete punteado que abraza la columna es esa frase, dibujada. Es lo único
   * de esta pieza que comunica algo que el texto no repite a gritos, así que es lo
   * único que se defiende como imprescindible.
   *
   * ── SE DIBUJA SOLO DONDE ES CIERTO ────────────────────────────────────────
   * El corchete depende de `retorno`, que hoy solo tiene empeño. Una máquina que
   * vendes no vuelve y un flete no vuelve: en esos giros el flujo es una recta
   * porque esos procesos SON una recta. La condición vive en el dato, no aquí.
   *
   * ── CERO JAVASCRIPT, Y DESDE EL ADR-0050 CON MOVIMIENTO ───────────────────
   * No hay `<script src>` ni observador: el movimiento es CSS, así que esta pieza no
   * mueve el presupuesto de CA-10 en ninguna de las páginas de línea.
   *
   * Hasta el ADR-0050 no se movía y por eso no llevaba bloque `prefers-reduced-motion`.
   * Ahora lo lleva, y envuelve TODO el movimiento. Ver «EL MOVIMIENTO», en el estilo.
   *
   * ── UNA SOLA GEOMETRÍA, A TODOS LOS ANCHOS ────────────────────────────────
   * Vertical en teléfono y en escritorio, dentro de una columna de 56ch. La versión
   * horizontal a partir de 768px existió y se tiró: el corchete de retorno tenía que
   * pasar por debajo de cuatro columnas y su geometría dejaba de ser la misma en los
   * dos anchos, o sea dos piezas que mantener en vez de una. La audiencia del
   * contrato entra por teléfono; escritorio hereda, no manda.
   */
  import Icono from './Icono.svelte';
  import type { PasoFlujo } from '$lib/datos/giros';

  interface Props {
    pasos: PasoFlujo[];
    /** Solo si el proceso devuelve el bien. Su presencia dibuja el corchete. */
    retorno?: PasoFlujo;
  }
  let { pasos, retorno }: Props = $props();

  /**
   * El retorno entra en la MISMA lista ordenada, como último elemento. Es el cuarto
   * momento en el tiempo, así que para un lector de pantalla es «4 de 4» y no un
   * adorno colgado al final. Lo que cambia es cómo se pinta, no qué es.
   */
  const momentos = $derived(retorno ? [...pasos, retorno] : pasos);
</script>

<!-- `--momentos` y `--i` son el reloj de la luz · ADR-0050: cada momento tiene su ranura
     de 1.2 s y la vuelta por el corchete arranca después del último. -->
<ol class="flujo" class:ciclo={!!retorno} data-propuesta="true" style="--momentos: {momentos.length}">
  {#each momentos as m, n}
    <li style="--i: {n}">
      <span class="marca" aria-hidden="true"><Icono nombre={m.icono} tam={19} grosor={1.7} /></span>
      <span class="texto">
        <span class="que">{m.que}</span>
        {#if m.dato}<span class="dato">{m.dato}</span>{/if}
      </span>
    </li>
  {/each}
</ol>

<style>
  .flujo {
    position: relative;
    list-style: none;
    margin: var(--e-6) 0 0;
    padding: 0;
    max-width: 56ch;
  }

  /* El corchete necesita carril propio a la izquierda. Sin retorno no hay corchete y
     la columna no paga ese sangrado. */
  .ciclo { padding-left: 26px; }

  li {
    position: relative;
    display: grid;
    grid-template-columns: 36px 1fr;
    gap: var(--e-3);
    padding-bottom: var(--e-6);
  }
  li:last-child { padding-bottom: 0; }

  /* LA ESPINA, tramo a tramo. Cada momento dibuja el segmento que baja hacia el
     siguiente; el último no dibuja ninguno. Así la línea siempre mide exactamente lo
     que mide el texto, sin que nadie calcule alturas. */
  li::before {
    content: '';
    position: absolute;
    left: 17px;
    top: 36px;
    bottom: 0;
    border-left: 2px solid var(--oro-500);
  }
  li:last-child::before { content: none; }

  /* EL TRAMO QUE ENTRA AL RETORNO VA PUNTEADO. `nth-last-child(2)` y no una clase:
     el retorno es siempre el último de la lista —lo garantiza `momentos`—, así que
     el penúltimo es siempre el que lo precede. */
  .ciclo li:nth-last-child(2)::before { border-left-style: dashed; }

  /* EL CORCHETE. Abraza la columna entera de arriba abajo y se cierra por la
     izquierda: el bien sale por abajo y vuelve por arriba. Se ancla al `<ol>`, así
     que crece con la lista y no hay una sola altura escrita a mano.

     ANCHO 20 Y RADIO 10, y los dos números importan. La primera versión medía 12 de
     ancho con radio 12: el radio se comía el brazo entero, así que arriba y abajo no
     quedaba ni un píxel de recta y la pieza se leía como una línea punteada con dos
     ganchos. Con 20 de ancho y radio 10 quedan 10 px de brazo horizontal a cada
     extremo, que es lo que apunta hacia el primer y el último disco y cierra el giro.
     Se vio en pantalla a 375 px; no se dedujo.

     Arriba y abajo se anclan a 18 px, el centro del disco: el corchete sale del
     primero y entra al último, no de los bordes de la lista. */
  .ciclo::before {
    content: '';
    position: absolute;
    left: 0;
    top: 18px;
    bottom: 18px;
    width: 20px;
    border: 2px dashed var(--oro-500);
    border-right: 0;
    border-radius: 10px 0 0 10px;
    pointer-events: none;
  }

  .marca {
    width: 36px;
    height: 36px;
    border-radius: var(--radio-pastilla);
    background: var(--oro-500);
    color: var(--negro-950);           /* 11.12:1 · el trazo pide 3:1 y sobra */
    display: grid;
    place-items: center;
  }

  /* EL RETORNO SE PINTA HUECO. Los tres primeros momentos son cosas que pasan en el
     mostrador hoy; éste pasa después y lo dispara el visitante. Relleno contra
     contorno dice esa diferencia sin una palabra. */
  .ciclo li:last-child .marca {
    background: var(--superficie);
    border: 2px solid var(--oro-500);
    color: var(--oro-texto-grande);    /* ADR-0046 · rol: oro-800 en claro, oro-500 sobre pavonado (7.73:1). A mano daba 2.91 */
  }

  .texto {
    display: grid;
    gap: var(--e-1);
    align-content: center;
    justify-items: start;
  }

  .que {
    font-size: var(--cuerpo-tam);
    font-weight: var(--cuerpo-fuerte-peso);
    line-height: 1.25;
  }

  /* EL CHIP · aquí viven los datos que el ADR-0040 dejó sin otro sitio: la
     identificación vigente, el contrato y el resguardo. Van en TINTA y no en oro:
     `--oro-800` sobre claro da 3.47:1 y eso es piso de display, no de texto de 14px.
     Es la regla del `tokens.css`, no una preferencia. */
  .dato {
    font-size: var(--pie-tam);
    line-height: var(--pie-alto);
    color: var(--tinta-secundaria);
    background: var(--superficie-alterna);
    padding: 3px var(--e-2);
    border-radius: var(--radio-pastilla);
  }

  /* ══ EL MOVIMIENTO · ADR-0050 ═════════════════════════════════════════════
     Dos capas que Nadir eligió juntas entre tres prototipos:

       A · LA LUZ QUE DA LA VUELTA. Una luz baja por cada tramo, cada disco late cuando
           llega y, si hay retorno, la luz sube por el corchete. Bucle de 7.2 s con una
           ranura de 1.2 s por momento: todas las piezas comparten duración, así que el
           retraso por índice (`--i`) las mantiene en fase para siempre.
       C · LA SECCIÓN SE ARMA AL BAJAR. Va atada al desplazamiento, no al reloj: cada
           tramo se traza, cada disco se enciende y cada texto entra cuando su paso llega
           a la pantalla. Si se sube, se deshace.

     C ESCONDE TEXTO HASTA QUE LLEGA, y eso contradice la regla de movimiento de
     `tokens.css`. Se eligió sabiéndolo. Lo que cuesta, dicho: quien se detenga a medio
     deslizar ve el último paso a medio aparecer, y ningún validador de este repo lo
     caza, porque miden colores y no opacidad. Al cargar no pasa: medido, la lista
     empieza a 1329 px o más en las cinco páginas, en pantallas de hasta 2560×1440.

     SOLO TRANSFORM, OPACITY Y VISIBILITY. El prototipo dibujaba la luz recortando con
     `clip-path` y, con el procesador a 1/4, ocupaba 3.8–4.1 s de hilo principal por
     cada ciclo de 7.2 s: repintaba el acero pavonado en cada cuadro. Trasladando una
     luz ya pintada, 52–91 ms. Por eso la luz es una cabeza con estela que VIAJA y no una
     línea que CRECE, y por eso el tramo punteado y el corchete APARECEN en vez de
     trazarse: escalar un punteado estira los puntos, y escalar el corchete aplasta sus
     curvas.

     DOS GUARDIAS, LOS DOS OBLIGATORIOS, y los vigila `tests/movimiento-flujo.test.ts`:
       · `prefers-reduced-motion: no-preference` envuelve TODO. Con «reducir movimiento»
         no hay luces ni armado: la sección se ve como antes del ADR-0050.
       · `@supports (animation-timeline: view())` envuelve C. Donde el navegador no lo
         soporta nada se esconde, y A sigue. */
  @media screen and (prefers-reduced-motion: no-preference) {
    /* A · la luz de cada tramo. El elemento mide el tramo entero y se TRASLADA: cabeza y
       estela van pintadas arriba y no se vuelven a pintar. */
    li::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 36px;
      bottom: 0;
      width: 24px;
      background:
        radial-gradient(circle at 50% 24px, var(--luz-circuito) 0 4px, var(--halo-circuito) 5px, transparent 12px),
        linear-gradient(to bottom, transparent, var(--halo-circuito)) 50% 0 / 4px 24px no-repeat;
      opacity: 0;
      pointer-events: none;
      animation: tramo 7.2s linear calc(var(--i) * 1.2s + 0.3s) infinite;
    }
    li:last-child::after { content: none; }

    /* A · el latido del disco cuando la luz llega. */
    .marca { position: relative; }
    .marca::after {
      content: '';
      position: absolute;
      inset: -2px;
      border: 2px solid var(--luz-circuito);
      border-radius: var(--radio-pastilla);
      opacity: 0;
      pointer-events: none;
      animation: latido 7.2s ease-out calc(var(--i) * 1.2s) infinite;
    }

    /* A · la vuelta: la luz sube por el corchete con la estela debajo, y arranca después
       del último momento. */
    .ciclo::after {
      content: '';
      position: absolute;
      left: -11px;
      top: 18px;
      bottom: 18px;
      width: 24px;
      background:
        radial-gradient(circle at 50% calc(100% - 24px), var(--luz-circuito) 0 4px, var(--halo-circuito) 5px, transparent 12px),
        linear-gradient(to bottom, var(--halo-circuito), transparent) 50% 100% / 4px 24px no-repeat;
      opacity: 0;
      pointer-events: none;
      animation: vuelta 7.2s ease-in-out calc(var(--momentos) * 1.2s) infinite;
    }
    /* …y el disco del retorno hace el gesto de volver cuando le toca. */
    .ciclo li:last-child .marca :global(svg) {
      animation: giro 7.2s ease-in-out calc(var(--i) * 1.2s) infinite;
    }

    @supports (animation-timeline: view()) {
      .flujo { view-timeline: --flujo-lista block; }
      li { view-timeline: --flujo-paso block; }

      /* C · cada tramo se traza hacia abajo… */
      li::before {
        transform-origin: top;
        animation: trazo linear both;
        animation-timeline: --flujo-paso;
        animation-range: cover 30% cover 55%;
      }
      /* …menos el punteado y el corchete, que aparecen. */
      .ciclo li:nth-last-child(2)::before { animation-name: aparece; }
      .ciclo::before {
        animation: aparece linear both;
        animation-timeline: --flujo-lista;
        animation-range: contain 0% contain 45%;
      }
      /* C · el disco se enciende y el texto entra, un poco antes que el tramo. */
      .marca {
        animation: disco linear both;
        animation-timeline: --flujo-paso;
        animation-range: cover 12% cover 32%;
      }
      .ciclo li:last-child .marca { animation-name: disco-retorno; }
      .texto {
        animation: entra linear both;
        animation-timeline: --flujo-paso;
        animation-range: cover 8% cover 30%;
      }

      /* La luz de A no corre por un tramo que C todavía no trazó, ni sube por un
         corchete que no apareció. Con `visibility` y no con `opacity`, porque la
         opacidad ya la anima la luz y dos animaciones sobre la misma propiedad se pisan. */
      li::after {
        animation: tramo 7.2s linear calc(var(--i) * 1.2s + 0.3s) infinite, encender linear both;
        animation-timeline: auto, --flujo-paso;
        animation-range: normal, cover 30% cover 55%;
      }
      .ciclo::after {
        animation: vuelta 7.2s ease-in-out calc(var(--momentos) * 1.2s) infinite, encender linear both;
        animation-timeline: auto, --flujo-lista;
        animation-range: normal, contain 0% contain 45%;
      }
    }
  }

  @keyframes tramo {
    0%        { opacity: 0; transform: translateY(-24px); }
    3%        { opacity: 1; }
    15%       { opacity: 1; transform: translateY(calc(100% - 24px)); }
    18%, 100% { opacity: 0; transform: translateY(calc(100% - 24px)); }
  }
  @keyframes latido {
    0%        { opacity: 0.95; transform: scale(1); }
    11%, 100% { opacity: 0; transform: scale(1.75); }
  }
  @keyframes vuelta {
    0%        { opacity: 0; transform: translateY(0); }
    3%        { opacity: 1; }
    19%       { opacity: 1; transform: translateY(calc(-100% + 48px)); }
    23%, 100% { opacity: 0; transform: translateY(calc(-100% + 48px)); }
  }
  @keyframes giro {
    0%, 11%, 100% { transform: rotate(0deg); }
    5%            { transform: rotate(-40deg); }
  }
  @keyframes trazo         { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  @keyframes aparece       { from { opacity: 0; } to { opacity: 1; } }
  @keyframes disco         { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: none; } }
  @keyframes disco-retorno { from { opacity: 0; transform: scale(0.6) rotate(-180deg); } to { opacity: 1; transform: none; } }
  @keyframes entra         { from { opacity: 0; transform: translateX(-14px); } to { opacity: 1; transform: none; } }
  @keyframes encender      { 0%, 99% { visibility: hidden; } 100% { visibility: visible; } }
</style>

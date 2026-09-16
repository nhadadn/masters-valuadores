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
   * vendes no vuelve y un flete no vuelve: en esos tres giros el flujo es una recta
   * porque esos procesos SON una recta. La condición vive en el dato, no aquí.
   *
   * ── CERO JAVASCRIPT ───────────────────────────────────────────────────────
   * No hay `<script src>`, no hay observador y no hay animación de entrada. Todo es
   * CSS estático, así que esta pieza entra en las CUATRO páginas de giro sin mover
   * el presupuesto de CA-10 — y tres de ellas siguen en 0 KB, como estaban.
   *
   * Por lo mismo NO lleva bloque `prefers-reduced-motion`: no hay nada que reducir.
   * El día que se le añada movimiento, ese bloque es obligatorio.
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

<ol class="flujo" class:ciclo={!!retorno} data-propuesta="true">
  {#each momentos as m}
    <li>
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
</style>

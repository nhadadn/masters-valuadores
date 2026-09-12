<script lang="ts">
  /**
   * La unidad de la página. Alterna blanco y crema entre secciones consecutivas:
   * el contraste de superficie basta y no cuesta pintura ni sombras.
   * El margen lateral de 20 vive aquí y en ningún otro lado.
   */
  import type { Snippet } from 'svelte';
  import ReglaDorada from './ReglaDorada.svelte';

  interface Props {
    fondo?: 'blanco' | 'crema' | 'marmol' | 'oscuro';
    amplia?: boolean;
    etiqueta?: string;
    id?: string;
    children: Snippet;
  }
  let { fondo = 'blanco', amplia = false, etiqueta, id, children }: Props = $props();
</script>

<section {id} class="seccion {fondo}" class:amplia>
  <div class="caja">
    <!-- ADR-0007 §6: la regla se repite como divisor entre bloques. Va con la
         etiqueta, que es donde empieza el bloque, y solo si hay etiqueta: una regla
         suelta sin nada que separar es adorno, no lenguaje. -->
    {#if etiqueta}
      <p class="etiqueta">{etiqueta}</p>
      <div class="divisor"><ReglaDorada /></div>
    {/if}
    {@render children()}
  </div>
</section>

<style>
  .seccion { padding: var(--seccion-vertical) var(--margen-lateral); }
  .amplia { padding-block: var(--seccion-vertical-amplia); }
  .caja { max-width: var(--ancho-maximo); margin-inline: auto; }

  /* Degradados dentro de una banda de luminancia · ADR-0010. El peor extremo de
     cada uno está calculado en tokens.css; ninguno baja de 15:1 con su tinta. */
  /* ── DOS REGISTROS, COMO SU MARCA · ADR-0019 ──────────────────────────────
     Aquí decía: «NINGUNA sección pinta fondo · ADR-0012. […] Las tres variantes
     quedan como el mismo cristal; se conservan porque todavía resuelven tintas y
     porque **volver a diferenciarlas es cambiar esto y nada más**.»

     Se cumplió: es esto y nada más. La puerta quedó abierta a propósito y la tanda
     del 11 de septiembre dio la razón para cruzarla — su material tiene dos
     registros y el sitio se había quedado con uno, el más oscuro de los dos.

     `blanco` y `oscuro` siguen dejando pasar el campo. `crema` pasa a ser el
     REGISTRO CLARO y lo hace de la única forma que este sistema permite: **cambiando
     el valor de los roles, no el CSS de los componentes**. Todo lo que hay dentro
     —tarjetas, huecos, botones, insignias, el destello— lee estos mismos nombres y
     se da la vuelta solo. Ningún componente sabe en qué registro está. */
  .blanco,
  .oscuro { background: transparent; color: var(--tinta-sobre-oscuro); }

  .crema,
  .marmol {
    /* EL COLOR PLANO VA ADEMÁS DEL DEGRADADO, y con el PEOR extremo.
       Un `background-image` deja el `background-color` en transparente, así que
       cualquiera que resuelva el fondo —el validador de contraste, y también un
       navegador que falle al pintar el degradado— acaba leyendo el campo oscuro de
       `body` que hay detrás. Ya pasó una vez con los botones y se midió 1:1 sobre
       texto que en pantalla daba 9.29:1.
       Se declara `--crema-100`, el extremo MÁS OSCURO de la rampa, para que la
       medición salga pesimista y nunca optimista. */
    background-color: var(--crema-100);
    background-image: var(--grad-claro);
    color: var(--tinta);

    /* Superficies: la tarjeta es BLANCA y se levanta del campo de acero. Es como
       funcionan sus piezas — un panel encima de un campo, no algo flotando. */
    --panel: var(--blanco);
    --panel-borde: var(--negro-400);      /* 3.49:1 · piso de borde no-texto */
    --superficie: var(--blanco);
    --superficie-alterna: var(--crema-025);
    --superficie-oscura: var(--negro-950);

    /* Tintas invertidas. Los ratios son los de tokens.css sobre blanco. */
    --tinta: var(--negro-950);            /* 19.44:1 */
    --tinta-secundaria: var(--negro-600); /*  8.68:1 */
    --tinta-suave: var(--negro-600);
    --borde-campo: var(--negro-500);      /*  5.90:1 */

    /* `--tinta-sobre-oscuro` NO se toca, y el validador enseñó por qué. Se redefinió
       a negro pensando que significaba «la tinta del fondo de la sección», y significa
       lo que dice: tinta sobre una superficie OSCURA. El rótulo «FOTO DE ARCHIVO»
       pinta su propia pastilla oscura y lo usa para su texto — quedó negro sobre
       negro, 1:1, en las cuatro tarjetas de la portada.
       El campo claro ya resuelve su tinta con `color: var(--tinta)`, arriba. */

    /* EL ORO SOBRE CLARO SOLO ES TEXTO GRANDE, y eso ya estaba escrito en
       tokens.css: «el oro como texto va sobre --superficie o sobre oscuro, NUNCA
       sobre --superficie-alterna». El campo de acero es esa superficie alterna.

       Medido: `--oro-800` sobre `--crema-100` da 3.47:1. Pasa el piso de 3 del texto
       grande y NO pasa el 4.5 del texto normal — el validador lo cazó en «Cómo
       llegar», 17 px en negrita.

       Es exactamente lo que hacen sus piezas claras: en la nº 8 el titular grande va
       en oro y todo lo demás en negro. Así que el par de tokens que ya existía para
       esto se usa para esto:

         --oro-texto         texto normal  → en claro NO hay oro. Va tinta.
         --oro-texto-grande  display       → oro, con 3.36:1

       No se inventa un oro más oscuro para tapar el caso: sería un color que la
       marca no usa, y tokens.css ya lo prohíbe por escrito. */
    --oro-texto: var(--negro-950);
    --oro-texto-grande: var(--oro-800);
  }

  /* El mármol es el MISMO registro claro —hereda todos los roles de arriba— con otra
     superficie debajo. Nada de tintas cambia, así que nada de contraste cambia: la
     base de la pila de degradados es la misma rampa cálida y el color plano sigue
     siendo su peor extremo. Solo se le pone piedra encima. */
  .marmol { background-image: var(--marmol); }

  .etiqueta {
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    color: var(--tinta-secundaria);
    margin-bottom: var(--e-2);
  }
  .divisor { margin-bottom: var(--e-3); }
  .oscuro .etiqueta { color: var(--tinta-tenue-oscuro); }

  @media (min-width: 768px) {
    .seccion { padding-inline: var(--e-12); }
  }
</style>

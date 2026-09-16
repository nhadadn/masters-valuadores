<script lang="ts">
  /**
   * La unidad de la página. Alterna blanco y crema entre secciones consecutivas:
   * el contraste de superficie basta y no cuesta pintura ni sombras.
   * El margen lateral de 20 vive aquí y en ningún otro lado.
   */
  import type { Snippet } from 'svelte';
  import ReglaDorada from './ReglaDorada.svelte';

  interface Props {
    /**
     * Cuánta piedra deja ver esta sección · ADR-0028.
     *
     *   marmol   la entrada. Veta marcada, corrida a un extremo
     *   medio    el bloque de consulta
     *   tenue    donde manda la fotografía: bienes y patio
     *   marfil   proceso y ubicación. Sin veta: claridad
     *   piedra   «otras líneas». Sólida, escalón hacia el pie
     *   carbon   ancla oscura
     *
     * `crema` y `blanco` siguen aceptados y apuntan a `marfil`: había código
     * llamándolos y romperlo no aporta nada.
     */
    fondo?: 'marmol' | 'medio' | 'tenue' | 'marfil' | 'piedra' | 'carbon' | 'blanco' | 'crema' | 'oscuro' | 'pavonado';
    amplia?: boolean;
    etiqueta?: string;
    id?: string;
    children: Snippet;
  }
  let { fondo = 'marfil', amplia = false, etiqueta, id, children }: Props = $props();
</script>

<section {id} class="seccion {fondo}" class:amplia class:registro-oscuro={fondo === 'carbon' || fondo === 'oscuro' || fondo === 'pavonado'}>
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

  /* ── CUÁNTA PIEDRA SE VE · ADR-0028 ──────────────────────────────────────
     El mármol es identidad de marca, no papel pintado: no va igual de fuerte en
     todas partes. Donde hay fotografía se calla; donde hay que impresionar, habla.

     EL COLOR PLANO VA ADEMÁS DEL DEGRADADO, y con el PEOR extremo. Un
     `background-image` deja el `background-color` en transparente, así que
     cualquiera que resuelva el fondo —el validador, y también un navegador que
     falle al pintar el degradado— acaba leyendo lo que haya detrás. Ya pasó una
     vez con los botones y se midió 1:1 sobre texto que en pantalla daba 9.29:1.

     Los cinco claros terminan en la MISMA rampa, así que el peor extremo es el
     mismo y el contraste no cambia entre ellos. Lo único que cambia es la veta. */
  /* ENMENDADO · ADR-0030. Ya no terminan todos en la misma rampa, porque cuatro de
     ellos ya no tienen rampa: son color plano. Así que el «peor extremo» se separa.

     La entrada conserva `--crema-100` porque su velo sí es un degradado y ese sigue
     siendo su extremo malo. Los demás valen el color plano real, no una hipótesis.

     BLANCO PURO desde el ADR-0031. Los nombres de los grados se quedan —son la API
     de este componente— pero cinco de ellos pintan hoy el mismo `--blanco`. Que
     `.crema` no pinte crema es deuda de nombre, y está anotada en el ADR. */
  .marmol { background-color: var(--crema-100); }
  /* ── EL SUELO VIVE EN UN SOLO SITIO · ADR-0043 ──────────────────────────
     Estos cinco grados pintaban `--blanco` cada uno por su cuenta. Funcionaba, pero
     dejaba el suelo repartido en cinco reglas: poner mañana una textura, un degradado
     o un color de fondo al sitio no se veía, porque cada sección lo tapaba con su
     propio blanco.

     Ahora son TRANSPARENTES y el suelo lo pone `body` en `base.css`, que es el único
     sitio donde hay que tocarlo. Es el campo libre que se pidió.

     NO SE PIERDE LA PRECAUCIÓN DEL ADR-0028. Aquella decía que un color plano
     declarado evita que el validador —o un navegador que falle al pintar— acabe
     leyendo lo que haya detrás. Sigue habiendo un color plano declarado: está en
     `body`, un nivel más arriba, y el recorrido de `validar-a11y` sube por los
     ancestros hasta encontrarlo. Comprobado: el contraste no se mueve un punto.

     La entrada conserva su `--crema-100` porque su velo SÍ es un degradado y ese
     sigue siendo su peor extremo; el pie conserva su carbón. */
  .medio,
  .tenue,
  .marfil,
  .crema,
  .blanco { background-color: transparent; }

  /* `cover` hace falta para la capa de textura. Desde el ADR-0030 solo LA ENTRADA
     lleva piedra; los otros cuatro grados valen `none` y se quedan en su color plano.
     Los tokens siguen existiendo con su nombre: la escala de cinco grados es la API
     de este componente y no se toca, pero hoy solo dos de los cinco pintan algo. */
  .marmol { background-image: var(--marmol-fuerte); background-size: cover; }
  .medio  { background-image: var(--marmol-medio); }
  .tenue  { background-image: var(--marmol-tenue); }
  .marfil,
  .crema,
  .blanco { background-image: var(--marfil); }

  /* Piedra: un punto más oscura, de escalón entre la página y el pie. */
  .piedra {
    background-color: var(--piedra-200);
    background-image: var(--piedra);
  }

  /* El ancla. Los roles se los da `.registro-oscuro`, en tokens.css. */
  .carbon,
  .oscuro {
    background-color: var(--carbon);
    background-image: none;
  }
  /* PAVONADO · ADR-0046. Acero oscuro cepillado: la entrada de las cinco páginas con
     hero y las salas. Lleva `.registro-oscuro`, así que los roles se dan la vuelta
     solos. El color plano es el punto MÁS CLARO del cepillado, que en oscuro es el
     peor. Y la etiqueta NO pasa a `--tinta-tenue-oscuro` como en `.oscuro`: sobre ese
     punto daría 3.34:1 en texto chico; con el rol, 4.83. */
  .pavonado {
    --borde-sutil: var(--pavonado-filete);
    /* EL ANILLO DE FOCO, aquí y no solo en `.registro-oscuro`. Sobre pavonado el
       negro-950 da 1.45–2.78:1: el foco de los botones de la entrada no se veía. El
       ADR-0045, en paralelo, lo da en blanco para todo el registro oscuro; este es el
       mismo valor —6.99–13.39:1—, así que al unir las dos ramas no cambia nada. */
    --foco-color: var(--blanco);
    background-color: var(--pavonado-peor);
    background-image: var(--pavonado);
    background-size: var(--pavonado-tam);
    background-repeat: var(--pavonado-repeticion);
  }

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

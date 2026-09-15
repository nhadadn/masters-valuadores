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
    fondo?: 'marmol' | 'medio' | 'tenue' | 'marfil' | 'piedra' | 'carbon' | 'blanco' | 'crema' | 'oscuro';
    amplia?: boolean;
    etiqueta?: string;
    id?: string;
    children: Snippet;
  }
  let { fondo = 'marfil', amplia = false, etiqueta, id, children }: Props = $props();
</script>

<section {id} class="seccion {fondo}" class:amplia class:registro-oscuro={fondo === 'carbon' || fondo === 'oscuro'}>
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
  .marmol,
  .medio,
  .tenue,
  .marfil,
  .crema,
  .blanco { background-color: var(--crema-100); }

  /* `cover` hace falta para la capa de textura; los degradados la ignoran sin daño. */
  .marmol { background-image: var(--marmol-fuerte); background-size: cover; }
  .medio  { background-image: var(--marmol-medio); background-size: cover; }
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

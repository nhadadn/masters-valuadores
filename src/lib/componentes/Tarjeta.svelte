<script lang="ts">
  /**
   * Tarjeta de giro. La tarjeta ENTERA es el objetivo táctil, no solo su título.
   *
   * El alto es FIJO y lo dicta el nombre más largo, no el más corto: medido en
   * navegador, «Renta de maquinaria y equipo» ocupa tres renglones a 143 de ancho
   * de columna y dos a 243. Si la tarjeta creciera con su contenido, la retícula
   * se desalinearía en cuanto un nombre pasara de renglón — y ese desalineo mueve
   * todo lo de abajo cuando carga la fuente, que es CLS en cada visita.
   */
  import Icono from './Icono.svelte';

  interface Props { href: string; titulo: string; icono: string; nota?: string; }
  let { href, titulo, icono, nota }: Props = $props();
</script>

<a {href} class="tarjeta">
  <span class="filo" aria-hidden="true"></span>
  <Icono nombre={icono} tam={26} />
  <span class="titulo">{titulo}</span>
  <!-- Dos cosas distintas con dos tratamientos distintos: sin `nota` esto es un
       rótulo de hueco —versalitas, borde punteado— y con `nota` es una frase que se
       lee, así que baja a peso normal y sin tracking de etiqueta. -->
  <span class="pie" class:frase={nota}>{nota ?? 'QUÉ RESUELVE — PENDIENTE'}</span>
</a>

<style>
  .tarjeta {
    display: flex;
    flex-direction: column;
    min-height: 176px;                 /* medido: caja de título de 79 = 3 renglones */
    padding: var(--e-4) var(--e-3);
    background: var(--superficie);
    border: 1px solid var(--negro-400);
    color: var(--tinta);
    transition: border-color var(--mov-tactil) var(--mov-curva);
  }
  .tarjeta:hover { border-color: var(--negro-950); }

  .filo { width: 26px; height: 3px; background: var(--oro-500); margin-bottom: var(--e-3); }

  .titulo {
    display: block;
    min-height: 79px;
    margin-top: var(--e-2);
    font-size: var(--cuerpo-tam);
    line-height: var(--cuerpo-alto);
    font-weight: var(--cuerpo-fuerte-peso);
  }
  .pie {
    margin-top: auto;
    padding-top: var(--e-2);
    border-top: 1px dashed var(--negro-400);
    font-size: 11px;
    line-height: 1.3;
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
    color: var(--tinta-secundaria);
  }
  /* El alto también es FIJO, por la misma razón que el del título: las frases van de
     uno a tres renglones y la retícula se desalineaba —medido, 191.3 contra 231.9 px—.
     Medido en navegador sobre las siete frases propuestas, a 156 px de columna:
     el peor caso es «Dejas un bien en garantía y sales con efectivo» con 69.9 px.
     Si el copy se alarga al corregirlo, hay que volver a medir. */
  .pie.frase {
    min-height: 70px;
    border-top: 1px solid var(--borde-sutil);
    font-size: var(--pie-tam);
    line-height: var(--pie-alto);
    font-weight: var(--cuerpo-peso);
    letter-spacing: normal;
  }

  /* A 243 de columna el nombre más largo cabe en dos renglones: la tarjeta baja. */
  @media (min-width: 768px) {
    .tarjeta { min-height: 150px; }
    .titulo { min-height: 53px; }
    /* A 271 px de columna el peor caso baja a dos renglones: 49.6 px, medido. */
    .pie.frase { min-height: 50px; }
  }
</style>

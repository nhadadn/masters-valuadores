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
  import Foto from './Foto.svelte';
  import Destello from './Destello.svelte';

  interface Props {
    href: string;
    titulo: string;
    icono: string;
    nota?: string;
    /**
     * Nombre base de la foto de la línea, en `static/fotos/`. Opcional a propósito:
     * una tarjeta sin foto sigue siendo una tarjeta completa, y el día que un giro
     * nuevo no tenga imagen no se rompe nada ni se inventa una.
     */
    foto?: string;
    /** La foto es del negocio: sin tinte ni rotulo de archivo. */
    fotoEsSuya?: boolean;
    /** Hasta que ancho existe el archivo. */
    fotoMaxAncho?: number;
    /** Describe LA FOTO. Nunca afirma que el local sea de Masters. */
    fotoAlt?: string;
    /** Posición en la retícula: escalona el destello. Ver `Destello.svelte`. */
    indice?: number;
  }
  let { href, titulo, icono, nota, foto, fotoAlt, fotoEsSuya = false, fotoMaxAncho = 1600, indice = 0 }: Props = $props();
</script>

<a {href} class="tarjeta" class:conFoto={foto}>
  <Destello {indice} />
  {#if foto}
    <!-- La foto va ARRIBA y el ícono sigue abajo con el título. Son dos cosas
         distintas: la foto dice de qué va la línea de un vistazo, el ícono la
         identifica en la retícula y se repite en la banda de la página del giro.
         Quitar el ícono habría roto ese hilo.

         `tamanos` sale de medir la ranura: dos columnas en teléfono, cuatro en
         escritorio. Sin eso cada miniatura de 175 px se bajaba el archivo de 800. -->
    <span class="banda">
      <Foto
        nombre={foto}
        alt={fotoAlt ?? ''}
        relacion="16 / 9"
        tamanos="(min-width: 768px) 25vw, 50vw"
        provisional={!fotoEsSuya}
        maxAncho={fotoMaxAncho}
        compacto
      />
    </span>
  {/if}
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
    /* `position` e `isolation` son lo que el destello necesita del contenedor; el
       `overflow` ya estaba para que la banda de foto llegue al borde. Ver la nota
       de requisitos en `Destello.svelte`. */
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    min-height: 176px;                 /* medido: caja de título de 79 = 3 renglones */
    padding: var(--e-4) var(--e-3);
    background: var(--superficie);
    border: 1px solid var(--negro-400);
    color: var(--tinta);
    overflow: hidden;                  /* la banda llega hasta el borde, sin asomarse */
    /* Solo `transform` y `border-color`: ninguno de los dos reflowea, así que la
       retícula no se mueve y no hay CLS. El alto fijo sigue intacto. */
    transition:
      border-color var(--mov-tactil) var(--mov-curva),
      transform var(--mov-tactil) var(--mov-curva);
  }
  .tarjeta:hover,
  .tarjeta:focus-visible {
    border-color: var(--negro-950);
    transform: translateY(var(--mov-elevacion));
  }
  /* El dedo espera que lo presionado baje. Sin esto, en táctil la tarjeta se queda
     levantada después del toque y parece trabada. */
  .tarjeta:active { transform: translateY(0); }

  /* ── LA BANDA DE FOTO ───────────────────────────────────────────────────
     La tarjeta tiene relleno; la foto no debe tenerlo. Los márgenes negativos la
     llevan hasta los tres bordes de arriba, que es lo que la hace leerse como una
     tarjeta y no como una foto metida en una caja.

     El alto lo reserva `Foto.svelte` con `aspect-ratio`, así que la retícula no se
     mueve cuando la imagen llega: el alto fijo de la tarjeta sigue valiendo. */
  .banda {
    display: block;
    margin: calc(var(--e-4) * -1) calc(var(--e-3) * -1) var(--e-4);
  }
  /* Con foto, el filo dorado va DEBAJO de ella y no arriba del todo: arriba
     competía con la imagen por el mismo renglón. */
  .conFoto .filo { margin-top: 0; }

  .filo {
    width: 26px; height: 3px; background: var(--oro-500); margin-bottom: var(--e-3);
    /* `scaleX` y no `width`: crecer con width dispara maquetación en cada cuadro. */
    transform-origin: left center;
    transition: transform var(--mov-tactil) var(--mov-curva);
  }
  .tarjeta:hover .filo,
  .tarjeta:focus-visible .filo { transform: scaleX(var(--mov-crecer)); }

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

<script lang="ts">
  /**
   * Fotografía de archivo · ADR-0009, PROVISIONAL.
   *
   * Esto revierte una parte del ADR-0007, que decía «En el sitio van fotos suyas o va
   * hueco». La decisión es de Nadir, del 10 de septiembre, con la objeción registrada
   * en el ADR-0009. No es una foto del negocio y no pretende serlo.
   *
   * CUATRO LÍMITES QUE VIENEN CON LA DECISIÓN:
   *
   *   1 · Se marca en pantalla. El rótulo dice que es de archivo y que se sustituye.
   *       Mismo criterio que la banda de BORRADOR del copy.
   *   2 · NINGUNA finge ser la fachada. Ese hueco no se rellena con un local ajeno:
   *       poner el escaparate de otro, con su rótulo, es el negocio de otro
   *       presentado como el de Cristóbal. `RanuraImagen` sigue ahí para eso.
   *   3 · Sin logotipos de terceros ni personas identificables.
   *   4 · Se revierte borrando `static/fotos/` y este archivo.
   *
   * PESO. La portada pesaba 4.5 KB de HTML y 0 KB de JavaScript; una foto de 68 KB es
   * quince veces eso. Por eso `srcset` con dos anchos —un teléfono de 390 baja el de
   * 800, no el de 1600—, `lazy` en todo lo que no sea la entrada, y `width`/`height`
   * declarados para que el hueco quede reservado y el CLS siga en cero.
   *
   * EL `alt` DESCRIBE LA FOTO, NO EL NEGOCIO. Decir «nuestro taller» en el alt sería
   * mentirle a quien no ve la pantalla, que es a quien menos se le puede mentir.
   */
  interface Props {
    /** Nombre base en `static/fotos/`, sin ancho ni extensión. */
    nombre: string;
    /** Describe LA FOTO. Nunca afirma que el local sea de Masters. */
    alt: string;
    relacion?: string;
    /** La de la entrada se carga de inmediato: es el LCP. El resto, diferida. */
    prioritaria?: boolean;
    /**
     * `true` = foto de archivo del ADR-0009: lleva rótulo y `data-provisional`.
     * `false` = foto REAL del negocio. Sin rótulo, porque no hay nada que advertir.
     */
    provisional?: boolean;
    /** Alto real del archivo, para reservar el hueco sin CLS. */
    alto?: number;
    /**
     * Rótulo corto. En una miniatura el aviso completo ocupaba 77 px sobre 179 de
     * imagen —el 43 %— y competía con la foto. Dice lo mismo con menos: sigue
     * diciendo que es de archivo, que es lo que no se puede omitir.
     */
    compacto?: boolean;
    /**
     * Corta el borde con la diagonal del ADR-0007. Solo para la fachada, por ahora:
     * el gesto se gasta si se repite cinco veces en una pantalla.
     */
    diagonal?: boolean;
  }
  let {
    nombre, alt, relacion = '16 / 9', prioritaria = false,
    provisional = true, alto = 1067, compacto = false, diagonal = false
  }: Props = $props();
</script>

<figure class="foto" data-provisional={provisional ? 'true' : undefined}>
  <!--
    EL TINTE ES EL AVISO, no un adorno · decisión de Nadir, 11 de septiembre.

    Las cuatro fotos de archivo eran cuatro mundos de color —cielo azul, cargador
    amarillo, camión azul, caja de herramienta roja— pegados en una página negra y
    dorada. Ninguna compartía paleta con la marca, y eso es lo que se leía como
    «sin diseño detrás».

    El duotono las vuelve una sola familia Y hace un segundo trabajo: **lo teñido no
    es suyo**. La fachada, que sí es suya, se queda a todo color y por contraste pasa
    a ser la imagen que manda en la portada. El tinte refuerza el ADR-0009 en vez de
    competir con su rótulo.

    Cómo, y por qué no de la forma obvia: ver la nota del duotono en el `<style>`.
    El primer intento tapaba la foto con una capa de oro y la anulaba.
  -->
  <div class="lienzo" class:tenida={provisional} class:cortada={diagonal}>
    <img
      src="/fotos/{nombre}-800.jpg"
      srcset="/fotos/{nombre}-800.jpg 800w, /fotos/{nombre}-1600.jpg 1600w"
      sizes="(min-width: 768px) 50vw, 100vw"
      {alt}
      width="1600"
      height={alto}
      loading={prioritaria ? 'eager' : 'lazy'}
      fetchpriority={prioritaria ? 'high' : 'auto'}
      decoding="async"
      style="aspect-ratio: {relacion}"
    />
    {#if provisional}
      <!--
        EL RÓTULO BAJA DE VOLUMEN, NO DE CONTENIDO.

        Era una barra de ancho completo bajo cada foto, en oro y en caps. En la reja de
        cuatro, el ojo leía «PROVISIONAL» cuatro veces antes de ver una sola imagen: el
        aviso era lo más fuerte del bloque.

        El ADR-0009 pide MARCARLAS, no que el rótulo grite más que la foto. Ahora es una
        pastilla en la esquina, sobre tierra oscura opaca, con el mismo texto y el mismo
        contraste. Sigue siendo `data-provisional` y sigue siendo legible.
      -->
      <figcaption class:compacto>
        {#if compacto}
          FOTO DE ARCHIVO
        {:else}
          FOTO DE ARCHIVO · se sustituye por una del negocio
        {/if}
      </figcaption>
    {/if}
  </div>
</figure>

<style>
  .foto { margin: 0; }
  .lienzo { position: relative; display: block; }
  img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    /* El hueco mientras carga. Era `--negro-100`, casi blanco: en un sitio oscuro
       cada foto entraba como un rectángulo claro y se iba apagando. Ahora el hueco
       ya es del color de la página. */
    background: var(--panel);
  }

  /* ── EL DUOTONO ──────────────────────────────────────────────────────────
     PRIMER INTENTO, DESCARTADO: capa de `--oro-500` en `mix-blend-mode: color`
     sobre la foto en gris. Integraba, sí, pero borraba la fotografía: el empeño
     quedó como una mancha dorada uniforme donde no se distinguía que eran relojes.
     Una foto ilegible no está integrada, está anulada.

     La causa es que `color` impone hue y saturación PLANOS sobre toda la imagen: el
     oro tiene una saturación altísima y aplasta el detalle de los medios tonos.

     Lo que sí funciona es teñir la rampa de grises en vez de taparla. `sepia` da la
     base cálida, `hue-rotate` la lleva del marrón al oro y `saturate` gradúa cuánto.
     Cada píxel conserva su luminosidad, así que el detalle sobrevive. */
  .tenida { background: var(--negro-950); }
  .tenida img {
    filter:
      grayscale(1)
      sepia(0.9)
      saturate(2.6)
      hue-rotate(-14deg)
      contrast(1.12)
      brightness(0.92);
  }

  /* ── LA DIAGONAL · ADR-0007, por fin sobre una fotografía ────────────────
     30° desde la vertical, el ángulo medido en sus cinco piezas
     (`--diagonal-tan: 0.57735`). El porcentaje sale de la geometría, no del ojo: en
     una caja 16:9 el alto es 0.5625 del ancho, así que una recta a 30° se desplaza
     0.5625 × 0.57735 = 0.3248 del ancho. De ahí el 32.48%.

     LA RECTA NO LLEGA HASTA ABAJO, Y ESO COSTÓ DOS INTENTOS MIRANDO EL RENDER.

     El brief de fotos pone una condición que manda sobre el gesto:
        «El letrero tiene que leerse completo en la foto. Si no se lee, la foto no
         sirve.»

     Intento 1 · corte abajo a la izquierda, creyendo que ahí solo había grava. A la
     altura del letrero —60 % de la caja— la recta ya se había comido un 19.5 % del
     ancho, y con él la primera letra de «EMPEÑO, COMPRA Y VENTA».

     Intento 2 · corte arriba a la izquierda, que quita cielo. Mejor, pero a media
     altura seguía quitando un 16 %, y el letrero seguía mordido.

     La conclusión no es de gusto, es aritmética: sobre una caja 16:9, CUALQUIER recta
     a 30° que recorra el alto entero quita ≥16 % del ancho a media altura, que es
     justo donde vive el letrero. El gesto completo y el letrero íntegro no caben en
     la misma fotografía.

     Así que la recta se acota al CIELO: baja solo el 40 % superior y ahí muere. Mismo
     ángulo —12.99 / 22.5 = 0.5774 = tan 30°—, misma inclinación hacia el bloque del
     titular, y por debajo del 40 % la foto queda entera. */
  .cortada {
    --corte-x: 12.99%;   /* 0.40 × 0.5625 × 0.57735 */
    --corte-y: 40%;
  }
  .cortada img {
    clip-path: polygon(var(--corte-x) 0, 100% 0, 100% 100%, 0 100%, 0 var(--corte-y));
  }

  /* Ya no hay capa que recortar: el tinte vive en el filtro de la imagen. */

  /* ── EL RÓTULO ──────────────────────────────────────────────────────────
     Pastilla en la esquina, no barra de ancho completo. `--superficie-oscura` es
     opaca, así que el validador resuelve el contraste contra ella y no contra la
     foto teñida: 19.44:1, el mismo de antes. */
  figcaption {
    position: absolute;
    z-index: 2;
    left: var(--e-2);
    bottom: var(--e-2);
    max-width: calc(100% - var(--e-4));
    background: var(--superficie-oscura);
    color: var(--tinta-sobre-oscuro);
    border-radius: var(--radio-boton);
    padding: var(--e-1) var(--e-2);
    font-size: var(--etiqueta-tam);
    line-height: var(--etiqueta-alto);
    font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking);
  }
</style>

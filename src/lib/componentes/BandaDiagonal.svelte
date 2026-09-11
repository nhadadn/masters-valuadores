<script lang="ts">
  /**
   * La diagonal · ADR-0007 §1.
   *
   * MÁXIMO UNA VISIBLE A LA VEZ. En sus piezas es un gesto único por composición, y
   * repetirlo lo vuelve ruido. Hoy se usa en un solo lugar de todo el sitio.
   *
   * SE RESUELVE CON `linear-gradient`, NO CON ARISTA DE SECCIÓN. Una arista superior
   * o inferior a lo ancho de la pantalla tiene un ángulo que depende de ese ancho:
   * a 360 y a 1280 no puede ser el mismo, y el ADR dice que el ángulo se congela en
   * un token. El degradado lo mantiene exacto en cualquier caja. Y a 30° desde la
   * vertical, una arista que cruzara 1280 px mediría 2 217 px de alto.
   *
   * EL ÁNGULO DEL DEGRADADO NO ES EL DEL BORDE. `linear-gradient` mide desde «to top»
   * en sentido horario y describe la LÍNEA del degradado, perpendicular al borde de
   * color: escribir 30deg daría un borde a 60° de la vertical, el doble del error.
   * Por eso se usa --diagonal-degradado, que es calc(90deg + --diagonal) = 120deg.
   * El borde resultante se inclina con la parte alta a la derecha, como en las cinco.
   *
   * VA SOBRE OSCURO. El oro sobre negro da 11.12:1 y es donde el gesto se lee. Sobre
   * claro daría 1.75:1: visible de cerca, invisible a plena luz, que es la condición
   * de esta audiencia.
   *
   * DÓNDE PUEDE VIVIR: solo sobre una masa oscura y ALTA. Se intentó como remate de la
   * ranura de foto de la entrada, para subirla al primer pliegue, y salió mal: una
   * barra negra con una mancha amarilla encima de una caja gris, sin cortar ni
   * enmarcar nada. La razón es geométrica y es la misma de la enmienda 5 —a 30° de la
   * vertical, el recorrido horizontal depende del ALTO de la caja:
   *
   *     alto  48 px  →   27.7 px de recorrido   ← la banda de remate: nada
   *     alto 197 px  →  113.7 px                ← ranura de foto a 390
   *     alto 371 px  →  214.2 px                ← ranura de foto a 1280
   *
   * Sobre 660 px de columna en escritorio, 27.7 px de recorrido no se leen como corte
   * porque no lo son.
   *
   * LO QUE ESTO NO ES: en sus piezas la diagonal corta una FOTOGRAFÍA contra un panel
   * de texto. Nace de que hay una masa oscura que cortar. Sin la foto de la fachada
   * esto es un gesto decorativo, no el gesto, y por eso vive donde el sitio sí tiene
   * masa oscura: la sección de contacto. Se muda a la entrada el día que exista la
   * foto. El ADR-0007 lo dice sin rodeos: el lenguaje visual acerca la mitad del
   * camino, y la otra mitad son fotos que no existen.
   */
</script>

<div class="banda" aria-hidden="true"></div>

<style>
  .banda {
    height: var(--e-12);
    /* Fondo propio: la banda entra a la sección oscura y empalma con ella, así el
       oro cae sobre negro y no sobre el blanco de la página.
       GRAFITO, no negro-950: desde el ADR-0010 la sección oscura ARRANCA en grafito y
       baja. Con negro-950 la banda quedaba más oscura que lo que tiene debajo y se
       veía la costura. Oro sobre grafito da 8.71:1. */
    background-color: var(--grafito);
    background-image: linear-gradient(
      var(--diagonal-degradado),
      transparent 0 calc(50% - var(--e-6)),
      var(--oro-500) calc(50% - var(--e-6)) calc(50% + var(--e-6)),
      transparent calc(50% + var(--e-6)) 100%
    );
  }
</style>

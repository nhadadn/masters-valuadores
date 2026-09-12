<script lang="ts">
  /**
   * La banda de monedas del pie de la entrada · ADR-0021.
   *
   * ES EL ÚNICO SITIO DEL PROYECTO CON JAVASCRIPT. El componente no trae lógica: solo
   * pone el lienzo y pide el script. Toda la animación vive en
   * `static/animacion/monedas.js`, a mano y sin marco, porque entrar por el bundle
   * arrastraría el runtime de Svelte —~46 KB gzip medidos contra un presupuesto de
   * 40— y eso lo pagaría el visitante en CADA página, no solo en esta.
   *
   * POR QUÉ AL PIE Y NO DETRÁS DEL TITULAR. Monedas cayendo detrás de un h1 es lo que
   * hace cualquier plantilla, se reconoce a un metro, y además mete un fondo que
   * cambia solo debajo de texto cuyo contraste este repo mide y garantiza. Al pie de
   * la sección se leen como lo que son en el negocio: el efectivo contado sobre el
   * mostrador. El titular no las toca y su contraste no se mueve.
   *
   * El lienzo es DECORATIVO: `aria-hidden`, sin texto y sin información. Quien no ve
   * la pantalla no se pierde nada, porque no dice nada.
   */
</script>

<div class="mostrador" aria-hidden="true">
  <canvas data-monedas></canvas>
</div>

<!-- `defer` para que no estorbe al pintado del titular, que es el LCP de esta página.
     Va en <head> porque es donde SvelteKit deja lo que un componente pide, y con
     `defer` da igual: corre cuando el documento ya está parseado y el lienzo existe. -->
<svelte:head>
  <script src="/animacion/monedas.js" defer></script>
</svelte:head>

<style>
  .mostrador {
    /* Ancho completo, pegado al borde inferior de la sección: el margen lateral de
       la sección no aplica aquí, porque un mostrador no tiene márgenes. */
    position: relative;
    margin-inline: calc(var(--margen-lateral) * -1);
    /* SIN margen inferior negativo. Lo llevaba, para dejar la banda a ras del borde
       de la sección, y el efecto era que la sección siguiente —que va después en el
       documento— le pintaba encima: las monedas salían cortadas por la mitad. Se vio
       en la captura, no en ninguna medición. */
    margin-top: var(--e-6);
    height: 96px;
    overflow: hidden;
    /* El borde superior del montón: la regla dorada del ADR-0007 §6, sin repetirla.
       Aquí es el canto del mostrador. */
    -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 22%);
    mask-image: linear-gradient(to bottom, transparent 0, #000 22%);
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    /* Reacciona a la mano. No lleva `touch-action` ni `preventDefault`, y sus dos
       escuchas son pasivas: tocar aquí NO roba un scroll. Alguien con prisa pasa de
       largo sin enterarse de que esto era tocable. */
    touch-action: pan-y;
  }

  @media (min-width: 768px) {
    .mostrador {
      height: 132px;
      margin-inline: calc(var(--e-12) * -1);
    }
  }

  /* El script ya no anima con `prefers-reduced-motion` —dibuja el montón quieto—,
     pero el cursor no debe prometer un juego que no va a pasar. */
  @media (prefers-reduced-motion: reduce) {
    canvas { pointer-events: none; }
  }
</style>

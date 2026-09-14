<script lang="ts">
  /**
   * Página legal. El texto NO se inventa ni se copia de otro sitio: lo redacta el
   * cliente o su abogado. Un aviso de privacidad copiado es un problema legal
   * disfrazado de contenido.
   */
  import Seccion from '$componentes/Seccion.svelte';
  import Migas from '$componentes/Migas.svelte';
</script>

<div class="migas"><Migas pasos={[{ texto: 'Inicio', href: '/' }, { texto: 'Aviso de privacidad' }]} /></div>

<Seccion etiqueta="LEGAL">
  <h1>Aviso de privacidad</h1>
</Seccion>

<style>
  .migas { padding: 0 var(--margen-lateral); }
  h1 { font-size: var(--h1-tam); line-height: var(--h1-alto); font-weight: var(--h1-peso); margin-bottom: var(--e-4); }
</style>

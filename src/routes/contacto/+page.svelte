<script lang="ts">
  /**
   * Contacto. El formulario NO se construye todavía: un sitio estático no procesa
   * envíos por sí solo, y sin saber a dónde llegan (D-13) construirlo sería
   * dibujar un buzón sin fondo. Se deja el armazón visible y bloqueado.
   */
  import Seccion from '$componentes/Seccion.svelte';
  import Hueco from '$componentes/Hueco.svelte';
  import Campo from '$componentes/Campo.svelte';
  import Boton from '$componentes/Boton.svelte';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import Migas from '$componentes/Migas.svelte';
  import Icono from '$componentes/Icono.svelte';
  import RanuraImagen from '$componentes/RanuraImagen.svelte';
  import PorConfirmar from '$componentes/PorConfirmar.svelte';
  import { negocio, estaConfirmado } from '$lib/config/negocio';

  const formularioListo = estaConfirmado(negocio.destinoFormulario);
</script>

<div class="migas"><Migas pasos={[{ texto: 'Inicio', href: '/' }, { texto: 'Contacto' }]} /></div>

<Seccion etiqueta="CONTACTO">
  <h1>Contacto</h1>
  <Hueco etiqueta="SUBTITULAR — CÓMO PREFIEREN QUE LES ESCRIBAN" renglones={2} />
  <div class="acciones">
    <BotonWhatsApp origen="contacto-entrada" />
    <Boton variante="secundario" href="/"><Icono nombre="telefono" tam={20} grosor={1.9} /> Llamar</Boton>
  </div>
</Seccion>

<Seccion fondo="crema" etiqueta="DÓNDE ESTAMOS">
  <div class="ubicacion">
    <RanuraImagen relacion="4 / 3" etiqueta="MAPA — SE DIBUJA AL CERRAR D-08" />
    <div class="datos">
      <p><Icono nombre="mapa" tam={20} /> <PorConfirmar que="calle, número, colonia y CP" decision="D-08" /></p>
      <p><Icono nombre="reloj" tam={20} /> <PorConfirmar que="horarios de cada día" decision="D-08" /></p>
      <p><Icono nombre="telefono" tam={20} /> <PorConfirmar que="teléfono y WhatsApp" decision="D-08" /></p>
    </div>
  </div>
</Seccion>

<Seccion etiqueta="FORMULARIO">
  {#if formularioListo}
    <form class="form">
      <Campo id="nombre" etiqueta="Nombre" ayuda="Cómo te llamas" />
      <Campo id="telefono" etiqueta="Teléfono o WhatsApp" tipo="tel" ayuda="Para responderte" />
      <Boton tipo="submit">Enviar</Boton>
    </form>
  {:else}
    <div class="bloqueado">
      <p class="et">BLOQUEADO POR D-13</p>
      <p>
        Un sitio estático no procesa envíos por sí solo. Hasta saber a dónde llegan
        —correo, hoja de cálculo, CRM— el formulario no se construye: dibujarlo sería
        prometer un buzón sin fondo.
      </p>
      <p><PorConfirmar que="destino de los envíos" decision="D-13" /></p>
      <div class="muestra">
        <p class="et">ASÍ SE VERÍA, CUANDO SE DESTRABE</p>
        <Campo id="muestra-nombre" etiqueta="Nombre" ayuda="Cómo te llamas" inactivo />
        <Campo id="muestra-tel" etiqueta="Teléfono o WhatsApp" tipo="tel" ayuda="Para responderte" inactivo />
      </div>
    </div>
  {/if}
</Seccion>

<style>
  .migas { padding: 0 var(--margen-lateral); }
  h1 { font-size: var(--h1-tam); line-height: var(--h1-alto); font-weight: var(--h1-peso); margin-bottom: var(--e-4); }
  .acciones { display: grid; gap: var(--e-3); margin-top: var(--e-4); }
  .ubicacion { display: grid; gap: var(--e-6); }
  .datos { display: grid; gap: var(--e-3); }
  .datos p { display: flex; gap: var(--e-2); align-items: flex-start; }
  .form, .muestra { display: grid; gap: var(--e-4); max-width: 520px; }
  .bloqueado { display: grid; gap: var(--e-3); border: 1px dashed var(--negro-400); padding: var(--e-4); }
  .et { font-size: var(--etiqueta-tam); font-weight: var(--etiqueta-peso); letter-spacing: var(--etiqueta-tracking); color: var(--tinta-secundaria); }
  .muestra { margin-top: var(--e-4); }
  @media (min-width: 768px) {
    .acciones { grid-auto-flow: column; justify-content: start; }
    .ubicacion { grid-template-columns: 1fr 1fr; align-items: center; gap: var(--e-16); }
  }
</style>

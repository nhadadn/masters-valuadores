<script lang="ts">
  /**
   * Contacto. El formulario NO se construye todavía: un sitio estático no procesa
   * envíos por sí solo, y sin saber a dónde llegan (D-13) construirlo sería
   * dibujar un buzón sin fondo. Se deja el armazón visible y bloqueado.
   */
  import Seccion from '$componentes/Seccion.svelte';
  import Boton from '$componentes/Boton.svelte';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import Migas from '$componentes/Migas.svelte';
  import Icono from '$componentes/Icono.svelte';
  import Ubicacion from '$componentes/Ubicacion.svelte';
  import { negocio, estaConfirmado } from '$lib/config/negocio';

  const formularioListo = estaConfirmado(negocio.destinoFormulario);
</script>

<div class="migas"><Migas pasos={[{ texto: 'Inicio', href: '/' }, { texto: 'Contacto' }]} /></div>

<Seccion etiqueta="CONTACTO">
  <h1>Contacto</h1>
  <div class="acciones">
    <BotonWhatsApp origen="contacto-entrada" />
    <Boton variante="secundario" href="/"><Icono nombre="telefono" tam={20} grosor={1.9} /> Llamar</Boton>
  </div>
</Seccion>

<Seccion fondo="crema" etiqueta="DÓNDE ESTAMOS">
  <!-- EL LIENZO PARTIDO · ADR-0051. Aquí con teléfono en la ficha. -->
  <Ubicacion titulo="Aquí nos encuentras" conTelefono />
</Seccion>

<!-- ADR-0027 · AQUÍ VIVÍA LA SECCIÓN «FORMULARIO».
     No contenía un formulario: `formularioListo` es falso mientras D-13 siga abierta,
     así que lo único que se pintaba era el bloque «BLOQUEADO POR D-13» explicando por
     qué no lo hay, con su centinela y una muestra inactiva. Era marca de borrador de
     principio a fin y salió con las demás.
     El día que se cierre D-13, el formulario se construye aquí. Los canales reales
     —WhatsApp y teléfono— están arriba y no dependían de esto. -->

<style>
  .migas { padding: 0 var(--margen-lateral); }
  h1 { font-size: var(--h1-tam); line-height: var(--h1-alto); font-weight: var(--h1-peso); margin-bottom: var(--e-4); }
  .acciones { display: grid; gap: var(--e-3); margin-top: var(--e-4); }
  /* Aquí vivía el CSS de `.form`, `.bloqueado` y `.muestra`: la sección de formulario
     que salió con el ADR-0027. Cuando se cierre D-13 y el formulario se construya,
     vuelve; el historial lo guarda. */
  @media (min-width: 768px) {
    .acciones { grid-auto-flow: column; justify-content: start; }
  }
</style>

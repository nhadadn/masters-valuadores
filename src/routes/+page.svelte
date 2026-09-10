<script lang="ts">
  /**
   * Portada REPARTIDORA. Su trabajo no es vender: es mandar al giro correcto.
   * Por eso la retícula de líneas es la sección más grande de la página.
   *
   * Cero copy. Todo lo que sería mensaje sale como hueco etiquetado.
   */
  import Seccion from '$componentes/Seccion.svelte';
  import Hueco from '$componentes/Hueco.svelte';
  import RanuraImagen from '$componentes/RanuraImagen.svelte';
  import Boton from '$componentes/Boton.svelte';
  import BotonWhatsApp from '$componentes/BotonWhatsApp.svelte';
  import Tarjeta from '$componentes/Tarjeta.svelte';
  import Icono from '$componentes/Icono.svelte';
  import Insignia from '$componentes/Insignia.svelte';
  import PorConfirmar from '$componentes/PorConfirmar.svelte';
  import { girosConstruibles, girosBloqueados } from '$lib/datos/giros';
  import { negocio } from '$lib/config/negocio';
</script>

<svelte:head>
  <title>{negocio.nombreComercial} VALUADORES · __POR_CONFIRMAR__</title>
  <meta name="description" content="__POR_CONFIRMAR__ · descripción de la portada, no se inventa" />
</svelte:head>

<Seccion etiqueta="GRUPO MÁSTER · TORREÓN, COAHUILA">
  <div class="entrada">
    <div class="palabra">
      <Hueco etiqueta="TITULAR — QUÉ HACEN Y DÓNDE, EN UNA LÍNEA" renglones={2} como="h1" />
      <Hueco etiqueta="SUBTITULAR — LA PROMESA CONCRETA, EN DOS RENGLONES" renglones={2} />
      <div class="acciones">
        <BotonWhatsApp origen="portada-entrada" />
        <Boton variante="secundario" href="/contacto/">
          <Icono nombre="telefono" tam={20} grosor={1.9} /> Llamar
        </Boton>
      </div>
    </div>
    <RanuraImagen relacion="16 / 9" etiqueta="FOTO — FACHADA DEL LOCAL, DE DÍA, CON EL LETRERO LEGIBLE" />
  </div>
</Seccion>

<Seccion fondo="crema" etiqueta="NUESTRAS LÍNEAS">
  <Hueco etiqueta="TÍTULO DE SECCIÓN — UNA LÍNEA" renglones={1} como="h2" />
  <ul class="reticula">
    {#each girosConstruibles as g}
      <li><Tarjeta href="/{g.slug}/" titulo={g.nombre} icono={g.icono} /></li>
    {/each}
    <li>
      <div class="bloqueados">
        <p class="cabeza"><Icono nombre="bloq" tam={18} /> BLOQUEADOS</p>
        {#each girosBloqueados as g}
          <p class="fila"><span>{g.nombre}</span><code>{g.bloqueadoPor}</code></p>
        {/each}
        <p class="nota">Entran cuando se cierren esas dos decisiones.</p>
      </div>
    </li>
  </ul>
  <p class="aviso">El orden es provisional. La prioridad la decide el estudio de búsqueda, no la intuición.</p>
</Seccion>

<Seccion etiqueta="POR QUÉ AQUÍ">
  <Hueco etiqueta="TÍTULO DE SECCIÓN — UNA LÍNEA" renglones={1} como="h2" />
  <!-- ADR-0007 §3: aquí la insignia SÍ entra, y sustituye la regla dorada que este
       bloque llevaba de borde. El texto sigue siendo hueco: la etiqueta en versalitas
       y la segunda línea en oro llegan con el copy, no antes. -->
  <ul class="diferenciadores">
    {#each ['mapa', 'reloj', 'empeno'] as ic, i}
      <li>
        <Insignia icono={ic}>
          <Hueco etiqueta="DIFERENCIADOR {i + 1} — TÍTULO Y UNA LÍNEA" renglones={2} />
        </Insignia>
      </li>
    {/each}
  </ul>
</Seccion>

<Seccion fondo="crema" etiqueta="DÓNDE ESTAMOS">
  <div class="ubicacion">
    <RanuraImagen relacion="4 / 3" etiqueta="MAPA — NO SE DIBUJA HASTA CERRAR D-08" />
    <div class="datos">
      <p><Icono nombre="mapa" tam={20} /> <PorConfirmar que="calle, número, colonia y CP" decision="D-08" /></p>
      <p><Icono nombre="reloj" tam={20} /> <PorConfirmar que="horarios de cada día" decision="D-08" /></p>
      <Boton variante="secundario" href="/contacto/" anchoCompleto={false}>Cómo llegar</Boton>
    </div>
  </div>
</Seccion>

<Seccion fondo="oscuro" etiqueta="CONTACTO">
  <Hueco etiqueta="TÍTULO — LA INVITACIÓN A ESCRIBIR" renglones={2} sobreOscuro como="h2" />
  <div class="acciones">
    <BotonWhatsApp origen="portada-contacto" sobreOscuro />
    <Boton variante="secundario" href="/contacto/" sobreOscuro>
      <Icono nombre="telefono" tam={20} grosor={1.9} /> Llamar
    </Boton>
  </div>
</Seccion>

<style>
  .entrada { display: grid; gap: var(--e-6); }
  .palabra { display: grid; gap: var(--e-3); }
  .acciones { display: grid; gap: var(--e-3); margin-top: var(--e-2); }

  .reticula { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--e-2); margin-top: var(--e-4); }
  .aviso { font-size: var(--pie-tam); color: var(--tinta-secundaria); margin-top: var(--e-4); }

  .bloqueados {
    display: flex; flex-direction: column;
    min-height: 176px; padding: var(--e-4) var(--e-3);
    border: 1px dashed var(--negro-400); background: var(--crema-050);
  }
  .cabeza {
    display: flex; align-items: center; gap: var(--e-2);
    font-size: 11px; font-weight: var(--etiqueta-peso);
    letter-spacing: var(--etiqueta-tracking); color: var(--tinta-secundaria);
  }
  .fila { display: flex; align-items: baseline; justify-content: space-between; gap: var(--e-2); margin-top: var(--e-2); font-size: var(--pie-tam); font-weight: 600; color: var(--tinta-secundaria); }
  .fila code { font-family: ui-monospace, Menlo, monospace; font-size: 11px; border: 1px solid var(--negro-400); padding: 1px 5px; }
  .nota { margin-top: auto; font-size: 11px; line-height: 1.3; color: var(--tinta-secundaria); }

  /* Sin borde dorado: la insignia es la que trae el acento ahora. Dos gestos de oro
     en el mismo bloque compiten y ninguno significa nada. */
  .diferenciadores { display: grid; gap: var(--e-6); margin-top: var(--e-4); }

  .ubicacion { display: grid; gap: var(--e-6); }
  .datos { display: grid; gap: var(--e-3); justify-items: start; }
  .datos p { display: flex; gap: var(--e-2); align-items: flex-start; }

  @media (min-width: 768px) {
    .entrada { grid-template-columns: 1fr 1fr; align-items: center; gap: var(--e-16); }
    .acciones { grid-auto-flow: column; justify-content: start; }
    .reticula { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--e-3); }
    .bloqueados { min-height: 150px; }
    .diferenciadores { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .ubicacion { grid-template-columns: 1fr 1fr; align-items: center; gap: var(--e-16); }
  }
</style>

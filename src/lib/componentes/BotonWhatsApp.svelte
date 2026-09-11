<script lang="ts">
  /**
   * El CTA de WhatsApp. Tres variantes: bloque, en línea y barra fija.
   *
   * El número NO vive aquí: sale de negocio.ts. Mientras esté sin confirmar,
   * el enlace no se arma y el botón queda inerte y marcado — es preferible a
   * mandar a la gente a un número inventado.
   */
  import { sucursalPrincipal, estaConfirmado } from '$lib/config/negocio';
  import { iconoWhatsApp } from '$lib/datos/iconos';

  interface Props {
    variante?: 'bloque' | 'linea' | 'barra';
    sobreOscuro?: boolean;
    /** De qué sección salió el contacto. Es la respuesta a «¿de dónde vino este cliente?». */
    origen: string;
    texto?: string;
  }
  let { variante = 'bloque', sobreOscuro = false, origen, texto = 'WhatsApp' }: Props = $props();

  const numero = $derived(sucursalPrincipal.whatsapp);
  const listo = $derived(estaConfirmado(numero));
  const enlace = $derived(listo ? `https://wa.me/${String(numero).replace(/\D/g, '')}` : undefined);
</script>

{#if listo}
  <a href={enlace} class="wa {variante}" class:oscuro={sobreOscuro} data-origen={origen} rel="noopener">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{@html iconoWhatsApp}</svg>
    {texto}
  </a>
{:else}
  <span class="wa {variante} inerte" class:oscuro={sobreOscuro} data-origen={origen}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{@html iconoWhatsApp}</svg>
    {texto}
    <span class="marca">__POR_CONFIRMAR__</span>
  </span>
{/if}

<style>
  .wa {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--e-2);
    min-height: var(--tactil);
    padding: 0 var(--e-4);
    border-radius: var(--radio-boton);
    background: var(--accion);
    color: var(--tinta-sobre-oscuro);
    font-weight: var(--cuerpo-fuerte-peso);
    line-height: 1;
    transition: transform var(--mov-tactil) var(--mov-curva);
  }
  /* El inerte NO se hunde: hundirse es acusar recibo de una acción, y aquí
     no hay acción hasta que entre el número. */
  .wa:not(.inerte):active { transform: translateY(1px); }
  .bloque { width: 100%; }
  .linea { min-height: var(--tactil-piso); }
  .barra { width: 100%; }
  .oscuro { background: var(--blanco); color: var(--negro-950); }

  /* ── La arista · ADR-0007 §5 ────────────────────────────────────────────
     Este es el botón primario REAL del sitio: el ADR dice «el botón primario» y en
     esta pantalla la acción primaria es escribir por WhatsApp, no el submit de un
     formulario que hoy ni existe. Lleva el mismo tratamiento que `Boton.primario`.

     EL ESTADO INERTE TAMBIÉN LA LLEVA — corregido el 10 de septiembre.
     Primero se decidió que no, con el argumento de que un control apagado con forma
     de acción principal es una promesa falsa. El argumento estaba mal planteado:
     quien promete es el RELLENO —negro-300, apagado— y el marcador
     `__POR_CONFIRMAR__` que lleva encima, no la silueta. Y el costo de la decisión
     era alto: mientras D-08 siga abierta, el botón inerte es el elemento más grande
     del primer pliegue en las once páginas, así que dejarlo sin arista era dejar el
     sitio sin marca justo donde se mira.

     DOS EXCEPCIONES QUE SÍ SE SOSTIENEN:
     · `barra` NO la lleva. La barra fija es una tira de utilidad a sangre, no un
       sello, y en la portada se vería a la vez que el de la entrada: sus piezas
       tienen un sello por composición, no dos.
     · El recorte va en el pseudo-elemento, nunca sobre el <a>: `clip-path` recorta
       también el área sensible. Ver la nota larga en `Boton.svelte`.

     LÍMITE CONOCIDO: --diagonal-corte es 48 × tan(30°), o sea el corte de un control
     de alto estándar. Si un botón creciera de alto, el corte seguiría siendo 27.7 px
     y el ángulo visible se abriría. CSS no puede leer el alto propio como longitud.
     Todos los botones del sistema son de un renglón y 48 px: se mide y se vigila. */
  .wa:not(.barra) {
    position: relative;
    isolation: isolate;
    background: transparent;
    border-radius: var(--radio-bloque);
    padding-inline-end: calc(var(--e-4) + var(--diagonal-corte) / 2);
  }
  .wa:not(.barra)::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: var(--accion);
    clip-path: polygon(0 0, 100% 0, calc(100% - var(--diagonal-corte)) 100%, 0 100%);
  }
  .wa.oscuro:not(.barra)::before { background: var(--blanco); }
  /* El relleno apagado se mantiene: es lo que dice «esto no se puede tocar». */
  .wa.inerte:not(.barra)::before { background: var(--negro-300); }

  /* Inerte a propósito: sin número confirmado no hay a dónde mandar a nadie. */
  .inerte { background: var(--negro-300); color: var(--negro-950); cursor: not-allowed; flex-wrap: wrap; }
  .marca {
    font-family: ui-monospace, Menlo, monospace;
    font-size: var(--pie-tam);
    background: var(--negro-100);
    border: 1px solid var(--negro-500);
    padding: 1px 6px;
  }
</style>

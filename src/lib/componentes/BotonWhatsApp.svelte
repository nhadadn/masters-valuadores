<script lang="ts">
  /**
   * El CTA de WhatsApp. Tres variantes: bloque, en línea y barra fija.
   *
   * El número NO vive aquí: sale de negocio.ts. Mientras esté sin confirmar,
   * el enlace no se arma y el botón queda inerte y marcado — es preferible a
   * mandar a la gente a un número inventado.
   */
  import { enlaceWhatsApp, hayWhatsApp } from '$lib/datos/whatsapp';
  import { iconoWhatsApp } from '$lib/datos/iconos';

  interface Props {
    variante?: 'bloque' | 'linea' | 'barra';
    sobreOscuro?: boolean;
    /** De qué sección salió el contacto. Es la respuesta a «¿de dónde vino este cliente?». */
    origen: string;
    texto?: string;
    /**
     * Mensaje que WhatsApp deja escrito por el visitante. Es TEXTO DE INTERFAZ, no una
     * afirmación sobre el negocio: solo dice de qué quiere hablar. Llega preclasificado
     * y le ahorra a quien contesta la primera pregunta.
     */
    mensaje?: string;
  }
  let {
    variante = 'bloque', sobreOscuro = false, origen, texto = 'WhatsApp', mensaje
  }: Props = $props();

  /* El armado vive en `$lib/datos/whatsapp`: lo comparte con la galeria de bienes,
     que necesita el enlace sin el boton alrededor. Ver la nota de ese archivo. */
  const listo = $derived(hayWhatsApp());
  const enlace = $derived(enlaceWhatsApp(mensaje));
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
    color: var(--tinta-sobre-accion);   /* 11.12:1 sobre el oro */
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
  /* `sobreOscuro` deja de invertir: todo el sitio es oscuro · ADR-0012. */

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
  /* Sin relleno: el contorno punteado ya dice que esto no se puede tocar, y un
     bloque relleno competía con los botones que sí funcionan. La arista se conserva
     —es forma de marca, no promesa— pero ahora recorta un contorno, no una mancha. */
  .wa.inerte:not(.barra)::before {
    background: transparent;
    border: 1px dashed var(--oro-700);
  }

  /* ── El estado inerte, rediseñado ────────────────────────────────────────
     Sigue siendo inerte a propósito: sin número confirmado no hay a dónde mandar a
     nadie. Lo que cambia es cómo se ve.

     Antes era un BLOQUE GRIS RELLENO que imitaba al botón real y quedaba como una
     mancha sucia —panel-borde sobre el campo— repetida seis veces en la portada.
     Ahora es contorno PUNTEADO, que es el lenguaje que este repo ya usa para «esto
     falta»: el mismo de `Hueco` y de las ranuras de imagen.

     Ratios: el borde va en --oro-700, que da 4.39:1 sobre el campo y 3.33:1 sobre el
     panel —por encima del 3:1 que pide un gráfico no textual—. La tinta va en
     negro-300: 8.49:1 y 6.45:1. El oro-700 NO se usa de texto: ahí da 3.33 y no pasa. */
  .inerte {
    background: transparent;
    color: var(--negro-300);
    border: 1px dashed var(--oro-700);
    cursor: not-allowed;
    flex-wrap: wrap;
  }
  .marca {
    font-family: ui-monospace, Menlo, monospace;
    font-size: var(--pie-tam);
    background: var(--negro-800);
    border: 1px solid var(--panel-borde);
    padding: 1px 6px;
  }
</style>

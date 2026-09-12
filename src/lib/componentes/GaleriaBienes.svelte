<script lang="ts">
  /**
   * Galería de activos · ADR-0025.
   *
   * ── UN SOLO SISTEMA PARA LAS SEIS ─────────────────────────────────────────
   * Cada tarjeta es la misma pieza: fotografía a sangre, velo que baja a negro
   * sólido, filo dorado, nombre, microdescripción y flecha. Siempre en ese orden y
   * siempre en el mismo sitio. **Eso** es lo que las hace parecer una colección, y
   * funciona aunque las fotos vengan de sesiones distintas.
   *
   * ── LO QUE NO UNIFICA, Y SE COMPROBÓ ──────────────────────────────────────
   * El plan era un grado de color único para las seis. Se probaron cuatro grados
   * sobre la joya de estudio y el patio a mediodía, y en los cuatro **el cielo seguía
   * azul con nubes blancas**. El grado fuerte pagaba el precio —apagaba el oro, que
   * es la marca— sin conseguir el beneficio.
   *
   * Lo que separa esas fotos no es el color: es que hay cielo. Ningún filtro lo quita.
   * Así que el grado quedó SUAVE —solo iguala contraste— y el trabajo de cohesión lo
   * hacen el encuadre (la de maquinaria se recortó sin cielo) y esta composición.
   *
   * ── EL TEXTO SE APOYA EN NEGRO SÓLIDO ─────────────────────────────────────
   * El velo termina en `--superficie-oscura` OPACO en la franja donde va el texto. El
   * validador resuelve colores de CSS, no píxeles: un título sobre degradado
   * semitransparente es contraste que nadie puede medir y que cambia con cada foto.
   *
   * ── CADA TARJETA LLEVA A WHATSAPP, CON SU CATEGORÍA ESCRITA ───────────────
   * La flecha no es decoración. Quien reconoce su objeto en una tarjeta tiene ya la
   * pregunta hecha —«¿cuánto me dan por esto?»— y el mensaje sale redactado con la
   * categoría dentro. El enlace lo arma `BotonWhatsApp`, que lee el número de
   * `negocio.ts`: aquí no se escribe ni un dígito.
   *
   * ── LOS RÓTULOS DE REVISIÓN NO ESTÁN AQUÍ ─────────────────────────────────
   * «EN SU LETRERO», «FOTO DE ARCHIVO» y demás salieron de las tarjetas por decisión
   * de Nadir. NO se borraron: viven en un bloque de revisión al pie de la sección,
   * con el mismo estatus que la banda BORRADOR. Cuando el sitio deje de ser borrador,
   * se van los dos juntos.
   */
  import { srcset } from '$lib/datos/fotos';
  import Icono from './Icono.svelte';
  import { enlaceWhatsApp } from '$lib/datos/whatsapp';

  interface Bien {
    que: string;
    fuente: 'letrero' | 'publicacion' | 'deducido';
    icono: string;
    micro?: string;
    foto?: string;
    fotoMaxAncho?: number;
    fotoEsSuya?: boolean;
    fotoAlt?: string;
    /** Ocupa el ancho completo: es una banda. Ver la composición, abajo. */
    banda?: boolean;
  }

  interface Props {
    bienes: Bien[];
    /** Para el mensaje de WhatsApp: de qué línea pregunta. */
    giro: string;
  }
  let { bienes, giro }: Props = $props();

  const TAMANOS_BANDA = '(min-width: 768px) 1120px, 92vw';
  const TAMANOS = '(min-width: 768px) 550px, 92vw';
</script>

<ul class="bienes">
  {#each bienes as bien}
    <!-- `{@const}` tiene que colgar directamente del `{#each}`: dentro del <article>
         el compilador lo rechaza. -->
    {@const enlace = enlaceWhatsApp(
      `Hola, quiero saber cuánto me pueden prestar. Es de la categoría: ${bien.que}.`
    )}
    <li class:banda={bien.banda}>
      <article class="tarjeta">
        {#if bien.foto}
          <picture>
            <source type="image/avif" srcset={srcset(bien.foto, 'avif', bien.fotoMaxAncho ?? 1600)} sizes={bien.banda ? TAMANOS_BANDA : TAMANOS} />
            <source type="image/webp" srcset={srcset(bien.foto, 'webp', bien.fotoMaxAncho ?? 1600)} sizes={bien.banda ? TAMANOS_BANDA : TAMANOS} />
            <img
              src="/fotos/{bien.foto}-400.jpg"
              srcset={srcset(bien.foto, 'jpg', bien.fotoMaxAncho ?? 1600)}
              sizes={bien.banda ? TAMANOS_BANDA : TAMANOS}
              alt={bien.fotoAlt ?? ''}
              width="400"
              height="267"
              loading="lazy"
              decoding="async"
            />
          </picture>
        {:else}
          <!-- Sin fotografía todavía. Campo oscuro con el ícono en oro: misma caja,
               mismo velo, mismo texto. Se lee como parte del sistema, no como error.
               `aria-hidden`: el nombre va escrito justo debajo. -->
          <div class="metal" aria-hidden="true">
            <Icono nombre={bien.icono} tam={104} grosor={1.1} />
          </div>
        {/if}

        <span class="velo" aria-hidden="true"></span>

        <div class="txt">
          <span class="filo" aria-hidden="true"></span>
          <h3>{bien.que}</h3>
          {#if bien.micro}<p data-propuesta="true">{bien.micro}</p>{/if}
        </div>

        <!-- El enlace cubre la tarjeta entera: objetivo táctil enorme, muy por encima
             de los 44 px del sistema. Su texto dice a dónde va y de qué, para quien
             no ve la pantalla. Si el número no está confirmado no se arma nada: la
             tarjeta se queda sin enlace antes que mandar a alguien a un número
             inventado. -->
        {#if enlace}
          <a class="tocar" href={enlace} rel="noopener" data-origen="bien-{giro}-{bien.icono}">
            <span class="solo-lectores">Preguntar por {bien.que.toLowerCase()} por WhatsApp</span>
          </a>
        {/if}
      </article>
    </li>
  {/each}
</ul>

<style>
  /* ── LA COMPOSICIÓN ────────────────────────────────────────────────────────
     Dos columnas en escritorio y dos bandas a ancho completo: 4 + 4 = 8 huecos,
     cuatro filas exactas, sin un boquete. En teléfono, una sola columna.
     Autos va en la retícula y NO de banda, por decisión de Nadir: sin fotografía,
     una banda son cuatrocientos píxeles de rectángulo vacío. */
  .bienes {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--e-2);
  }
  li { margin: 0; }

  .tarjeta {
    position: relative;
    overflow: hidden;
    /* Color plano además de la foto, y con el peor extremo: si una imagen no carga,
       debajo hay campo oscuro y no el fondo claro de la sección. */
    background: var(--superficie-oscura);
    border: 1px solid var(--panel-borde);
    /* 16:9 en teléfono, no 3:2. Con seis tarjetas a ancho completo, 3:2 llevaba la
       página a 8 pantallas y el brief pide justo evitar tarjetas demasiado altas.
       Medido: 16:9 le quita unos 320 px al recorrido sin que la foto deje de contar
       lo que tiene que contar. */
    aspect-ratio: 16 / 9;
    transition: border-color 300ms ease;
  }

  picture { display: contents; }

  img,
  .metal {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* GRADO SUAVE. Solo iguala contraste y baja un punto la luz; NO tiñe. La prueba
       de los cuatro grados está en la nota de arriba. */
    filter: brightness(0.9) contrast(1.1) saturate(0.94);
    transition: transform 350ms ease;
  }

  .metal {
    display: grid;
    place-items: center;
    color: var(--oro-500);
    filter: none;
    /* El rescoldo entra por detrás del ícono, no por una esquina: con el ícono
       pequeño y la luz lejos, el campo se leía vacío en escritorio. */
    background:
      radial-gradient(70% 70% at 50% 42%, rgba(231, 192, 65, 0.26) 0%, rgba(231, 192, 65, 0) 68%),
      linear-gradient(160deg, var(--negro-800) 0%, var(--negro-950) 100%);
    /* El ícono se sube un poco: abajo va el velo y el texto. */
    align-content: center;
    padding-bottom: var(--e-12);
  }

  /* De transparente arriba a OPACO abajo. El texto vive en la parte opaca. */
  .velo {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      var(--superficie-oscura) 0%,
      var(--superficie-oscura) 22%,
      rgba(12, 13, 15, 0.55) 48%,
      rgba(12, 13, 15, 0) 76%
    );
  }

  .txt {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: var(--e-3) var(--e-4) var(--e-4);
    color: var(--tinta-sobre-oscuro);
  }
  .filo {
    display: block;
    width: 26px;
    height: 2px;
    background: var(--oro-500);
    margin-bottom: var(--e-2);
  }
  h3 {
    margin: 0;
    font-size: 1.1875rem;
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: -0.01em;
  }
  .txt p {
    margin: var(--e-1) 0 0;
    font-size: 0.875rem;
    line-height: 1.35;
    color: var(--tinta-tenue-oscuro);
    padding-right: var(--e-8);
  }

  /* El enlace, estirado sobre la tarjeta. La flecha la pinta este CSS.
     `color` NO es decorativo: su texto para lector de pantalla heredaba `--tinta`
     —negro, en el registro claro— sobre la tarjeta negra, y el validador lo midió a
     1:1 en las tres páginas con bienes. Está sobre campo oscuro, así que le toca la
     tinta de campo oscuro. Esconderlo mejor habría sido tapar el termómetro. */
  .tocar {
    position: absolute;
    inset: 0;
    display: block;
    color: var(--tinta-sobre-oscuro);
  }
  .tocar::after {
    content: '';
    position: absolute;
    right: var(--e-4);
    bottom: calc(var(--e-4) + 2px);
    width: 22px;
    height: 22px;
    /* Flecha del color de marca, recortada de un cuadro. Cero íconos nuevos. */
    background: var(--oro-500);
    clip-path: polygon(0 44%, 62% 44%, 44% 20%, 58% 8%, 96% 50%, 58% 92%, 44% 80%, 62% 56%, 0 56%);
    transition: transform 300ms ease;
  }
  .tocar:focus-visible {
    outline: 3px solid var(--oro-500);
    outline-offset: -4px;
  }

  .solo-lectores {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* ── ESTADOS ──────────────────────────────────────────────────────────────
     Zoom muy ligero, filo dorado y la flecha que avanza. Nada más. */
  .tarjeta:hover { border-color: var(--oro-500); }
  .tarjeta:hover img { transform: scale(1.045); }
  .tarjeta:hover .tocar::after { transform: translateX(5px); }

  /* Quien pidió menos movimiento no recibe ni zoom ni desplazamiento. */
  @media (prefers-reduced-motion: reduce) {
    img,
    .tocar::after { transition: none; }
    .tarjeta:hover img { transform: none; }
    .tarjeta:hover .tocar::after { transform: none; }
  }

  @media (min-width: 768px) {
    .bienes { grid-template-columns: 1fr 1fr; gap: var(--e-3); }
    .tarjeta { aspect-ratio: 4 / 3; }
    li.banda { grid-column: 1 / -1; }
    li.banda .tarjeta { aspect-ratio: 21 / 8; }
    li.banda h3 { font-size: 1.625rem; }
  }
</style>

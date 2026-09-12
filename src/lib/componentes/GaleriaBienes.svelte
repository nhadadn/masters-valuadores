<script lang="ts">
  /**
   * Los bienes que se pueden empeñar, como CATÁLOGO VISUAL · ADR-0024.
   *
   * ── QUÉ PROBLEMA RESUELVE ─────────────────────────────────────────────────
   * Antes eran seis cajas iguales con un ícono gris de marca de agua y dos renglones
   * de texto. Para saber qué se puede llevar había que LEER, y el criterio de
   * aceptación de esta página es justo el contrario: alguien que solo mira las
   * tarjetas tiene que entender «puedo llevar oro, relojes, monedas, herramienta,
   * maquinaria y autos» sin leer un párrafo.
   *
   * ── EL TÍTULO VA SOBRE BANDA SÓLIDA, NO SOBRE UN DEGRADADO ────────────────
   * Texto encima de una fotografía es exactamente donde este repo ya se quemó: el
   * validador de contraste resuelve colores de CSS, no píxeles de una imagen, así que
   * un título sobre un degradado semitransparente es contraste que NADIE puede medir
   * y que cambia con cada foto.
   *
   * La banda del título es OPACA —`--superficie-oscura`— y el degradado solo la funde
   * con la foto por arriba, donde no hay texto. Así el ratio es el del token, sale en
   * el validador, y no depende de si la foto de mañana es clara u oscura.
   *
   * ── LAS QUE NO TIENEN FOTO ────────────────────────────────────────────────
   * No se deja un hueco roto ni se mete una foto cualquiera: campo oscuro con un
   * rescoldo de oro y el ícono grande en oro, misma proporción y mismo tratamiento
   * que las demás. Se lee como decisión, no como imagen que falta. Y lleva su marca
   * de pendiente, que además es la petición a Cristóbal.
   */
  import { srcset, anchosDe } from '$lib/datos/fotos';
  import Icono from './Icono.svelte';

  interface Bien {
    que: string;
    fuente: 'letrero' | 'publicacion' | 'deducido';
    icono: string;
    micro?: string;
    foto?: string;
    fotoMaxAncho?: number;
    fotoEsSuya?: boolean;
    fotoAlt?: string;
  }

  interface Props {
    bienes: Bien[];
    /** Se marca la primera a doble ancho: rompe la retícula de cajas iguales. */
    destacarPrimera?: boolean;
  }
  let { bienes, destacarPrimera = true }: Props = $props();

  const CHIP = {
    letrero: 'EN SU LETRERO',
    publicacion: 'EN SU PUBLICACIÓN',
    deducido: 'DEDUCIDO — CONFIRMAR'
  } as const;

  const mayorDe = (b: Bien) => {
    const a = anchosDe(b.fotoMaxAncho ?? 1600);
    return a[a.length - 1];
  };
  /* La primera ocupa dos columnas, así que pide una imagen del doble de ancho. */
  const TAMANOS_ANCHA = '(min-width: 768px) 700px, 92vw';
  const TAMANOS = '(min-width: 768px) 340px, 46vw';
</script>

<ul class="bienes" class:destacada={destacarPrimera}>
  {#each bienes as bien, i}
    {@const ancha = destacarPrimera && i === 0}
    <li data-propuesta="true" class:apuesta={bien.fuente === 'deducido'} class:ancha>
      <div class="lienzo">
        {#if bien.foto}
          <picture>
            <source type="image/avif" srcset={srcset(bien.foto, 'avif', bien.fotoMaxAncho ?? 1600)} sizes={ancha ? TAMANOS_ANCHA : TAMANOS} />
            <source type="image/webp" srcset={srcset(bien.foto, 'webp', bien.fotoMaxAncho ?? 1600)} sizes={ancha ? TAMANOS_ANCHA : TAMANOS} />
            <img
              src="/fotos/{bien.foto}-{mayorDe(bien)}.jpg"
              srcset={srcset(bien.foto, 'jpg', bien.fotoMaxAncho ?? 1600)}
              sizes={ancha ? TAMANOS_ANCHA : TAMANOS}
              alt={bien.fotoAlt ?? ''}
              width="400"
              height="267"
              loading="lazy"
              decoding="async"
              class:tenida={!bien.fotoEsSuya}
            />
          </picture>
        {:else}
          <!-- Campo de metal. `aria-hidden`: el nombre del bien va escrito al lado y
               anunciar «imagen de una moneda» antes de «Monedas» solo estorba. -->
          <div class="metal" aria-hidden="true">
            <Icono nombre={bien.icono} tam={88} grosor={1.2} />
          </div>
        {/if}

        <!-- La procedencia sigue a la vista mientras esto sea borrador: un bien del
             letrero es casi un hecho y uno deducido es una apuesta que Cristóbal tiene
             que confirmar o tachar. Pasa de renglón de texto a distintivo.
             APILADOS, no uno en cada esquina: en la tarjeta estrecha de teléfono el de
             la izquierda parte en dos renglones y se metía por debajo del otro
             —«EN U[FOTO DE ARCHIVO]SUYA»—. Se vio en la captura de 390. -->
        <div class="chips">
          <p class="fuente {bien.fuente}">{CHIP[bien.fuente]}</p>
          {#if !bien.foto}
            <p class="pendiente">FOTO PENDIENTE</p>
          {:else if !bien.fotoEsSuya}
            <p class="archivo">FOTO DE ARCHIVO</p>
          {/if}
        </div>

        <div class="banda">
          <h3>{bien.que}</h3>
          {#if bien.micro}<p class="micro">{bien.micro}</p>{/if}
        </div>
      </div>
    </li>
  {/each}
</ul>

<style>
  /* ── LA FILA MANDA, NO LA PROPORCIÓN ──────────────────────────────────────
     El primer intento dio a cada imagen `aspect-ratio: 3/2` y dejó que ella fijara
     el alto. El resultado, en la captura de 1280: la tarjeta destacada medía el
     doble de ancho, luego el doble de alto, y salía un rectángulo enorme medio
     vacío; y su vecina de la misma fila se estiraba hasta él dejando un boquete
     negro entre su foto y su título.
     Ahora el alto de fila es fijo y la imagen CUBRE. Todas las tarjetas casan, y la
     destacada ocupa dos filas en escritorio en vez de deformarse. */
  .bienes {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 194px;
    grid-auto-flow: dense;
    gap: var(--e-2);
  }
  li { margin: 0; }
  .destacada .ancha { grid-column: 1 / -1; }

  /* Sin esto la última queda huérfana en una fila para ella sola —se vio con
     «Autos»—. Con la destacada ocupando dos huecos, el reparto se cierra cuando la
     última es par. Si son impares ya cuadra sola y esta regla no se activa. */
  li:last-child:nth-child(even) { grid-column: 1 / -1; }

  .lienzo {
    position: relative;
    overflow: hidden;
    /* EL COLOR PLANO VA ADEMÁS de lo que se pinte encima, y con el peor extremo: si
       una foto no carga, debajo hay campo oscuro y no el fondo de la sección. */
    background: var(--superficie-oscura);
    border: 1px solid var(--panel-borde);
    height: 100%;
  }

  /* Cubren la tarjeta entera. `inset: 0` en vez de proporción propia: el alto ya lo
     decide la fila, arriba. */
  picture,
  img,
  .metal {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* La de archivo va teñida, como las demás del ADR-0009: que se distinga de las
     suyas sin tener que leer el rótulo. */
  .tenida {
    filter: grayscale(1) sepia(0.55) saturate(1.7) hue-rotate(-8deg) contrast(1.05) brightness(0.82);
  }

  .metal {
    display: grid;
    place-items: center;
    color: var(--oro-500);
    /* Rescoldo de oro descentrado sobre campo oscuro. Cero bytes, como el mármol. */
    background:
      radial-gradient(120% 90% at 30% 15%, rgba(231, 192, 65, 0.22) 0%, rgba(231, 192, 65, 0) 60%),
      linear-gradient(160deg, var(--negro-800, #1a1c1f) 0%, var(--negro-950, #0c0d0f) 100%);
  }

  /* ── LA BANDA DEL TÍTULO ───────────────────────────────────────────────────
     Opaca. El degradado de encima solo la funde con la foto, y ahí no hay texto. */
  .banda {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    padding: var(--e-2) var(--e-3) var(--e-3);
    background: var(--superficie-oscura);
    color: var(--tinta-sobre-oscuro);
  }
  .banda::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    bottom: 100%;
    height: var(--e-8);
    background: linear-gradient(to top, var(--superficie-oscura), transparent);
    pointer-events: none;
  }

  h3 {
    margin: 0;
    font-size: var(--bien-tam, 1rem);
    line-height: 1.2;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .ancha h3 { font-size: var(--bien-tam-ancha, 1.25rem); }

  .micro {
    margin: var(--e-1) 0 0;
    font-size: 0.8125rem;
    line-height: 1.35;
    color: var(--tinta-tenue-oscuro);
  }

  /* ── LOS DISTINTIVOS ──────────────────────────────────────────────────────
     Pastilla oscura propia, así que su tinta es la de sobre-oscuro pase lo que pase
     debajo. Es la lección del rótulo de archivo que quedó negro sobre negro. */
  .chips {
    position: absolute;
    top: var(--e-2);
    left: var(--e-2);
    right: var(--e-2);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }
  .fuente,
  .pendiente,
  .archivo {
    margin: 0;
    padding: 3px var(--e-2);
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    /* Pastilla propia y opaca: su tinta es la de sobre-oscuro pase lo que pase
       debajo. Es la lección del rótulo que quedó negro sobre negro. */
    background: var(--superficie-oscura);
    color: var(--tinta-sobre-oscuro);
  }
  .pendiente,
  .archivo,
  .fuente.deducido { color: var(--oro-500); }

  @media (min-width: 768px) {
    .bienes {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 208px;
      gap: var(--e-3);
      --bien-tam: 1.0625rem;
      --bien-tam-ancha: 1.5rem;
    }
    /* Dos columnas Y dos filas: con seis bienes eso son 4 + 5 = 9 huecos, que es
       justo una retícula de 3×3 sin un solo boquete. */
    .destacada .ancha { grid-column: span 2; grid-row: span 2; }
    li:last-child:nth-child(even) { grid-column: auto; }
  }
</style>

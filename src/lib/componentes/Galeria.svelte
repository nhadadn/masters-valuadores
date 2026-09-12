<script lang="ts">
  /**
   * Retícula de fotografías reales · ADR-0022.
   *
   * POR QUÉ NO ES UN CARRUSEL. Se pidió uno, en 3D. La retícula se eligió con la
   * razón escrita en el ADR: un carrusel esconde detrás de un gesto lo que aquí cabe
   * a la vista, y está medido desde hace años que la mayoría no pasa de la primera
   * diapositiva. La audiencia de este contrato —alguien con prisa que necesita
   * liquidez hoy, en un teléfono de gama baja— es la que menos va a deslizar.
   *
   * Además: cero JavaScript añadido, y el 16/16 de accesibilidad se queda como está.
   * Un carrusel accesible de verdad —teclado, lector de pantalla, foco, pausa— es
   * bastante más código que esto, para enseñar menos.
   *
   * CADA FOTO ES UN ENLACE a su archivo mayor. Sin JavaScript, sin ventana modal y
   * sin trampas: el visitante ve la foto grande en su propio visor y vuelve con el
   * botón de atrás, que es lo que ya sabe hacer.
   */
  import { srcset, anchosDe } from '$lib/datos/fotos';
  import type { FotoDeGaleria } from '$lib/datos/galeria';

  interface Props {
    fotos: FotoDeGaleria[];
    /** Qué se dice debajo. Va marcado como propuesta por quien lo use. */
    nota?: string;
  }
  let { fotos, nota }: Props = $props();

  const mayorDe = (f: FotoDeGaleria) => {
    const a = anchosDe(f.maxAncho);
    return a[a.length - 1];
  };
</script>

<ul class="reticula">
  {#each fotos as foto}
    <li>
      <!-- El enlace apunta al JPEG, que lo abre cualquier navegador. El AVIF y el
           WebP viajan en el <picture> de dentro, que es donde se ahorran bytes. -->
      <a href="/fotos/{foto.nombre}-{mayorDe(foto)}.jpg">
        <picture>
          <source type="image/avif" srcset={srcset(foto.nombre, 'avif', foto.maxAncho)} sizes="(min-width: 768px) 250px, 46vw" />
          <source type="image/webp" srcset={srcset(foto.nombre, 'webp', foto.maxAncho)} sizes="(min-width: 768px) 250px, 46vw" />
          <img
            src="/fotos/{foto.nombre}-400.jpg"
            srcset={srcset(foto.nombre, 'jpg', foto.maxAncho)}
            sizes="(min-width: 768px) 250px, 46vw"
            alt={foto.alt}
            width="400"
            height="267"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <span class="pie" data-propuesta="true">{foto.pie}</span>
      </a>
    </li>
  {/each}
</ul>

{#if nota}
  <p class="nota" data-propuesta="true">{nota}</p>
{/if}

<style>
  .reticula {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    /* Dos columnas en teléfono, tres desde 768. El ancho máximo NO es estético: las
       fuentes miden entre 440 y 985 px y pasando de ahí se verían escaladas. Ver la
       nota de resolución en `galeria.ts`. */
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
    gap: var(--e-2);
    max-width: 790px;
  }

  /* TODAS LAS TARJETAS, LA MISMA ALTURA. Sin esto la retícula sale dentada en cuanto
     un pie ocupa dos renglones y otro uno: se vio en la captura de 1280. El pie se
     pega abajo con `margin-top: auto` y la fila entera se iguala con `1fr`. */
  li { margin: 0; display: grid; }

  a {
    display: flex;
    flex-direction: column;
    height: 100%;
    text-decoration: none;
    color: inherit;
    border: 1px solid var(--panel-borde);
    background: var(--panel);
  }

  /* El objetivo táctil es la tarjeta entera, no el pie: muy por encima de los 44 px
     que exige el sistema. */
  a:focus-visible {
    outline: 3px solid var(--oro-500);
    outline-offset: 2px;
  }

  picture { display: block; }

  img {
    display: block;
    width: 100%;
    /* `height: auto` NO es decorativo: los atributos `width`/`height` del <img> entran
       como hint de presentación del navegador, `width: 100%` solo pisaba el primero, y
       `aspect-ratio` no actúa mientras ninguna dimensión sea `auto`. Sin esta línea
       las fotos salían de 169×267 —verticales— en vez de 3:2. Medido. */
    height: auto;
    /* Todas al mismo formato, aunque las fuentes no lo tengan: una retícula con seis
       proporciones distintas se ve rota. Lo que sobra se recorta al centro. */
    aspect-ratio: 3 / 2;
    object-fit: cover;
    background: var(--superficie-oscura);
  }

  .pie {
    display: block;
    margin-top: auto;
    padding: var(--e-2);
    font-size: var(--pie-tam, 0.8125rem);
    line-height: 1.35;
    color: var(--tinta);
  }

  .nota {
    max-width: 790px;
    margin-top: var(--e-3);
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--tinta-secundaria);
  }

  @media (min-width: 768px) {
    .reticula { grid-template-columns: repeat(3, 1fr); }
  }
</style>

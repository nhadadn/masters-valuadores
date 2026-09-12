---
tipo: adr
id: ADR-0022
estado: ACEPTADA
fecha: 2026-09-11
decide: Nadir
extiende: ADR-0009
implementa: Claude Code
---

# ADR-0022 · Retícula de fotos reales en empeño, y por qué no es un carrusel

## Qué se pidió

> *«Necesitamos que se incorporen las imágenes en empeño, una sola imagen estática no
> dice mucho, me gustaría poder incorporar un slider/carrusel 3D con imágenes en un
> fondo que ostente lujo y sofisticación […] ya tenemos más contenido que podrías
> agregar, o también, buscar en línea es una opción.»* — Nadir

Se aceptó **más imágenes** y se rechazó **el carrusel**. La decisión la tomó Nadir con
las razones delante.

## 1 · Retícula, no carrusel

| | |
|---|---|
| Un carrusel esconde | detrás de un gesto lo que aquí cabe a la vista |
| La audiencia del contrato | alguien con prisa, en un teléfono de gama baja, que necesita liquidez hoy. Es quien menos va a deslizar |
| Un carrusel accesible de verdad | teclado, lector de pantalla, foco, pausa. Mucho más código para enseñar menos |
| Coste en JavaScript | **cero añadido**. El 16/16 de accesibilidad se queda como está |

El «coverflow» 3D además no lee a *top tier*: lee a 2012. Y el lujo ya está puesto —
el mármol y el oro del [[ADR-0020-crema-calida-y-marmol|ADR-0020]]. Lo que le faltaba
a empeño no era un efecto, eran cosas de verdad.

**Cada foto es un enlace a su archivo mayor.** Sin ventana modal, sin JavaScript y sin
trampas: el visitante la ve grande en su propio visor y vuelve con el botón de atrás.

## 2 · Tres cosas que apareció al abrir el material

### a) El video de la tanda es un render de IA

Lleva la marca de agua **«Veo»**, el generador de video de Google. Son unas
instalaciones ficticias al atardecer —un complejo con contenedores, grúas y decenas de
personas— que **no existen**. Publicarlo prometería un lugar al que nadie puede llegar,
que es justo lo que el `CLAUDE.md` prohíbe. Y es lo contrario de lo que se pidió: *no
algo genérico creado por AI*.

**No entra.** Queda documentado aquí para que nadie lo vuelva a proponer sin saberlo.

### b) Las piezas de joyería son fotografía de catálogo de Rolex

Las siete piezas de MÁSTER JOYERÍA llevan la fotografía oficial del **Rolex Day-Date**
con la marca ROLEX en grande. Publicarla en el sitio comercial de un tercero sugiere
ser distribuidor autorizado.

**No se sube.** No es una objeción de diseño y no es una decisión que le toque tomar a
quien implementa: si el cliente la quiere, es una conversación suya con su abogado.
Traen además el teléfono en disputa y `MÁSTER` con acento, que contradice el
[[ADR-0018-la-marca-es-master-sin-s|ADR-0018]].

### c) Había fotografías reales sin usar, y son la respuesta

Las piezas 22 y 23 traen **seis fotografías reales de su patio**. La 23 es literalmente
de empeño: *«EMPEÑO INMEDIATO · DINERO RÁPIDO CON TU EQUIPO»*.

Entran **cinco recortes nuevos** —rodillo Benford, rodillo y 310D bajo techo,
montacargas Yale, brazo articulado con torres de iluminación, máquinas de soldar— más
la del patio que ya usaba maquinaria. Sin tinte y sin el rótulo del ADR-0009, porque
no son de archivo: son suyas.

## 3 · Sobre «buscar en línea»

Se puede, y el [[ADR-0009-fotografia-de-banco|ADR-0009]] ya lo permite como provisional
rotulado. Pero empeora justo el problema que se quería resolver: hoy hay tres fotos de
banco en el sitio con un sello que dice «FOTO DE ARCHIVO», y añadir seis más en un
carrusel elegante lo vuelve **más** de plantilla, no menos.

Para empeño no hizo falta. Donde sí falta material real es **joyería**: no hay una sola
foto suya, y eso se arregla con una petición a Cristóbal, no con un banco de imágenes.

## 4 · El límite que no se arregla con código

Las fotos reales viven dentro de arte que WhatsApp ya comprimió: la fuente mide entre
**440 y 985 px**. Por eso `maxAncho` es bajo, por eso la retícula no crece más de
790 px, y por eso no se generan anchos que la fuente no aguanta — escalar sería
inventar píxeles y pesar más por una imagen más borrosa.

**Con los originales de Cristóbal esto se ve mejor sin tocar una línea de código.**

Un recorte se probó y se tiró: la panorámica de la pieza 22 medía 985×246 y en una
celda 3:2 se recortaba al centro, así que salía borrosa **y su pie dejaba de describir
lo que se veía** — prometía «la 310D y el rodillo» y se veía una cuchara. Repetir una
foto entre dos páginas es menos malo que publicar una mala.

## 5 · Lo que las fotos NO dicen

**No son una lista de existencias.** Están dentro de piezas de fecha desconocida y
nadie ha confirmado que ese equipo siga ahí. Que alguien venga por el rodillo Benford y
no esté es exactamente el daño que describe el `CLAUDE.md`.

Por eso el titular dice «Algo de lo que han tenido», ningún pie dice «en venta» ni
«disponible», y la nota lo deja escrito para el visitante.

## 6 · Dos defectos de medición, encontrados de paso

Ninguno lo provocó este cambio; los dos se encontraron por usarlos con él.

1. **`medir-portada.mjs` leía `content-length` y daba 0 cuando faltaba.** `npx serve`
   no la manda en todas las respuestas. Resultado medido: informaba **«js 0 KB»** en la
   única página del sitio que sirve JavaScript, mientras `monedas.js` viajaba con 21018
   bytes de cuerpo. Ahora pesa lo transferido de verdad:

   | | Antes | Después |
   |---|---|---|
   | Peso total de empeño | 180.4 KB | **203.2 KB** |
   | js | 0 KB | 7.6 KB |
   | css | 1.7 KB | 10 KB |

   Es el mismo defecto que el guardia de CA-10 el mismo día, en otra herramienta:
   medir por donde es cómodo y callar lo que no cabe por ahí.

2. **Tres listas de fotos a mano, ya divergidas.** `hacer-webp.mjs`, `hacer-avif.mjs` y
   `hacer-miniaturas.mjs` tenían cada una su lista literal y no coincidían. Olvidar una
   significa publicar un `<picture>` cuyo AVIF no existe: el navegador cae al JPEG sin
   decir nada y se sirve el formato más pesado. Los dos primeros derivan ahora del
   directorio.

Y un fallo propio que solo se vio mirando: las fotos salían **verticales**, 169×267 en
vez de 3:2. Los atributos `width`/`height` del `<img>` entran como hint de presentación
del navegador, `width: 100%` solo pisaba el primero, y `aspect-ratio` no actúa mientras
ninguna dimensión sea `auto`.

## Lo medido

| | |
|---|---|
| Peso de empeño | **203.2 KB** en 22 peticiones · 0 de terceros |
| LCP | **2024 ms** · umbral 2500 |
| AVIF de las cinco nuevas | 13.1 a 18.5 KB · SSIM 0.970–0.976 |
| Carga | `loading="lazy"`: van bajo el pliegue y no compiten con el LCP |
| CA-10 | cumplido · 7.43 KB en empeño, 0 en las otras siete |
| Accesibilidad | 16/16 CUMPLE · contraste 0 hallazgos |

## Consecuencias

- La retícula sale del **dato** (`muestraInventario`), no del slug. Maquinaria es la
  siguiente candidata obvia y es una línea de cambio, pero esa decisión no es nuestra.
- El `srcset` vive ahora en `$lib/datos/fotos`, en un solo sitio, y `Foto.svelte` lo usa.
- **Joyería sigue sin una sola foto real.** Es la petición que hay que hacerle a
  Cristóbal, junto con los originales de las que sí hay.

## Evidencia

| Qué | Dónde |
|---|---|
| La retícula | `src/lib/componentes/Galeria.svelte` |
| Las fotos y sus pies | `src/lib/datos/galeria.ts` |
| El `srcset`, en un solo sitio | `src/lib/datos/fotos.ts` |
| De dato y no de slug | `src/lib/datos/giros.ts` · `muestraInventario` |
| Qué es cada pieza de la tanda | [[evidencia-tanda-11-septiembre]] |
| Peso y LCP | `RUTA=/empeno-y-prestamo/ node herramientas/medir-portada.mjs` |

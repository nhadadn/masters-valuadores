---
tipo: adr
id: ADR-0034
estado: ACEPTADA
fecha: 2026-09-15
decide: Nadir
revierte: ADR-0007 · «van fotos suyas o va hueco»
extiende: ADR-0033
implementa: Claude Code
---

# ADR-0034 · Entran imágenes generadas, como referencia

## Qué se decide

**Entran cuatro imágenes generadas** a la secuencia de relojería y joyería de
`/empeno-y-prestamo/`, detrás de las tres vistas de su fotografía real.

Esto **revierte** la parte del [[ADR-0007-lenguaje-visual|ADR-0007]] que el
[[ADR-0009-fotografia-de-banco|ADR-0009]] había dejado en pie. Su texto, citado en el
0009:

> «La maquinaria de banco. Sus piezas usan imágenes de archivo **o generadas**. En el
> sitio van fotos suyas o va hueco.»

El 0009 revirtió solo la mitad —la de archivo, y con rótulo—. Esta revierte la otra.

Decidido por **Nadir**, 15 de septiembre, **tras plantearse la objeción por escrito dos
veces y reafirmarse la instrucción**: *«Dude tómalo de las imágenes que ya tienes… igual
te las reenvío»*. Mismo procedimiento que el ADR-0009.

## La objeción, registrada

Se dijo antes de hacerlo y queda aquí para que exista cuando alguien pregunte:

1. **Una imagen generada no es una foto de archivo: es una pieza que no existe.** El
   ADR-0009 ya escribió el costo de la de archivo —*«quien ve una excavadora impecable y
   llega a un patio distinto se siente engañado»*—. Aquí no hay ningún patio al que
   llegar.
2. **Dos de las cuatro imitan el lenguaje de carátula de marcas reales.** En una, tres
   renglones de letra ilegible ocupan el sitio donde va el nombre del fabricante.
3. **Ataca justo lo que vende el negocio.** Toda la propuesta es «traes tu bien y lo
   valuamos de verdad». Ilustrarlo con piezas inventadas toca esa credibilidad, no otra.

Nada de eso es un veto. Es el costo, escrito antes de pagarlo.

## Y un hallazgo que juega a favor de la decisión

Esto también hay que decirlo, porque es lo que más pesa en contra de mi propia objeción
y lo encontré midiendo: **a tamaño de publicación los defectos no se ven.**

Los artefactos que rechazaron estas imágenes el 15 de septiembre —el «28» cortando un
contador, la marca inventada «PANSH», los romanos fuera de orden— se detectaron **al
100 % sobre originales de 1200 px**. Renderizadas a **320×213**, que es la celda real del
carrusel medida en vivo, ninguna de las cuatro se delata.

Mi inspección era correcta y **su conclusión práctica estaba sobredimensionada**. La
decisión de Nadir está mejor fundada de lo que mi objeción sugería.

## Cómo se limita el daño

Tres decisiones que acompañan a la principal.

**1 · Topadas a 600 px, y no es un detalle técnico.** Cada tarjeta del carrusel
**enlaza al archivo más grande que exista** de esa foto. Publicar los originales de 1200
dejaba la versión inspeccionable a un toque. A 600 los defectos no se resuelven.

**2 · Van al final, no mezcladas.** La secuencia va de lo propio a lo ilustrativo: las
tres vistas de su Breitling primero, las cuatro de referencia después. Así la nota del
final cubre una cola y no un surtido.

**3 · Una nota calculada, no un rótulo.** Al pie de la secuencia:

> Las últimas 4 son imágenes de referencia, no de nuestro inventario.

Y es deliberadamente **una nota y no el rótulo «FOTO DE ARCHIVO»** que Nadir pidió
quitar de la interfaz: una línea de crédito al pie, como la que lleva cualquier
publicación, en vez de una etiqueta encima de cada imagen.

**El número se calcula del dato**, del campo `referencia` en `galeria.ts`, así que no
puede quedarse desactualizada: si mañana entran fotos de Cristóbal y salen estas, la nota
desaparece sola. Y el hecho de que sean generadas vive **en el dato**, no solo en un
comentario, para que nadie tenga que volver a deducirlo mirando píxeles.

Si Nadir quiere la secuencia sin nota, es quitar un `nota={...}` de la plantilla. Queda
dicho aquí que esa es la línea que yo no cruzaría por mi cuenta.

## Una regresión propia, y cómo se vio

Al meter la secuencia dentro de la rejilla de la entrada, **la página se desbordó a lo
ancho y no dio un solo error**.

Un ítem de rejilla tiene `min-width: auto`, o sea que **no baja de su ancho mínimo de
contenido**. La pista del carrusel son 7 tarjetas de 262 px en fila: mínimo ~1834 px. La
columna se estiró hasta ahí y el `overflow-x: auto` del carrusel nunca llegó a actuar.

Medido en la página construida, a **390 px de ventana**:

| | Roto | Arreglado |
|---|---|---|
| `scrollWidth` | **1920 px** | 390 |
| Foto de entrada | **1920×2417** | 390×491 |
| Alto de la sección | **3044 px** | 1139 |

Se arregla con `grid-template-columns: minmax(0, 1fr)` y `min-width: 0` en la secuencia.
Lo delató una captura de 780×6088 px, no una prueba.

## Lo medido

| | |
|---|---|
| Desbordamiento horizontal | **0 px** a 390, 768, 1280 y 1920 |
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| CA-10 | cumplido · 27.90 KB de margen |
| **LCP** | **1344 ms ✓ bueno** |
| Peso | 218.5 → **242.8 KB** · 27 peticiones · 0 de terceros |
| Alto de la página | **5.8 pantallas** |

Los 24 KB de más son las imágenes de referencia que alcanzan a pedirse; son perezosas y
viven en un carrusel horizontal, así que no entran todas de golpe.

## Lo que esto NO resuelve

**Sigue faltando la fotografía.** Cuatro imágenes de referencia no son cuatro piezas de
Cristóbal, y la diferencia la nota quien conoce el negocio antes que quien conoce los
relojes. El pedido de fotos sigue sin hacerse porque se dijo «todavía no», y sigue siendo
lo único que convierte esta secuencia en una galería de verdad.

Revertir esto es un `git revert` y quitar siete archivos de `static/fotos/`.

## Evidencia

| Qué | Dónde |
|---|---|
| El dato, con `referencia` y la nota calculada | `src/lib/datos/galeria.ts` |
| La trampa de la rejilla, comentada | `src/routes/[giro]/+page.svelte` · `.entrada-b` |
| Los archivos, topados a 600 | `static/fotos/lujo-{vitrina,cronografo,esqueleto,piel}-*` |
| Los originales, fuera del repositorio | `fotos-origen/generadas-rechazadas/` |
| A tamaño de publicación | `capturas/publicacion.png` |
| Cómo queda | `capturas/lujo-390.png` · `capturas/lujo-1280.png` |

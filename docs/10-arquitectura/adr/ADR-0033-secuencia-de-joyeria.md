---
tipo: adr
id: ADR-0033
estado: ACEPTADA
fecha: 2026-09-15
decide: Nadir
extiende: ADR-0022 · ADR-0032
corrige: ADR-0024
implementa: Claude Code
---

# ADR-0033 · La secuencia de joyería, y el tercer WhatsApp que sobraba

## Qué se pidió

> *«Necesitamos añadir más imágenes para esta pantalla… se ve vacío y otra vez sale la
> parte de WhatsApp… Aquí sería bueno colocar más fotos de relojes de lujo como una
> preview dinámica, como lo que dice "lo que tienen en patio" pero de relojería y
> joyería.»* — Nadir, tercera vez que lo pide

## Las dos quejas eran correctas, y se midieron

En vivo, a 390 px, en esa misma pantalla:

| | |
|---|---|
| Llamadas a WhatsApp visibles a la vez | **TRES** |
| Mármol vacío bajo la foto | **152 px** |

Las tres: «Enviar foto por WhatsApp» del panel de consulta en `y=-44`, el de la sección
en `y=92` y el de la barra fija en `y=788`. **Dos con etiqueta idéntica.**

## Lo que cambió mi respuesta: estaba midiendo con la vara equivocada

Las dos veces anteriores dije que no había material para una galería. El dato que
faltaba no era cuántas fotos hay, sino **con qué resolución se sirve la galería que ya
existe**. Medido en vivo:

| | celda pintada | archivo servido | densidad real |
|---|---|---|---|
| patio · 390 px | 262×177 | 288×180 | **1.1×** |
| patio · 1280 px | 320×213 | 320×200 | **1.0×** |

El listón son ~300 px de ancho nativo, no 800. **Estaba exigiendo a la joyería una
calidad que el carrusel del patio no cumple hoy.** El original vertical que entró con el
[[ADR-0032-la-foto-sale-del-marco|ADR-0032]] mide 1206 px, así que sí da.

## Una corrección al ADR-0024

Ese ADR dice que entraron **«dos de su joyería»**, y el `CLAUDE.md` lo repetía.
Comprobado mirándolas: **`bien-joyeria` y `bien-oro` son la MISMA fotografía**.
`bien-oro` es el recorte de la zona inferior izquierda —la cadena, el final del
brazalete y los anillos de abajo— de la misma toma.

Así que el inventario real de joyería es **una fotografía**, no dos. Conviene tenerlo
escrito porque cambia lo que se puede prometer.

## Lo que se publica

**Tres vistas de esa única fotografía**, recortadas del original de 1206×1518:

| Nombre | Nativo | Pie (propuesta) |
|---|---|---|
| `joy-reloj` | 624×416 | Cronógrafo Breitling con bisel de diamantes |
| `joy-cadena` | 624×416 | Cadena de eslabón cubano en oro |
| `joy-conjunto` | 1000×666 | Reloj, cadena y anillos |

La técnica es la del [[ADR-0022-reticula-de-fotos-reales|ADR-0022]]: recortar sus
propias piezas. Todo lo que se ve es una pieza real que pasó por su mostrador.

**Y el límite, dicho antes de que lo diga nadie:** detalle, detalle y plano de conjunto
es una secuencia editorial normal, pero **no es lo mismo que las seis del patio**, donde
un rodillo y un montacargas son objetos distintos. Con una cámara y cuatro piezas más
esto se vuelve una galería de verdad. Hoy es una sola toma, bien vista.

### Tres recortes más que se tiraron

Se intentaron tres de la charola, uno por pareja de anillos. Los tres salieron mal, y el
motivo está en el original: **la charola queda pegada al borde derecho del encuadre, así
que los anillos vienen ya cortados en la foto**. Ningún recorte arregla eso. Se miraron
en hoja de contactos y se tiraron.

## El tercer WhatsApp sale, y se elige cuál

Sale **el de la sección**, no los otros dos. El del panel de consulta lleva su propio
mensaje —«Mándanos una foto»— y la barra fija es la que garantiza que la página nunca se
queda sin CTA, que es el argumento con el que el
[[ADR-0027-fuera-las-marcas-de-borrador|ADR-0027]] justificó bajar el botón a 1241 px.

Queda **«Llamar»**, que es otro canal y no se repite en ningún sitio. Medido después:
**2 por pantalla**, no 3.

## Cuatro fallos silenciosos del segundo carrusel

`Carrusel.svelte` era reutilizable de props, pero montar una segunda instancia rompía
cuatro cosas y **ninguna daba error en consola**:

1. **`document.querySelector('.pista')`, en singular.** Los puntos del segundo carrusel
   medían distancias contra las tarjetas del primero.
2. **`document.querySelectorAll('.saltos a')`, global.** Juntaba los puntos de los dos,
   así que `aria-current` se encendía en el carrusel equivocado.
3. **`id="foto-{i}"` duplicado.** Dos instancias emitían `foto-0`, `foto-1`… y las
   anclas del segundo llevaban al primero. Ahora cada instancia pasa su `clave`.
4. **El `<script>` se ejecuta DOS veces.** `svelte:head` lo inyecta por instancia; el
   navegador lo descarga una vez y lo ejecuta dos, duplicando oyentes y observadores.
   Lleva cerrojo en `window`.

Cada pista se empareja ahora con **su** nav de saltos buscándolo entre sus hermanos. No
por índice global a propósito: si mañana cambia el orden del marcado, emparejar por
índice volvería a cruzarlos en silencio.

Verificado en la página construida:

```
ids duplicados: 0
carrusel joyería: 3 tarjetas · 3 puntos · 3 aciertan  (#joya-0)
carrusel patio:   6 tarjetas · 6 puntos · 6 aciertan  (#foto-0)
```

## La composición: por áreas, no por orden

El teléfono quiere **botón → foto grande → detalles**, y ese es el orden del DOM. En
escritorio la foto ocupa la columna derecha entera y la izquierda se reparte entre el
botón y la secuencia, con `grid-template-areas` — sin tocar el marcado.

Antes de esto, quitar el WhatsApp había dejado la izquierda **peor**: mármol vacío con un
solo botón flotando. Ahora tiene contenido arriba y abajo.

## Lo medido

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| **LCP** | **1336 ms ✓ bueno** · mismo elemento |
| WhatsApp por pantalla | 3 → **2** |

**Y los dos costos, que no se esconden:**

| | Antes | Después |
|---|---|---|
| JavaScript de la página | 11.5 KB | **12.4 KB** |
| Margen de CA-10 | 28.68 KB | **27.90 KB** |
| Alto de la página | 5.4 pantallas | **6.4** |

La página crece una pantalla entera. Es lo que cuesta la secuencia, y va dicho aquí
porque el `ADR-0027` la había bajado a 5.1 a propósito.

El peso informado sigue siendo 218.5 KB en **25 peticiones**: las tres imágenes nuevas
son perezosas y no llegaron a pedirse en esa vuelta. Igual que en el `ADR-0032`, **eso no
es una mejora, es una medición corta**.

## Lo que queda abierto

- **La izquierda en escritorio sigue teniendo aire** entre el botón y la secuencia. Puede
  leerse como bookend deliberado o como hueco; sin copy aprobado no hay con qué llenarlo.
- **La secuencia es una sola fotografía.** Para que sea la galería que se pidió hacen
  falta 4-5 piezas más, con cámara. El pedido para Cristóbal sigue sin hacerse porque se
  dijo «todavía no».

## Evidencia

| Qué | Dónde |
|---|---|
| Los datos y el límite, escrito | `src/lib/datos/galeria.ts` · `galeriaJoyeria` |
| El carrusel multi-instancia | `static/animacion/carrusel.js` · `Carrusel.svelte` · `clave` |
| La composición por áreas | `src/routes/[giro]/+page.svelte` · `.entrada-b` |
| Los tres recortes | `static/fotos/joy-{reloj,cadena,conjunto}-*` |
| Cómo queda | `capturas/joy-1280.png` · `capturas/joy-390.png` |

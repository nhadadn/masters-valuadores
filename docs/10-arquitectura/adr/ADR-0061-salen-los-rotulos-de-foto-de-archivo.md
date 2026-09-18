---
tipo: adr
id: ADR-0061
estado: ACEPTADA
fecha: 2026-09-17
decide: Nadir
enmienda: ADR-0009, punto 1 —«se marca en pantalla»— · cierra lo que el ADR-0031 dejó «sin decidir» · y la regla que queda del ADR-0007 en el CLAUDE.md, fuera de la secuencia de joyería
implementa: Claude Code
---

# ADR-0061 · Salen los rótulos «FOTO DE ARCHIVO»

## Qué se pidió

> *«C7 · ¿Los dos rótulos «FOTO DE ARCHIVO» se quedan? NO, QUÍTALOS.»* — Nadir

### Una corrección antes de seguir

La propuesta contaba **dos** rótulos, los de la portada. **Eran cuatro.** Las dos fotos de archivo
que quedan —la del camión de fletes y la de las manos con la caja de herramienta de taller— se
publican dos veces cada una: en el mosaico de la portada y en la página de su línea, y las dos veces
con rótulo. Contado en el HTML servido: 2 en `/`, 1 en `/fletes/` y 1 en `/taller/`.

El rótulo vive en un solo sitio, `Foto.svelte`, y el criterio de la decisión es el mismo que el
ADR-0054 aplicó al planeta —*«No es necesario distinguir/avisar que no son fotos del cliente»*—. Así
que **salen los cuatro**. Si la intención era quitar solo los de la portada, los otros dos vuelven con
una propiedad; queda dicho para que Nadir lo confirme.

## Lo que se decide

- **Sale el rótulo de `Foto.svelte`**, con su CSS y con la propiedad `compacto`, que solo servía para
  acortarlo. Sus dos llamadas —el mosaico y la `Tarjeta` que ya nadie usa— dejan de pasarla.
- **Salen del mosaico las tres reglas** que subían el rótulo por encima del título de la pieza.
- **Se queda `data-provisional`.** No se ve, y es lo que permite contar cuántas fotos de archivo
  siguen publicadas: hoy 2 en la portada, 1 en fletes y 1 en taller.
- **Se queda la nota de la secuencia de joyería** —*«Las últimas 6 son imágenes de referencia, no de
  nuestro inventario»*—. Es de otra familia —las imágenes generadas del ADR-0034— y no se preguntó.

### Lo que apareció al medir

El tinte dorado del ADR-0009 —el otro aviso, *«lo teñido no es suyo»*— **no se aplica en las páginas
de línea**, y ya no se aplicaba antes de este cambio: la plantilla le pone a su foto
`filter: contrast(1.08) saturate(1.04)`, y ese filtro gana. Medido en `/taller/`: la imagen lleva la
clase `tenida` y computa el filtro de la plantilla. En el mosaico de la portada el tinte sí se ve.

**Consecuencia: en `/fletes/` y `/taller/` la foto de archivo queda sin ninguna marca visible.** No se
corrige: devolverle el tinte sería volver a marcarla, que es lo contrario de lo que se decidió. Queda
anotado en la plantilla, junto al filtro.

## La objeción, registrada

1. **En taller, la foto se lee como su taller.** Unas manos eligiendo dados de una caja de
   herramienta, bajo «Taller en Torreón» y junto a «Llamar». Desde el ADR-0058 la página habla de
   diagnóstico donde estés y de unidad de rescate: la foto que falta es la de su unidad, y está en la
   lista de tomas para Cristóbal.
2. **En fletes, el camión se lee como su unidad.** Un camión de carga con un contenedor, bajo
   «Fletes en Torreón» y *«Movemos maquinaria pesada y carga general»*.
3. **La regla que quedaba del ADR-0007 se reduce a una nota.** Con el ADR-0054 y este, lo único que en
   pantalla distingue una imagen ajena es la nota de la secuencia de joyería.

Lo que **sí** sigue en pie: **ninguna finge ser la fachada.** Ni el camión ni la caja de herramienta
son un local.

## Lo medido

Sitio publicado —antes— contra el build local —después—.

| | Antes | Después |
|---|---|---|
| Rótulos «FOTO DE ARCHIVO» en pantalla | **4**: 2 en `/`, 1 en `/fletes/`, 1 en `/taller/` | **0** |
| `data-provisional` | 2 · 1 · 1 | **2 · 1 · 1**, igual |
| Nota de la secuencia de joyería | 1, en empeño | **1**, igual |
| Avisos de `svelte-check` | 2 | **1**: se va el de `<figcaption>` fuera de su `<figure>` |

| Verificación | Resultado |
|---|---|
| Tests | **197**, todos pasan. El de este ADR falla si el rótulo vuelve: comprobado mutando `Foto.svelte` |
| Accesibilidad | **18/18 CUMPLE** |
| JavaScript | sin cambio |

## Evidencia

| Qué | Dónde |
|---|---|
| El rótulo que salió, y lo que queda | `src/lib/componentes/Foto.svelte:14` · `:42` · `:88` · `:149` |
| El mosaico, sin rótulo ni sus reglas | `src/lib/componentes/MosaicoLineas.svelte:26` · `:97` |
| El filtro que pisa el tinte en las líneas | `src/routes/[giro]/+page.svelte:467` |
| Tests | `tests/rotulos-de-archivo.test.ts:26` · `:33` · `:39` |
| Cómo queda | `capturas/armonia-antes-despues-390.png` · `capturas/taller-entrada-390.png` |

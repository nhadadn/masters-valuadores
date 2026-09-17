---
tipo: adr
id: ADR-0058
estado: ACEPTADA
fecha: 2026-09-17
decide: Nadir
aplica: docs/30-cliente/evidencia-tanda-17-septiembre.md · puntos 1, 2 y 3
implementa: Claude Code
---

# ADR-0058 · El taller según su volante, la referencia para llegar y el correo

## Qué se pidió

Nadir depositó una tanda de imágenes en `docs/00-inbox/2026-09-17-imagenes/`. De 31 archivos, seis
eran nuevos y los seis resultaron piezas de redes, no fotografías: ver
[[evidencia-tanda-17-septiembre]]. De ahí salieron cuatro cosas aplicables, y Nadir eligió tres:

> *«aplica los puntos del 1,2,3.»* — Nadir

1. El taller, con lo que dice su volante «Taller mecánico diesel».
2. La referencia para llegar, junto a la dirección.
3. El correo del negocio.

El cuarto —misión y visión— **no se aplicó**: no hay sección donde vivan.

## Lo que se decide

### 1 · El taller

Hasta hoy la página decía «Servicio de taller» y «Traes tu unidad, la revisamos…». Ninguna de las
24 piezas del 11 de septiembre hablaba del taller: era copy supuesto. Su volante dice otra cosa, y
con sus palabras queda así, **como propuesta**:

| Campo | Antes | Ahora |
|---|---|---|
| Frase (pieza del mosaico) | Servicio de taller | Mecánica diésel para camiones, pick ups, autobuses y maquinaria pesada |
| Subtítulo | Traes tu unidad, la revisamos y te decimos qué necesita antes de hacer el trabajo. | Mantenimiento general, reparación de motor, inyección, transmisión, frenos y suspensión. Hacemos el diagnóstico donde te encuentres y contamos con unidad de rescate. |
| Proceso | Traes tu unidad · La revisamos · Hacemos el trabajo | **Nos dices qué falla** (la traes o vamos a donde estés) · **La diagnosticamos** (con escaneo computarizado) · **Hacemos el trabajo** (cuando tú lo autorizas) |
| Descripción para buscadores | Servicio de taller en Torreón, Coahuila. Traes tu unidad… | Taller mecánico diésel en Torreón, Coahuila: camiones, pick ups, autobuses y maquinaria pesada. Diagnóstico donde te encuentres y unidad de rescate. |

**Lo que NO se tomó del volante**: «Trabajamos con calidad y garantía» y «Soluciones diesel con
fuerza, experiencia y compromiso». Son promesas que ninguna evidencia sostiene.

«Cuando tú lo autorizas» no sale del volante: ya estaba en el proceso anterior y se conserva como
propuesta.

### 2 · La referencia para llegar

**«Frente a Al Super del Periférico»**, literal de su pieza «Máster Joyería». Va **debajo** de la
dirección, nunca en su lugar: la dirección es la de su ficha de Google, y el NAP tiene que ser
idéntico en todas partes. Sale en la ficha de «Dónde estamos» y en el pie de las nueve páginas.

Se escribe como la escribieron ellos. La cadena se anuncia como «Alsuper» o «Al Súper»; si
Cristóbal prefiere otra grafía, se cambia en un solo sitio.

### 3 · El correo

**mastervaluadores@outlook.com**. Aparece en su tablero de marca (11 de septiembre), en el volante
del taller y en sus dos banners (17 de septiembre).

- **En el pie de las nueve páginas**, bajo el teléfono y a tamaño de apoyo: el número sigue mandando.
- **En la ficha de contacto**, junto al teléfono. En la portada y las líneas la ficha no lleva
  teléfono (ADR-0051), así que tampoco correo.
- **En el grafo**: `email` en la organización y en el local.

### Dónde vive

Los dos datos entran a `negocio.ts`, que sigue siendo la única fuente. **El guardia de fugas caza
ahora también correos escritos a mano** en rutas y componentes.

## Lo medido

| | |
|---|---|
| Tests | **186**: 4 nuevos en `tests/correo-y-referencia.test.ts`. **3 de 3 mutantes cazados**: quitar el correo del pie, la referencia de la ficha y el `email` del grafo |
| Guardia de fugas | con el patrón de correo, las fuentes siguen limpias |
| Proceso del taller | cada acción en 4 palabras o menos, sin punto final, con íconos que existen |
| Nueve páginas × 360, 390 y 1280 | correo enlazado en el pie con 44 px de alto, referencia bajo la dirección, `email` dos veces en el grafo, sin desborde |
| Accesibilidad | **18/18 CUMPLE** |
| Inventario tipográfico | ninguna combinación fuera de la escala |
| JavaScript | sin cambio · CA-10 con **35.55 KB** de margen |

## Lo que queda abierto

- **La norma de casas de empeño pide el correo en la primera vista** de la portada (NOM-179-SCFI-2016,
  numeral 4.1.3). El pie no es primera vista. Se resuelve junto con el resto de ese numeral —costos,
  CAT, registro y contrato—, que depende de datos de Cristóbal.
- **El título de la página sigue siendo «Taller en Torreón».** Cambiarlo a «Taller mecánico diésel»
  no se pidió.
- **La foto del taller sigue siendo de archivo.** Su volante menciona una unidad de rescate: una foto
  real de ella es la toma que más valdría.

## Evidencia

| Qué | Dónde |
|---|---|
| Los tipos | `src/lib/config/negocio.ts:53` · `:80` |
| Los datos | `src/lib/config/negocio.ts:139` · `:173` |
| El grafo | `src/lib/seo/jsonld.ts:107` · `:120` |
| La ficha | `src/lib/componentes/DatosDelLocal.svelte:58` · `:92` |
| El pie | `src/routes/+layout.svelte:98` · `:107` |
| El ícono del correo | `src/lib/datos/iconos.ts:63` |
| El taller | `src/lib/datos/giros.ts:251` |
| La descripción del taller | `src/lib/seo/meta.ts:87` |
| El guardia de fugas | `tests/sin-fugas.test.ts:35` |
| El test | `tests/correo-y-referencia.test.ts` |

---
tipo: adr
id: ADR-0035
estado: ACEPTADA
fecha: 2026-09-15
decide: Nadir
extiende: ADR-0034
implementa: Claude Code
---

# ADR-0035 · Monedas en la secuencia, y el piso táctil que llevaba roto

## Qué se decide

Entran **dos imágenes generadas de monedas mexicanas** a la secuencia de
`/empeno-y-prestamo/`, que pasa de siete tarjetas a **nueve**. Misma decisión de fondo
que el [[ADR-0034-entran-imagenes-generadas|ADR-0034]], con la instrucción de Nadir:

> *«Se trata de hacer nosotros uso de imágenes y dar una propuesta de primer nivel. Ya
> si quiere cambios que sean puntuales.»*

La etiqueta del carrusel pasa a **«Relojería, joyería y monedas»** y la nota al pie se
recalcula sola: *«Las últimas 6 son imágenes de referencia, no de nuestro inventario.»*
Ese número **no se escribió**: sale del campo `referencia` del `ADR-0034`, que es
exactamente para lo que existe.

## Aquí el riesgo es de otra clase, y hay que decirlo

Con los relojes el defecto vivía en texto diminuto de carátula. **Con una moneda
mexicana el texto ES el tema, y la inscripción está fijada por ley.** Verificado
ampliando al 100 %:

| Lo que dice la imagen | Lo que dice la moneda real |
|---|---|
| Centenario: `50 PESOS` · `19S07` · `1947` | `50 PESOS` · **`1821 1947`** |
| 10 pesos: en el exergo, un literal **`SUBJ`** | `1821 1947` |

No es un artefacto sutil: es un error que reconoce cualquiera que haya empeñado un
centenario, y en la Laguna eso es mucha gente. **Es el peor caso posible para una imagen
generada en este sitio.**

### Y aun así, medido, no llega al visitante

Renderizadas a **320×213** —la celda real del carrusel, medida en vivo— **lo legible es
lo correcto**: «ORO PURO», «PLATA PURA», «1000 g». El `19S07` y el `SUBJ` desaparecen.

Por eso van **topadas a 600 px** igual que las del 0034: cada tarjeta enlaza al archivo
más grande que exista, y a 1200 la versión inspeccionable quedaba a un toque.

## Lo que queda para que Nadir decida

La imagen del mármol oscuro trae **una caja negra con una «M» dorada** y lingotes con un
sello hexagonal **«LM»**. Las dos cosas se leen perfectamente a 320 px.

Publicado en el sitio de MASTER, una «M» dorada sobre una caja de lingotes **no se lee
como ilustración: se lee como lingotes de marca MASTER**. Eso no es una imagen de lo que
valúan, es una afirmación sobre lo que emiten. Es distinto de todo lo anterior y por eso
va aquí y no en un comentario.

**No se tocó.** Es el tipo de cambio puntual que la instrucción anticipa; quitar esa
tarjeta es borrar dos líneas de `galeria.ts`.

## El piso táctil llevaba roto desde que existe el carrusel

Al pasar a nueve tarjetas el validador fue de **CUMPLE a NO CUMPLE**, y el motivo no eran
las monedas:

```
390px /empeno-y-prestamo/
  táctil: {"txt":"Cronógrafo Breitling con bisel d","w":35,"h":44}
  … nueve iguales
```

`Carrusel.svelte` declaraba `width: 44px; height: 44px` en cada punto, con un comentario
al lado que decía *«44 px de objetivo tactil, como exige el sistema»*. Pero los puntos
son **ítems flex con `flex-shrink: 1` por defecto**: los 44 px eran una intención, no un
piso. Nueve por 44 son 396 px contra los 350 de la caja en un teléfono, así que el
sistema los encogió a **35** sin avisar.

**Llevaba roto desde el `ADR-0023`.** No se había visto porque con seis puntos la suma
cabía: el fallo no apareció al escribir el bug, sino al cruzar el umbral.

Se arregla con `flex-wrap: wrap` en la barra y `flex: 0 0 auto` en cada punto: antes de
perder tamaño, se van a un segundo renglón. **Esto blinda también el carrusel del patio**
para cuando entren las fotos de Cristóbal.

## El fantasma del LCP, quinta vez

La medición suelta dio **4124 ms «malo»**, y tres lecturas seguidas dieron 3840, 3828 y
3944 — un grupo apretado, o sea que parecía real y no ruido. Veinte minutos antes, la
misma página medía **1344 ms**.

Intercalado contra el commit anterior, en los dos órdenes:

| | vueltas (ms) | mejor |
|---|---|---|
| antes · 7 tarjetas | 3812 · 3940 · 4216 · 3848 | **3812** |
| ahora · 9 tarjetas | 3732 · 4156 · 4544 · 4004 | **3732** |

Indistinguibles. Y lo que lo cierra: **el commit anterior también mide ~3900 ahora**.
Es la máquina. Sin intercalar se habría reportado una regresión de 2.5 s que no existe.

**Un grupo apretado de lecturas no prueba nada si todas se toman en la misma fase.** Eso
es nuevo respecto a lo que decía el `CLAUDE.md`, y se añade ahí.

## Lo medido

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** · táctil mínimo de vuelta a 44 px |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| CA-10 | cumplido · 27.90 KB de margen · **sin cambio** |
| Desbordamiento horizontal | **0 px** |
| Peso | 242.8 → **243.1 KB** · 27 peticiones · 0 de terceros |
| Alto de la página | 5.8 pantallas · **sin cambio** |
| LCP | **sin cambio atribuible** |

Las dos imágenes son perezosas y viven en un carrusel horizontal, así que añadir dos
tarjetas cuesta 0.3 KB en la carga inicial, no 33.

## Evidencia

| Qué | Dónde |
|---|---|
| Las dos monedas y el aviso del riesgo | `src/lib/datos/galeria.ts` |
| El piso táctil, ahora protegido | `src/lib/componentes/Carrusel.svelte` · `.saltos` |
| A tamaño de publicación | `capturas/monedas-publicacion.png` |
| La inscripción ampliada | `capturas/z-centenario.png` |
| Cómo queda | `capturas/monedas-390.png` · `capturas/monedas-1280.png` |

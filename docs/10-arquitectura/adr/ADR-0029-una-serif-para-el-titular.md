---
tipo: adr
id: ADR-0029
estado: ACEPTADA
fecha: 2026-09-14
decide: Nadir
enmienda: ADR-0002
implementa: Claude Code
---

# ADR-0029 · Entra una serif, y solo para el titular

## De dónde sale esto

Nadir dijo que la página *«se está viendo muy por debajo»* y pidió investigar landings
de primer nivel. **Las dos hipótesis que se midieron primero fueron falsas**: ni el
mármol era más cálido que la referencia (ambos neutros, +3) ni tenía menos rango tonal.

Lo que apareció al mirar tres páginas reales fue otra cosa.

## Lo que hacen las referencias, medido en sus páginas

| | Fondo del cuerpo | Titular |
|---|---|---|
| **Suttons & Robertsons** · empeño de lujo, Londres, 1770 | blanco puro `#FFFFFF` | EB Garamond · **serif · peso 400 · 64 px** |
| **Cosentino / Silestone** · el mayor fabricante de superficies | blanco puro, tinta `rgb(35,35,35)` | Neue Montreal · **peso 300 · 107 px** |
| **Antolini** · mármol natural de lujo | — | Lato, versalitas espaciadas sobre foto |
| **MASTER, antes de esto** | crema `#E3DED4` | Archivo · **peso 900 · 28 px** |

Tres de tres ponen el titular entre **64 y 107 px con peso 300 o 400**. Este estaba en
**28 px con peso 900**, que es exactamente lo contrario.

Y un hallazgo que conviene guardar: **ninguna de las tres usa mármol de fondo.**
Ni siquiera las dos que venden piedra. La fotografían como objeto, a sangre, con el
texto encima. El [[ADR-0028-la-piedra-clara|ADR-0028]] puso la piedra de pared a pared
al 20 %, y por eso no se lee ni como textura ni como material.

## La decisión

Se rindieron seis versiones del titular real —«Empeño y préstamo»— sobre el mármol de
verdad, con las candidatas cargadas solo para la prueba. **Nadir eligió EB Garamond.**

No se eligió a ciegas: la comparación dejó ver que la Cormorant 300, la más elegante de
las seis, se rompe a peso 300 en un teléfono de gama baja a plena luz — que es la
audiencia que fija el contrato.

### Esto enmienda el ADR-0002

Ese ADR cerró **una sola familia**. Ahora son dos, con una frontera estrecha:

- **La serif, solo en el titular y su promesa.** Nada más.
- **Archivo se queda en todo lo demás**: cuerpo, etiquetas, botones, navegación, pasos.

Lo que **no** cambia del ADR-0002: se autoaloja. Google Fonts como CDN sigue prohibido.
EB Garamond es SIL OFL, la misma licencia que Archivo, archivada en
`docs/60-diseno/LICENCIA-eb-garamond.txt`.

**Un solo peso, el 400.** Añadir un 500 «por si acaso» son 23 KB por algo que nadie
pidió.

## Lo que se fue con las mayúsculas

El titular iba en caja alta. En un palo seco de peso 900 eso daba autoridad; en una
serif de 400 aplasta el ritmo de la palabra y pierde justo lo que se viene a buscar.
Se vio en la comparación y salió.

La **promesa** pasa también a la serif. Se quedó un turno en palo seco peso 800 y justo
debajo de una serif de 400 chocaba: dos voces en dos renglones seguidos. En el panel que
Nadir eligió, el subtítulo iba en la misma familia.

## Lo medido

| | Antes | Después |
|---|---|---|
| Titular | Archivo 900 · 28 px | **EB Garamond 400 · 44 px móvil / 68 px escritorio** |
| **LCP** | 2212 ms | **1244 ms** ✓ |
| Peso de fuentes | 55.3 KB | **78.5 KB** · +23.3 |
| Peso total | 231 KB | 254.4 KB · 0 de terceros |
| Accesibilidad | 16/16 | **16/16** |

131 tests · contraste 0 hallazgos · CA-10 cumplido con 28.68 KB de margen.

La escala de tokens **no tenía punto de ruptura** —eran 28 px a todos los anchos— y con
68 hizo falta: en un teléfono de 390 no cabe.

## Lo que sigue pendiente

Esto era **el primero de tres** cambios que salieron de la investigación. Quedan:

1. **Blanco puro de base**, y que el color lo pongan las fotografías.
2. **La piedra como sujeto**: una banda fotográfica grande con el titular encima, en
   vez de repartirla al 20 % por toda la página.

## Evidencia

| Qué | Dónde |
|---|---|
| La cara y su licencia | `static/fuentes/eb-garamond-latin-400-normal.woff2` · 23.3 KB |
| El `@font-face` | `src/lib/estilos/fuentes.css` |
| La escala nueva | `src/lib/estilos/tokens.css` · `--fuente-display`, `--titular-*` |
| El titular | `src/lib/componentes/Titular.svelte` |
| La comparación de las seis | `capturas/tipos.png` |

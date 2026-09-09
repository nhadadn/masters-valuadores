---
tipo: adr
id: ADR-0002
estado: PROPUESTA
fecha: 2026-09-08
---

# ADR-0002 · Una sola familia tipográfica, autoalojada

## Contexto

El presupuesto es LCP < 2.0 s en 4G simulada y JS inicial < 40 KB gzip, con
audiencia en teléfono de gama baja. La propuesta prohíbe Google Fonts: se autoaloja.

La tipografía del logo es una grotesca ancha de terminales cuadradas, pero solo
existe como raster con bisel: no se puede identificar la familia con certeza desde
el JPG.

## Opciones consideradas

| Opción | A favor | En contra |
|---|---|---|
| A · Dos familias (display + texto) | Más carácter | Dos archivos, dos peticiones, más bytes contra el LCP |
| B · Una familia con rango de pesos | Un solo woff2 subset, menos bytes | Menos contraste tipográfico |
| C · Stack del sistema | Cero bytes | Se ve distinto en cada teléfono; la marca pierde identidad |

## Decisión

`__POR_CONFIRMAR__` — propuesta: **opción B, con Archivo** (SIL OFL, autoalojable),
pesos 400 / 600 / 700, subset latino más diacríticas del español.

Se elige por parecido de esqueleto con las letras del logo —grotesca ancha, terminales
rectas— y porque aguanta 17 px en pantalla barata.

## Lo que falta para cerrarla

El archivo vectorial del logo. Con él se compara la familia contra las letras reales
y se confirma o se cambia. Hasta entonces la elección es provisional y está aislada
en un único token, `--fuente-base`.

## Consecuencias

- Un solo `@font-face` con `font-display: swap` y `preload` del peso 400.
- Los pesos 500 y 800 no existen en el sistema: si un diseño los pide, se rediseña.

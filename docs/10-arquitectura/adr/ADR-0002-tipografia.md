---
tipo: adr
id: ADR-0002
estado: ACEPTADA
fecha: 2026-09-08
aceptada: 2026-09-10
decide: Nadir
cierra: la familia tipográfica del sistema
---

# ADR-0002 · Una sola familia tipográfica, autoalojada

**Estado:** ACEPTADA el 10 de septiembre de 2026. Opción B, familia **Archivo**.

A diferencia del [[ADR-0005-acento-corporativo|ADR-0005]], esta decisión **no necesita
autorización del cliente**: no hay tipografía en su material que respetar. El logotipo
es lettering, no una familia identificable. Es una decisión técnica nuestra.

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

**Opción B, familia Archivo** (SIL OFL, autoalojable), pesos 400 / 600 / 700, subset
latino más diacríticas del español. Los archivos ya están en el repo:
`static/fuentes/archivo-latin-{400,600,700}-normal.woff2`.

## Por qué Archivo y no las otras dos

Se midieron tres candidatas en navegador, sobre los woff2 reales, no a ojo.
Script: `diseno/sistema/medir-tipografia.mjs`. Hoja: `diseno/sistema/Tipografia.dc.html`.

| | altura de x a 17 px | x / mayúscula | caracteres por renglón a 350 | alto de la misma sección | peso de 3 pesos |
|---|---|---|---|---|---|
| **Archivo** | 9.0 px | 0.763 | **45** | **512 px** | **42 KB** |
| Inter | **9.3 px** | 0.750 | 42 | 539 px | 70.8 KB |
| Barlow | 8.7 px | 0.731 | **46** | 512 px | 66.2 KB |

Las tres cubren las diacríticas del español completas.

- **Peso.** 42 KB contra 71 de Inter. Son 29 KB menos en la primera pintura, sobre 4G
  y en un teléfono barato. Es el argumento que más pesa contra el presupuesto de LCP.
- **Economía de renglón.** 45 caracteres contra 42. Medido: la misma sección ocupa
  512 px en Archivo y 539 en Inter — 27 px más de scroll por sección, multiplicado por
  todas las secciones de nueve páginas.
- **Voz.** Su 700 es apretado y de cartel, cercano al lettering plano del cliente.
  Inter es correcta y anónima.

**El argumento en contra, registrado:** Inter tiene la altura de x más grande, 9.3 px
contra 9.0. Si la condición de uso —sol, prisa, pantalla mala— mandara sobre todo lo
demás, Inter ganaría ese eje. La diferencia real es de **0.3 px** a tamaño de cuerpo,
por debajo de lo que el ojo distingue; el peso y la economía de renglón sí se notan.

Barlow queda fuera: es la más angosta, pero compra esa economía con la altura de x más
baja de las tres, que es justo lo que esta audiencia no puede pagar.

## Qué reabriría esta decisión

Solo una cosa: que el **archivo vectorial** del logo revele que el lettering sí es una
familia identificable y disponible. En ese caso se compara contra Archivo y se decide
de nuevo. Mientras tanto, la elección está cerrada y aislada en un único token,
`--fuente-base`.

## Consecuencias

- Un solo `@font-face` por peso, con `font-display: swap` y `preload` del peso 400.
- Los pesos 500 y 800 no existen en el sistema: si un diseño los pide, se rediseña.
- **CA-09 de [[SPEC-0001-armazon-fase-0|SPEC-0001]] deja de depender de terceros.**
  Los archivos están en el repo; el criterio pasa de bloqueado a implementable.
- La fuente de respaldo lleva `size-adjust` calibrado contra Archivo, para que el
  cambio al cargar no mueva el texto. Sin eso, el CLS se paga en el titular.

## Hallazgo que salió de la medición

«Renta de maquinaria y equipo» a h1 28/700 mide **392 px** en Archivo, contra los 350
disponibles en un teléfono de 390 con margen lateral de 20. No cabe en un renglón —y
tampoco cabe en Inter (404) ni en Barlow (365)—, así que no es un problema de familia.

La escala **no se encoge**. Se diseña asumiendo dos renglones: la tarjeta de giro de la
portada lleva alto fijo para dos, y el Breadcrumb abrevia nombres largos porque es
navegación, no promesa.

---
tipo: adr
id: ADR-0059
estado: ACEPTADA
fecha: 2026-09-17
decide: Nadir
enmienda: ADR-0051 · en las páginas de línea el lienzo partido va en franja y la ficha sin horarios. Portada y contacto no cambian
implementa: Claude Code
---

# ADR-0059 · El cierre de las líneas, en franja

## Qué se pidió

La revisión de armonía del 17 de septiembre —publicada como propuesta, con siete cambios medidos—
encontró que **cada página de línea pagaba el mismo cierre dos veces**. La pregunta C1 ofrecía dos
salidas: **A**, quitar la sección de ubicación y dejar que el pie cierre; **B**, dejarla como franja.

> *«C1 · ¿El cierre en A o en B? USAREMOS B.»* — Nadir

## Lo que se decide

- **En las cinco páginas de línea, la ubicación va en franja** (`Ubicacion franja`):
  - el lienzo deja la proporción 4:3 y toma un alto fijo: **190 px** en teléfono, **240** desde 768
    y **280** desde 1024. Antes medía 263 a 390 de ancho —la proporción—, y 360 y 400;
  - la ficha **no trae horarios**: el pie, justo debajo, los dice;
  - la dirección baja de título de pieza a **cuerpo en peso fuerte**, un escalón por encima de la
    referencia.
- **La pregunta pasa a «¿Dónde están?».** Era «¿Dónde están y están abiertos?», y ya no puede
  prometer un horario que el bloque no trae.
- **Se queda el mapa**, dentro del lienzo, que es lo que el pie no tiene. Fue la razón para elegir B
  sobre A.
- **La marca del lienzo NO se encoge.** La maqueta de la propuesta la escalaba al 72 %; aquí no,
  porque la bajada en oro necesita sus 19 px en peso 700 para contar como texto grande sobre el
  pavonado (4.0:1 contra un piso de 3:1).
- **Portada y contacto siguen con la versión completa.** En contacto la ubicación *es* la página; en
  la portada no se preguntó.

### De paso: la numeración deja de saltar

Era el cambio C4 de la propuesta, que no necesitaba decisión. Las secciones numeradas iban escritas
a mano —1, 2 y 3— y la 1 solo existe si la línea tiene bienes, así que **financiamiento y taller
empezaban en la «2»**. Ahora el número sale de contar las secciones que se pintan: esas dos páginas
van 1, 2.

## Lo que cuesta

- **La duplicación no desaparece, se achica.** Dirección, referencia y «Cómo llegar» siguen en la
  franja y en el pie. Es el precio de B, y se sabía: A la quitaba entera, pero sacaba el mapa de las
  páginas de línea. En taller, la franja y el pie siguen siendo el **49 %** de la página (eran el 53).
- **El horario vive solo en el pie** en las páginas de línea —y en la entrada de empeño, que trae
  «Lunes a viernes… · Sábado…» desde el ADR-0041—. Quien lo busque en la página de fletes tiene que
  llegar al pie, que está justo debajo de la franja.
- **Se pierde «¿…y están abiertos?»**, que era la única vez que la página ponía el horario en forma
  de pregunta del visitante.

## Lo medido

Sitio publicado —antes— contra el build local —después—, con el mismo guion, en la misma máquina.

| | Antes | Después |
|---|---|---|
| Sección de ubicación, 390 px | **704** | **505** |
| Sección de ubicación, 1280 px | **510** | **390** |
| Lienzo | 350 × 263 a 390 · 599 × 400 a 1280 | **350 × 190** · **599 × 280** |
| Empeño, página entera a 390 / 1280 | 3895 / 3422 | **3695 / 3302** |
| Venta | 3099 / 2809 | **2900 / 2689** |
| Financiamiento | 2488 / 2018 | **2288 / 1898** |
| Fletes | 2907 / 2710 | **2707 / 2590** |
| Taller | 2421 / 2044 | **2221 / 1924** |
| Veces que sale el horario en una línea | 2 · empeño 3 | **1** · empeño 2 |
| Numeración de financiamiento y taller | 2, 3 | **1, 2** |
| Portada, contacto y legales | — | sin cambio de altura |

La maqueta de la propuesta estimaba −203 px a 390; salieron **−199 y −200**.

| Verificación | Resultado |
|---|---|
| Tests | **197**, todos pasan. Los de este ADR fallan si se deshace el cambio: comprobado mutando `<Ubicacion franja />`, la numeración y el `{#if !franja}` de la ficha |
| Accesibilidad | **18/18 CUMPLE**, sin desborde en ninguna |
| Inventario tipográfico | ninguna combinación fuera de la escala |
| JavaScript | sin cambio · CA-10 con **35.55 KB** de margen |
| `npm run build` | sale con **1**, por los datos sin confirmar (CA-08), como debe |

## Evidencia

| Qué | Dónde |
|---|---|
| La franja, su razón y su CSS | `src/lib/componentes/Ubicacion.svelte:30` · `:49` · `:54` · `:164` |
| La ficha sin horarios y la dirección a cuerpo | `src/lib/componentes/DatosDelLocal.svelte:43` · `:71` · `:145` |
| La pregunta, la numeración y la franja en la plantilla | `src/routes/[giro]/+page.svelte:113` · `:120` · `:373` · `:378` |
| Tests de la página | `tests/cierre-de-linea.test.ts:36` · `:46` |
| Tests del componente | `tests/ubicacion.test.ts:83` |
| Cómo queda | `capturas/cierre-franja-390.png` · `capturas/cierre-franja-1280.png` · `capturas/armonia-antes-despues-390.png` |

---
tipo: adr
id: ADR-0060
estado: ACEPTADA
fecha: 2026-09-17
decide: Nadir
enmienda: ADR-0043 · `marfil` y `blanco` dejan de ser transparentes. `tenue` y `crema` siguen siendo el suelo
implementa: Claude Code
---

# ADR-0060 · Los claros vuelven a pintar

## Qué se pidió

La revisión de armonía del 17 de septiembre midió que **cuatro grados de fondo no pintaban nada**:
`tenue`, `marfil`, `crema` y `blanco` llevaban el color en `transparent` y la imagen en `none`, así
que eran el mismo suelo de acero. La plantilla de línea pedía tres claros distintos y el navegador
pintaba uno; el único corte que se veía era oscuro/claro. La pregunta C2 ofrecía devolverle color a
dos de ellos —por ejemplo, `blanco` al blanco y `marfil` a la placa de acero— o reducir la
plantilla a dos grados.

> *«C2 · ¿Los claros vuelven a pintar, o la plantilla baja a dos grados? Los claros vuelven a
> pintar.»* — Nadir

## Lo que se decide

- **`blanco` pinta el blanco** (`--blanco`, `#FFFFFF`).
- **`marfil` pinta la placa de acero** (`--acero-placa`, `#E6E3DF`), el mismo tono de las tarjetas y
  cajas desde el ADR-0046.
- **`tenue` y `crema` siguen siendo el suelo**: el acero cepillado que pone `body`.
- **El carrusel «Piezas y equipo» de empeño pasa de `tenue` a `blanco`.** Con el planeta encima,
  también en `tenue`, los dos escaparates eran un solo bloque de 1 311 px con 21 imágenes. Es el
  cambio C3 de la propuesta, resuelto con el grado que la foto de la línea ya usa en las otras
  páginas en vez de con una tercera sala oscura.

Ningún token es nuevo. Así queda cada página, de arriba abajo:

| Página | Superficies |
|---|---|
| Portada | pavonado · cinta · suelo · pavonado · suelo · **blanco** · pie |
| Empeño | pavonado · suelo · **blanco** · pavonado · **placa** · pie |
| Venta y fletes | pavonado · suelo · **blanco** · pavonado · **placa** · pie |
| Financiamiento y taller | pavonado · **blanco** · pavonado · **placa** · pie |
| Contacto | **placa** · suelo · pie |
| Legales | **placa** · pie |

En ninguna página dos secciones seguidas llevan la misma superficie. Es lo que `Seccion.svelte`
prometía desde el principio —«Alterna blanco y crema entre secciones consecutivas»— y dejó de
cumplir sin que nada avisara. Ahora lo vigila un test.

## Lo que cuesta

- **La placa es también el color de `--panel`.** Una caja de placa dentro de una sección `marfil`
  pierde su borde. Hoy la única es la ficha de la ubicación de las líneas, y se acepta: la separa la
  costura dorada, y en franja —ADR-0059— se lee como parte de la sección.
- **El suelo deja de estar en un solo sitio.** El ADR-0043 hizo transparentes los grados para que un
  cambio de suelo se viera en todas partes. Las secciones `marfil` y `blanco` ahora lo tapan a
  propósito: el día que cambie el suelo, esas no se enteran.
- **Vuelve el blanco como superficie de sección**, que no existía desde el ADR-0043. Se usa donde
  manda una fotografía —la foto de la línea y el carrusel— y en la llamada a contacto de la
  portada, que es lo que el ADR-0031 pedía del blanco: que el color lo pongan las fotos.

## Lo medido

**El auditor de fondos** (`herramientas/auditar-fondos.mjs`, a 1280 px, build local) lee
`rgb(255, 255, 255)` en las secciones `blanco`, `rgb(230, 227, 223)` en las `marfil` y
`rgba(0, 0, 0, 0)` —el suelo de `body`, `rgb(191, 187, 183)`— en las `tenue` y `crema`.

**El contraste mínimo no se movió.** `validar-a11y.mjs` sobre el sitio publicado —antes— y sobre el
build —después— da lo mismo en las 18 combinaciones: **4.00:1** en portada, contacto y las cinco
líneas, y **6.29:1** en las dos legales. Esos números ya no son los que dice el CLAUDE.md para las
líneas (4.83) y para contacto (6.29); la diferencia estaba antes de este cambio y se corrige allí.

| Verificación | Resultado |
|---|---|
| Tests | **197**, todos pasan. El de este ADR falla si el carrusel vuelve a `tenue` o si `marfil` vuelve a `transparent`: comprobado mutando cada uno |
| Accesibilidad | **18/18 CUMPLE**, sin desborde |
| Alturas | ninguna cambia por este ADR: pintar no mueve la maqueta |
| JavaScript | sin cambio · CA-10 con **35.55 KB** de margen |

## Evidencia

| Qué | Dónde |
|---|---|
| Los dos grados que pintan, y por qué | `src/lib/componentes/Seccion.svelte:94` · `:108` · `:109` |
| Los dos que siguen siendo el suelo | `src/lib/componentes/Seccion.svelte:92` |
| El carrusel en blanco | `src/routes/[giro]/+page.svelte:301` |
| Tests | `tests/grados-claros.test.ts:41` · `:46` · `:50` |
| Cómo queda | `capturas/armonia-antes-despues-390.png` · `capturas/escaparates-empeno-1280.png` |

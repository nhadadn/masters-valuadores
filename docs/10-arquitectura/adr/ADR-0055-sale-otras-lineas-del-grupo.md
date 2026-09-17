---
tipo: adr
id: ADR-0055
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: el pie del ADR-0053 en teléfono —las cinco líneas van en un renglón—
implementa: Claude Code
---

# ADR-0055 · Sale «Otras líneas del grupo»

## Qué se pidió

> *«Ahora, esta sección está descontrastada, es necesaria ? Como la mejorarías ?»* — Nadir, sobre
> «OTRAS LÍNEAS DEL GRUPO» en una página de línea

Se le mandó una hoja con la sección como estaba y dos opciones montadas sobre /fletes/ publicado:
**A**, quitarla; **B**, dejarla compacta, dos por dos, con el botón secundario de la casa. Se
recomendó A, con su costo escrito.

> *«Adelante con A»* — Nadir

## Lo que había, medido en el sitio publicado

| | |
|---|---|
| Qué era | Cuatro tarjetas con el nombre largo de las otras líneas, justo encima del pie, en las cinco páginas de línea |
| Alto | **328 px** en teléfono —entre el 8 y el 13 % de cada página— y 216 en escritorio |
| Por qué se veía lavada | La tarjeta, `#E6E3DF`, contra el acero, `#BFBBB7`: **1.49:1**. La separaba solo el filete de 1 px. Es el «bloque claro» que `Boton.svelte` dice que un secundario no es |
| El nombre largo | «Venta de maquinaria, herramienta y autos» en dos renglones: esa tarjeta medía 55 px y las demás 48 |
| En escritorio | Cuatro tarjetas en tres columnas: «Taller» sola en la segunda fila |
| Lo que repetía | Los cinco enlaces del pie de las nueve páginas (ADR-0053), **335 px más abajo** en teléfono. En escritorio, también los de la cabecera |

## Por qué existía, y por qué ya no hace falta

La razón está escrita en las hojas de diseño del armazón —`diseno/pantallas/fuente/main.py:83`—:
*sin enlaces cruzados cada página queda aislada y el multigiro no reparte autoridad*. Un comentario
de la plantilla la atribuía al ADR-0003, que no habla de enlaces.

Era cierta cuando nada más unía las páginas de línea. **Desde el ADR-0053 las une el pie**, en las
nueve páginas, y en escritorio también la cabecera.

## Lo que se decide

- **Sale la sección** de la plantilla de línea: el marcado, la lista `otras`, la importación que solo
  ella usaba y el CSS de `.cruzados`. En su lugar queda un comentario con qué había y por qué salió.
- **La página de línea termina como contacto**: la ubicación y el pie.
- **En teléfono, las cinco líneas del pie van en un renglón.** Con la sección fuera, el pie es la
  única lista de líneas en teléfono —la cabecera no tiene menú ahí—, y «Taller» caía sola al segundo
  renglón: con 24 px entre enlace y enlace pedían 377 px. Los cinco suman 281: con 8 px de piso caben
  desde 313 y lo que sobra se reparte entre ellos. Desde 768 px vuelven a ir juntos a la izquierda con
  24 px, porque en la columna del pie no caben en un renglón a ningún ancho.

## Lo que cuesta

- **La ficha de ubicación queda pegada al pie**, que repite dirección, horario y «Cómo llegar». Ya
  pasaba así en /contacto/.
- **Se pierden los enlaces con nombre largo en el cuerpo de la página.** Un buscador los pesa algo
  más que los de la cabecera o el pie. Hoy no se indexa nada hasta que cierre D-07 (ADR-0013).
- **A 320 px no caben los cinco**: «Taller» sigue cayendo sola, como antes.

## Lo medido

| | |
|---|---|
| Tests | **182** · 2 nuevos en `tests/otras-lineas.test.ts`, **2 de 2 mutantes cazados**: volver a poner la sección y quitar las líneas del pie. La plantilla se renderiza de verdad, con la ruta y el modo de desarrollo simulados |
| Build de revisión | CA-10 cumplido · **35.55 KB** de margen, sin cambio |
| Accesibilidad | **18/18 CUMPLE** |
| Inventario tipográfico | ninguna combinación fuera de la escala |
| Nueve páginas × 320, 360, 390, 412, 430, 768, 1024 y 1280 | sin la sección; el pie enlaza las cinco líneas en todas; todos los objetivos de 44 × 44 o más; ningún enlace encimado; **de 360 a 430, las cinco en un renglón** |
| Alto de las páginas de línea, contra el publicado | **−372 px** a 360, 390 y 412, con un píxel arriba o abajo —la sección y un renglón del pie—; −365 en venta, cuya sección no llevaba el nombre de dos renglones · −321 a 430, donde el pie ya cabía · de −328 a −335 a 320 · **−216** en escritorio, −209 en venta |
| La portada | −44 px de 360 a 412, por el renglón del pie; sin cambio a 320, a 430 ni en escritorio |

## Lo que queda abierto

- **El grado `piedra`** de `Seccion.svelte` y `tokens.css` se sigue describiendo como «otras
  líneas». La sección llevaba `blanco` desde el ADR-0043, y hoy **ninguna** sección usa `piedra`.
- **`herramientas/mapa-de-pantalla.mjs` ya no encontraba seis piezas** en empeño antes de este
  cambio —`.consulta`, `.acciones`, `.foto-giro`, `.mostrador`, `.saltos` y `.pasos`—: salieron o
  cambiaron con ADR anteriores. Aquí solo se quitó la 26.

## Evidencia

| Qué | Dónde |
|---|---|
| La sección, fuera | `src/routes/[giro]/+page.svelte:366` |
| Su CSS, fuera | `src/routes/[giro]/+page.svelte:565` |
| Las cinco en un renglón en teléfono | `src/routes/+layout.svelte:261` |
| Juntas a la izquierda desde 768 | `src/routes/+layout.svelte:342` |
| El test | `tests/otras-lineas.test.ts` |
| La pieza 26 del mapa | `herramientas/mapa-de-pantalla.mjs` · `docs/60-diseno/mapa-de-la-pantalla.md` |
| Cómo queda | `capturas/otras-lineas-fuera-390.png` · `capturas/otras-lineas-fuera-360.png` · `capturas/otras-lineas-fuera-1280.png` |
| Las opciones que se vieron | `capturas/otras-lineas-propuesta.jpg` |

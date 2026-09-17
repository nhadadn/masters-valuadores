---
tipo: adr
id: ADR-0053
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: ADR-0007 §2 (la banda de contacto ya no va en el pie) · respeta el ADR-0036 (el pie lleva el NAP)
implementa: Claude Code
---

# ADR-0053 · El pie en una ficha, y una sola escala tipográfica

## Qué se pidió

> *«Ahora bien, esta sigue viva, es a pie de página, deberíamos de quitarlo también.»* — Nadir,
> sobre la banda «LLÁMANOS · DÓNDE ESTAMOS»

Se le planteó que quitarla entera chocaba con el ADR-0036 y el ADR-0007 §2, y contestó:

> *«Esa sección solo es el comienzo; esta es la que más ruido causa.»* — sobre el pie

Se publicaron dos variantes y eligió la primera: *«Vamos con la 1. Realiza una revisión de
tipografías/fuentes que estamos utilizando; asegúrate de no tener una mezcolanza.»*

## Parte 1 · El pie

### Lo que hacía ruido, medido en el sitio publicado

- **902 px en teléfono**: la banda (244) más el pie (656), casi la cuarta parte de la portada.
  472 en escritorio.
- **Cinco líneas una bajo otra**, cada una en su renglón de 44 px y con el nombre largo.
- **«HORARIOS Y REDES» sin redes**: siguen por confirmar (D-10).
- **El horario desalineado**: el día iba a `10ch`, y la hora de «Lunes a viernes» empezaba 17 px
  más a la derecha.
- **Dirección y horario repetidos** con «DÓNDE ESTAMOS», justo arriba en siete páginas.

### Lo que el pie no podía perder

- **Nombre, dirección y teléfono escritos en cada página**, por el
  [[ADR-0036-fuera-el-panel-de-consulta|ADR-0036]]. En ocho de las nueve el número solo estaba
  escrito en la banda: quitarla sin más lo borraba.
- **El aviso de privacidad enlazado**: el mapa de Google pone cookies (ADR-0015).

### Lo que se decide

- **La banda se funde en el pie.** Un solo bloque: el nombre con el monograma, **el número en
  grande** y enlazado para llamar, la dirección con «Cómo llegar», el horario en columna, las
  cinco líneas con su nombre corto en fila y lo legal en un renglón al final.
- **`BandaContacto.svelte` sale** del código; queda en el historial.
- **La barra fija se queda**: es el otro uso de la banda que prevé el ADR-0007 §2, y la única
  llamada a la acción siempre en pantalla en teléfono.
- **La otra variante**, sin horario ni líneas, se descartó por un costo que no se veía: en
  teléfono la cabecera no tiene menú, así que en contacto y en las legales el pie es el único
  camino a las líneas.

### Lo medido

| | |
|---|---|
| Alto del pie | **540 px** en teléfono, antes 902 · **299** en escritorio, antes 472 |
| Las nueve páginas, a 390 y 1280 | número escrito y `tel:+528715073005`, dirección, «Cómo llegar» y aviso de privacidad en todas |
| Horario | una sola columna de horas |
| Objetivos táctiles | **todos de 44 × 44 o más**. El validador cazó «Venta», «Fletes» y «Taller» a 34–38 px de ancho al ponerlos en fila, y se corrigió con un ancho mínimo |
| Desborde y flechas de texto | 0 |

## Parte 2 · La tipografía

### Cómo se revisó

Con los estilos **computados** de todo texto visible de las nueve páginas, a 390 y a 1280, con
las preguntas frecuentes abiertas. No con el CSS: lo que importa es lo que el navegador pinta.

**Antes: 31 combinaciones** de familia, tamaño, peso y espaciado. Tamaños 9, 10, 12.5, 13, 14,
**15**, 17, 18, 19, 22, 24, 28, 30, 34, 40, 44, 64 y 68 · pesos 400, 600, 700, **800** y **900**.

### La mezcolanza, y cómo se corrigió

| Pieza | Antes | Ahora | Por qué |
|---|---|---|---|
| **Cinta de palabras** de la portada | Archivo 18 · 400 · −0.01em · mayúsculas | 18 · **700** · **0.12em** · mayúsculas | Tomaba `--titular-peso` y `--titular-tracking`, que el ADR-0029 cambió para la Garamond: la cinta, que es Archivo, quedó en mayúsculas delgadas y apretadas, la única así |
| **Rótulos del planeta** | 10 y 12.5 · **800** · −0.01em | 10 y 12.5 · **700** | El sitio no carga el 800: el navegador lo fingía |
| **Numerales de la tira de pasos** | 22 · **900** | 22 · 700 | Era el último texto en 900, un peso que se descargaba solo para tres numerales |
| **Títulos del mosaico** | 18, 22 y 34 · 700 · −0.01em | h3 18 · **600** · h2 22 · 700 · display 34 · 700 | Cada tamaño con su peso de la escala, y sin el espaciado del titular |
| **Frase del mosaico** | **15** | 14 | 15 no está en la escala |
| **«Ver el mapa»** | **15** · 600 | 17 · 600 | Al tamaño de los botones de la casa |
| **Pies de foto del carrusel** | **13** · 400 | 14 · 400 | 13 es el tamaño de las cejas en mayúsculas |
| **Numeral de las preguntas** de línea | **15** · 700 | 14 · 700 | |

**Después: 25 combinaciones.** Sin 15 px. **Archivo solo en 400, 600 y 700**, más la Garamond
400 del titular. El −0.01em queda solo en el titular Garamond.

### Lo que queda fuera de la escala, a propósito

- **La marca escrita** —los lockups de la cabecera (19 y 9), del pie (17) y del lienzo de
  ubicación (40 y 19, 64 y 30)—: es logotipo y sigue su proporción, no la escala del texto.
- **El titular y la promesa en Garamond**, como decidió el ADR-0029.
- **Los rótulos del planeta a 10 px en teléfono.** El disco no da para más sin rehacer su
  geometría. **Es chico para esta audiencia** y queda anotado.

### El guardia

**`herramientas/inventario-tipografico.mjs`** repite el inventario contra el sitio servido y
**sale con código 1** si aparece una combinación que no está en su lista de permitidas, cada una
con su razón escrita. La próxima mezcolanza ya no entra en silencio.

## Lo medido de todo el cambio

| | |
|---|---|
| Tests | **176** · dos menos: eran las pruebas por archivo de `BandaContacto.svelte`, que salió |
| Accesibilidad | **18/18 CUMPLE** |
| Inventario tipográfico | **25 combinaciones, ninguna fuera de la escala** |
| JavaScript | sin cambio · CA-10 con **35.55 KB** de margen |
| Mosaico y ubicación | sus verificadores del ADR-0049 y del ADR-0051 siguen en «todo cumple» con la tipografía nueva |

## Lo que queda abierto

- **Los rótulos del planeta a 10 px** en teléfono.
- **El archivo del peso 900** sigue declarado en `fuentes.css` y en `static/fuentes/`. Ya no lo
  usa ningún texto, así que no se descarga; quitarlo es limpieza aparte.
- **El desborde del anillo del planeta** en empeño, venta y fletes (ADR-0051).

## Evidencia

| Qué | Dónde |
|---|---|
| El pie en una ficha | `src/routes/+layout.svelte:74` · `:83` · `:88` · `:109` · `:122` · `:129` |
| Número, horario y líneas | `src/routes/+layout.svelte:226` · `:249` · `:258` |
| Objetivos de 44 × 44 | `src/routes/+layout.svelte:263` |
| Escritorio | `src/routes/+layout.svelte:336` |
| La cinta | `src/lib/componentes/CintaPalabras.svelte:84` |
| El planeta | `src/lib/componentes/PlanetaBienes.svelte:251` |
| La tira de pasos | `src/lib/componentes/TiraPasos.svelte:64` |
| El carrusel | `src/lib/componentes/Carrusel.svelte:196` · `:241` |
| El numeral de las preguntas | `src/routes/[giro]/+page.svelte:401` |
| «Ver el mapa» | `src/lib/componentes/Mapa.svelte:93` |
| El mosaico | `src/lib/componentes/MosaicoLineas.svelte:158` · `:159` · `:214` · `:232` |
| El guardia | `herramientas/inventario-tipografico.mjs:26` |
| Cómo queda | `capturas/pie-ficha-390.png` · `capturas/pie-ficha-1280.png` · `capturas/cinta-390.png` |

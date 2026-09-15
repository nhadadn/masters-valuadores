---
tipo: adr
id: ADR-0028
estado: ACEPTADA
fecha: 2026-09-14
decide: Nadir
revierte: ADR-0011 · ADR-0012
implementa: Claude Code
---

# ADR-0028 · El sitio se invierte: piedra clara, carbón de ancla

## Qué se pidió

Un brief de dieciséis cambios: pasar de campo oscuro a **mármol claro / piedra
premium**, con una regla explícita de cuánta piedra lleva cada sección, carbón solo en
el pie, y el oro reservado para indicar valor.

Con una condición repetida cuatro veces: **no tocar estructura, orden, textos ni
funcionalidades.** Esto es un cambio de lenguaje visual y nada más.

## La referencia llegó a mitad del trabajo

El brief hablaba de «el background proporcionado» y no ven��a. Se dijo, se empezó con la
descripción, y la imagen llegó después: un **Calacatta blanco con veta gris y veta
dorada ramificada**.

Eso cambió una decisión. El mármol del [[ADR-0020-crema-calida-y-marmol|ADR-0020]] era
*dibujado* —seis degradados, cero bytes— y **un degradado no imita esa piedra**: las
vetas de CSS son rectas y las de la referencia se bifurcan.

Entra la fotografía de la piedra, tratada: rebajada de contraste, subida de luz y
desaturada **antes** de comprimir. **10.7 KB en AVIF.** El aplanado es lo que la hace
comprimir así, y el aplanado es justo lo que pedía el brief — *«70-80 % más discreta»*.

`image-set` negocia el formato como haría un `<picture>`, que con `url()` a secas no se
puede. JPEG de respaldo.

## Cómo se invierte un sitio sin tocar un componente

Los roles vivían en `:root` en versión oscura, y el registro claro era una excepción
dentro de `Seccion.svelte`. **Se cambian de sitio, no de valor**: los claros pasan a
`:root` y los oscuros se conservan enteros en `.registro-oscuro`.

Ningún componente sabe en qué registro está. Por eso el pie, el panel de consulta y la
banda de contacto se dan la vuelta solos con ponerles una clase.

**Los valores no son nuevos**: son los que el ADR-0019 midió y el validador viene
aprobando desde entonces.

## Cuánta piedra lleva cada sección

Cinco grados, del que habla al que calla. Todos terminan en **la misma rampa**, así que
el color plano de referencia —y el contraste— es idéntico en los cinco. Lo único que
cambia es la veta.

| Grado | Dónde | Cómo |
|---|---|---|
| `marmol` | la entrada | textura + velo en diagonal: veta a la derecha, limpio bajo el titular |
| `medio` | bloque de consulta | textura + velo plano |
| `tenue` | bienes y patio | degradado dibujado. Donde manda la fotografía, la piedra se calla |
| `marfil` | proceso y ubicación | sin veta. Claridad y nada más |
| `piedra` | otras líneas | sólida y un punto más oscura: escalón hacia el pie |
| `carbon` | el pie | el ancla |

El cuerpo lleva `tenue`, así que **la textura fotográfica solo se descarga en las
páginas que la enseñan**.

## Cinco cosas que rompió la inversión, y las cazó la medición

Ninguna se vio pensando; todas salieron del validador o de mirar la captura.

1. **«VALUADORES» del lockup a 1.61:1.** Oro de marca sobre marfil. Es la **cuarta vez**
   que un color literal en un componente explota al cambiar de superficie, y la cuarta
   vez que el token era la respuesta.
2. **Las tarjetas de la portada a 1.34:1.** Texto blanco forzado con `sobreOscuro` sobre
   un campo que ya no es oscuro. Salieron cinco de esos.
3. **La M del planeta perdió media cara.** Su segundo trazo era blanco fijo; sobre
   piedra clara desaparece. Ahora usa `--tinta`, que cambia con el registro.
4. **La tira de pasos se volvió tres tarjetas blancas** — justo lo que el brief prohíbe.
   Ahora es secuencia: filete de plata y nada más.
5. **Las monedas se volvieron invisibles.** Seguían pintándose —145 píxeles medidos— en
   oro de marca a **1.87:1** sobre crema. El oro de marca NO se cambió por esto: la
   moneda recibió su propio par de tokens, más hondo, que además es como se ve el oro
   viejo contra mármol blanco. Ahora **2.42:1** y se leen.

## Lo medido

| | |
|---|---|
| **LCP** | **2212 ms** ✓ · el elemento es la propia textura, 10.7 KB |
| Peso | 231 KB · **+11.3 KB**, que es lo que pesa la piedra |
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | 0 hallazgos |
| Tests | 131 |
| CA-10 | cumplido · 28.68 KB de margen |

## Lo que NO se hizo, y hay que decirlo

**El CAMBIO 06 describe la galería de tarjetas fotográficas** —imagen a sangre, nombre,
descripción y flecha dorada— que es exactamente el [[ADR-0025-galeria-de-activos|ADR-0025]].
Esa galería **ya no existe**: Nadir la sustituyó por el planeta orbital en el
[[ADR-0026-planeta-de-bienes|ADR-0026]], dos turnos antes de este brief.

Se dejó el planeta. Deshacer una decisión explícita y reciente por un brief que
probablemente se escribió antes sería resolver el conflicto por cuenta propia, y este
repo no lo permite. **Está preguntado, no decidido.**

Del CAMBIO 09 pasa lo mismo en parte: pide composición editorial con una foto mayor, y
eso es el carrusel curvo del [[ADR-0023-carrusel-curvo|ADR-0023]], que ya agranda la
central. Se dejó.

## Evidencia

| Qué | Dónde |
|---|---|
| Los roles invertidos y el registro oscuro | `src/lib/estilos/tokens.css` |
| Los cinco grados de piedra | `src/lib/componentes/Seccion.svelte` |
| La textura tratada | `static/marca/marmol-900.{avif,webp,jpg}` |
| Cabecera marfil y pie carbón | `src/routes/+layout.svelte` |
| El oro de la moneda | `static/animacion/monedas.js` |

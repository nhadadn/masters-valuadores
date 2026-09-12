---
tipo: adr
id: ADR-0020
estado: ACEPTADA
fecha: 2026-09-11
decide: Nadir
extiende: ADR-0019-dos-registros-y-metal
implementa: Claude Code
---

# ADR-0020 · El registro claro se vuelve cálido, y empeño se viste de mármol

## Qué se decide

> *«Sí, crema cálido en el registro claro y mármol para empeño. ¿Puede ser un mármol
> con estilo? Que se vea celestial.»* — Nadir

Dos cosas, y una es mucho más barata que la otra.

## 1 · De acero frío a crema cálido

El [[ADR-0019-dos-registros-y-metal|ADR-0019]] devolvió el registro claro usando la
rampa de **acero** del ADR-0010. Es gris frío, y **su material no es frío**: es crema
y oro. Sus piezas claras —la 8 de importaciones, la 16— tienen fondo cálido, no
acerado.

`--crema-050` ya existía en `tokens.css`, descrito por su propio comentario como
*«cálida, no gris»*, y llevaba meses sin usarse. Se completa la rampa a su alrededor.

**El fondo lo fija la misma regla del ADR-0010, no el gusto:** `--oro-800` tiene que
conservar 3:1 por ser texto grande.

```
#EAE6DE → 3.74:1        #E3DED4 → 3.47:1   ← el elegido
#DCD5C8 → 3.19:1        #D5CCBC → 2.92:1   ← ya NO pasa
```

Se para en `#E3DED4`, con el mismo margen que el acero dejaba con su 3.36.

## 2 · El mármol se DIBUJA, no se descarga

«Celestial» se leyó como **luz cenital**, no como cielo: la piedra iluminada desde
arriba de sus piezas de MÁSTER JOYERÍA, con pan de oro al lado.

**Ninguna foto.** Una textura de mármol serían entre 100 y 300 KB en la página que
acababa de bajar a 95 KB de imagen, y encima sería una textura de banco. Son seis
capas de degradado: **cero bytes**, nítido a cualquier tamaño, afinable con un número.

Las capas, de arriba abajo:

| | Qué hace |
|---|---|
| 1 | La luz que cae desde arriba. Esto es lo «celestial» |
| 2 | Un rescoldo de oro descentrado, como el pan de oro de su pieza |
| 3–5 | Tres vetas finas, en ángulos y grosores **distintos** a propósito: el mármol real no tiene vetas paralelas |
| 6 | La rampa cálida de base |

Es mármol **estilizado** y no pretende ser fotográfico — que es lo que se pidió y lo
único que aguanta al lado de una tipografía de palo seco.

### No cambia una sola tinta

`.marmol` hereda todos los roles de `.crema` y solo cambia la imagen de fondo. La base
de la pila es la misma rampa y el color plano sigue siendo su peor extremo, así que
**el contraste no se mueve**: 16/16 CUMPLE, igual que antes.

## 3 · El registro sale del DATO, no del slug

`giros.ts` gana `registro?: 'industrial' | 'lujo'`. Empeño es `lujo`; el resto, por
omisión, industrial.

**Atarlo al slug habría sido garantizar que se rompa.** Los slugs son provisionales
hasta la Etapa 1 —está escrito en `giros.ts` y en el mapa de páginas— y una condición
sobre `slug === 'empeno-y-prestamo'` deja de funcionar en silencio el día que ese slug
cambie: la página no falla, solo pierde su mármol y nadie se entera.

## Por qué empeño y no todo el sitio

Se preguntó si el mármol iba a todas partes. **No**, y la razón es de su material:
ese registro lo usan **solo para joyería**. Sus piezas de maquinaria y fletes son
negras o gris industrial.

Vestir fletes y taller como una boutique de relojes contradice su propia marca, y a
la audiencia del contrato —alguien con prisa que necesita liquidez hoy— le promete
algo distinto de lo que va a encontrar. Empeño es la frontera: es la línea que su
marca sí trata como valor.

## Lo que queda pendiente

- **Joyería no es giro.** Si vuelve (D-18 y la tanda del 11 de septiembre), nace en
  `lujo` y el mármol ya está esperando.
- **Las serifas.** Su registro de lujo las usa y Archivo no tiene. Sigue siendo una
  segunda familia tipográfica y una decisión aparte.
- **El tinte de las fotos de archivo se calibró sobre fondo oscuro** y ahora convive
  con dos fondos claros. No se ha vuelto a medir.

## Evidencia

| Qué | Dónde |
|---|---|
| La rampa cálida y el mármol | `src/lib/estilos/tokens.css` |
| El registro claro y su variante | `src/lib/componentes/Seccion.svelte` |
| El registro como dato | `src/lib/datos/giros.ts` |
| Mármol solo en empeño | `build/` · 2 en empeño, 0 en maquinaria y fletes |
| Contraste | `validar-a11y.mjs` · CUMPLE 16/16 |

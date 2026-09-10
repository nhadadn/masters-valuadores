---
tipo: adr
id: ADR-0007
estado: ACEPTADA
fecha: 2026-09-10
decide: Nadir
implementa: Claude Code
depende_de: [ADR-0004-identidad-plana, ADR-0006-el-amarillo-vive]
---

# ADR-0007 · El lenguaje visual sale de sus piezas, no de mi gusto

## Contexto — la crítica que lo abrió

Nadir, 10 de septiembre: *«se ve muy plano en blanco y la forma de los botones parece
muy genérico todo. 100% hecho con AI»*.

Es una lectura correcta y hay una razón concreta:

> **Se construyó un sistema de restricciones, no un diseño.** Cada token codifica un
> piso —4.5:1 de contraste, 44 px de objetivo táctil, 40 KB de presupuesto, radio de 8—
> y ninguno codifica una voz. Un sistema que solo dice qué no puede fallar produce
> exactamente eso: nada está mal y nada es de nadie.

Los rasgos que delatan diseño generado y que el build tenía todos: radio uniforme,
bordes de un pelo, rejas perfectas, cero asimetría, cero forma propia, todo centrado.

Y el error de método, que es el mismo del ADR-0006 en otra dimensión: **se le sacó el
color a sus publicaciones y se le ignoró la forma.**

## La observación

Las cinco piezas vivas tienen un lenguaje visual reconocible y repetido. Observación
directa sobre `docs/99-assets/post-*.jpg`.

> **Nota de honestidad:** se intentó medir el ángulo de la diagonal y la altura de la
> banda inferior con detección automática. El ajuste dio r² entre 0.08 y 0.67 y la
> detección falló en dos de las cinco piezas. **Esos números no se usan.** Lo de abajo
> es observación, y los valores concretos se fijan comparando contra las piezas y luego
> se congelan como token.

| # | Lo que hacen | Lo que hacía el build |
|---|---|---|
| 1 | Una **diagonal** que corta la composición, en las cinco | Rectángulos alineados |
| 2 | **Banda oscura de contacto** al pie, con íconos circulares | Pie genérico |
| 3 | **Insignias circulares** negras con glifo dorado, etiqueta en versalitas y segunda línea en oro | Una regla dorada de 26×3 |
| 4 | Titulares **muy pesados, apretados, en caja alta y a dos tintas** | Archivo 700, caja mixta |
| 5 | Un **paralelogramo de arista inclinada** para el sello | Botón de radio 8 |
| 6 | Una **regla dorada** bajo el wordmark, repetida como divisor | Nada |

## Decisión

Se adopta ese lenguaje. Seis piezas, cada una con su regla.

### 1 · La diagonal

Una sección puede llevar arista inclinada en su borde superior o inferior, o una banda
de acento inclinada. **Máximo una diagonal visible a la vez en la pantalla** — en sus
piezas es un gesto único por composición, y repetirlo lo vuelve ruido.

- Se implementa con `clip-path: polygon(...)` sobre la sección, o con un pseudo-elemento.
- El ángulo se elige comparando contra las piezas y **se congela en un token**
  (`--diagonal`). No se improvisa por sección.
- **No puede generar desbordamiento horizontal.** El validador ya revienta si lo hay.
- La altura de la sección no cambia con el recorte: `clip-path` no reflowea, así que
  no hay CLS.

### 2 · La banda de contacto

Es un patrón, no un pie cualquiera. Fondo `--negro-950`, tinta blanca, teléfono
prominente, dirección al lado, cada uno con su insignia circular.

Sirve dos veces: el **pie** de cada página y la **barra fija** inferior en móvil.

### 3 · Insignias circulares

Reemplaza la regla dorada de las tarjetas. Círculo de 48 de diámetro en `--negro-950`,
glifo de 24 en `--oro-500`, etiqueta en versalitas y segunda línea en oro.

- El círculo es **decorativo**: `aria-hidden`. El significado lo carga la etiqueta.
- El oro sobre el negro del círculo da 11.12:1. Válido.
- La segunda línea en oro **sobre superficie clara** va en `--oro-800`, nunca en
  `--oro-500`.

### 4 · Titular a dos tintas

Caja alta, dos renglones, primero en `--negro-950` y segundo en oro. Es su gesto más
reconocible: «MAQUINARIA / LISTA PARA TRABAJAR».

- **Peso 900.** Medido: Archivo 900 pesa **13.2 KB**, menos que el 700 que ya se carga,
  y llega mucho más cerca de su lockup. Se añade como cuarto peso.
- Interlínea 1.05, tracking −0.01em, caja alta.
- **El segundo renglón va en `--oro-800` `#8A7227` (4.65:1) sobre claro**, o en
  `--oro-500` sobre oscuro (11.12:1). Aquí es donde el `oro-800` que sobrevivió de la
  dirección B se gana su lugar.
- Solo en la portada y en el encabezado de cada giro. No en subsecciones.

### 5 · La arista del botón

El botón primario lleva arista inclinada en su borde de salida, como el sello de sus
piezas. Es lo que deja de verse genérico con un solo cambio.

- `clip-path` sobre el botón, mismo ángulo del token `--diagonal`.
- **El objetivo táctil no se toca:** los 48 px de alto se mantienen en todo el ancho de
  la etiqueta, y el área sensible sigue siendo el rectángulo completo — el recorte es
  visual. Si el recorte comiera objetivo, no se hace.
- El botón secundario y el terciario **no** llevan arista: si todo la lleva, deja de
  significar «esta es la acción».

### 6 · La regla dorada

Divisor de 2 px en `--oro-500` bajo el lockup y entre bloques de sección. Cuesta nada y
es de las cosas que más los identifica.

## Restricciones que no se negocian

Ninguna de las seis piezas necesita romperlas, y todas son CSS:

1. **Cero JavaScript.** `csr = false` sigue. Nada de lo anterior lo necesita.
2. **El acento nunca suelto sobre claro.** `#E7C041` da 1.75:1. Va como relleno con
   etiqueta oscura, sobre negro, con borde `--oro-700`, o en su paso `--oro-800` si es
   texto.
3. **Objetivo táctil 48 de casa, 44 de piso.** Ningún recorte lo reduce.
4. **Sin CLS.** `clip-path` y `transform` no reflowean. Cualquier cambio de altura sí:
   se mide antes y después.
5. **Presupuesto.** Hoy el JS inicial es 0 KB contra un techo de 40. Hay margen de
   sobra; el único costo nuevo es el cuarto peso tipográfico, 13.2 KB.

## Lo que NO se toma de sus piezas

- **Titulares amarillos sobre fondo claro.** Ellos lo hacen — «LISTA PARA TRABAJAR»,
  «CUANDO MÁS LO NECESITAS»— y da 1.75:1, por debajo del mínimo **incluso para texto
  grande**. En un cartel a un metro se perdona; en un teléfono a plena luz, no.
- **La maquinaria de banco.** Sus piezas usan imágenes de archivo o generadas. En el
  sitio van fotos suyas o va hueco.
- **La errata.** Su pieza de renta dice «herramienta lijera». Va con G.

## Cómo se verifica

Los verificadores existentes cubren todo esto sin cambios:

```
node herramientas/validar-a11y.mjs     # contraste, táctil y desbordamiento
node herramientas/presupuesto.mjs      # el cuarto peso no debe romper nada
npm test                               # fugas de datos de negocio
```

Regla de cierre: **ninguna de las seis piezas se declara implementada sin su cita
`ruta/archivo:línea` y sin el validador en verde.**

## Lo que esto NO arregla

Hay que decirlo con la proporción correcta. Sus publicaciones se ven bien **en buena
medida por la fotografía**: una excavadora contra un cielo de tormenta, oro sobre tela
oscura. Ningún CSS sustituye eso.

**Estimación honesta: el lenguaje visual acerca aproximadamente la mitad del camino.
La otra mitad son fotos que no existen.** El hueco `FOTO — FACHADA DEL LOCAL` sigue
siendo el activo más caro del proyecto, y es además la única ventaja real frente a
First Cash y Monte de Piedad: ellos no pueden enseñar cara, local ni vitrina.

Prometer que con CSS va a quedar como sus posts sería mentir.

## Trabajo aparte que esto destapó

No entra en este ADR, pero queda anotado:

- **El monograma reconstruido no coincide con el real.** Se trazó de la insignia con
  textura; las cinco piezas son arte plano de alta resolución y son mejor fuente.
- **El lockup lleva una regla dorada entre MASTERS y VALUADORES** que la reconstrucción
  no tiene, y el tipo del wordmark es más pesado y ancho que Archivo 700.
- Las dos se cierran de verdad con el **archivo vectorial** (D-06).

---
tipo: spec
id: SPEC-0002
estado: APROBADA
aprobada: 2026-09-10 por Nadir · con siete enmiendas de revisión
c4: [C4-L3-componentes-web]
depende_de: [ADR-0007-lenguaje-visual, ADR-0006-el-amarillo-vive, ADR-0004-identidad-plana, ADR-0002-tipografia]
enmienda: ADR-0007 §3 y §4
actualizado: 2026-09-10
---

# SPEC-0002 · Lenguaje visual (ADR-0007)

## Enmiendas de la revisión del 10 de septiembre

Esta spec se aprobó **con correcciones**. Lo que sigue viene de la revisión de Nadir,
no del borrador, y donde contradice al borrador manda la enmienda.

| # | Qué cambió | Efecto |
|---|---|---|
| 1 | **Playwright aprobado**, opción A + B | Se añade como `devDependency` y se quitan las rutas `/opt/...`. No es meter dependencia: es corregir un defecto que hacía los tres scripts incorribles fuera de una máquina |
| 2 | **El ángulo es 30°, no 26°** | Se midió por detección de rectas. Mi 26° era lectura a ojo y quedó desplazado. Ver abajo |
| 3 | **Las insignias NO van en las tarjetas de giro** | **Enmienda el ADR-0007 §3.** CA-03 se reescribe: banda de contacto y diferenciadores. La tarjeta conserva su `.filo` |
| 4 | **El oro: la restricción se escribe en `tokens.css`** | Y se corrige el texto del ADR-0007 §4, que dice «sobre claro» sin distinguir blanco de crema |
| 5 | **Arista de sección: fuera**, con la razón geométrica anotada | Ver abajo |
| 6 | **Precarga del peso 900: no se decide hoy** | `app.html` se queda como está. Se vuelve a ella con el número del LCP |
| 7 | **Regla dorada bajo el lockup** | Como se propuso. La de entre `MASTERS` y `VALUADORES` espera a D-06 |

## Objetivo

Cablear las seis piezas del [[ADR-0007-lenguaje-visual|ADR-0007]] sobre el armazón de
la [[SPEC-0001-armazon-fase-0|SPEC-0001]], para que el sitio deje de codificar solo
pisos y codifique también la voz que el cliente ya publica.

Cero contenido nuevo: ni una cifra, ni un dato de negocio, ni una foto. Esto es forma.

## Fuera de alcance

- **Copy.** Los 27 huecos siguen siendo huecos. Esta spec no redacta ni un titular.
- **Fotos.** El hueco `FOTO — FACHADA DEL LOCAL` sigue abierto. El propio ADR-0007
  estima que las fotos son **la otra mitad** de lo que falta y que ningún CSS las
  sustituye.
- **El monograma y el lockup.** El ADR-0007 anota que la reconstrucción no coincide con
  el arte real y que el lockup lleva una regla dorada **entre** `MASTERS` y
  `VALUADORES`. El propio ADR lo manda a «trabajo aparte»: se cierra con el vectorial
  (D-06), no aquí. La pieza 6 de esta spec pone regla dorada **bajo** el lockup, que es
  lo que el ADR sí decide.
- **Rediseñar la retícula, el orden de secciones o la escala tipográfica.**
- **Tocar `csr`.** Sigue en `false` para todas las rutas.
- **La arista inclinada de sección.** Enmienda 5: fuera, por geometría. Ver abajo.
- **La tarjeta de giro.** Enmienda 3: no se toca. Conserva su `.filo` y su `Icono` de 26.
- **La precarga de fuentes.** Enmienda 6: `app.html` no se toca en esta spec.

## El ángulo de la diagonal — cómo se fijó

El ADR-0007 registra que un primer intento de detección automática dio r² entre 0.08 y
0.67 y falló en dos de cinco piezas. **Esos números siguen sin usarse.**

La revisión del 10 de septiembre volvió a medir, esta vez con detección de rectas
filtrada al cuadrante de la banda dorada, y el ajuste sí cerró:

| | |
|---|---|
| Segmentos | **11** |
| Recta acumulada | **3 822 px** |
| Ángulo desde la vertical | **30.7° ± 0.8°** · SD 0.79° |
| Por pieza | joyería **30.9°** · maquinaria **30.0°** · monedas **31.1°** |

> **Valor congelado: `--diagonal: 30deg` desde la vertical.**

**Mi propuesta anterior, 26°, queda descartada.** Era lectura a ojo sobre la imagen
renderizada y estaba desplazada ~5°, fuera de la desviación de la medición. La lección
es la del ADR-0006 otra vez: se midió, no se opinó.

Se revisa con el **archivo vectorial** (D-06), que es la única fuente que permitiría
cerrar el decimal.

### Cómo se opera el ángulo sin depender de `tan()` de CSS

`tan()` en CSS existe desde Chrome 111 / Safari 15.4 / Firefox 108, pero un valor
inválido dentro de una propiedad personalizada **no cae al declarado anterior**: se
vuelve inválido en tiempo de cómputo. En un teléfono viejo eso no degrada, rompe.

Se congelan **dos** tokens que se mueven juntos:

```
--diagonal: 30deg;        /* la decisión, para leerla y para documentarla */
--diagonal-tan: 0.57735;  /* tan(30°) · la constante con la que se calcula */
```

Todo corte se calcula con una multiplicación —`calc(alto * var(--diagonal-tan))`—, que
no tiene problema de soporte en ningún navegador vivo. Si alguien cambia el ángulo y no
la constante, el comentario del token lo dice.

### El mapeo a `linear-gradient` no es directo, y se verificó

El ángulo de `linear-gradient` se mide desde «to top» en sentido horario y describe la
**línea del degradado**, que es **perpendicular** al borde de color. Escribir
`linear-gradient(30deg)` daría un borde a 60° de la vertical: el doble del error.

La conversión correcta es `calc(90deg + var(--diagonal))` → **120deg**. Comprobado por
geometría antes de escribirlo:

```
linear-gradient(120deg) → línea del degradado = ( 0.8660,  0.5000)
                          borde perpendicular = (−0.5000,  0.8660)  →  30.0° de la vertical
```

El borde resultante baja hacia la izquierda, es decir **se inclina con la parte alta
hacia la derecha**, que es como cae en las cinco piezas. Se verifica además a ojo contra
`post-joyeria.jpg` con el sitio construido.

### Por qué banda inclinada y no arista de sección — enmienda 5

La arista de sección **queda fuera**, y la razón es geométrica, no de gusto:

> A 30° desde la vertical, una arista que cruce los 1280 px de ancho de la pantalla
> mediría **2 217 px de alto** —`1280 ÷ tan(30°)`—. Más que la altura de casi cualquier
> sección del sitio.

Las aristas de sección que se ven en la web son un gesto de **2° a 6°** desde la
horizontal. **El cliente no usa ese gesto en ninguna de sus cinco piezas.** Meterlo
sería añadir vocabulario ajeno para llenar un hueco del ADR.

Queda entonces la banda inclinada, que además es la única de las dos que puede honrar
«el ángulo se congela en un token»: una arista a lo ancho tiene un ángulo que depende
del ancho de la pantalla, y a 390 px y a 1280 px no puede ser el mismo.

## Criterios de aceptación

Estados: NO INICIADO / BLOQUEADO / PARCIAL / IMPLEMENTADO.
IMPLEMENTADO exige cita `ruta/archivo:línea` de un test (A) o de código de producción (B).

### Por pieza — numeradas como en el ADR-0007

| # | Criterio verificable | Estado | Evidencia |
|---|---|---|---|
| CA-01 | **Diagonal.** Existe una banda de acento inclinada al ángulo de `--diagonal`, resuelta con `linear-gradient`, en **una sola** zona de la portada. Ninguna otra pantalla la repite: el conteo de usos de la clase en `src/` es exactamente 1. El validador no reporta desbordamiento horizontal a 390 ni a 1280 | NO INICIADO | — |
| CA-02 | **Banda de contacto.** El pie y la barra fija inferior comparten el mismo patrón: fondo `--negro-950`, tinta blanca, teléfono con insignia circular y dirección con insignia circular. Los dos datos siguen saliendo de `PorConfirmar` mientras D-08 esté abierta. El pie deja de ser `--negro-900` | NO INICIADO | — |
| CA-03 | **Insignias circulares · alcance enmendado.** Círculo de 48 en `--negro-950` con glifo de 24 en `--oro-500`, `aria-hidden`, etiqueta en versalitas y segunda línea en oro. Va en **dos** lugares y solo dos: la **banda de contacto** y el bloque de **diferenciadores** de portada. **NO va en la tarjeta de giro**, que conserva su `.filo`. `grep` confirma cero usos en `Tarjeta.svelte`. El validador sigue en 22/22 CUMPLE | NO INICIADO | — |
| CA-04 | **Titular a dos tintas.** `h1` en peso 900, caja alta, interlínea 1.05, tracking −0.01em, primer renglón `--negro-950` y segundo `--oro-800`. Solo en portada y encabezado de giro; `grep` confirma que ninguna subsección lo usa | NO INICIADO | — |
| CA-05 | **Arista del botón.** El botón **primario** —y solo él— lleva arista inclinada en su borde de salida. El recorte vive en un pseudo-elemento con `pointer-events: none`; el elemento interactivo sigue siendo un rectángulo completo. `document.elementFromPoint()` en la esquina recortada devuelve el botón | NO INICIADO | — |
| CA-06 | **Regla dorada.** Divisor de 2 px en `--oro-500` bajo el lockup del encabezado y entre bloques de sección, como una sola regla reutilizable, no como tres reglas parecidas | NO INICIADO | — |

### Base y transversales

| # | Criterio verificable | Estado | Evidencia |
|---|---|---|---|
| CA-07 | **Peso 900 cableado.** `@font-face` de 900 en `fuentes.css`, y su respaldo `Archivo Respaldo` **con `size-adjust` medido**, no copiado del 700. Sin eso el titular se reacomoda al cargar la fuente y eso es CLS en el LCP — ADR-0002 lo exige explícitamente | NO INICIADO | — |
| CA-08 | **Cero JavaScript.** `csr = false` intacto y `herramientas/presupuesto.mjs` en **0 KB** en las 11 páginas, igual que hoy | NO INICIADO | — |
| CA-09 | **Contraste.** `node herramientas/validar-a11y.mjs` en **22/22 CUMPLE** y `python verificar-contraste.py` en 0 hallazgos. Ningún oro suelto sobre claro | NO INICIADO | — |
| CA-10 | **Táctil.** Mínimo ≥ 44 px en las 22 combinaciones. Ningún recorte reduce área sensible | NO INICIADO | — |
| CA-11 | **Sin CLS.** Se reporta el alto de la tarjeta de giro y del `h1` **antes y después**, a 390 y a 1280. Si cambia, se dice el número; no se declara «sin CLS» sin medirlo | NO INICIADO | — |
| CA-12 | **Ningún literal.** Ningún componente escribe un color, un tamaño o un espacio a mano. Todo token nuevo lleva comentario de procedencia y ratio calculado, como los 98 renglones que ya están | NO INICIADO | — |

## Hallazgos que esta spec destapó antes de implementar

Tres cosas que el ADR-0007 no podía saber y que cambian cómo se implementa.

### 1 · `--oro-800` NO pasa AA sobre la superficie crema

El ADR dice «`--oro-800` `#8A7227` (4.65:1) sobre claro». Ese 4.65 es **sobre blanco**.
Calculado ahora sobre las dos superficies claras del sistema:

| Sobre | Ratio | Veredicto |
|---|---|---|
| `--blanco` `#FFFFFF` | **4.65:1** | pasa AA |
| `--crema-050` `#F0EFED` | **4.05:1** | **NO pasa AA** |

Consecuencia: el segundo renglón del titular y la segunda línea de las insignias
**solo pueden ir sobre `--superficie` o sobre oscuro, nunca sobre `--superficie-alterna`**.
Hoy eso se cumple por casualidad —el `h1` de giro y la entrada de portada están en
secciones blancas—, pero por casualidad no es una regla.

**Verificado en la revisión.** Enmienda 4: la restricción se escribe como comentario en
`tokens.css` junto a `--oro-800`, donde la va a leer quien lo use, y **se corrige el
texto del ADR-0007 §4**, que dice «sobre claro» sin distinguir blanco de crema.

**No se inventa un oro más oscuro.** Sería meter un color que la marca no publica para
salvar un caso que se evita colocando bien la pieza.

### 2 · `clip-path` **sí** recorta el área sensible

El ADR pide que el recorte del botón sea «visual» y que «el área sensible siga siendo el
rectángulo completo». Un `clip-path` aplicado al `<button>` recorta también el
*hit-testing*: el triángulo desaparece del objetivo táctil. Cumplir el ADR obliga a
recortar un **pseudo-elemento de fondo** con `pointer-events: none` y dejar el elemento
interactivo como rectángulo.

Además: `herramientas/validar-a11y.mjs` mide con `getBoundingClientRect()`, que devuelve
el rectángulo completo **ignorando el recorte**. Es decir, el validador actual **no
puede detectar esta regresión**. Por eso CA-05 se verifica con `elementFromPoint()` y no
con el validador.

### 3 · El validador de accesibilidad no corre en esta máquina

`herramientas/validar-a11y.mjs:10`, `herramientas/medir-textos.mjs:1` y
`diseno/sistema/medir-tipografia.mjs:1` importan Playwright desde
`/opt/node-tools/node_modules/playwright/index.js` y el navegador desde
`/opt/pw-browsers/chromium`. Son rutas de Linux; **ninguna de las dos existe aquí** y no
hay Playwright en `node_modules`. Verificado.

Esto bloqueaba CA-09, CA-10 y CA-11, y además la **calibración del `size-adjust` del
peso 900** de CA-07, que se mide en navegador.

**Resuelto en la revisión · enmienda 1: aprobada la opción A + B.** Playwright entra
como `devDependency` —herramienta, **0 bytes al visitante**— y los tres scripts dejan de
importar por ruta absoluta. Nadir lo calificó, correctamente, como **corregir un defecto,
no meter una dependencia**: tal como estaban, los tres scripts solo corrían en una
máquina concreta y en ninguna otra.

## Datos que faltan

| Marcador | Qué destraba | Quién decide |
|---|---|---|
| D-06 · archivo vectorial | Medir el ángulo de verdad en vez de leerlo a ojo; la regla dorada del lockup | Cristóbal |
| D-08 · NAP | El teléfono y la dirección **reales** de la banda de contacto. Mientras tanto la banda se construye con `PorConfirmar` | Cristóbal |
| Fotos | La mitad de lo que falta, según el propio ADR-0007 | Cristóbal |

## Preguntas que estaban abiertas — cerradas en la revisión

1. **La regla dorada del lockup** → **bajo** el lockup, como se propuso. La de entre
   `MASTERS` y `VALUADORES` espera al vectorial (D-06).
2. **La segunda línea en oro de la tarjeta de giro** → la pregunta se disuelve: la
   insignia no entra en la tarjeta. `Tarjeta.svelte` no se toca en esta spec.
3. **Arista de sección** → **fuera**, con la razón geométrica escrita arriba.
4. **Precarga del peso 900** → **no se decide hoy.** `app.html` se queda como está y se
   vuelve a ella con el número del LCP cuando el validador corra. Queda anotado como
   pendiente, no como decisión tomada.

## Riesgos

- **El respaldo del 900 sin calibrar** mueve el titular al cargar la fuente: CLS en el
  LCP, en la pieza más grande de la página, justo en la audiencia que menos lo aguanta.
- **Más de una diagonal a la vez** convierte el gesto en ruido. El ADR lo prohíbe y
  CA-01 lo cuenta.
- **El ángulo del degradado invertido o al doble.** El mapeo de 30° a `120deg` no es
  evidente y equivocarlo no rompe nada: solo deja el gesto torcido y nadie lo nota hasta
  que el cliente lo ve. Por eso se verificó por geometría y se verifica a ojo.
- **La banda inclinada con `linear-gradient`** puede desbordar horizontal si se resuelve
  con un pseudo-elemento rotado en vez de un degradado. Por eso CA-01 fija la técnica.
- **Declarar «sin CLS» sin medir.** `clip-path` y `transform` no reflowean, pero cambiar
  el peso del `h1` a 900 y meter círculos de 48 px **sí** cambia altos. CA-11 obliga al
  número.

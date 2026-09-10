---
tipo: spec
id: SPEC-0002
estado: IMPLEMENTADA — CA-02 y CA-04 PARCIALES
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

## Revisión visual del 10 de septiembre — «se ve bien, pero sin nada de la marca»

Lectura de Nadir sobre el sitio ya construido, y **es correcta**. Medido a 390×844,
contando píxeles de acento con el mismo umbral en las piezas del cliente y en el build:

| Dónde | Oro |
|---|---|
| Sus cinco publicaciones | 5.3 % – 12.4 % · mediana **10.4 %** |
| Portada, primera pantalla | **0.63 %** |
| Página de giro | **0.88 %** |

De las seis piezas, en el primer pliegue solo se veía **la más delgada**, la regla.
El sistema estaba implementado y colocado donde nadie lo mira.

Dos causas distintas, que no conviene mezclar:

- **Límite real.** Un cartel puede ir a 10 % de oro; una pantalla no, porque `#E7C041`
  da 1.75:1 sobre claro. La meta nunca fue 10 %.
- **Fallo de colocación, mío.** El ADR-0007 §2 dice que la banda de contacto «sirve dos
  veces: el pie y la barra fija inferior en móvil». La puse solo en el pie. Y la
  diagonal quedó al final de la portada en vez de en el borde de la foto, que es donde
  cae en sus cinco piezas.

### Tres movimientos, ninguno inventa contenido

| | Qué | Resultado |
|---|---|---|
| 1 | La barra fija adopta el patrón de banda | **Latente** hasta D-08. Ver abajo |
| 2 | La diagonal se muda al borde de la ranura de foto | **Revertido.** Ver abajo |
| 3 | El botón de WhatsApp **inerte** conserva la arista | **Hecho.** La arista se ve en las 11 páginas |

Resultado real, mismo método de medición:

| Ruta | Oro antes | Oro después | Negro | Piezas en el primer pliegue |
|---|---|---|---|---|
| Portada | 0.63 % | 0.63 % | 9.1 % | 1 → **2** de 6 |
| Giro | 0.88 % | 0.88 % | 10.4 % | 2 → **3** de 6 |

**De los tres movimientos solo uno quedó en pie.** El oro no se movió: la arista es
negra, no dorada. Lo que subió al primer pliegue es forma, no color.

### El movimiento 2 se revirtió, y la razón está medida

Puesta como remate sobre la ranura de foto, la diagonal se convertía en una barra negra
con una mancha amarilla encima de una caja gris, sin cortar ni enmarcar nada. Es la
misma geometría de la enmienda 5: **una recta a 30° de la vertical necesita ALTO.**

| Alto de la caja | Recorrido horizontal |
|---|---|
| 48 px · la banda de remate | **27.7 px** |
| 197 px · ranura de foto a 390 | 113.7 px |
| 371 px · ranura de foto a 1280 | 214.2 px |

27.7 px de recorrido sobre 660 px de columna en escritorio no se leen como corte porque
no lo son.

**La diagonal es el borde de una fotografía.** Nace de que hay una masa oscura que
cortar, y hoy la única del sitio es la sección de contacto. Vuelve a la entrada el día
que exista la foto de la fachada, que es cuando habrá algo que cortar.

### El movimiento 1 quedó latente, y hay que decirlo

Se probó la insignia con anillo apagado mientras D-08 sigue abierta y **salió peor en
las dos cuentas**: un anillo gris no aporta marca —que era el objetivo— y le robaba
60 px al botón, que a 360 px pasaba a envolver en dos renglones dentro de una caja de
48. Un adorno que rompe la maqueta no es media pieza.

El patrón queda cableado y la insignia aparece **en oro** el día que entre el número.
Es la misma clase de pendiente que CA-04: código listo, dato ausente.

### El movimiento 3 revierte una decisión de la pieza 5

La pieza 5 dejó el botón inerte sin arista, con el argumento de que un control apagado
con forma de acción principal es una promesa falsa. **El argumento estaba mal
planteado**: quien promete es el relleno —`--negro-300`, apagado— y el marcador
`__POR_CONFIRMAR__` encima, no la silueta. Y el costo era alto: mientras D-08 siga
abierta, el botón inerte es el elemento más grande del primer pliegue en las once
páginas.

### El validador tenía una ceguera, y se arregló

Al mover el relleno del botón a un pseudo-elemento —que el ADR §5 **obliga**, para no
comerse el objetivo táctil— `validar-a11y.mjs` empezó a reportar **1:1** en el botón de
WhatsApp. No era un fallo de render: muestreando los píxeles del build, el botón da
`rgb(12,13,15)` sobre `rgb(174,180,185)`, o sea **9.29:1**.

`fondoDe()` solo leía `backgroundColor` y subía al ancestro, así que **no podía ver un
fondo que vive en un `::before`**. Es una ceguera anterior a esta spec: le pasaba a
cualquier elemento con fondo en pseudo-elemento. Se arregló en la herramienta
—`herramientas/validar-a11y.mjs`— y no en el componente, porque el componente estaba
bien y el que medía mal era el instrumento.

Se deja dicho con todas sus letras porque tocar el verificador para que pase el código
es exactamente el movimiento que hay que mirar con lupa: la justificación es el muestreo
de píxeles, no la conveniencia.

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
| CA-01 | **Diagonal.** Banda de acento inclinada al ángulo de `--diagonal`, con `linear-gradient`, en **una sola** zona. Cero desbordamiento horizontal | **IMPLEMENTADO** | `src/lib/componentes/BandaDiagonal.svelte:56` · único uso en `src/routes/+page.svelte:105`, entrando a la sección oscura, confirmado por `grep` · `herramientas/medir-piezas.mjs`: desborde **0** en 12 combinaciones, 360 incluido |
| CA-02 | **Banda de contacto.** El ADR §2 pide **dos** colocaciones: el pie y la barra fija. El pie está; la barra queda **cableada y latente** hasta que entre el teléfono (D-08) | **PARCIAL** | `src/lib/componentes/BandaContacto.svelte:52` · montada en `src/routes/+layout.svelte:68` · el teléfono sale de `negocio.ts`, nunca del componente |
| CA-03 | **Insignias circulares · alcance enmendado.** Círculo de 48 en `--negro-950` con glifo de 24 en `--oro-500`, `aria-hidden`. **NO en la tarjeta de giro** | **IMPLEMENTADO** | `src/lib/componentes/Insignia.svelte:64` · anillo sobre oscuro en `:73` · usada en `src/routes/+page.svelte:70` y en la banda · medido en el sitio: 48×48, radio 999px, fondo `rgb(12,13,15)`, glifo `rgb(231,192,65)` · alto de tarjeta **sin cambio**: 199.6 y 159.3 |
| CA-04 | **Titular a dos tintas.** Peso 900, caja alta, interlínea 1.05, tracking −0.01em. Primer renglón en tinta, **segundo en oro** | **PARCIAL** | Tipografía: `src/lib/componentes/Titular.svelte:39` · cableado en `src/routes/[giro]/+page.svelte:54` · medido: peso 900, 28px, interlínea 29.4, tracking −0.28px, Archivo 900 cargada. **La segunda tinta no está en ninguna pantalla**: no hay copy de dos renglones y partir un nombre de giro sería inventar énfasis. Ver abajo |
| CA-05 | **Arista del botón.** Solo el primario, **incluido su estado inerte**. El recorte en un pseudo-elemento con `pointer-events: none`; el elemento interactivo sigue siendo rectángulo completo | **IMPLEMENTADO** | `src/lib/componentes/Boton.svelte:100` y `BotonWhatsApp.svelte:93` · `herramientas/medir-piezas.mjs` en 12 combinaciones: `::before` → `polygon(… calc(100% − 27.7128px) …)`, elemento → `none`, esquina → **el botón**. **Sonda sintética**, ver abajo |
| CA-06 | **Regla dorada.** 2 px en `--oro-500`, una sola definición reutilizable | **IMPLEMENTADO** | `src/lib/componentes/ReglaDorada.svelte:34` · bajo el lockup `src/routes/+layout.svelte:41` · sobre el pie `:69` · divisor de sección `src/lib/componentes/Seccion.svelte:27` |

### Base y transversales

| # | Criterio verificable | Estado | Evidencia |
|---|---|---|---|
| CA-07 | **Peso 900 cableado** con `size-adjust` **medido**, no copiado del 700 | **IMPLEMENTADO** | `src/lib/estilos/fuentes.css:57` · respaldo en `:109` con `size-adjust: 95.3%` · derivación en `herramientas/medir-respaldo.mjs`, con su límite escrito |
| CA-08 | **Cero JavaScript.** `csr = false` intacto y presupuesto en **0 KB** | **IMPLEMENTADO** | `src/routes/+layout.ts:28` sin tocar · `herramientas/presupuesto.mjs`: **0 KB en las 11 páginas**, margen de 40.00 KB |
| CA-09 | **Contraste.** Validador en 22/22. Ningún oro suelto sobre claro | **IMPLEMENTADO** | `herramientas/validar-a11y.mjs`: **22/22 CUMPLE**, mínimo 4.94:1, igual que la línea base · restricción hecha estructura en `src/lib/estilos/tokens.css:50` y `src/lib/componentes/Seccion.svelte:40` |
| CA-10 | **Táctil.** Mínimo ≥ 44 px. Ningún recorte reduce área sensible | **IMPLEMENTADO** | `validar-a11y.mjs`: **44 px** mínimo en las 22 · `medir-piezas.mjs`: la esquina recortada responde **el botón**, y el `clip-path` del elemento es `none` |
| CA-11 | **Sin CLS declarado sin medir.** Altos antes y después | **IMPLEMENTADO** | `herramientas/medir-piezas.mjs` · tabla completa abajo. Tres cosas cambian de alto y las tres se reportan con número |
| CA-12 | **Ningún literal.** Todo token nuevo con procedencia y ratio | **IMPLEMENTADO** | `src/lib/estilos/tokens.css:111-146` · los seis componentes nuevos leen solo `var(--…)` |

### CA-11 · los altos, antes y después

| Ancho | Qué | Antes | Después | Por qué |
|---|---|---|---|---|
| 360 | `h1` Empeño y préstamo | 32 px | **59 px** | caja alta a 900: pasa de 1 renglón a 2 |
| 360 | `h1` Renta de maquinaria y equipo | 64 px | **88 px** | pasa de 2 renglones a 3 |
| 390 | `h1` Empeño y préstamo | 32.2 px | **29.4 px** | mismo renglón, interlínea 1.05 en vez de 1.15 |
| 390 | `h1` Renta de maquinaria y equipo | 64.4 px | **58.8 px** | igual, dos renglones |
| 360 / 390 / 1280 | pie | 975.7 / 890.8 / 420.1 | **1073 / 1016.4 / 518.1** | la banda de contacto, bajo el pliegue |
| todos | encabezado | 56 / 76 | **56 / 76** | el `min-height` absorbe la regla dorada |
| todos | tarjeta de giro | 199.6 / 159.3 | **199.6 / 159.3** | sin cambio — la comprobación de que la enmienda 3 se respetó |
| todos | barra fija | 66 / 0 | **66 / 0** | sin cambio |

Nada de esto es CLS de tiempo de ejecución: son alturas de maquetación fijadas en el
prerender. El CLS real que había que evitar —el titular reacomodándose cuando Archivo
900 termina de cargar— lo cubre el `size-adjust` de CA-07.

**360 px no lo mide `validar-a11y.mjs`, que va a 390 y 1280.** Se añadió a
`medir-piezas.mjs` porque el titular cruza de dos a tres renglones justo debajo de 390,
y la audiencia de este sitio usa Android de gama baja, donde 360 es el ancho común. A
390 no se ve el peor caso de quien va a entrar.

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

## Lo que quedó a medias, dicho con su nombre

### CA-04 · la segunda tinta no existe en ninguna pantalla

El primitivo acepta `segunda` y **nadie se la pasa**. Los nombres de giro son de un
renglón y cuatro de los siete son **una sola palabra** —Joyería, Bazar, Financiera,
Taller—. Partir «Empeño y préstamo» en dos y teñir la mitad de oro sería inventar un
énfasis que el cliente no autorizó, y el titular de portada es un hueco.

Lo que sí está: la caja alta, el peso 900, la interlínea y el tracking, sobre contenido
real. Es la mitad tipográfica de la pieza. **La otra mitad llega con el copy**, no antes.

Por eso CA-04 dice PARCIAL y no IMPLEMENTADO. Hay cita de código; no hay la pieza que
el ADR describe.

### CA-05 · la sonda es sintética, y por una razón que conviene saber

**Hoy el sitio no renderiza ningún botón primario.** El submit del formulario está
bloqueado por D-13 —`src/routes/contacto/+page.svelte:49`— y el de WhatsApp sale inerte
porque falta el número. No hay un solo botón con arista visible para un visitante.

La sonda clona un botón real del DOM y le cambia la variante, así que el clon conserva
la clase de ámbito de Svelte y recibe **el CSS publicado**. Lo sintético es la presencia
del botón, no la regla que se verifica. En cuanto se cierre D-13 o llegue el número, la
arista aparece sola.

### La diagonal no puede hacer su trabajo todavía

En sus piezas la diagonal **corta una fotografía contra un panel de texto**. Sin la foto
de la fachada, lo que hay es una banda decorativa entrando a la sección oscura: correcta,
al ángulo medido, pero decorativa. Está escrito en el propio componente.

Es la misma proporción que el ADR-0007 puso por delante: **el lenguaje visual acerca
aproximadamente la mitad del camino, y la otra mitad son fotos que no existen.**

### `verificar-contraste.py` no mide el sitio

Sale en 0 hallazgos, y hay que decir qué comprueba: **solo los lienzos de
`diseno/sistema/`**, no `src/` ni el HTML construido. No es evidencia de nada de esta
spec. Lo que cubre el sitio es `validar-a11y.mjs`.

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

---
tipo: adr
id: ADR-0039
estado: ACEPTADA
fecha: 2026-09-15
decide: Nadir
enmienda: ADR-0023 · ADR-0035
implementa: Claude Code
---

# ADR-0039 · El carrusel avanza solo, y sin puntos

## Qué se pidió

> *«¿Podemos hacer que el carrusel tenga más identidad? Para empezar me gustaría remover
> los puntos debajo del mismo, ya que son muchos y solo quitan espacio. También, me
> gustaría que tuviesen un relieve o algo que denote aún más su presencia, o que tenga
> una contracción/dilatación, y que sea un carrusel móvil, que vaya moviendo sus imágenes
> poco a poco.»* — Nadir

Tres cosas. Se hicieron las tres.

## 1 · Fuera los puntos

Eran anclas de verdad, una por foto, con 44 px de objetivo táctil cada una. Con nueve
tarjetas ocupaban **dos renglones enteros** en un teléfono —el `flex-wrap` del
[[ADR-0035-monedas-y-el-piso-tactil|ADR-0035]]— y no aportaban nada que el dedo no
hiciera ya.

**Lo que se pierde, y no se sustituye:** eran el indicador de posición —cuál de nueve
vas—. Y eran la **única señal estática** de que hay más a los lados, porque la barra de
desplazamiento está oculta desde el [[ADR-0023-carrusel-curvo|ADR-0023]]. Lo segundo lo
resuelve el avance automático: un carrusel que se mueve se anuncia solo. Lo primero, no.

Se fueron con ellos el prop `clave` del [[ADR-0033-secuencia-de-joyeria|ADR-0033]] y los
`id` de las tarjetas: existían para ser destino de las anclas.

## 2 · El relieve y la contracción/dilatación

**El relieve es una sombra, y entra como token.** `--sombra-tarjeta`, no un valor suelto
en el componente: una sombra es un color, y un color literal en un componente es la bomba
que este repo ya desactivó cuatro veces. Dos capas, una corta que asienta la pieza y una
larga que la separa del fondo.

Es **estática a propósito**: animar `box-shadow` repinta en cada cuadro, y con quince
tarjetas sobre un teléfono de gama baja eso se nota. La sensación de que la central
sobresale la da la escala, que es `transform` y la resuelve el compositor.

**La contracción/dilatación es un `scale()` en los fotogramas de la curva.** El giro ya
encogía las laterales —`cos(48°) = 0.669`— pero **solo en horizontal**: se leían como
tarjetas de canto, no como tarjetas lejanas. El `scale` las encoge también en vertical,
así que la central crece de verdad contra sus vecinas.

### Una regresión que sospeché y NO era

El propio componente advierte, desde el ADR-0023, que las vecinas deben asomar lo
suficiente *«para no leerse como barras oscuras»*. Al ver la miniatura parecían astillas,
así que se midió antes de dar nada por bueno:

| | Ancho | Alto |
|---|---|---|
| tarjeta central | 265 px | 202 px |
| vecinas | **191 px** | **173 px** |

72 % de ancho y 86 % de alto: una fotografía legible, no una barra. **Lo que las adelgaza
en una miniatura es la máscara de los bordes**, que es una decisión del propio ADR-0023.
No hay regresión. (El intento de comparar con y sin escala inyectando una hoja falló —no
ganaba a la del componente— y se dice en vez de disimularlo.)

## 3 · Avanza solo, de tarjeta en tarjeta

**No empuja el scroll cuadro a cuadro, y la razón es técnica.** La pista lleva
`scroll-snap-type: x mandatory`: un empujón continuo lo pelearía el snap, tirando hacia
delante cada fotograma y de vuelta al centro más cercano. Avanzar **una tarjeta cada
4.5 s** trabaja CON el snap y deja que la curva del `view-timeline` se anime durante el
recorrido, que es justo el efecto que se buscaba.

**Va y vuelve** al llegar al final. Las alternativas se descartaron: volver de golpe a la
primera es un barrido de nueve tarjetas que marea, y clonar la pista para un bucle
infinito duplica el DOM y **rompe el `view-timeline`**, porque cada clon tendría su propia
línea de tiempo.

### Dos clases de parada, y la WCAG 2.2.2

Algo que se mueve solo más de cinco segundos tiene que poder pararse. Hay dos mecanismos:

- **Pausa reversible**: el puntero encima. Se reanuda al salir.
- **Alto definitivo**: el usuario toca, arrastra, rueda, pulsa una tecla o entra con el
  tabulador. Ahí el carrusel es suyo y **no se le vuelve a mover nunca**.

El segundo es el que cumple el criterio: cualquier intento de tomar el control lo detiene
de forma permanente, sin un botón de pausa que nadie pulsa. Y no arranca siquiera con
`prefers-reduced-motion: reduce`.

Fuera de pantalla se congela, mismo criterio que `planeta.js` y por el mismo motivo: la
audiencia del contrato es un teléfono de gama baja.

## Lo medido

Verificado en la página construida, sin tocar nada:

```
puntos: 0  ·  ids de ancla: 0  ·  scripts: planeta.js, carrusel.js
scrollLeft  0 → 472 px en 10 s            ← avanza solo
tras tocar  472 → 472 px en 10 s          ← detenido para siempre
movimiento reducido  0 → 0 px en 10 s     ← nunca arranca
```

| | Antes | Después |
|---|---|---|
| **JavaScript de la página** | 4.54 KB gzip | **4.45 KB** |
| **Margen de CA-10** | 35.46 KB | **35.55 KB** |

El script nuevo es **más pequeño** que el que arreglaba las anclas, así que la identidad
sale gratis en bytes.

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |

## Un efecto secundario que conviene saber

Con `prefers-reduced-motion: reduce`, `base.css` anula **todas** las animaciones del
sitio con `animation-duration: 0.01ms !important`. Eso incluye la curva del
`view-timeline`, así que quien pida menos movimiento ve un carrusel **plano** con snap.
Es correcto y es anterior a este ADR, pero no estaba escrito en ningún sitio.

## Evidencia

| Qué | Dónde |
|---|---|
| El avance y las dos paradas | `static/animacion/carrusel.js` |
| El relieve y la escala | `src/lib/componentes/Carrusel.svelte` · `--sombra-tarjeta`, `@keyframes curvar` |
| El token | `src/lib/estilos/tokens.css` |
| Cómo queda | `capturas/identidad-390.png` · `capturas/identidad-1280.png` |

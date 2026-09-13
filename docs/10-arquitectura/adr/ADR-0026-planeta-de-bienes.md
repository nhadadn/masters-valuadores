---
tipo: adr
id: ADR-0026
estado: ACEPTADA
fecha: 2026-09-12
decide: Nadir
revierte: ADR-0025 §3
implementa: Claude Code
---

# ADR-0026 · Los bienes en órbita, con la M al centro

## Qué se pidió

> *«¿No puedes hacer un carrusel 3D con la sección 1 «¿qué puedes empeñar?» Que se vean
> las categorías flotantes con sus imágenes y la M del logo de Máster al centro? Como
> un planeta.»* — Nadir

**Sustituye a la retícula del [[ADR-0025-galeria-de-activos|ADR-0025]]** y gira siempre.
Las dos cosas las decidió Nadir sobre el prototipo, con el costo delante.

## Lo que cuesta, y se dijo antes de construirlo

En la galería **se ve** una cadena de oro y unas soldadoras. Aquí son discos de 92 a
132 px, y a ese tamaño el patio y las soldadoras se leen como manchas oscuras. Lo que
comunica ya no es la imagen: **es el rótulo**.

Eso choca con el criterio de aceptación que el propio brief del ADR-0024 fijó —*«si el
usuario ve únicamente la sección SIN LEER, debe entender qué puede llevar»*—. Se avisó,
se decidió igual, y queda escrito.

A cambio: la sección mide **360 px en un teléfono** contra unos 1400 de la retícula.

## 1 · La geometría se calcula, no se tantea

La M solo cabe en el centro si el hueco que dejan los discos es mayor que ella:

```
radio × sen(inclinación)  −  diámetro/2  >  mitad de la M
```

| | radio | disco | inclinación | hueco | M |
|---|---|---|---|---|---|
| Escritorio | 250 | 132 | 42° | **101 px** | 160 |
| Teléfono | 132 | 92 | 42° | **42 px** | 82 |

Se llegó ahí después de **dos intentos fallidos que se vieron en las capturas**: con el
radio corto los mundos se pisaban entre sí y tapaban la M; con el radio largo el anillo
se salía de la página. La fórmula quitó el tanteo.

Medido sobre el prototipo, a 1280 y a 390: **6 de 6 rótulos legibles, 0 choques, 0
discos encima de la M**.

## 2 · Dos animaciones, no una

El anillo gira. Si los discos giraran con él acabarían de canto y desaparecerían media
vuelta, así que cada uno lleva una animación que **deshace** el giro.

La alternativa era animar una propiedad personalizada y leerla desde los hijos: eso
obliga a recalcular estilo de siete elementos en cada cuadro. Con dos animaciones de
`transform` puras el trabajo se queda en el compositor.

**Comprobado**: congelando la animación en cinco momentos distintos, la desviación del
círculo es **0.000** en todos. Los discos nunca se ponen de canto.

## 3 · Lo que cuesta en un teléfono de gama baja

Con el reloj a 1/4, que es lo que simula ese aparato:

```
CON planeta   22.6 fps        SIN planeta   54.7 fps
recálculos de estilo: 0       maquetados: 0
```

Cero recálculos y cero maquetados: **no es cálculo, es rasterizado**. Siete elementos
en 3D con recorte circular y sombra se vuelven a pintar en cada cuadro.

Se probaron cuatro recortes de coste y **las mediciones salieron demasiado ruidosas
para decidir con ellas** — la misma configuración dio 22.6 y 27.7 fps en dos vueltas.
La única señal firme fue contraintuitiva:

| | fps con el reloj a 1/4 |
|---|---|
| tal cual | 27.7 |
| sin `filter` en las fotos | 25.0 |
| sin `box-shadow` | 24.9 |
| sin recorte circular | 23.8 |
| **con `will-change: transform`** | **6.3** |

`will-change` lo **empeora cuatro veces**: forzar siete capas con `preserve-3d` cuesta
más de lo que ahorra. Es justo lo contrario de lo que dice el manual.

### Así que el planeta se mide a sí mismo

Mismo patrón que la banda de monedas del ADR-0021: si dos ventanas seguidas bajan de
32 fps, deja de girar y se queda de composición fija. Sigue enseñando las seis
categorías, que es lo que tiene que hacer.

**El primer intento estaba roto y lo dijo la prueba**: medía una sola ventana a los
900 ms y se rendía hasta con el reloj sin freno — a esa altura todavía se decodifican
imágenes, así que medía la carga y no la animación. Con el ajuste:

```
reloj 1/1  sigue girando        reloj 1/4  se planta        reloj 1/6  se planta
```

También se congela **fuera de pantalla** y con la pestaña oculta. Nadir pidió que gire
siempre y gira siempre — mientras alguien lo vea.

## 4 · El LCP que no era

La herramienta dio **7460 ms** y luego 4356, 8948 y 7636 para el mismo código. Antes de
tocar nada se midió **intercalado** contra la retícula, alternando en la misma sesión:

```
vuelta 1   GALERÍA 6240 ms   PLANETA 2420 ms
vuelta 2   GALERÍA 2160 ms   PLANETA 2400 ms
vuelta 3   GALERÍA 2244 ms   PLANETA 2212 ms
```

El planeta sale **plano y la galería tiene el pico**. Era carga de máquina, el mismo
fantasma del ADR-0023. Sin el intercalado habría «arreglado» una regresión que no
existía.

## Lo medido

| | Galería | Planeta |
|---|---|---|
| LCP (intercalado) | ~2200 ms | **~2350 ms** |
| Peso | 221 KB | **173.5 KB** |
| Alto en móvil | 7.8 pantallas | **6.8** |
| JS de la ruta | 9.14 KB | **11.2 KB** |
| Accesibilidad | 16/16 | **16/16** |

131 tests · contraste 0 hallazgos · piezas 12/12 · CA-10 cumplido con 28.80 KB de margen.

## Lo que no cambia

El bloque de revisión del ADR-0025 sigue al pie, el CTA contextual de WhatsApp sigue
debajo, y **cada mundo lleva a WhatsApp con su categoría escrita en el mensaje**.

## Evidencia

| Qué | Dónde |
|---|---|
| El planeta | `src/lib/componentes/PlanetaBienes.svelte` |
| La pausa y la degradación | `static/animacion/planeta.js` |
| La M | dos paths, los mismos del encabezado en `+layout.svelte` |
| Rendimiento | `Emulation.setCPUThrottlingRate` a 4 · ver la tabla de arriba |

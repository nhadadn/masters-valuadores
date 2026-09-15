---
tipo: adr
id: ADR-0032
estado: ACEPTADA
fecha: 2026-09-15
decide: Nadir
extiende: ADR-0031
implementa: Claude Code
---

# ADR-0032 · La foto sale del marco, y no entra una galería

## Qué se pidió

> *«Considero muy plana y básica la página en algunos aspectos, como la sección donde
> se muestra el reloj. Sería bueno colocar una galería de imágenes de joyería y relojes,
> con un estilo profesional, sin que parezca un HTML plano.»* — Nadir

## Por qué NO entra la galería

El inventario real de joyería son **dos fotografías suyas** —`bien-joyeria` y `bien-oro`—
y dos de banco, y **las cuatro ya están publicadas en esa misma pantalla**. Una galería
hoy solo puede salir de repetir lo que ya está unos centímetros más arriba, de meter más
banco, o de fotos nuevas.

Y hay algo que pesa más que el número: las dos suyas son la misma composición dos veces
—pieza de oro sobre terciopelo negro, de frente—. El carrusel del patio funciona porque
un rodillo, un montacargas y un brazo articulado **son cosas distintas**. Cuatro
bodegones en fila se leen como relleno. Montar la galería habría dado exactamente el
«HTML plano» que se quería evitar, solo que con más filas.

## Las siete imágenes que llegaron

Nadir dijo que las generaría con ChatGPT. Se le respondió que no, citando el
[[ADR-0009-fotografia-de-banco|ADR-0009]], que reproduce textual la regla del ADR-0007:
*«Sus piezas usan imágenes de archivo o generadas. En el sitio van fotos suyas o va
hueco.»* El 0009 revirtió **solo** la parte de archivo, y con rótulo. Las generadas nunca
se desvetaron.

Llegaron siete a `fotos-origen/`. Se revisaron una por una, acercándose:

| Imagen | La prueba |
|---|---|
| Cronógrafo de oro, bisel de diamantes | La ventana del «28» **corta por dentro** el contador de las 3. Sin marca. Texto ilegible bajo las 6. Marcadores inconsistentes. |
| Vitrina con fila de relojes | Todas las carátulas con texto derretido imitando una marca. Dos contadores son manchas sin forma. Eslabones fundidos con los cojines. |
| Esqueleto de oro rosa | Marca inventada: **«PANSH»**. Romanos fuera de orden. Movimiento de filigrana, sin tren de engranes. |
| Reloj sobre correa de piel | Tres renglones de letra ilegible donde va la marca. |
| Mano negra con anillos | Anatomía distorsionada, una uña despegada. |
| Joyería sobre terciopelo | Las piezas no resuelven en objetos: manchas de oro y una «cadena» que es un hilo. |

**Seis de siete son generadas.** Es la quinta vez que se detecta en este proyecto, y
varias imitaban el diseño de carátula de una marca real.

### La séptima sí sirve, y bastante

La del cronógrafo con la charola de anillos **es fotografía**: romanos bien formados,
escala taquimétrica legible y consecutiva, eslabones con geometría que repite, cadena
cubana correctamente entrelazada, y la carátula dice **BREITLING · CHRONOMÈTRE ·
CROSSWIND**.

Y es **el original completo de `bien-joyeria`**, que estaba publicada como un recorte
apaisado de 800×534. El original mide **1206×1518**: vertical, con la cadena en diagonal,
el reloj arriba y la charola bajando por el borde derecho. Composición editorial hecha en
cámara.

## La decisión

**Se sustituye el recorte por el original y la foto sale del marco.**

Estaba puesta como un rectángulo con esquinas redondeadas, sombra de 44 px y aire
simétrico a los cuatro lados, flotando en el centro del mármol. Eso es composición de
formulario. Ninguna de las tres referencias del [[ADR-0029-una-serif-para-el-titular|ADR-0029]]
enmarca una fotografía: la dejan cortarse contra el borde.

- **Teléfono**: sangra de borde a borde, cancelando el acolchado lateral.
- **Escritorio**: rejilla de dos columnas; los botones se apoyan en el pie de la foto y
  la foto sangra hasta el borde de la ventana.
- Fuera el radio, fuera la sombra. **La piedra del ADR-0030 hace de zócalo.**

**NO se fuerza a vertical.** Esta plantilla pinta las cuatro páginas de giro y las otras
tres llevan foto apaisada, así que cada giro declara su relación en `fotoRelacion`.

## Tres errores que solo aparecieron midiendo

1. **Añadir un peldaño a `ANCHOS` cambia el `srcset` de TODAS las fotos.** Se escribió en
   el comentario que no cambiaba nada para las demás; **era falso** y lo cazó el
   prerender con `404 /fotos/fachada-1200.avif`. El 1200 existe ahora para las cinco que
   tenían 1600. Un ancho en esa lista es una promesa de archivo.
2. **`Foto.svelte` fuerza `16 / 9` con `object-fit: cover`.** Sin tocarlo, el original
   vertical se habría recortado justo por la charola de anillos — medio tema de la foto.
   De ahí `fotoRelacion`.
3. **En un ítem de rejilla, el `50%` de un margen resuelve contra SU COLUMNA**, no contra
   `.caja`. Puesto en `.foto-giro`, `calc(50% - 50vw)` daba −347 px y la imagen se salía
   **268 px** de la ventana. Va en `.entrada-b`, donde el porcentaje sí resuelve contra
   `.caja`.

## Lo medido

Hueco entre la foto y el borde derecho, tras la corrección:

| Ancho | 768 | 1280 | 1440 | 1920 |
|---|---|---|---|---|
| Hueco | **0 px** | **0 px** | **0 px** | **0 px** |
| Foto | 367×461 | 628×791 | 672×846 | 803×1011 |

Antes de arreglarlo eran 32, 112 y 352 px. Un filo de 32 px de piedra no se lee como
composición: se lee como un error de cálculo.

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| CA-10 | cumplido · 28.68 KB de margen |
| **LCP** | **1520 ms ✓ bueno** |

### El peso NO bajó, aunque la herramienta lo diga

Informó 217.3 KB contra 254.2 KB. **No es una mejora**: son **25 peticiones contra 27**,
y las dos que faltan son las del carrusel, que en esa vuelta no llegaron a pedirse porque
la página creció a 5.4 pantallas. La cuenta cuadra: 254.2 − 48 (las dos) + 10.9 = 217.

Lo atribuible es al revés: **`bien-joyeria` pasa de 25.1 a 36 KB** por servirse más
grande. Es lo que cuesta la foto buena.

## Un hallazgo que NO es de este cambio

La página **desborda horizontalmente 126 px a 1280**, y no es por la foto —se comprobó:
termina exactamente en el borde—. Sale de `ul.anillo`, el anillo del planeta del
[[ADR-0026-planeta-de-bienes|ADR-0026]], que se extiende de −182 a 1400. Recortarlo no es
opción: `overflow` distinto de `visible` aplana el `transform-style` y mata el 3D. El
carrusel también asoma. **Queda anotado, sin tocar.**

## Lo que queda abierto

- **La columna izquierda en escritorio está muy vacía**: mármol y dos botones abajo. Puede
  leerse como aire deliberado —es lo que hacen las referencias— o como hueco. Sin copy
  aprobado no hay con qué llenarla, así que se deja a criterio de Nadir.
- **Las seis generadas quedan en `fotos-origen/generadas-rechazadas/`**, fuera del repositorio por `.gitignore`: se conservan en disco para que haya constancia, pero el repo no carga con joyería fabricada.

## Evidencia

| Qué | Dónde |
|---|---|
| La composición y el sangrado | `src/routes/[giro]/+page.svelte` · `.entrada-b`, `.foto-giro` |
| La relación por giro | `src/lib/datos/giros.ts` · `fotoRelacion` |
| El peldaño de 1200 | `src/lib/datos/fotos.ts` · `ANCHOS` |
| El original | `fotos-origen/bien-joyeria-original-1206.jpg` · 1206×1518 |
| Cómo queda | `capturas/editorial-1280.png` · `capturas/editorial-390.png` |

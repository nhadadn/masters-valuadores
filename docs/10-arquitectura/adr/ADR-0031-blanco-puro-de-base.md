---
tipo: adr
id: ADR-0031
estado: ACEPTADA
fecha: 2026-09-14
decide: Nadir
enmienda: ADR-0020 · ADR-0028
implementa: Claude Code
---

# ADR-0031 · Blanco puro de base

## De dónde sale

Es **el último de los tres** cambios que salieron de investigar tres referencias reales
en el [[ADR-0029-una-serif-para-el-titular|ADR-0029]]. Nadir: *«Adelante con el blanco
puro de base»*.

El hallazgo era éste, medido en sus páginas:

| | Fondo del cuerpo |
|---|---|
| Suttons & Robertsons | blanco puro `#FFFFFF` |
| Cosentino / Silestone | blanco puro, tinta `rgb(35,35,35)` |
| **MASTER**, hasta hoy | crema `#E3DED4`, luego `#F7F5F1` |

## La decisión

**Las tres superficies base pasan a `--blanco`.** No hace falta token nuevo:
`--blanco: #FFFFFF` ya estaba declarado en `tokens.css:59` y ya lo usaban `--panel`,
`--superficie` y `--tinta-sobre-oscuro`.

| Superficie | Antes | Ahora |
|---|---|---|
| el cuerpo | `--crema-025` | **`--blanco`** |
| la cabecera | `--crema-025` | **`--blanco`** |
| los cinco grados planos de `Seccion` | `--crema-025` | **`--blanco`** |

**La crema no era un color de su marca.** Era el residuo de una rampa —la del
[[ADR-0020-crema-calida-y-marmol|ADR-0020]]— que el `ADR-0030` ya había quitado. Lo que
quedaba era el punto de arranque de un degradado sin degradado.

Y la otra mitad del cambio, la que no es un valor: **el color lo ponen las fotografías.**
Sobre blanco, la losa de mármol y el retrato del reloj por fin se leen como materiales
distintos de la página. Sobre crema competían con ella.

## Lo que NO cambia

- **`--crema-025` y `--crema-100` conservan su valor.** No se falsea un token: siguen
  siendo crema y siguen respaldando la rampa bajo la textura de mármol.
- **La entrada conserva `--crema-100`** como color plano pesimista. Su velo sí es un
  degradado, así que ese sigue siendo su peor extremo.
- **Ni arquitectura, ni orden, ni textos, ni funcionalidades.** Tres valores.

## Lo que se comprobó ANTES de tocar

El riesgo evidente de una página blanca es que los paneles blancos desaparezcan. Se
miró primero, no después: **todos los que viven sobre claro ya traían filete propio.**

| Componente | Qué lo salva |
|---|---|
| `Tarjeta.svelte:81` | `border: 1px solid var(--negro-400)` · 3.49:1 |
| `RanuraImagen.svelte:37` | `border: 1px solid var(--panel-borde)` |
| `Mapa.svelte:72` | `border: var(--regla-dorada) solid var(--oro-500)` |
| `Campo.svelte` | `--borde-campo` · 5.90:1 |

`Foto.svelte:182` pinta `--panel` **detrás** de una fotografía: sobre blanco no se ve, y
no tiene que verse.

## Lo medido

Contraste mínimo por página, con el mismo validador en las tres fases:

| Páginas | `ADR-0029` | `ADR-0030` | **ahora** |
|---|---|---|---|
| portada, contacto, las dos legales | 6.47:1 | 7.97:1 | **8.56:1** |
| maquinaria, fletes, taller | 3.47:1 | 4.27:1 | **4.65:1** |
| empeño | 3.47:1 | 3.47:1 | 3.47:1 |

**El 4.65 cruza el 4.5 de AA para texto normal**, que el oro no había alcanzado nunca
sobre claro. Conviene no sacar de ahí más de lo que dice: lo cruza **sobre la superficie
base**, no sobre la losa de mármol, que sigue en 3.47. La regla del `tokens.css` —*«en
texto chico va tinta; en display, oro»*— **no se toca aquí**: cambiarla sería otra
decisión, y tendría que resolver primero qué pasa sobre la piedra.

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| CA-10 | cumplido · 28.68 KB de margen |
| Peso | **254.2 KB**, 0 de terceros · sin cambio |

### El LCP: no se declara mejora

Cuatro vueltas intercaladas, dos en cada orden. **El blanco gana las cuatro**, y a
diferencia del fantasma del `ADR-0030` gana también con el orden invertido:

| | vueltas (ms) |
|---|---|
| crema · `a21eb85` | 3940 · 4140 · 4068 · 4092 |
| blanco | 3772 · 3876 · 3796 · 3400 |

**Aun así no se declara mejora, y el motivo importa.** Los dos builds reportan el
**mismo elemento** —`section.seccion` con `/marca/marmol-900.avif`—, el **mismo peso**
—254.2 KB— y la **misma petición** —el archivo se pide a 785 ms contra 787—. La
diferencia entera vive en «primer pintado», que esta noche osciló entre **3400 y 4140 ms
para trabajo idéntico**.

No hay mecanismo: son tres valores de `background-color` y cero bytes de diferencia.
Un patrón de 4 de 4 sin mecanismo, en la máquina que ya mintió cuatro veces en este
repo, es una observación — no un resultado. **Queda anotado como observado, no como
causado.**

## La deuda que deja

`Seccion` tiene un grado llamado **`crema` que ya no pinta crema**, y otro llamado
`blanco` que por fin hace honor a su nombre. Cinco de los nueve grados pintan hoy
exactamente lo mismo.

No se renombran porque **la escala es la API del componente** y tocarla significa
editar las ocho páginas para no ganar un píxel. Queda escrito aquí para que el próximo
que lo lea sepa que es deuda conocida y no un descuido.

## Lo que apareció de paso, y NO se tocó

Mirando la portada en blanco se vieron **marcas internas que siguen publicadas**, y que
el `CLAUDE.md` daba por retiradas. Verificado en el HTML construido, no en la captura:

- Una tarjeta **«🔒 BLOQUEADOS»** con `Importaciones D-04`, `Avalúos periciales D-03` y
  `Bazar D-18` — identificadores de decisiones internas, en la página de inicio.
- Dos rótulos **«FOTO DE ARCHIVO»** sobre las tarjetas de fletes y taller.

**No se tocó ninguna de las dos**, y por razones distintas. La primera es contenido, no
estilo. La segunda **choca de frente**: el brief de cohesión visual dice que «FOTO DE
ARCHIVO» no debe formar parte de la interfaz pública, y el
[[ADR-0009-fotografia-de-banco|ADR-0009]] puso ese rótulo como garantía de honestidad —
nunca publicar foto de banco sin decir que lo es. El `CLAUDE.md` manda pararse y
preguntar ante un choque así. **Está preguntado, no decidido.**

## Evidencia

| Qué | Dónde |
|---|---|
| El cuerpo en blanco | `src/lib/estilos/base.css` |
| Los grados planos en blanco | `src/lib/componentes/Seccion.svelte` |
| La cabecera en blanco | `src/routes/+layout.svelte` |
| El token, que ya existía | `src/lib/estilos/tokens.css:59` |
| Cómo queda | `capturas/blanco-1280.png` · `capturas/blanco-390.png` |

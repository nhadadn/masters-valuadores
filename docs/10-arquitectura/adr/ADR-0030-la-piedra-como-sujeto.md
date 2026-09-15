---
tipo: adr
id: ADR-0030
estado: ACEPTADA
fecha: 2026-09-14
decide: Nadir
enmienda: ADR-0028
completa: ADR-0012
implementa: Claude Code
---

# ADR-0030 · La piedra como sujeto, no como papel pintado

## De dónde sale

Es **el segundo de los tres** cambios que salieron de la investigación del
[[ADR-0029-una-serif-para-el-titular|ADR-0029]]. Nadir eligió este: *«2. de acuerdo»*.

El hallazgo que lo motiva está medido en tres páginas reales —Suttons & Robertsons,
Cosentino y Antolini—: **ninguna de las tres usa piedra de fondo**, ni siquiera las dos
que venden piedra. La fotografían grande, a sangre, con el texto encima.

El [[ADR-0028-la-piedra-clara|ADR-0028]] hizo lo contrario: repartió la textura por
cuatro de los cinco grados, siempre bajo un velo del 80–93 %. El resultado es que **no
se leía ni como textura ni como material**. Si está en todas partes, no está en ninguna.

## Qué cambia

**La piedra se concentra en la entrada y desaparece del resto.**

| Grado | Antes | Ahora |
|---|---|---|
| `marmol` · la entrada | textura + velo en diagonal 0.93 → 0.50 | textura + velo **local**: 0.92 sobre la columna de texto, **0.06** en el borde derecho |
| `medio` | textura bajo velo del 86 % | **`none`** · plano |
| `tenue` | veta al 2.8 % + resplandor | **`none`** · plano |
| `marfil` | rampa `crema-025 → crema-100` | **`none`** · plano |
| `piedra` | sin cambio | sin cambio · sigue siendo el escalón hacia el pie |
| el cuerpo | `tenue` | **plano** |

El velo de la entrada es lo único que sigue siendo degradado, y por eso es lo único que
conserva `--crema-100` como color plano pesimista.

## Dos defectos que solo aparecieron al aplanar

Ninguno de los dos se dedujo. Los dos se midieron en la página construida, muestreando
el píxel por la izquierda cada dos renglones.

### 1 · Una franja amarilla entre la cabecera y la entrada

Se veía como un galón suelto. La cadena de ancestros decía `rgb(227, 222, 212)` y el
píxel decía **`rgb(227, 218, 193)`**, así que algo pintaba encima sin estar en la cadena.
Era un `body::before` con `pointer-events: none`: **la mancha de oro que vagaba del
`ADR-0012`**, 28 s en bucle, al 20 %.

El `ADR-0028` dice en su encabezado que **revierte el 0012**, pero esta regla sobrevivió
a la inversión. Escrita para campo negro, una mancha tenue de oro evita que el fondo se
vea muerto; sobre claro no da vida, **tiñe**.

Lo más incómodo: el propio `tokens.css` ya lo sabía. Tres renglones encima de
`--resplandor` hay un comentario que dice, de `--resplandor-claro`, que *«al 0.20 que usa
el oscuro, sobre acero se lee como una mancha sucia en vez de como luz»*. Se corrigió
para las superficies y **se dejó corriendo en el cuerpo**.

Se retira la regla entera con su animación. Son ocho páginas con una animación infinita
menos.

### 2 · Tres costuras entre secciones

Cada sección reiniciaba la rampa `crema-025 → crema-100`, así que el borde entre dos era
un escalón de 20 niveles. Medido: `rgb(227,222,212) → rgb(247,245,241)` en **y=1352,
y=2762 y y=3058**. Tres costuras visibles que no decían nada.

Con los grados planos quedan **cero**. Los únicos cortes que quedan en la página son los
que se quieren: donde empieza la piedra, donde empieza `piedra` y donde empieza el pie.

## Lo medido

Las dos superficies planas son más claras que la rampa que sustituyen, así que el
contraste **sube**. Comprobado construyendo el `HEAD` en un árbol aparte y pasando el
mismo validador a los dos:

| Páginas | Antes | Después |
|---|---|---|
| portada, contacto y las dos legales | 6.47:1 | **7.97:1** |
| maquinaria, fletes, taller | 3.47:1 | **4.27:1** |
| empeño | 3.47:1 | 3.47:1 · sin cambio |

Empeño no se mueve, y es correcto: sus dos secciones de entrada conservan `--crema-100`
porque su velo sí es un degradado y ese sigue siendo su peor extremo.

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| CA-10 | cumplido · 28.68 KB de margen |
| Bytes | sin cambio · no entra ni sale un archivo |

### El LCP no se movió, y la cifra suelta de hoy no vale

Seis vueltas intercaladas, tres en cada orden. Las tres primeras parecían una regresión
de ~700 ms, y **la regresión cambió de bando al invertir el orden**: el castigo seguía a
la segunda posición, no al build.

| | vueltas (ms) | mejor |
|---|---|---|
| antes | 3968 · 3892 · 3828 · 4192 · 3804 · 4512 | **3804** |
| después | 4692 · 4588 · 3876 · 4092 · 3784 · 3752 | **3752** |

Es la **cuarta** vez en este repo que una cifra suelta de esta máquina miente. Y sirve de
aviso sobre la tabla del `ADR-0029`: allí el mismo código dio **1244 ms** y hoy da 3804.
La máquina de hoy va tres veces más lenta. **Las cifras absolutas de LCP de este proyecto
no son comparables entre sesiones**; solo valen las parejas medidas en la misma fase.

## Lo que NO se tocó

- **Ni arquitectura, ni orden de secciones, ni textos, ni funcionalidades.** Solo valores
  de token y el color plano de `Seccion.svelte`. Ningún componente escribe un color.
- **Los cinco grados siguen existiendo con su nombre.** La escala es la API de `Seccion`
  y no se cambia; lo que cambia es que hoy **solo dos de los cinco pintan algo**.
- **La segunda sección de entrada conserva la piedra.** Se miró con la foto cargada antes
  de decidir: el retrato del reloj y la joyería se apoya en el mármol como en un zócalo,
  y ahí la piedra sí es sujeto. Las dos son «la entrada», partida por el
  [[ADR-0027-fuera-las-marcas-de-borrador|ADR-0027]].
- **`--marmol`**, el mármol dibujado del `ADR-0020`, sigue declarado y **ya no lo usa
  nadie** — quedó muerto cuando el 0028 lo sustituyó por la fotografía, no ahora. Se deja
  anotado, no se toca.

## Lo que sigue pendiente

El **primero** de los tres cambios del `ADR-0029` sigue sin empezar y sin aprobar:
**blanco puro de base**, y que el color lo pongan las fotografías. Las tres referencias
arrancan de `#FFFFFF`; esto sigue en crema.

## Evidencia

| Qué | Dónde |
|---|---|
| Los grados planos y el velo local | `src/lib/estilos/tokens.css` · `--marmol-fuerte`, `--marmol-medio`, `--marmol-tenue`, `--marfil` |
| El resplandor retirado | `src/lib/estilos/base.css` · donde estaba `body::before` |
| El cuerpo plano y en marfil | `src/lib/estilos/base.css` |
| El color plano separado | `src/lib/componentes/Seccion.svelte` |
| Cómo queda | `capturas/piedra-sujeto-1280.png` · `capturas/piedra-sujeto-390.png` |

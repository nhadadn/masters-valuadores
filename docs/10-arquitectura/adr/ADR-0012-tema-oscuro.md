---
tipo: adr
id: ADR-0012
estado: ACEPTADA
fecha: 2026-09-10
decide: Nadir
extiende: ADR-0011-entrada-oscura
enmienda: ADR-0010-degradados-de-superficie
implementa: Claude Code
---

# ADR-0012 · El sitio entero va en oscuro

## Qué se decide

> *«Propaga al resto de la página, deshaz todo rastro de tonalidades blancas,
> continuamos con el color gradiente, a este mismo le pretendemos agregar aún más
> animación, como un color vibrante con los mismos tonos gradientes.»* — Nadir

**El tema del sitio se invierte por completo.** No queda ninguna superficie clara: el
campo es un degradado oscuro con un resplandor de oro **que se mueve**, y las tarjetas,
huecos y campos de formulario son paneles oscuros que se levantan encima.

Extiende el [[ADR-0011-entrada-oscura|ADR-0011]], que lo había limitado a la entrada.

## El riesgo, dicho por tercera vez y sin suavizar

El `CLAUDE.md` define la audiencia así, y es la premisa que sostiene el repo entero:

> «alguien que necesita liquidez hoy, buscando desde **un teléfono de gama baja, a
> plena luz del día**, con prisa.»

**Un sitio completamente oscuro es exactamente lo que esa premisa desaconseja.** En una
pantalla barata, con brillo bajo y sol de frente, un fondo oscuro se lava y los reflejos
del propio cristal compiten con el contenido. Un fondo claro, en esas condiciones, casi
siempre gana.

Contra eso hay un argumento honesto —el contraste medido **subió**, de 4.84:1 a
**7.02:1** de mínimo— pero el contraste calculado no modela el reflejo especular del
cristal a pleno sol. **Nadie ha medido esto en un teléfono real en la calle de Torreón,
y hasta que alguien lo haga, esta decisión está tomada sobre una pantalla de escritorio
en interior.**

La prueba que zanjaría la discusión es barata: abrir el sitio en un teléfono de gama
baja, afuera, a mediodía. Queda pendiente y anotada.

Se implementa igual, porque es decisión de Nadir y la reafirmó. Lo que no se hace es
fingir que el riesgo no existe.

## La paleta, con el peor caso calculado

| Rol | Valor | Peor tinta encima |
|---|---|---|
| `--campo-alto` | `#16181B` | blanco **17.79:1** |
| `--campo-bajo` | `#0C0D0F` | blanco 19.44:1 |
| `--panel` | `#2A2F34` | blanco **13.51:1** · negro-200 **9.33:1** · oro-500 **7.73:1** |
| `--panel-borde` | `#3C4248` | — |

El panel se levanta **1.32:1** del campo: lo justo para leerse como superficie sin
convertirse en un bloque.

## El resplandor se mueve, así que el contraste se garantiza en el peor fotograma

Un fondo animado cambia el color bajo el texto **con el tiempo**. No basta calcular un
estado: hay que calcular el peor.

| Oro sobre el punto más claro del campo | Blanco | `negro-300` |
|---|---|---|
| 10 % | 14.59:1 | 6.97:1 |
| **20 %** | **11.37:1** | **5.43:1** ← el elegido |
| 26 % | 9.72:1 | 4.64:1 ← sin margen para algo que se mueve |

Y los **paneles son opacos**: el resplandor pasa por detrás y nunca cruza su texto.

### Se anima `transform`, y solo `transform`

Animar `background-position` repinta el área entera en cada cuadro. `transform` lo
resuelve el compositor y no repinta. En un teléfono de gama baja esa diferencia es
batería y fluidez, no elegancia.

`prefers-reduced-motion` **detiene** el resplandor —no lo borra—: el fondo conserva su
color y solo deja de moverse. Verificado en navegador: `animation-name: none`.

## Lo que cayó solo, y por qué existían los tokens

Lo importante del cambio: **los roles semánticos cambiaron de valor y ningún componente
tuvo que cambiar de token.** `--superficie`, `--tinta`, `--tinta-secundaria`,
`--borde-sutil` se redefinieron una vez y el sitio entero giró.

Lo que sí hubo que tocar fue **exactamente lo que escribía colores a pelo**:
`RanuraImagen`, `PorConfirmar`, `Hueco`, `Campo`, `BotonWhatsApp` y un par de reglas de
página. Es la cuarta vez en el día que pasa lo mismo, y ya no es anécdota: **un color
literal en un componente es una bomba de relojería que estalla cuando cambia la
superficie.**

## La acción primaria pasa a oro

Sobre un sitio oscuro un botón negro desaparece. El primario pasa a **oro con etiqueta
oscura encima**, 11.12:1, que es exactamente el uso del acento que el
[[ADR-0007-lenguaje-visual|ADR-0007]] autoriza.

Nuevo token `--tinta-sobre-accion`. El validador **no** podía cazar este error —hoy no
se dibuja ningún botón primario, porque D-13 bloquea el submit y el de WhatsApp sale
inerte— así que se razonó en vez de esperarlo.

De paso se corrige un defecto viejo: `.acento:hover` ponía blanco sobre `--oro-700`,
que da **4.05:1** y nunca pasó AA. Estaba ahí desde la Fase 0.

## Lo que queda sin trabajo

`--oro-800` existía para poder escribir oro **sobre claro**. Ya no hay claro. No se
borra —el [[ADR-0006-el-amarillo-vive|ADR-0006]] lo justificó y volvería con cualquier
superficie clara— pero hoy no lo usa nadie. Lo mismo con `--acero-*` y los degradados
claros del [[ADR-0010-degradados-de-superficie|ADR-0010]].

## Cómo se revierte

Los tokens de rol están en un solo bloque de `tokens.css`. Volver a claro es cambiar ese
bloque y recorrer los pocos sitios que escriben literales — que ahora están todos
anotados. No es gratis, pero es una tarde, no un rediseño.

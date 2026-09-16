---
tipo: adr
id: ADR-0044
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: ADR-0019
implementa: Claude Code
---

# ADR-0044 · El ancla no tiene dos colores

## Qué se preguntó

> *«¿Y qué hay de esta sección? Aún se ve en negro.»* — Nadir, sobre el pie

## Lo que había, medido en píxeles

La captura enseñaba dos bloques oscuros pegados que **no se veían del mismo color**. No
lo eran en pantalla, aunque sí en el token:

| Zona | Píxel |
|---|---|
| banda de contacto, izquierda | `rgb(27,26,23)` |
| **banda de contacto, derecha** | **`rgb(47,43,28)`** |
| pie, izquierda y derecha | `rgb(23,23,23)` |

La banda y el pie declaran **el mismo `--carbon`**. La diferencia la ponía
`--resplandor-fijo`, un radial de oro al 0.16 heredado del sitio oscuro del `ADR-0019`:
teñía la banda hasta 24 niveles de rojo por encima del pie que tiene pegado debajo.

Una mitad parda y la otra negra, con la costura a la vista. **Y el propio `tokens.css` ya
lo había avisado** para el resplandor claro: *«se lee como una mancha sucia en vez de como
luz»*. Es la misma especie que el [[ADR-0030-la-piedra-como-sujeto|ADR-0030]] quitó del
cuerpo.

## Lo que se hace

Fuera el resplandor de las dos superficies que lo llevaban: la banda de contacto y la
barra fija. **Un ancla no tiene dos colores.**

Medido después: `23,23,23` en las cuatro esquinas del bloque oscuro.

`--resplandor-fijo` queda **sin un solo consumidor**. Se deja declarado —el `ADR-0019` lo
justificó y puede volver el día que haya una superficie oscura que no toque otra— con la
nota de que hoy no lo pide nadie.

## Lo que NO se hizo, y el costo de hacerlo

Se probó el **pie claro** entero, porque era la lectura literal de la pregunta. Medido:

- **NO CUMPLE**, `2.09:1` en tres etiquetas —`HORARIOS Y REDES`, `LÍNEAS`, `LEGAL`—.
  Usan `--tinta-tenue-oscuro`, que es el rol «tinta apagada SOBRE OSCURO»: correcto
  mientras el pie sea negro, inválido en cuanto deje de serlo. Son cinco roles escritos
  dentro del pie que habría que cambiar.
- Y hay una razón que pesa más que el trabajo: **la banda de contacto es la pieza n.º 2
  de las seis del [[ADR-0007-lenguaje-visual|ADR-0007]]**, sacada de sus publicaciones
  vivas y no del gusto de nadie. El `CLAUDE.md` lleva la cuenta en 12/12. Aclararla
  rompería una.

Así que el pie se queda oscuro: es el ancla que decidió el
[[ADR-0028-la-piedra-clara|ADR-0028]] y hoy es **la única zona oscura del sitio** por
encima de la barra. Si aun así se quiere claro, está medido lo que cuesta.

## Lo medido

| | Antes | Después |
|---|---|---|
| Colores en el bloque oscuro | **2** · `23,23,23` y `47,43,28` | **1** · `23,23,23` |
| Tokens sin consumidor | 0 | 1 · anotado |
| Accesibilidad | 16/16 | **16/16 CUMPLE** |
| Contraste del sistema | OK | **0 hallazgos** |
| Tests | 148 | **148** |
| Selectores muertos | 0 | **0** |

## Evidencia

| Qué | Dónde |
|---|---|
| La banda sin resplandor | `src/lib/componentes/BandaContacto.svelte` |
| La barra sin resplandor | `src/routes/+layout.svelte` |
| El token huérfano, anotado | `src/lib/estilos/tokens.css` |
| Cómo queda | `capturas/pie-uniforme.png` |

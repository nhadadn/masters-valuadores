---
tipo: adr
id: ADR-0011
estado: ACEPTADA
fecha: 2026-09-10
decide: Nadir
depende_de: [ADR-0010-degradados-de-superficie, ADR-0007-lenguaje-visual]
implementa: Claude Code
---

# ADR-0011 · La entrada va en oscuro

## Qué lo abrió

Tres rondas seguidas de la misma crítica:

> *«Un fondo blanco no transmite nada para el cliente.»*
> *«No veo aún uniforme el fondo… se ve negro sin estilo.»*
> *«Se sigue mostrando el blanco en las secciones principales.»*
> *«No veo cambios…»*

La última tenía razón y el problema no era el ajuste: era el **techo**. Medido, el
campo había pasado de `rgb(253,253,253)` a `rgb(238,241,244)`. Un 7 %. Real y casi
imperceptible.

## El techo, y de dónde venía

El fondo claro no podía bajar más porque **el titular a dos tintas estaba apoyado
directamente sobre él**, y `--oro-800` necesita 3:1 por ser texto grande:

| Campo | `--oro-800` encima |
|---|---|
| `#D6DCE1` | 3.36:1 |
| `#CDD5DB` | 3.13:1 |
| `#C4CDD4` | **2.88:1** ← ya no pasa |

Cada paso que oscurecía el fondo se comía el margen del gesto más reconocible de la
marca. Ir por ahí era pelearse con la aritmética.

## Decisión

**La sección de entrada de la portada pasa a fondo oscuro.** Titular en blanco, segundo
renglón en `--oro-500` a **11.12:1** —tres veces el margen que tenía sobre claro— y la
foto de la fachada sobre negro.

Decidido por Nadir, 10 de septiembre de 2026, tras descartarlo dos veces antes.

## Lo que esto cuesta, dicho

**Se aparta de sus cinco publicaciones.** En las cinco, el panel del titular es **claro**
y lo oscuro es la **fotografía**. El [[ADR-0007-lenguaje-visual|ADR-0007]] nació de un
error de método —sacarle el color a sus piezas e ignorar la forma— y esto va en la
dirección contraria a lo que esas piezas hacen.

Se hace igual, y las razones por las que el argumento cambió son dos:

1. **Ahora existe la fachada.** Su composición es panel claro + foto. Aquí la foto es
   el local, y sobre negro se lee como escaparate iluminado de noche — que es
   exactamente lo que el edificio es.
2. **El panel claro de sus piezas es un cartel, no una pantalla.** En papel, a un metro,
   el blanco no cansa. En un teléfono a plena luz el contraste de la entrada oscura es
   más alto, no más bajo.

**El argumento en contra, registrado:** un fondo oscuro **a plena luz del día** puede
leerse peor en pantallas malas con brillo bajo, y esta audiencia es exactamente esa.
No está medido en dispositivo real y no se puede afirmar lo contrario. Si alguien
comprueba que se lee peor en la calle, esto se revierte cambiando una palabra.

## Alcance

**Solo la entrada de la portada.** No las páginas de giro, no las demás secciones. Una
entrada oscura es un golpe; toda la página oscura es otra decisión y no está tomada.

## Dos cosas que rompió, y las cazó el validador

**1 · El titular escribía `--tinta` a pelo.** Sobre negro daba **1.92:1**. Ahora hereda
de la superficie: la sección ya declara la tinta que le toca y el primitivo no la
duplica.

**2 · No existía tinta secundaria por superficie.** El subtitular se quedaba en
`negro-600` sobre negro y desaparecía. Se añade `--tinta-suave`, que la sección resuelve
igual que hace con el oro: `negro-600` sobre claro, `negro-300` sobre oscuro (9.29:1).

Las dos son el mismo patrón: **un color escrito a pelo en un primitivo se rompe en
cuanto cambia la superficie.** Ya había pasado con `--oro-800` y con `--negro-500`.

## Lo que esto deja abierto

El campo claro **ya no está topado por el oro del titular**: el único que lo limita
ahora es el texto de cuerpo, `negro-600`, que aguanta hasta `#BAC4CC` con 4.90:1. Si el
resto de la página sigue pareciendo blanco, ese camino está libre y no necesita otro ADR.

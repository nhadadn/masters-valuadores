---
tipo: adr
id: ADR-0037
estado: ACEPTADA
fecha: 2026-09-15
decide: Nadir
enmienda: ADR-0033
implementa: Claude Code
---

# ADR-0037 · Una sola sección para las dos tiras

## Qué se pidió

> *«¿Cómo podremos [unificar] esta sección con la anterior? Me gustaría que pudiésemos
> unificar ambas secciones.»* — Nadir, señalando «SU PATIO Y SU EQUIPO».

## El problema no era que fueran dos: era que estaban desparejas

Medido en vivo antes de tocar nada:

| # | Alto | Registro | Etiqueta | h2 | Carrusel |
|---|---|---|---|---|---|
| 2 | **1187 px** | mármol | — | — | joyería · 9 tarjetas |
| 3 | 435 px | tenue | SU PATIO Y SU EQUIPO | Algo de lo que han tenido | patio · 6 |

La tira de joyería vivía en una sección **sin etiqueta y sin título** —contenido huérfano
de 1187 px— mientras la del patio tenía el armazón completo para seis fotos. Las dos
enseñan lo mismo: cosas que pasaron por su mostrador. Con andamios distintos.

## La dirección la decidió el ADR-0022, no yo

Lo obvio era subir el patio al mármol, junto a la joyería. **No se puede**, y está
escrito en el [[ADR-0022-reticula-de-fotos-reales|ADR-0022]]:

> *«Va en el campo oscuro, no en el mármol: el mármol es el registro de lujo del ADR-0020
> y estas son fotos de maquinaria en un patio de grava. Vestir una retroexcavadora de
> boutique contradice su propia marca.»*

Así que **baja la joyería**. Esto enmienda el [[ADR-0033-secuencia-de-joyeria|ADR-0033]],
que la había metido en la rejilla del mármol para rellenar 152 px de vacío. Funcionó para
eso; el problema era el otro.

## Cómo queda

Una sección en `tenue` con:

- **Etiqueta `PIEZAS Y EQUIPO`.** «SU PATIO Y SU EQUIPO» dejaba fuera la joyería.
- **El mismo `h2`: «Algo de lo que han tenido».** Ya era correcto para las dos —pasado,
  sin prometer que siga ahí— así que no se reescribe.
- **Un `h3` por tira**: «Relojería, joyería y monedas» y «Patio y equipo». Sin ellos,
  quince fotos seguidas de un cronógrafo y una retroexcavadora no dicen que son dos
  conjuntos.

| # | Antes | Después |
|---|---|---|
| 2 · mármol | 1187 px · sin título · 1 carrusel | **747 px** · su trabajo del ADR-0027: CTA, foto y monedas |
| 3 · tenue | 435 px · 1 carrusel | **920 px** · etiqueta, título, **2 carruseles** |

Alto total de la página: 4730 → **4774 px**. Los 44 px de más son los dos rótulos.

## Dos costos, dichos

**1 · La izquierda del mármol vuelve a estar airada.** La tira de joyería la llenaba
desde el ADR-0033; sin ella, en escritorio queda mármol con el botón «Llamar» apoyado en
el pie de la foto. Se acepta a cambio de que las dos tiras vivan juntas. Las áreas de
rejilla del 0033 se retiran porque existían solo para eso.

**2 · Los nueve puntos de la tira de joyería envuelven a dos renglones en un teléfono**
—siete y dos—. No es un fallo: es el piso táctil del [[ADR-0035-monedas-y-el-piso-tactil|ADR-0035]]
haciendo su trabajo. Nueve por 44 px son 396 contra los 350 de la caja, así que en un
renglón **no caben de ninguna manera**. La alternativa sería encogerlos, que es
exactamente lo que el 0035 prohibió.

## Lo medido

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| CA-10 | cumplido · 27.90 KB · sin cambio |
| Desbordamiento horizontal | **0 px** |
| Ids duplicados | **0** |
| Carrusel de joyería | 9 tarjetas · 9 puntos · **9 aciertan** · `#joya-0` |
| Carrusel del patio | 6 tarjetas · 6 puntos · **6 aciertan** · `#foto-0` |

Los dos carruseles siguen cableados correctamente tras el cambio de sitio: es el
emparejamiento por hermanos del ADR-0033, que no depende del orden del marcado.

## Lo que se vio de paso y NO se tocó

`[giro]/+page.svelte` arrastra tres selectores muertos que el build reporta en cada
vuelta: `.revision`, `.rev-et` y `.rev-lista`. Son del bloque de revisión que quitó el
[[ADR-0027-fuera-las-marcas-de-borrador|ADR-0027]]; su CSS se quedó. No es de este
cambio y limpiarlo es aparte.

## Evidencia

| Qué | Dónde |
|---|---|
| La sección unificada | `src/routes/[giro]/+page.svelte` |
| El rótulo de cada tira | `.tira-titulo` |
| Cómo queda | `capturas/unif-390.png` · `capturas/unif-1280.png` |

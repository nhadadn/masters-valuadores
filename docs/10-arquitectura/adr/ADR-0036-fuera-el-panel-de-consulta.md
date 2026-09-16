---
tipo: adr
id: ADR-0036
estado: ACEPTADA
fecha: 2026-09-15
decide: Nadir
revierte_parcialmente: ADR-0024
implementa: Claude Code
---

# ADR-0036 · Fuera el panel de consulta: había demasiado «contáctanos»

## Qué se pidió

> *«Quisiera remover esta parte, hay muchas secciones de "contáctanos".»* — Nadir,
> señalando el panel de carbón que decía «¿No sabes si aceptamos lo que traes?».

## Tenía razón, y por mucho

Se contó en vivo, a 390 px, sobre `/empeno-y-prestamo/`. **Catorce puntos de contacto en
una página.**

| | Cuántos | Dónde |
|---|---|---|
| WhatsApp | **9** | 6 discos del planeta · el panel de consulta · la barra fija · el pie |
| `tel:` | 3 | cabecera · pie · barra fija |
| a `/contacto/` | 2 | nav · el botón «Llamar» del mármol |

El matiz que cambia la decisión: **seis de los nueve son los discos del planeta**, y esos
no se leen como un bloque de contacto — son las categorías, y su destino de WhatsApp es
el diseño del [[ADR-0026-planeta-de-bienes|ADR-0026]]. Los que **sí** se leen como
«contáctanos» eran tres: este panel, la barra fija y el pie.

## Por qué sale éste y no otro

- **La barra fija no se toca.** Es el argumento con el que el
  [[ADR-0027-fuera-las-marcas-de-borrador|ADR-0027]] justificó bajar el botón de la
  entrada a 1241 px: *«la barra fija sigue en pantalla siempre, así que la página nunca
  se queda sin llamada a la acción»*. Quitarla invalidaría esa decisión.
- **El pie tampoco.** Es el ancla del sitio y lleva el NAP.
- **El panel era el tercero**, y el único de los tres que se puede quitar sin que la
  página pierda un canal: su WhatsApp ya está en la barra, permanentemente.

Esto **revierte en parte el [[ADR-0024-catalogo-visual-y-jerarquia|ADR-0024]]**, que lo
colocó ahí con un argumento bueno: *«va justo después del planeta, donde acaba de
nacerle la duda»*. El sitio sigue siendo bueno; lo que cambió es cuántos hermanos tenía.

## Lo que se pierde, y hay que decirlo

Era **el único sitio de la página que atendía a quien trae algo que NO está en las seis
categorías.** El planeta enumera —oro y joyería, relojes, monedas, herramienta, autos,
maquinaria—; el panel acogía el resto, y su mensaje de WhatsApp iba escrito para eso:
*«quiero saber si aceptan este artículo. Les mando una foto.»*

Quien llegue con algo fuera de esas seis ahora tiene que deducir que puede preguntar por
la barra fija, cuyo mensaje es genérico.

Si eso pesa más que la repetición, hay una vía intermedia que no reintroduce un bloque:
**dejar la frase como texto bajo el planeta, sin panel y sin botón.** No se hizo porque
no se pidió.

## Lo medido, antes y después

| | Antes | Después |
|---|---|---|
| Enlaces de WhatsApp | 9 | **8** |
| De ellos, discos del planeta | 6 | 6 |
| **Bloques de contacto de verdad** | **3** | **2** |
| `tel:` · a `/contacto/` | 3 · 2 | 3 · 2 · sin cambio |
| Alto de la página | 4937 px | **4730 px** · −207 |
| `.consulta` en el DOM | 1 | **0** |

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| CA-10 | cumplido · 27.90 KB · sin cambio |
| Desbordamiento horizontal | **0 px** |

## Lo que se fue con él

Tres cosas, porque un bloque que sale y deja restos es peor que no haberlo quitado:

1. **Su CSS** — `.consulta`, `.consulta .titulo`, `.consulta .dice`. Si se quedaba,
   aparecía como selector muerto en el build.
2. **El `import BotonWhatsApp`** de esta plantilla, que se quedó huérfano: era su último
   uso en la página desde que el [[ADR-0033-secuencia-de-joyeria|ADR-0033]] quitó el
   tercer WhatsApp. El componente sigue vivo en la portada, el pie y `/contacto/`.
3. **Un comentario que mentía.** Uno de `.casilla` decía *«la de arriba, junto a
   `.consulta`, es la que manda»* y apuntaba a una regla que ya no existe.

## Evidencia

| Qué | Dónde |
|---|---|
| Dónde estaba, y el recuento | `src/routes/[giro]/+page.svelte` · comentario del ADR-0036 |
| Cómo queda la costura | `capturas/costura-390.png` |

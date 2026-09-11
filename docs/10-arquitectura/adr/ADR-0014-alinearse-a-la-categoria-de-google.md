---
tipo: adr
id: ADR-0014
estado: ACEPTADA
fecha: 2026-09-11
decide: Nadir
enmienda: ADR-0008-alcance-de-cuatro-giros
implementa: Claude Code
cierra: D-02 (provisionalmente)
abre: D-18
---

# ADR-0014 · El sitio se alinea con la categoría que Google ya les puso

## El hallazgo

La ficha de Google de Masters —[[ficha-de-google]]— los clasifica como **`Bazar`**.

El [[ADR-0008-alcance-de-cuatro-giros|ADR-0008]] sacó bazar del sitio el 10 de
septiembre, y **dejó escrita su propia advertencia**:

> «Cristóbal había declarado que su objetivo es **salir en el mapa de Google al buscar
> giros como "bazar" y "joyería"**. […] Sacar joyería y bazar suelta exactamente lo que
> él pidió posicionar.»

Veinticuatro horas después llegó el dato que confirma esa advertencia: no es que bazar
fuera una aspiración suya, es que **Google ya los tiene ahí**, y la única reseña que
tienen —4,0, hace cuatro meses— llegó por esa puerta.

## Qué se decide

Decisión de Nadir el 11 de septiembre, elegida sobre dos alternativas y sabiendo que
era «el camino más caro»:

**1 · El `@type` del `LocalBusiness` se alinea con lo que Google dice.**

`tipoLocalBusiness` pasa de `__POR_CONFIRMAR__` a **`Store`**.

schema.org **no tiene un tipo «Bazaar»**. Sus subtipos de `Store` son concretos
—`JewelryStore`, `HardwareStore`, `PawnShop`…— y ninguno traduce «bazar». `Store` es el
equivalente honesto: genérico, cierto, y no contradice ninguno de los cuatro giros.

Se descartó `PawnShop`, que era más específico y mejor para búsqueda, por la razón
exacta de esta decisión: **habría dicho lo contrario de lo que dice su ficha**, y el
problema que se está resolviendo es que el sitio y la ficha le cuentan a Google dos
negocios distintos.

**2 · Bazar vuelve al tablero como pregunta, no como página.**

Entra en `giros.ts` con `estado: 'bloqueado'` y `bloqueadoPor: 'D-18'`. Aparece en la
portada como decisión visible —«lo que falta decidir se ve, no se esconde», que es la
regla que ya seguían importaciones y avalúos— y **no genera ruta**.

Reabrir la pregunta no es publicar una página. Nadie sabe todavía qué vende ese bazar,
y una página de giro sin saber qué recibe es justo lo que el contrato prohíbe.

## Lo que esto cuesta

- **Enmienda un ADR de ayer.** El ADR-0008 tiene un día. Ir y venir tiene un costo de
  credibilidad interna, y hay que decirlo en vez de presentarlo como evolución natural.
- **`Store` es más pobre que `PawnShop` para búsqueda.** Un tipo genérico le dice menos
  a Google que uno específico. Se acepta a cambio de coherencia.
- **Queda a medias a propósito.** El sitio dice «tienda» mientras sus cuatro páginas
  hablan de empeño, maquinaria, fletes y taller. Esa tensión no se resuelve aquí: se
  resuelve cuando Cristóbal reclame la ficha (D-17) y decida con qué categoría se queda.

## Lo que NO se decide

- **Joyería sigue fuera.** El ADR-0008 la sacó junto con bazar y Cristóbal la había
  pedido igual. Esta decisión trató solo bazar, que es lo que la ficha dice. Joyería
  queda como pregunta adyacente, sin acción.
- **D-15 sigue huérfana.** «Compramos monedas» perdió su casa cuando salió joyería y
  no la recupera aquí.
- **La categoría definitiva.** Sale de la Etapa 1 y de lo que Cristóbal ponga en Google
  al reclamar. Esto alinea el sitio con el presente, no fija el futuro.

## Evidencia

| Qué | Dónde |
|---|---|
| `tipoLocalBusiness: 'Store'` | `src/lib/config/negocio.ts:87` |
| Bazar bloqueado por D-18 | `src/lib/datos/giros.ts:102` |
| Sigue sin generar ruta | `src/lib/seo/jsonld.test.ts:62` · 3 bloqueados, 0 en `department` |
| El grafo bajó de 7 marcas a 6 | `npm run build:revision` |

El test que afirmaba `@type[1] === POR_CONFIRMAR` se reescribió: **afirmaba que la
decisión siguiera sin tomarse**, que no es un criterio sino una foto del estado del
proyecto. Ahora sostiene la forma —que sea un tipo de schema.org en PascalCase— y caza
que alguien escriba «Bazar» ahí, que es la categoría de Google y no un tipo válido.

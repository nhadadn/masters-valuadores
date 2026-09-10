---
tipo: tablero
estado: vigente
actualizado: 2026-09-10 (tarde · llegaron cinco publicaciones del cliente)
---

# Tablero de decisiones pendientes

Cada renglón es un `__POR_CONFIRMAR__` vivo. Nada se decide desde el lado técnico.
Cuando una se cierra: nace un [[10-arquitectura/adr/README|ADR]] y se marca aquí.

## Bloquean la arquitectura

| # | Decisión | Qué destraba | Quién decide |
|---|---|---|---|
| D-01 | Nombre legal: `Master` vs `Masters` | `Organization.legalName`, `name`, títulos, dominio | Cristóbal |

**D-01 se agravó el 10 de septiembre.** Su correo publicado es
`mastervaluadores@outlook.com` — **sin S** — mientras el lockup dice `MASTERS` y piezas
anteriores dicen `MÁSTER`. Son tres grafías vivas. La pregunta ya no es «¿cómo se
llama?» sino **dos preguntas**: ¿cuál es la razón social del acta, y cuál quiere que se
lea en el sitio? Evidencia en [[datos-de-las-publicaciones]].
| D-04 | ¿`/importaciones/` es una segunda entidad legal? | Si son dos `Organization` o un `department` | Cristóbal + contador |

| D-03 | ¿Existe el servicio de avalúos periciales? ¿Va la ruta `/valuacion/`? | Una ruta y un `Service` en el grafo | Cristóbal |

**D-05 quedó cerrada el 9 de septiembre**: multigiro. Ver [[ADR-0003-alcance-multigiro]].
Las tres que quedan arriba siguen abiertas y ahora pesan más, porque con ocho
páginas cada dato equivocado se repite ocho veces.

## Bloquean el SEO local

| # | Decisión | Qué destraba | Quién decide |
|---|---|---|---|
| D-02 | Categoría primaria de Google | La ficha completa y el `@type` del `LocalBusiness` | Sale de Etapa 1 |
| D-08 | NAP exacto: **la dirección tiene conflicto, ver abajo** | `address`, `telephone`, `openingHours` | Cristóbal |
| D-09 | ¿Hay más de una sucursal? **Ahora es urgente**, ver abajo | Si el grafo lleva una o varias `LocalBusiness` | Cristóbal |
| D-10 | URLs exactas de Instagram y Facebook | `sameAs` | Cristóbal |
| D-11 | Coordenadas del local (`geo`) | `latitude` / `longitude` | Verificable en Maps al cerrar D-08 |

### El teléfono ya casi no está pendiente

**871 507 3005**, idéntico en las cinco publicaciones, en cinco giros distintos. Es el
dato más firme del proyecto sin que el cliente escriba nada. Se confirma por escrito
antes de entrar a `negocio.ts` — un número mal puesto es tráfico que se pierde sin que
nadie se entere — pero ya no es una incógnita.

### La dirección sí es una incógnita, y ahora se sabe por qué

En sus piezas aparecen dos formas: **«Lerdo 97, Col. Laguna Sur, 27110 Torreón»** y
**«Libramiento Periférico Raúl López Sánchez casi esquina con El Tajito»**. La pieza de
joyería las junta en un renglón, lo que **sugiere** un solo domicilio descrito de dos
maneras. Sugerir no es saber.

Decide si el grafo lleva **una `LocalBusiness` o varias**, y una ficha de Google mal
armada por esto cuesta posicionamiento real. Pregunta exacta:

> ¿Es un solo domicilio o son dos? Si es uno, ¿cuál es la forma completa y correcta
> para Google? Si son dos, ¿cuál atiende cada giro?

## Bloquean el frontend

| # | Decisión | Qué destraba | Quién decide |
|---|---|---|---|
| D-06 | **Archivo del logo** (vectorial de preferencia) | La paleta acero + ámbar y la elección de tipografía | Cristóbal |
| D-07 | Dominio y hospedaje | Canónicas, `WebSite.url`, despliegue | Cristóbal (la propuesta lo deja a su cargo) |
| D-12 | Herramienta de medición de contactos | Presupuesto de 40 KB de JS inicial | Nadir |
| D-13 | ¿A dónde llegan los envíos del formulario de valuación? | Si el formulario existe. Un sitio estático no procesa envíos solo | Nadir + Cristóbal |
| D-14 | **El acento**: el ADR-0006 propone revertir a `#E7C041` porque las cinco publicaciones vivas lo desmintieron | Cierra la paleta. Ver [[ADR-0006-el-amarillo-vive]] | Nadir, y luego Cristóbal |
| D-15 | **«Compramos monedas»**: giro que no estaba en los ocho ni en el mapa | Si lleva página, sección o mención | Cristóbal |
| D-16 | **Alcance real de cada giro**: Canadá en importaciones, herramienta ligera en renta, ¿avalúos periciales o solo valuación? | Las frases de cada tarjeta y la ruta `/valuacion/` (D-03) | Cristóbal |

D-06 es la más barata de cerrar y destraba dos criterios de [[SPEC-0001-armazon-fase-0]]
sin depender de la Etapa 1.

**D-14 dio la vuelta el mismo día.** Por la mañana Nadir eligió la dirección B
(`#B58000`) y el sistema se rebaseó. Por la tarde llegaron cinco publicaciones vivas del
cliente —incluidas una de joyería y una de monedas, los dos giros donde yo había dicho
que el amarillo restaba— y **las cinco usan el amarillo plano**. La premisa que sostenía
el cambio era falsa. Ver [[ADR-0006-el-amarillo-vive]] y la hoja *Evidencia* del lienzo
de paletas.

**D-15, sobre monedas:** Nadir decidió el 10 de septiembre tratarlo como parte de
joyería, como decisión de trabajo. Sigue abierta con Cristóbal, porque es una suposición
sobre cómo organiza él su negocio, no un dato.

## Cerradas

| # | Decisión | Resuelta | Dónde quedó |
|---|---|---|---|
| D-05 | Alcance: multigiro bajo la marca MÁSTER | 2026-09-09 · Cristóbal | [[ADR-0003-alcance-multigiro]] |

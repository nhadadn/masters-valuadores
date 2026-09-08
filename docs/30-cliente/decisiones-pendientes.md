---
tipo: tablero
estado: vigente
actualizado: 2026-09-08
---

# Tablero de decisiones pendientes

Cada renglón es un `__POR_CONFIRMAR__` vivo. Nada se decide desde el lado técnico.
Cuando una se cierra: nace un [[10-arquitectura/adr/README|ADR]] y se marca aquí.

## Bloquean la arquitectura

| # | Decisión | Qué destraba | Quién decide |
|---|---|---|---|
| D-01 | Nombre legal: `Master` vs `Masters` | `Organization.legalName`, `name`, títulos, dominio | Cristóbal |
| D-04 | ¿`/importaciones/` es una segunda entidad legal? | Si son dos `Organization` o un `department` | Cristóbal + contador |
| D-05 | ¿Landing única de empeño, o arquitectura multigiro de 8 giros? | Todo el mapa de páginas y la existencia de `department` | Nadir + Cristóbal |
| D-03 | ¿Existe el servicio de avalúos periciales? ¿Va la ruta `/valuacion/`? | Una ruta y un `Service` en el grafo | Cristóbal |

D-05 es la de mayor costo. La propuesta firmada (pág. 4) describe una cosa; la
ficha del proyecto describe otra. Ver §1 de [[masters-valuadores-arquitectura-multigiro]].

## Bloquean el SEO local

| # | Decisión | Qué destraba | Quién decide |
|---|---|---|---|
| D-02 | Categoría primaria de Google | La ficha completa y el `@type` del `LocalBusiness` | Sale de Etapa 1 |
| D-08 | NAP exacto: razón social visible, calle y número, CP, teléfono, WhatsApp, horarios | `address`, `telephone`, `openingHours` | Cristóbal |
| D-09 | ¿Hay más de una sucursal? | Si el grafo lleva una o varias `LocalBusiness` | Cristóbal |
| D-10 | URLs exactas de Instagram y Facebook | `sameAs` | Cristóbal |
| D-11 | Coordenadas del local (`geo`) | `latitude` / `longitude` | Verificable en Maps al cerrar D-08 |

## Bloquean el frontend

| # | Decisión | Qué destraba | Quién decide |
|---|---|---|---|
| D-06 | **Archivo del logo** (vectorial de preferencia) | La paleta acero + ámbar y la elección de tipografía | Cristóbal |
| D-07 | Dominio y hospedaje | Canónicas, `WebSite.url`, despliegue | Cristóbal (la propuesta lo deja a su cargo) |
| D-12 | Herramienta de medición de contactos | Presupuesto de 40 KB de JS inicial | Nadir |
| D-13 | ¿A dónde llegan los envíos del formulario de valuación? | Si el formulario existe. Un sitio estático no procesa envíos solo | Nadir + Cristóbal |

D-06 es la más barata de cerrar y destraba dos criterios de [[SPEC-0001-armazon-fase-0]]
sin depender de la Etapa 1.

## Cerradas

Ninguna.

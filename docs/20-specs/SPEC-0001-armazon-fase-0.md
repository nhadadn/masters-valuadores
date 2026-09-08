---
tipo: spec
id: SPEC-0001
estado: BLOQUEADA
c4: [C4-L3-componentes-web]
depende_de: [masters-valuadores-arquitectura-multigiro]
actualizado: 2026-09-08
---

# SPEC-0001 · Armazón Fase 0

## Objetivo

Levantar la infraestructura del sitio: tokens, primitivos, layout, rutas y
módulo JSON-LD. **No** construye el mensaje: cero copy, cero imágenes, cero cifras.

## Por qué está BLOQUEADA

Depende de las §3 y §4 de [[masters-valuadores-arquitectura-multigiro]], que
están vacías porque la Etapa 1 no se ha ejecutado.

Parte de esta spec **sí** es implementable sin ese documento. Se separa abajo
para no bloquear trabajo que no depende de nada.

## Criterios de aceptación

| # | Criterio | Depende de §3/§4 | Estado | Evidencia |
|---|---|---|---|---|
| CA-01 | Cada ruta del mapa de páginas renderiza `[PENDIENTE: contenido no aprobado]` visible | **Sí** | BLOQUEADO | — |
| CA-02 | Existe `tokens.css` con color, tipografía, espaciado y radios como custom properties | Parcial (color, del logo) | NO INICIADO | — |
| CA-03 | Existen los 6 primitivos, sin librería de UI externa | No | NO INICIADO | — |
| CA-04 | `jsonld.ts` emite `Organization` + `LocalBusiness` (`@type` array) + `WebSite` en un `@graph` | No (la forma) | NO INICIADO | — |
| CA-05 | La lista de `department` sale de `business.ts` y refleja §3 | **Sí** | BLOQUEADO | — |
| CA-06 | Ningún dato de negocio aparece fuera de `business.ts` | No | NO INICIADO | — |
| CA-07 | Layout responsive mobile-first, con foco visible y objetivos táctiles ≥ 44 px | No | NO INICIADO | — |
| CA-08 | El build de producción **falla** si el `@graph` emite `__POR_CONFIRMAR__` | No | NO INICIADO | — |
| CA-09 | Fuentes autoalojadas y subset. Cero peticiones a Google Fonts | Parcial (cuál fuente) | NO INICIADO | — |
| CA-10 | JS inicial < 40 KB gzip, medido en build | No | NO INICIADO | — |

## Lo que NO hace esta spec

Prohibido explícitamente, se marca `__POR_CONFIRMAR__` y se sigue:

- Categoría primaria de Google · nombre legal `Master` vs `Masters` · existencia
  del servicio de avalúos periciales y de la ruta `/valuacion/` · si
  `/importaciones/` es una segunda entidad legal.
- Cualquier copy, titular, propuesta de valor o testimonio.
- Cualquier imagen. Solo bloques grises con relación de aspecto y etiqueta.
- Cualquier cifra, precio, tasa, plazo, horario o reseña.

## Ruta para desbloquear

1. Ejecutar la Etapa 1 → llena §3 y §4.
2. Con eso, CA-01 y CA-05 dejan de estar bloqueados.
3. CA-02 y CA-09 se destraban con el archivo del logo, sin necesidad de Etapa 1.
4. El resto es implementable hoy, en cuanto se apruebe la estructura de carpetas.

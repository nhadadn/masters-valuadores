---
tipo: fuente-de-verdad
estado: VACÍO — bloqueado por Etapa 1
version: 0.0.0
actualizado: 2026-09-08
---

# Arquitectura multigiro · Masters Valuadores

> [!danger] Este documento está vacío a propósito
> Es la **fuente de verdad** del proyecto. Su contenido es el entregable de la
> **Etapa 1 · Data Intelligence**, que a la fecha **no se ha ejecutado**.
>
> Ninguna ruta, ningún `department` del `@graph` y ninguna decisión de
> arquitectura puede escribirse hasta que las §3 y §4 de este documento estén
> llenas y aprobadas. Rellenarlas sin el estudio es construir a ciegas — que es
> exactamente lo que la propuesta firmada vende no hacer.

## §1 · Alcance

`__POR_CONFIRMAR__`

Tensión abierta a resolver aquí — ver [[decisiones-pendientes|D-05]]:

- La **propuesta firmada** (28 jul 2026, pág. 4) describe una landing de una sola
  página con 8 secciones, centrada en empeño y préstamo.
- La **ficha del proyecto** describe 8 giros bajo la marca MÁSTER: valuadores,
  financiera, importaciones, taller y refaccionaria, fletes y logística, bazar,
  joyería, renta de maquinaria y equipo.

No son lo mismo. De cuál gane depende si el `@graph` lleva `department` o no.

## §2 · Entidad y marca

`__POR_CONFIRMAR__` — ver [[decisiones-pendientes|D-01]] y [[decisiones-pendientes|D-04]].

## §3 · Mapa de páginas

`__POR_CONFIRMAR__`

Detalle en [[mapa-de-paginas]]. Mientras esta sección esté vacía, el sitio tiene
**una sola ruta** (`/`) con placeholder.

## §4 · Grafo JSON-LD

`__POR_CONFIRMAR__`

Forma acordada: `Organization` + `LocalBusiness` (`@type` como array) + `WebSite`,
con `department`. La **lista** de departments sale de §3. Detalle en [[jsonld-graph]].

## §5 · Presupuesto técnico

Definido fuera de Etapa 1, no bloqueado:

| Métrica | Objetivo |
|---|---|
| LCP (4G simulada) | < 2.0 s |
| CLS | < 0.1 |
| JS inicial | < 40 KB gzip |
| Accesibilidad | WCAG 2.1 AA |
| Objetivo táctil mínimo | 44 × 44 px |

Justificación del piso de accesibilidad: la audiencia llega en urgencia
financiera, muchas veces con teléfono de gama baja y a plena luz del día.

## §6 · Bitácora

| Fecha | Cambio |
|---|---|
| 2026-09-08 | Documento creado vacío. Etapa 1 no ejecutada. |

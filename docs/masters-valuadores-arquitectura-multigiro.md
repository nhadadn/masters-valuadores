---
tipo: fuente-de-verdad
estado: PARCIAL — §1 resuelta, §3 y §4 esperan Etapa 1
version: 0.1.0
actualizado: 2026-09-09
---

# Arquitectura multigiro · Masters Valuadores

> [!warning] Parcialmente lleno
> El **alcance** ya está decidido (§1, ADR-0003). Lo que sigue faltando es lo que
> entrega la **Etapa 1 · Data Intelligence**, que a la fecha **no se ha ejecutado**:
> el orden de prioridad de los giros, los términos de búsqueda por giro y la
> categoría primaria de Google.
>
> Se pueden construir las rutas. No se puede abrir la ficha de Google todavía.

## §1 · Alcance

**RESUELTO** — Cristóbal eligió la Ruta B el 9 de septiembre de 2026.
Ver [[ADR-0003-alcance-multigiro]].

El sitio es **multigiro bajo la marca MÁSTER**: una portada que reparte y una
página propia por cada giro.

| Giro | Estado |
|---|---|
| Empeño y préstamo | Confirmado · es el que trae la urgencia |
| Joyería | Confirmado |
| Bazar | Confirmado |
| Taller y refaccionaria | Confirmado |
| Fletes y logística | Confirmado |
| Renta de maquinaria y equipo | Confirmado |
| Financiera | Confirmado |
| Importaciones | Confirmado como giro · `__POR_CONFIRMAR__` si es otra entidad legal (D-04) |
| Avalúos periciales | `__POR_CONFIRMAR__` si el servicio existe (D-03) |

Sigue sin decidirse el **orden de prioridad** de los giros y la **categoría
primaria de Google**: ambos salen de la Etapa 1.

## §2 · Entidad y marca

`__POR_CONFIRMAR__` — ver [[decisiones-pendientes|D-01]] y [[decisiones-pendientes|D-04]].

## §3 · Mapa de páginas

**PARCIAL.** La estructura quedó decidida por [[ADR-0003-alcance-multigiro]]:
portada más una página por giro. Falta el **orden de prioridad** y los **slugs**,
que dependen de qué término busca la gente — eso es Etapa 1.

Detalle y plantilla de llenado en [[mapa-de-paginas]].

## §4 · Grafo JSON-LD

**PARCIAL.** La forma estaba acordada y ahora la lista de `department` también:
uno por giro de la §1. Sigue pendiente el `@type` secundario del `LocalBusiness`,
que es la categoría primaria de Google (D-02, Etapa 1).

Detalle en [[jsonld-graph]].

## §5 · Presupuesto técnico

Definido fuera de Etapa 1, no bloqueado:

| Métrica | Objetivo |
|---|---|
| LCP (4G simulada) | < 2.0 s |
| CLS | < 0.1 |
| INP | < 200 ms |
| JS inicial | < 40 KB gzip |
| Accesibilidad | WCAG 2.1 AA |
| Objetivo táctil mínimo | 44 × 44 px |

> [!note] INP añadido el 2026-09-08
> El prompt original de la Fase 0 pedía LCP y CLS, no INP. INP reemplazó a FID
> como Core Web Vital en 2024 y su umbral "bueno" es 200 ms al percentil 75.
> Un sitio que cumple LCP y CLS pero no INP no cumple Core Web Vitals.
> Fuente: web.dev/articles/vitals.

Justificación del piso de accesibilidad: la audiencia llega en urgencia
financiera, muchas veces con teléfono de gama baja y a plena luz del día.

## §6 · Bitácora

| Fecha | Cambio |
|---|---|
| 2026-09-08 | Documento creado vacío. Etapa 1 no ejecutada. |
| 2026-09-09 | §1 resuelta: multigiro (ADR-0003). §3 y §4 pasan de vacías a parciales. |

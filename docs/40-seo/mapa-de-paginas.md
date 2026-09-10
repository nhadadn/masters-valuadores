---
tipo: seo
corresponde_a: "§3 de masters-valuadores-arquitectura-multigiro"
estado: PARCIAL — estructura decidida, prioridad y slugs pendientes
actualizado: 2026-09-09
---

# §3 · Mapa de páginas

La **estructura** está decidida: multigiro, portada más una página por giro
([[ADR-0003-alcance-multigiro]]). Lo que falta es el **orden de prioridad** y los
**slugs**, porque dependen de qué término busca la gente en Torreón — y eso lo
entrega la Etapa 1, no la intuición.

## Rutas

| # | Página | Slug | Prioridad | `department` | Estado |
|---|---|---|---|---|---|
| 1 | Portada · repartidor | `/` | 1 | — | Construible |
| 2 | Empeño y préstamo | `__POR_CONFIRMAR__` | `__POR_CONFIRMAR__` | Sí | Construible |
| 3 | Joyería | `__POR_CONFIRMAR__` | `__POR_CONFIRMAR__` | Sí | Construible |
| 4 | Bazar | `__POR_CONFIRMAR__` | `__POR_CONFIRMAR__` | Sí | Construible |
| 5 | Taller y refaccionaria | `__POR_CONFIRMAR__` | `__POR_CONFIRMAR__` | Sí | Construible |
| 6 | Fletes y logística | `__POR_CONFIRMAR__` | `__POR_CONFIRMAR__` | Sí | Construible |
| 7 | Renta de maquinaria y equipo | `__POR_CONFIRMAR__` | `__POR_CONFIRMAR__` | Sí | Construible |
| 8 | Financiera | `__POR_CONFIRMAR__` | `__POR_CONFIRMAR__` | Sí | Construible |
| 9 | Importaciones | `__POR_CONFIRMAR__` | `__POR_CONFIRMAR__` | Depende de D-04 | **Bloqueada** |
| 10 | Avalúos periciales | `__POR_CONFIRMAR__` | `__POR_CONFIRMAR__` | Depende de D-03 | **Bloqueada** |

Más las de servicio: contacto, aviso de privacidad y términos.

## Por qué los slugs no se inventan

El slug es la promesa que el sitio le hace a Google sobre qué contiene la página.
Elegirlo antes de saber qué se busca —`/joyeria/` contra `/compra-de-oro/`, por
decir— es apostar el posicionamiento de esa página a una corazonada. Se llenan
con los datos de la Etapa 1 y no antes.

## Regla de publicación

Un giro sin contenido real arrastra a los demás hacia abajo. Se publica por fases:
una página entra al sitio cuando tiene sus fotos, sus requisitos y su texto
aprobados — no antes.

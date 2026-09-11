---
tipo: seo
corresponde_a: "§3 de masters-valuadores-arquitectura-multigiro"
estado: PARCIAL — alcance reducido a cuatro giros (ADR-0008); prioridad y slugs pendientes
actualizado: 2026-09-10
---

# §3 · Mapa de páginas

La **estructura** está decidida: multigiro, portada más una página por giro
([[ADR-0003-alcance-multigiro]]). Lo que falta es el **orden de prioridad** y los
**slugs**, porque dependen de qué término busca la gente en Torreón — y eso lo
entrega la Etapa 1, no la intuición.

## Rutas

| # | Página | Slug provisional | Prioridad | `department` | Estado |
|---|---|---|---|---|---|
| 1 | Portada · repartidor | `/` | 1 | — | Construible |
| 2 | Empeño y préstamo | `empeno-y-prestamo` | `__POR_CONFIRMAR__` | Sí | Construible |
| 3 | Compra venta de maquinaria | `compra-venta-de-maquinaria` | `__POR_CONFIRMAR__` | Sí | Construible |
| 4 | Fletes y logística | `fletes-y-logistica` | `__POR_CONFIRMAR__` | Sí | Construible |
| 5 | Taller y refaccionaria | `taller-y-refaccionaria` | `__POR_CONFIRMAR__` | Sí | Construible |
| — | Importaciones | — | — | Depende de D-04 | **Bloqueada** |
| — | Avalúos periciales | — | — | Depende de D-03 | **Bloqueada** |

**Los slugs siguen siendo provisionales.** Están escritos porque las rutas tienen que
existir para construir, no porque estén decididos: el definitivo sale del estudio de
búsqueda. Renombrar antes de publicar no cuesta nada; después sí.

## Lo que salió el 10 de septiembre · ADR-0008

Joyería, bazar y financiera **salieron del sitio**, y *Renta de maquinaria y equipo*
fue **sustituida** por *Compra venta de maquinaria* — no renombrada: es otro negocio.

El sitio pasa de **11 páginas a 8**. Queda registrado que joyería y bazar eran los dos
giros que el propio cliente había pedido posicionar en Google Maps, y que esa fue la
razón de elegir multigiro en el [[ADR-0003-alcance-multigiro]]. Ver el costo completo
en [[ADR-0008-alcance-de-cuatro-giros]].

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

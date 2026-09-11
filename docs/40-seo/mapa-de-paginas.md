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

## Indexación · añadido el 11 de septiembre · SPEC-0003

Las ocho rutas tienen ahora título, descripción y tarjeta de enlace propios, y el sitio
emite `sitemap.xml` y `robots.txt`. Cuál entra al índice y cuál no:

| Ruta | ¿Al índice? | ¿Al sitemap? | Por qué |
|---|---|---|---|
| `/` | Sí | Sí | |
| `/empeno-y-prestamo/` | Sí | Sí | |
| `/compra-venta-de-maquinaria/` | Sí | Sí | |
| `/fletes-y-logistica/` | Sí | Sí | |
| `/taller-y-refaccionaria/` | Sí | Sí | |
| `/contacto/` | Sí | Sí | |
| `/aviso-de-privacidad/` | **No** · `noindex, follow` | No | No responde a ninguna búsqueda y diluye el poco peso que un sitio nuevo reparte |
| `/terminos/` | **No** · `noindex, follow` | No | Lo mismo |

**Pero hoy no se indexa ninguna.** Mientras D-07 —el dominio— siga abierta, las ocho
salen `noindex, nofollow`, `robots.txt` responde `Disallow: /` y el sitemap sale vacío.
No hay canónica que proteja una URL provisional, y un borrador indexado compite después
contra el dominio bueno. Se abre solo al escribir el dominio en `negocio.ts`. Ver
[[ADR-0013-sin-dominio-no-se-indexa]].

### La lista de rutas ya no se escribe a mano

Vive en `src/lib/seo/enlaces.ts` y la consumen el `<head>`, el sitemap y el validador de
accesibilidad. Un test la compara contra el disco: si aparece una ruta que no está
registrada, o se registra una que no existe, `npm test` falla. Esta tabla es
documentación de esa fuente, no una segunda copia de ella.

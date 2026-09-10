---
tipo: spec
id: SPEC-0001
estado: APROBADA E IMPLEMENTADA
aprobada: 2026-09-10 por Nadir
c4: [C4-L3-componentes-web]
depende_de: [masters-valuadores-arquitectura-multigiro]
actualizado: 2026-09-10
---

# SPEC-0001 · Armazón Fase 0

## Objetivo

Levantar la infraestructura del sitio: tokens, primitivos, layout, rutas y módulo
JSON-LD. **No** construye el mensaje: cero copy, cero imágenes, cero cifras.

## Estado

**APROBADA el 10 de septiembre e IMPLEMENTADA el mismo día.** Los diez criterios
están cumplidos con evidencia de grado A (test que corre) o B (código de producción).

Lo que sigue esperando a la Etapa 1 son los **slugs definitivos** y la **categoría
primaria de Google**. Ninguno de los dos bloquea el armazón: los slugs actuales están
marcados como provisionales en el propio código y renombrar una ruta antes de publicar
no cuesta nada.

## Criterios de aceptación — verificados

| # | Criterio | Estado | Evidencia |
|---|---|---|---|
| CA-01 | Cada ruta renderiza `[PENDIENTE: contenido no aprobado]` visible | **IMPLEMENTADO** | `src/lib/componentes/Hueco.svelte:26` · 11 páginas prerenderizadas, entre 6 y 21 marcas cada una · `herramientas/validar-a11y.mjs` |
| CA-02 | `tokens.css` con color, tipografía, espaciado y radios | **IMPLEMENTADO** | `src/lib/estilos/tokens.css` · 98 líneas, cada valor con su procedencia y su ratio calculado |
| CA-03 | Los 6 primitivos, Breadcrumb incluido, sin librería de UI | **IMPLEMENTADO** | `src/lib/componentes/` · 10 archivos. Migas en `Migas.svelte:37`. Cero dependencias de UI |
| CA-04 | `@graph` con Organization + LocalBusiness (`@type` array) + WebSite | **IMPLEMENTADO** | `src/lib/seo/jsonld.ts:112` · probado en `jsonld.test.ts` (3 tests) |
| CA-05 | La lista de `department` sale de los datos y refleja §3 | **IMPLEMENTADO** | `src/lib/seo/jsonld.ts:121` · 7 departments, los 2 bloqueados excluidos · probado (3 tests) |
| CA-06 | Ningún dato de negocio fuera de la fuente única | **IMPLEMENTADO** | `tests/sin-fugas.test.ts` · 19 tests sobre 18 archivos, 7 patrones de fuga |
| CA-07 | Layout responsive, foco visible, objetivos táctiles ≥ 44 px | **IMPLEMENTADO** | `src/lib/estilos/base.css:30` · `herramientas/validar-a11y.mjs`: **22 de 22** combinaciones página × ancho CUMPLEN, táctil mínimo 44 px, contraste mínimo 4.94:1 |
| CA-08 | El build de producción **falla** si el grafo emite `__POR_CONFIRMAR__` | **IMPLEMENTADO** | `src/lib/seo/jsonld.ts:135` · `npm run build` sale con **código 1** y nombra las 16 marcas vivas |
| CA-09 | Fuentes autoalojadas y subset. Cero Google Fonts | **IMPLEMENTADO** | `src/lib/estilos/fuentes.css` · `static/fuentes/` · 42 KB, con respaldo calibrado |
| CA-10 | JS inicial < 40 KB gzip, medido en build | **IMPLEMENTADO** | `herramientas/presupuesto.mjs` · **0 KB en las 11 páginas** |

## Las tres decisiones que se tomaron al implementar

**1 · Una sola ruta `[giro]`, no siete archivos.** El dibujo demostró que las siete
páginas de giro son la misma plantilla. `entries()` las prerenderiza igual como HTML
estático, pero hay un solo archivo que mantener. `src/routes/[giro]/+page.ts:14`.

**2 · CA-08 no es un test, es el build.** El grafo se arma durante el prerender, así
que la excepción revienta la publicación. No es una prueba que alguien pueda olvidar
correr. Existe una escotilla explícita —`VITE_PENDIENTES_OK=1`— que avisa a gritos en
consola y que el despliegue nunca pone; sin ella no se podría medir nada hasta que el
cliente entregue todos sus datos.

**3 · Cero JavaScript en el cliente.** Medido: el runtime de Svelte 5 más el enrutador
pesan **46 KB gzip por página**, contra un presupuesto de 40. La salida no fue subir el
presupuesto: fue preguntarse qué necesita JavaScript en este sitio, y la respuesta fue
nada. El único componente que parecía necesitarlo —el acordeón— se resuelve con
`<details>` nativo, que además llega accesible de fábrica. Ver la nota larga en
`src/routes/+layout.ts:28`.

Costo asumido: cada navegación es una carga completa. Con páginas de 2.5 a 4 Kb
comprimidas, es más barato que hidratar. Si algún día una pantalla necesita interacción
real, se le pone `csr = true` a esa ruta y solo esa paga el runtime.

## Lo que NO hace esta spec

Sigue prohibido, se marca y se sigue:

- Categoría primaria de Google (D-02) · nombre legal (D-01) · si `/importaciones/` es
  una segunda entidad legal (D-04) · si existe el servicio de avalúos (D-03).
- Cualquier copy, titular, propuesta de valor o testimonio.
- Cualquier imagen. Solo bloques con relación de aspecto y etiqueta.
- Cualquier cifra, precio, tasa, plazo, horario o reseña.

## Lo que falta para publicar

El armazón está de pie. Lo que impide publicar no es técnico:

1. **NAP por escrito** (D-08) — cierra 12 de las 16 marcas del grafo de un solo golpe.
2. **Nombre legal** (D-01) y **dominio** (D-07).
3. **Categoría primaria de Google** (D-02) — sale de la Etapa 1 y es el `@type[1]`.
4. **Copy y fotos** — el sitio construye, pero no dice nada todavía.
5. **Destino del formulario** (D-13) — hasta entonces la sección va bloqueada a la vista.

Mientras cualquiera de las de arriba siga abierta, `npm run build` sale con código 1.
Es a propósito.

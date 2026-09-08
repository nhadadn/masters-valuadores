---
tipo: c4
nivel: L3
estado: BORRADOR — pendiente de aprobación de estructura
actualizado: 2026-09-08
---

# C4 · L3 — Componentes del contenedor «Sitio estático»

Zoom dentro del contenedor web. **Todo PLANEADO.** Ningún archivo existe.

```mermaid
flowchart TB
    subgraph WEB["Contenedor · Sitio estático (SvelteKit)"]
      LAY["<b>+layout.svelte</b><br/>shell responsive, mobile-first<br/>skip-link, foco visible"]
      TOK["<b>tokens.css</b><br/>color · tipografía · espaciado · radios<br/>CSS custom properties"]
      PRIM["<b>Primitivos</b><br/>Button · Card · Section · Field<br/>WhatsAppCTA · Breadcrumb"]
      HOLD["<b>Placeholders</b><br/>Placeholder · ImageSlot"]
      SEO["<b>seo/jsonld.ts</b><br/>construye el @graph"]
      CFG["<b>config/business.ts</b><br/>ÚNICA fuente de datos de negocio"]
      RT["<b>routes/</b><br/>1 sola ruta hasta que exista §3"]
    end

    RT --> LAY
    LAY --> PRIM
    LAY --> SEO
    PRIM --> TOK
    HOLD --> TOK
    SEO --> CFG
    RT --> HOLD

    classDef plan fill:#fff,stroke:#c96f4a,stroke-dasharray:5 4,color:#222
    class LAY,TOK,PRIM,HOLD,SEO,CFG,RT plan
```

## Reglas que este nivel fija

1. `business.ts` es el **único** lugar donde vive un dato de negocio. Ningún
   componente escribe un teléfono, un horario ni un nombre legal.
2. `jsonld.ts` **solo** lee de `business.ts`. No acepta literales.
3. Los primitivos **solo** leen de `tokens.css`. Nada de hex sueltos.
4. Ninguna imagen real entra hasta que exista aprobación. `ImageSlot` pinta un
   bloque gris con la relación de aspecto y la etiqueta de qué foto va ahí.

Estas cuatro reglas son las que hacen que el test anti-`__POR_CONFIRMAR__` sea
capaz de bloquear un build de producción. Si un dato se filtra fuera de
`business.ts`, el test deja de servir.

## Estado

| Componente | Estado | Evidencia |
|---|---|---|
| Todos | NO INICIADO | — |

Se sube a IMPLEMENTADO archivo por archivo, con cita `ruta:línea`, no antes.

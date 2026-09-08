---
tipo: c4
nivel: L2
estado: BORRADOR
actualizado: 2026-09-08
---

# C4 · L2 — Contenedores

Las piezas desplegables del sistema. **Ninguna existe todavía.**

```mermaid
flowchart TB
    P["<b>Persona</b><br/><i>[Persona]</i>"]

    subgraph SYS["Sistema · Sitio Masters Valuadores"]
      WEB["<b>Sitio estático</b><br/>SvelteKit + adapter-static<br/>prerender total<br/><i>[Contenedor · PLANEADO]</i>"]
      AST["<b>Estáticos</b><br/>woff2 subset autoalojadas<br/>imágenes optimizadas<br/><i>[Contenedor · PLANEADO]</i>"]
      LD["<b>Módulo JSON-LD</b><br/>@graph parametrizado desde business.ts<br/><i>[Componente · PLANEADO]</i>"]
    end

    H["<b>Dominio + hospedaje</b><br/>__POR_CONFIRMAR__<br/>a cargo del cliente<br/><i>[Sistema externo]</i>"]
    F["<b>Destino del formulario de valuación</b><br/>__POR_CONFIRMAR__<br/><i>[Sistema externo]</i>"]
    GBP["<b>Google Business Profile</b><br/><i>[Sistema externo]</i>"]
    WA["<b>WhatsApp</b><br/><i>[Sistema externo]</i>"]

    P -->|HTTPS| WEB
    WEB --> AST
    WEB --> LD
    LD -.->|"@graph en el HTML"| GBP
    WEB -->|"wa.me / click-to-chat"| WA
    WEB -->|"envío"| F
    H -->|"sirve"| WEB

    classDef ext fill:#e8e8e8,stroke:#888,color:#222
    classDef plan fill:#fff,stroke:#c96f4a,stroke-dasharray:5 4,color:#222
    classDef per fill:#f0efe9,stroke:#555,color:#222
    class H,F,GBP,WA ext
    class WEB,AST,LD plan
    class P per
```

Línea punteada naranja = **planeado**, sin una línea de código escrita.

## Decisiones de contenedor todavía abiertas

| # | Pregunta | Consecuencia si se equivoca |
|---|---|---|
| D-07 | ¿Dónde se hospeda y bajo qué dominio? | Define canónicas, `WebSite.url` y estrategia de despliegue |
| D-12 | ¿Qué medición de contactos? | Puede meter JS de terceros y reventar el presupuesto de 40 KB |
| D-13 | ¿A dónde llegan los envíos del formulario? | Un sitio 100 % estático **no** procesa formularios por sí solo. Si no hay destino, el formulario no se construye |

D-13 es la que puede romper la premisa de "estático puro". No la resuelvo yo.

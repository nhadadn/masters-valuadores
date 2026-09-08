---
tipo: c4
nivel: L1
estado: BORRADOR
evidencia: Propuesta Nazmelia 28-jul-2026, pág. 4
actualizado: 2026-09-08
---

# C4 · L1 — Contexto del sistema

Qué es el sitio para el mundo exterior y con quién habla. **Nada aquí está
implementado**: el sistema no existe todavía.

```mermaid
flowchart TB
    P["<b>Persona que busca liquidez</b><br/>Torreón · móvil · gama baja<br/><i>[Persona]</i>"]
    S["<b>Sitio Masters Valuadores</b><br/>Sitio estático prerenderizado<br/><i>[Sistema · NO EXISTE]</i>"]
    G["<b>Google Search / Maps</b><br/>Descubrimiento + ficha del negocio<br/><i>[Sistema externo]</i>"]
    W["<b>WhatsApp</b><br/>Canal de contacto principal<br/><i>[Sistema externo]</i>"]
    T["<b>Teléfono</b><br/><i>[Sistema externo]</i>"]
    M["<b>Medición de contactos</b><br/>__POR_CONFIRMAR__<br/><i>[Sistema externo]</i>"]
    R["<b>Instagram / Facebook</b><br/>Presencia existente<br/><i>[Sistema externo]</i>"]

    P -->|"busca «casa de empeño en Torreón»"| G
    G -->|"muestra ficha y sitio"| S
    P -->|"visita"| S
    R -->|"deriva tráfico"| S
    S -->|"CTA principal · 1 clic"| W
    S -->|"CTA"| T
    S -->|"eventos de contacto"| M
    S -.->|"sameAs"| R
    S -.->|"JSON-LD + ficha"| G

    classDef ext fill:#e8e8e8,stroke:#888,color:#222
    classDef sys fill:#2c3a3f,stroke:#2c3a3f,color:#fff
    classDef per fill:#f0efe9,stroke:#555,color:#222
    class G,W,T,M,R ext
    class S sys
    class P per
```

## Evidencia por elemento

| Elemento | Grado | Fuente |
|---|---|---|
| WhatsApp como CTA principal, 1 clic | Documental | Propuesta, pág. 4 |
| Ficha de Google en el alcance | Documental | Propuesta, pág. 4 |
| Sitio rápido y móvil primero | Documental | Propuesta, pág. 4 |
| Medidor de contactos (llamada / WhatsApp / valuación) | Documental | Propuesta, pág. 4 |
| IG y FB activos | Documental | Propuesta, pág. 8 (11 seguidores IG, 3 459 publicaciones) |
| Herramienta concreta de medición | `__POR_CONFIRMAR__` | — [[decisiones-pendientes\|D-12]] |
| URLs exactas de IG/FB para `sameAs` | `__POR_CONFIRMAR__` | — [[decisiones-pendientes\|D-10]] |

"Documental" significa: está escrito en la propuesta firmada. **No** es grado A ni B —
no hay código todavía. Ver la tabla de grados en [[README]].

## Pendiente de validar contra Etapa 1

Este diagrama asume la lectura empeño-céntrica de la propuesta. Si la Etapa 1
concluye arquitectura multigiro, L1 cambia: la persona deja de ser una sola y
aparecen perfiles por giro. Ver [[decisiones-pendientes|D-05]].

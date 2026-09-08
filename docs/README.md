---
tipo: indice
estado: vigente
---

# Vault · Masters Valuadores

Vault de Obsidian del proyecto. Vive dentro del repo (`docs/`) para que la
documentación se versione con el código. Abrir Obsidian → *Open folder as vault*
→ apuntar a esta carpeta `docs`.

> Para que las plantillas funcionen: **Settings → Core plugins → Templates** (activar).
> La carpeta ya está configurada en `.obsidian/templates.json` → `90-plantillas`.

## Mapa del vault

| Carpeta | Qué vive aquí |
|---|---|
| `00-inbox/` | Captura rápida. Se vacía; nada se queda aquí. |
| `10-arquitectura/` | La fuente de verdad, los C4 y los ADR. |
| `20-specs/` | SDD: una spec por unidad de trabajo. Nada se implementa sin spec aprobada. |
| `30-cliente/` | Datos del negocio, Etapa 1 y el tablero de pendientes. |
| `40-seo/` | Mapa de páginas (§3) y `@graph` JSON-LD (§4). |
| `90-plantillas/` | Plantillas de SPEC, ADR y C4. |
| `99-assets/` | Imágenes y adjuntos. |

## Cómo trabajamos aquí

**C4** para la forma del sistema. Mantenemos tres niveles:

| Nivel | Archivo | Se mantiene |
|---|---|---|
| L1 · Contexto | [[C4-L1-contexto]] | Sí |
| L2 · Contenedores | [[C4-L2-contenedores]] | Sí |
| L3 · Componentes | [[C4-L3-componentes-web]] | Sí |
| L4 · Código | — | **No.** El código es su propia documentación. |

**SDD** para el orden de trabajo. El flujo y los estados están en [[20-specs/README|el README de specs]].
Regla corta: primero la spec, después el test, después el código.

## Grados de evidencia

Aplica a toda afirmación en este vault, sin excepción.

| Grado | Significa | Cómo se cita |
|---|---|---|
| **A** | Hay un test que lo prueba | `ruta/archivo.test.ts:línea` |
| **B** | Hay código de producción que lo hace | `ruta/archivo.ts:línea` |
| **Planeado** | Existe una spec aprobada, no hay código | `20-specs/SPEC-XXXX.md` |
| **Nada** | Mención suelta en README, comentario, TODO, nombre de variable o columna sin lógica | No es evidencia. No se cita. |

Ante la duda entre dos grados, se elige el más bajo y se dice.
Nada se declara IMPLEMENTADO sin A o B.

## Marcadores

- `__POR_CONFIRMAR__` — dato de negocio que nadie ha confirmado. Bloquea build de producción.
- `[PENDIENTE: contenido no aprobado]` — hueco de copy o contenido.

Ambos se rastrean en [[decisiones-pendientes]].

# Skills vendorizados · svelte-skills-kit

Guía de Svelte 5 y SvelteKit para las sesiones de Claude Code en este repo.
**Son instrucciones para el agente, no código.** No se importan, no se compilan,
no entran al bundle y no cambian un solo byte de lo que se sirve.

## Procedencia

| Qué | Valor |
|---|---|
| Origen | `spences10/svelte-skills-kit`, ruta `plugins/svelte-skills/skills/` |
| Commit copiado | `2a9d883` · 2026-04-29 · marketplace v1.3.0 |
| Fecha de la copia | 10 de septiembre de 2026 |
| Licencia | El manifiesto del kit declara MIT. **El repo de origen no incluye archivo `LICENSE`** |
| Autor | Scott Spence |

Copia congelada: no se actualiza sola. Para traer cambios de arriba, ver el final.

## Qué se copió, y qué no

Seis de los diez. Los cuatro que faltan se dejaron fuera **porque contradicen
decisiones ya cerradas de este repo**, no por calidad:

| Fuera | Choca con |
|---|---|
| `svelte-components` | Recomienda Bits UI / Ark UI / Melt UI ↔ «CERO librería de UI» (CLAUDE.md) |
| `svelte-layerchart` | Librería de gráficas con JS de cliente ↔ 0 KB de JS, presupuesto de 40 KB |
| `sveltekit-remote-functions` | Experimental y requiere servidor ↔ `adapter-static`, sitio 100 % prerenderizado |
| `ecosystem-guide` | Catálogo de MCPs y CLIs del autor. Nada que ver con este proyecto |

Si alguna sesión futura los echa de menos, la pregunta correcta no es «los copio»
sino «¿se revirtió el ADR que lo prohíbe?».

## Guardarraíles · el contrato manda sobre el skill

`CLAUDE.md` y los ADR van por encima de cualquier cosa que diga un SKILL.md.
Estos skills describen SvelteKit en general; este repo es un caso muy restringido:

- **`csr = false`** en `src/routes/+layout.ts:28`. Cero JavaScript en el cliente.
  Todo lo que un skill diga sobre `$state`, `$effect`, `onMount`, stores de cliente,
  transiciones o animaciones **no corre aquí**. Lo que sí corre es lo que se resuelve
  en compilación o en SSR: `$props`, `$derived`, snippets, `{@render}`, `{@const}`.
  Hoy el repo usa exactamente eso: 16 `$props`, 12 `$derived`, cero `$state`, cero `$effect`.
- **`prerender = true`** (`src/routes/+layout.ts:6`) y `adapter-static` (`svelte.config.js:1`).
  No hay servidor. Sin `+page.server.ts`, sin form actions, sin endpoints. El destino
  del formulario sigue abierto como **D-13**, y ningún skill lo resuelve.
- **Presupuesto de 40 KB gzip por página.** Ninguna sugerencia que añada una dependencia
  de runtime entra sin pasar por `node herramientas/presupuesto.mjs`.
- **Ninguna librería de UI.** Los primitivos se escriben a mano en `src/lib/componentes/`.
- **Ningún componente escribe un color.** Los tokens viven en `src/lib/estilos/tokens.css`.
  Si un skill de estilos propone un color literal, la respuesta es un token.

## Lo que esto no arregla

Nada del contenido. Según `CLAUDE.md`, lo que bloquea el sitio es el NAP por escrito
(D-08), el copy, y la foto de fachada. Estos skills ayudan a implementar el
[ADR-0007](../../docs/10-arquitectura/adr/ADR-0007-lenguaje-visual.md) con menos errores de Svelte. No sustituyen
un solo dato que falte.

## Actualizar desde arriba

```bash
git clone --depth 1 https://github.com/spences10/svelte-skills-kit.git /tmp/ssk
for s in svelte-styling sveltekit-structure svelte-template-directives \
         svelte-runes sveltekit-data-flow svelte-deployment; do
  rm -rf ".claude/skills/$s"
  cp -r "/tmp/ssk/plugins/svelte-skills/skills/$s" ".claude/skills/$s"
done
```

Revisa el diff antes de commitear: arriba pueden añadir recomendaciones que este
repo no acepta. Y actualiza el commit y la fecha de la tabla de arriba.

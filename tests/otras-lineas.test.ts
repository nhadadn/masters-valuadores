import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';
import { createRawSnippet } from 'svelte';
import PaginaGiro from '../src/routes/[giro]/+page.svelte';
import Plantilla from '../src/routes/+layout.svelte';
import { girosConstruibles } from '../src/lib/datos/giros';

/**
 * Sale «OTRAS LÍNEAS DEL GRUPO» · ADR-0055.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 *   · La sección no vuelve a las páginas de línea. Repetía, justo encima del pie, los
 *     enlaces que el pie lleva en las nueve páginas.
 *   · Y la condición que permitió quitarla: el pie enlaza TODAS las líneas construibles.
 *     Si alguien quita esa lista, en teléfono las páginas de línea se quedan sin camino a
 *     las demás —la cabecera no tiene menú ahí— y nada falla al construir.
 *
 * La plantilla se renderiza de verdad. Pide dos cosas que fuera de SvelteKit no existen y
 * aquí se simulan: la ruta, para la canónica, y el modo de desarrollo, para que el grafo
 * no truene por los datos que faltan. Eso lo vigila el build, no este test (CA-08).
 */

vi.mock('$app/state', () => ({ page: { url: new URL('http://localhost/fletes/') } }));
vi.mock('$app/environment', () => ({ dev: true, browser: false, building: false, version: 'test' }));

const contenido = createRawSnippet(() => ({ render: () => '<p>contenido</p>' }));

describe('sale «Otras líneas del grupo» · ADR-0055', () => {
  it('ninguna página de línea la pinta', () => {
    for (const giro of girosConstruibles) {
      const { body } = render(PaginaGiro, { props: { data: { giro } } });
      expect(body, giro.slug).not.toMatch(/OTRAS LÍNEAS|class="cruzados/);
    }
  });

  it('el pie enlaza cada línea construible', () => {
    const { body } = render(Plantilla, { props: { children: contenido } });
    const pie = body.slice(body.indexOf('<footer'), body.indexOf('</footer>'));
    expect(pie).toContain('aria-label="Líneas de negocio, al pie"');
    for (const g of girosConstruibles) {
      expect(pie, g.slug).toContain(`href="/${g.slug}/"`);
    }
  });
});

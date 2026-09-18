import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';
import PaginaGiro from '../src/routes/[giro]/+page.svelte';
import { girosConstruibles } from '../src/lib/datos/giros';

/**
 * El cierre de las páginas de línea · ADR-0059.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 *   · La ubicación va EN FRANJA. Medido a 390 px en el sitio publicado, la sección medía
 *     704 px y el pie, justo debajo, 573: la dirección, el horario y «Cómo llegar» salían
 *     dos veces en cada página de línea. Nadir eligió la opción B: se queda la sección,
 *     corta, y el horario solo en el pie.
 *   · Y por eso la pregunta es «¿Dónde están?»: «¿…y están abiertos?» prometía un
 *     horario que el bloque ya no trae.
 *   · La numeración no salta. Iba escrita a mano —1, 2 y 3—, y en financiamiento y
 *     taller, que no tienen bienes, la primera sección numerada era la «2».
 */

vi.mock('$app/state', () => ({ page: { url: new URL('http://localhost/fletes/') } }));
vi.mock('$app/environment', () => ({ dev: true, browser: false, building: false, version: 'test' }));

const paginas = girosConstruibles.map((giro) => ({
  slug: giro.slug,
  html: render(PaginaGiro, { props: { data: { giro } } }).body
}));

/** El HTML de la `<section>` que contiene `marca`. */
function seccionCon(html: string, marca: string): string {
  const i = html.indexOf(marca);
  expect(i, `no aparece ${marca}`).toBeGreaterThan(-1);
  return html.slice(html.lastIndexOf('<section', i), html.indexOf('</section>', i));
}

describe('el cierre de las líneas · ADR-0059', () => {
  it('la ubicación va en franja y pregunta solo «¿Dónde están?»', () => {
    for (const { slug, html } of paginas) {
      const s = seccionCon(html, 'class="ubicacion');
      expect(s, slug).toMatch(/class="ubicacion[^"]*\bfranja\b/);
      expect(s, slug).toMatch(/<h2[^>]*>.*¿Dónde están\?<\/h2>/s);
      expect(s, slug).not.toContain('abiertos');
      expect(s, slug).not.toContain('data-negocio="horarios"');
    }
  });

  it('la numeración no salta: 1, 2, 3… en el orden en que aparecen', () => {
    for (const { slug, html } of paginas) {
      const nums = [...html.matchAll(/<h2[^>]*><span class="num[^"]*">(\d+)<\/span>/g)].map((m) => Number(m[1]));
      expect(nums.length, slug).toBeGreaterThanOrEqual(2);
      expect(nums, slug).toEqual(nums.map((_, i) => i + 1));
    }
  });
});

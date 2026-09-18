import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';
import { readFileSync } from 'node:fs';
import PaginaGiro from '../src/routes/[giro]/+page.svelte';
import Portada from '../src/routes/+page.svelte';
import Contacto from '../src/routes/contacto/+page.svelte';
import { girosConstruibles } from '../src/lib/datos/giros';

/**
 * Los grados claros vuelven a pintar · ADR-0060.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 * Desde el ADR-0043 los grados claros eran transparentes y el suelo lo ponía `body`.
 * Medido en el sitio publicado a 390 px: la plantilla de línea pedía `tenue`, `blanco` y
 * `marfil`, y el navegador pintaba tres veces el mismo suelo de acero. Nada fallaba: la
 * página solo se leía como un bloque.
 *
 *   · `marfil` pinta la placa y `blanco` el blanco; `tenue` y `crema` son el suelo.
 *   · En ninguna página dos secciones seguidas llevan la misma superficie. Es la regla
 *     que el propio `Seccion.svelte` promete —«alterna entre secciones consecutivas»— y
 *     que dejó de cumplirse sin que nada avisara.
 */

vi.mock('$app/state', () => ({ page: { url: new URL('http://localhost/') } }));
vi.mock('$app/environment', () => ({ dev: true, browser: false, building: false, version: 'test' }));

const SECCION = readFileSync('src/lib/componentes/Seccion.svelte', 'utf8');

/** Lo que el navegador pinta de verdad para cada grado. */
const SUPERFICIE: Record<string, string> = {
  tenue: 'suelo', crema: 'suelo', medio: 'suelo',
  marfil: 'placa', blanco: 'blanco',
  pavonado: 'pavonado', carbon: 'carbon', oscuro: 'carbon',
  marmol: 'marmol', piedra: 'piedra'
};

const superficies = (html: string) =>
  [...html.matchAll(/<section[^>]*class="seccion (\w+)/g)].map((m) => SUPERFICIE[m[1]] ?? `¿${m[1]}?`);

describe('los grados claros pintan · ADR-0060', () => {
  it('marfil pinta la placa de acero y blanco el blanco', () => {
    expect(SECCION).toMatch(/\.marfil\s*\{\s*background-color:\s*var\(--acero-placa\)/);
    expect(SECCION).toMatch(/\.blanco\s*\{\s*background-color:\s*var\(--blanco\)/);
  });

  it('tenue y crema siguen siendo el suelo', () => {
    expect(SECCION).toMatch(/\.tenue,\s*\.crema\s*\{\s*background-color:\s*transparent/);
  });

  it('ninguna sección toca a otra de la misma superficie', () => {
    const paginas: [string, string][] = [
      ...girosConstruibles.map((giro): [string, string] => [giro.slug, render(PaginaGiro, { props: { data: { giro } } }).body]),
      ['portada', render(Portada).body],
      ['contacto', render(Contacto).body]
    ];
    for (const [nombre, html] of paginas) {
      const s = superficies(html);
      expect(s.length, nombre).toBeGreaterThanOrEqual(2);
      expect(s.filter((x) => x.startsWith('¿')), `${nombre}: grado sin superficie conocida`).toEqual([]);
      for (let i = 1; i < s.length; i++) {
        expect(s[i], `${nombre}: las secciones ${i} y ${i + 1} son las dos «${s[i]}»`).not.toBe(s[i - 1]);
      }
    }
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';
import PaginaGiro from '../src/routes/[giro]/+page.svelte';
import Portada from '../src/routes/+page.svelte';
import { girosConstruibles } from '../src/lib/datos/giros';

/**
 * Salen los rótulos «FOTO DE ARCHIVO» · ADR-0061.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 * Se publicaban cuatro: las dos fotos de archivo —fletes y taller— en el mosaico de la
 * portada y otra vez en su página. Nadir decidió quitarlos —«NO, QUÍTALOS»—, con el
 * criterio que el ADR-0054 ya aplicó al planeta.
 *
 *   · Ninguna página pinta el rótulo.
 *   · Lo que se queda: `data-provisional`, que no se ve y permite contar cuántas fotos de
 *     archivo siguen publicadas. Ninguna foto propia lo lleva.
 */

vi.mock('$app/state', () => ({ page: { url: new URL('http://localhost/') } }));
vi.mock('$app/environment', () => ({ dev: true, browser: false, building: false, version: 'test' }));

const deArchivo = (html: string) => (html.match(/data-provisional="true"/g) ?? []).length;

describe('las fotos de archivo, sin rótulo · ADR-0061', () => {
  it('ninguna página pinta «FOTO DE ARCHIVO»', () => {
    expect(render(Portada).body).not.toMatch(/FOTO DE ARCHIVO/i);
    for (const giro of girosConstruibles) {
      expect(render(PaginaGiro, { props: { data: { giro } } }).body, giro.slug).not.toMatch(/FOTO DE ARCHIVO/i);
    }
  });

  it('la portada sigue marcando por dentro cada foto de archivo del mosaico, y solo esas', () => {
    const esperadas = girosConstruibles.filter((g) => g.fotoProvisional && !g.fotoEsSuya).length;
    expect(esperadas).toBeGreaterThan(0);
    expect(deArchivo(render(Portada).body)).toBe(esperadas);
  });

  it('en cada línea, la foto de su sección lleva la marca si y solo si no es suya', () => {
    for (const giro of girosConstruibles) {
      const pintaFoto = !!giro.fotoProvisional && !(giro.muestraJoyeria || giro.muestraInventario);
      const debe = pintaFoto && !giro.fotoEsSuya ? 1 : 0;
      expect(deArchivo(render(PaginaGiro, { props: { data: { giro } } }).body), giro.slug).toBe(debe);
    }
  });
});

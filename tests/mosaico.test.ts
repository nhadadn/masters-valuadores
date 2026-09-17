import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import MosaicoLineas from '../src/lib/componentes/MosaicoLineas.svelte';
import { girosConstruibles } from '../src/lib/datos/giros';

/**
 * El mosaico de líneas · ADR-0049 · ADR-0057.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 * Que cada pieza lleve a la página de su línea, y a nada más. Hasta el ADR-0049 la pieza
 * entera abría WhatsApp; desde el ADR-0049 un botón verde lo abría encima de ella; desde
 * el ADR-0057 no hay botón: eran cinco WhatsApp más en la portada, y Nadir los quitó por
 * excesivos. Si alguien vuelve a poner uno, esto lo dice.
 *
 * Y que no haya un enlace dentro de otro. Es HTML inválido: el navegador lo repara
 * partiendo el primero, sin avisar. Nada de eso rompe el build.
 *
 * Se renderiza el componente en el servidor, como en el prerender: es el HTML que se
 * publica, sin navegador de por medio.
 */

const { body } = render(MosaicoLineas, { props: { lineas: girosConstruibles } });
const piezas = body.match(/<li\b[\s\S]*?<\/li>/g) ?? [];
const aperturas = (html: string) => [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
const destino = (a: string) => (a.match(/href="([^"]*)"/)?.[1] ?? '').replace(/&amp;/g, '&');

describe('mosaico de líneas · ADR-0049 · ADR-0057', () => {
  it('una pieza por línea construible', () => {
    expect(piezas.length).toBe(girosConstruibles.length);
  });

  it('la pieza lleva a la página de su línea', () => {
    girosConstruibles.forEach((g, i) => {
      const pieza = aperturas(piezas[i]).find((a) => /class="enlace\b/.test(a));
      expect(pieza && destino(pieza)).toBe(`/${g.slug}/`);
    });
  });

  it('ninguna pieza abre WhatsApp: un solo enlace, a su página · ADR-0057', () => {
    for (const p of piezas) {
      const enlaces = aperturas(p);
      expect(enlaces).toHaveLength(1);
      expect(destino(enlaces[0])).not.toMatch(/wa\.me|whatsapp/i);
    }
    expect(body).not.toMatch(/wa-pieza|wa\.me/);
  });

  it('ningún enlace dentro de otro', () => {
    for (const p of piezas) {
      let abiertos = 0;
      for (const m of p.matchAll(/<a\b|<\/a>/g)) {
        abiertos += m[0] === '</a>' ? -1 : 1;
        expect(abiertos).toBeLessThanOrEqual(1);
      }
      expect(abiertos).toBe(0);
    }
  });
});

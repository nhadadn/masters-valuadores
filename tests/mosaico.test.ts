import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import MosaicoLineas from '../src/lib/componentes/MosaicoLineas.svelte';
import { girosConstruibles } from '../src/lib/datos/giros';
import { hayWhatsApp } from '../src/lib/datos/whatsapp';

/**
 * El mosaico de líneas · ADR-0049.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 * Que cada pieza tenga DOS destinos y no se confundan: la pieza lleva a la página de su
 * línea y solo el botón verde abre WhatsApp. Hasta el ADR-0049 la pieza entera abría
 * WhatsApp, y la portada no enlazaba desde su contenido a ninguna página de línea.
 *
 * Y que los dos enlaces sean HERMANOS. Un <a> dentro de otro es HTML inválido: el
 * navegador lo repara partiendo el primero, sin avisar, y el botón acaba fuera de la
 * pieza o la pieza sin enlace. Nada de eso rompe el build.
 *
 * Se renderiza el componente en el servidor, como en el prerender: es el HTML que se
 * publica, sin navegador de por medio.
 */

const { body } = render(MosaicoLineas, { props: { lineas: girosConstruibles } });
const piezas = body.match(/<li\b[\s\S]*?<\/li>/g) ?? [];
const aperturas = (html: string) => [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]);
const destino = (a: string) => (a.match(/href="([^"]*)"/)?.[1] ?? '').replace(/&amp;/g, '&');

describe('mosaico de líneas · ADR-0049', () => {
  it('una pieza por línea construible', () => {
    expect(piezas.length).toBe(girosConstruibles.length);
  });

  it('la pieza lleva a la página de su línea', () => {
    girosConstruibles.forEach((g, i) => {
      const pieza = aperturas(piezas[i]).find((a) => /class="enlace\b/.test(a));
      expect(pieza && destino(pieza)).toBe(`/${g.slug}/`);
    });
  });

  it('solo el botón verde abre WhatsApp, con la línea en el mensaje', () => {
    girosConstruibles.forEach((g, i) => {
      const alChat = aperturas(piezas[i]).filter((a) => destino(a).includes('wa.me'));
      // Sin número confirmado no hay botón, y la pieza sigue llevando a su página.
      if (!hayWhatsApp()) return expect(alChat).toHaveLength(0);
      expect(alChat).toHaveLength(1);
      expect(alChat[0]).toMatch(/class="wa-pieza\b/);
      const mensaje = decodeURIComponent(destino(alChat[0]).split('text=')[1] ?? '');
      expect(mensaje).toContain(g.nombre.toLowerCase());
    });
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

import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import { existsSync, readFileSync } from 'node:fs';
import PlanetaBienes from '../src/lib/componentes/PlanetaBienes.svelte';
import PaginaGiro from '../src/routes/[giro]/+page.svelte';
import { giros } from '../src/lib/datos/giros';
import { anchosDe } from '../src/lib/datos/fotos';

/**
 * Las fotos del planeta de bienes · ADR-0054.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 *   · «Autos» en empeño y «Carga general» en fletes llevan foto. Son de archivo y van
 *     SIN marca de que no son suyas: lo decidió Nadir. Si alguien lee la regla vieja del
 *     CLAUDE.md y vuelve a poner una nota, esto lo dice.
 *   · Cada foto del planeta existe en JPEG, WebP y AVIF en cada ancho que su `srcset`
 *     promete. Si falta uno, el navegador no avisa: cae al siguiente formato o a ninguno.
 *   · Las dos nuevas son cuadradas de 400. El disco es redondo y recorta al centro: el
 *     encuadre que se eligió solo se respeta si el archivo es el cuadro que se recortó.
 *
 * Se renderiza el componente en el servidor, como en el prerender.
 */

const giro = (slug: string) => {
  const g = giros.find((x) => x.slug === slug);
  if (!g?.bienesPropuestos) throw new Error(`${slug} sin bienes`);
  return g;
};
const planeta = (slug: string) => {
  const g = giro(slug);
  return render(PlanetaBienes, { props: { bienes: g.bienesPropuestos!, giro: g.slug, pregunta: g.preguntaBien } }).body;
};
/** El HTML de un disco, por su `data-origen`. */
const disco = (html: string, origen: string) => {
  const inicio = html.indexOf(`data-origen="${origen}"`);
  expect(inicio, `no hay disco ${origen}`).toBeGreaterThan(-1);
  return html.slice(inicio, html.indexOf('</a>', inicio));
};

/** Ancho y alto de un JPEG, leídos de su marcador SOF. */
const medidas = (ruta: string): [number, number] | null => {
  const b = readFileSync(ruta);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
};

const NUEVAS = [
  { slug: 'empeno-y-prestamo', origen: 'bien-empeno-y-prestamo-auto', foto: 'bien-autos' },
  { slug: 'fletes', origen: 'bien-fletes-carga', foto: 'bien-carga' },
];

describe('fotos del planeta · ADR-0054', () => {
  it('«Autos» en empeño y «Carga general» en fletes pintan su foto, no el ícono', () => {
    for (const n of NUEVAS) {
      const d = disco(planeta(n.slug), n.origen);
      expect(d).toContain(`src="/fotos/${n.foto}-400.jpg"`);
      expect(d).toMatch(new RegExp(`type="image/avif" srcset="/fotos/${n.foto}-400\\.avif 400w"`));
      expect(d).not.toContain('class="vacio');
    }
  });

  it('van sin marca de archivo: ni rótulo en el disco ni nota en su sección', () => {
    for (const n of NUEVAS) {
      // La sección entera de la página, no solo el componente: una nota iría al lado del
      // planeta, en la plantilla, como la de la galería de joyería.
      const html = render(PaginaGiro, { props: { data: { giro: giro(n.slug) } } }).body;
      const planetaEn = html.indexOf('data-planeta');
      expect(planetaEn).toBeGreaterThan(-1);
      const seccion = html.slice(html.lastIndexOf('<section', planetaEn), html.indexOf('</section>', planetaEn));
      expect(seccion).not.toMatch(/referencia|archivo|ilustrativa|inventario/i);
    }
  });

  it('cada foto del planeta existe en los tres formatos y en cada ancho que promete', () => {
    const faltan: string[] = [];
    for (const g of giros) {
      for (const b of g.bienesPropuestos ?? []) {
        if (!b.foto) continue;
        for (const ancho of anchosDe(b.fotoMaxAncho ?? 1600)) {
          for (const ext of ['jpg', 'webp', 'avif']) {
            const ruta = `static/fotos/${b.foto}-${ancho}.${ext}`;
            if (!existsSync(ruta)) faltan.push(`${g.slug} · ${b.que} · ${ruta}`);
          }
        }
      }
    }
    expect(faltan, 'se generan con hacer-webp.mjs y hacer-avif.mjs a partir del JPEG').toEqual([]);
  });

  it('las dos nuevas son cuadradas de 400, el recorte que se eligió', () => {
    for (const n of NUEVAS) expect(medidas(`static/fotos/${n.foto}-400.jpg`)).toEqual([400, 400]);
  });
});

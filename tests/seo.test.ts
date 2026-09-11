import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  paginas, paginasIndexables, construirSitemap, construirRobots,
  absoluta, IMAGEN_TARJETA
} from '$lib/seo/enlaces';
import { fichas } from '$lib/seo/meta';
import { girosConstruibles } from '$lib/datos/giros';
import { POR_CONFIRMAR } from '$lib/config/negocio';

/**
 * SPEC-0003 · Descubribilidad y tarjetas de enlace.
 *
 * Se prueba con un ORIGEN FALSO, no con el real. El real es `__POR_CONFIRMAR__` y
 * lo seguirá siendo hasta que Cristóbal cierre D-07; si estos criterios solo se
 * pudieran verificar entonces, los defectos se descubrirían el día de publicar.
 * Con un origen inyectado se prueban HOY los dos estados: con dominio y sin él.
 */
const FALSO = 'https://ejemplo-de-prueba.mx';

const TITULO_MAX = 60;              // lo que Google suele mostrar antes de cortar
const DESC_MIN = 110, DESC_MAX = 160;

describe('CA-S1 · cada página tiene título propio y utilizable', () => {
  it('hay una ficha por cada ruta del inventario, sin huecos', () => {
    expect(Object.keys(fichas).sort()).toEqual(paginas.map((p) => p.ruta).sort());
  });

  for (const p of paginas) {
    it(`${p.ruta} · título sano`, () => {
      const t = fichas[p.ruta].titulo;
      expect(t).not.toContain(POR_CONFIRMAR);
      expect(t.length).toBeGreaterThan(0);
      expect(t.length, `«${t}» mide ${t.length}`).toBeLessThanOrEqual(TITULO_MAX);
    });
  }

  it('ningún título se repite: dos páginas con el mismo título compiten entre sí', () => {
    const t = paginas.map((p) => fichas[p.ruta].titulo);
    expect(new Set(t).size).toBe(t.length);
  });
});

describe('CA-S2 · cada página tiene descripción, y es propuesta', () => {
  for (const p of paginas) {
    it(`${p.ruta} · descripción sana`, () => {
      const d = fichas[p.ruta].descripcion;
      expect(d).not.toContain(POR_CONFIRMAR);
      // Las legales son de servicio y no compiten por nada: se les pide existir,
      // no medir. Las que Google va a mostrar sí tienen que caber en el renglón.
      if (p.indexable) {
        expect(d.length, `«${d}» mide ${d.length}`).toBeGreaterThanOrEqual(DESC_MIN);
      }
      expect(d.length, `«${d}» mide ${d.length}`).toBeLessThanOrEqual(DESC_MAX);
    });
  }

  it('ninguna descripción se repite', () => {
    const d = paginas.map((p) => fichas[p.ruta].descripcion);
    expect(new Set(d).size).toBe(d.length);
  });

  /**
   * Lo que NO se inventa, nunca · CLAUDE.md. Una descripción es texto publicado:
   * si se cuela una cifra, un plazo o un porcentaje, sale en Google como hecho.
   */
  it('ninguna trae cifra, precio, porcentaje ni horario', () => {
    const PROHIBIDO = [
      { nombre: 'precio', re: /\$\s?\d/ },
      { nombre: 'porcentaje', re: /\d\s?%/ },
      { nombre: 'horario', re: /\b\d{1,2}:\d{2}\b/ },
      { nombre: 'teléfono', re: /\b\d{3}[ .-]?\d{3}[ .-]?\d{4}\b/ },
      { nombre: 'plazo', re: /\b\d+\s?(d[ií]as?|meses?|a[nñ]os?)\b/i }
    ];
    for (const p of paginas) {
      const texto = `${fichas[p.ruta].titulo} ${fichas[p.ruta].descripcion}`;
      const malos = PROHIBIDO.filter((x) => x.re.test(texto)).map((x) => x.nombre);
      expect(malos, `${p.ruta}: ${malos.join(', ')}`).toEqual([]);
    }
  });

  it('las ocho están marcadas como propuesta sin aprobar', () => {
    expect(Object.values(fichas).every((f) => f.propuesta)).toBe(true);
  });
});

/**
 * CA-S10 · El inventario es la única lista de páginas.
 *
 * Este es el test que más protege, porque protege a los otros: si alguien añade una
 * ruta y no la registra, el sitemap no la conoce, no tiene `<head>` y el validador
 * de accesibilidad no la mira. Tres fallos silenciosos salidos de un solo descuido.
 */
describe('CA-S10 · el inventario coincide con lo que hay en disco', () => {
  it('ni una ruta de más ni una de menos', () => {
    const enDisco: string[] = [];
    (function caminar(dir: string, ruta: string) {
      if (existsSync(join(dir, '+page.svelte'))) enDisco.push(ruta);
      for (const n of readdirSync(dir)) {
        const p = join(dir, n);
        if (!statSync(p).isDirectory()) continue;
        if (n === '[giro]') { for (const g of girosConstruibles) enDisco.push(`/${g.slug}/`); continue; }
        caminar(p, `${ruta}${n}/`);
      }
    })('src/routes', '/');
    expect(enDisco.sort()).toEqual(paginas.map((p) => p.ruta).sort());
  });

  it('toda ruta lleva barra final · trailingSlash es «always»', () => {
    for (const p of paginas) expect(p.ruta.endsWith('/')).toBe(true);
  });
});

describe('CA-S3 · el sitemap apunta exactamente a las páginas indexables', () => {
  const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  it('con dominio: una <loc> por página indexable, absoluta y con barra', () => {
    const xml = construirSitemap(FALSO);
    expect(locs(xml)).toEqual(paginasIndexables.map((p) => `${FALSO}${p.ruta}`));
    for (const l of locs(xml)) expect(l.startsWith('https://')).toBe(true);
  });

  it('las legales NO entran: un sitemap no pide que indexen lo que lleva noindex', () => {
    const xml = construirSitemap(FALSO);
    expect(xml).not.toContain('/terminos/');
    expect(xml).not.toContain('/aviso-de-privacidad/');
  });

  it('es XML bien formado y declara el esquema de sitemaps.org', () => {
    const xml = construirSitemap(FALSO);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
  });

  it('no lleva lastmod ni priority: Google los ignora o los castiga', () => {
    const xml = construirSitemap(FALSO);
    expect(xml).not.toContain('<lastmod>');
    expect(xml).not.toContain('<priority>');
    expect(xml).not.toContain('<changefreq>');
  });
});

describe('CA-S5 · sin dominio el sitio no se deja indexar · ADR-0013', () => {
  it('el sitemap sale sin una sola URL', () => {
    const xml = construirSitemap(POR_CONFIRMAR);
    expect(xml).not.toContain('<loc>');
    expect(xml).toContain('D-07');
  });

  it('robots.txt prohíbe todo y no anuncia sitemap', () => {
    const txt = construirRobots(POR_CONFIRMAR);
    expect(txt).toContain('Disallow: /');
    expect(txt).not.toContain('Allow: /');
    expect(txt).not.toContain('Sitemap:');
  });

  it('no se puede armar una URL absoluta con el dominio abierto', () => {
    expect(absoluta('/', POR_CONFIRMAR)).toBe(POR_CONFIRMAR);
  });

  it('con dominio se abre solo: permite todo salvo las legales, y anuncia el sitemap', () => {
    const txt = construirRobots(FALSO);
    expect(txt).toContain('Allow: /');
    expect(txt).toContain('Disallow: /terminos/');
    expect(txt).toContain('Disallow: /aviso-de-privacidad/');
    expect(txt).toContain(`Sitemap: ${FALSO}/sitemap.xml`);
  });
});

describe('CA-S8 · la imagen de la tarjeta de enlace', () => {
  const ARCHIVO = `static${IMAGEN_TARJETA.ruta}`;

  it('existe donde el <head> la va a pedir', () => {
    expect(existsSync(ARCHIVO), `falta ${ARCHIVO} · se genera con herramientas/hacer-tarjeta.mjs`).toBe(true);
  });

  it('mide 1200×630, que es lo que pide Open Graph', () => {
    const b = readFileSync(ARCHIVO);
    let i = 2;
    let dim: [number, number] | null = null;
    while (i < b.length && !dim) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        dim = [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      } else i += 2 + b.readUInt16BE(i + 2);
    }
    expect(dim).toEqual([IMAGEN_TARJETA.ancho, IMAGEN_TARJETA.alto]);
  });

  it('pesa menos de 200 KB · por debajo de eso WhatsApp genera miniatura', () => {
    expect(statSync(ARCHIVO).size).toBeLessThan(200 * 1024);
  });

  it('lleva texto alternativo que describe la foto, sin afirmar nada más', () => {
    expect(IMAGEN_TARJETA.alt.length).toBeGreaterThan(20);
  });
});

import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  paginas, paginasIndexables, construirSitemap, construirRobots,
  absoluta, IMAGEN_TARJETA, INDEXACION_ABIERTA
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

  it('todas están marcadas como propuesta sin aprobar', () => {
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
  // Con dominio Y permiso: desde el ADR-0017 hacen falta las dos cosas, así que
  // estas pruebas de FORMA piden el estado abierto explícitamente.
  const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  it('con dominio: una <loc> por página indexable, absoluta y con barra', () => {
    const xml = construirSitemap(FALSO, true);
    expect(locs(xml)).toEqual(paginasIndexables.map((p) => `${FALSO}${p.ruta}`));
    for (const l of locs(xml)) expect(l.startsWith('https://')).toBe(true);
  });

  it('las legales NO entran: un sitemap no pide que indexen lo que lleva noindex', () => {
    const xml = construirSitemap(FALSO, true);
    expect(xml).not.toContain('/terminos/');
    expect(xml).not.toContain('/aviso-de-privacidad/');
  });

  it('es XML bien formado y declara el esquema de sitemaps.org', () => {
    const xml = construirSitemap(FALSO, true);
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
  });

  it('no lleva lastmod ni priority: Google los ignora o los castiga', () => {
    const xml = construirSitemap(FALSO, true);
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

  /**
   * Este test decía `expect(txt).not.toContain('Allow: /')` y cazó el ADR-0016,
   * que es exactamente lo que tenía que hacer. Pero afirmaba de más: que NADIE
   * pudiera pasar, cuando lo que hay que sostener es que **ningún buscador** pase.
   *
   * Los lectores de vista previa sí pasan a propósito desde el ADR-0016: sin ellos,
   * mandarle el borrador a Cristóbal por WhatsApp llega sin tarjeta. No indexan.
   *
   * Ahora se leen los grupos de verdad en vez de buscar cadenas sueltas.
   */
  const grupos = (txt: string) => {
    const salida: { agentes: string[]; reglas: string[] }[] = [];
    let actual: { agentes: string[]; reglas: string[] } | null = null;
    for (const cruda of txt.split('\n')) {
      const linea = cruda.replace(/#.*$/, '').trim();
      if (!linea) continue;
      const [clave, ...resto] = linea.split(':');
      const valor = resto.join(':').trim();
      if (/^user-agent$/i.test(clave)) {
        if (!actual || actual.reglas.length) { actual = { agentes: [], reglas: [] }; salida.push(actual); }
        actual.agentes.push(valor);
      } else if (actual) {
        actual.reglas.push(`${clave}: ${valor}`);
      }
    }
    return salida;
  };

  it('el grupo comodín prohíbe todo, que es lo que deja fuera a los buscadores', () => {
    const g = grupos(construirRobots(POR_CONFIRMAR)).find((x) => x.agentes.includes('*'));
    expect(g, 'no hay grupo User-agent: *').toBeDefined();
    expect(g!.reglas).toContain('Disallow: /');
    expect(g!.reglas.some((r) => r.startsWith('Allow:'))).toBe(false);
  });

  it('ningún buscador tiene grupo propio que lo deje entrar', () => {
    const BUSCADORES = ['googlebot', 'bingbot', 'yandex', 'duckduckbot', 'baiduspider'];
    for (const g of grupos(construirRobots(POR_CONFIRMAR))) {
      const esBuscador = g.agentes.some((a) => BUSCADORES.includes(a.toLowerCase()));
      if (esBuscador) expect(g.reglas, `${g.agentes.join(', ')} tiene permiso`).toContain('Disallow: /');
    }
  });

  it('los lectores de vista previa sí pasan · ADR-0016', () => {
    const g = grupos(construirRobots(POR_CONFIRMAR)).find((x) => x.agentes.includes('WhatsApp'));
    expect(g, 'WhatsApp no tiene grupo: el enlace llegaría sin tarjeta').toBeDefined();
    expect(g!.reglas).toContain('Allow: /');
    expect(g!.agentes).toContain('facebookexternalhit');
  });

  it('sin dominio no se anuncia sitemap', () => {
    expect(construirRobots(POR_CONFIRMAR)).not.toContain('Sitemap:');
  });

  it('no se puede armar una URL absoluta con el dominio abierto', () => {
    expect(absoluta('/', POR_CONFIRMAR)).toBe(POR_CONFIRMAR);
  });

  /**
   * ── EL DOMINIO YA NO ABRE LA INDEXACIÓN SOLO · ADR-0017 ──────────────────
   * Este test decía «con dominio se abre solo» y era la regla del ADR-0013.
   * Se separó: tener dominio es saber cuál es la dirección buena; estar indexable
   * es que el contenido merezca enseñarse. Hoy lo primero está cerca y lo segundo
   * no, así que hacen falta las dos cosas.
   */
  it('con dominio pero sin permiso, sigue cerrado', () => {
    const txt = construirRobots(FALSO, false);
    expect(txt).toContain('Disallow: /');
    expect(txt).not.toContain('Sitemap:');
    expect(construirSitemap(FALSO, false)).not.toContain('<loc>');
  });

  it('con dominio Y permiso: permite todo salvo las legales, y anuncia el sitemap', () => {
    const txt = construirRobots(FALSO, true);
    expect(txt).toContain('Allow: /');
    expect(txt).toContain('Disallow: /terminos/');
    expect(txt).toContain('Disallow: /aviso-de-privacidad/');
    expect(txt).toContain(`Sitemap: ${FALSO}/sitemap.xml`);
  });

  it('sin dominio, el permiso solo no alcanza', () => {
    expect(construirRobots(POR_CONFIRMAR, true)).toContain('Disallow: /');
    expect(construirSitemap(POR_CONFIRMAR, true)).not.toContain('<loc>');
  });

  /**
   * EL SEGUNDO CERROJO VIVE FUERA DEL CÓDIGO, Y ESO ES UNA TRAMPA.
   *
   * `vercel.json` manda `X-Robots-Tag: noindex, nofollow` en TODAS las respuestas.
   * Es una cabecera de servidor: gana sobre cualquier etiqueta del HTML. Si alguien
   * pone `INDEXACION_ABIERTA = true` y no la quita, el sitio sigue sin indexarse y
   * el síntoma es «lo abrimos y Google no hace nada» — semanas para descubrirlo.
   *
   * Este test cruza los dos y obliga a que digan lo mismo.
   */
  it('el interruptor y la cabecera de Vercel no se contradicen', () => {
    const vercel = readFileSync('vercel.json', 'utf8');
    const cabeceraCierra = /X-Robots-Tag[\s\S]*?noindex/.test(vercel);
    if (INDEXACION_ABIERTA) {
      expect(
        cabeceraCierra,
        'INDEXACION_ABIERTA es true pero vercel.json sigue mandando X-Robots-Tag: noindex. ' +
        'La cabecera gana sobre el HTML: quítala o el sitio no se indexa igual.'
      ).toBe(false);
    } else {
      expect(
        cabeceraCierra,
        'INDEXACION_ABIERTA es false: la cabecera de vercel.json debe seguir cerrando, ' +
        'que es el cerrojo que no depende de que nadie lea el HTML.'
      ).toBe(true);
    }
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

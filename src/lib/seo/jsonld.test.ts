import { describe, it, expect } from 'vitest';
import { construirGrafo, buscarSinConfirmar, DatoSinConfirmar } from './jsonld';
import { giros, girosConstruibles, girosBloqueados } from '$lib/datos/giros';
import { POR_CONFIRMAR } from '$lib/config/negocio';

describe('el @graph tiene la forma que pide la §4', () => {
  const g = construirGrafo();          // sin estricto: en dev se puede inspeccionar
  const [org, local, sitio] = g['@graph'] as any[];

  it('lleva Organization, LocalBusiness y WebSite, en ese orden', () => {
    expect(g['@context']).toBe('https://schema.org');
    expect(g['@graph']).toHaveLength(3);
    expect(org['@type']).toBe('Organization');
    expect(local['@type'][0]).toBe('LocalBusiness');
    expect(sitio['@type']).toBe('WebSite');
  });

  it('el @type del LocalBusiness es un ARRAY, con la categoría de Google en el segundo lugar', () => {
    expect(Array.isArray(local['@type'])).toBe(true);
    expect(local['@type']).toHaveLength(2);
    expect(local['@type'][0]).toBe('LocalBusiness');
    /**
     * Este test decía `toBe(POR_CONFIRMAR)`, es decir, afirmaba que la categoría
     * SIGUIERA sin decidir. Eso no es un criterio: es una foto del estado del
     * proyecto, y convierte cerrar una decisión en un test roto.
     *
     * Lo que sí hay que sostener es la FORMA: el segundo tipo existe y es un tipo de
     * schema.org, no una cadena cualquiera. Si algún día alguien escribe «Bazar» ahí
     * —que es la categoría de Google, no un tipo de schema.org— este test lo caza.
     */
    const segundo = local['@type'][1];
    expect(typeof segundo).toBe('string');
    expect(segundo.length).toBeGreaterThan(0);
    if (segundo !== POR_CONFIRMAR) {
      expect(segundo, 'un @type de schema.org va en PascalCase y sin acentos').toMatch(/^[A-Z][A-Za-z]+$/);
    }
  });

  it('el LocalBusiness cuelga de la Organization y el WebSite la declara editora', () => {
    expect(local.parentOrganization['@id']).toBe(org['@id']);
    expect(sitio.publisher['@id']).toBe(org['@id']);
  });
});

describe('los department salen de los giros y solo de los construibles', () => {
  const local = construirGrafo()['@graph'][1] as any;

  it('hay un department por giro construible', () => {
    expect(local.department).toHaveLength(girosConstruibles.length);
    expect(girosConstruibles.length).toBe(4);   // ADR-0008
  });

  it('ningún giro bloqueado aparece: declararlo sería prometer una página que no existe', () => {
    const slugs = local.department.map((d: any) => d.url);
    for (const g of girosBloqueados) {
      expect(slugs.some((u: string) => u.includes(g.slug))).toBe(false);
    }
    // Tres desde el ADR-0014: importaciones (D-04), avalúos (D-03) y bazar (D-18).
    // Bazar volvió como pregunta abierta, no como página: Google los clasifica así
    // y el ADR-0008 lo había sacado. Sigue sin generar ruta, que es lo que este
    // test protege.
    expect(girosBloqueados.length).toBe(3);
  });

  it('cada department cuelga de la misma Organization', () => {
    const idOrg = (construirGrafo()['@graph'][0] as any)['@id'];
    for (const d of local.department) expect(d.parentOrganization['@id']).toBe(idOrg);
  });
});

describe('CA-08 · el build no puede publicar datos sin confirmar', () => {
  it('en estricto lanza DatoSinConfirmar', () => {
    expect(() => construirGrafo({ estricto: true })).toThrow(DatoSinConfirmar);
  });

  it('el error dice CUÁLES faltan, no solo que faltan', () => {
    try {
      construirGrafo({ estricto: true });
      throw new Error('debió lanzar');
    } catch (e) {
      expect(e).toBeInstanceOf(DatoSinConfirmar);
      const err = e as DatoSinConfirmar;
      expect(err.campos.length).toBeGreaterThan(0);
      expect(err.message).toContain('decisiones-pendientes');
      // Hoy faltan, entre otros, el nombre legal y la categoría de Google.
      expect(err.campos.some((c) => c.includes('legalName'))).toBe(true);
    }
  });

  it('el buscador encuentra la marca a cualquier profundidad', () => {
    expect(buscarSinConfirmar({ a: { b: [{ c: POR_CONFIRMAR }] } })).toEqual(['$.a.b[0].c']);
    expect(buscarSinConfirmar({ a: 'listo' })).toEqual([]);
  });

  it('cuando todo esté confirmado, dejará de lanzar', () => {
    // Prueba de la lógica, no del estado actual: un grafo limpio no lanza.
    expect(buscarSinConfirmar({ nombre: 'X', tipo: ['LocalBusiness', 'PawnShop'] })).toEqual([]);
  });
});

describe('los slugs siguen siendo provisionales y eso está dicho en el código', () => {
  it('cada giro tiene slug, nombre y nombre corto', () => {
    for (const g of giros) {
      expect(g.slug).toMatch(/^[a-z0-9-]+$/);
      expect(g.nombre.length).toBeGreaterThan(0);
      expect(g.nombreCorto.length).toBeGreaterThan(0);
    }
  });
  it('los bloqueados dicen qué decisión los destraba', () => {
    for (const g of girosBloqueados) expect(g.bloqueadoPor).toMatch(/^D-\d\d$/);
  });
});

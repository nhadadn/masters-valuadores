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

  it('el @type del LocalBusiness es un ARRAY, con hueco para la categoría de Google', () => {
    expect(Array.isArray(local['@type'])).toBe(true);
    expect(local['@type']).toHaveLength(2);
    // El segundo tipo es la categoría primaria: factor de mayor peso, sale de D-02.
    expect(local['@type'][1]).toBe(POR_CONFIRMAR);
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
    expect(girosBloqueados.length).toBe(2);
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

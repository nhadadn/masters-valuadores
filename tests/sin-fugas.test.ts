import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * CA-06 · Ningún dato de negocio vive fuera de negocio.ts.
 *
 * Si un teléfono, una dirección o un horario se filtra a un componente o a una
 * ruta, el test del grafo deja de servir: ese dato se publicaría sin pasar por
 * la puerta que lo revisa.
 */

function archivos(dir: string, ext: string[]): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return archivos(p, ext);
    return ext.some((e) => n.endsWith(e)) ? [p] : [];
  });
}

const FUENTES = [
  ...archivos('src/routes', ['.svelte', '.ts']),
  ...archivos('src/lib/componentes', ['.svelte'])
];

const PATRONES: { nombre: string; re: RegExp }[] = [
  { nombre: 'teléfono de 10 dígitos', re: /\b\d{3}[ .-]?\d{3}[ .-]?\d{4}\b/ },
  { nombre: 'enlace de WhatsApp con número', re: /wa\.me\/\d/ },
  { nombre: 'tel: con número', re: /tel:\+?\d/ },
  { nombre: 'horario tipo 9:00', re: /\b\d{1,2}:\d{2}\b/ },
  { nombre: 'precio', re: /\$\s?\d/ },
  { nombre: 'porcentaje', re: /\b\d{1,3}\s?%(?!\))/ },
  { nombre: 'código postal', re: /\bC\.?P\.?\s?\d{5}\b/i }
];

describe('CA-06 · ningún dato de negocio se filtró fuera de negocio.ts', () => {
  for (const f of FUENTES) {
    it(`${f} está limpio`, () => {
      const texto = readFileSync(f, 'utf8')
        // los comentarios explican el sistema y pueden citar ratios y medidas
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
        // el CSS del componente lleva medidas: no son datos de negocio
        .replace(/<style>[\s\S]*?<\/style>/g, '');
      const hallazgos = PATRONES.filter((p) => p.re.test(texto)).map((p) => p.nombre);
      expect(hallazgos, `datos de negocio en ${f}: ${hallazgos.join(', ')}`).toEqual([]);
    });
  }

  it('se revisaron los archivos que importan', () => {
    expect(FUENTES.length).toBeGreaterThanOrEqual(10);
  });
});

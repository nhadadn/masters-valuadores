import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Ningún componente usa un token que no existe.
 *
 * POR QUÉ EXISTE ESTE TEST. El 10 de septiembre se reescribió el bloque de roles de
 * `tokens.css` para invertir el tema, y eso borró `--oscuro-peor` y `--grad-oscuro`.
 * Tres superficies seguían pidiéndolos: el encabezado, la banda de contacto y la
 * barra fija.
 *
 * El resultado fue que **el encabezado se quedó sin fondo** —`background-color`
 * resuelto a `rgba(0,0,0,0)`— y el contenido pasaba por debajo al hacer scroll.
 *
 * Lo grave es cómo falló: **en silencio**. CSS no avisa de un `var()` sin definir; la
 * propiedad simplemente no se aplica. El build pasó, los 38 tests pasaron y el
 * validador de accesibilidad también, porque el texto seguía contrastando contra lo
 * que hubiera detrás. Se descubrió mirando una captura.
 *
 * Este test convierte ese fallo silencioso en uno ruidoso.
 */

function archivos(dir: string, ext: string[]): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) return archivos(p, ext);
    return ext.some((e) => n.endsWith(e)) ? [p] : [];
  });
}

const TOKENS = readFileSync('src/lib/estilos/tokens.css', 'utf8');

/**
 * Todo lo que `tokens.css` declara.
 *
 * SIN ANCLAR A PRINCIPIO DE RENGLÓN: `tokens.css` declara varios por línea
 * —`--e-1: 4px;   --e-2: 8px;   --e-3: 12px;`— y anclando solo se veía el primero.
 * El patrón pide dos puntos después, así que no confunde un `var(--x)` con una
 * declaración.
 */
const declarados = new Set([...TOKENS.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));

const FUENTES = [
  ...archivos('src/lib/componentes', ['.svelte']),
  ...archivos('src/lib/estilos', ['.css']),
  ...archivos('src/routes', ['.svelte'])
];

describe('ningún componente pide un token que no existe', () => {
  for (const f of FUENTES) {
    it(`${f} solo usa tokens vivos`, () => {
      const texto = readFileSync(f, 'utf8');
      // Un componente puede declarar los suyos: `--oro-texto: ...` dentro de una regla.
      const propios = new Set([...texto.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
      const usados = [...texto.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)].map((m) => m[1]);
      const huerfanos = [...new Set(usados)].filter((t) => !declarados.has(t) && !propios.has(t));
      expect(huerfanos, `tokens sin definir en ${f}`).toEqual([]);
    });
  }
});

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * El guardia de CA-10 se verifica a sí mismo.
 *
 * POR QUÉ EXISTE ESTE TEST. `herramientas/presupuesto.mjs` ya había fallado una vez
 * —lo cuenta su propio encabezado— cuando el mapa de Google metió 425.6 KB en la
 * portada y el guardia siguió imprimiendo «0 KB · margen de 40 KB», porque solo sabía
 * pesar el bundle propio.
 *
 * El 11 de septiembre, al estudiar cómo animar sin marco, se midió otra vez y
 * resultó que la misma falla seguía viva en la otra dirección: de cinco formas de
 * meter JavaScript en una página, TRES eran invisibles.
 *
 *     bundle de SvelteKit                       SÍ · contaba bytes
 *     librería propia servida desde static/     NO — INVISIBLE
 *     librería de node_modules copiada a static NO — INVISIBLE
 *     <script> en línea                         NO — INVISIBLE
 *     librería desde un CDN                     SÍ · exigía declararla
 *
 * Lo peligroso es cuál era el hueco: el camino MÁS BARATO para animar —un script
 * propio, sin runtime— era justo el que no se veía. El guardia habría dado permiso
 * por escrito para mandarle una librería entera al teléfono de gama baja del
 * contrato.
 *
 * Así que el guardia deja de ser una creencia. Estas pruebas le construyen páginas
 * falsas y comprueban que las caza. Si alguien vuelve a estrechar la medición, esto
 * se pone rojo antes de que llegue a producción.
 */

const GUARDIA = 'herramientas/presupuesto.mjs';
const LIMITE_KB = 40;
let raiz: string;

/**
 * Relleno reproducible y DIFÍCIL DE COMPRIMIR.
 *
 * El primer intento de este test usaba `function f0(x){return x*0+0;}` repetido 4000
 * veces. Son 150 KB en disco que gzip deja en 3, así que los tres casos «se pasa del
 * presupuesto» salieron verdes sin probar nada. CA-10 mide COMPRIMIDO; el relleno
 * tiene que resistir la compresión o el test se engaña solo.
 */
function relleno(cuantos: number): string {
  let semilla = 20260911;
  const trozos: string[] = [];
  for (let i = 0; i < cuantos; i++) {
    semilla = (semilla * 1103515245 + 12345) & 0x7fffffff;
    trozos.push(`"${semilla.toString(36)}"`);
  }
  return `var d=[${trozos.join(',')}];`;
}

/** Una página con lo que se le ponga dentro del <body>. */
function pagina(dir: string, cuerpo: string) {
  writeFileSync(join(dir, 'index.html'), `<!doctype html><html><body>${cuerpo}</body></html>`);
}

/** Corre el guardia contra un directorio falso. */
function correr(dir: string) {
  let salida: string;
  let codigo: number;
  try {
    salida = execFileSync('node', [GUARDIA, dir], { encoding: 'utf8' });
    codigo = 0;
  } catch (e) {
    const err = e as { stdout?: string; stderr?: string; status?: number };
    salida = (err.stdout ?? '') + (err.stderr ?? '');
    codigo = err.status ?? 1;
  }
  // Cuántos KB dice que pesa la peor página. Es el número que decide.
  const kb = Number(/Peor página:.*con ([\d.]+) KB/.exec(salida)?.[1] ?? NaN);
  return { salida, codigo, kb };
}

/** Un caso aislado: un directorio, una página, un veredicto. */
function veredicto(cuerpo: string, extras?: (dir: string) => void) {
  const dir = mkdtempSync(join(raiz, 'caso-'));
  pagina(dir, cuerpo);
  extras?.(dir);
  return correr(dir);
}

beforeAll(() => { raiz = mkdtempSync(join(tmpdir(), 'ca10-')); });
afterAll(() => { rmSync(raiz, { recursive: true, force: true }); });

describe('CA-10 · qué JavaScript sabe ver el guardia', () => {
  it('una página sin JavaScript pasa, y reporta cero', () => {
    const { salida, codigo, kb } = veredicto('<h1>hola</h1>');
    expect(codigo).toBe(0);
    expect(kb).toBe(0);
    expect(salida).toContain('CA-10 cumplido');
  });

  it('el JSON-LD NO cuenta como JavaScript: son datos, no código', () => {
    // Hay 8 en el sitio, uno por página. Contarlos sería mentir en la otra
    // dirección, y su peso ya sale en la columna HTML.
    const grafo = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Store' }).repeat(200);
    const { codigo, kb } = veredicto(`<script type="application/ld+json">${grafo}</script>`);
    expect(codigo).toBe(0);
    expect(kb).toBe(0);
  });

  // ── LOS TRES QUE ERAN INVISIBLES ─────────────────────────────────────────

  it('CAZA una librería propia servida desde static/, y la pesa', () => {
    const { salida, codigo, kb } = veredicto('<script src="/vendor/animacion.js"></script>', (dir) => {
      mkdirSync(join(dir, 'vendor'), { recursive: true });
      writeFileSync(join(dir, 'vendor', 'animacion.js'), relleno(14000));
    });
    expect(kb).toBeGreaterThan(LIMITE_KB);   // la VE y la pesa
    expect(codigo).toBe(1);                   // y por eso revienta el build
    expect(salida).toContain('CA-10 INCUMPLIDO');
  });

  it('CAZA un <script> en línea, y lo pesa', () => {
    const { salida, codigo, kb } = veredicto(`<script>${relleno(14000)}</script>`);
    expect(kb).toBeGreaterThan(LIMITE_KB);
    expect(codigo).toBe(1);
    expect(salida).toContain('CA-10 INCUMPLIDO');
  });

  it('CAZA un src que apunta a un archivo que no existe, en vez de pesarlo cero', () => {
    // El peor fallo posible: el número sale BAJO y parece bueno.
    const { salida, codigo } = veredicto('<script src="/monedas.js"></script>');
    expect(codigo).toBe(1);
    expect(salida).toContain('monedas.js');
  });

  // ── LOS DOS QUE YA SE VEÍAN, QUE NO SE ROMPIERON ─────────────────────────

  it('sigue cazando un tercero sin declarar', () => {
    const { salida, codigo } = veredicto('<script src="https://cdn.jsdelivr.net/npm/gsap/gsap.min.js"></script>');
    expect(codigo).toBe(1);
    expect(salida).toContain('SIN DECLARAR');
  });

  it('sigue pesando el bundle del marco, si algún día se enciende csr', () => {
    const { codigo, kb } = veredicto('<script src="/_app/immutable/entry/start.aBc123.js"></script>', (dir) => {
      mkdirSync(join(dir, '_app', 'immutable', 'entry'), { recursive: true });
      writeFileSync(join(dir, '_app', 'immutable', 'entry', 'start.aBc123.js'), relleno(14000));
    });
    expect(kb).toBeGreaterThan(LIMITE_KB);
    expect(codigo).toBe(1);
  });

  it('un archivo referenciado dos veces se paga UNA vez', () => {
    const uno = veredicto('<script src="/x.js"></script>', (dir) => {
      writeFileSync(join(dir, 'x.js'), relleno(2000));
    });
    const dos = veredicto('<script src="/x.js"></script><script src="/x.js"></script>', (dir) => {
      writeFileSync(join(dir, 'x.js'), relleno(2000));
    });
    expect(uno.kb).toBeGreaterThan(0);
    expect(dos.kb).toBe(uno.kb);
  });
});

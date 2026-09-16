import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

/**
 * El movimiento del circuito del proceso · ADR-0050.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 * Las condiciones con las que se aceptó mover esa sección. Si se pierde cualquiera de
 * ellas, el build pasa, el validador de accesibilidad pasa —mide colores, no
 * opacidad— y la sección se sigue viendo bien en la máquina de quien la toca:
 *
 *   1 · TODO el movimiento va dentro de `prefers-reduced-motion: no-preference`. Fuera
 *       de ese bloque, quien le pidió a su teléfono menos movimiento vería la luz igual.
 *   2 · Lo que ata el movimiento al desplazamiento va dentro de
 *       `@supports (animation-timeline: view())`.
 *   3 · Nada queda escondido fuera de esos guardias: una `opacity: 0` suelta es texto o
 *       trazo invisible para siempre en quien no tiene animación.
 *   4 · Los fotogramas clave solo animan `transform`, `opacity` y `visibility`. Con
 *       `clip-path`, la misma luz ocupó 3.8–4.1 s de hilo principal por cada 7.2 s de
 *       ciclo con el procesador a 1/4, contra 52–91 ms trasladándola.
 *
 * Se lee el `<style>` del componente y se recorre con una pila de bloques: cada
 * declaración sabe dentro de qué `@media`, `@supports` y `@keyframes` vive.
 */

const fuente = readFileSync('src/lib/componentes/FlujoProceso.svelte', 'utf8');
const estilo = (fuente.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');

interface Declaracion { propiedad: string; valor: string; bloques: string[] }

function recorrer(css: string): Declaracion[] {
  const salida: Declaracion[] = [];
  const pila: string[] = [];
  let trozo = '';
  const anotar = () => {
    const i = trozo.indexOf(':');
    if (i > 0) salida.push({ propiedad: trozo.slice(0, i).trim(), valor: trozo.slice(i + 1).trim(), bloques: [...pila] });
    trozo = '';
  };
  for (const c of css) {
    if (c === '{') { pila.push(trozo.trim()); trozo = ''; }
    else if (c === '}') { anotar(); pila.pop(); }
    else if (c === ';') anotar();
    else trozo += c;
  }
  return salida;
}

const declaraciones = recorrer(estilo);
const MOVIMIENTO = /prefers-reduced-motion:\s*no-preference/;
const SOPORTE = /^@supports\s*\(\s*animation-timeline:\s*view\(\)\s*\)$/;
const dentro = (d: Declaracion, patron: RegExp) => d.bloques.some((b) => patron.test(b));
const enFotograma = (d: Declaracion) => d.bloques.some((b) => b.startsWith('@keyframes'));
const donde = (d: Declaracion) => `${d.bloques.join(' › ')} { ${d.propiedad}: ${d.valor} }`;

describe('movimiento del circuito del proceso · ADR-0050', () => {
  it('hay movimiento que vigilar', () => {
    // Si esto falla, el movimiento se quitó o se movió de archivo y los guardias de
    // abajo pasarían sin mirar nada.
    expect(declaraciones.some((d) => d.propiedad === 'animation')).toBe(true);
    expect(declaraciones.some((d) => d.propiedad === 'animation-timeline')).toBe(true);
  });

  it('todo el movimiento respeta «reducir movimiento»', () => {
    const sueltas = declaraciones.filter((d) => /^(animation|view-timeline)/.test(d.propiedad) && !dentro(d, MOVIMIENTO));
    expect(sueltas.map(donde)).toEqual([]);
  });

  it('lo atado al desplazamiento solo corre donde el navegador lo soporta', () => {
    const sueltas = declaraciones.filter(
      (d) => /^(animation-timeline|animation-range|view-timeline)$/.test(d.propiedad) && !dentro(d, SOPORTE)
    );
    expect(sueltas.map(donde)).toEqual([]);
  });

  it('nada queda escondido fuera de los guardias', () => {
    const escondidas = declaraciones.filter(
      (d) =>
        !enFotograma(d) &&
        ((d.propiedad === 'opacity' && parseFloat(d.valor) === 0) || (d.propiedad === 'visibility' && d.valor === 'hidden')) &&
        !dentro(d, MOVIMIENTO)
    );
    expect(escondidas.map(donde)).toEqual([]);
  });

  it('los fotogramas clave solo animan transform, opacity y visibility', () => {
    const caras = declaraciones.filter((d) => enFotograma(d) && !['transform', 'opacity', 'visibility'].includes(d.propiedad));
    expect(caras.map(donde)).toEqual([]);
  });
});

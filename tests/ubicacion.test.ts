import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Ubicacion from '../src/lib/componentes/Ubicacion.svelte';
import { readFileSync } from 'node:fs';
import {
  negocio, sucursalPrincipal, direccionCompleta, horariosLegibles, mapaEmbed, estaConfirmado
} from '../src/lib/config/negocio';

/**
 * «DÓNDE ESTAMOS» como lienzo partido · ADR-0051.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 * Lo que se decidió al cambiar la sección, y que nada rompe en silencio si se pierde:
 *
 *   · «Ver el mapa» vive DENTRO del lienzo. Fue la condición con la que Nadir eligió
 *     esta versión: sin perder «Ver el mapa» del cuadro principal.
 *   · La marca del lienzo es la del sitio: dibujada, con la grafía MASTER, y sin
 *     imagen. Una foto del logo «rugged» con banderas se descartó con tres ADR.
 *   · Dirección, horarios y «Cómo llegar» salen de `negocio.ts`, no se escriben aquí.
 *   · Las horas van en rejilla: la hora de «Lunes a viernes» se desalineaba 21 px.
 *   · Ninguna flecha de texto: el iPhone pinta la ↗ como emoji azul.
 *
 * Se renderiza en el servidor, como en el prerender: es el HTML que se publica.
 */

const conTitulo = render(Ubicacion, { props: { titulo: 'Aquí nos encuentras' } }).body;
const sinTitulo = render(Ubicacion, { props: {} }).body;
const franja = render(Ubicacion, { props: { franja: true } }).body;
const lienzo = (html: string) => html.slice(html.indexOf('class="lienzo'), html.indexOf('class="ficha'));
const ficha = (html: string) => html.slice(html.indexOf('class="ficha'));

describe('DÓNDE ESTAMOS · lienzo partido · ADR-0051', () => {
  it('«Ver el mapa» vive dentro del lienzo, no en la ficha', () => {
    // Sin coordenadas confirmadas no hay mapa que ofrecer, y el lienzo queda con la marca.
    if (!estaConfirmado(mapaEmbed())) return expect(lienzo(conTitulo)).not.toContain('Ver el mapa');
    expect(lienzo(conTitulo)).toMatch(/<details[^>]*class="mapa/);
    expect(lienzo(conTitulo)).toContain('Ver el mapa');
    expect(ficha(conTitulo)).not.toContain('Ver el mapa');
  });

  it('el lienzo lleva la marca del sitio: dibujada, con su grafía y sin imagen', () => {
    const l = lienzo(conTitulo);
    expect(l).toContain(`>${negocio.nombreComercial}<`);
    expect(l).toMatch(/<svg\b/);
    expect(l).not.toMatch(/<img\b/);
    expect(l).not.toMatch(/MÁSTER|MASTERS/);
  });

  it('dirección, horarios y «Cómo llegar» salen de negocio.ts', () => {
    const f = ficha(conTitulo);
    expect(f).toContain(direccionCompleta() as string);
    for (const h of horariosLegibles() as { dias: string; horas: string }[]) {
      expect(f).toContain(h.dias);
      expect(f).toContain(h.horas);
    }
    expect(f).toContain(`href="${sucursalPrincipal.mapaUrl}"`);
  });

  it('las horas van en rejilla de definición: un día, una hora', () => {
    const f = ficha(conTitulo);
    const dias = (horariosLegibles() as unknown[]).length;
    expect((f.match(/<dt\b/g) ?? []).length).toBe(dias);
    expect((f.match(/<dd\b/g) ?? []).length).toBe(dias);
  });

  it('ninguna flecha de texto, ni aquí ni en el pie', () => {
    // La banda del pie salió con el ADR-0053; su «Cómo llegar» vive ahora en la plantilla común.
    const pie = readFileSync('src/routes/+layout.svelte', 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/<style>[\s\S]*<\/style>/, '');
    for (const html of [conTitulo, pie]) expect(html).not.toMatch(/[↗↘→]/);
  });

  it('el título es opcional: la página de línea ya trae su pregunta numerada', () => {
    expect(conTitulo).toMatch(/<h2[^>]*>Aquí nos encuentras<\/h2>/);
    expect(sinTitulo).not.toMatch(/<h2\b/);
  });
});

/**
 * LA FRANJA · ADR-0059. En las páginas de línea la ubicación y el pie decían lo mismo:
 * 704 px de sección más 573 de pie a 390 de ancho. La franja se queda con lo que el pie
 * no tiene —el mapa— y con lo que se busca con prisa; el horario lo dice solo el pie.
 */
describe('la franja de las páginas de línea · ADR-0059', () => {
  it('se queda el mapa, la dirección, la referencia y «Cómo llegar»', () => {
    if (estaConfirmado(mapaEmbed())) expect(lienzo(franja)).toContain('Ver el mapa');
    const f = ficha(franja);
    expect(f).toContain(direccionCompleta() as string);
    if (estaConfirmado(sucursalPrincipal.referencia)) expect(f).toContain(sucursalPrincipal.referencia as string);
    expect(f).toContain(`href="${sucursalPrincipal.mapaUrl}"`);
  });

  it('sin horarios: los dice el pie, justo debajo', () => {
    const f = ficha(franja);
    expect(f).not.toContain('data-negocio="horarios"');
    expect(f).not.toMatch(/<dl\b/);
  });

  it('portada y contacto siguen con la versión completa', () => {
    expect(ficha(conTitulo)).toContain('data-negocio="horarios"');
    expect(conTitulo).not.toMatch(/class="ubicacion[^"]*\bfranja\b/);
    expect(franja).toMatch(/class="ubicacion[^"]*\bfranja\b/);
  });
});

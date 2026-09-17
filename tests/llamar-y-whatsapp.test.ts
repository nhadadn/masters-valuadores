import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import Portada from '../src/routes/+page.svelte';
import Contacto from '../src/routes/contacto/+page.svelte';
import { sucursalPrincipal, estaConfirmado } from '../src/lib/config/negocio';
import { enlaceTelefono } from '../src/lib/datos/telefono';
import { hayWhatsApp } from '../src/lib/datos/whatsapp';

/**
 * ADR-0052 · la portada no repite WhatsApp, y «Llamar» llama.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 * Dos fallos que no rompen nada al construir y que solo se ven usando el sitio:
 *
 *   · «TE ATENDEMOS POR WHATSAPP» repetía, botón por botón, los cinco mensajes de los
 *     botones verdes del mosaico. Salió. Si alguien vuelve a poner un botón con un
 *     mensaje que ya existe en la portada, esto lo dice.
 *   · Los tres «Llamar» del sitio no llamaban: la portada mandaba a contacto y contacto
 *     a la portada. Con el número confirmado, los tres tienen que ser `tel:`.
 *
 * Se renderizan las páginas en el servidor, sin la plantilla común: la cabecera y la
 * barra fija tienen su propio enlace para llamar, y no son de lo que aquí se vigila.
 */

const portada = render(Portada, { props: {} }).body;
const contacto = render(Contacto, { props: {} }).body;

const mensajes = (html: string) =>
  [...html.matchAll(/href="https:\/\/wa\.me\/\d+\?text=([^"]+)"/g)].map((m) => decodeURIComponent(m[1].replace(/&amp;/g, '&')));
/** El destino de cada enlace cuyo texto dice «Llamar». */
const llamadas = (html: string) =>
  [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>(?:(?!<\/a>)[\s\S])*?Llamar(?:(?!<\/a>)[\s\S])*?<\/a>/g)].map((m) => m[1]);

describe('la portada no repite WhatsApp y «Llamar» llama · ADR-0052', () => {
  it('ningún mensaje de WhatsApp se repite en la portada', () => {
    // Desde el ADR-0057 la portada no lleva mensajes escritos: eran los de los botones del
    // mosaico, que salieron. Lo que no puede es quedarse sin WhatsApp.
    if (hayWhatsApp()) expect(portada).toMatch(/href="https:\/\/wa\.me\/\d+/);
    const m = mensajes(portada);
    expect(m.filter((x, i) => m.indexOf(x) !== i)).toEqual([]);
  });

  it('la sección «TE ATENDEMOS POR WHATSAPP» no vuelve', () => {
    expect(portada).not.toContain('TE ATENDEMOS POR WHATSAPP');
  });

  it('el enlace para llamar sale de negocio.ts, sin espacios', () => {
    const tel = sucursalPrincipal.telefono;
    if (!estaConfirmado(tel)) return expect(enlaceTelefono()).toBeUndefined();
    expect(enlaceTelefono()).toBe(`tel:${String(tel).replace(/\s/g, '')}`);
    expect(enlaceTelefono()).not.toMatch(/\s/);
  });

  it('los tres «Llamar» llaman: dos en la portada y uno en contacto', () => {
    const tel = enlaceTelefono();
    const enPortada = llamadas(portada), enContacto = llamadas(contacto);
    if (!tel) {
      // Sin número: la portada manda a contacto y contacto no pinta el botón.
      expect(enPortada.every((h) => h === '/contacto/')).toBe(true);
      return expect(enContacto).toEqual([]);
    }
    expect(enPortada).toEqual([tel, tel]);
    expect(enContacto).toEqual([tel]);
  });
});

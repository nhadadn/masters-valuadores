import { describe, it, expect, vi } from 'vitest';
import { render } from 'svelte/server';
import { createRawSnippet } from 'svelte';
import DatosDelLocal from '../src/lib/componentes/DatosDelLocal.svelte';
import Plantilla from '../src/routes/+layout.svelte';
import { negocio, sucursalPrincipal, estaConfirmado } from '../src/lib/config/negocio';
import { construirGrafo } from '../src/lib/seo/jsonld';

/**
 * El correo y la referencia para llegar · ADR-0058.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 * Dos datos que llegaron en la tanda del 17 de septiembre y que Nadir aprobó publicar:
 *
 *   · El correo sale en el pie de las nueve páginas, en la ficha de contacto y en el `email`
 *     del grafo. Si se cae de alguno, nada falla al construir.
 *   · La referencia —«Frente a Al Super del Periférico»— va JUNTO a la dirección, nunca en
 *     su lugar: la dirección es la de su ficha de Google y el NAP tiene que ser idéntico.
 *
 * Los dos salen de `negocio.ts` y lo declaran con `data-negocio`. Escribirlos a mano en una
 * plantilla lo caza `sin-fugas.test.ts`.
 *
 * La plantilla se renderiza con la ruta y el modo de desarrollo simulados, como en
 * `otras-lineas.test.ts`.
 */

vi.mock('$app/state', () => ({ page: { url: new URL('http://localhost/contacto/') } }));
vi.mock('$app/environment', () => ({ dev: true, browser: false, building: false, version: 'test' }));

const contenido = createRawSnippet(() => ({ render: () => '<p>contenido</p>' }));
const correo = negocio.correo as string;
const referencia = sucursalPrincipal.referencia as string;

describe('correo y referencia · ADR-0058', () => {
  it('los dos están confirmados en negocio.ts, y el correo tiene forma de correo', () => {
    expect(estaConfirmado(negocio.correo)).toBe(true);
    expect(estaConfirmado(sucursalPrincipal.referencia)).toBe(true);
    expect(correo).toMatch(/^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i);
  });

  it('el pie enlaza el correo y pone la referencia bajo la dirección', () => {
    const { body } = render(Plantilla, { props: { children: contenido } });
    const pie = body.slice(body.indexOf('<footer'), body.indexOf('</footer>'));
    expect(pie).toMatch(new RegExp(`href="mailto:${correo.replace(/[.+]/g, '\\$&')}"[^>]*data-negocio="correo"`));
    const direccionEn = pie.indexOf('data-negocio="direccion"');
    const referenciaEn = pie.indexOf('data-negocio="referencia"');
    expect(direccionEn).toBeGreaterThan(-1);
    expect(referenciaEn).toBeGreaterThan(direccionEn);
    expect(pie).toContain(referencia);
  });

  it('la ficha lleva la referencia siempre y el correo solo donde lleva teléfono', () => {
    const sin = render(DatosDelLocal, { props: {} }).body;
    const con = render(DatosDelLocal, { props: { conTelefono: true } }).body;
    for (const html of [sin, con]) {
      expect(html).toContain(referencia);
      expect(html.indexOf('data-negocio="referencia"')).toBeGreaterThan(html.indexOf('data-negocio="direccion"'));
    }
    expect(sin).not.toContain('mailto:');
    expect(con).toContain(`href="mailto:${correo}"`);
  });

  it('el grafo declara el correo en la organización y en el local', () => {
    const grafo = construirGrafo() as { '@graph': Record<string, unknown>[] };
    const [organizacion, local] = grafo['@graph'];
    expect(organizacion.email).toBe(correo);
    expect(local.email).toBe(correo);
  });
});

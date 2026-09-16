import { describe, it, expect } from 'vitest';
import { giros, type PasoFlujo } from '../src/lib/datos/giros';
import { iconos } from '../src/lib/datos/iconos';

/**
 * El flujo del proceso · ADR-0042.
 *
 * ── QUÉ VIGILA Y POR QUÉ ──────────────────────────────────────────────────
 * Esta pieza existe para que la sección 2 se lea de un vistazo. Eso lo garantiza una
 * cosa y solo una: que `que` sea corto. Un campo de texto libre llamado `que` se
 * alarga solo —basta que alguien pegue ahí la frase de `pasosPropuestos` «porque se
 * entiende mejor»— y el día que pase, la pieza vuelve a ser el párrafo que vino a
 * sustituir, sin que nada se ponga rojo.
 *
 * El otro guardia es el ícono. `Icono.svelte` resuelve un nombre desconocido a
 * cadena vacía y pinta un `<svg>` vacío: un disco de oro de 36 px sin nada dentro,
 * que no rompe el build, no rompe el test de accesibilidad —es `aria-hidden`— y solo
 * se ve mirando la página. Justo la clase de fallo que este repo ya pagó caro con la
 * pausa del planeta del ADR-0040.
 *
 * NO se verifica el `dato`: es texto de apoyo, se lee si interesa y puede ser largo
 * sin hacer daño. Poner un tope ahí sería ceremonia.
 */

const TOPE_PALABRAS = 4;

const conFlujo = giros.filter((g) => g.flujo);

/** Todos los momentos de un giro, incluido el retorno: el tope aplica igual. */
function momentos(g: (typeof giros)[number]): PasoFlujo[] {
  return g.retorno ? [...(g.flujo ?? []), g.retorno] : (g.flujo ?? []);
}

describe('flujo del proceso · ADR-0042', () => {
  it('hay al menos un giro con flujo escrito', () => {
    // Si esto falla es que alguien borró los datos y la plantilla cayó, en silencio,
    // a la lista de `pasosPropuestos`. La página seguiría construyendo.
    expect(conFlujo.length).toBeGreaterThan(0);
  });

  it.each(conFlujo.map((g) => g.slug))('«%s» · cada acción cabe en un vistazo', (slug) => {
    const giro = giros.find((g) => g.slug === slug)!;
    for (const m of momentos(giro)) {
      const palabras = m.que.trim().split(/\s+/).length;
      expect(
        palabras,
        `«${m.que}» tiene ${palabras} palabras. El tope es ${TOPE_PALABRAS}: lo que no quepa va en \`dato\`.`
      ).toBeLessThanOrEqual(TOPE_PALABRAS);
    }
  });

  it.each(conFlujo.map((g) => g.slug))('«%s» · ningún ícono es un disco vacío', (slug) => {
    const giro = giros.find((g) => g.slug === slug)!;
    for (const m of momentos(giro)) {
      expect(iconos[m.icono], `el ícono «${m.icono}» no existe en iconos.ts`).toBeTruthy();
    }
  });

  it.each(conFlujo.map((g) => g.slug))('«%s» · la acción no termina en punto', (slug) => {
    // `que` es una etiqueta, no una frase. El punto final es el primer síntoma de que
    // alguien copió la oración entera de `pasosPropuestos`.
    const giro = giros.find((g) => g.slug === slug)!;
    for (const m of momentos(giro)) {
      expect(m.que.endsWith('.'), `«${m.que}» termina en punto`).toBe(false);
    }
  });

  /**
   * EL CORCHETE NO PUEDE MENTIR. Es el único elemento de la pieza que afirma algo por
   * su cuenta —que el bien vuelve— y solo es cierto donde hay préstamo con garantía.
   * Si mañana alguien le pone `retorno` a fletes, esto se pone rojo antes de publicar
   * que los camiones regresan la carga.
   */
  it('solo empeño cierra el círculo', () => {
    const conRetorno = giros.filter((g) => g.retorno).map((g) => g.slug);
    expect(conRetorno).toEqual(['empeno-y-prestamo']);
  });

  /**
   * LOS TRES DATOS QUE SOLO VIVEN AQUÍ. Las secciones «¿Qué necesito llevar?» y el
   * bloque de cifras se borraron en el ADR-0040, así que la identificación, el
   * contrato y el resguardo dejaron de tener otro sitio en la página. El chip es su
   * única casa. Si alguien los recorta «para que quede más limpio», el sitio deja de
   * decir qué hay que llevar al mostrador.
   */
  it('empeño conserva identificación, contrato y resguardo', () => {
    const empeno = giros.find((g) => g.slug === 'empeno-y-prestamo')!;
    const texto = momentos(empeno)
      .map((m) => `${m.que} ${m.dato ?? ''}`)
      .join(' ')
      .toLowerCase();

    for (const dato of ['identificación', 'contrato', 'resguard']) {
      expect(texto, `el flujo de empeño ya no menciona «${dato}»`).toContain(dato);
    }
  });
});

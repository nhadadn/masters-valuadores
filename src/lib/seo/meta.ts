/**
 * TÍTULO Y DESCRIPCIÓN DE CADA PÁGINA · TODAS SON PROPUESTA SIN APROBAR.
 *
 * ── Por qué esto existe ───────────────────────────────────────────────────
 * Hasta hoy el `<title>` de la portada decía, literalmente:
 *
 *     MASTERS VALUADORES · __POR_CONFIRMAR__
 *
 * y la descripción decía «__POR_CONFIRMAR__ · descripción de la portada, no se
 * inventa». CA-08 no las cazaba: el guardia del build revisa el grafo JSON-LD, y
 * el `<head>` no pasa por ahí. O sea que la marca de «esto no está listo» estaba
 * en el sitio, pero en el único lugar donde nadie del equipo la mira.
 *
 * ── Por qué se pueden redactar ────────────────────────────────────────────
 * El `CLAUDE.md`, corregido el 10 de septiembre, separa inventar de redactar:
 *
 *   SÍ: «titulares, subtítulos, etiquetas de sección, descripciones de un giro
 *        que solo digan lo que ese giro es por definición».
 *   SIEMPRE: «marcado como propuesta, nunca publicado como hecho».
 *
 * Un `<title>` es un titular y una `description` es un subtítulo. Se redactan
 * bajo la misma vara que los `subtitularPropuesto` de `giros.ts`, que ya viven
 * en el sitio con la misma marca.
 *
 * ── Ni una afirmación que Cristóbal tenga que sostener ────────────────────
 * Ninguna trae cifra, plazo, tasa, horario ni superlativo. Ninguna promete que
 * algo pase el mismo día. Lo único que dicen es qué es cada línea POR DEFINICIÓN,
 * más el lugar —y el lugar sale de `negocio.ts`, no de aquí.
 *
 * Y no se publican a ciegas: mientras D-07 siga abierta todo el sitio va
 * `noindex` (ADR-0013), así que ninguna de estas frases puede llegar a un
 * resultado de búsqueda antes de que él las corrija.
 *
 * Van al documento de requerimientos para que las palomee o las tache.
 */

import { negocio, sucursalPrincipal, estaConfirmado } from '$lib/config/negocio';
import { girosConstruibles } from '$lib/datos/giros';
import { paginas } from './enlaces';

const MARCA = `${negocio.nombreComercial} VALUADORES`;

/** «Torreón, Coahuila», o vacío si algún día dejaran de estar confirmados. */
const lugar = [sucursalPrincipal.ciudad, sucursalPrincipal.estado]
  .filter(estaConfirmado)
  .join(', ');
const ciudad = estaConfirmado(sucursalPrincipal.ciudad) ? sucursalPrincipal.ciudad : '';
const en = lugar ? ` en ${lugar}` : '';
const enCiudad = ciudad ? ` en ${ciudad}` : '';

export interface Ficha {
  /** Lo que se ve en la pestaña y en el resultado de búsqueda. */
  titulo: string;
  /** Lo que se ve bajo el título, y en la tarjeta de WhatsApp. */
  descripcion: string;
  /** Redactado por nosotros y sin aprobar. Hoy son las ocho. */
  propuesta: boolean;
}

/**
 * Las descripciones de giro se escriben aquí y no se derivan de
 * `subtitularPropuesto`. Son trabajos distintos: el subtitular acompaña a un
 * titular que ya se leyó, la descripción tiene que funcionar sola, fuera del
 * sitio, junto a otros nueve resultados. Derivar una de la otra las haría
 * peores a las dos.
 */
const DE_GIRO: Record<string, { titulo: string; descripcion: string }> = {
  'empeno-y-prestamo': {
    titulo: `Empeño y préstamo${enCiudad} · ${MARCA}`,
    descripcion: `Dejas un bien en garantía y sales con efectivo. Lo valuamos y te decimos cuánto te podemos prestar. Empeño${en}.`
  },
  'venta': {
    titulo: `Venta de maquinaria, herramienta y autos${enCiudad} · ${negocio.nombreComercial}`,
    descripcion: `Vendemos lo que tenemos: maquinaria, herramienta, autos y lo que no se recupera del empeño${en}. Pregúntanos qué hay disponible.`
  },
  'financiamiento': {
    titulo: `Financiamiento de maquinaria${enCiudad} · ${MARCA}`,
    descripcion: `Financiamos la maquinaria que vendemos${en}. Dinos qué equipo te interesa y te explicamos cómo funciona el financiamiento.`
  },
  'fletes': {
    titulo: `Fletes${enCiudad} · ${MARCA}`,
    descripcion: `Transporte y movimiento de carga${en}. Dinos qué necesitas mover y a dónde, y te decimos si podemos hacerlo.`
  },
  'taller': {
    titulo: `Taller${enCiudad} · ${negocio.nombreComercial}`,
    descripcion: `Servicio de taller${en}. Traes tu unidad, la revisamos y te decimos qué necesita antes de que autorices el trabajo.`
  }
};

const FIJAS: Record<string, { titulo: string; descripcion: string }> = {
  '/': {
    titulo: `Empeño, venta, financiamiento, fletes y taller${enCiudad}`,   // 57 de 60: con la marca no cabe
    descripcion: `Cinco líneas de negocio bajo una marca${en}: empeño y préstamo, venta, financiamiento de maquinaria, fletes y taller.`
  },
  '/contacto/': {
    titulo: `Contacto · ${MARCA}${enCiudad}`,
    descripcion: `Cómo localizar a ${MARCA}${en}. Escríbenos y te decimos si lo que traes entra en alguna de nuestras cinco líneas.`
  },
  '/aviso-de-privacidad/': {
    titulo: `Aviso de privacidad · ${MARCA}`,
    descripcion: `Aviso de privacidad de ${MARCA}${en}. Qué datos se recaban y para qué se usan.`
  },
  '/terminos/': {
    titulo: `Términos · ${MARCA}`,
    descripcion: `Términos y condiciones de uso del sitio de ${MARCA}${en}.`
  }
};

/** Una ficha por cada ruta del inventario. Sin huecos: el test lo comprueba. */
export const fichas: Record<string, Ficha> = Object.fromEntries(
  paginas.map((p) => {
    const g = girosConstruibles.find((x) => `/${x.slug}/` === p.ruta);
    const base = g ? DE_GIRO[g.slug] : FIJAS[p.ruta];
    if (!base) {
      throw new Error(
        `SEO: la ruta ${p.ruta} está en el inventario y no tiene título ni descripción. ` +
        `Se escriben en src/lib/seo/meta.ts. Una página sin <title> propio es una página ` +
        `que Google nombra por su cuenta.`
      );
    }
    return [p.ruta, { ...base, propuesta: true }];
  })
);

export function fichaDe(ruta: string): Ficha | undefined {
  return fichas[ruta];
}

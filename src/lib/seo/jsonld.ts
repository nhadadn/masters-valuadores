/**
 * El @graph de datos estructurados.
 *
 * Forma decidida en docs/40-seo/jsonld-graph.md:
 *   Organization  — la empresa
 *   LocalBusiness — el local, con @type en ARRAY porque el segundo tipo es la
 *                   categoría primaria de Google y esa sale de la Etapa 1 (D-02)
 *   WebSite       — el sitio
 * Los giros construibles —cinco desde el ADR-0047— entran como `department` del LocalBusiness: es lo que le dice a
 * Google que una sola ficha atiende varias líneas sin fingir varias empresas.
 *
 * ── CA-08 ──────────────────────────────────────────────────────────────────
 * Este módulo LANZA EXCEPCIÓN si encuentra un __POR_CONFIRMAR__ en un build de
 * producción. Como el grafo se arma durante el prerender, la excepción revienta
 * el build. No es un test que alguien pueda olvidar correr: es la publicación
 * que no ocurre.
 */

import {
  negocio, sucursalPrincipal, POR_CONFIRMAR, estaConfirmado,
  type Dato, type Sucursal
} from '$lib/config/negocio';
import { giros } from '$lib/datos/giros';

export class DatoSinConfirmar extends Error {
  constructor(public readonly campos: string[]) {
    super(
      `El grafo JSON-LD no se puede emitir: ${campos.length} dato(s) del negocio ` +
      `siguen en __POR_CONFIRMAR__.\n\n  · ${campos.join('\n  · ')}\n\n` +
      `Se cierran en docs/30-cliente/decisiones-pendientes.md. ` +
      `Publicar con estas marcas le diría a Google datos que nadie confirmó.`
    );
    this.name = 'DatoSinConfirmar';
  }
}

/** Recorre el grafo ya armado y junta las rutas donde quedó la marca. */
export function buscarSinConfirmar(valor: unknown, ruta = '$'): string[] {
  if (valor === POR_CONFIRMAR) return [ruta];
  if (Array.isArray(valor)) return valor.flatMap((v, i) => buscarSinConfirmar(v, `${ruta}[${i}]`));
  if (valor && typeof valor === 'object') {
    return Object.entries(valor).flatMap(([k, v]) => buscarSinConfirmar(v, `${ruta}.${k}`));
  }
  return [];
}

const idOrg   = (base: string) => `${base}#organizacion`;
const idLocal = (base: string, s: Sucursal) => `${base}#local-${s.id}`;
const idSitio = (base: string) => `${base}#sitio`;

function direccion(s: Sucursal) {
  return {
    '@type': 'PostalAddress',
    streetAddress: s.calle,
    addressLocality: s.ciudad,
    addressRegion: s.estado,
    postalCode: s.codigoPostal,
    addressCountry: s.pais
  };
}

function horarios(s: Sucursal) {
  if (!estaConfirmado(s.horarios)) return POR_CONFIRMAR;
  return s.horarios.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.dias,
    opens: h.abre,
    closes: h.cierra
  }));
}

/**
 * Un `department` por giro. Los bloqueados NO entran: declarar un departamento
 * que no tiene página es decirle a Google que existe algo que no existe.
 */
function departamentos(base: string) {
  return giros
    .filter((g) => g.estado === 'construible')
    .map((g) => ({
      '@type': 'LocalBusiness',
      '@id': `${base}/${g.slug}/#departamento`,
      name: `${negocio.nombreComercial} ${g.nombre}`,
      url: `${base}/${g.slug}/`,
      parentOrganization: { '@id': idOrg(base) }
    }));
}

export interface OpcionesGrafo {
  /** Si es true, lanza excepción al encontrar marcas. En dev se deja pasar. */
  estricto?: boolean;
}

export function construirGrafo(opciones: OpcionesGrafo = {}) {
  const base = estaConfirmado(negocio.dominio) ? `https://${negocio.dominio}` : POR_CONFIRMAR;
  const s = sucursalPrincipal;

  const organizacion = {
    '@type': 'Organization',
    '@id': idOrg(base),
    name: negocio.nombreComercial,
    legalName: negocio.nombreLegal,
    url: base,
    description: negocio.descripcion,
    sameAs: negocio.redes,
    address: direccion(s),
    telephone: s.telefono,
    email: negocio.correo
  };

  const local = {
    // Array a propósito: el segundo tipo es la categoría primaria de Google,
    // el factor individual de mayor peso en posicionamiento local. D-02.
    '@type': ['LocalBusiness', negocio.tipoLocalBusiness] as Dato<string>[],
    '@id': idLocal(base, s),
    name: negocio.nombreComercial,
    parentOrganization: { '@id': idOrg(base) },
    url: base,
    address: direccion(s),
    telephone: s.telefono,
    email: negocio.correo,
    openingHoursSpecification: horarios(s),
    geo: { '@type': 'GeoCoordinates', latitude: s.latitud, longitude: s.longitud },
    // Su ficha de Google, que EXISTE y está sin reclamar. Declararla aquí le dice a
    // Google que el sitio y esa ficha son el mismo negocio, en vez de dejar que lo
    // adivine por coincidencia de dirección.
    hasMap: s.mapaUrl,
    department: departamentos(base)
  };

  const sitio = {
    '@type': 'WebSite',
    '@id': idSitio(base),
    url: base,
    name: negocio.nombreComercial,
    inLanguage: 'es-MX',
    publisher: { '@id': idOrg(base) }
  };

  const grafo = { '@context': 'https://schema.org', '@graph': [organizacion, local, sitio] };

  if (opciones.estricto) {
    const faltantes = buscarSinConfirmar(grafo);
    if (faltantes.length > 0) throw new DatoSinConfirmar(faltantes);
  }
  return grafo;
}

/**
 * Lo que se inyecta en el <head>.
 *
 * ESTRICTO POR OMISIÓN en producción. La única forma de construir un build de
 * producción con marcas vivas es escribir a mano `VITE_PENDIENTES_OK=1`, y ese
 * camino avisa a gritos en consola. El despliegue real nunca pone esa variable,
 * así que la publicación falla — que es lo que pide CA-08.
 *
 * La escotilla existe por una razón concreta: sin ella no se podría medir el
 * presupuesto de JS ni revisar una sola pantalla hasta que el cliente entregue
 * todos sus datos, y eso serían meses sin ninguna forma de verificar el trabajo.
 */
export function grafoSerializado(produccion: boolean, permisivo = false): string {
  const estricto = produccion && !permisivo;
  const grafo = construirGrafo({ estricto });

  if (produccion && permisivo) {
    const faltantes = buscarSinConfirmar(grafo);
    if (faltantes.length > 0) {
      console.warn(
        `\n⚠  BUILD PERMISIVO · el grafo lleva ${faltantes.length} marca(s) sin confirmar.\n` +
        `   Sirve para medir y revisar. NO se publica así.\n` +
        faltantes.map((c) => `   · ${c}`).join('\n') + '\n'
      );
    }
  }
  return JSON.stringify(grafo).replace(/</g, '\\u003c');
}

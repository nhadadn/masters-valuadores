/**
 * Cómo se arma un enlace para llamar · ADR-0052. Hermano de `whatsapp.ts`.
 *
 * Existe porque los tres botones «Llamar» del sitio —dos en la portada y uno en
 * contacto— no llamaban: los de la portada llevaban a contacto y el de contacto a la
 * portada, así que quien tocaba «Llamar» rebotaba entre dos páginas. Eran del tiempo en
 * que el teléfono estaba sin confirmar (D-08); D-08 se cerró y nadie volvió por ellos.
 *
 * EL NÚMERO NO ESTÁ AQUÍ: sale de `negocio.ts`. Sin número confirmado devuelve
 * `undefined`, y quien lo usa decide qué enseñar en su lugar. Se arma igual que el
 * ícono de la cabecera: el número sin espacios.
 */
import { sucursalPrincipal, estaConfirmado } from '$lib/config/negocio';

export function enlaceTelefono(): string | undefined {
  const tel = sucursalPrincipal.telefono;
  if (!estaConfirmado(tel)) return undefined;
  return `tel:${String(tel).replace(/\s/g, '')}`;
}

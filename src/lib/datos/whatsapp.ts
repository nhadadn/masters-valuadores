/**
 * Cómo se arma un enlace de WhatsApp. UN solo sitio.
 *
 * Esto vivía dentro de `BotonWhatsApp.svelte`, que es el componente correcto para un
 * BOTÓN. La galería de bienes del ADR-0025 no quiere un botón: quiere un enlace
 * estirado sobre la tarjeta entera, sin fondo y sin ícono propio.
 *
 * Se podía haber añadido una cuarta variante llamada «desnudo», pero eso es un botón
 * que finge no serlo, y la siguiente vez habría una quinta. Lo que las dos piezas
 * comparten de verdad es esto: cómo se construye la URL y qué pasa si el número no
 * está confirmado.
 *
 * EL NÚMERO NO ESTÁ AQUÍ. Sale de `negocio.ts`, que es la única fuente. Mientras esté
 * sin confirmar el enlace NO se arma: es preferible un botón inerte y marcado a mandar
 * a alguien a un número inventado.
 */
import { sucursalPrincipal, estaConfirmado } from '$lib/config/negocio';

/** ¿Se puede enlazar a WhatsApp, o el número sigue por confirmar? */
export function hayWhatsApp(): boolean {
  return estaConfirmado(sucursalPrincipal.whatsapp);
}

/**
 * El enlace, con el mensaje ya escrito si se le pasa uno.
 * Devuelve `undefined` cuando no hay número confirmado, para que quien llame decida
 * qué enseñar en su lugar.
 */
export function enlaceWhatsApp(mensaje?: string): string | undefined {
  if (!hayWhatsApp()) return undefined;
  const numero = String(sucursalPrincipal.whatsapp).replace(/\D/g, '');
  return `https://wa.me/${numero}` + (mensaje ? `?text=${encodeURIComponent(mensaje)}` : '');
}

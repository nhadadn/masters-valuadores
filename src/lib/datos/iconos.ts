/**
 * Íconos en línea. Cero librería: son nueve trazos y una dependencia se justifica
 * o no entra. Cada uno es el contenido de un <svg viewBox="0 0 24 24">.
 * Se dibujan con `fill="none"` y `stroke="currentColor"`, así heredan la tinta.
 */
export const iconos: Record<string, string> = {
  empeno:  '<path d="M3 12.5V4a1 1 0 0 1 1-1h8.5L21 11.5 13.5 19z"/><circle cx="7.5" cy="7.5" r="1.4"/>',
  joyeria: '<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3l-3 6 6 12 6-12-3-6"/>',
  bazar:   '<path d="M4 8h16l-1.2 12H5.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  taller:  '<path d="M14.5 3a5 5 0 0 0-4.6 7L3 16.9 6.1 20l7-6.9A5 5 0 1 0 14.5 3z"/>',
  fletes:  '<path d="M2 7h11v10H2z"/><path d="M13 10h4l3 3v4h-7z"/><circle cx="6" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/>',
  renta:   '<path d="M4 21h9"/><path d="M8.5 21V5"/><path d="M2.5 5h19"/><path d="M17 5v4.5"/><path d="M8.5 5L13 1.8"/>',
  finan:   '<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4"/><path d="M9 12h6M9 16h6"/>',
  bloq:    '<rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  mapa:    '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  reloj:   '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  telefono:'<path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3z"/>',
  mas:     '<path d="M12 5v14M5 12h14"/>',
  menos:   '<path d="M5 12h14"/>'
};

/** WhatsApp va relleno, no trazado: es un logotipo, no un ícono de interfaz. */
export const iconoWhatsApp =
  '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z"/>';

import { error } from '@sveltejs/kit';
import { giroPorSlug, girosConstruibles } from '$lib/datos/giros';
import type { EntryGenerator, PageLoad } from './$types';

/**
 * Las siete páginas de giro se prerenderizan desde aquí. Una sola plantilla,
 * siete entradas: el dibujo demostró que son la misma página con distinto
 * contenido, así que replicar el archivo siete veces sería replicar el error
 * siete veces cada vez que algo cambie.
 *
 * Los giros bloqueados NO generan ruta: una página sin decisión tomada es una
 * promesa que el sitio no puede cumplir.
 */
export const entries: EntryGenerator = () => girosConstruibles.map((g) => ({ giro: g.slug }));

export const load: PageLoad = ({ params }) => {
  const giro = giroPorSlug(params.giro);
  if (!giro) throw error(404, `No existe la línea «${params.giro}»`);
  return { giro };
};

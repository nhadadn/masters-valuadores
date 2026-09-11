import { construirRobots } from '$lib/seo/enlaces';
import type { RequestHandler } from './$types';

/**
 * `/robots.txt` · ver la nota de `trailingSlash` en `sitemap.xml/+server.ts`.
 *
 * Hoy PROHÍBE TODO, y eso es la decisión del ADR-0013, no un descuido.
 */
export const prerender = true;
export const trailingSlash = 'never';

export const GET: RequestHandler = () =>
  new Response(construirRobots(), {
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  });

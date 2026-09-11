import { construirSitemap } from '$lib/seo/enlaces';
import type { RequestHandler } from './$types';

/**
 * `/sitemap.xml` · se prerenderiza como un archivo más del build.
 *
 * `trailingSlash` se apaga aquí a propósito: el layout raíz lo pone en `'always'`
 * para las páginas, y una barra final convertiría esto en `/sitemap.xml/`, que no
 * es donde ningún rastreador lo busca.
 *
 * El contenido lo arma `enlaces.ts` para que el test lo pueda probar con un
 * dominio falso sin levantar un servidor · CA-S3 y CA-S5 de SPEC-0003.
 */
export const prerender = true;
export const trailingSlash = 'never';

export const GET: RequestHandler = () =>
  new Response(construirSitemap(), {
    headers: { 'content-type': 'application/xml; charset=utf-8' }
  });

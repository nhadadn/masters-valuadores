import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * Sitio completamente estático. No hay servidor: cada ruta se prerenderiza a HTML
 * durante el build. Es lo que pide el contrato y es lo que hace que el error del
 * módulo JSON-LD reviente la publicación en vez de aparecer en producción.
 * @type {import('@sveltejs/kit').Config}
 */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: undefined, strict: true }),
    prerender: { handleHttpError: 'fail', handleMissingId: 'fail' },
    alias: { $componentes: 'src/lib/componentes' }
  }
};

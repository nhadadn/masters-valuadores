import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],

  /**
   * `build/` y `.svelte-kit/` son SALIDA, no fuente. Vite las estaba vigilando, y eso
   * tiraba el servidor de desarrollo una y otra vez con:
   *
   *     Error: EBUSY: resource busy or locked,
   *     watch 'build/fotos/fachada-800.jpg'
   *
   * En Windows, cuando otro proceso —el servidor estático que sirve `build/` para los
   * verificadores— tiene abierto un archivo, `fs.watch` sobre él lanza EBUSY. El
   * FSWatcher de Vite emite ese error sin capturarlo y el proceso sale con código 1.
   *
   * El síntoma era una página EN BLANCO sin explicación, porque no quedaba nada
   * sirviendo. Se cayó cuatro veces antes de encontrarlo, y empeoró al añadir las
   * fotos: más archivos, más grandes y más tiempo abiertos.
   *
   * Vigilar la salida además provocaba recargas en cascada —un `page reload` por cada
   * HTML construido— que no significaban nada.
   */
  server: {
    watch: { ignored: ['**/build/**', '**/.svelte-kit/**'] }
  },
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    environment: 'node'
  }
});

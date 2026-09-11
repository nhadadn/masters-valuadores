/**
 * Capturas de pantalla completas, para mirar el sitio en vez de imaginarlo.
 *
 * Uso:  npx serve build -l 8124   y luego
 *       node herramientas/capturar.mjs [carpeta-destino]
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { abrirChromium } from './navegador.mjs';

const BASE = process.env.BASE ?? 'http://127.0.0.1:8124';
const DESTINO = process.argv[2] ?? 'capturas';
const RUTAS = (process.env.RUTAS ?? '/,/empeno-y-prestamo/').split(',');
const ANCHOS = (process.env.ANCHOS ?? '390,1280').split(',').map(Number);

mkdirSync(DESTINO, { recursive: true });

const navegador = await abrirChromium();

for (const ancho of ANCHOS) {
  for (const ruta of RUTAS) {
    const p = await navegador.newPage({ viewport: { width: ancho, height: 900 } });
    await p.goto(BASE + ruta, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    // Bajar del todo y volver, para disparar cada `loading="lazy"`.
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(1500);
    const nombre = `${ruta.replace(/\//g, '') || 'portada'}-${ancho}.png`;
    await p.screenshot({ path: join(DESTINO, nombre), fullPage: true });
    console.log('  ·', join(DESTINO, nombre));
    await p.close();
  }
}

await navegador.close();

/**
 * Cómo se abre un navegador para medir. Un solo lugar, para los cuatro scripts.
 *
 * ANTES: cada script importaba Playwright de `/opt/node-tools/node_modules/...` y el
 * navegador de `/opt/pw-browsers/chromium`. Rutas absolutas de Linux, escritas a mano.
 * El efecto era que los cuatro verificadores del repo —los que sostienen CA-07, CA-09,
 * CA-10 y CA-11— corrían en una sola máquina y en ninguna otra, fallando con un error
 * de módulo que no dice nada de la causa.
 *
 * Eso no era una dependencia faltante: era un defecto. Playwright es ahora
 * `devDependency` y se resuelve por nombre, como cualquier otra herramienta del repo.
 * Cero bytes al visitante: no entra en ningún bundle.
 *
 * La ruta heredada se respeta si existe, para que la máquina que la tenía siga igual.
 */
import { existsSync } from 'node:fs';

const PLAYWRIGHT_HEREDADO = '/opt/node-tools/node_modules/playwright/index.js';
const CHROMIUM_HEREDADO = '/opt/pw-browsers/chromium';

async function cargarPlaywright() {
  try {
    return await import('playwright');
  } catch {
    try {
      return await import(PLAYWRIGHT_HEREDADO);
    } catch {
      console.error(
        '\n✗ No hay Playwright.\n' +
          '  Se instala con `npm install` en la raíz del repo, y el navegador con\n' +
          '  `npx playwright install chromium`. Es herramienta de medición: no viaja\n' +
          '  al visitante ni cuenta contra el presupuesto de 40 KB.\n'
      );
      process.exit(1);
    }
  }
}

/** Abre Chromium. `opciones` gana sobre lo que se resuelva aquí. */
export async function abrirChromium(opciones = {}) {
  const pw = await cargarPlaywright();
  const chromium = pw.chromium ?? pw.default?.chromium;
  const base = existsSync(CHROMIUM_HEREDADO) ? { executablePath: CHROMIUM_HEREDADO } : {};
  return chromium.launch({ ...base, ...opciones });
}

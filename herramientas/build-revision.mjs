/**
 * Build permisivo, multiplataforma.
 *
 * Existía como `VITE_PENDIENTES_OK=1 vite build` en package.json, que es sintaxis
 * de bash: en PowerShell y en cmd de Windows eso no asigna nada y el build sale
 * estricto sin avisar por qué. Este script pone la variable en el proceso y lanza
 * vite, así funciona igual en Windows, macOS y Linux sin añadir una dependencia.
 *
 * NO SE USA PARA PUBLICAR. Ver la nota de CA-08 en src/lib/seo/jsonld.ts.
 */
import { spawnSync } from 'node:child_process';

console.log(
  '\n⚠  BUILD DE REVISIÓN — permisivo.\n' +
  '   Deja pasar los __POR_CONFIRMAR__ para poder medir y revisar.\n' +
  '   Para publicar se usa `npm run build`, que falla mientras falten datos.\n'
);

const env = { ...process.env, VITE_PENDIENTES_OK: '1' };
const vite = spawnSync('npx', ['vite', 'build'], { stdio: 'inherit', env, shell: process.platform === 'win32' });
if (vite.status !== 0) process.exit(vite.status ?? 1);

const presupuesto = spawnSync(process.execPath, ['herramientas/presupuesto.mjs'], { stdio: 'inherit', env });
process.exit(presupuesto.status ?? 1);

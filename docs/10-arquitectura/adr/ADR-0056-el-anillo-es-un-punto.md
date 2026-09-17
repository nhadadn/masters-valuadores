---
tipo: adr
id: ADR-0056
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
corrige: un defecto que venía del ADR-0026 · la caja del anillo desbordaba la página
implementa: Claude Code
---

# ADR-0056 · El anillo del planeta es un punto, no una caja

## Qué se pidió

Nadir reportó el defecto ya publicado, medido con Playwright a 390 × 844 con emulación móvil:
`/empeno-y-prestamo/` y `/venta/` daban `scrollWidth` 413 e `innerWidth` 413, `/fletes/` 411, y
la portada 390. El elemento que se salía era `ul.anillo`. A 1280, `/venta/` desbordaba 33–46 px
según la rotación. Pidió corregirlo **sin cambiar lo que se ve dentro de la sección**: que el
planeta siga girando, que se pause fuera de pantalla con `data-quieto` (ADR-0026 y ADR-0040), que
respete `prefers-reduced-motion` y que no sume JavaScript.

## La causa

`.anillo` llevaba `position: absolute; inset: 0`: una caja **del tamaño del escenario** que gira en
3D con los discos —`rotateX(42deg)` fija y `rotateY` animado— bajo una perspectiva de 620 px. La
caja no pinta nada, pero Chromium cuenta su rectángulo proyectado como parte del documento.
Inclinada, su borde cercano se proyecta más ancho que la página, y cuando el giro la pone de canto
hacia quien mira, la proyección se dispara.

**Los discos no eran la causa.** A 360 px, el disco visible más a la derecha termina en 354.

La fórmula del ADR-0026 calculó la geometría de los discos. Nadie midió la caja que los contiene.

## Lo medido antes, en el sitio publicado

Chromium de Playwright. Cada animación de reloj congelada en **24 fases** de su ciclo; se reporta
el peor caso como `scrollWidth / innerWidth`.

| Ancho | Portada | Empeño | Venta | Fletes |
|---|---|---|---|---|
| 360 móvil | 360 / 360 | **394 / 379** | **394 / 379** | **384 / 379** |
| 390 móvil | 390 / 390 | **420 / 413** | **420 / 413** | **420 / 413** |
| 412 móvil | 412 / 412 | **446 / 437** | **446 / 437** | **446 / 437** |
| 768 | 768 / 768 | **958 / 768** | **958 / 768** | **958 / 768** |
| 1280 | 1280 / 1280 | **3046 / 1280** | **3046 / 1280** | **3046 / 1280** |

En emulación móvil el desborde no sale como `scrollWidth > innerWidth`: el navegador ensancha la
ventana de maquetado —379, 413, 437— y **encoge la página entera al 95, 94.4 y 94.3 %**. Por eso el
criterio es que `scrollWidth`, `innerWidth` y el ancho del aparato sean el mismo número.

El 413 y el 33–46 del reporte eran la fase de ese momento. El peor caso era **420 a 390 y 3046 a
1280**, y a 1280 desbordaban las tres páginas, no solo venta.

## Lo que se decide

- **El anillo pasa a ser un punto de 0 × 0 en el centro del escenario**: `left: 50%; top: 50%;
  width: 0; height: 0` en lugar de `inset: 0`. El origen de su giro —el 50 % de su propia caja— y
  el de la perspectiva —el 50 % del escenario— siguen en el mismo punto, y cada `li.mundo` se sigue
  colocando en el 50 % del anillo, que ahora vale 0, con su margen negativo. **Cada disco cae donde
  estaba.**
- **No se recorta con `overflow-x: clip`.** El escenario deja 20 px de margen a cada lado, y los
  discos laterales pasan su borde: a 360 px el escenario termina en 340 y el disco en 354. Recortar
  ahí habría mordido discos y sombras en su punto más lateral. Además, recortar esconde la causa en
  lugar de quitarla.
- **Cero JavaScript nuevo.** Es CSS.
- **El guardia: `validar-a11y.mjs` mide ahora el desborde horizontal** (WCAG 1.4.10). Congela cada
  animación de reloj en 12 fases y toma el peor caso. Contra el sitio publicado, sin esta
  corrección, da **NO CUMPLE en 6 de 18**: 22 px a 390 y 1559 a 1280 en la peor fase. Contra el
  build corregido, 18/18 con 0 px. Desde aquí, «18/18» incluye que ninguna página sea más ancha que
  su ventana.
- **Un servidor estricto** en `.claude/launch.json`, `masters-build-5191`: `npx serve build -l 5191
  --no-port-switching`. Si el puerto está ocupado falla, en vez de mudarse a otro y dejar al
  validador midiendo un servidor que no es.

## Lo medido después, en el build local

| | |
|---|---|
| Desborde · 9 páginas × 360, 390 y 412 móvil, 768 y 1280 · 24 fases | **45/45**: `scrollWidth` = `innerWidth` = ancho del aparato |
| Dentro de la sección, píxel a píxel | **0 píxeles con diferencia mayor que 16 de 255** en 6 capturas a 390 —3 páginas × 2 fases— y 3 a 1280, contra el sitio publicado en la misma fase. La diferencia máxima fue 5 en una captura y 0 en las otras ocho |
| Sigue girando | anillo y discos en `running` y la matriz cambia, en las tres páginas |
| Fuera de pantalla | `data-quieto` puesto y las dos animaciones en `paused`; la regla sigue en el CSS construido |
| `prefers-reduced-motion` | sin animación y sin desborde, en las tres páginas |
| Validador | **18/18 CUMPLE**, desborde 0 px |
| Tests | 182, sin cambio |
| JavaScript | sin cambio · CA-10 con **35.55 KB** de margen |

## Lo que queda

- **WebKit no prueba la corrección.** Con el WebKit 2336 de Playwright no hay desborde después, pero
  **tampoco lo había antes**: el defecto es de Chromium, que es el motor de Chrome en Android. Esa
  medición solo dice que el cambio no rompe WebKit.
- **A 360 px, la caja de un `li.mundo` llega a 364** en alguna fase —su plano va inclinado— aunque
  el disco visible termina en 354. Ni Chromium ni WebKit la cuentan en el documento: `scrollWidth`
  queda en 360 en las 24 fases. Si algún navegador sí la contara, el remedio sería el mismo.
- **No se probó en Firefox ni en un teléfono físico.**

## Evidencia

| Qué | Dónde |
|---|---|
| El anillo como punto | `src/lib/componentes/PlanetaBienes.svelte:136` · `:144` |
| El guardia de desborde | `herramientas/validar-a11y.mjs:162` · `:170` · `:192` |
| El servidor estricto | `.claude/launch.json` · `masters-build-5191` |
| Cómo queda | `capturas/planeta-desborde-antes-390.png` · `capturas/planeta-desborde-despues-390.png` · `capturas/planeta-desborde-despues-empeno-390.png` · `capturas/planeta-desborde-despues-1280.png` |

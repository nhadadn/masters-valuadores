---
tipo: adr
id: ADR-0050
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: la regla de movimiento de tokens.css (respuesta, no entrada) · ADR-0042 (el circuito, quieto)
implementa: Claude Code
---

# ADR-0050 · El circuito del proceso se mueve

## Qué se pidió

> *«Ahora bien; necesito que esta sección sea animada.»* — Nadir, con una captura de
> «¿Cuánto me dan y cuándo?» en `/empeno-y-prestamo/`

## El choque, dicho antes de tocar

La regla de `tokens.css` decía, entera:

> *«El movimiento de este sitio es de RESPUESTA, no de entrada: se mueve lo que el
> visitante toca, no lo que aparece. La audiencia llega con prisa, desde un teléfono de gama
> baja y a plena luz; una animación de entrada le retrasa el contenido que vino a leer para
> impresionar a quien no está mirando.»*

Y el propio componente, desde el ADR-0042, se había hecho sin movimiento a propósito. Antes
de implementar se armaron **tres prototipos sobre la sección real** y se publicaron para verlos
en el teléfono, cada uno con su relación con la regla:

| | Qué se mueve | El texto | Con la regla |
|---|---|---|---|
| A · El circuito da la vuelta | una luz recorre el circuito en bucle | quieto | la respeta |
| B · Se traza al bajar | el circuito se dibuja al deslizar | quieto | zona gris |
| C · Se arma al bajar | lo de B, y el texto entra al llegar | invisible hasta que llega | **la contradice** |

Se recomendó B. **Nadir eligió A y C juntas.**

## Lo que se decide

- **A · La luz que da la vuelta.** Una luz baja por cada tramo, cada disco late cuando llega
  y, en las líneas con retorno, la luz sube por el corchete. Bucle de 7.2 s con una ranura de
  1.2 s por momento; el retorno del disco hace un gesto de volver cuando le toca.
- **C · La sección se arma al bajar.** Va atada al desplazamiento, no al reloj: cada tramo se
  traza, cada disco se enciende y cada texto entra cuando su paso llega a la pantalla. Si se
  sube, se deshace.
- **Las dos se ven juntas sin pisarse.** La luz no corre por un tramo que todavía no se trazó
  ni sube por un corchete que no apareció.
- **Es un solo componente**, así que entra en las cinco páginas de línea. Donde no hay
  retorno —venta, financiamiento, fletes, taller— no hay corchete ni luz que suba.
- **Cero JavaScript.** Todo es CSS; el presupuesto de CA-10 no se mueve.
- **Dos guardias obligatorios**: con «reducir movimiento» no se mueve nada y la sección se ve
  como antes; y lo atado al desplazamiento solo corre en navegadores que lo soportan. Donde no,
  nada se esconde y la luz de A sigue.
- **Una regla nueva, general, para todo bucle del sitio: solo se anima `transform`, `opacity`
  y `visibility`.** Ver por qué, abajo.

## La objeción, por escrito

**C esconde texto hasta que llega a la pantalla.** Lo que eso cuesta, medido y no supuesto:

- **Quien se detiene a medio deslizar ve pasos a medio aparecer.** Con la lista al 72 % de la
  pantalla, los cuatro textos de empeño están al **0.81, 0.45, 0.10 y 0** de opacidad.
- **Ningún validador del repo lo caza.** `validar-a11y.mjs` mide colores, no opacidad: su
  **18/18 CUMPLE** no dice nada de esto.
- **Al cargar la página no pasa.** La lista empieza entre **1329 y 2316 px** en las cinco
  páginas, en pantallas de 390×844 a 2560×1440, así que nunca está a la vista sin deslizar.

La regla de `tokens.css` no se borra: se le añade esta excepción con su fecha y su porqué.

## Lo que cambió respecto del prototipo, y por qué

**La luz del prototipo de A no se podía publicar.** Se dibujaba recortando con `clip-path`, y
eso obliga a repintar el acero pavonado en cada cuadro. Medido en un teléfono emulado de gama
baja —procesador a 1/4, 390 px, densidad 2—, con la sección a la vista durante un ciclo de
7.2 s, intercalado y en los dos órdenes:

| Versión | Hilo principal por ciclo de 7.2 s | Recálculos de estilo |
|---|---|---|
| Sin animación | 4–6 ms | 0 |
| **A del prototipo, con `clip-path`** | **3803–4075 ms** | 433 |
| A rehecha trasladando una luz ya pintada | 52–91 ms | 1–4 |

Por eso la luz publicada **es una cabeza con estela que viaja, no una línea que crece**, y por
eso **el tramo punteado y el corchete aparecen en vez de trazarse**: escalar un punteado estira
los puntos y escalar el corchete aplasta sus curvas. Después de la primera captura la luz se
agrandó —núcleo de 4 px y halo de 12— porque a 3 px se perdía.

## Lo medido, en el sitio construido

| | |
|---|---|
| Tests | **164** · 5 nuevos en `tests/movimiento-flujo.test.ts` |
| Los guardias del test | **4 de 4 mutantes cazados**: animación fuera de «reducir movimiento», línea de tiempo fuera de `@supports`, una `opacity: 0` suelta y un `clip-path` en un fotograma clave. Cada uno lo tumba su prueba |
| Accesibilidad | **18/18 CUMPLE** — con la salvedad de arriba |
| JavaScript | sin cambio · CA-10 con **35.55 KB** de margen |
| «Reducir movimiento» | **0 animaciones** y todo visible al cargar, en empeño y en venta |
| Armado al deslizar | lista bajo la pantalla: todo en 0 · lista arriba: textos y discos en 1, tramos trazados, corchete visible · empeño y venta |
| La luz | en un ciclo, **todos los tramos se encienden** y en empeño **sube por el corchete** |
| Costo quieto, página real | **57–66 ms** de hilo por ciclo con movimiento contra **10–13** sin él · 0 recálculos · 0 maquetados |
| Costo al deslizar 1400 px | mediana de **1775 ms** de hilo con movimiento contra **1355** sin él, en 6 pares en los dos órdenes y con la luz todavía chica; con la luz final, **1672–1681** contra **1325–1347** en 2 pares. La duración del recorrido casi no cambia |

Las cifras de tiempo son de emulación en esta máquina y, como dice el `CLAUDE.md`, solo valen
como pareja intercalada, no como número absoluto.

## Lo que queda abierto

- **No se probó en un teléfono de gama baja de verdad**, solo emulado.
- **No se sabe qué parte de la audiencia tiene navegador con animación atada al
  desplazamiento.** Quien no lo tenga ve la sección quieta con la luz de A.
- **El validador sigue ciego a la opacidad.** No se tocó: arreglarlo es decidir qué estado
  mide en una sección que no tiene uno solo.
- **B sigue siendo la recomendación** si esto se revisa: cuenta lo mismo sin esconder texto.

## Evidencia

| Qué | Dónde |
|---|---|
| El reloj de la luz: `--momentos` y `--i` | `src/lib/componentes/FlujoProceso.svelte:60` · `:62` |
| Por qué y cuánto cuesta, escrito en el componente | `src/lib/componentes/FlujoProceso.svelte:183` |
| El guardia de «reducir movimiento» | `src/lib/componentes/FlujoProceso.svelte:213` |
| A · la luz de cada tramo, el latido, la vuelta y el gesto del retorno | `src/lib/componentes/FlujoProceso.svelte:216` · `:234` · `:247` · `:262` |
| El guardia de soporte y C | `src/lib/componentes/FlujoProceso.svelte:266` · `:271` · `:291` |
| La luz no corre por lo que no se trazó | `src/lib/componentes/FlujoProceso.svelte:300` · `:305` |
| Los fotogramas clave | `src/lib/componentes/FlujoProceso.svelte:313` · `:338` |
| La luz y su halo, como tokens | `src/lib/estilos/tokens.css:431` |
| La excepción y la regla de los bucles | `src/lib/estilos/tokens.css:550` · `:556` |
| El test | `tests/movimiento-flujo.test.ts:64` · `:69` · `:76` · `:86` |
| Cómo queda | `capturas/proceso-armandose.png` · `capturas/proceso-luz-tramo.png` · `capturas/proceso-luz-vuelta.png` |

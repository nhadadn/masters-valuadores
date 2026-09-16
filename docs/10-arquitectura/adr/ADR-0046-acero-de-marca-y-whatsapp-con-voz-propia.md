---
tipo: adr
id: ADR-0046
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: ADR-0030 · ADR-0031 · ADR-0043
se_aparta_de: ADR-0007 (el verde de WhatsApp no sale de sus piezas)
convive_con: ADR-0045 (el anillo de foco en oscuro · sesión paralela · PROPUESTA)
implementa: Claude Code
---

# ADR-0046 · Acero de marca, y WhatsApp con voz propia

## Qué se pidió

Cuatro mensajes, en este orden:

> *«Debemos de deshacernos del blanco puro y darle más estilo de lujo, sofisticación,
> frescura, y un alto índice premium.»*
>
> *«2. Acero y oro, que el cepillado sea más nítido, menos tenue… Que se vea el tono
> acero fuerte.»*
>
> *«El acero debe ser aún más, parece blanco aún, ¿o crees es suficiente? ¿Cómo podemos
> resaltar los botones de WhatsApp?»*
>
> *«Adelante con acero de marca con suelo cepillado y W3.»* — Nadir

## Cómo se llegó: tres rondas de prototipo, cero cambios en `src/`

Todo se probó sobre el `build/` real con la hoja de cada opción inyectada en el `<head>`
por un servidor de pruebas, así que el validador midió estilos computados de verdad sin
tocar el repo.

### Lo que dijeron las referencias, medido y no recordado

Doce casas válidas: joyería, relojería, empeño de lujo y dos de «frescura». Leídas en
píxeles o en el CSS computado.

| | Cuántas |
|---|---|
| Suelo en blanco puro | **8 de 12** |
| Suelo teñido, y siempre cerca del blanco · Rolex `#F8F8F8`, Hermès `#FCF7F1`, Aesop `#FFFEF2`, Bulgari `#F3F2F3` | 4 de 12 |
| Secciones enteras en otro registro · Van Cleef, Chopard, Tiffany, Aesop, Suttons & Robertsons | **5 de 12** |
| Suelo oscuro | **0 de 12** |

Bloqueadas: Cartier, Watchfinder, Chrono24 y The RealReal. Aparcados: Peyrelongue y
Berger. **Lo que ese método no mide:** texturas. Lee color, no imagen.

La lección que se usó: **el lujo de las referencias no está en teñir el suelo sino en
dividir la página en salas**. Suttons & Robertsons —el empeño de lujo, la referencia
más cercana— pone su proceso en azul marino.

### De dónde sale el tono: sus píxeles

El primer acero del prototipo era `#DAE1E7`: L* 89 y azulado. Nadir lo leyó blanco, y
tenía razón. El acero de su marca, medido:

| Material | Mediana | L* |
|---|---|---|
| La M de acero del tablero de marca | `#736F6C` | **47** · P10 29 · P90 64 |
| «MÁSTER» de acero, mismo tablero | | 44 |
| La piedra grafito de la fachada | `#2E2E2C` | 19 |

**Gris neutro-cálido, no azul.** Por eso no es la rampa `--acero-*` fría del
[[ADR-0010-degradados-de-superficie|ADR-0010]], que sigue declarada.

## Lo que se decide

| Registro | Valor | Dónde |
|---|---|---|
| **Suelo** | `#BFBBB7` cepillado · L* 76 | el cuerpo de las ocho páginas y la cabecera, esta sin cepillado |
| **Placa** | `#E6E3DF` | tarjetas, mapa, cajas |
| **Pavonado** | `#3A424A → #283037` cepillado, con `.registro-oscuro` | la entrada de las cinco páginas con hero **y una sala por página**: «Por qué venir aquí» en la portada y el proceso en las de giro |
| **Carbón** | `#171717` | el pie, la cinta y la barra, sin cambio |

**El suelo se para en L* 76 y no baja más.** No lo fija el gusto sino la tinta: con la
tinta secundaria en `--negro-700` se podría llegar hacia L* 65, pero ahí queda pegada
al 4.5.

**La entrada fuerte tiene que ser oscura.** El oro del titular sobre claro necesita
3:1 y el ADR-0007 §4 prohíbe crear un oro más oscuro, así que una entrada de acero
claro no podía ser más oscura que el suelo. En `.registro-oscuro` el titular pasa a
`--oro-500`.

### WhatsApp

| | |
|---|---|
| **Rol propio** | `--accion-whatsapp`. Pintaba `--accion`, igual que cualquier otra acción |
| **Verde** | `#25D366`, etiqueta `--negro-950` a 9.80:1. En blanco daría 1.98 |
| **Marco** | carbón que sigue la arista, en `::after`: 9.40:1 contra el suelo. Sin él, el verde tiene la misma luz que el acero —1.04:1— y solo resaltaba por color |
| **Jerarquía** | los cuatro «Escribir por…» de la portada pasan a `secundario`. Había seis botones idénticos |
| **Barra fija** | pasa a bloque verde, sola, sin marco: ya vive sobre carbón |

## Lo que se dijo ANTES de elegir

Cuatro objeciones, escritas en la conversación antes de la decisión. Se registran
aquí enteras, como en el [[ADR-0034-entran-imagenes-generadas|ADR-0034]]:

1. **El verde no es un color de su marca.** El ADR-0007 dice que el lenguaje visual
   sale de sus piezas; este verde sale de WhatsApp. Nadir lo eligió por
   reconocimiento. Se recomendó la placa de oro metálica.
2. **La entrada vuelve a ser oscura el mismo día** en que el
   [[ADR-0043-un-solo-suelo-una-sola-puerta|ADR-0043]] la pasó a piedra clara. En la
   portada queda pegada a la cinta de carbón, y en teléfono **la primera pantalla
   entera es oscura**.
3. **A pleno sol una pantalla oscura refleja más.** El validador no lo mide: es un
   riesgo, no un dato.
4. **El cepillado del suelo cuesta LCP.** En el prototipo, contra el suelo liso del
   mismo tono, entre 65 y 105 ms más. Se recomendó el liso.

## Lo medido, sobre el build real

### Contraste · 16/16 CUMPLE

| Páginas | HEAD | Ahora | Qué lo fija |
|---|---|---|---|
| portada, empeño | 3.47 | **4.00** | `--oro-500` sobre el punto más claro del pavonado |
| maquinaria, fletes, taller | 6.47 | **4.83** | texto chico en `--negro-200` sobre ese mismo punto |
| contacto, legales | 8.56 | **6.29** | `--negro-700` sobre el suelo |

Las dos primeras filas miden el **peor** punto del cepillado, no el promedio. Los
brillos llevan tope exacto por tabla de transferencia, así que el peor punto está
garantizado, no estimado.

### LCP · intercalado en los dos órdenes contra HEAD

| | HEAD | Ahora | Δ | Primer pintado |
|---|---|---|---|---|
| empeño | 1404 · 1268 · 1224 · 1188 → **1246** | 1268 · 1316 · 1316 · 1400 → **1316** | **+70** | 1204 → 1316 |
| portada | 1152 · 1120 · 1116 · 1128 → **1124** | 1268 · 1232 · 1244 · 1628 → **1256** | **+132** | 1084 → 1244 |

En la portada **ninguna lectura nueva baja de la peor de HEAD**. En empeño las series se
cruzan y el +70 es más débil. **Hay mecanismo**: el primer pintado se mueve lo mismo que
el LCP, y eso es ráster de filtros SVG antes del primer cuadro. En esta máquina, y con
la advertencia de siempre: ninguna cifra absoluta es comparable entre sesiones, y en un
teléfono de gama baja el ráster pesa más. Ese número no se tiene.

### Lo que baja

| | HEAD | Ahora |
|---|---|---|
| Peso de empeño | 247.2 KB · 27 peticiones | **237.4 KB · 26** |
| Peso de la portada | 192.0 KB · 19 | **182.2 KB · 18** |
| Elemento LCP de empeño | la textura de mármol | texto |
| Elemento LCP de la portada | la textura de mármol | la foto de la fachada |

La textura de mármol ya no se pide. Las texturas nuevas son SVG dentro del CSS: no
añaden ninguna descarga.

| | |
|---|---|
| Tests | **148** |
| CA-10 | cumplido · **35.55 KB** de margen · sin cambio |
| CA-08 | `npm run build` sigue saliendo con **código 1** por el centinela |
| Selectores CSS sin usar | **0** |
| Desborde horizontal | 22 px en empeño a 390, **idéntico en HEAD** · es `ul.anillo`, el del ADR-0041 |

## Cinco cosas que aparecieron de paso

1. **El icono del retorno escribía `--oro-800` a mano.** Sobre la sala oscura daba
   2.91:1. Con el rol `--oro-texto-grande` da 7.73:1, y en claro no cambia nada.
2. **`--negro-400` se escribía directo en seis sitios**, en cuatro archivos, donde ya
   existía el rol `--panel-borde`. Sobre el suelo de acero da 1.83:1. Ahora pasan por
   el rol, que vale `--negro-600`: 4.55:1.
3. **El anillo de foco sobre pavonado daba 1.45–2.78:1.** Los botones de la entrada
   perdían el foco visible. El ADR-0045, en paralelo, lo pone en blanco para todo el
   registro oscuro; aquí se da el mismo valor en `.pavonado` —6.99–13.39:1— para no
   depender de una rama sin unir. Verificado con el tabulador en el sitio construido.
4. **`herramientas/auditar-fondos.mjs` no corría desde su carpeta** desde el ADR-0043.
   Importaba `./herramientas/navegador.mjs` estando ya en `herramientas/`. Funcionó el
   día que se escribió porque se lanzó desde la raíz.
5. **Se dijo que habría que añadir pares a `verificar-contraste.py`, y era un error.**
   Ese script recalcula los ratios de la hoja de diseño (`*.dc.html`), no los tokens
   del sitio. Los pares del acero viven en los comentarios de `tokens.css` y aquí.

## Lo que queda abierto

- **El ADR-0045 va en paralelo** y toca `tokens.css`, `base.css` y `+layout.svelte`.
  Se leyó su diff antes de escribir este: los fragmentos no se pisan. El índice de
  ADRs sí va a chocar, porque los dos añaden una línea al final, y se resuelve
  dejando las dos.
- **El glifo de WhatsApp sigue siendo un globo sin auricular, y eso tiene riesgo.**
  Revisadas las normas de marca de WhatsApp en el sitio de Meta el mismo día:
  - El logotipo oficial **solo** se toma de ese sitio, en un «Paquete de logotipos» que
    se descarga aceptando sus condiciones de uso. Un redibujo no vale.
  - Se puede escalar, pero **no cambiar su diseño ni sus colores**, ni combinarlo con
    otras palabras o imágenes.
  - WhatsApp **no puede ser el elemento más destacado** de la página. La barra verde a
    todo el ancho de este ADR choca con eso en cuanto lleve su logotipo.
  - Prohíben usar una imagen que pueda confundirse con su logotipo del teléfono. **El
    icono de hoy imita su silueta sin ser el suyo**, y sobre su verde, más.
  - Sobre el verde `#25D366` el glifo oficial solo funciona si el paquete trae una
    versión oscura: verde sobre verde no se ve y blanco da 1.98:1. Qué versiones trae
    no se sabe hasta descargarlo, y aceptar sus condiciones le toca a Nadir.

  **Decidido el mismo día: se deja así.** Nadir lo vio con los tres caminos delante
  —glifo oficial sobre carbón, glifo oscuro sobre el verde con la barra en carbón, o
  un icono genérico— y con el riesgo del icono actual escrito. Queda anotado, no
  resuelto.
- **Quedan sin uso** el grado `marmol` de `Seccion`, los tokens `--marmol-fuerte` y
  `--textura-marmol` y los archivos `/marca/marmol-900.*`. No se borran: revertir esto
  es cambiar un grado.
- **Si el costo del cepillado se nota en un teléfono de verdad**, la salida es
  prerenderizar las texturas a AVIF: se cambia ráster por bytes. No se ha medido.

## Evidencia

| Qué | Dónde |
|---|---|
| El acero de marca y el cepillado del suelo | `src/lib/estilos/tokens.css:343` · `:358` |
| El pavonado y su peor punto | `src/lib/estilos/tokens.css:374` · `:382` |
| El verde | `src/lib/estilos/tokens.css:393` |
| Los roles: suelo, placa, filete, tinta secundaria | `src/lib/estilos/tokens.css:113` · `:115` · `:122` |
| El rol y el marco de WhatsApp | `src/lib/estilos/tokens.css:154` · `:159` |
| El suelo en el cuerpo | `src/lib/estilos/base.css:32` · `:42` |
| El grado `pavonado` y su registro oscuro | `src/lib/componentes/Seccion.svelte:33` · `:124` |
| El verde y el marco en el botón | `src/lib/componentes/BotonWhatsApp.svelte:70` · `:122` · `:193` |
| La entrada y la sala de la portada | `src/routes/+page.svelte:76` · `:165` |
| Los cuatro secundarios | `src/routes/+page.svelte:257` |
| La entrada y la sala de las de giro | `src/routes/[giro]/+page.svelte:51` · `:313` |
| La cabecera | `src/routes/+layout.svelte:156` |
| El icono del retorno | `src/lib/componentes/FlujoProceso.svelte:153` |
| Los filetes por rol | `Tarjeta.svelte:81` · `:134` · `Hueco.svelte:77` · `[giro]/+page.svelte:581` |
| El auditor que ya corre | `herramientas/auditar-fondos.mjs:20` |
| Cómo queda | `capturas/acero-marca-portada-1280.png` · `capturas/acero-marca-empeno-1280.png` · `capturas/acero-marca-390.png` |

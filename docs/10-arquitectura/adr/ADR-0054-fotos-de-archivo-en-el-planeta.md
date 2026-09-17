---
tipo: adr
id: ADR-0054
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: la regla que queda del ADR-0007 en el CLAUDE.md —«las imágenes que no son suyas se distinguen de las que sí»—, en el planeta de bienes
implementa: Claude Code
---

# ADR-0054 · Dos fotos de archivo en el planeta, sin marca

## Qué se pidió

> *«Ahora hay que buscar imágenes para rellenar las secciones que están faltantes; puedes buscar
> en la red? O crearlas?»* — Nadir

Se le propusieron dos caminos a la vez y dijo que sí a los dos:

- **Una lista de tomas para Cristóbal**, con lo que solo él puede fotografiar: su unidad de fletes,
  su taller, lo que tiene a la venta y las piezas de su vitrina.
- **Banco de imágenes con licencia solo para dos discos genéricos del planeta**: «Autos» en empeño
  y «Carga general» en fletes. Se buscarían candidatas, se verían dentro de su disco y Nadir
  elegiría una por hueco antes de ponerlas en el sitio.

Autorizó la descarga de cuatro candidatas (*«Si, dale. Te autorizo»*). Se le mandó una hoja con
las cuatro montadas en su disco del sitio publicado, la recomendación —**A** para «Autos», **C**
para «Carga general»— y una pregunta: si ponía un renglón que avisara que no son fotos suyas.
Contestó:

> *«No es necesario distinguir/avisar que no son fotos del cliente. No lo hagas solo monta las
> fotos.»* — Nadir

La respuesta no nombró otras fotos, así que **se montan las dos recomendadas**.

## Lo que se decide

- **«Autos» en empeño lleva la foto A**: una mano entrega un llavero a otra mano abierta.
- **«Carga general» en fletes lleva la foto C**: costales blancos sobre la plataforma de un camión.
- **Van sin marca.** Ni rótulo en el disco ni nota al pie del planeta.
- **No cambia nada más.** Los discos sin foto siguen con su ícono hasta que lleguen las de
  Cristóbal: los seis de venta —«Autos» incluido— y «Maquinaria pesada» en fletes. La nota al pie de
  la secuencia de joyería (ADR-0034) se queda.

### Lo que enmienda

El CLAUDE.md dice que de la regla del ADR-0007 queda esto: *las imágenes que no son suyas se
distinguen de las que sí*. **En el planeta ya no es cierto, y por decisión.**

Tampoco lo era antes de hoy, y conviene decirlo: «Relojes» y «Monedas» son de banco y en el planeta
no llevan marca. El ADR-0025 había bajado los rótulos «FOTO DE ARCHIVO» a un bloque de revisión y
el ADR-0027 quitó ese bloque; no encontré ningún ADR que decidiera dejarlas sin marca. Era una
omisión que nadie anotó. **Desde este ADR es una decisión.**

## La objeción, registrada

El punto 1 se planteó antes de montarlas. El 2 y el 3 se añaden aquí.

1. **Se rompe la regla que quedaba en pie.** Con este cambio, en el planeta de empeño **tres de seis
   discos** son de banco y en el de fletes **uno de dos**, y la página no lo dice en ningún lado.
2. **En fletes, la foto puede leerse como su unidad.** Va bajo «¿Qué transportan?», y la entrada
   de la misma página dice *«Movemos maquinaria pesada y carga general.»*
3. **La foto A afirma algo que nadie ha confirmado.** Muestra a alguien dejando la llave, y eso
   coincide con la propuesta de la página —*«tu bien queda resguardado»*—. Si Cristóbal presta sin
   quedarse con el auto, la foto dice lo contrario.

## Las candidatas

Buscadas en Unsplash y medidas **dentro de su disco del sitio publicado**, girado al frente, a 390 y
a 1280. La hoja completa está en `capturas/planeta-candidatas.jpg`.

| | Foto | Luz medida | Lo que se vio |
|---|---|---|---|
| **A** · elegida | [La llave que se entrega](https://unsplash.com/photos/iDSsOlqFa8w) · yahdi yasya | **210** | Se entiende a 92 px. **El círculo más claro del planeta**, por mucho. El llavero parece de motoneta —el tercer botón tiene el dibujo de una moto—; en el disco no se distingue |
| B | [La llave en el switch](https://unsplash.com/photos/7mgR-BZ5Dm4) · Ivan Shemereko | 17 | Del tono del planeta, pero **a 92 px no se lee**: un brillo de metal sobre negro, y la llave queda bajo el velo del rótulo |
| **C** · elegida | [Costales en la plataforma](https://unsplash.com/photos/a-semi-truck-is-loaded-with-white-bags-WZrmEaufAyQ) · Zemos | 94 | Carga suelta arriba de un camión: lo que «general» quiere decir. Los costales llevan impresa una marca turca que en el disco no se lee |
| D | [Estructuras de acero](https://unsplash.com/photos/heavy-metal-structures-loaded-on-a-flatbed-truck-DpQ8vx5mXm4) · Lucas | 154 | Se lee como carga pesada, no general. La foto completa trae una **placa legible** de Estados Unidos y las marcas del remolque |

**Luz medida**: luminancia media, de 0 a 255, del 42 % de arriba del cuadro, que es lo que el velo
del rótulo deja limpio —su degradado sube desde abajo y llega a cero al 58 %—. Los discos que ya
había: Oro y joyería 19, Relojes 50, Herramienta 68, Maquinaria 85 y Monedas 93.

## Procedencia y licencia

Las dos son de Unsplash, bajo su [licencia](https://unsplash.com/license): uso comercial libre y sin
atribución obligatoria.

| Archivo | Fuente descargada | Recorte cuadrado |
|---|---|---|
| `bien-autos` | `images.unsplash.com/photo-1761014586544-53fe5e1f1e25?w=1200&q=80&fm=jpg` · 1200 × 1800 | x 200–960, y 650–1410 · 760 px, reducido a 400 |
| `bien-carga` | `images.unsplash.com/photo-1708596718852-5aa3947ccdf5?w=1200&q=80&fm=jpg` · 1200 × 800 | x 790–1190, y 400–800 · 400 px, sin escalar |

**Las descargas no se versionan**: `docs/00-inbox/` es para lo que manda Cristóbal, y esto no lo
mandó él. Con la dirección y la caja de recorte se rehacen. Las dos venían con perfil sRGB, así que
soltarlo no cambia el color.

## Los archivos

| | JPEG | WebP | AVIF | SSIM del AVIF |
|---|---|---|---|---|
| `bien-autos-400` | 10.1 KB | 5.9 KB | **3.8 KB** | 0.992 |
| `bien-carga-400` | 37.7 KB | 30.9 KB | **19.4 KB** | 0.982 |

- **Solo 400.** El disco pinta 132 px como máximo, 264 a densidad doble, y el propio componente lo
  dice: el de 400 ya lo cubre. `fotoMaxAncho: 400`.
- **Cuadradas.** El disco es redondo y recorta al centro: el encuadre elegido solo se respeta si el
  archivo ya es ese cuadro.
- **Cómo salen.** El JPEG, con Pillow —recorte, Lanczos y calidad 80—. El WebP y el AVIF, con
  `hacer-webp.mjs` y `hacer-avif.mjs`, como todas. `hacer-webp.mjs` reescribe todas las fotos y dio
  los mismos bytes: git no marca ninguna otra.
- **Sin `fotoEsSuya`**, porque no lo son. El planeta no lo lee, pero el dato queda dicho.

## Lo medido

| | |
|---|---|
| Tests | **180** · 4 nuevos en `tests/planeta-fotos.test.ts`. **Cada uno falla cuando debe**: comprobado quitando la foto de «Carga general», borrando su AVIF y poniendo una nota junto al planeta |
| Build de revisión | CA-10 cumplido · **35.55 KB** de margen, sin cambio: no hay JavaScript nuevo |
| Accesibilidad | **18/18 CUMPLE** |
| Inventario tipográfico | ninguna combinación fuera de la escala |
| En el build servido, a 390 y 1280 | los dos discos piden **el AVIF de 400**, responde 200, el archivo mide 400 × 400, `object-fit: cover`, cero errores de consola |
| Peso | las fotos del planeta cargan en diferido: **+3.8 KB** en empeño y **+19.4 KB** en fletes cuando el planeta entra en pantalla |

## Lo que queda abierto

- **Las fotos de Cristóbal** sustituyen a estas cuando lleguen: están en su lista de tomas como «un
  auto a la venta» y «la unidad con carga general».
- **El rótulo «Carga general» se corta** en el borde del disco en teléfono cuando pasa al frente.
  Pasa igual con el ícono: no es de la foto.
- **Los contrastes del CLAUDE.md para las páginas de giro están viejos.** Dice 4.83:1 en venta,
  financiamiento, fletes y taller; `validar-a11y.mjs` da **4:1** en las cuatro, y lo da también contra
  el sitio publicado **antes de este cambio**. No lo movió este ADR.

## Evidencia

| Qué | Dónde |
|---|---|
| «Autos» con foto | `src/lib/datos/giros.ts:240` |
| «Carga general» con foto | `src/lib/datos/giros.ts:250` |
| El disco pinta la foto | `src/lib/componentes/PlanetaBienes.svelte:81` |
| Los archivos | `static/fotos/bien-autos-400.{jpg,webp,avif}` · `static/fotos/bien-carga-400.{jpg,webp,avif}` |
| El test | `tests/planeta-fotos.test.ts` |
| Cómo queda | `capturas/planeta-autos-390.png` · `capturas/planeta-carga-390.png` · `capturas/planeta-autos-1280.png` · `capturas/planeta-carga-1280.png` |

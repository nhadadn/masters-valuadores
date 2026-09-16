---
tipo: adr
id: ADR-0043
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: ADR-0028 · ADR-0030 · ADR-0031
implementa: Claude Code
---

# ADR-0043 · Un solo suelo, una sola puerta, un solo negro

## Qué se pidió

> *«El background del sitio en general se ve mal… algunas partes se ve mármol, otras
> negro, otras blanco. Debemos revisar y auditar estos backgrounds de todas las
> secciones para encontrar uno general y bueno.»* — Nadir

Se auditaron **las ocho páginas**, sección por sección, midiendo el color computado y si
pintaba imagen. El script quedó en `herramientas/auditar-fondos.mjs`.

## Lo que salió, y era peor de lo que parecía

### 1 · Había TRES negros

| Token | Valor | Dónde pintaba |
|---|---|---|
| `--carbon` | `#171717` | pie de las ocho, paneles · **el ancla del ADR-0028** |
| `--campo-alto` | `#16181B` | banda de contacto y barra fija |
| `--superficie-oscura` | `#0C0D0F` | la cinta de palabras |

Cinco y once niveles de separación: **la distancia justa para que se vea la costura y no
la intención**. En la portada el hero caía directo sobre la cinta y se veían los dos, uno
encima del otro.

Los tres sobrevivieron a la inversión del `ADR-0028` sin que nadie se preguntara si
debían ser uno.

### 2 · La piedra estaba a media página en tres de cuatro giros

| Página | Índice de la sección de mármol |
|---|---|
| empeño | **2** — la entrada ✓ |
| maquinaria · fletes | **4** — a media página ✗ |
| taller | **3** — a media página ✗ |

Causa: `veta = registro === 'lujo' ? 'marmol' : 'tenue'`. Solo empeño entraba sobre
piedra; los otros tres entraban en blanco y recibían la losa **en el medio**, en la
segunda mitad de la entrada.

Eso contradecía de frente el [[ADR-0030-la-piedra-como-sujeto|ADR-0030]], que ya había
decidido lo contrario: *«la piedra se concentra en la entrada»*. Llevaba cuatro ADR sin
cumplirse en tres de las cuatro páginas.

### 3 · Dos puertas para la misma casa

La entrada al **sitio** era carbón. La entrada a cada **línea**, mármol.

## Lo que se hace

**Tres registros, cada uno con un trabajo y un sitio:**

| Registro | Valor | Dónde | Cuántas veces |
|---|---|---|---|
| **Blanco** | `#FFFFFF` | el suelo, en `body` | siempre |
| **Piedra** | mármol + velo | **la entrada**, en las cinco páginas con hero | **una** |
| **Carbón** | `#171717` | el pie, la cinta y la barra | **una** franja + el ancla |

Concretamente:

- `--campo-alto` apunta a `--carbon`, y la cinta también. **Un solo negro en el sitio.**
- `veta` deja de depender del registro: **la entrada lleva piedra en las cuatro** páginas
  de giro. La segunda mitad de la entrada pasa a blanco.
- **La portada entra por piedra**, como las líneas. La fotografía de la fachada se
  conserva y sobre piedra clara se lee como material de marca, no como banner.
- Fuera el galón de `piedra` —`rgb(216,210,198)`, 154 px— que quedaba entre el blanco y
  el pie. El escalón de verdad lo hace el pie.
- La sección `CONTACTO` de la portada pasa a blanco: era el tercero de tres bloques
  oscuros seguidos, unos **1040 px** de masa negra con las costuras dentro.

### Y el color forzado que explota, por quinta vez

`.titulo-seccion.oscuro` forzaba `--tinta-sobre-oscuro` en el `h2` de CONTACTO. Al pasar
esa sección a blanco, ese `h2` habría quedado **blanco sobre blanco**. Es la quinta vez
en este repo que un color escrito a mano en el marcado explota al cambiar la superficie
de debajo, y la quinta vez que la respuesta es la misma: dejar que el token del registro
decida. La clase salió y su regla también.

## El campo libre que se pidió

> *«Buscamos dejar un green field para colocar un background para poder mejorar aún más
> estos colores de fondo.»*

Antes no lo había: los cinco grados claros de `Seccion` pintaban `--blanco` **cada uno
por su cuenta**, así que poner mañana una textura o un color al sitio no se habría visto
— cada sección lo tapaba con su propio blanco.

Ahora esos cinco grados son **transparentes** y el suelo lo pone `body` en `base.css`.
**Cambiar el fondo del sitio entero es cambiar una declaración, en un archivo.**

**No se pierde la precaución del `ADR-0028`.** Aquella exigía un color plano declarado
para que el validador —o un navegador que falle al pintar— no acabara leyendo lo que
hubiera detrás. Sigue habiendo uno: está en `body`, un nivel más arriba, y el recorrido
de `validar-a11y` sube por los ancestros hasta encontrarlo. Medido: **el contraste no se
movió un punto.**

La entrada conserva su `--crema-100` porque su velo sí es un degradado y ese sigue siendo
su peor extremo; el pie conserva su carbón.

## Lo medido

| | Antes | Después |
|---|---|---|
| Negros distintos en superficies grandes | **3** | **1** |
| Páginas de giro con la piedra en la entrada | 1 de 4 | **4 de 4** |
| Tonos claros distintos | 3 · blanco, mármol, piedra | **2** · blanco y mármol |
| Bloques oscuros seguidos en la portada | 3 · ~1040 px | **1** · el pie |
| Puntos donde se cambia el suelo del sitio | 5 reglas | **1** |

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **148** |
| Selectores CSS muertos | **0** |

## Una nota sobre este commit

Se hizo con **otra sesión trabajando en el mismo repo al mismo tiempo**. Se detectó antes
de commitear: había un `FlujoProceso.svelte` sin versionar, su test, y un
[[ADR-0042-el-proceso-como-circuito|ADR-0042]] que ocupaba el número que este ADR iba a
llevar. Este se renumeró a 0043.

Los dos editábamos `src/routes/[giro]/+page.svelte`. **No se commiteó nada hasta
preguntar**, porque hacerlo habría dejado en `main` un `import` a un archivo que no
estaba en el repo. Con el visto bueno de Nadir, el trabajo ajeno fue a su propio commit,
con su propio mensaje y sin mezclarse con éste.

## Lo que queda abierto

- **La cinta de palabras** es ahora lo único oscuro por encima del pie: 50 px de oro
  sobre carbón, justo bajo la entrada de piedra. Se miró y se dejó: son las palabras de
  su propio letrero y hace de regla entre la entrada y el contenido. Si se quisiera un
  sitio sin nada oscuro salvo el pie, ésa es la pieza a discutir.
- **El campo libre está listo y vacío.** Lo que se ponga ahí es la siguiente decisión.

## Evidencia

| Qué | Dónde |
|---|---|
| El auditor | `herramientas/auditar-fondos.mjs` |
| Un solo negro | `src/lib/estilos/tokens.css` · `--campo-alto` · `CintaPalabras.svelte` |
| La piedra en la entrada | `src/routes/[giro]/+page.svelte` · `veta` |
| La puerta de la portada | `src/routes/+page.svelte` |
| El suelo en un sitio | `src/lib/componentes/Seccion.svelte` · `base.css` |
| Cómo queda | `capturas/portada-piedra.png` |

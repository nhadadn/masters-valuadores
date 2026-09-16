# Masters Valuadores · contrato de trabajo

Sitio multigiro para **Masters Valuadores**, Torreón, Coahuila. Cliente: Cristóbal.
Consultoría: **Nazmelia**. Este archivo es el contrato: léelo completo antes de tocar nada.

---

## Cómo se trabaja aquí

**SDD.** Nada se implementa sin spec aprobada. Las specs viven en `docs/20-specs/`
y pasan por BORRADOR → EN REVISIÓN → BLOQUEADA → APROBADA → IMPLEMENTADA → OBSOLETA.

**C4.** La forma del sistema está en `docs/10-arquitectura/c4/`. Nivel 4 no se mantiene
a propósito.

**ADR.** Toda decisión cara de revertir nace como ADR en `docs/10-arquitectura/adr/`.
No se borran: una decisión mala documentada vale más que una buena olvidada.

### Grados de evidencia — no negociables

| Grado | Qué significa |
|---|---|
| **A** | Hay un test que corre y pasa |
| **B** | Hay código de producción, citable como `ruta/archivo:línea` |
| Planeado | Existe una spec. **No** es implementado |
| Nada | Una mención en un README, un comentario, un TODO, un nombre de variable |

- **Nunca declares algo implementado sin cita `ruta/archivo:línea`.**
- **Ante la duda entre dos estados, elige el más bajo y dilo.**
- Distingue siempre «planeado» de «implementado».
- No asumas convenciones de este repo sin verificarlas **en este repo**.
- Si una instrucción choca con la documentación, **detente y pregunta**. No resuelvas
  el conflicto por tu cuenta.

### Tono

Cero adulación y cero optimismo de cortesía. Si algo no está listo, la frase es
«no está listo», no «está en camino». Un hallazgo negativo bien evidenciado vale más
que uno positivo mal sustentado.

---

## Lo que NO se inventa, nunca

Esta es la línea que sostiene el proyecto entero. Se marca y se sigue:

- **Cifras**: precios, tasas, plazos, porcentajes, aforos.
- **Horarios, dirección, teléfono, WhatsApp, razón social.**
- **Qué bienes aceptan.** Si el sitio dice que aceptan algo que no aceptan, el
  visitante llega, se va y no vuelve.
- **Reseñas, testimonios, superlativos** («los mejores de la Laguna»).
- **Categoría primaria de Google** — sale de la Etapa 1, no de la intuición.
- **Slugs definitivos** — el slug es la promesa que el sitio le hace a Google sobre
  qué contiene la página. Salen del estudio de búsqueda.

Todo eso se marca `__POR_CONFIRMAR__` y el build de producción **falla** si sobrevive.

**ENMENDADO el 15 de septiembre · `ADR-0034`.** La regla del `ADR-0007` —*«sus piezas
usan imágenes de archivo o generadas: en el sitio van fotos suyas o va hueco»*— **ya no
está entera**. El `ADR-0009` revirtió la mitad de archivo en septiembre 10 y el
`ADR-0034` revirtió la de generadas hoy. Las dos por decisión de Nadir, las dos con la
objeción registrada por escrito antes de ejecutarlas.

Lo que queda de esa regla: **las imágenes que no son suyas se distinguen de las que sí**
—hoy con una nota al pie de la secuencia— y **ninguna finge ser la fachada**.

### Lo que SÍ se puede redactar

Corregido el 10 de septiembre. Redactar no es inventar afirmaciones:

- **Sí**: titulares, subtítulos, etiquetas de sección, descripciones de un giro que
  solo digan lo que ese giro es por definición, texto de interfaz.
- **Siempre**: marcado como **propuesta** para que el cliente corrija, nunca publicado
  como hecho, y sin una sola afirmación que no se pueda respaldar.
- La regla operativa: un formulario en blanco no regresa; un borrador regresa marcado.

**ENMENDADO el 14 de septiembre · `ADR-0027`.** Nadir decidió quitar **todas las marcas
visibles** de borrador de la portada y las cuatro páginas de giro: la banda amarilla, el
bloque de revisión, los huecos «PENDIENTE» y los `__POR_CONFIRMAR__` en pantalla.

Lo que **no** cambió, y conviene tenerlo claro: el centinela sigue en `negocio.ts`, el
grafo sigue lanzando excepción y **`npm run build` sigue saliendo con código 1**. La red
está puesta; lo que se quitó es que se vea.

El efecto secundario hay que decirlo: **el sitio parece terminado y no lo está.** Faltan
la tasa, el plazo, la razón social y 27 huecos de copy, y ya no se ven en pantalla.
La ampliación a `/contacto/` y las legales se hizo el mismo día.

**CORREGIDO el 14 de septiembre por la noche · `ADR-0031`.** Aquí decía que «las ocho
páginas están a cero marcas visibles». **Es falso para la portada**, verificado en el
HTML construido y no en una captura: sigue publicada una tarjeta **«BLOQUEADOS»** con
`Importaciones D-04`, `Avalúos periciales D-03` y `Bazar D-18` —identificadores de
decisiones internas— y **dos rótulos «FOTO DE ARCHIVO»**. Lo que el `ADR-0027` sí dejó
en cero son las cuatro categorías que midió: banda, hueco «PENDIENTE», bloque de
revisión y centinela visible. Estas dos son de otra familia y **siguen ahí, sin
decidir**. En contacto no había formulario que proteger —solo el
bloque que explicaba por qué no lo hay— y se queda con WhatsApp, teléfono y mapa.
**Las dos legales quedan en blanco con título** — 54 y 32 caracteres— y siguen
enlazadas desde el pie.

---

## Estado

| Capa | Estado |
|---|---|
| Etapa 1 · Data Intelligence | **NO EJECUTADA** — es el cuello de botella del SEO |
| Sistema de diseño | Cerrado y verificado |
| Fase 0 · armazón | **IMPLEMENTADA** · 10/10 criterios, 31 tests |
| Contenido | **CERO**. Es el trabajo que sigue |
| Descubribilidad | **IMPLEMENTADA** · SPEC-0003 · 10/10. Título, descripción, canónica, tarjeta de enlace, `sitemap.xml` y `robots.txt` |
| Publicación | Bloqueada por el **dominio** (D-07) y por el copy. El NAP ya no la bloquea |
| Registros visuales | **INVERTIDOS el 14 de septiembre** · `ADR-0028`. La piedra clara es el registro de la casa y el carbón el ancla del pie. Los roles oscuros viven enteros en `.registro-oscuro`. **ENMENDADO el mismo día · `ADR-0030`**: los cinco grados siguen existiendo, pero **solo dos pintan algo**. La piedra se concentra en la entrada; el resto es marfil plano. Se retiró la mancha de oro que vagaba por el cuerpo. **BLANCO PURO desde el `ADR-0031`**: cuerpo, cabecera y los grados planos en `#FFFFFF`; el color lo ponen las fotografías. **ACERO DE MARCA desde el `ADR-0046`**: suelo `#BFBBB7` cepillado —el gris de la M de su tablero, medido en sus píxeles—, la entrada y una sala por página en acero pavonado con los roles oscuros, y WhatsApp en verde con marco de carbón. El mármol sale de la entrada |
| JavaScript | **Solo en `/empeno-y-prestamo/`** · **4.45 KB gzip**, sin marco ni librería · `ADR-0023`, `ADR-0026` y `ADR-0033`. **CAYÓ de 12.10 a 4.54 el 15 de septiembre · `ADR-0038`**: al quitar la segunda mitad de la entrada se fue con ella la banda de monedas del `ADR-0021`, que queda inalcanzable. Margen de CA-10: **35.55 KB**. El carrusel cambió de trabajo el mismo día · `ADR-0039`: ya no arregla anclas, **avanza solo** — y el script nuevo pesa menos que el viejo. Las otras siete en 0 KB |
| Fotografías reales | **SIETE**, no ocho · seis del patio · `ADR-0022`, más **UNA** de su joyería. **CORREGIDO el 15 de septiembre · `ADR-0033`**: el `ADR-0024` contaba dos, pero `bien-joyeria` y `bien-oro` son **la misma toma en dos recortes** — comprobado mirándolas. De esa única foto salen además las tres vistas de `galeriaJoyeria`. **Falta autos**; monedas entró de banco · `ADR-0025`. **Y desde el 15 de septiembre el sitio publica CUATRO IMÁGENES GENERADAS** como referencia en la secuencia de joyería · `ADR-0034`: decisión de Nadir tras plantearse la objeción dos veces. Llevan nota al pie y están marcadas `referencia: true` en `galeria.ts` |
| Indexación | **Apagada a propósito** hasta que cierre D-07 · `ADR-0013` |

### Decisiones cerradas

| Qué | Dónde | Quién |
|---|---|---|
| Multigiro bajo la marca MÁSTER | `ADR-0003` | Cristóbal |
| Identidad plana | `ADR-0004` | Nadir |
| **La marca se escribe `MASTER`, sin S** — revierte la grafía del 0004 | `ADR-0018` | Cristóbal |
| Acento `#E7C041` — el que la marca sí publica | `ADR-0006` | Nadir · revierte el `ADR-0005` |
| **Lenguaje visual derivado de sus publicaciones** | `ADR-0007` | Nadir · **falta implementarlo** |
| Tipografía Archivo, autoalojada | `ADR-0002` | Nadir |
| **DOS familias desde el 14 de septiembre** · EB Garamond solo en el titular y su promesa · enmienda el 0002 | `ADR-0029` | Nadir |
| SPEC-0001 aprobada e implementada | `SPEC-0001` | Nadir |
| **Sin dominio el sitio no se deja indexar** — se abre solo al cerrar D-07 | `ADR-0013` | Nadir |

Tablero de lo abierto: `docs/30-cliente/decisiones-pendientes.md`.

---

## Arquitectura

```
src/lib/config/negocio.ts   ÚNICA fuente de datos del negocio. Hay un test que lo vigila
src/lib/datos/              giros e íconos
src/lib/estilos/            tokens.css · fuentes.css · base.css. Ningún componente escribe un color
src/lib/componentes/        los primitivos. CERO librería de UI
src/lib/seo/jsonld.ts       el @graph. Lanza excepción si falta un dato
src/lib/seo/enlaces.ts      origen del sitio, inventario de páginas, sitemap y robots
src/lib/seo/meta.ts         título y descripción de cada ruta. TODAS son propuesta
src/routes/                 8 páginas, todas prerenderizadas · ADR-0008
herramientas/               presupuesto de JS, accesibilidad, peso y generadores de imagen
```

### Tres decisiones que hay que respetar

**1 · Cero marco en el cliente.** `csr = false` en `src/routes/+layout.ts:28`.
Medido: el runtime de Svelte 5 más el enrutador pesan 46 KB gzip por página contra un
presupuesto de 40. No se subió el presupuesto: se quitó el runtime. El acordeón usa
`<details>` nativo.

**Enmendado el 11 de septiembre · `ADR-0021`.** Aquí decía «cero JavaScript» y ya no
es literal: `/empeno-y-prestamo/` sirve **11.2 KB** de script propio —la banda de
monedas del `ADR-0021`, los puntos del carrusel del `ADR-0023` y la pausa del planeta
del `ADR-0026`—. Las otras siete
páginas siguen en 0 KB y el presupuesto sigue en 40.

La regla que queda es más estrecha, no más laxa: **nada de marco, nada de librería, y
lo que entre lo paga su ruta**. `csr` sigue en `false`; el script es un archivo de
`static/` que no arrastra bundle. Si una pantalla necesitara interacción de verdad,
`csr = true` en ESA ruta — pero eso son 46 KB antes de escribir nada, así que la
respuesta por defecto es no.

**2 · CA-08 no es un test, es el build.** `src/lib/seo/jsonld.ts:135`. El grafo se arma
durante el prerender, así que la excepción revienta la publicación. `npm run build`
sale con código 1 hoy, y **eso es correcto**. Escotilla: `npm run build:revision`.

**3 · Una sola ruta `[giro]`.** Las cuatro páginas de giro son la misma plantilla.
`entries()` en `src/routes/[giro]/+page.ts:14` las prerenderiza igual.

---

## LO PRIMERO QUE HAY QUE HACER · ADR-0007

El armazón está de pie y **se ve genérico**. Es una crítica aceptada, no una opinión:
el sistema codifica pisos —contraste, táctil, bytes— y ninguna voz. El resultado es que
nada está mal y nada es de nadie.

El [[ADR-0007-lenguaje-visual|ADR-0007]] está ACEPTADO y **sin implementar**. Define
seis piezas sacadas de las publicaciones vivas del cliente, no del gusto de nadie:
la diagonal, la banda de contacto, las insignias circulares, el titular a dos tintas
en peso 900, la arista del botón primario y la regla dorada.

**Léelo completo antes de tocar un estilo.** Trae las reglas, las restricciones que no
se negocian y lo que NO se toma de sus piezas. Ninguna de las seis rompe el cero
JavaScript ni el contraste: todas son CSS.

El peso 900 de Archivo ya está en `static/fuentes/` — 13.2 KB, medido — pero **no está
cableado**. Es parte del trabajo.

### Números medidos, no estimados

8 páginas · HTML de 3.5 a 6.5 KB gzip · **148 tests** · objetivo táctil mínimo 44 px ·
16/16 combinaciones página × ancho cumplen · 12/12 de las piezas del ADR-0007.

**CORREGIDO el 16 de septiembre · `ADR-0042`.** Aquí decía «**0 KB de JS en siete**, 11.2
KB en `/empeno-y-prestamo/`». Las dos mitades son falsas y se vieron midiendo otra cosa,
con `node herramientas/presupuesto.mjs` contra el build:

```
4.45  /empeno-y-prestamo/            2.05  /compra-venta-de-maquinaria/
2.05  /fletes-y-logistica/              0  las otras cinco
```

Empeño son **4.45** desde el `ADR-0038`, no 11.2 — eso ya lo decía la tabla de Estado y
este párrafo no se actualizó. Y **maquinaria y fletes no están en cero**: sirven
`planeta.js` desde el `ADR-0026`, porque el planeta lo pinta cualquier giro con bienes.
Taller no tiene bienes y por eso sí está en 0. **Son cinco páginas en cero, no siete**, y
lleva así desde el ADR-0026. El `ADR-0042` no añadió un solo byte: es CSS.

Contraste mínimo por página, medido tras el `ADR-0046`: **4.00:1** en portada y empeño
—el oro del titular sobre el punto más claro del acero pavonado—, **4.83:1** en
maquinaria, fletes y taller —texto chico sobre ese mismo punto— y **6.29:1** en contacto
y las dos legales —la tinta secundaria sobre el suelo de acero—. Son los PEORES puntos
del cepillado, no el promedio.

**CORREGIDO el mismo día.** Aquí decía, tras el `ADR-0042`, 8.56 en portada y 5.76 en
las tres de giro. El `ADR-0043` ya los había movido y nadie lo anotó: medido antes de
este cambio, **3.47** en portada y **6.47** en las tres.

Las tres de giro estaban en **4.65:1** hasta el `ADR-0042` y subieron sin que ese fuera
el objetivo: su peor combinación era el numeral `01` de los pasos en
`--oro-texto-grande`, y al salir los numerales salió con ellos. La regla sigue siendo la
del `tokens.css`: en texto chico va tinta; en display, oro.

**LCP de empeño: 1244 ms** · `ADR-0029` · el elemento es la textura de mármol, 10.7 KB en AVIF. **Desde el `ADR-0046` el elemento es texto y el mármol ya no se pide** (−9.8 KB, una petición menos), pero el cepillado cuesta **+70 ms en empeño y +132 en portada**, intercalado en los dos órdenes contra HEAD en esta máquina. Fuentes: 78.5 KB — Archivo en 4 pesos más EB Garamond 400 · 173.5 KB, 0 de terceros.

**NINGUNA cifra absoluta de LCP de este repo es comparable entre sesiones.** La máquina dio 4356, 8948 y 7636 ms para el mismo código; el 14 de septiembre por la noche ese mismo 1244 se midió en **3804 ms**, tres veces peor, sin tocar nada. Solo valen las parejas intercaladas en la misma fase — y **en los dos órdenes**: el `ADR-0030` vio una «regresión» de 700 ms que cambió de bando al invertir el orden.

**Y añadido el 15 de septiembre · `ADR-0035`: un grupo apretado de lecturas NO prueba nada si todas se toman en la misma fase.** Esa noche tres lecturas seguidas dieron 3840, 3828 y 3944 —desviación de 60 ms, o sea con toda la pinta de ser real— contra los 1344 de veinte minutos antes para el MISMO código. Intercalado, el commit anterior también medía ~3900. La baja varianza engaña igual que la alta. En las otras tres de giro, 1888–1904 ms desde el `ADR-0023`. La foto de entrada
llevaba `loading="lazy"` siendo el elemento LCP, en las cuatro, desde el `ADR-0009`.
Vale cerca de un segundo y se destapó midiendo otra cosa.

La banda de monedas, medida contra la misma página sin ella y en la misma fase:
**+509 ms de hilo mientras caen**, **+66 ms ya asentadas**, cero tareas largas, y 49
fps con el reloj a 1/4. `node herramientas/medir-monedas.mjs`.

**YA NO SE PINTA · `ADR-0038`.** Vivía dentro de la segunda mitad de la entrada, que
desde el 15 de septiembre solo se pinta en los giros SIN galería propia — y empeño es
el único giro `lujo`, o sea el único que la mostraba. El marcado sigue ahí, guardado
por su condición; `medir-monedas.mjs` ya no tiene qué medir en el sitio construido.

Titular más largo: «Renta de maquinaria y equipo» mide 392 px a h1 28/700 contra 350
disponibles. **No cabe en un renglón en ninguna tipografía.** Por eso la tarjeta de giro
lleva alto fijo: 176 a 390 de ancho, 150 a 1280.

---

## Verificación

```
npm test                              # grafo, giros, fugas, tokens, SEO, flujo y CA-10 · 148 tests
npm run build                         # DEBE fallar mientras falten datos
npm run build:revision                # permisivo, para medir
node herramientas/presupuesto.mjs     # CA-10 · TODO el JS de cada página y terceros
node herramientas/medir-portada.mjs   # peso real y LCP en 4G · RUTA=/empeno-y-prestamo/ para otra
npx serve build -l 5180               # en una terminal…
node herramientas/validar-a11y.mjs    # …y esto en otra (BASE=http://127.0.0.1:5180)
node herramientas/auditar-fondos.mjs  # ADR-0043 · el fondo real de cada bloque, en las ocho páginas
node herramientas/medir-monedas.mjs   # ADR-0021 · lo que cuesta la banda de empeño
cd diseno/sistema  && python verificar-contraste.py   # usan rutas relativas:
cd diseno/pantallas && node validar.mjs               # hay que entrar a su carpeta
```

Antes de declarar cualquier cosa terminada: corre lo que aplique y **reporta el
resultado real**, no el esperado.

**Y un aviso que costó caro descubrir · `ADR-0040`.** Un «Unused CSS selector» de Svelte
**no autoriza a borrar**. Si la clase o el atributo los pone un script en tiempo de
ejecución, ese aviso no dice «esto sobra»: dice **«esto se está tirando y tu regla no
existe en producción»**. Así llevaba rota desde el `ADR-0026` la pausa del planeta fuera
de pantalla — el script ponía `data-quieto` y no había nadie escuchando. Se arregla con
el bloque `:global { … }` de Svelte 5; `:global(...)` con un descendiente dentro es
sintaxis de Svelte 4 y **no compila**.

---

## Lo que falta, y nada de esto es técnico

1. **~~NAP~~ · CERRADO el 11 de septiembre** con la ficha de Google que mandó Nadir.
   Dirección, horarios y coordenadas están en `negocio.ts`; el grafo bajó de 14 marcas
   a 7. Lo que queda del bloque: [[ficha-de-google]] y la decisión D-17, abajo.
2. **Copy** — hoy son 27 huecos etiquetados. Se redacta como propuesta, ver arriba.
3. **Fotos** — **parcialmente resuelto el 11 de septiembre** por el `ADR-0022`: entraron
   seis fotografías reales de su patio, recortadas de sus propias piezas, y viven en la
   retícula de empeño. Siguen pendientes: **los ORIGINALES** —las que hay vienen dentro
   de arte comprimido por WhatsApp y miden entre 440 y 985 px— y sobre todo **joyería,
   que no tiene ni una**. Lo que Nadir extrajo del Instagram son gráficos
   de redes con maquinaria de banco, no fotos del local.

   **CORREGIDO el 15 de septiembre · `ADR-0032`.** Aquí decía que «el hueco de la
   fachada sigue abierto y es el activo más caro del proyecto». **Está obsoleto**: la
   fachada existe a 1600×900 y se publica como héroe de la portada — lo dice el propio
   código en `src/routes/+page.svelte:179`, «el hueco de la fachada se cerró». Lo que
   sigue siendo cierto es el resto: el ADR-0007 estima que las fotos son la mitad de lo
   que falta para que el sitio deje de verse plano, y ningún CSS las sustituye.

   **Joyería tiene DOS fotos de producto suyas, y ninguna del local.** El 15 de
   septiembre entró el original vertical de una de ellas —1206×1518 contra el recorte
   de 800×534— y con eso se rehizo la sección del reloj. De las siete imágenes que se
   aportaron ese día, **seis eran generadas y se rechazaron**: ver el `ADR-0032`.
4. **Nombre legal** (D-01) · **dominio** (D-07) · **categoría de Google** (D-02).
5. **Destino del formulario** (D-13) — un sitio estático no procesa envíos solo.
6. **Confirmar el acento** (D-14) y conseguir el **vectorial** del logo (D-06).

## Contexto que cambia las prioridades

El sitio pesa **~15 %** del posicionamiento local. La ficha de Google pesa 32 %, las
reseñas 20 % y los directorios 6 %.

**Corregido el 11 de septiembre.** Aquí decía que Masters estaba en cero en esos 58
puntos. **No lo está, y el matiz cambia la acción.** La ficha de Google **existe**:
categoría `Bazar`, una reseña de 4,0, sin sitio web — y **SIN RECLAMAR**. Evidencia
completa en [[ficha-de-google]].

Así que la recomendación no es «abre tu ficha»: es **reclamarla**, que es más corto y
más urgente. Una ficha sin reclamar la puede reclamar un tercero, y cualquiera puede
sugerirle cambios de dirección u horario que Google aplica. Sigue yendo **antes que el
sitio**.

La audiencia: alguien que necesita liquidez hoy, buscando desde un teléfono de gama
baja, a plena luz del día, con prisa. Cada decisión técnica de este repo sale de ahí.

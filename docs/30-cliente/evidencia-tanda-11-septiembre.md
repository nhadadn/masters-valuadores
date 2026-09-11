---
tipo: evidencia
estado: LEÍDA — 24 imágenes y 1 video, 11 de septiembre de 2026
fuente: tanda de Cristóbal por WhatsApp, subida por Nadir a docs/00-inbox/
---

# La tanda del 11 de septiembre · lo que dice, y lo que rompe

24 imágenes y un video. La numeración es la de
`herramientas/hoja-de-contactos.mjs` sobre `docs/00-inbox/`, en orden alfabético.

## Qué son, antes de nada

**No son fotos del local.** Son **piezas de redes ya diseñadas** — la misma categoría
que las cinco que ya había en `docs/99-assets/`, pero veinte más y mucho mejor
material. Traen el letrero, los datos, las líneas de negocio y los bienes.

**Excepción: las piezas 21, 22 y 23 llevan fotografías REALES de su patio**, con
inventario propio a la vista: una retroexcavadora John Deere 310D, un rodillo Benford,
montacargas y un tractor. Es el primer material fotográfico real del negocio después
de la fachada.

---

## 1 · La pieza que más vale: el tablero de marca (nº 10)

Una sola imagen contesta media docena de preguntas abiertas.

| Qué | Qué dice, literal |
|---|---|
| Marca | `MÁSTER VALUADORES` — **con acento** |
| Lema | `TODO TIENE VALOR` |
| Líneas | `COMPRA · VENTA · EMPEÑO · IMPORTACIÓN · FINANCIERA · FLETES` |
| Dirección | `Libramiento Periférico Raúl López Sánchez, Lerdo 97, Torreón, Coahuila.` |
| Teléfono | `871 507 3005` |
| Correo | `mastervaluadores@outlook.com` |
| Cierre | **`NO SOMOS UN BAZAR, SOMOS UN CENTRO DE ACTIVOS DE ALTO VALOR`** |

### Los bienes, DICHOS POR ELLOS y ya no deducidos

Seis categorías, cada una con su fotografía:

1. **Joyería alta gama**
2. **Herramientas industriales**
3. **Autos, motos y camionetas**
4. **Maquinaria pesada e industrial**
5. **Muebles y artículos para el hogar**
6. **Fletes nacionales e internacionales**

Y los servicios: *te prestamos más por tu maquinaria · valuación a domicilio ·
recolección con costo · seguridad, confianza y experiencia*.

---

## 2 · Lo que ROMPE, y no lo arregla nadie por su cuenta

### a) Hay un SEGUNDO teléfono · 871 343 0354

Las siete piezas de **MÁSTER JOYERÍA** (nº 11, 12, 13, 14, 18, 20, 24) llevan
`871 343 0354` y la instrucción `AGENDA TU CITA`. No es el número del negocio.

`negocio.ts` dice hoy, citando a Nadir el 11 de septiembre:

> «CONFIRMADO […]: *el teléfono es el mismo para todos, y ya lo tienes*.»

**Eso ya no se sostiene.** O hay dos números —uno general y otro de joyería con cita—,
o uno de los dos está viejo. Es dato de negocio: no se elige, se pregunta.

### b) La marca se escribe MÁSTER, con acento

El [[ADR-0018-la-marca-es-master-sin-s|ADR-0018]] cerró `MASTER` esta misma tarde,
sobre la evidencia de que tres de cuatro fuentes iban sin S. **Esta tanda añade una
quinta grafía y es la del tablero de marca**, que es la fuente más autorizada que ha
llegado hasta ahora:

| Dónde | Cómo |
|---|---|
| Tablero de marca (nº 10) y piezas 9, 15, 17, 21, 23 | **`MÁSTER`** con acento |
| Piezas 1–8, 16, 19 | `MASTERS` |
| Piezas de joyería | `Máster Joyería` / `Master valuadores` |
| Ficha de Google, correo, Facebook | `Master` |

La decisión de esta tarde no estaba mal informada: estaba **poco** informada. Con el
tablero delante, `MÁSTER` es la candidata seria.

### c) «NO SOMOS UN BAZAR» — en mayúsculas, cerrando el tablero

El [[ADR-0014-alinearse-a-la-categoria-de-google|ADR-0014]] alineó el `@type` del
sitio a `Store` **porque Google los clasifica como Bazar**, y reabrió bazar como giro
(D-18).

El cliente dice lo contrario, y lo dice como remate de su pieza principal. Eso no
invalida que Google los tenga mal clasificados —los tiene— pero cambia la conclusión:
no hay que alinearse a esa categoría, **hay que corregirla al reclamar la ficha**.

### d) Seis líneas de negocio, no cuatro

El [[ADR-0008-alcance-de-cuatro-giros|ADR-0008]] dejó el sitio en cuatro: empeño,
compra venta de maquinaria, fletes y taller.

El tablero declara seis: **compra, venta, empeño, importación, financiera y fletes**.
Y no son las mismas cuatro:

| En el sitio | En su material |
|---|---|
| Empeño y préstamo | ✓ empeño |
| Compra venta de maquinaria | ✓ compra · venta |
| Fletes y logística | ✓ fletes |
| **Taller y refaccionaria** | **no aparece en ninguna de las 24** |
| — | **importación** (piezas 8, 16, 19) |
| — | **financiera** (pieza 6) |
| — | **joyería** (siete piezas y número propio) |

**Taller sigue sin una sola fuente.** Es el giro del que ya no se pudo deducir ni un
bien, y veinticuatro piezas después sigue sin aparecer.

---

## 3 · Cifras que aparecen y que el sitio NO puede publicar

Están en su material, así que son suyas — pero el `CLAUDE.md` exige autorización
escrita para dibujar una cifra, y una pieza de redes no es una autorización.

- **Tasa de interés desde 2.9 %** (nº 6, financiamiento de vehículos y maquinaria)
- **Oro 10K, 14K, 18K · Plata .925 · Platino** (nº 5)
- «Entrega segura en todo México», «Renta por día, semana o mes» (nº 2, 3)

---

## 4 · Direcciones: la cuarta forma, y resuelve el conflicto

El tablero las une en un renglón:

> `Libramiento Periférico Raúl López Sánchez, Lerdo 97, Torreón, Coahuila.`

Eso es lo que el documento de requerimientos preguntaba en el BLOQUE 1.1: **son un
solo domicilio descrito de dos maneras**, no dos. La pieza nº 5 añade una tercera
variante —`Blvd. Periférico Raúl López Sánchez, Col. Nueva Laguna`— que discrepa en la
colonia (Nueva Laguna contra Laguna Sur). Conviene confirmarlo, pero el conflicto
grande está resuelto.

---

## 5 · Lo que esto le dice al pedido de «frescos, no tan negros ni tan blancos»

**Su propio material ya resuelve eso, y tiene dos registros distintos:**

| Registro | Piezas | Cómo se ve |
|---|---|---|
| **Industrial** | 1–8, 16, 19, 21–23 | Fondo **claro o gris**, negro y oro, tipografía de palo seco muy pesada, diagonales |
| **Lujo** | 11–14, 18, 20, 24 | Fondo negro **o mármol blanco**, oro, **tipografía con serifas y cursiva** |

Varias de las mejores —la nº 8 de importaciones, las 12, 13, 14, 18, 20 de joyería—
son **de fondo claro**. El sitio hoy es negro de arriba abajo por el
[[ADR-0012-tema-oscuro|ADR-0012]], y eso es **más oscuro que su propia marca**.

Aquí está el material para salir del negro sin irse al blanco, y sin inventar nada:
la respuesta es el **gris acero con oro** que usan ellos, que además era la paleta del
ADR-0010 antes de que todo se fuera a negro.

---

## Qué se puede usar, y cómo

| Material | Uso |
|---|---|
| Fotos reales del patio (21, 22, 23) | **Sí**, recortando el arte. Es inventario suyo: sin rótulo de archivo |
| Tablero de marca (10) | Fuente de datos, no imagen del sitio |
| Piezas de redes completas | **No** como fotografía del sitio: son arte de redes, con su propio titular y sus propios datos. Sirven de referencia visual |
| Logotipo metálico | Sigue sin ser vectorial (D-06). Es un render, no un archivo de marca |

---

## Lo que hay que preguntar, en orden

1. **¿Dos teléfonos o uno?** `871 507 3005` general y `871 343 0354` joyería.
2. **¿`MÁSTER` con acento?** El tablero dice que sí; D-01 se cerró hoy como `MASTER`.
3. **¿Seis líneas o cuatro?** Y sobre todo: **¿existe el taller?** No aparece en
   ninguna de las 24 piezas.
4. **¿Autorizas las cifras?** Tasa desde 2.9 %, quilatajes.
5. **¿Colonia Laguna Sur o Nueva Laguna?**

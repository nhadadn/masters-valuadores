---
tipo: evidencia
estado: LEÍDA Y REGISTRADA — 11 de septiembre de 2026
fuente: ficha de Google del negocio, enviada por Nadir
enlace: https://maps.app.goo.gl/djEokVRJBvrUFGoh7
cid: 14719324602987260743
---

# La ficha de Google de Masters · lo que dice, literal

Nadir mandó el enlace el 11 de septiembre: *«Aquí viene el mapa y su dirección»*.
Este documento registra lo que la ficha dice **textualmente**, antes de interpretarlo.
Todo lo de abajo se leyó en la ficha, no se dedujo.

## Lo que trae

| Campo | Lo que dice la ficha |
|---|---|
| **Nombre** | `Master valuadores` |
| **Dirección** | `Lerdo 97, Laguna Sur, 27110 Torreón, Coah.` |
| **Teléfono** | `871 507 3005` |
| **Categoría** | `Bazar` |
| **Horario** | lunes a viernes `9 a.m.–6 p.m.` · sábado `9 a.m.–3 p.m.` · domingo `Cerrado` |
| **Reseñas** | `4,0` · **1 reseña**. Kano BLACK, Local Guide, hace 4 meses: «Exelente atencion» |
| **Sitio web** | **ninguno** — la ficha ofrece «Añadir sitio web» |
| **Coordenadas** | `25.5818511, -103.4188845` |
| **Plus code** | `HHJJ+PC Torreón, Coahuila de Zaragoza` |
| **Estado** | **SIN RECLAMAR** — la ficha muestra «Reclamar esta empresa» |

## Lo que esto cierra

- **D-08 · NAP.** Dirección y horarios entran a `negocio.ts`. El teléfono ya estaba,
  y esta es su **cuarta** fuente independiente.
- **D-11 · coordenadas.** Entran, con el `hasMap` al lado.
- **BLOQUE 1.1 del documento de requerimientos**, que preguntaba si eran una o dos
  direcciones: Google conoce **una**, la de Lerdo 97 — la misma que aparece en sus
  publicaciones. La otra forma, «Libramiento Periférico Raúl López Sánchez casi
  esquina con El Tajito», **no está en la ficha**. Sigue sin saberse si es referencia
  cruzada del mismo local o un segundo domicilio.

El grafo JSON-LD pasó de **14 marcas sin confirmar a 7**.

## Lo que esto ABRE, y pesa más que lo que cierra

### 1 · La ficha existe, y está sin reclamar

El `CLAUDE.md` dice, y lo repite el documento de requerimientos:

> «Masters está en **cero** en esos 58 puntos.» · «**Antes que terminar el sitio, abre
> y llena tu ficha de Google.**»

**Eso ya no es exacto y hay que corregirlo.** La ficha no hay que abrirla: **ya
existe**. Lo que hay que hacer es **reclamarla**, que es otra gestión, más corta, y
que además es urgente por una razón que no estaba sobre la mesa:

**Una ficha sin reclamar la puede reclamar cualquiera.** Mientras nadie la controle,
cualquier persona puede sugerir cambios a la dirección, al teléfono o al horario, y
Google los aplica. También puede reclamarla un tercero.

### 2 · Google los tiene clasificados como «Bazar»

La categoría primaria es, según el propio `CLAUDE.md`, «el factor número uno de
posicionamiento local». Hoy dice **Bazar**.

Y bazar es **exactamente uno de los giros que el [[ADR-0008-alcance-de-cuatro-giros]]
sacó del sitio**, junto con joyería y financiera.

Es decir: **el sitio y la ficha le están contando a Google dos negocios distintos.**
El sitio habla de empeño, maquinaria, fletes y taller; la ficha dice bazar. Esto no se
resuelve por nuestra cuenta — está anotado como decisión abierta.

### 3 · El nombre no coincide con el del sitio

| Dónde | Cómo aparece |
|---|---|
| Su logotipo, y el sitio por [[ADR-0004-identidad-plana]] | `MASTERS` VALUADORES |
| **Su ficha de Google** | `Master valuadores` |
| Su correo publicado | `mastervaluadores@outlook.com` |
| Su línea de Facebook, en el letrero | `MASTER VALUADORES` |

Tres de cuatro van **sin S**. El sitio y el logotipo van **con S**.

La consistencia exacta del NAP —mismo nombre, misma dirección, mismo teléfono, en
todas partes— es un factor de posicionamiento local. Hoy no la hay. Se decide en D-01,
y reclamar la ficha es lo que permite corregirla del lado de Google.

### 4 · Una reseña, no cero

`4,0` con **una** reseña, de hace cuatro meses. No cambia el fondo —una reseña no
mueve el 20 % que valen las reseñas— pero el dato correcto es «una», no «cero», y
significa que alguien ya encontró el negocio por Google y le fue bien.

### 5 · La ficha no tiene sitio web

Cuando el dominio exista (D-07), ponerlo en la ficha es una casilla que enlaza las dos
cosas. Hoy la ficha ofrece «Añadir sitio web» y está vacía.

## Cómo se verificó

El enlace corto redirige a una URL que ya trae el `ftid`; de ahí sale el CID y con él
la URL estable que quedó en `negocio.ts`. La ficha se abrió en un navegador real y se
leyó el panel completo, incluido el desglose de horarios por día, que solo aparece al
desplegarlo.

Nadir mandó después un segundo enlace, `https://share.google/NT9UKZYBOlEg1CY2p`,
titulado «Master valuadores». **No se pudo abrir** —el navegador rechazó ese dominio—,
así que no está verificado que apunte a la misma ficha. Por el título lo parece. Si
fuera una ficha distinta, sería un duplicado y eso es un problema real de
posicionamiento: conviene comprobarlo.

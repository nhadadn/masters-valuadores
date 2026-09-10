---
tipo: adr
id: ADR-0006
estado: ACEPTADA
fecha: 2026-09-10
aceptada: 2026-09-10 por Nadir
decide: Nadir
revierte: ADR-0005
---

# ADR-0006 · El amarillo plano no era de maquinaria: es de toda la marca

## Qué pasó

El 10 de septiembre por la tarde llegaron cinco publicaciones vivas del cliente,
extraídas de su Instagram. Cubren **cinco giros distintos**: maquinaria,
importaciones, renta de herramienta, **joyería** y **compra de monedas**.

Las cinco usan el mismo lockup plano negro + amarillo.

## La premisa que se cayó

El [[ADR-0005-acento-corporativo|ADR-0005]] eligió la dirección B —oro corporativo
`#B58000`— sobre un argumento explícito:

> «El acento del ADR-0004 salió de las publicaciones de **maquinaria**. Es la voz de
> una sola línea de negocio de ocho. […] En joyería, empeño y financiera el amarillo
> de señalamiento juega en contra del valor percibido.»

**Eso es falso, y estas cinco piezas lo demuestran.** Hay una publicación de joyería
y una de monedas —los dos giros donde dije que el amarillo restaba— y las dos usan el
amarillo plano, no el oro metálico.

El `#B58000` salió de **archivos de logotipo**. Estas cinco son lo que el cliente
**publica**. No es lo mismo, y lo que publica manda.

## La medición

25 211 píxeles de amarillo del monograma, aislados por umbral de color y cuantizados
a pasos de 4 para que el JPG no invente tonos. Script: `herramientas/medir-marca.py`.

| Publicación | Moda | Sobre blanco | Sobre negro-950 |
|---|---|---|---|
| Maquinaria | `#E8C040` | 1.74:1 | 11.15:1 |
| Importaciones | `#E8C040` | 1.74:1 | 11.15:1 |
| Renta de herramienta | `#F4D04C` | 1.50:1 | 12.94:1 |
| **Joyería** | `#E4B03C` | 1.99:1 | 9.79:1 |
| **Monedas** | `#E4B03C` | 1.99:1 | 9.79:1 |
| **Mediana de las cinco** | **`#E7BF42`** | 1.76:1 | 11.04:1 |

`#E7BF42` está a **una unidad** de `#E7C041`, que es exactamente el valor que ya
estaba en el ADR-0004 antes de que yo lo cambiara.

**Hay deriva, y vale la pena decirlo:** el rango va de `#E4B03C` a `#F4D04C`. Quien
diseña las publicaciones no está usando un valor exacto. La diferencia entre joyería y
maquinaria (`#E4B03C` contra `#E8C040`) es **menor** que la deriva entre publicaciones
del mismo giro, así que se lee como descuido, no como sub-marca deliberada.

## Decisión

**ACEPTADA el 10 de septiembre. Revertir al ADR-0004.** El acento del sistema vuelve a ser `#E7C041`.

El `#B58000` no se descarta como color: se descarta como **acento de marca**, porque
la marca no lo usa.

## Qué sobrevive del ADR-0005 y qué no

| | |
|---|---|
| **No sobrevive** | El argumento de procedencia — la razón para cambiar |
| **Sobrevive** | La observación técnica: un amarillo plano no puede ser bloque suelto ni texto sobre claro. `#E7C041` da 1.75:1 |

Eso segundo es una **restricción para diseñar**, no un motivo para cambiarle el color
al cliente. Cambiárselo sería rebranding, y la propuesta firmada lo excluye.

## Tokens que quedan

| Token | Valor | Uso | Ratio |
|---|---|---|---|
| `--oro-500` | `#E7C041` | relleno de bloque y color de marca | 11.12:1 con etiqueta `negro-950` encima |
| `--oro-700` | `#9A7A22` | borde del acento sobre claro | 4.05:1 · pasa 3:1, **no** pasa texto AA |
| `--oro-800` | `#8A7227` | **oro como texto** sobre claro | **4.65:1 · pasa AA** |

`--oro-800` es nuevo y es la única pieza que me llevo de la dirección B: la capacidad
de escribir en oro. Se deriva del `#E7C041` medido, mismo tono, valor bajado a 0.54.
Sustituye al `#8C6300`, que era del oro corporativo.

Sobre superficie oscura no hace falta paso claro: `#E7C041` da 11.12:1 sobre el negro
de marca. El `--oro-300` de la dirección B se retira.

## Un hallazgo que le sirve al cliente

Sus propias publicaciones ponen **texto amarillo sobre fondo claro** en los titulares:
«LISTA PARA TRABAJAR», «CUANDO MÁS LO NECESITAS», «MAQUINARIA». A 1.75:1 eso está por
debajo del mínimo de 3:1 **incluso para texto grande**.

En un cartel impreso a un metro se perdona. En un teléfono, a plena luz y con prisa,
no. En el sitio no se puede copiar ese uso, y vale la pena que Cristóbal lo sepa: no
es una crítica al diseñador, es que un póster y una pantalla no tienen las mismas reglas.

## Costo de revertir — ya pagado

Se revirtió el mismo día: `src/lib/estilos/tokens.css:35-37`,
`src/routes/+layout.svelte:102` y `static/marca/monograma-reconstruido.svg:2`.

Verificado tras el cambio: **31 tests en verde**, `build:revision` en 0 KB de JS, y el
validador de accesibilidad en **22 de 22 combinaciones CUMPLE**.

Los lienzos publicados quedan con la paleta anterior y hay que resembrarlos. La hoja
*Evidencia* del lienzo de paletas ya documenta la reversión.

## Lo que esto enseña del método

Medí tres archivos de logotipo y construí un argumento de posicionamiento de marca
encima. Nunca pregunté qué publica el cliente **hoy**, que era la pregunta correcta y
la que se contestaba pidiendo cinco capturas.

Regla para adelante: **el material vivo gana sobre el archivo**. Antes de derivar
identidad de un logotipo, ver qué está saliendo esta semana.

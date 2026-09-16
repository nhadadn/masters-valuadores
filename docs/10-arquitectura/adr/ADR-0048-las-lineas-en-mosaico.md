---
tipo: adr
id: ADR-0048
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: ADR-0047 (la reja de tarjetas de la portada)
implementa: Claude Code
---

# ADR-0048 · Las líneas, en mosaico

## Qué se pidió

> *«En "elige la línea que buscas" quisiera realizar una interacción diferente: una
> galería horizontal con scroll-snap, hover > zoom 1.03 + flecha > click > WhatsApp con
> la categoría prellenada, para mobile; y para desktop una rejilla editorial asimétrica.
> ¿Podrías hacer una propuesta con esto? ¿O una propuesta de bento puro?»* — Nadir

## Cómo se llegó

Dos prototipos sobre el sitio construido, sin tocar `src/`, con las mismas fotos y los
mismos mensajes de WhatsApp que ya publicaba la portada:

| | A · galería + editorial | B · bento |
|---|---|---|
| Teléfono | carrusel horizontal con scroll-snap | dos columnas, la primera a lo ancho |
| Escritorio | doce columnas asimétricas | cuatro por tres, sin huecos |
| Alto de la sección en teléfono | **503 px** | 807 px |

Hoy la reja medía **1243 px** en teléfono. Se recomendó A y **Nadir eligió B**.

Antes de elegir se dijeron tres cosas, y siguen en pie:

1. **Si las piezas abren WhatsApp, la portada deja de enlazar desde su contenido a la
   página de cada línea.** Siguen enlazadas desde el menú y el pie, pero pierden el
   enlace más fuerte hacia las páginas que el sitio quiere posicionar.
2. **«Te atendemos por WhatsApp» queda repetida**: sus cinco botones hacen lo mismo que
   las piezas. No se tocó; es decisión aparte.
3. **Venta y Financiamiento tienen fotos de 800 y 600 px**: en piezas grandes y pantalla
   de doble densidad se ven algo blandas.

## Lo que se decide

**Un componente, `MosaicoLineas`**, que sustituye a la reja de `Tarjeta` en la portada.

- **Cada pieza abre WhatsApp** con «Hola, escribo por [línea]», el mismo mensaje del
  bloque «Te atendemos». Si el número no estuviera confirmado, la pieza lleva a la
  página de su línea: nunca queda un enlace muerto.
- **Con puntero, la foto crece a 1.03 y aparece la flecha.** En táctil no existe
  «encima», así que la flecha se ve siempre.
- **La flecha va en el verde de WhatsApp** (`--accion-whatsapp`): dice a dónde lleva.
- **Las posiciones van por orden y no por slug, y solo si hay exactamente cinco** (con
  `:has`). Con cuatro o seis líneas el mosaico cae a dos por fila en vez de dejar huecos.
- **Cero JavaScript.** La portada sigue en 0 KB.

## Lo que cambió respecto del prototipo, a propósito

**La foto de archivo conserva su tinte.** El prototipo había extraído solo la
`<picture>` y las fotos de Fletes y Taller salían en color natural, sin el tinte sepia ni
el `data-provisional` que las distinguen como de archivo desde el ADR-0009. No fue una
decisión, fue un descuido del prototipo. `MosaicoLineas` usa `Foto` tal cual, así que las
dos marcas vuelven. El rótulo se recoloca desde fuera, porque `Foto` lo pone abajo a la
izquierda, justo donde vive el título.

## Cuatro fallos cazados antes de dar por buena la propuesta

1. **En el bento de teléfono «Financiamiento» chocaba con la flecha.** La flecha sube a
   la esquina en las piezas chicas.
2. **Al subirla, tapó el rótulo «Foto de archivo».** La comprobación medía título y frase
   contra la flecha, pero no el rótulo. Se amplió al rótulo, y el rótulo bajó encima del
   título.
3. **En tableta, cuatro columnas dejaban piezas de 159 px**: el título se cortaba y la
   frase se partía palabra por palabra. Entre 768 y 1023 px van dos columnas holgadas.
4. **Una cifra propia mal calculada.** El velo se había anunciado con 9.1:1 y 6.3:1, y
   eso ignoraba que el velo tiene color (`rgb(12,13,15)`). Bien calculado, una foto
   **blanca pura** bajo el velo da **7.95:1** para el título y **5.49:1** para la frase.

Y uno de especificidad: `.mayor .flecha` tiene dos clases y les ganaba a las reglas de
tableta y escritorio, de una. La pieza grande habría quedado 4 px desalineada.

## Lo medido, en el sitio construido

| | |
|---|---|
| CSS servido | llegan las 5 posiciones con `:has`, el ajuste de las fotos, el velo y el hover |
| Tests | **155** |
| Accesibilidad | **18/18 CUMPLE** |
| Choques de texto | **0** en 390, 768, 1024 y 1280 · título, frase y rótulo contra la flecha y el borde |
| Desborde | **0** en los cuatro anchos |
| Hover | imagen `scale(1.03)` · flecha visible · la de archivo conserva `data-provisional` y su tinte |
| Enlace | `wa.me/…?text=Hola, escribo por fletes.` |
| Fotos de la sección | **171.8 KB** contra 68.2 KB de la reja · **+103.6 KB**, en teléfono y en escritorio |

**Los 103.6 KB no se pueden bajar afinando `sizes`**: una foto horizontal recortada para
llenar una pieza vertical necesita más ancho del que ocupa la pieza. Cargan en diferido y
están bajo la primera pantalla, así que **no tocan el LCP**; los paga quien llega hasta
ahí.

### Geometría

| Ancho | Piezas |
|---|---|
| 390 | 350×219 · cuatro de 171×214 |
| 768 | 672×240 · cuatro de 330×240 |
| 1024 | 458×432 · 458×210 · 223×432 · 223×432 · 458×210 |
| 1280 | 554×432 · 554×210 · 271×432 · 271×432 · 554×210 |

## Lo que queda abierto

- **El enlace a las páginas de cada línea desde la portada.** Si se quiere de vuelta, lo
  más barato es un «Ver la página» discreto por pieza.
- **La sección «Te atendemos por WhatsApp»**, que ahora repite a las piezas.
- **`Tarjeta.svelte` queda sin usar.** No se borra: revertir esto es cambiar un
  componente por otro.
- **Mejores originales de Venta y Financiamiento**, para las piezas grandes.

## Evidencia

| Qué | Dónde |
|---|---|
| El componente | `src/lib/componentes/MosaicoLineas.svelte:3` |
| El enlace a WhatsApp con la línea | `src/lib/componentes/MosaicoLineas.svelte:42` |
| La foto de archivo marcada | `src/lib/componentes/MosaicoLineas.svelte:50` · `:119` |
| El velo | `src/lib/componentes/MosaicoLineas.svelte:97` · `src/lib/estilos/tokens.css:426` |
| El hover | `src/lib/componentes/MosaicoLineas.svelte:166` |
| El mosaico de cinco | `src/lib/componentes/MosaicoLineas.svelte:191` |
| La flecha | `src/lib/datos/iconos.ts:61` |
| En la portada | `src/routes/+page.svelte:143` |
| Cómo queda | `capturas/mosaico-tablero.png` · `capturas/mosaico-hover.png` |

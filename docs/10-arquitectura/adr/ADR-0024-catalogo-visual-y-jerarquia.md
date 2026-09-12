---
tipo: adr
id: ADR-0024
estado: ACEPTADA
fecha: 2026-09-12
decide: Nadir
extiende: ADR-0022
implementa: Claude Code
---

# ADR-0024 · La landing de empeño se reordena: promesa arriba y catálogo visual

## Qué se pidió

Una revisión UX/UI completa con un criterio de aceptación explícito: que alguien que
**solo mira** las tarjetas entienda qué puede llevar, sin leer un párrafo. Y un orden
de prioridades —claridad del negocio, conversión a WhatsApp, comunicación visual,
confianza— por encima de efectos y sofisticación técnica.

## El diagnóstico, medido antes de tocar nada

```
móvil: 5248 px = 6.2 pantallas · 513 palabras · 3 enlaces a WhatsApp
```

| Qué | Dónde estaba |
|---|---|
| La mecánica del negocio | pantalla 3 de 6, a ~2400 px |
| Las únicas fotos reales | a ~1800 px, debajo de la lista de bienes |
| 591 px de cajas vacías | «¿Qué necesito llevar?», cuatro huecos idénticos |
| Ningún CTA contextual | los tres enlaces a WhatsApp eran genéricos |

El brief acertaba en que las tarjetas eran demasiado texto. **El problema mayor no era
ese**: era que la promesa del negocio no estaba en la primera pantalla.

## Las tres imágenes que llegaron con el encargo

| | Veredicto |
|---|---|
| Hilera de relojes dorados | **Generada por IA.** Diales sin sentido, eslabones deformados, bokeh sintético. No entra |
| Oro sobre terciopelo | **Fotografía profesional de orfebrería de museo.** Ni es inventario de empeño ni es suya. No entra |
| Reloj, cadena y charola de anillos | **Fotografía real, del negocio** (confirmado por Nadir). Entra |

Es el tercer material generado por IA que llega en dos días —antes fue el video con
marca «Veo»— y conviene que quede escrito junto a los otros.

## 1 · El hero: promesa, mecánica y botón antes del primer scroll

El `h1` decía una categoría, «Empeño y préstamo», que no contesta *«¿qué gano yo?»*.
Ahora debajo van la promesa y una tira de tres pasos, y las acciones **suben por
delante de la foto**.

Medido a 390 px con viewport de 844:

```
h1 254 · promesa 300 · tira 371 · botones 523 · foto 647      todo sobre el pliegue
```

El párrafo que estaba entre la tira y el botón decía en prosa lo mismo que la tira dice
en tres palabras: se movió a la sección del proceso, que es lo que describe.

**«Sales con tu efectivo» y no «recibe tu efectivo».** La segunda promete sin
condición; la primera es literalmente la frase que ya estaba en el subtitular —*«si te
sirve, sales con tu efectivo»*— y el paso completo, con su condición, sigue abajo.

## 2 · Los bienes: de seis cajas a catálogo

Imagen a sangre, distintivos, y el nombre sobre banda al pie. La primera ocupa dos
columnas y, en escritorio, dos filas: con seis bienes son 4 + 5 = **9 huecos, una
retícula de 3×3 sin un solo boquete**.

### El título va sobre banda OPACA, no sobre un degradado

Texto encima de fotografía es donde este repo ya se quemó. El validador resuelve
colores de CSS, no píxeles: un título sobre un degradado semitransparente es contraste
que **nadie puede medir** y que cambia con cada foto. La banda es opaca y el degradado
solo la funde con la imagen por arriba, donde no hay texto.

### La fila manda, no la proporción

El primer intento dio `aspect-ratio: 3/2` a cada imagen y dejó que ella fijara el alto.
En la captura de 1280: la tarjeta destacada medía el doble de ancho, luego el doble de
alto, y salía un rectángulo enorme medio vacío; su vecina se estiraba hasta él dejando
un boquete negro entre su foto y su título. Ahora el alto de fila es fijo y la imagen
cubre.

### Lo que llevan las seis

| Bien | Imagen |
|---|---|
| Oro y joyería | **suya** — recorte de cadena y anillos |
| Relojes | de archivo, teñida y rotulada · ADR-0009 |
| Monedas | **campo de metal** — foto pendiente |
| Herramienta | **suya** — las soldadoras |
| Maquinaria | **suya** — el rodillo Benford |
| Autos | **campo de metal** — foto pendiente |

El campo de metal no es un hueco roto: es campo oscuro con un rescoldo de oro y el
ícono grande en oro, en la misma proporción y con el mismo tratamiento. Se lee como
decisión, no como imagen que falta, y lleva su marca de pendiente.

### La procedencia no se toca

Cada tarjeta sigue diciendo si el bien sale del letrero, de una publicación o si lo
dedujimos. Pasa de renglón de texto a distintivo, pero **no desaparece**: es lo que le
permite a Cristóbal tachar lo que no es cierto. Los dos distintivos van **apilados** y
no uno en cada esquina — en la tarjeta estrecha de teléfono se solapaban y se leía
«EN U[FOTO DE ARCHIVO]SUYA».

## 3 · El CTA que contesta la pregunta que trae la gente

Quien llega aquí trae una pregunta concreta: *«¿cuánto me dan por esto?»*. Justo debajo
del catálogo —donde acaba de nacerle la duda— entra un bloque con la pregunta y un
WhatsApp con mensaje ya escrito. Los tres enlaces genéricos que había siguen donde
estaban; este es el cuarto, y el único contextual.

## 4 · Lo que se eliminó

Las cuatro cajas vacías de «¿Qué necesito llevar?» pasan a **un** bloque. Ocupaban
591 px en un teléfono para decir cuatro veces lo mismo. Sigue siendo visible que falta
—lo exige el contrato— y cuesta un décimo.

## Lo medido, antes y después

| | Antes | Después |
|---|---|---|
| **LCP** | 1888–1904 ms | **1324 ms** |
| Peso | 160.1 KB | 163 KB |
| Huecos visibles | 11 | **8** |
| Enlaces a WhatsApp | 3 | 4, uno contextual |
| Alto en móvil | 6.2 pantallas | 6.9 |
| Fotos suyas en la página | 6 | **8** |

La página creció 0.7 pantallas y baja 580 ms de LCP. El hero dejó de ser una foto de
archivo rotulada y pasó a ser inventario suyo, que es el cambio de confianza más
grande de la lista.

### Tres cosas que cazaron los guardias del repo

1. **`--e-5` no existe**: la escala salta del 4 al 6. Lo pedí con `var()` y
   `tokens-vivos` lo marcó.
2. **`--alto-bien` y `--promesa-tam` me los inventé.** No son tokens del sistema, son
   medidas de un componente. Salieron.
3. **El guardia de fugas cazó un `11 %` en un comentario mío.** Hace exactamente lo que
   debe: así atraparía una tasa metida en el marcado.

## Lo que NO se hizo, y por qué

- **`¿Aceptan lo que traigo?` pasó a `¿Qué puedes empeñar?`** por petición expresa. Se
  gana la redacción del brief y se pierde el sistema de «preguntas del visitante» que
  ordena la página. Queda anotado; sale del dato, no del slug.
- **El destello sale de estas tarjetas.** Sobre fotografía se lee a efecto y el brief
  pide evitar justo eso. Sigue en las tarjetas de la portada, vía `Tarjeta.svelte`.
- **Monedas y autos siguen sin fotografía.** Nadir eligió banco con licencia, rotuladas
  —el mismo Pexels del ADR-0009—; falta descargarlas. Hasta entonces, campo de metal.

## Evidencia

| Qué | Dónde |
|---|---|
| El catálogo | `src/lib/componentes/GaleriaBienes.svelte` |
| La tira de pasos | `src/lib/componentes/TiraPasos.svelte` |
| Promesa, CTA y requisitos | `src/routes/[giro]/+page.svelte` |
| Los seis bienes con foto | `src/lib/datos/giros.ts` |
| LCP y peso | `RUTA=/empeno-y-prestamo/ node herramientas/medir-portada.mjs` |
| Accesibilidad | 16/16 CUMPLE · contraste 0 hallazgos · piezas 12/12 · 131 tests |

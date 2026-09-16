---
tipo: adr
id: ADR-0038
estado: ACEPTADA
fecha: 2026-09-15
decide: Nadir
revierte_parcialmente: ADR-0021 · ADR-0027
implementa: Claude Code
---

# ADR-0038 · Fuera la segunda mitad de la entrada, y con ella la banda de monedas

## Qué se pidió

> *«Removamos esta sección, ya sólo es una imagen que no [em]parenta con lo demás.
> Dejemos el punto 1 y posteriormente "algo de lo que han tenido".»* — Nadir

Es el bloque del [[ADR-0027-fuera-las-marcas-de-borrador|ADR-0027]]: botón «Llamar»,
foto grande y banda de monedas, sobre mármol.

## Tenía razón, y por un motivo concreto

Desde el [[ADR-0037-una-seccion-para-las-dos-tiras|ADR-0037]] esa sección enseñaba
**la misma fotografía que tres tarjetas de la tira de joyería** — no una parecida: el
mismo archivo, `bien-joyeria`, del que salen `joy-reloj`, `joy-cadena` y `joy-conjunto`.
La página mostraba dos veces lo mismo con distinto tamaño.

## Lo que NO se hizo, y por qué

**No se borró de la plantilla.** `[giro]/+page.svelte` pinta las cuatro páginas de giro,
y se midió en vivo antes de tocar:

| Página | Carruseles | Foto grande | «Llamar» |
|---|---|---|---|
| empeño | **2** | 1 | 1 |
| maquinaria | **0** | 1 | 1 |
| fletes | **0** | 1 | 1 |
| taller | **0** | 1 | 1 |

Para los otros tres, esa sección es **su única fotografía y su único botón**. Borrarla de
la plantilla los dejaba sin imagen, y eso revertiría de paso el
[[ADR-0009-fotografia-de-banco|ADR-0009]], que puso «una foto por cada giro».

Así que se **condiciona**: la segunda mitad se pinta solo en los giros **sin galería
propia**. Hoy eso es todos menos empeño, y el interruptor sale del dato
—`muestraJoyeria || muestraInventario`— para que la plantilla no pregunte por el slug.

## El orden que queda en empeño

```
LÍNEA DE NEGOCIO  →  1 ¿Qué puedes empeñar?  →  PIEZAS Y EQUIPO
  →  2 ¿Cuánto me dan y cuándo?  →  3 ¿Dónde están?  →  OTRAS LÍNEAS
```

Que es exactamente lo pedido: el punto 1 y después «Algo de lo que han tenido».

## La consecuencia grande: se va la banda de monedas

`MonedasQueCaen` vivía dentro de esa sección, tras `{#if giro.registro === 'lujo'}`.
**Empeño es el único giro `lujo`**, así que al condicionar la sección la banda queda
**inalcanzable**: no se pinta en ninguna página del sitio.

Eso retira de hecho el [[ADR-0021-javascript-en-una-sola-ruta|ADR-0021]], que la midió en
+509 ms de hilo mientras caen y +66 ya asentadas. Y hay que decir que Nadir ya la había
criticado por su cuenta: *«son ocho discos planos en fila»*.

**El marcado se queda** —tres líneas guardadas por su condición— por la misma razón que
ya estaba escrita en su comentario: *«si joyería vuelve, la banda ya la está esperando»*.
Borrarla del todo es otra decisión.

## Lo medido

Y aquí está el premio, que no se buscaba:

| | Antes | Después |
|---|---|---|
| **JavaScript de la página** | 12.10 KB gzip | **4.54 KB** |
| **Margen de CA-10** | 27.90 KB | **35.46 KB** |
| Scripts que carga empeño | planeta · carrusel · **monedas** | planeta · carrusel |
| Alto de la página | 5.8 pantallas | **4.8** |
| **LCP** | — | **1996 ms ✓ bueno** · mismo elemento |

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| Peso | 247.3 KB · 0 de terceros |

El LCP **no cambia de elemento**: sigue siendo la textura de mármol de la PRIMERA
sección, que es la de la entrada y no se tocó.

## Lo que queda anotado, sin tocar

- **`carrusel.js` aparece dos veces en el HTML.** `Carrusel.svelte` lo inyecta por
  `svelte:head` una vez por instancia. Funciona —el cerrojo del `ADR-0033` impide el
  doble cableado, verificado: 9/9 y 6/6 puntos aciertan— pero dos etiquetas idénticas
  son desprolijas.
- **`bien-joyeria-*` deja de servirse** en las cuatro páginas: sus doce archivos quedan
  publicados sin que nadie los pida. El dato sigue en `giros.ts`, así que si la sección
  vuelve, vuelven ellos.
- **`.revision`, `.rev-et` y `.rev-lista`** siguen muertos desde el `ADR-0027`.

## Evidencia

| Qué | Dónde |
|---|---|
| El interruptor y su porqué | `src/routes/[giro]/+page.svelte` · `segundaMitad` |
| El recorrido nuevo | `capturas/flujo-390.png` |

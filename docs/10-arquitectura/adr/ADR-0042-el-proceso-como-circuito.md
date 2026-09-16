---
tipo: adr
id: ADR-0042
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: ADR-0024
implementa: Claude Code
---

# ADR-0042 · El proceso como circuito, no como párrafo

## Qué se pidió

> *«Actualmente veo que se muestra un texto el cual me parece muy acertado sin embargo
> nos gustaría que el público que lo visualice lo pueda digerir sin leer tantas palabras
> me gustaría generar algún tipo de animación o si es posible un flujo explicativo visual
> no textual.»* — Nadir, sobre la sección 2 de las páginas de giro

Se ofrecieron tres variantes —A quieta, B con animación de entrada por CSS, C con
observador— y Nadir eligió **A**, la de cero JavaScript. Este ADR documenta A.

## Lo que se encontró al medir, que cambió el encargo

La sección no era verbosa por sí sola. **La página contaba el mismo proceso cuatro
veces**, comprobado en `build/empeno-y-prestamo/index.html` y no en una captura:

| Dónde | Palabras |
|---|---|
| `promesaPropuesta` del hero | 5 |
| `TiraPasos` del hero · ADR-0024 | 9 |
| `subtitularPropuesto` de la sección 2 | 25 |
| `pasosPropuestos` de la sección 2 | 27 |

Las 52 palabras de la sección 2 repetían las 14 que el visitante ya había leído en la
primera pantalla.

**Y había una trampa en «quitar palabras».** Tres datos del proceso aparecían
**exactamente una vez en toda la página**:

```
grep -o "identificación[^<]*\|contrato[^<]\{0,30\}\|resguard[^<]\{0,25\}" \
  build/empeno-y-prestamo/index.html | sort | uniq -c
```

Uno cada uno. La sección «¿Qué necesito llevar?» y el bloque de cifras se borraron en el
[[ADR-0040-css-podado-y-la-pausa-que-nunca-existio|ADR-0040]], así que la identificación
vigente, el contrato y el resguardo se habían quedado sin otra casa. Recortar las frases
los habría borrado del sitio.

De ahí sale la forma de la pieza: **no se acorta el copy, se parte en dos.** La acción
en `que` —cuatro palabras o menos— y el dato que arrastra en `dato`, dentro de un chip.
Ni una afirmación nueva: son las frases del `pasosPropuestos` repartidas.

## La decisión

**El proceso se dibuja como circuito y no como lista numerada.**

La lista dibujaba una recta: `01 → 02 → 03`. Para alguien que está decidiendo si deja su
reloj en un mostrador, una recta dice *«tu bien entra y no vuelve a aparecer»*. Es falso
—el bien vuelve— y eso estaba escrito una sola vez, al final del subtitular, donde nadie
llega con prisa.

El corchete punteado que abraza la columna es esa frase, dibujada. Es lo único de la
pieza que comunica algo que el texto no repite, así que es lo único que se defiende como
imprescindible.

### Solo se dibuja donde es cierto

El corchete depende de `retorno`, que hoy **solo tiene empeño**. Una máquina que vendes
no vuelve; un flete no vuelve. En esos tres giros el flujo es una recta porque esos
procesos SON una recta.

La condición vive en el dato y no en la plantilla, por la misma razón que `ctaPrestamo`
del ADR-0041: **una sola plantilla pinta las cuatro páginas de giro**, y escrito en el
marcado se habría publicado «lo recuperas» en las cuatro. Hay un test que lo fija:

> `tests/flujo.test.ts` · *solo empeño cierra el círculo*

Si mañana alguien le pone `retorno` a fletes, se pone rojo antes de publicar que los
camiones regresan la carga.

### El subtitular se calla donde el hero ya habló

`{#if giro.subtitularPropuesto && !giro.pasosCortos}`. La condición es `pasosCortos` y no
el slug porque **la duplicación la causa la tira**: el día que otro giro reciba una,
hereda el arreglo sin tocar nada. Fletes, maquinaria y taller conservan su subtitular
porque ahí no hay duplicación — verificado en pantalla.

## Lo medido

Todo lo de abajo se corrió después del cambio y se reporta como salió.

| Qué | Antes | Después |
|---|---|---|
| Palabras · sección 2 de empeño | 52 | **29** |
| JS gzip · `/empeno-y-prestamo/` | 4.45 KB | **4.45 KB** |
| Contraste mínimo · maquinaria, fletes, taller | 4.65:1 | **5.76:1** |
| Contraste mínimo · empeño | 3.47:1 | **3.47:1** |
| `validar-a11y.mjs` | 16/16 | **16/16 CUMPLE** |
| `verificar-contraste.py` | OK | **OK · 0 hallazgos** |
| Tests | 133 | **148** · 15 nuevos |
| `npm run build` | código 1 | **código 1** · centinela intacto |

**Cero bytes de JavaScript.** No hay `<script src>`, no hay observador y no hay animación
de entrada: todo es CSS estático. Por eso la pieza entra en las cuatro páginas de giro
sin mover CA-10, y **taller sigue en 0 KB**.

Por lo mismo la pieza **no lleva bloque `prefers-reduced-motion`**: no hay nada que
reducir. El día que se le añada movimiento, ese bloque es obligatorio.

El contraste de las tres páginas de giro **subió** sin que ese fuera el objetivo: su
peor combinación era el numeral `01` en `--oro-texto-grande`, y al salir los numerales
salió con ellos.

## Lo que se probó y se tiró

**La versión horizontal a partir de 768 px.** El corchete de retorno tenía que pasar por
debajo de cuatro columnas y su geometría dejaba de ser la misma en los dos anchos: dos
piezas que mantener en vez de una. Queda vertical a todos los anchos, dentro de 56ch. La
audiencia del contrato entra por teléfono; escritorio hereda, no manda.

**El corchete de 12 px de ancho con radio 12.** El radio se comía el brazo entero, así
que arriba y abajo no quedaba un píxel de recta y la pieza se leía como una línea
punteada con dos ganchos — no como un retorno. Con 20 de ancho y radio 10 quedan 10 px
de brazo horizontal a cada extremo, que es lo que apunta hacia el primer y el último
disco. **Se vio en pantalla a 375 px; no se dedujo.**

## Lo que NO arregla, y hay que decirlo

**El encabezado sigue preguntando «¿Cuánto me dan y cuándo?» y la sección no contesta
ninguna de las dos.** No es un defecto de esta pieza: el bloque de cifras que las
contestaba lo borró el ADR-0040, y la tasa, el plazo y el aforo siguen sin cerrar.

Un flujo más limpio hace ese hueco **más visible, no menos**. Quedan dos salidas y las
dos son decisión de cliente, no de diseño: cambiar el encabezado a algo que la sección sí
responda, o cerrar las cifras. Aquí no se tocó el encabezado porque eso era copy nuevo y
excedía lo pedido.

## Coste

Cuatro íconos nuevos en `iconos.ts` —`identificacion`, `balanza`, `efectivo`,
`retorno`—, un componente, un tipo `PasoFlujo`, dos campos en `Giro` y 15 tests. La lista
numerada **sigue viva** como respaldo: un giro sin `flujo` escrito cae en ella. Borrar esa
rama convertiría «falta partir el copy» en «la sección desaparece».

## Consecuencias

- Todo el copy nuevo es **PROPUESTA SIN APROBAR**, como el que sustituye.
- `pasosPropuestos` ya no se pinta en ningún giro, pero **no se borra**: es la fuente de
  la que salió el reparto y el respaldo de la plantilla.
- El tope de cuatro palabras de `que` lo vigila un test. Sin él, el campo se alarga solo
  y la pieza vuelve a ser el párrafo que vino a sustituir.

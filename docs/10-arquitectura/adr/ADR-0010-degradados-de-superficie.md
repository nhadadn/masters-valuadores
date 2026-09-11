---
tipo: adr
id: ADR-0010
estado: ACEPTADA
fecha: 2026-09-10
decide: Nadir
enmienda: ADR-0004-identidad-plana
implementa: Claude Code
---

# ADR-0010 · El fondo deja de ser blanco, y el acero vuelve con fuente

## Qué lo abrió

Nadir, 10 de septiembre, entregando la foto de la fachada:

> *«Me gustaría que el fondo fuese un gradiente de tonos entre amarillo, negro,
> plateado, que sea acorde a la imagen que representa el cliente. Un fondo blanco no
> transmite nada para el cliente.»*

## El acero vuelve, y esta vez la fuente es buena

El [[ADR-0004-identidad-plana|ADR-0004]] retiró la rampa de acero con esta frase:

> «La rampa de acero derivada de la insignia **se retira**.»

Se retiró porque salía de la **insignia con textura**, que era mala fuente —un raster
con bisel y viñeta—. Ese argumento sigue siendo correcto para esa fuente.

**Pero ahora hay una fuente mejor: el edificio.** El local es contenedor amarillo sobre
fachada negra con revestimiento de **piedra gris grafito**. Negro, amarillo y acero es
literalmente de qué está hecho el negocio.

Es la misma lección del [[ADR-0006-el-amarillo-vive|ADR-0006]] —*el material vivo gana
sobre el archivo*— llevada un paso más: **no hay material más vivo que el edificio**.

## El límite que no se negocia

Un degradado que fuera **de amarillo a negro detrás de texto no tiene tinta posible.**
Ninguna funciona en los dos extremos: sobre `#E7C041` hace falta tinta oscura, sobre
`#0C0D0F` hace falta clara. No es cuestión de gusto, es aritmética.

**Por eso cada degradado se queda dentro de una banda de luminancia.** Claro con claro,
oscuro con oscuro. Y el amarillo entra como arista, como bloque y como cinta —nunca
como extremo de un degradado con texto encima.

Que es, además, **lo que hace el edificio**: el contenedor amarillo va ARRIBA de la
fachada negra, no fundido con ella.

## Los valores, con el peor extremo calculado

En un degradado lo único que importa es el **extremo peor**. Es el que se calcula y el
que se declara como `background-color`.

| Token | Valor | Papel | Peor caso |
|---|---|---|---|
| `--acero-050` | `#ECEEF0` | fin de los degradados claros | negro-950 encima · **16.72:1** |
| `--grafito` | `#22262A` | fin del degradado oscuro | blanco encima · **15.23:1** |

| Degradado | De → a | Tinta de cuerpo en el peor extremo |
|---|---|---|
| `--grad-claro` | blanco → acero-050 | negro-600 · **7.46:1** |
| `--grad-alterno` | crema-050 → acero-050 | negro-600 · **7.46:1** |
| `--grad-oscuro` | negro-950 → grafito | negro-300 · **7.27:1** · oro-500 · **8.71:1** |

## Dos cosas que esto rompió y cómo se arreglaron

**1 · El oro de texto tampoco pasa sobre acero.** Ya se sabía de crema (4.05:1); sobre
acero da **4.00:1**. Las dos superficies claras bajan el oro de cuerpo a tinta
secundaria.

Pero eso, aplicado a secas, **habría apagado el titular a dos tintas** —el gesto más
reconocible de la marca— para salvar un caso que no era el suyo. El titular es texto
**grande en peso 900**, y ahí el piso de la WCAG baja a **3:1**, que `--oro-800` pasa
sobre las tres superficies claras. Por eso existe `--oro-texto-grande`, separado del de
cuerpo.

**2 · `background: linear-gradient()` deja `background-color` en transparente.** Y
cualquier herramienta que resuelva el fondo subiendo por los ancestros —la nuestra
incluida— acaba encontrando el blanco de la página. Pasó de verdad: `validar-a11y` dio
**1:1** en un botón blanco sobre sección oscura.

Se declara siempre `background-color` con el **extremo peor** además del degradado. No
es decoración: es lo que hace que la medición sea honesta, y sirve de respaldo si el
degradado no pinta.

## Lo que NO cambia

- La **identidad sigue plana**. El ADR-0004 decidió el tratamiento —sin bisel, sin
  textura, sin viñeta— y eso no se toca. Un degradado de superficie no es un bisel: no
  hay relieve, no hay brillo especular, no hay volumen fingido.
- El **acento sigue siendo `#E7C041`** y sigue sin poder ir suelto sobre claro.
- El acero **no entra como color de marca**, solo como final de superficie. No se
  escribe con él, no se rellenan bloques con él.

## Riesgo anotado

Un degradado mal usado es el camino más corto de vuelta a «esto parece plantilla». La
salvaguarda es que los tres degradados están en tokens y **ningún componente puede
escribir uno propio**: si alguien necesita otro, se agrega aquí con su peor extremo
calculado, como todo lo demás.

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

## Segunda pasada · 10 de septiembre, tarde

> *«No veo aún uniforme el fondo, además, se ve negro sin estilo ni ningún tipo de
> atractivo.»* — Nadir

Las dos cosas eran ciertas y tenían causas distintas.

### El claro no era uniforme porque la alternancia peleaba con la rampa

La sección alterna llevaba un velo del 4.5 %. Medido bajando por la página, el fondo
hacía **231 → 237 → 225**: subía y bajaba en vez de descender. Eso es exactamente lo que
se lee como «no uniforme».

**La alternancia se retiró.** El ritmo entre secciones ya lo llevan la etiqueta, la
regla dorada y la cinta de palabras; una cuarta señal no hacía falta y además peleaba
con el fondo. Medido después, en veinte cortes: **253 · 251 · 249 · 248 · 246 · 244 ·
242 · 241 · 239 · 237 · 236 · 234 · 233 · 231 · 230.** Monótono, sin un salto.

### El oscuro era negro plano porque no tenía luz

Era una rampa de gris a negro y nada más. Ahora lleva **dos capas**: un resplandor de
oro que entra por arriba a la derecha, y debajo la rampa que sigue bajando hasta el
negro del pie.

El resplandor **no es una forma** —eso fue la franja diagonal que se retiró— **es luz
ambiente**. Y cita al edificio: el contenedor amarillo está ARRIBA de la fachada negra.

Medido en el render, cruzando el tramo oscuro: `rgb(25,28,31)` frío a la izquierda,
`rgb(60,58,43)` cálido a la derecha. Ya no es negro plano.

**El 18 % no es a ojo, es el techo.** Calculado sobre el punto donde el oro pega con más
fuerza:

| Oro | Blanco encima | `negro-300` encima |
|---|---|---|
| 10 % | 12.34:1 | 5.89:1 |
| **18 %** | **10.14:1** | **4.84:1** ← el elegido |
| 22 % | 9.20:1 | **4.39:1** ← ya no pasa AA |

Quien marca el límite no es el blanco: es `negro-300`, la tinta tenue del pie.

### Una sola tierra oscura, no cuatro negros

El encabezado, la sección oscura, la banda de contacto, el pie y la barra fija llevaban
**cuatro valores distintos** —grafito, negro-950, negro-900— pegados unos a otros. Ahora
comparten el mismo fondo compuesto. Eso era la otra mitad de «no se ve uniforme».

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

---
tipo: adr
id: ADR-0041
estado: ACEPTADA
fecha: 2026-09-15
decide: Nadir
enmienda: ADR-0024
revierte_parcialmente: ADR-0036
implementa: Claude Code
---

# ADR-0041 · El hero pasa de categoría a intención

## Qué se pidió

Nadir propuso reescribir el hero para que dejara de decir *«esta es nuestra página de
empeño»* y dijera *«tengo algo → necesito dinero → aquí pueden decirme cuánto vale»*.
Traía titular, lista de bienes, dos botones y una línea de dónde y cuándo.

## Lo que se verificó antes de escribir una línea

| Su texto | Respaldo |
|---|---|
| «en Torreón» | `negocio.ts:150` · documentado por el cliente, dos fuentes |
| La lista de bienes | Las seis ya están publicadas en el planeta, con su `fuente`: `letrero` o `publicacion` |
| «Trae tu bien…, te decimos cuánto podemos prestarte» | Casi literal el `subtitularPropuesto` que ya existía |
| «Lun–Vie 9:00–18:00 · Sáb 9:00–15:00» | **Coincide exacto** con `negocio.ts:194` |

## Lo que NO entró: «hoy»

Su titular decía *«Convierte tus bienes en efectivo **hoy**»*. **«Hoy» es una promesa de
plazo**, y los plazos están en la lista de lo que este repo no inventa. Nada en los datos
dice que el desembolso sea el mismo día.

No fue una lectura mía: el comentario que había sobre esa misma promesa decía, textual,
*«ni una cifra, **ni un plazo**, ni una lista de bienes»*. **Nadir lo quitó.**

De las tres cosas que ese comentario prohibía, dos entran hoy con respaldo —la lista de
bienes sale del dato ya publicado— y la tercera se queda fuera.

## Cuatro decisiones de estructura

Nadir aceptó las cuatro recomendaciones:

1. **El `h1` es «Empeño y préstamo en Torreón»**, no la promesa. Su propuesta ponía la
   categoría en la etiqueta, que es un `<p>`: el `h1` habría perdido la palabra clave y
   el lugar. Así se gana la intención **y** se conserva la señal.
2. **Fuera su frase en prosa.** Decía lo mismo que la tira de pasos que ya estaba ahí
   —«01 Trae tu bien · 02 Lo valuamos · 03 Sales con tu efectivo»—.
3. **Iconos del set, no emoji.** El sistema no tiene un solo emoji; esos dos habrían
   sido los únicos del sitio, con su propio tipo y su propio color.
4. **Vuelve «Enviar foto por WhatsApp»**, que el [[ADR-0036-fuera-el-panel-de-consulta|ADR-0036]]
   había quitado. Y es coherente con ese ADR, no contra él: lo que sobraba era un
   **bloque** de contacto a media página, no el canal. Aquí es la acción secundaria del
   hero.

## Nada se teclea

- El titular compone `giro.nombre` con `sucursalPrincipal.ciudad`, y si la ciudad no
  estuviera confirmada se queda como estaba en vez de pintar el centinela en un `h1`.
- **La lista de bienes se deriva de `bienesPropuestos`**, la misma fuente que pinta el
  planeta. Escribirla a mano habría creado dos listas que se contradicen el día que
  alguien añada una categoría.
- Los horarios salen de `horariosLegibles()`, sin el día cerrado: «domingo cerrado» es
  información de la sección de ubicación, no de la primera pantalla.

## Y el CTA vive en el dato, no en la plantilla

`ctaPrestamo` es un campo de `giros.ts` y solo lo tiene empeño. No es purismo: **esta
plantilla pinta las cuatro páginas de giro**, y «quiero saber cuánto me prestan» es
cierto en empeño y **falso** en compra-venta, fletes y taller, que no prestan dinero.
Escribirlo en el marcado lo habría publicado en las cuatro.

Su presencia es además el interruptor del bloque: donde no hay CTA, no hay botones ni
línea de dónde y cuándo. Verificado en las cuatro páginas — solo empeño los pinta.

## Tres fallos propios, y lo que enseñó cada uno

**1 · Un token inventado, `--e-5`.** La escala salta de `--e-4` a `--e-6`. Lo cazó
`tokens-vivos` —cuarta vez en este proyecto— y lo agravé escribiéndolo con reserva:
`var(--e-5, var(--e-4))`. **La reserva es lo peor de todo**: disimula que el token no
existe y el próximo que lo lea creerá que sí.

**2 · Los dos botones salían idénticos.** `BotonWhatsApp` tenía tres variantes
—`bloque`, `linea`, `barra`— y **las tres solo cambian ancho y alto**: el tratamiento es
siempre el primario. Dos bloques de carbón compitiendo no dicen cuál es la acción
principal, así que el primitivo aprendió un `secundario` con los mismos valores que
`Boton.secundario`.

No se resolvió desde la página a propósito: el CSS con ámbito de una página **no alcanza
la raíz de un componente hijo** — lección del [[ADR-0040-css-podado-y-la-pausa-que-nunca-existio|ADR-0040]].

**3 · El secundario no se apagaba, y costó dos intentos.** Dos cosas a la vez:

- El relleno oscuro **no lo pinta `background`** —el computado del botón es
  transparente— sino el `::before` de la arista del ADR-0007 §5.
- `.wa:not(.barra)` vale 0,2,0 de especificidad y `.secundario` a secas 0,1,0, así que
  perdía sin hacer ruido.

Se arregla con `.wa.secundario` al final del bloque y `content: none` en el
pseudo-elemento.

### Y el validador tenía un punto ciego

El primer arreglo usaba `display: none` en el `::before`. El validador de accesibilidad
siguió dando **1.17:1** para un texto que en pantalla da 11.6:1 sobre mármol, porque
comprueba `content`, `position` y los cuatro insets del pseudo-elemento **pero no
`display`**: un pseudo apagado conserva su `background` en el árbol de estilo.

Se corrigieron **las dos cosas**, que es lo que este repo hace: `content: none` en el
componente —la forma canónica— y `display`/`visibility` añadidos al recorrido del
validador. Es la tercera ceguera de fondo que se le tapa, y las tres están comentadas
dentro.

## Lo medido

| | |
|---|---|
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| CA-10 | cumplido · 35.55 KB · sin cambio |
| `h1` a 390 px | 2 renglones · 93 px |
| `h1` a 1280 px | 1 renglón · 72 px |

El titular más largo de los cuatro giros, «Compra venta de maquinaria en Torreón», mide
**3 renglones a 390** y uno solo a 1280. Cabe.

**El desbordamiento horizontal no es de este cambio**: se localizó elemento por elemento
y los únicos que exceden son `ul.anillo` —el anillo del planeta, que fluctúa con la
rotación— y las tarjetas del carrusel, contenidas en su propio scroll. Ninguna pieza del
hero aparece.

## Evidencia

| Qué | Dónde |
|---|---|
| El hero | `src/routes/[giro]/+page.svelte` · `titular`, `valuamos`, `cuando`, `donde` |
| El CTA en el dato | `src/lib/datos/giros.ts` · `ctaPrestamo` |
| El secundario | `src/lib/componentes/BotonWhatsApp.svelte` · `.wa.secundario` |
| El punto ciego tapado | `herramientas/validar-a11y.mjs` · `fondoPseudo` |
| Cómo queda | `capturas/hero-390.png` · `capturas/hero-1280.png` |

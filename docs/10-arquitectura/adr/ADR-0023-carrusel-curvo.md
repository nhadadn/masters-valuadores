---
tipo: adr
id: ADR-0023
estado: ACEPTADA
fecha: 2026-09-12
decide: Nadir
revierte: ADR-0022 §1
implementa: Claude Code
---

# ADR-0023 · El carrusel curvo en 3D, y el LCP que estaba roto detrás

## Qué se decide

> *«Te pedí un carousel slider 3d curved.»* — Nadir

El [[ADR-0022-reticula-de-fotos-reales|ADR-0022]] §1 eligió una retícula y dejó por
escrito por qué. **Era la decisión de Nadir, no la nuestra**, y se pidió el carrusel
otra vez. Se construye el carrusel. Las razones del 0022 no se borran —una decisión
mala documentada vale más que una buena olvidada— pero dejan de gobernar.

Lo que NO cambia del 0022: qué fotos entran, de dónde salen, que no son una lista de
existencias, y que el video de IA y las piezas de Rolex siguen fuera.

## Cómo está hecho

| Qué | Con qué |
|---|---|
| La pista | `scroll-snap` sobre un contenedor de scroll |
| La curva y la profundidad | `view-timeline` — animación guiada por scroll, del navegador |
| Arrastre, dedo, rueda, tabulador, lector de pantalla | **de fábrica**, sin programar nada |
| Los puntos | enlaces de ancla |
| Donde no hay `animation-timeline` | carrusel plano con snap · se prueba con `@supports` |

**La `perspective` va en la pista, no en un padre.** `overflow` distinto de `visible`
fuerza `transform-style: flat`, así que `preserve-3d` en un contenedor de scroll no
funciona. Declarada en la pista, sus hijos directos la reciben sin `preserve-3d`, y el
punto de fuga queda fijo en el centro del marco.

**El `translateX` es lo que cierra el arco.** Al girar 48° la tarjeta encoge sobre su
propio centro —cos(48°) = 0.67, de 320 px a 214— y el hueco que deja **no lo quita
`gap: 0`**: la separación no estaba en la maqueta, la creaba el propio giro. Costó dos
intentos verlo; el primero solo quitó el hueco de la maqueta y la captura salió casi
idéntica.

## Lo que sí necesitó JavaScript, y solo eso

Los puntos son anclas, y al pulsarlas el navegador desplaza **todos** los contenedores
del destino, incluida la página: medido, **un salto vertical de 325 px** cada vez que
alguien cambiaba de foto.

Se probaron tres arreglos solo con CSS y **los tres dieron exactamente los mismos
325 px**:

```
como esta ahora          salto vertical 325 px
snap solo en linea       salto vertical 325 px
snap de proximidad       salto vertical 325 px
las dos cosas            salto vertical 325 px
```

No era el ajuste del snap: es cómo funciona la navegación por ancla.
`scrollIntoView({ block: 'nearest' })` lo arregla, y eso es JavaScript. Son **1.7 KB**
sobre los 7.43 que la ruta ya pagaba por el ADR-0021, y **nada depende de que exista**:
si no carga, los puntos siguen siendo anclas y siguen cambiando de foto, con el salto.

El mismo archivo marca cuál se está viendo. El primer intento encendía «cualquier
tarjeta que intersecte por encima del 60 %», y en escritorio caben tres o cuatro a la
vez: se pulsaba el punto 4 y se encendía el 5. Ahora decide la distancia al centro del
marco, que no es ambigua. Comprobado a 390 y 1280: los cuatro puntos aciertan.

### El teclado no lo resuelve el `tabindex`

Con `scroll-snap-type: x mandatory` las flechas sobre la pista mueven **2 px**: el
snap las devuelve. Lo que sí funciona, y está medido, es **tabular entre las fotos** —
cada tarjeta es un enlace y el navegador la trae al centro sola.

## El LCP: una regresión que no era la regresión

La primera medición dijo que el carrusel subía el LCP de **2024 a ~3200 ms**. Era
falso, y la forma de descubrirlo fue la misma que ya salvó a este repo una vez: medir
**intercalado**, alternando las dos versiones en la misma sesión, para que la carga de
la máquina les toque por igual.

```
vuelta 1   reticula 2512 ms   carrusel 2640 ms
vuelta 2   reticula 2516 ms   carrusel 2672 ms
vuelta 3   reticula 2404 ms   carrusel 2736 ms
vuelta 4   reticula 2552 ms   carrusel 2760 ms
media      reticula 2496 ms   carrusel 2702 ms   →  +206 ms
```

El carrusel costaba **206 ms**, no 1200. El resto era deriva de la máquina.

### Y al buscar los 206 ms apareció el fallo de verdad

El elemento LCP de la página no es del carrusel: es `empeno-800.avif`, la foto de
entrada del giro. Y llevaba **`loading="lazy"` y `fetchpriority="auto"`**. El navegador
no la pedía hasta pasados unos 2000 ms porque nadie le había dicho que corría prisa.

`Foto.svelte` ya tenía la prop, y su propio comentario decía para qué:

> *«La de la entrada se carga de inmediato: es el LCP.»*

La usaba la portada. **Las cuatro páginas de giro, no** — desde que se abrió la ranura
de foto en el ADR-0009. Con la prop puesta, intercalado otra vez:

```
media    reticula (como estaba) 3059 ms   ·   carrusel + prioritaria 2249 ms   →  −810 ms
```

Y con la herramienta del repo: **1904 y 1888 ms, dentro de umbral**, contra 2896 y 2496
de lo que hay publicado. El carrusel gana las cuatro vueltas.

**El arreglo vale cerca de un segundo y no lo causó este cambio: lo destapó.**

## Lo medido

| | |
|---|---|
| LCP | **1888–1904 ms** ✓ · antes 2496–2896 |
| Peso de empeño | **160.1 KB** en 19 peticiones · 0 de terceros |
| JS de la ruta | 9.14 KB gzip · margen de 30.86 KB |
| Imagen | 78 KB · el carrusel solo carga lo visible; la retícula cargaba las seis |
| Salto vertical al pulsar un punto | **0 px** · antes 325 |
| Accesibilidad | 16/16 CUMPLE · contraste 0 hallazgos · piezas 12/12 |
| Tests | 127 |

## Lo que sigue sin arreglarse aquí

- **La resolución.** La tarjeta se para en 320 px porque las fuentes miden entre 440 y
  985 px. Es el techo del ADR-0022 y solo lo levantan los originales de Cristóbal.
- **Joyería no tiene ni una foto suya.** El carrusel más bonito del mundo no la inventa.

## Evidencia

| Qué | Dónde |
|---|---|
| El carrusel | `src/lib/componentes/Carrusel.svelte` |
| Lo único que necesitó script | `static/animacion/carrusel.js` |
| La foto de entrada, ya prioritaria | `src/routes/[giro]/+page.svelte` |
| LCP y peso | `RUTA=/empeno-y-prestamo/ node herramientas/medir-portada.mjs` |

---
tipo: adr
id: ADR-0040
estado: ACEPTADA
fecha: 2026-09-15
decide: Nadir
corrige: ADR-0026
implementa: Claude Code
---

# ADR-0040 · CSS podado, y la pausa del planeta que nunca existió

## Qué se pidió

> *«Ahora quitemos los `.revision` muertos.»* — Nadir

Eran tres. **Había veinticuatro**, y uno de ellos no estaba muerto: estaba roto.

## Lo que había

El build reportaba, en cada vuelta y dos veces cada uno:

| Archivo | Selectores |
|---|---|
| `[giro]/+page.svelte` | **18** |
| `+page.svelte` · portada | 5 |
| `contacto/+page.svelte` | 1 |
| `PlanetaBienes.svelte` | 2 |

## El hallazgo: «sin usar» no siempre significa muerto

Los dos de `PlanetaBienes` eran la pausa del
[[ADR-0026-planeta-de-bienes|ADR-0026]] — el planeta se congela fuera de pantalla para
no gastar batería en el teléfono de gama baja del contrato:

```css
.escenario[data-quieto] .anillo,
.escenario[data-quieto] .contra { animation-play-state: paused; }
```

`data-quieto` lo pone `planeta.js` **en tiempo de ejecución**. Svelte no lo ve en el
marcado, lo declara sin usar y **lo borra del CSS compilado**. No es un aviso cosmético:
la regla nunca llegaba al build.

Comprobado en la página construida, antes de tocar nada:

```
planeta EN pantalla : { quieto: false, anillo: "running" }
planeta FUERA       : { quieto: true,  anillo: "running" }   ← debía decir "paused"
```

Y un `grep` de `data-quieto` sobre el CSS del build no encontraba ningún archivo.

**La pausa del ADR-0026 nunca funcionó en el sitio publicado.** El script hacía su
trabajo —ponía el atributo— y no había nadie escuchando.

### Qué costó arreglarlo

Tres intentos, y los tres se midieron en lugar de suponerse:

1. `.escenario:global([data-quieto]) .anillo` — compila, **y sigue sin emitir**.
2. `:global(.escenario[data-quieto]) .anillo` — compila, **y sigue sin emitir**.
3. `:global(.escenario[data-quieto] .anillo)` — **no compila**. Svelte 5 no admite un
   descendiente dentro de `:global()`; eso era sintaxis de Svelte 4.

Lo que funciona es el **bloque** `:global { … }` de Svelte 5. Verificado en el CSS del
build y, lo que importa, en ejecución:

```
planeta EN pantalla : { anillo: "running" }
planeta FUERA       : { anillo: "paused", contra: "paused" }
```

### Y un error propio, de los que dan risa

El primer arreglo no compilaba y el mensaje señalaba una columna dentro de **mi propio
comentario**. Había escrito la ruta `build/**/*.css` dentro de un comentario CSS: esa
secuencia contiene `*/`, que **cierra el comentario antes de tiempo** y deja el resto
como CSS inválido. Tres intentos perdidos persiguiendo un fallo de sintaxis que yo mismo
había metido dos ediciones antes.

## Los otros veinticuatro, por clase

**Muertos de verdad** — solo existen en la hoja, nunca en el marcado:

- Los dieciocho de `[giro]`: `.revision`, `.rev-et`, `.rev-lista` (el recado del
  ADR-0025), `.requisitos`, `.cifras`, `.casilla`, todo el acordeón `.acordeon *`,
  `.signo*`, `.respuesta`, `.datos p` y `.bienes`. Todos son restos de secciones que
  quitó el [[ADR-0027-fuera-las-marcas-de-borrador|ADR-0027]].
- `.aviso` en la portada.

**Inalcanzables por ámbito** — apuntaban dentro de un componente hijo, donde el CSS con
ámbito de una página no llega:

- `.datos p` en portada y contacto: apuntaba a los `<p class="linea">` de
  `DatosDelLocal`. **No hacía falta**: ese componente ya declara
  `display: flex; gap; align-items` en `DatosDelLocal.svelte:106`. Era redundante
  además de inerte.
- `.lineas .principal > :nth-child(1|2|3)`: rota **por partida doble**. Pedía tres hijos
  —«insignia · hueco · botón»— y el hueco se fue con el ADR-0027, así que el tercero no
  existía; y los dos que quedan son **componentes**. Su propio comentario decía que *«el
  flujo automático daba el mismo dibujo»*, y eso es exactamente lo que se ve desde
  entonces.

## La prueba de que quitarlos no cambia nada

No hace falta confiar: **si Svelte ya los podaba, borrarlos del fuente no puede alterar
la salida.** Se comprobó comparando el md5 de los **catorce** archivos CSS del build
antes y después.

```
0.DxTEVovZ  f73ec91f6c72  →  f73ec91f6c72
2.CGZQSSyc  1abc7f11e28c  →  1abc7f11e28c
…                              (los catorce, idénticos)
```

**Byte a byte iguales.** Lo único que cambió hoy en el CSS servido es la regla del
planeta, que **se añadió** porque faltaba.

## Lo medido

| | |
|---|---|
| Selectores sin usar en el repo | 24 → **0** |
| CSS servido | **idéntico**, salvo la regla del planeta |
| Pausa del planeta fuera de pantalla | rota desde el ADR-0026 → **funciona** |
| Accesibilidad | **16/16 CUMPLE** |
| Contraste del sistema | **0 hallazgos** |
| Tests | **131** |
| CA-10 | cumplido · 35.55 KB · sin cambio |

## Lo que queda dicho para el futuro

**Un aviso de «Unused CSS selector» de Svelte no autoriza a borrar.** Hay que mirar
antes si la clase o el atributo los pone un script: en ese caso el aviso no dice «esto
sobra», dice **«esto se está tirando y tu regla no existe en producción»**. Es la única
forma en que este repo puede tener CSS que se cree escrito y no lo esté.

## Evidencia

| Qué | Dónde |
|---|---|
| La pausa rescatada | `src/lib/componentes/PlanetaBienes.svelte` · bloque `:global` |
| Quién pone el atributo | `static/animacion/planeta.js:20,25,26,37,94` |
| El hueco que dejaron los dieciocho | `src/routes/[giro]/+page.svelte` |
| La colocación rota | `src/routes/+page.svelte` · comentario del ADR-0040 |

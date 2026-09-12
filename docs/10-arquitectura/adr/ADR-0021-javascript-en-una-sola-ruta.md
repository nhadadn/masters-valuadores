---
tipo: adr
id: ADR-0021
estado: ACEPTADA
fecha: 2026-09-11
decide: Nadir
enmienda: ADR-0008
implementa: Claude Code
---

# ADR-0021 · Entra JavaScript, en una sola ruta y sin marco

## Qué se pidió

> *«Cómo podemos implementar librerías para poder hacer animaciones completas en el
> sitio, como por ejemplo al entrar a joyería, hacer una animación en base a una
> imagen de monedas, cayendo o algo similar. Necesitamos un sitio 100 % interactivo
> bonito profesional, no algo genérico creado por AI.»* — Nadir

Choca de frente con la decisión 1 del `CLAUDE.md`, así que se paró y se preguntó, que
es lo que ese archivo manda hacer. Se eligió **JavaScript propio, sin marco, en una
ruta**, sobre las otras dos opciones ofrecidas.

## Lo que no se pudo hacer: joyería no existe

El ejemplo no era construible. Joyería no es un giro bloqueado: **no está**. El
[[ADR-0008-alcance-de-cuatro-giros|ADR-0008]] la sacó el 10 de septiembre y
`giros.ts` deja escrito el costo — era el giro con el material vivo más fuerte, dos
de sus cinco publicaciones. Hoy lo único suyo que queda en el sitio es el teléfono de
línea y un ícono dentro de empeño.

No había puerta por la que entrar. La banda se puso en **empeño**, que sí existe y ya
era el registro de lujo del [[ADR-0020-crema-calida-y-marmol|ADR-0020]].

## Por qué sin librería

El `+layout.ts` ya traía el número: el runtime de Svelte más el enrutador pesan
**~46 KB gzip por página** contra un presupuesto (CA-10) de 40. Encender `csr = true`
en una ruta incumple el presupuesto **antes de la primera línea de librería**; GSAP o
Motion irían encima de esos 46, no en su lugar.

Un script propio no arrastra nada de eso. Medido: **7.43 KB gzip**, en 1 de 8 páginas.
Las otras siete siguen en 0 KB.

## El hueco que hubo que tapar primero

El camino más barato resultó ser el único que el guardia de CA-10 no sabía ver.
Medido contra cinco formas de meter JavaScript en una página, tres eran invisibles:
un script propio desde `static/`, una librería copiada ahí, y un `<script>` en línea.
Solo miraba `_app/immutable/*.js` y orígenes `https://`.

Habría impreso «✓ CA-10 cumplido · margen de 40 KB» mientras mandaba la librería
entera. Se arregló **antes** de escribir una línea de animación, con
`tests/presupuesto.test.ts` detrás para que no vuelva a estrecharse. Es la misma
falla que el encabezado de ese archivo ya documentaba del mapa de Google: medir la
parte que existía cuando se escribió el verificador.

## Qué es, y por qué no son partículas

Monedas flotando detrás de un titular es el efecto por defecto de cualquier
plantilla. Estas **caen y se amontonan**, que es lo que pasa en el negocio: traes un
bien y te cuentan el efectivo encima del mostrador. Cuando el montón se asienta, ahí
se queda; si lo tocas, se desparrama y se vuelve a juntar.

**Va al pie de la sección de entrada, y después de los botones.** Detrás del `h1`
habría metido un fondo que cambia solo debajo de texto cuyo contraste este repo mide
y garantiza, y además se reconoce a un metro. Lo primero que tiene que encontrar
alguien con prisa es el botón, no el adorno.

El color no está escrito en el script: lo pregunta al sistema con `getComputedStyle`
(`--oro-500`, `--metal-oro-peor`). En este repo un color literal dentro de un
componente ya explotó cuatro veces al cambiar de superficie.

## Cómo se apaga solo

| Situación | Qué hace |
|---|---|
| Ahorro de datos activado | nada, ni un cuadro |
| `prefers-reduced-motion` | dibuja el montón **ya asentado**, quieto |
| Pestaña oculta o fuera de pantalla | congela |
| Página aún cargando | no arranca hasta después del `load` |
| El montón se asienta | **el bucle muere**; solo lo resucita la mano |
| Los cuadros vienen largos | tira monedas hasta que dejen de venir largos |

## Lo medido

`herramientas/medir-monedas.mjs`, 390 px, ventanas de 6 s, contra la misma página sin
el lienzo medida **en la misma fase**:

| Escenario | Añade al hilo | fps | Tareas largas |
|---|---|---|---|
| Mientras caen | +509 ms | 60.3 | 0 |
| Ya asentadas | +66 ms | 60.2 | 0 |
| Fuera de pantalla | −4 ms | 60.2 | 0 |
| `reduced-motion` | +23 ms | 60.4 | 0 |
| Caída con CPU a 1/4 | — | **49** | 0 |

### Tres veces que el instrumento mintió, y qué enseñaron

1. **«Fuera de pantalla» no lo estaba.** La banda queda a 758 px y el viewport mide
   844. El test medía dos veces lo mismo y culpaba al código de no pausarse.

2. **Se comparó la caída contra una base en reposo, bajo estrangulador de CPU.** Dio
   «4721 ms de la animación». Perfilado después: la misma página **sin lienzo
   ninguno** marcaba 4070 ms con el freno puesto, y 301 sin él. Casi todo aquel
   número era el freno. De ahí la regla: **el número que se declara sale sin freno**,
   y con freno se miran cuadros por segundo.

3. **Contar «tareas largas» bajo el freno es contar el freno.** El umbral son 50 ms,
   y a 1/4 de reloj cualquier tarea de 13 ms lo cruza. Tres vueltas seguidas: una vez
   salieron dos, otra ninguna, y otra la página **sin** el lienzo salió peor que con
   él. Se cuentan sin freno.

### Y una que solo se vio mirando

Ninguna de las cinco mediciones habría dicho que media docena de monedas quedaban
**congeladas de canto** —rayas doradas de dos píxeles, que se leen como un fallo de
dibujo— ni que la hilera de abajo salía **recortada** porque el suelo se medía con el
radio y el sello mide `radio + borde`. Seguía pintando, seguía amontonándose, seguía
sin costar. Se arreglaron después de abrir la captura.

### Qué costó el rendimiento, y qué no

La sospecha obvia —la física es O(n²)— era la equivocada. Bajar los pasos de física
de 5 a 2 **empeoró** el número: la caída se alargaba y se pagaba lo mismo durante más
rato. El costo estaba en el **trazado**: doce llamadas de canvas por moneda y cuadro.
La moneda ahora se traza una vez en un lienzo aparte y por cuadro solo se copia.

Lo que sí resultó cuadrático fue **agrupar las monedas en el centro** para que hicieran
montón en vez de cenefa: amontonadas se solapan muchas más parejas. Con 34 monedas y
el reloj a 1/4 la página caía a **19.1 fps**. Por eso el tope bajó a 26 y por eso el
script se mide a sí mismo y degrada: `hardwareConcurrency` no sirve —un teléfono
barato reporta ocho núcleos igual que un portátil— y de hecho aquí reportaba 8
mientras la página iba a 19 fps.

## Lo que esto NO es

Se pidió «100 % interactivo» y «top tier futurista». **Esto no es eso, y conviene que
esté escrito.** Es una banda, en una página, que reacciona al toque. No hay 3D, no
hay escenas, no hay la clase de animación que lleva una librería detrás.

El diagnóstico del `CLAUDE.md` sobre por qué el sitio se ve genérico no dice que
falten animaciones; dice que **las fotos son la mitad de lo que falta** y que ningún
CSS las sustituye — ninguna librería tampoco. Hoy hay **una** foto suya. Las otras
tres son de banco, teñidas y rotuladas «FOTO DE ARCHIVO», y quedan 27 huecos de copy.
Monedas cayendo encima de una foto de banco rotulada se ve **más** genérico, no menos.

## Consecuencias

- **La decisión 1 del `CLAUDE.md` deja de ser literal.** Ya no son «8 páginas · 0 KB
  de JS en todas»: son 7 de 8. El archivo se enmendó; el presupuesto no se subió.
- Si joyería vuelve (D-18), nace en `lujo` y hereda mármol y banda sin tocar código:
  el registro sale del **dato**, no del slug, igual que en el ADR-0020.
- Cualquier JavaScript que entre a partir de hoy lo ve CA-10 y cuenta bytes.

## Evidencia

| Qué | Dónde |
|---|---|
| La animación | `static/animacion/monedas.js` |
| El lienzo y su sitio | `src/lib/componentes/MonedasQueCaen.svelte` |
| Del dato, no del slug | `src/routes/[giro]/+page.svelte` · `giro.registro === 'lujo'` |
| El guardia, ya sin el hueco | `herramientas/presupuesto.mjs` · `tests/presupuesto.test.ts` |
| Las cinco mediciones | `herramientas/medir-monedas.mjs` |
| Peso | CA-10 · 6.98 KB en `/empeno-y-prestamo/`, 0 KB en las otras siete |
| Accesibilidad y contraste | `validar-a11y.mjs` 16/16 · `verificar-contraste.py` 0 hallazgos |

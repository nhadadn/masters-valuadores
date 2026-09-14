---
tipo: referencia
estado: VIGENTE — 14 de septiembre de 2026 · revisado por el ADR-0027
pantalla: /empeno-y-prestamo/
---

# El mapa con nombres de la pantalla

Para qué sirve: para que **cliente y consultoría llamen igual a lo mismo**. Si en un
mensaje dice «la cabecera», tiene que haber una sola cosa que pueda ser.

Las imágenes están en `capturas/mapa-1280-*.png` y `capturas/mapa-390-*.png`. **No se
dibujan a mano**: `herramientas/mapa-de-pantalla.mjs` abre la página de verdad, le
pregunta al navegador dónde está cada pieza y clava el número ahí. Si alguien mueve una
sección, se vuelve a correr:

```
node herramientas/mapa-de-pantalla.mjs
```

Si una pieza cambia de nombre de clase, el script **avisa** en vez de pintar un mapa
mentiroso.

---

## Las veinticinco piezas

**Los números NO se renumeran.** Ya son vocabulario: si «la 9» era la promesa ayer,
sigue siéndolo hoy. Renumerar por un cambio invalidaría todos los mensajes anteriores.

Cinco piezas **dejaron de existir** con el [[ADR-0027-fuera-las-marcas-de-borrador|ADR-0027]]
y sus números quedan vacantes, no reutilizados:

| # | Qué era | Por qué se fue |
|---|---|---|
| ~~4~~ | Banda de borrador | Decisión de Nadir |
| ~~16~~ | Bloque de revisión | Idem |
| ~~21~~ | Bloque de cifras | Era solo el rótulo y el centinela |
| ~~22~~ | Bloque de requisitos | La sección entera era un hueco |
| ~~25~~ | Acordeón | Cuatro preguntas sin una sola respuesta escrita |


| # | Nombre | Qué es | Dónde vive |
|---|---|---|---|
| 1 | **Cabecera** | La franja negra de arriba. Está en **todas** las páginas | `+layout.svelte` |
| 2 | **Marca** | La M con «MASTER VALUADORES». Lleva a la portada | `+layout.svelte` |
| 3 | **Navegación** | Los enlaces a las líneas. **Solo en escritorio** | `+layout.svelte` |
| 5 | **Migas de pan** | «Inicio › Empeño». Dice dónde estás y cómo volver | `Migas.svelte` |
| 6 | **Sección de entrada** | El bloque oscuro de arriba. **Desde el ADR-0027 viene en DOS partes**: etiqueta, titular, promesa y tira arriba; botones, foto y monedas **debajo** de los bienes | `[giro]/+page.svelte` |
| 7 | **Etiqueta de sección** | «LÍNEA DE NEGOCIO», en pequeño encima del titular | `Seccion.svelte` |
| 8 | **Titular** | «EMPEÑO Y PRÉSTAMO» | `Titular.svelte` |
| 9 | **Promesa** | «Convierte lo que tienes en efectivo» | `[giro]/+page.svelte` |
| 10 | **Tira de pasos** | `01 → 02 → 03`, la versión corta | `TiraPasos.svelte` |
| 14 | **Sección de bienes** | Todo el bloque claro de «¿Qué puedes empeñar?» | `[giro]/+page.svelte` |
| 15 | **Planeta de bienes** | Los seis discos girando con la M al centro | `PlanetaBienes.svelte` |
| 17 | **Bloque de consulta** | «¿No sabes si aceptamos lo que traes?» | `[giro]/+page.svelte` |
| 11 | **Botones de entrada** | WhatsApp y Llamar, juntos | `[giro]/+page.svelte` |
| 12 | **Foto de entrada** | La foto grande del reloj y la cadena | `Foto.svelte` |
| 13 | **Banda de monedas** | Las monedas que caen y se amontonan | `MonedasQueCaen.svelte` |
| 18 | **Carrusel del patio** | Las fotos que se deslizan de lado | `Carrusel.svelte` |
| 19 | **Puntos del carrusel** | Los seis puntitos de debajo | `Carrusel.svelte` |
| 20 | **Pasos del proceso** | `01 / 02 / 03` con su frase larga | `[giro]/+page.svelte` |
| 23 | **Mapa** | El mapa de Google. Carga al tocarlo | `Mapa.svelte` |
| 24 | **Datos del local** | Dirección, horarios, «Cómo llegar» | `DatosDelLocal.svelte` |
| 26 | **Otras líneas** | Los enlaces a maquinaria, fletes y taller | `[giro]/+page.svelte` |
| 27 | **Banda de contacto** | Teléfono y dirección, justo encima del pie | `BandaContacto.svelte` |
| 28 | **Pie** | Todo el bloque final: razón social, horarios, legales | `+layout.svelte` |
| 29 | **Barra fija** | La barra de WhatsApp pegada abajo. **Solo en teléfono** | `+layout.svelte` |
| 30 | **Botón flotante** | El WhatsApp que flota a la derecha. **Solo en escritorio** | `+layout.svelte` |

---

## Los términos de fuera, y cuáles NO aplican aquí

| En inglés | Aquí se llama | ¿Existe en este sitio? |
|---|---|---|
| header | **cabecera** | Sí · pieza 1 |
| footer | **pie** | Sí · pieza 28 |
| hero | **sección de entrada** | Sí · pieza 6 |
| breadcrumb | **migas de pan** | Sí · pieza 5 |
| sticky bar | **barra fija** | Sí · pieza 29 |
| accordion | **acordeón** | **Ya no.** Salió con el ADR-0027: no había respuestas |
| carousel / slider | **carrusel** | Sí · pieza 18 |
| card | **tarjeta** | Sí, pero **ya no en empeño** — ahí son discos del planeta |
| CTA | **botón de acción** | Sí · piezas 11, 17, 29, 30 |
| **modal** / popup | ventana emergente | **NO existe.** Nada en este sitio se abre encima tapando la página |
| **picker** | selector | **NO existe.** No hay ninguna fecha ni cantidad que elegir |
| **dropdown** | desplegable | **NO existe.** El menú de escritorio son enlaces sueltos |
| **tab** | pestaña | **NO existe** |
| **tooltip** | globo de ayuda | **NO existe** |
| **formulario** | formulario | **NO existe en empeño.** Solo en `/contacto/`, y su destino sigue sin decidir · D-13 |

Esa columna importa tanto como la otra: si en un mensaje aparece «el modal» o «el
picker», **no es de esta pantalla** y conviene parar antes de tocar nada.

---

## Cómo pedir un cambio para que no haya malentendido

El nombre solo, o el número, bastan:

> «La **promesa** está muy pegada al titular.»
> «El **bloque de consulta** que salga antes del **planeta**.»
> «En teléfono, la **barra fija** tapa el final del **pie**.»

Y si hay duda de si es de esta pantalla o de todas, la columna «dónde vive» lo dice:
lo que está en `+layout.svelte` **sale en las ocho páginas**; lo que está en
`[giro]/+page.svelte` sale en las cuatro de giro.

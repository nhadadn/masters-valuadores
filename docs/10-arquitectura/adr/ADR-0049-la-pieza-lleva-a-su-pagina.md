---
tipo: adr
id: ADR-0049
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: ADR-0048 (a dónde lleva la pieza)
implementa: Claude Code
---

# ADR-0049 · La pieza lleva a su página; el botón verde, a WhatsApp

## Qué se pidió

> *«Toda la imagen redirige a WhatsApp cuando debería de ser solo el icono verde, lo demás
> de la pantalla debe de ir a la siguiente página/página que pertenece a la sección que
> seleccionen.»* — Nadir, al ver publicado el ADR-0048

## Lo que se decide

| Qué se toca | A dónde lleva |
|---|---|
| La pieza: foto, título y frase | **la página de su línea** · `/empeno-y-prestamo/`, `/venta/`, `/financiamiento/`, `/fletes/`, `/taller/` |
| El botón verde | **WhatsApp**, con «Hola, escribo por [línea].» ya escrito |

- **Dos enlaces hermanos, no uno dentro de otro.** Un `<a>` dentro de otro es HTML inválido:
  el navegador lo repara partiendo el primero, sin avisar. El botón se coloca encima de la
  pieza desde el `<li>`.
- **El botón lleva el glifo de WhatsApp y no la flecha.** Esto no se pidió: se decidió al
  implementar. Una flecha se lee «ir a», y eso ahora lo hace la pieza; con la flecha, quien
  quisiera ver la página tocaría el botón y acabaría en WhatsApp. El glifo es el mismo de
  `BotonWhatsApp`. Volver a la flecha es cambiar una línea.
- **Mide 44 px, el piso táctil, y no los 48 de la casa.** `tokens.css` reserva el piso para
  los secundarios, y eso es este botón: la acción principal de la pieza es ir a su página, y
  el WhatsApp principal sigue en la barra fija y en el flotante. Es además el tamaño que tenía
  la flecha.
- **La interacción del ADR-0048 se queda.** Con ratón, la foto crece a 1.03 y aparece el
  botón; en táctil el botón se ve siempre. El hover se escucha en el `<li>` y no en el
  enlace: el botón no está dentro del enlace y, escuchado ahí, se apagaría bajo el cursor
  justo al ir por él.
- **Con teclado** el botón aparece al entrar en la pieza (`:focus-within`) y lleva su propio
  anillo: blanco entre dos filos de negro-950. El anillo de la casa es negro, y sobre una
  foto oscura no se ve.
- **Sin número de WhatsApp confirmado no se pinta el botón**, y la pieza sigue llevando a su
  página.
- **El ícono `flecha` sale de `iconos.ts`**: solo lo usaba el mosaico.

## Lo que cierra del ADR-0048

Quedaba abierto que **la portada ya no enlazaba desde su contenido a las páginas de cada
línea**. Vuelve a enlazarlas, con la pieza entera.

## Lo que se cazó antes de darlo por bueno

1. **Un choque que no estaba en pantalla.** El verificador marcó texto contra el botón en la
   pieza alta de Financiamiento a 1024 px. La captura no mostraba nada: el título va encima del
   botón y la frase termina antes. Lo que se cruzaban eran las CAJAS. «Financiamiento» mide
   159.5 px contra 135 de columna, la columna crecía con la palabra y la caja de la frase se
   estiraba por debajo del botón. La versión publicada del ADR-0048 tenía la misma geometría.
   Se fijó la columna (`minmax(0, 1fr)`) para que la frase no pueda repartirse bajo el botón, y
   el verificador pasó a medir los renglones dibujados en vez de las cajas.
   Antes de encontrarlo, el botón se había bajado de 48 a 44 creyendo que el choque era de
   tamaño. No lo era. Los 44 se quedan por la razón de arriba, no por esa.
2. **El test nuevo falla con el código viejo.** Contra el componente del ADR-0048 caen 2 de
   sus 4 pruebas. Y la guarda de anidamiento se probó con un mutante que mete el botón dentro
   del enlace: lo caza.

## Lo medido, en el sitio construido

| | |
|---|---|
| Tests | **159** · 4 nuevos en `tests/mosaico.test.ts` |
| Accesibilidad | **18/18 CUMPLE** |
| Destinos | las 5 piezas llevan a su página y los 5 botones a WhatsApp, en 390, 768, 1024 y 1280 |
| Qué recibe el clic | el centro y la esquina de la foto → la página · el centro del botón → WhatsApp, en los cuatro anchos |
| Clic y toque de verdad | foto de Venta → `/venta/` · botón de Taller → `wa.me/…?text=Hola, escribo por taller.` · en teléfono, foto de Financiamiento → `/financiamiento/` y su botón → WhatsApp |
| Hover | el botón sigue visible con el ratón encima; la foto a `scale(1.03)` |
| Teclado | Tab: pieza → botón; el botón aparece con foco en la pieza; anillo blanco de 3 px y halo negro-950 de 9 px |
| Botón | 44×44 en los cuatro anchos |
| Texto contra el botón | **0** choques de renglones dibujados; mínimo 13.1 px de aire (Financiamiento, 1280) |
| Desborde | **0** en los cuatro anchos |
| JS de la portada | **0 KB** · CA-10 con **35.55 KB** de margen |
| CA-08 | `npm run build` sale con **código 1** |

## Lo que queda abierto

- **«Financiamiento» sobresale 24.5 px de su columna a 1024 px**, en la pieza alta. No choca
  porque va encima de la frase, que ahí ocupa tres renglones. Si la frase se acortara a dos,
  el título bajaría a la altura del botón. **Nada en el repo lo vigila**: el verificador que
  lo mide se corrió fuera de `herramientas/`.
- **«Te atendemos por WhatsApp» sigue repitiendo** lo que hacen los botones de las piezas.

## Evidencia

| Qué | Dónde |
|---|---|
| La pieza lleva a su página | `src/lib/componentes/MosaicoLineas.svelte:54` |
| El botón, hermano del enlace y solo con número confirmado | `src/lib/componentes/MosaicoLineas.svelte:72` · `:73` |
| La pieza aísla el apilado del botón | `src/lib/componentes/MosaicoLineas.svelte:93` |
| La columna fija del texto | `src/lib/componentes/MosaicoLineas.svelte:152` |
| El botón: tamaño, sitio y anillo | `src/lib/componentes/MosaicoLineas.svelte:165` · `:178` · `:181` |
| El hover y el foco en el `<li>` | `src/lib/componentes/MosaicoLineas.svelte:198` · `:202` |
| Tableta y escritorio | `src/lib/componentes/MosaicoLineas.svelte:214` · `:231` |
| Sin `flecha` | `src/lib/datos/iconos.ts:60` |
| En la portada | `src/routes/+page.svelte:140` |
| El test | `tests/mosaico.test.ts:33` · `:40` · `:52` |
| Cómo queda | `capturas/pieza-y-boton-390.png` · `capturas/pieza-y-boton-1280-hover.png` · `capturas/pieza-y-boton-foco.png` |

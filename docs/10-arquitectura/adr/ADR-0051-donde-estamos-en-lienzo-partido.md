---
tipo: adr
id: ADR-0051
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: ADR-0015 (la caja del mapa) · aplica por fin el ADR-0028 al botón primario
implementa: Claude Code
---

# ADR-0051 · «DÓNDE ESTAMOS», en lienzo partido con la marca

## Qué se pidió

> *«Ahora sigue la sección por mejorar "DÓNDE ESTAMOS". Y también todas las fuentes se ven
> alejadas de cómo lo estamos estandarizando. ¿Podrías darme alguna propuesta como hacer un
> split canvas mejorado?»* — Nadir

## Lo que había, medido en el sitio publicado

| Qué | Medida |
|---|---|
| **Sin título** | Era la única sección con ceja y sin título de 22 px |
| **«Cómo llegar» con espaciado de etiqueta** | 2.04 px entre letras en minúsculas de 17 px. Ese espaciado es de las cejas de 13 px en mayúsculas |
| **Una ↗ de texto** | El iPhone la pinta como emoji azul |
| **Horarios desalineados** | La hora de «Lunes a viernes» empezaba en 182 px y las de sábado y domingo en 161: el día iba a `10ch` y ese texto pasa de 10 |
| **«Ver el mapa» parecía un campo de formulario** | Caja de 54 px con borde dorado y un enlace subrayado dentro |
| **Media sección vacía en escritorio** | Esa caja de 54 px flotando en una sección de 291 px |

## Cómo se llegó

Se publicaron dos variantes de lienzo partido con la misma ficha: **A**, con la foto de la
fachada, y **B**, con el mapa como lienzo. Se recomendó A.

Nadir pidió A **con la imagen de su logo en vez de la fachada**, y mandó la pieza «rugged con
banderas». No se tomó, por tres documentos y una duda:

- el [[ADR-0004-identidad-plana|ADR-0004]] la registró como «tratamiento 2 · pieza suelta» y
  dejó fuera del sitio todo lo que no sea el tratamiento plano;
- el [[ADR-0001-lockup-web-y-paleta|ADR-0001]] sacó las banderas de la marca porque «anclan la
  marca a comercio transfronterizo», y su lugar iba a ser importaciones, que salió de la oferta
  con el ADR-0047;
- el [[ADR-0018-la-marca-es-master-sin-s|ADR-0018]] fijó la grafía MASTER, y la pieza dice
  MÁSTER;
- y el uso comercial de la bandera y el escudo nacionales está regulado en México: no se
  comprobó si una página comercial puede mostrarlos.

Se propuso la **opción 2**: la A con **el logo que ya usa el sitio**. Nadir la eligió.

## Lo que se decide

- **Un componente, `Ubicacion`**, en la portada, en contacto —con teléfono— y en las cinco
  líneas —sin título propio, porque su pregunta numerada ya lo es—.
- **El lienzo**: el lockup de la cabecera en grande —monograma plano, MASTER y VALUADORES con
  la regla dorada— sobre acero pavonado. En teléfono, 4:3; desde 768 px, a la izquierda y a toda
  altura.
- **«Ver el mapa» vive dentro del lienzo**: control con contorno dorado. Al tocarlo, el mapa de
  Google cubre el lienzo y el control pasa a «Ocultar el mapa». **El mapa sigue sin pedirse
  hasta que alguien lo abre**, como decidió el ADR-0015.
- **La ficha**: la dirección como título de pieza, los horarios en una rejilla de definición y
  «Cómo llegar» como botón primario de 48 px con la flecha dibujada.
- **El monograma sale a `Monograma.svelte`**: el lienzo lo pinta en grande y dos copias a mano
  del mismo trazo se habrían separado.
- **La banda del pie** pierde el espaciado de etiqueta en «Cómo llegar» y gana la misma flecha
  dibujada.

**Lo que se pierde, dicho:** con el logo, esta sección ya no ayuda a reconocer el local desde la
calle; la fachada queda solo como foto de entrada de la portada. Y el logo se ve dos veces: en la
cabecera y en el lienzo.

## Dos defectos que no eran de esta sección, destapados al hacerla

1. **`Boton.primario` pintaba oro fijo con tinta blanca en el registro claro: 1.75:1.** El
   ADR-0028 había devuelto la acción primaria a carbón con etiqueta blanca, pero el botón seguía
   pintando el oro metálico de cuando todo el sitio era oscuro. Nadie lo vio porque ningún
   primario se dibujaba; «Cómo llegar» es el primero. El relleno pasa a ser rol
   (`--accion-relleno`, `--accion-metal`): **carbón en claro, oro metálico en oscuro**.
   **La maqueta aprobada mostraba el botón en oro, y se implementó en carbón**, por el ADR-0028
   —«el dorado debe reservarse para indicar valor»— y porque el oro sobre la placa clara no
   contrasta en luz: es el mismo problema que el ADR-0046 le resolvió al verde de WhatsApp con un
   marco de carbón. Si se quiere en oro, es una decisión contra el ADR-0028.
2. **Empeño, venta y fletes miden 411–413 px en un teléfono de 390.** Lo desborda el anillo del
   planeta, y los navegadores móviles maquetan esas páginas más anchas y las encogen al 94–95 %.
   Se destapó porque un toque de prueba sobre «Ver el mapa» fallaba: las coordenadas en pantalla
   ya no coincidían con las de la maqueta. **Ya estaba publicado antes de este cambio** y no se
   arregla aquí.

Y uno más, visto de paso: **el botón «Llamar» de contacto lleva a la portada** —`href="/"`— en
vez de llamar. Tampoco se arregla aquí.

## Lo medido, en el sitio construido

| | |
|---|---|
| Tests | **174** · 6 nuevos en `tests/ubicacion.test.ts`, más los de tokens y fugas de los dos componentes nuevos |
| El test caza | **3 de 3 mutantes**: «Ver el mapa» movido a la ficha, la ↗ de vuelta en «Cómo llegar» y una foto en el lienzo |
| Accesibilidad | **18/18 CUMPLE** |
| JavaScript | sin cambio · CA-10 con **35.55 KB** de margen |
| HTML gzip | portada 6.22 → **6.37 KB** · contacto 3.81 → **3.98** · venta 5.52 → **5.64** |
| Disposición | apilado a 390; lado a lado a 768, 1024 y 1280 · portada, contacto y venta |
| «Ver el mapa» | dentro del lienzo, 44 px de alto; la marca no se monta encima, en los doce casos |
| El mapa | **0 peticiones a Google** antes de abrir y 1 al abrir · abierto, cubre el lienzo y el control queda encima diciendo «Ocultar el mapa» |
| Toque real | abre el mapa en portada, contacto, venta y empeño |
| Horarios | una sola columna de horas por página y ancho |
| «Cómo llegar» | 48 px, blanco sobre carbón, abre en otra pestaña |
| Flechas de texto | **0**, en la sección y en la banda del pie |
| Desborde de la sección | **0** en los doce casos |
| Título y teléfono | título solo en portada y contacto; teléfono solo en contacto |
| Cabecera | el monograma sigue en 26×26 con sus dos trazos |
| Banda del pie | «Cómo llegar» a 14 px, sin espaciado de etiqueta, con flecha dibujada y 44 px de alto |

## Lo que queda abierto

- **El reconocimiento del local** que daba la fachada, y que esta versión no da.
- **«Te atendemos por WhatsApp»** sigue con frases enteras en mayúsculas espaciadas.
- **Los dos defectos de arriba y el «Llamar» de contacto**, sin tocar.

## Evidencia

| Qué | Dónde |
|---|---|
| El componente y el título opcional | `src/lib/componentes/Ubicacion.svelte:43` |
| El lienzo, con la marca y el mapa dentro | `src/lib/componentes/Ubicacion.svelte:49` · `:60` · `:83` |
| El anillo de foco blanco sobre acero | `src/lib/componentes/Ubicacion.svelte:95` |
| La bajada a 19 px, texto grande | `src/lib/componentes/Ubicacion.svelte:111` |
| Lado a lado desde 768 | `src/lib/componentes/Ubicacion.svelte:123` |
| El control del mapa y su marco | `src/lib/componentes/Mapa.svelte:54` · `:60` · `:90` · `:109` |
| Horarios en rejilla y «Cómo llegar» | `src/lib/componentes/DatosDelLocal.svelte:62` · `:102` · `:122` |
| El botón externo y el relleno por rol | `src/lib/componentes/Boton.svelte:21` · `:119` · `src/lib/estilos/tokens.css:156` · `:615` |
| El monograma compartido | `src/lib/componentes/Monograma.svelte:17` · `src/routes/+layout.svelte:41` |
| En las tres plantillas | `src/routes/+page.svelte:181` · `src/routes/contacto/+page.svelte:30` · `src/routes/[giro]/+page.svelte:365` |
| La banda del pie | `src/lib/componentes/BandaContacto.svelte:58` · `:115` · `src/lib/datos/iconos.ts:61` |
| El test | `tests/ubicacion.test.ts:32` · `:40` · `:48` · `:58` · `:65` · `:70` |
| Cómo queda | `capturas/ubicacion-390.png` · `capturas/ubicacion-1280.png` · `capturas/ubicacion-venta-390.png` · `capturas/ubicacion-mapa-abierto-390.png` · `capturas/ubicacion-contacto-1280.png` |

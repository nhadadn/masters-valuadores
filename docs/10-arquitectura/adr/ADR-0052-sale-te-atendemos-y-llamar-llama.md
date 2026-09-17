---
tipo: adr
id: ADR-0052
estado: ACEPTADA
fecha: 2026-09-16
decide: Nadir
enmienda: ADR-0048 · ADR-0049 · ADR-0051 (cierra lo que dejaron abierto sobre «Te atendemos por WhatsApp»)
implementa: Claude Code
---

# ADR-0052 · Sale «Te atendemos por WhatsApp», y «Llamar» llama

## Qué se pidió

> *«Siento que esta sección está sobrando conforme lo que vinimos implementando.»* — Nadir,
> con una captura de «Escríbenos por la línea que te toca»

Y después de ver la evidencia y el defecto de «Llamar»: *«Sí, hazlo.»*

## La evidencia, medida en el sitio publicado

| | |
|---|---|
| **Repetía al mosaico, botón por botón** | Sus 5 botones abrían WhatsApp con los **mismos 5 mensajes** que los botones verdes de las piezas —«Hola, escribo por fletes.»—. Los nombres y las frases de cada línea también estaban arriba |
| **Lo que ocupaba** | **895 px** de 4755 en teléfono, casi una quinta parte de la portada; 533 de 3431 en escritorio |
| **Lo que queda sin ella** | «CONTACTO · ¿Tienes una duda? Escríbenos» con su WhatsApp justo debajo, la barra fija en teléfono y el flotante en escritorio |

Los ADR-0048, 0049 y 0051 la habían dejado anotada como repetida y sin decidir.

## Lo que se decide

- **Sale la sección de la portada**, con su CSS. Queda en su lugar un comentario que dice qué
  había y por qué salió.
- **Lo que se pierde, dicho:** la sección se pensó para cuando cada línea tuviera su propio
  número de WhatsApp, como en la referencia del cliente. Hoy hay uno solo. Si llegan números
  por línea, los botones verdes del mosaico son los que los reciben.

## «Llamar» no llamaba

Los tres botones «Llamar» del sitio **no llamaban**: los dos de la portada llevaban a
contacto y el de contacto llevaba a la portada. Quien tocaba «Llamar» rebotaba entre dos
páginas. Eran del tiempo en que el teléfono estaba sin confirmar (D-08), que se cerró sin que
nadie volviera por ellos. Sí llamaban el ícono de la cabecera y el de la barra fija.

- **`enlaceTelefono()`**, hermano de `enlaceWhatsApp()`, arma el `tel:` desde `negocio.ts`,
  igual que la cabecera: el número sin espacios.
- **Los tres botones lo usan.** Sin número confirmado, los de la portada vuelven a mandar a
  contacto y el de contacto no se pinta, porque esa ya es la página de contacto.

## Un tropiezo propio

El primer comentario que dejaba constancia de la sección decía el tamaño con un porcentaje.
El guardia de fugas lo marcó —`tests/sin-fugas.test.ts` no deja cifras con `%` fuera de
`negocio.ts`, y no descuenta los comentarios HTML— y se reescribió en palabras. El guardia
hizo su trabajo.

## Lo medido, en el sitio construido

| | |
|---|---|
| Tests | **178** · 4 nuevos en `tests/llamar-y-whatsapp.test.ts` |
| El test caza | **2 de 2 mutantes**: un «Llamar» que vuelve a mandar a contacto y un botón que repite un mensaje del mosaico |
| Accesibilidad | **18/18 CUMPLE** |
| JavaScript | sin cambio · CA-10 con **35.55 KB** de margen |
| Portada | **3860 px** de alto en teléfono y **2898** en escritorio · sin desborde |
| Secciones | entrada → NUESTRAS LÍNEAS → POR QUÉ AQUÍ → DÓNDE ESTAMOS → CONTACTO |
| WhatsApp en la portada | **9 enlaces**, antes 14 · **5 mensajes y ninguno repetido** |
| «Llamar» | los dos de la portada y el de contacto abren `tel:+528715073005`, 48 px de alto |

## Lo que queda abierto

- **El anillo del planeta** sigue desbordando empeño, venta y fletes en teléfono (ADR-0051).

## Evidencia

| Qué | Dónde |
|---|---|
| Dónde estaba la sección, y por qué salió | `src/routes/+page.svelte:200` |
| El enlace para llamar | `src/lib/datos/telefono.ts:15` |
| Los «Llamar» de la portada | `src/routes/+page.svelte:42` · `:104` · `:221` |
| El «Llamar» de contacto | `src/routes/contacto/+page.svelte:19` · `:29` |
| El test | `tests/llamar-y-whatsapp.test.ts:34` · `:40` · `:44` · `:51` |
| Cómo queda | `capturas/portada-sin-lineas-390.png` |

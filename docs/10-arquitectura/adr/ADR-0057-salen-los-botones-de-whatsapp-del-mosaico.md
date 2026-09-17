---
tipo: adr
id: ADR-0057
estado: ACEPTADA
fecha: 2026-09-17
decide: Nadir
enmienda: ADR-0049 · la pieza sigue llevando a su página; el botón verde de WhatsApp sale
implementa: Claude Code
---

# ADR-0057 · Salen los botones de WhatsApp del mosaico

## Qué se pidió

> *«La parte de los globos de WhatsApp de esta sesión son excesivos, remuévelos.»* — Nadir, con una
> captura del mosaico de la portada en su teléfono y los cinco botones verdes marcados

## Lo que se decide

- **Salen los cinco botones verdes** del mosaico «Elige la línea que buscas». Desde el ADR-0049 cada
  pieza llevaba uno que abría WhatsApp con la línea escrita en el mensaje.
- **La pieza sigue llevando a la página de su línea**, como decidió el ADR-0049. Es ahora su único
  enlace.
- **Sale con ellos su CSS** y los 56 px que el texto les dejaba a la derecha: el título y la frase
  usan todo el ancho de la pieza.
- **WhatsApp sigue en la portada** en la entrada, en la sección de contacto, en la barra fija del
  teléfono y en el botón flotante de escritorio.

## Lo que cuesta

- **La portada se queda sin mensajes escritos.** Los cinco botones eran los únicos WhatsApp de la
  portada que llegaban con la línea ya escrita. Los que quedan abren la conversación en blanco. Fuera
  de la portada siguen los mensajes escritos: los dos botones de la entrada de empeño y los discos del
  planeta en empeño, venta y fletes.
- **El test del ADR-0052 cambia de forma.** Vigilaba que ningún mensaje de WhatsApp se repitiera en
  la portada y exigía que hubiera al menos uno. Sin mensajes, esa exigencia ya no aplica: ahora exige
  que la portada tenga WhatsApp, y sigue vigilando que ningún mensaje se repita.

## Lo medido

Sitio publicado —con los botones— contra el build local.

| | |
|---|---|
| WhatsApp visibles en la portada | **8 → 3** a 390 (entrada, contacto y barra fija) y **8 → 3** a 1280 (entrada, contacto y flotante) |
| Cada pieza del mosaico | **un enlace, a su página**, a 390 y a 1280 |
| Ancho del texto | Empeño **270 → 326 px** a 390, y su frase cabe en un renglón. A 1280, **466 → 522** en las piezas anchas y **183 → 239** en las altas |
| Tests | **182**, los mismos. El del mosaico cambia «solo el botón verde abre WhatsApp» por «ninguna pieza abre WhatsApp», y falla si se vuelve a poner un botón: comprobado |
| Accesibilidad | **18/18 CUMPLE**, con el criterio de desborde del ADR-0056 |
| Inventario tipográfico | ninguna combinación fuera de la escala |
| Desborde de la portada | 390 / 390 y 1280 / 1280 |
| JavaScript | sin cambio · CA-10 con **35.55 KB** de margen |

### Una trampa al capturar

Para la evidencia se emuló una pantalla táctil —`hover: none` y `pointer: coarse`—, porque en
escritorio los botones solo aparecían al pasar el ratón. Aun así, **la captura de página completa
no pintó los botones del sitio publicado**, aunque existían con opacidad 1. La captura de la ventana,
con el mosaico desplazado a la vista, sí los pinta. Las de este ADR son de ventana.

## Evidencia

| Qué | Dónde |
|---|---|
| El mosaico, un solo destino | `src/lib/componentes/MosaicoLineas.svelte:8` · `:38` · `:41` |
| El texto sin la reserva del botón | `src/lib/componentes/MosaicoLineas.svelte:142` |
| El test del mosaico | `tests/mosaico.test.ts:39` |
| El test del ADR-0052 | `tests/llamar-y-whatsapp.test.ts:36` |
| La portada | `src/routes/+page.svelte:144` |
| Cómo queda | `capturas/mosaico-sin-wa-antes-390.png` · `capturas/mosaico-sin-wa-despues-390.png` · `capturas/mosaico-sin-wa-despues-1280.png` |

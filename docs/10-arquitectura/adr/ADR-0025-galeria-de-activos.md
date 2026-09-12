---
tipo: adr
id: ADR-0025
estado: ACEPTADA
fecha: 2026-09-12
decide: Nadir
extiende: ADR-0024
enmienda: ADR-0009
implementa: Claude Code
---

# ADR-0025 · Galería de activos: un solo sistema para las seis categorías

## Qué se pidió

Cohesión visual. Las tarjetas ya eran fotográficas desde el [[ADR-0024-catalogo-visual-y-jerarquia|ADR-0024]],
pero parecían venir de sitios distintos. Nada de estilos nuevos: **un sistema**.

## 1 · El plan que no funcionaba, y cómo se supo

Iba a aplicarse **un grado de color único** a las seis fotografías. Antes de escribirlo
se probaron cuatro grados sobre las dos imágenes más distintas —la joya de estudio
sobre terciopelo negro y el patio a mediodía—:

```
0 · sin grado          1 · fuerte          2 · suave          3 · contraste sin teñir
```

**En los cuatro el cielo del patio seguía azul con nubes blancas.** Y el grado fuerte
apagaba el oro de la joya, que es el color de la marca. Pagaba el precio sin conseguir
el beneficio.

**Lo que separa esas fotos no es el color: es que hay cielo.** Ningún filtro quita un
cielo. La prueba está en `capturas/grados.png`.

## 2 · Lo que sí unifica

| | |
|---|---|
| **La composición** | Misma pieza en las seis: foto a sangre, velo, filo dorado, nombre, microdescripción, flecha. Siempre en el mismo sitio |
| **El encuadre** | La de maquinaria se recortó de nuevo **sin cielo, sin la insignia y sin el panel de especificaciones** de la pieza 23. La ventana limpia es apaisada: 730 × 300, que es justo la forma de una banda |
| **Un grado suave** | `brightness(.9) contrast(1.1) saturate(.94)`. Iguala contraste; **no tiñe** |

La cohesión fotográfica completa **no se puede conseguir con este material** y conviene
decirlo: necesita una sesión. Son dos horas de Cristóbal con un teléfono y un fondo
oscuro.

## 3 · La composición

```
Oro y joyería          ← banda
Relojes  ·  Monedas
Herramienta  ·  Autos
Maquinaria             ← banda
```

Dos bandas más cuatro tarjetas son **8 huecos en dos columnas: cuatro filas exactas**,
sin un boquete. En teléfono, una sola columna.

**Autos va en la retícula y no de banda**, por decisión de Nadir sobre el mockup: sin
fotografía, una banda son cuatrocientos píxeles de rectángulo vacío — era el peor
bloque de la página.

La proporción en teléfono es **16:9 y no 3:2**. Con seis tarjetas a ancho completo, 3:2
llevaba la página a 8 pantallas; el brief pide justo evitar tarjetas demasiado altas.

## 4 · Los rótulos de revisión salen de las tarjetas · enmienda al ADR-0009

«EN SU LETRERO», «FOTO DE ARCHIVO», «FOTO PENDIENTE» son notas para Cristóbal, no
interfaz pública.

**Pero no se borran.** El ADR-0009 obliga a que una foto de banco se sepa, y la
procedencia de cada bien es lo que permite tachar lo que no sea cierto. Bajan a **un
bloque de revisión** al pie de la sección, con el mismo estatus que la banda BORRADOR
de arriba: cuando el sitio deje de ser borrador, se van los dos juntos.

Es una enmienda al ADR-0009, no una derogación: el rótulo cambia de sitio, no
desaparece.

## 5 · Cada tarjeta lleva a WhatsApp, con su categoría escrita

La flecha no es decoración. Quien reconoce su objeto ya tiene la pregunta hecha, y el
mensaje sale redactado con la categoría dentro.

El armado del enlace se extrajo a `$lib/datos/whatsapp`. La alternativa era añadir una
cuarta variante al botón llamada «desnudo» — un botón que finge no serlo, y la
siguiente vez habría una quinta. Lo que las dos piezas comparten de verdad es cómo se
construye la URL y qué pasa si el número no está confirmado. **El número no se escribe
en ningún sitio nuevo**: sale de `negocio.ts`.

## 6 · Las cinco imágenes que llegaron con el encargo

| | Veredicto |
|---|---|
| Cronógrafo dorado | **IA** · subesferas con garabatos donde van cifras |
| Esqueleto oro rosa | **IA** · la marca se lee «D…NSH», romanos deformes |
| **Monedas de oro** | **Real** · cantos estriados regulares, sombras de contacto correctas. **Entra** |
| Dorado con correa negra | **IA** · el texto del dial no forma palabra |
| Mano con joyería | Real, pero **lleva persona** — lo excluye el propio brief |

Cuarta tanda seguida con material generado por IA. El indicio decisivo es siempre el
mismo y se comprueba ampliando: **el texto del dial**. Un dial ilegible en una página
de valuación dice lo contrario de «sabemos tasar».

## Lo medido

| | Antes | Después |
|---|---|---|
| **LCP** | 1324 ms | **1396 ms** |
| Peso | 163 KB | **221 KB** · 0 de terceros |
| Alto en móvil | 6.9 pantallas | **7.8** |
| Enlaces de contacto | 7 | **13** |
| Fotos suyas en la página | 8 | 8 · y una de banco más, para monedas |

Las fotos grandes cuestan 58 KB y casi una pantalla de recorrido. **Es el precio de lo
que se pidió** —«la imagen debe ocupar prácticamente toda la tarjeta»— y se paga en
diferido: todas van con `loading="lazy"` y el LCP no se movió.

### Y un fallo propio que cazó el validador

Los `<span>` de lector de pantalla de cada tarjeta heredaban `--tinta` —negro, en el
registro claro— sobre la tarjeta negra: **1:1 en las tres páginas con bienes**. El
arreglo no fue esconderlos mejor, que habría sido tapar el termómetro: están sobre
campo oscuro, así que les toca la tinta de campo oscuro.

## Lo que sigue faltando

- **Autos no tiene fotografía.** Es la única de las seis con campo de metal.
- **Joyería no tiene página**, y las fotos del patio siguen midiendo entre 440 y 985 px.

## Evidencia

| Qué | Dónde |
|---|---|
| La galería | `src/lib/componentes/GaleriaBienes.svelte` |
| El enlace de WhatsApp, en un solo sitio | `src/lib/datos/whatsapp.ts` |
| Composición y bandas | `src/lib/datos/giros.ts` · campo `banda` |
| El bloque de revisión | `src/routes/[giro]/+page.svelte` |
| La prueba de los cuatro grados | `capturas/grados.png` |
| Accesibilidad | 16/16 CUMPLE · contraste 0 hallazgos · 131 tests · CA-10 cumplido |

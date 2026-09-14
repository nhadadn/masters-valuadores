---
tipo: adr
id: ADR-0027
estado: ACEPTADA
fecha: 2026-09-14
decide: Nadir
enmienda: CLAUDE.md · «lo que SÍ se puede redactar»
implementa: Claude Code
---

# ADR-0027 · Fuera las marcas de borrador, y los bienes suben a la entrada

## Qué se pidió

> *«Necesitamos remover todas las bandas de borrador y aprovechar ese espacio para lo
> ya establecido. La sección de bienes 14 debería de ir entre el 10 y 11.»* — Nadir

## Esto choca con el contrato, y por eso se preguntó

El `CLAUDE.md` dice, en «Lo que SÍ se puede redactar»:

> **Siempre**: marcado como **propuesta** para que el cliente corrija, nunca publicado
> como hecho. La regla operativa: un formulario en blanco no regresa; un borrador
> regresa marcado.

Se paró y se preguntó, que es lo que ese archivo manda. **Nadir eligió quitar todas las
marcas visibles**, con las tres opciones y su costo delante. Queda escrito aquí porque
enmienda una regla del contrato, no porque fuera una decisión de estilo.

### Lo que había, y qué se fue

| | Antes | Ahora |
|---|---|---|
| Banda amarilla de borrador | 2 páginas | **0** |
| Bloque de revisión | 1 | **0** |
| Huecos «PENDIENTE» | 5 por página | **0** |
| `__POR_CONFIRMAR__` **visibles** | 26 en empeño | **0** |
| `__POR_CONFIRMAR__` en el JSON-LD | — | **23** · siguen ahí |

## Una cosa que dije mal y corrijo

Al ofrecer la opción escribí que *«el build de producción dejaría de fallar por datos
que siguen sin existir»*. **Es falso.** El centinela vive en `negocio.ts` y lo lee
`jsonld.ts:39`; quitar el componente que lo pinta no toca el dato.

Comprobado después del cambio: `npm run build` **sigue saliendo con código 1**. La red
de seguridad no se fue — lo que se fue es que se vea.

## Qué se llevó por delante

Tres bloques eran **solo** marca de borrador, así que salieron enteros:

- **El bloque de cifras** (`PORCENTAJE, PLAZO Y TASA`): el rótulo y el centinela.
- **La sección «¿Qué necesito llevar?»**: un hueco y nada más.
- **El acordeón «¿Puedo recuperar mi bien?»**: cuatro preguntas y **ni una respuesta
  escrita**. Un acordeón que no abre nada no es una sección, es un decorado.

Y la sección de bienes pasa a ser **condicional**: un giro sin bienes —taller— pintaba
cuatro huecos «BIEN ACEPTADO — PENDIENTE». Ahora simplemente no la tiene. Una sección
vacía no informa; informa su ausencia.

Quedan tres preguntas numeradas, no cinco, y se renumeraron.

## El orden nuevo

La sección 14 sube **entre la tira de pasos (10) y los botones (11)**, tal cual se
pidió. Eso parte la entrada en dos: arriba etiqueta, titular, promesa y tira; abajo
—después de los bienes— botones, foto y banda de monedas.

Medido a 390 px con pliegue de 844:

```
h1 170 · promesa 215 · tira 286 · PLANETA 607        ← todo sobre el pliegue
consulta 991 · botones 1241 · foto 1365              ← debajo
```

El botón de la entrada cae de 523 a 1241 px, que es lo que se avisó. **La barra fija
sigue en pantalla siempre**, así que la página nunca se queda sin llamada a la acción.
A cambio, el planeta ahora asoma en la primera pantalla.

**La foto de entrada deja de ser `prioritaria`.** Lo era por ser el elemento LCP cuando
abría la página; a 1365 px, pedirla con prisa sería adelantar algo que nadie ve.

## Lo medido

| | Antes | Después |
|---|---|---|
| **LCP** (intercalado, 3 vueltas) | 4493 ms | **2907 ms** |
| Alto en móvil | 6.8 pantallas | **5.1** |
| Huecos visibles en la 1.ª pantalla | 8 | **0 de 0** |
| Peso | 173.5 KB | 219.7 KB |
| Accesibilidad | 16/16 | **16/16** |

131 tests · contraste 0 hallazgos · CA-10 cumplido con 28.81 KB de margen.

El LCP suelto daba 3848 ms y parecía una regresión. **Intercalado contra lo publicado,
gana las tres vueltas por 1.6 s.** Es el tercer ADR seguido en que una cifra suelta de
esta máquina miente; ya no se declara ninguna sin intercalar.

## Un error propio, y cómo se vio

Al recortar el bloque de revisión, el índice de fin saltó a un `{/if}` posterior y **se
llevó la segunda mitad de la entrada entera** — botones, foto y banda de monedas. No lo
dijo una prueba: lo dijo que `.acciones` y `.foto-giro` aparecieran como CSS muerto y
que el presupuesto de JS subiera de golpe a 36 KB de margen. Se recuperó de `git show
HEAD:` y se recolocó.

## Consecuencias

- **El mapa de la pantalla cambió** y se regeneró: quedan 25 piezas de 30. Los números
  **no se renumeran** —ya son vocabulario— y los cinco vacantes no se reutilizan.
- **AMPLIADO el mismo día a `/contacto/` y las legales**, por decisión de Nadir. Ver
  abajo: una de mis dos objeciones resultó falsa y la otra se cumplió.
- El sitio **parece terminado y no lo está**: faltan la tasa, el plazo, la razón social
  y 27 huecos de copy. Eso ya no se ve en pantalla; sigue en `decisiones-pendientes.md`
  y en el build que falla.

## Ampliación · contacto y legales

Se había objetado que quitarlas publicaría *«un formulario que no va a ninguna parte y
páginas legales vacías»*. Con el código delante, **una de las dos objeciones era falsa**:

**No había formulario.** `formularioListo` es falso mientras D-13 siga abierta, así que
lo único que se pintaba en esa sección era el bloque «BLOQUEADO POR D-13» explicando por
qué no lo hay. Era marca de borrador de principio a fin. Salió la sección entera, y
contacto se queda con lo que siempre fue real: WhatsApp, teléfono, mapa, dirección y
horarios — 277 caracteres de contenido de verdad.

**La otra objeción sí se cumplió.** Medido en el HTML construido:

| | Texto en `<main>` |
|---|---|
| `/contacto/` | **277 caracteres** |
| `/aviso-de-privacidad/` | **54** · migas, la etiqueta LEGAL y el título |
| `/terminos/` | **32** |

Las dos legales son ahora **páginas en blanco con título**, enlazadas desde el pie de
las ocho. No se tocó nada más porque no se pidió: quitar el enlace del pie, o quitar
las páginas del inventario, son decisiones aparte.

### Estado final, las ocho páginas

```
banda 0 · pendiente 0 · bloqueado 0 · centinela visible 0     en las OCHO
npm run build → código 1                                     la red sigue puesta
```

## Evidencia

| Qué | Dónde |
|---|---|
| La entrada partida y el orden nuevo | `src/routes/[giro]/+page.svelte` |
| La banda fuera | `src/routes/+page.svelte` · `[giro]/+page.svelte` |
| El pie sin centinelas visibles | `src/routes/+layout.svelte` |
| El mapa al día | `docs/60-diseno/mapa-de-la-pantalla.md` |
| El build sigue fallando | `npm run build` → código 1 |

---
tipo: adr
id: ADR-0017
estado: ACEPTADA
fecha: 2026-09-11
decide: Nadir
enmienda: ADR-0013-sin-dominio-no-se-indexa
implementa: Claude Code
---

# ADR-0017 · Tener dominio y estar indexable dejan de ser lo mismo

## De dónde sale

De intentar cerrar D-07. Al preguntar qué hacía falta para el dominio, apareció que
cerrarlo tenía un efecto que nadie había pedido: **encender la indexación**.

## Qué estaba mal en el ADR-0013

El [[ADR-0013-sin-dominio-no-se-indexa|ADR-0013]] ató las dos cosas con un argumento
que sonaba bien:

> «**Se abre solo.** El día que alguien escriba el dominio en `negocio.ts`, los tres
> archivos se invierten sin tocar una línea más. No hay una segunda tarea que
> recordar.»

Eso era elegante y era un error de diseño. **Son dos cosas distintas que hoy
coinciden**, y confundirlas se le vuelve en contra a su propio motivo:

| | Qué significa |
|---|---|
| Tener dominio | Saber cuál es la dirección buena del sitio |
| Estar indexable | Que el CONTENIDO merezca que Google lo enseñe |

El ADR-0013 existe para que Google no conozca el sitio hecho un borrador. Pero el día
que se compre el dominio, el sitio **seguirá siendo un borrador**: 27 huecos
etiquetados, marcas `__POR_CONFIRMAR__` a la vista y una banda que dice BORRADOR en
las ocho páginas. Atados, comprar el dominio le enseñaría a Google exactamente lo que
ese ADR quería esconder.

La regla se habría vuelto en contra de sí misma, y en el peor momento: el día que
alguien hace una gestión administrativa —pagar un dominio— sin pensar que está
publicando nada.

## Qué se decide

**Se separan.** `INDEXACION_ABIERTA` en `src/lib/seo/enlaces.ts:62` es ahora un
interruptor explícito, y `seIndexa` exige las dos cosas.

| | Sin dominio | Con dominio, cerrado | Con dominio, abierto |
|---|---|---|---|
| Canónica | no | **sí** | sí |
| `og:url` y `og:image` | vista previa | **dominio real** | dominio real |
| `robots` de la página | noindex | noindex | `index, follow` |
| `robots.txt` | Disallow | Disallow | Allow |
| `sitemap.xml` | vacío | vacío | 6 URLs |

**La columna del medio es la que se gana.** Con el dominio puesto y la indexación
cerrada, todo el trabajo de la [[SPEC-0003-descubribilidad|SPEC-0003]] queda correcto
y apuntando a la dirección de verdad, listo para el día que se abra — pero Google
sigue sin ver el borrador.

## Lo que esto cuesta

**Vuelve la segunda tarea que el ADR-0013 quería evitar.** Alguien tiene que abrir el
interruptor a mano, y si se olvida, el sitio queda invisible sin que nada proteste. Es
el mismo modo de fallo que aquel ADR ya tenía anotado —«un sitio invisible»— solo que
ahora depende de una decisión y no de un dato.

Se acepta porque los dos fallos no son simétricos: un sitio que tarda una semana de
más en indexarse se arregla abriendo el interruptor; un borrador indexado se arrastra
durante meses.

## Y hay un segundo cerrojo que vive fuera del código

`vercel.json` manda `X-Robots-Tag: noindex, nofollow` en todas las respuestas
(ADR-0016). Es una cabecera de servidor: **gana sobre cualquier etiqueta del HTML**.

Si alguien pone el interruptor en `true` y no la quita, el sitio sigue sin indexarse y
el síntoma es «lo abrimos y Google no hace nada» — semanas para descubrir por qué.

Eso no se arregla con un comentario, así que hay un test que cruza los dos y obliga a
que digan lo mismo. **Comprobado**: con `INDEXACION_ABIERTA = true` y `vercel.json`
sin tocar, la prueba falla diciendo exactamente qué falta.

## Cómo se abre, el día que toque

1. `negocio.dominio` deja de ser `__POR_CONFIRMAR__` — cierra D-07.
2. `INDEXACION_ABIERTA = true` en `src/lib/seo/enlaces.ts`.
3. Quitar el bloque `headers` de `vercel.json`.
4. `npm test` — si falta el paso 3, no pasa.

## Evidencia

| Qué | Dónde |
|---|---|
| El interruptor y `seIndexa` | `src/lib/seo/enlaces.ts:62` |
| `robots` de cada página | `src/lib/componentes/Meta.svelte:46` |
| Los tres estados, probados | `tests/seo.test.ts` · CA-S5 |
| El cruce con `vercel.json` | `tests/seo.test.ts` · probado en los dos sentidos |

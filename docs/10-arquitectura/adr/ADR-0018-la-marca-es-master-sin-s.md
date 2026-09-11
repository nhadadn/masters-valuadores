---
tipo: adr
id: ADR-0018
estado: ACEPTADA
fecha: 2026-09-11
decide: Cristóbal, transmitido por Nadir
revierte: ADR-0004-identidad-plana (solo la grafía)
implementa: Claude Code
cierra: D-01a
---

# ADR-0018 · La marca se escribe MASTER, sin S

## Qué se decide

> *«¿Master o Masters? Es MASTER.»* — Cristóbal, vía Nadir, 11 de septiembre de 2026.

`negocio.nombreComercial` pasa de `MASTERS` a `MASTER`. **Revierte la grafía** que el
[[ADR-0004-identidad-plana|ADR-0004]] había cerrado el 10 de septiembre siguiendo el
logotipo.

## La evidencia le daba la razón al cliente

De los cuatro lugares donde la marca está escrita, **tres van sin S**:

| Dónde | Cómo aparece |
|---|---|
| Su ficha de Google | `Master valuadores` |
| Su correo publicado | `mastervaluadores@outlook.com` |
| Su Facebook, en el propio letrero | `MASTER VALUADORES` |
| **Su logotipo** | `MASTERS VALUADORES` ← el único con S |

El ADR-0004 se apoyó en el logotipo, que era la fuente más visible el 10 de
septiembre. Entre ese día y este entraron dos fuentes más —la ficha de Google y el
letrero completo de la fachada— y las dos van sin S.

Lo que se gana es **consistencia de NAP**: el nombre tiene que ser idéntico en todas
partes para que Google entienda que hablan del mismo negocio, y ahora lo es en cuatro
de cinco lugares en vez de en uno.

## Lo que queda desalineado, y no se arregla

**El logotipo de su propia fachada dice MASTERS.** Esa foto es el héroe de la portada
y la imagen de la tarjeta de WhatsApp. El sitio va a decir MASTER junto a una imagen
que dice MASTERS.

**No se retoca la foto.** Es la única fotografía real que existe del negocio y
alterarle el letrero sería falsificar su local — justo lo contrario de por qué esa
foto vale lo que vale. Se resuelve el día que cambien el letrero, o no se resuelve.

### Los `alt` siguen diciendo MASTERS, y es correcto

```
alt: 'Fachada del local en Torreón, con el letrero MASTERS VALUADORES a la vista'
```

Un `alt` describe **la imagen**, no la empresa. Quien no ve la pantalla tiene derecho
a saber qué dice ese letrero, que es MASTERS. Cambiarlo a MASTER sería describir mal
la fotografía a la única persona que no puede comprobarlo.

Son las dos únicas apariciones de `MASTERS` que quedan en el sitio construido.
Verificado: 15 `MASTER` y 2 `MASTERS`, y los dos son esos `alt`.

## Lo que este ADR NO cierra

**D-01 eran dos preguntas y solo se contestó una.**

| | Estado |
|---|---|
| a) Cuál se **lee en el sitio** | **CERRADA** · MASTER |
| b) La **razón social** del acta | **ABIERTA** · `nombreLegal` sigue en `__POR_CONFIRMAR__` |

La razón social es la del acta constitutiva —algo como «… S.A. de C.V.»— y no la
decide el gusto: la dice un documento. Sigue bloqueando la publicación, y es una de
las tres marcas que quedan en el grafo.

## El costo de haber cerrado esto tarde

Casi ninguno, y conviene decir por qué: **cambió una sola línea**. La regla de que
ningún componente escribe un dato de negocio —`negocio.ts` como fuente única— hizo
que la grafía se propagara sola a los ocho títulos, las ocho descripciones, el
encabezado, el pie, la tarjeta de enlace y el grafo JSON-LD.

Si el nombre se hubiera escrito a mano en cada plantilla, esto habría sido una
cacería por veinte archivos con la garantía de olvidar alguno. Es el primer retorno
medible de esa regla.

## Evidencia

| Qué | Dónde |
|---|---|
| La grafía | `src/lib/config/negocio.ts:88` |
| Los `alt` que conservan MASTERS a propósito | `src/lib/seo/enlaces.ts:137` y `src/routes/+page.svelte:116` |
| Propagación verificada | `build/index.html` · 15 MASTER, 2 MASTERS (los dos `alt`) |
| Títulos siguen cabiendo | `tests/seo.test.ts` · CA-S1, 60 caracteres |

---
tipo: adr
numero: 5
estado: ACEPTADA — decisión de trabajo de Nadir, sin confirmación del cliente
fecha: 2026-09-10
decide: Nadir (trabajo) · Cristóbal (marca, pendiente)
relacionados: ["ADR-0001-lockup-web-y-paleta", "ADR-0004-identidad-plana"]
---

# ADR-0005 · Cuál de los dos amarillos del cliente es el acento del sistema

**Estado:** ACEPTADA el 10 de septiembre **como decisión de trabajo de Nadir**, para
que la Fase 0 no arranque sobre un acento que va a cambiar.

No es autorización del cliente. Cristóbal no ha visto ni aprobado este cambio: la
marca es suya y **D-14 sigue abierta**. Si él elige quedarse en `#E7C041`, revertir
cuesta tres tokens y una republicación del lienzo — y por eso se decide ahora y no
después de pintar nueve páginas.

## Contexto

El [[ADR-0004-identidad-plana|ADR-0004]] fijó que la identidad del sitio es la plana
negro + amarillo, y tomó el acento `#E7C041` de las publicaciones de **maquinaria**.
Esa medición sigue siendo válida y es la más limpia que tenemos: arte plano, dos piezas
independientes, mismo valor en ambas.

Lo que el ADR-0004 no resolvió es que el material del cliente contiene **dos amarillos**,
no uno, y que el que se eligió pertenece a una sola de las ocho líneas de negocio.

## Lo que se midió

| Pieza del cliente | Moda | Cómo está hecha |
|---|---|---|
| Post de maquinaria · 1 | `#E7C041` | arte plano |
| Post de importaciones · 2 | `#E7C041` | arte plano · mismo valor |
| Logotipo de joyería · monograma | `#B58000` | degradado metálico |
| Logotipo de joyería · texto | `#B58000` | degradado metálico |
| Logo rugged con banderas | `#B57700` | degradado metálico |

Son dos familias distintas y las dos son suyas. La primera está **mejor medida**
(arte plano, sin degradado que interpretar). La segunda está **mejor atestiguada**
(tres piezas, dos líneas de negocio).

## Contraste calculado

Todos los ratios son WCAG 2.1, calculados, no estimados.

| Par | Ratio | Veredicto |
|---|---|---|
| `#E7C041` como relleno o texto sobre blanco | 1.75:1 | **Falla** 3:1 |
| `#E7C041` con etiqueta `#0C0D0F` encima | 11.12:1 | Pasa AA |
| `#9A7A22` (borde del acento industrial) sobre blanco | 4.05:1 | Pasa 3:1 · **falla** texto AA |
| `#B58000` como relleno sobre blanco | 3.47:1 | Pasa 3:1 |
| `#B58000` como relleno sobre `crema-050` | 3.02:1 | Pasa 3:1, sin margen |
| `#B58000` con etiqueta `#0C0D0F` encima | 5.60:1 | Pasa AA |
| `#8C6300` como **texto** sobre blanco | 5.38:1 | Pasa AA |
| `#D6A52F` sobre `#0C0D0F` | 8.59:1 | Pasa AA |

De la tabla salen dos capacidades que el oro tiene y el amarillo industrial no:
**puede ser un bloque suelto sobre fondo claro**, y **puede ser texto**.

## Las tres direcciones evaluadas

| | Acento | Cubre bien | Costo |
|---|---|---|---|
| **A · Industrial** | `#E7C041` | maquinaria, importaciones, taller, fletes, renta — 5 de 8 | El acento nunca puede ir solo sobre claro |
| **B · Valuación** | `#B58000` + `#D6A52F` + `#8C6300` | joyería, empeño, financiera, valuadores, y las pesadas sin voltaje | Se aleja del amarillo que hoy publica en maquinaria |
| **C · Dos registros** | oro en la espina, `#E7C041` por sección pesada | los 8 giros | Dos juegos de reglas que hay que sostener siempre |

Lienzo con las tres, la misma sección pintada en cada una y las tablas completas:
[[60-diseno/sistema-de-diseno|sistema de diseño]] → anexo *Tres paletas*.

## Recomendación

**B**, con la puerta de C abierta: el oro corporativo como acento del sistema, y el
amarillo industrial conservado como posible acento de sección para las líneas pesadas
más adelante.

La razón no es de gusto. El sitio tiene que atender a alguien que llega buscando
joyería, empeño o un avalúo tanto como a quien busca una retroexcavadora. El amarillo
de señalamiento sirve al segundo y le resta al primero; el oro no le resta a ninguno.
Y en términos de sistema, el oro entrega dos herramientas que hoy no existen: bloque
sobre claro sin muleta, y texto en color de acento.

Ir a C completo desde el arranque es una promesa que se rompe en el primer descuido.

## Qué cambia si se acepta

- El ADR-0004 **se enmienda, no se revierte**: la identidad plana sigue gobernando y
  `MASTERS` sigue siendo la grafía comercial. Cambia el valor del acento.
- Se reemplazan tres tokens en la hoja de Color del sistema: `--oro-500` → `#B58000`,
  `--oro-700` → `#8C6300`, y nace `--oro-300` → `#D6A52F` para superficies oscuras.
- No se mueve nada más: tipografía, escala, espacio, radios, foco y objetivos táctiles
  quedan igual.
- El monograma no cambia de forma, solo de oro. El vectorial sigue pendiente (D-06).

## Qué NO resuelve

- Sigue sin haber vectorial. Cualquier hex final es provisional hasta que llegue.
- `#B58000` sale de arte con degradado metálico. La moda es sólida, pero elegir un
  valor único de una familia con degradado es un **criterio**, no una lectura directa.
  Queda registrado como decisión, no como medición.
- Si Cristóbal elige A, no se pierde nada de lo hecho: A es el sistema publicado y
  sigue vigente sin tocar una línea.

## Consecuencias — lo que ya se hizo el 10 de septiembre

| Qué | Dónde |
|---|---|
| `--oro-500` `#E7C041` → `#B58000`, `--oro-700` `#9A7A22` → `#8C6300`, nace `--oro-300` `#D6A52F` | `diseno/sistema/Color.dc.html` |
| Reglas del acento: de dos a tres, porque el bloque ya no necesita muleta y ahora se puede escribir en oro | `diseno/sistema/Color.dc.html` |
| Botón de acento sin borde obligatorio | `diseno/sistema/Botones.dc.html` |
| Monograma y lockups recoloreados | `diseno/sistema/Main.dc.html`, `static/marca/monograma-reconstruido.svg` |
| Prompt maestro rebaseado — **arrastraba todavía la rampa de acero anterior al ADR-0004** | `docs/60-diseno/prompt-claude-design.md` |
| Hoja del sistema actualizada | `docs/60-diseno/sistema-de-diseno.md` |

[[20-specs/SPEC-0001-armazon-fase-0|SPEC-0001]] no cambia: sus criterios de aceptación
hablan de tokens, no de valores.

## Riesgo asumido

Si Cristóbal elige `#E7C041` en la junta, se revierten esos seis archivos. Es barato
hoy y caro después de la Fase 0. Se asume a sabiendas.

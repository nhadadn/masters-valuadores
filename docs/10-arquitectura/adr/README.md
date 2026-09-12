---
tipo: indice
---

# Registro de decisiones de arquitectura

Un ADR por decisión que cueste revertir. Se numeran correlativo y no se borran:
una decisión mala documentada vale más que una buena olvidada.

| # | Decisión | Estado | Fecha |
|---|---|---|---|
| 0001 | [[ADR-0001-lockup-web-y-paleta\|Lockup web derivado del logo, y de dónde sale la paleta]] | PROPUESTA | 2026-09-08 |
| 0002 | [[ADR-0002-tipografia\|Una sola familia tipográfica, autoalojada — Archivo]] | **ACEPTADA** | 2026-09-10 |
| 0003 | [[ADR-0003-alcance-multigiro\|El sitio es multigiro bajo la marca MÁSTER]] | **ACEPTADA** | 2026-09-09 |
| 0004 | [[ADR-0004-identidad-plana\|La identidad del sitio es la plana negro y amarillo]] | **ACEPTADA** · enmendada por 0005 | 2026-09-10 |
| 0005 | [[ADR-0005-acento-corporativo\|Cuál de los dos amarillos del cliente es el acento del sistema]] | ACEPTADA (trabajo) · **en revisión por 0006** | 2026-09-10 |
| 0006 | [[ADR-0006-el-amarillo-vive\|El amarillo plano no era de maquinaria: es de toda la marca]] | **ACEPTADA** · revierte el 0005 | 2026-09-10 |
| 0007 | [[ADR-0007-lenguaje-visual\|El lenguaje visual sale de sus piezas, no de mi gusto]] | **ACEPTADA** · §3 y §4 enmendados por SPEC-0002 | 2026-09-10 |
| 0008 | [[ADR-0008-alcance-de-cuatro-giros\|El sitio se enfoca en cuatro giros, y maquinaria cambia de negocio]] | **ACEPTADA** · enmienda el 0003 | 2026-09-10 |
| 0009 | [[ADR-0009-fotografia-de-banco\|Entran fotografías de banco, como provisionales]] | **ACEPTADA** · revierte en parte el 0007 | 2026-09-10 |
| 0010 | [[ADR-0010-degradados-de-superficie\|El fondo deja de ser blanco, y el acero vuelve con fuente]] | **ACEPTADA** · enmienda el 0004 | 2026-09-10 |
| 0011 | [[ADR-0011-entrada-oscura\|La entrada va en oscuro]] | **ACEPTADA** · se aparta de sus piezas, con la razón escrita | 2026-09-10 |
| 0012 | [[ADR-0012-tema-oscuro\|El sitio entero va en oscuro]] | **ACEPTADA** · extiende el 0011 · **riesgo de luz solar sin medir** | 2026-09-10 |
| 0013 | [[ADR-0013-sin-dominio-no-se-indexa\|Mientras no haya dominio, el sitio no se deja indexar]] | **ACEPTADA** · **enmendada por el 0017**: ya no se abre sola | 2026-09-11 |
| 0014 | [[ADR-0014-alinearse-a-la-categoria-de-google\|El sitio se alinea con la categoría que Google ya les puso]] | **ACEPTADA** · enmienda el 0008 · abre D-18 | 2026-09-11 |
| 0015 | [[ADR-0015-mapa-incrustado\|Entra el mapa de Google incrustado]] | **ACEPTADA** · **primer tercero del sitio · 643.8 KB medidos** | 2026-09-11 |
| 0016 | [[ADR-0016-despliegue-de-vista-previa\|El borrador se cuelga en Vercel, sin dejar de ser borrador]] | **ACEPTADA** · enmienda el 0013 | 2026-09-11 |
| 0017 | [[ADR-0017-indexacion-separada-del-dominio\|Tener dominio y estar indexable dejan de ser lo mismo]] | **ACEPTADA** · enmienda el 0013 · **D-07 ya no enciende la indexación** | 2026-09-11 |
| 0018 | [[ADR-0018-la-marca-es-master-sin-s\|La marca se escribe MASTER, sin S]] | **ACEPTADA** · revierte la grafía del 0004 · cierra D-01a | 2026-09-11 |
| 0019 | [[ADR-0019-dos-registros-y-metal\|Dos registros, como su marca · y el oro vuelve a ser metal]] | **ACEPTADA** · enmienda el 0012 · recupera la rampa del 0010 | 2026-09-11 |
| 0020 | [[ADR-0020-crema-calida-y-marmol\|El registro claro se vuelve cálido, y empeño se viste de mármol]] | **ACEPTADA** · extiende el 0019 | 2026-09-11 |
| 0021 | [[ADR-0021-javascript-en-una-sola-ruta\|Entra JavaScript, en una sola ruta y sin marco]] | **ACEPTADA** · **rompe el «cero JS» en 1 de 8 páginas, a propósito** | 2026-09-11 |
| 0022 | [[ADR-0022-reticula-de-fotos-reales\|Retícula de fotos reales en empeño, y por qué no es un carrusel]] | **ACEPTADA** · extiende el 0009 · **§1 revertido por el 0023** · **entran 5 fotos SUYAS** | 2026-09-11 |
| 0023 | [[ADR-0023-carrusel-curvo\|El carrusel curvo en 3D, y el LCP que estaba roto detrás]] | **ACEPTADA** · revierte el §1 del 0022 · **LCP −1 s: la foto de entrada era perezosa** | 2026-09-12 |

El 0005 se aceptó por la mañana como decisión de trabajo. Por la tarde llegaron cinco
publicaciones vivas del cliente y **desmintieron la premisa en la que se apoyaba**: el
amarillo plano no es de maquinaria, es de toda la marca. El 0006 propone revertir.
Ninguno de los dos se borra — una decisión mala documentada vale más que una buena
olvidada, y el 0005 explica por qué se creyó lo que se creyó.

Las decisiones abiertas están en
[[decisiones-pendientes]]; cada una que se cierre nace aquí como ADR.

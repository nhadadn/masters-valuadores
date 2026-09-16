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
| 0024 | [[ADR-0024-catalogo-visual-y-jerarquia\|La landing de empeño se reordena: promesa arriba y catálogo visual]] | **ACEPTADA** · extiende el 0022 · **entra la primera foto suya de joyería** | 2026-09-12 |
| 0025 | [[ADR-0025-galeria-de-activos\|Galería de activos: un solo sistema para las seis categorías]] | **ACEPTADA** · extiende el 0024 · **enmienda el 0009: el rótulo de archivo cambia de sitio** · **§3 revertido por el 0026** | 2026-09-12 |
| 0026 | [[ADR-0026-planeta-de-bienes\|Los bienes en órbita, con la M al centro]] | **ACEPTADA** · revierte el §3 del 0025 · **`will-change` lo empeora 4×, medido** | 2026-09-12 |
| 0027 | [[ADR-0027-fuera-las-marcas-de-borrador\|Fuera las marcas de borrador, y los bienes suben a la entrada]] | **ACEPTADA** · **enmienda el CLAUDE.md** · el sitio parece terminado y no lo está | 2026-09-14 |
| 0028 | [[ADR-0028-la-piedra-clara\|El sitio se invierte: piedra clara, carbón de ancla]] | **ACEPTADA** · **revierte el 0011 y el 0012** · entra textura fotográfica de 10.7 KB | 2026-09-14 |
| 0029 | [[ADR-0029-una-serif-para-el-titular\|Entra una serif, y solo para el titular]] | **ACEPTADA** · **enmienda el 0002: dos familias** · sale de medir tres referencias reales | 2026-09-14 |
| 0030 | [[ADR-0030-la-piedra-como-sujeto\|La piedra como sujeto, no como papel pintado]] | **ACEPTADA** · **enmienda el 0028** · completa la reversión del 0012 · siete páginas ganan contraste | 2026-09-14 |
| 0031 | [[ADR-0031-blanco-puro-de-base\|Blanco puro de base]] | **ACEPTADA** · **enmienda el 0020 y el 0028** · cierra los tres cambios del 0029 · el oro cruza 4.5:1 sobre la base | 2026-09-14 |
| 0032 | [[ADR-0032-la-foto-sale-del-marco\|La foto sale del marco, y no entra una galería]] | **ACEPTADA** · extiende el 0031 · **6 de 7 imágenes aportadas eran generadas** · entra el original 1206×1518 | 2026-09-15 |
| 0033 | [[ADR-0033-secuencia-de-joyeria\|La secuencia de joyería, y el tercer WhatsApp que sobraba]] | **ACEPTADA** · **corrige el 0024: `bien-joyeria` y `bien-oro` son la MISMA foto** · carrusel multi-instancia · la página crece a 6.4 pantallas | 2026-09-15 |
| 0034 | [[ADR-0034-entran-imagenes-generadas\|Entran imágenes generadas, como referencia]] | **ACEPTADA** · **revierte el «van fotos suyas o va hueco» del 0007** · objeción registrada · a tamaño de publicación los defectos NO se ven | 2026-09-15 |
| 0035 | [[ADR-0035-monedas-y-el-piso-tactil\|Monedas en la secuencia, y el piso táctil que llevaba roto]] | **ACEPTADA** · extiende el 0034 · **el objetivo táctil de 44 px llevaba roto desde el 0023** · quinto fantasma de LCP | 2026-09-15 |
| 0036 | [[ADR-0036-fuera-el-panel-de-consulta\|Fuera el panel de consulta: había demasiado «contáctanos»]] | **ACEPTADA** · **revierte en parte el 0024** · 14 puntos de contacto medidos · los bloques de contacto bajan de 3 a 2 | 2026-09-15 |
| 0037 | [[ADR-0037-una-seccion-para-las-dos-tiras\|Una sola sección para las dos tiras]] | **ACEPTADA** · **enmienda el 0033** · la dirección la fijó el 0022: el patio no sube al mármol | 2026-09-15 |
| 0038 | [[ADR-0038-fuera-la-segunda-mitad-de-la-entrada\|Fuera la segunda mitad de la entrada, y con ella la banda de monedas]] | **ACEPTADA** · **retira de hecho el 0021** · el JS de empeño cae de 12.10 a 4.54 KB gzip | 2026-09-15 |
| 0039 | [[ADR-0039-el-carrusel-avanza-solo\|El carrusel avanza solo, y sin puntos]] | **ACEPTADA** · **enmienda el 0023 y el 0035** · dos clases de parada por la WCAG 2.2.2 · el script nuevo pesa menos que el viejo | 2026-09-15 |
| 0040 | [[ADR-0040-css-podado-y-la-pausa-que-nunca-existio\|CSS podado, y la pausa del planeta que nunca existió]] | **ACEPTADA** · **corrige el 0026: su pausa nunca llegó al build** · 24 selectores a 0 · CSS servido idéntico | 2026-09-15 |

El 0005 se aceptó por la mañana como decisión de trabajo. Por la tarde llegaron cinco
publicaciones vivas del cliente y **desmintieron la premisa en la que se apoyaba**: el
amarillo plano no es de maquinaria, es de toda la marca. El 0006 propone revertir.
Ninguno de los dos se borra — una decisión mala documentada vale más que una buena
olvidada, y el 0005 explica por qué se creyó lo que se creyó.

Las decisiones abiertas están en
[[decisiones-pendientes]]; cada una que se cierre nace aquí como ADR.

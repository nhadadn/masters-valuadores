---
tipo: evidencia
estado: vigente
fecha: 2026-09-10
fuente: foto de la fachada entregada por el cliente
archivo: static/fotos/fachada-1600.jpg
---

# Lo que dice la fachada

El 10 de septiembre el cliente entregó la foto de su local. Es el activo que llevaba
todo el proyecto pendiente, y además **contradice o adelanta seis decisiones abiertas**.
Esto es lectura directa del letrero, no interpretación.

## Lo que está escrito en el letrero

| Dónde | Texto literal |
|---|---|
| Rótulo principal | **EMPEÑO, COMPRA Y VENTA** / **MAQUINARIA, HERRAMIENTAS, AUTOS Y MÁS…** |
| Insignia 1 | COMPRA Y VENDE AL MEJOR PRECIO |
| Insignia 2 | VALUACIONES CONFIABLES |
| Insignia 3 | **CONTENEDORES MARÍTIMOS** |
| Insignia 4 | SEGUROS Y RESISTENTES |
| Contacto | WhatsApp **871 507 3005** |
| Red social | Facebook **MASTER VALUADORES** |
| Logotipo | MASTERS VALUADORES, insignia hexagonal metálica con banderas de México y EE. UU. |

## Qué toca de lo que está decidido

### 1 · El alcance del ADR-0008 no coincide con el letrero

El [[ADR-0008-alcance-de-cuatro-giros|ADR-0008]] fijó cuatro giros: empeños, compra
venta de maquinaria, fletes y taller. El letrero de su propio local dice otra cosa:

| En el letrero | ¿Está en el sitio? |
|---|---|
| Empeño | Sí |
| Compra y venta | Sí |
| Maquinaria | Sí |
| **Herramientas** | **No** — la renta de herramienta salió con el ADR-0008 |
| **Autos** | **No existe como giro** |
| **Contenedores marítimos** | **No existe como giro**, y lleva insignia propia en el letrero |
| Valuaciones | Bloqueado por D-03 |
| Fletes | **No aparece en el letrero** |
| Taller | **No aparece en el letrero** |

**Dos de los cuatro giros del sitio no están en su fachada, y tres cosas que sí están
en su fachada no están en el sitio.** No lo resuelvo: es pregunta para Cristóbal.

### 2 · D-01 · las dos grafías están en el MISMO letrero

El logotipo dice **MASTERS** VALUADORES. La línea de Facebook, a dos metros, dice
**MASTER** VALUADORES, sin S. Ya no son tres fuentes distintas discrepando: es el mismo
letrero, hecho de una vez, con las dos grafías.

Esto no cierra D-01 — lo **agrava**, y refuerza que la pregunta correcta son dos: cuál
es la razón social del acta y cuál quiere que se lea.

### 3 · D-08 · el teléfono tiene ya tres fuentes

**871 507 3005**, el mismo de las cinco publicaciones, ahora también en la fachada, con
el ícono de WhatsApp al lado — lo que además responde que WhatsApp y teléfono son el
mismo número.

**Aun así NO entra en `negocio.ts`.** El contrato pide el NAP por escrito de Cristóbal,
y una foto —por buena que sea— no es él confirmándolo. Pero conviene decirle que a
estas alturas confirmarlo le cuesta un mensaje.

Lo que la fachada **no** da: calle, número, colonia, CP ni horarios. D-08 sigue abierta.

### 4 · D-10 · Facebook

El letrero da el nombre de la página —`MASTER VALUADORES`— pero **no la URL**. Sigue
haciendo falta el enlace exacto.

### 5 · El logotipo del edificio NO es el plano

El [[ADR-0004-identidad-plana|ADR-0004]] eligió el tratamiento **plano** porque es el
que el cliente publica en redes. En su edificio usa el **metálico con relieve**: la
insignia hexagonal con banderas, que es el `logo-actual-raster.jpg` que se había
retirado.

No propongo revertir el ADR-0004: en una pantalla de teléfono el plano sigue ganando, y
sigue siendo lo que publica. Pero **el cliente convive con los dos tratamientos** y eso
conviene saberlo antes de que pregunte por qué su sitio no se parece a su letrero.

### 6 · La paleta del edificio trajo de vuelta el acero

Amarillo de contenedor, negro de fachada y **piedra gris grafito** en el revestimiento.
Eso es lo que sostiene el [[ADR-0010-degradados-de-superficie|ADR-0010]].

## Lo que la foto cierra de verdad

- **El hueco de la fachada.** Era «el activo más caro del proyecto» según el ADR-0007 y
  el `CLAUDE.md`. Está cerrado y la foto es el héroe de la portada.
- **La ventaja competitiva deja de ser teórica.** Se verificó que ni First Cash, ni
  Empeño Fácil, ni Monte de Piedad, ni Patrón Oro —el local más parecido, en Av. Juárez
  de Torreón— enseñan su local. Masters ahora sí. Y el local **no se parece a una casa
  de empeño**: es un contenedor marítimo amarillo sobre una fachada negra. Eso no se
  olvida, y ningún competidor lo puede copiar.

## Preguntas que esto abre para Cristóbal

1. ¿**Contenedores marítimos** es una línea de negocio? Tiene insignia propia en su
   letrero y no existe en el sitio.
2. ¿**Autos** es una línea? El letrero la nombra.
3. ¿**Herramientas** sigue vigente? Salió con el ADR-0008, pero está en el letrero y en
   una de sus cinco publicaciones.
4. ¿Por qué **fletes** y **taller** no están en el letrero, si son dos de los cuatro
   giros que pidió enfocar?
5. ¿**MASTER** o **MASTERS**? Están los dos en su propio letrero.

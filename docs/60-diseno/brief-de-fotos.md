---
tipo: brief
estado: LISTO PARA EJECUTAR — no depende de nadie más
fecha: 2026-09-10
para: Cristóbal
autor: Nazmelia
---

# Brief de fotos · qué tomar, cómo y para qué

## Por qué esto antes que casi todo

El [[ADR-0007-lenguaje-visual|ADR-0007]] estima que el lenguaje visual del sitio acerca
**la mitad del camino**, y que la otra mitad son fotos que no existen. Este documento
convierte esa mitad en una lista que se ejecuta con un teléfono en una mañana.

Y hay un argumento que no es de diseño. Se revisó la competencia el 10 de septiembre:

| Competidor | ¿Enseña su local? |
|---|---|
| First Cash · `firstcash.mx` | No |
| Empeño Fácil · sucursal Torreón | No |
| Monte de Piedad | No |
| **Patrón Oro** · Av. Juárez 968, Torreón | **No** |

**Ninguno.** Las cadenas no pueden —son cientos de sucursales— y el competidor local
más parecido no lo ha hecho. Es terreno vacío, y es la única ventaja que el sitio de
Masters puede tener que los demás no pueden copiar.

## Dos destinos, una sola sesión

Las mismas fotos sirven en los dos lugares, y el segundo pesa más:

| Destino | Peso en posicionamiento local |
|---|---|
| **Ficha de Google** | **32 %** |
| El sitio | ~15 % |

Por eso las especificaciones de abajo cumplen **las dos** a la vez. No se toma dos
veces.

---

## Las tomas, por orden de valor

### 1 · Fachada del local · LA MÁS IMPORTANTE

> **De día, con el letrero legible.**

- El letrero tiene que **leerse completo** en la foto. Si no se lee, la foto no sirve.
- De frente o con un ligero ángulo, no desde la acera de enfrente a 50 metros.
- **Luz de día, sin contraluz.** Media mañana o media tarde; a mediodía el sol pega
  desde arriba y apaga el letrero.
- Que se vea la puerta y por dónde se entra. Quien busca con prisa necesita reconocer
  el lugar cuando llegue.
- Sin coches tapando la entrada si se puede evitar.

**Dónde entra:** la ranura de la portada, `src/routes/+page.svelte:110`, y la **foto de
portada de la ficha de Google**.

### 2 · Interior · mostrador y vitrina

> **Dos o tres tomas: el mostrador, la vitrina, y una general del espacio.**

- Con la luz encendida. Que se vea ordenado y que se vea **quién atiende**.
- La vitrina con producto real, no vacía.
- **Sin clientes en cuadro** salvo que firmen autorización. Ver el apartado legal.

**Dónde entra:** la ficha de Google, sección *Interiores*. En el sitio todavía no hay
ranura para estas — ver «Lo que falta en el código», abajo.

### 3 · Una por giro · cuatro tomas

Desde el [[ADR-0008-alcance-de-cuatro-giros|ADR-0008]] son cuatro:

| Giro | Qué debe verse |
|---|---|
| **Empeño y préstamo** | El mostrador donde se valúa. La báscula o la lupa si las hay |
| **Compra venta de maquinaria** | Maquinaria **suya**, en su patio o su bodega. No de catálogo |
| **Fletes y logística** | Su unidad, su remolque, su equipo de carga |
| **Taller y refaccionaria** | El taller trabajando, o el mostrador de refacciones |

**La regla que no se rompe:** tienen que ser **sus** máquinas, **su** unidad y **su**
taller. Una foto de archivo de una excavadora bonita convierte el sitio en una promesa
que el local no puede cumplir cuando el visitante llegue.

### 4 · La cara

> **Cristóbal, o quien atiende, en el local.**

Es lo que ninguna cadena puede poner. No hace falta que sea un retrato de estudio: de
pie en el mostrador, mirando a la cámara, con luz de día.

---

## Especificaciones técnicas

Cumplen el sitio y la ficha de Google al mismo tiempo.

| | |
|---|---|
| **Cómo disparar** | En **4:3**, a la resolución máxima del teléfono, **con aire de sobra** alrededor del sujeto |
| **Por qué con aire** | De un 4:3 amplio se recortan después el 16:9 del sitio, el 4:3 de las publicaciones y el 1:1 del perfil. Si la foto va justa, no hay de dónde recortar |
| **Formato** | JPG o PNG |
| **Peso** | entre 10 KB y 5 MB |
| **Mínimo de Google** | 250 × 250 px · **recomendado 720 × 720** |
| **Portada de la ficha** | 1024 × 576 · 16:9 |
| **Publicaciones de la ficha** | 1200 × 900 · 4:3 |
| **Ranura de la portada del sitio** | **16:9** |
| **Ranuras de mapa** | 4:3 · esas no son foto, se dibujan al cerrar D-08 |

**Enfoque y luz:** Google pide explícitamente fotos **enfocadas y bien iluminadas**, sin
alteraciones importantes ni exceso de filtros, **que representen la realidad**. Una foto
muy filtrada puede costar la ficha.

## Lo que NO sirve, y por qué

| | Por qué no |
|---|---|
| **Fotos de banco o generadas** | El ADR-0007 lo prohíbe: *«En el sitio van fotos suyas o va hueco»*. Y es justo lo que hacen las cadenas: copiarlas es renunciar a la única ventaja |
| **Filtros fuertes, marcas de agua, collages** | Google los penaliza en la ficha |
| **Capturas de sus publicaciones de Instagram** | Son arte de redes con maquinaria de banco, no fotos del local |
| **Fotos nocturnas de la fachada** | El letrero no se lee y el local se ve cerrado |
| **Bienes de clientes identificables** | Ver abajo |

## Permisos · esto sí es serio

- **Personas en cuadro:** si se distingue a alguien que no es del negocio, hace falta su
  autorización. Lo más simple es tomar las fotos con el local sin clientes.
- **Bienes empeñados:** no fotografiar prendas de clientes de forma reconocible —una
  joya con grabado, un aparato con número de serie visible—. Es información de un
  tercero y no es de Masters para publicarla.
- **Empleados:** avisarles y pedir su acuerdo antes de que salgan en el sitio.

## Lo que falta en el código, y conviene saberlo antes de la sesión

El `CLAUDE.md` dice que hacen falta **«fachada y una por giro»**. Verificado hoy: el
sitio tiene **una sola ranura de foto**, la de la fachada en la portada. Las páginas de
giro solo tienen ranura de **mapa**.

```
src/routes/+page.svelte:110       FOTO — FACHADA DEL LOCAL          16:9
src/routes/+page.svelte:160       MAPA                              4:3
src/routes/contacto/+page.svelte:39   MAPA                          4:3
src/routes/[giro]/+page.svelte:108    MAPA                          4:3
```

**No cambia nada del brief** —las fotos hay que tomarlas igual, y la ficha de Google las
usa todas—, pero antes de colocarlas en las páginas de giro hay que abrirles su ranura.
Es trabajo pequeño y se hace cuando existan las fotos, no antes.

## Cómo entregarlas

Sin editar, tal como salen del teléfono, en una carpeta con nombres que digan qué son:
`fachada-01.jpg`, `mostrador-01.jpg`, `maquinaria-01.jpg`. El recorte y el ajuste los
hacemos nosotros — de un original amplio se saca todo, de uno ya recortado no.

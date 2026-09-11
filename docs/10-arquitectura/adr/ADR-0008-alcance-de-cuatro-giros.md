---
tipo: adr
id: ADR-0008
estado: ACEPTADA
fecha: 2026-09-10
decide: Cristóbal, transmitido por Nadir
enmienda: ADR-0003-alcance-multigiro
implementa: Claude Code
---

# ADR-0008 · El sitio se enfoca en cuatro giros, y maquinaria cambia de negocio

## Qué pidió el cliente

Cristóbal quiere enfocar el sitio en cuatro líneas:

**Empeños · Compra venta de maquinaria · Fletes · Taller**

## Decisión

**Se reduce a cuatro giros de verdad**, no se prioriza: joyería, bazar y financiera
**salen del sitio**. Y el giro de maquinaria **cambia de negocio**: deja de ser *renta*
y pasa a ser *compra venta*.

| Antes · 7 construibles | Después · 4 |
|---|---|
| Empeño y préstamo | **Empeño y préstamo** |
| Joyería | — sale |
| Bazar | — sale |
| Taller y refaccionaria | **Taller y refaccionaria** |
| Fletes y logística | **Fletes y logística** |
| Renta de maquinaria y equipo | **Compra venta de maquinaria** ← cambia de negocio |
| Financiera | — sale |

Los dos bloqueados —importaciones (D-04) y avalúos periciales (D-03)— **siguen
bloqueados y sin cambio**. Ver la advertencia sobre importaciones más abajo.

Decidido por: Cristóbal. Transmitido y confirmado por Nadir el 10 de septiembre de 2026.

## Lo que esto cuesta, dicho antes de hacerlo

Esto **enmienda el [[ADR-0003-alcance-multigiro|ADR-0003]]**, que Cristóbal decidió el
9 de septiembre. Conviene que quede escrito por qué eligió lo que eligió entonces:

> «Cristóbal había declarado que su objetivo es **salir en el mapa de Google al buscar
> giros como “bazar” y “joyería”** — cosa que la primera lectura no cumple.»
> — ADR-0003, sección Contexto

**Esa fue la razón de elegir multigiro sobre la landing única.** Sacar joyería y bazar
suelta exactamente lo que él pidió posicionar. Es su negocio y es su decisión; queda
registrada con su costo:

- Se pierden **dos puertas de entrada** en búsqueda local, las de «bazar» y «joyería».
- La joyería es además el giro donde su material vivo es más fuerte: dos de las cinco
  publicaciones —joyería y monedas— son de esa línea, y el [[ADR-0006-el-amarillo-vive]]
  midió el acento de marca sobre ellas.
- **D-15 queda huérfana.** «Compramos monedas» se estaba tratando como parte de
  joyería. Sin joyería, no tiene dónde vivir.
- Volver atrás no es gratis: si en tres meses quiere bazar de vuelta, el slug y la
  página se rehacen, y un slug que aparece y desaparece le cuesta credibilidad ante
  Google.

Lo que sí gana, y no es poco: **cuatro paquetes de contenido en vez de siete.** El
ADR-0003 ya advertía que el costo real de la ruta multigiro era el contenido por giro,
no el código. Con cuatro, el sitio es publicable mucho antes.

## Maquinaria: no es un cambio de nombre, es otro negocio

`renta-de-maquinaria` no se renombra: **se sustituye**. Rentar y comprar-vender son
servicios distintos, con búsquedas distintas y con páginas distintas.

**Lo que esto contradice de su propio material, y hay que decirlo:**
`docs/99-assets/post-renta-herramienta.jpg` es una de sus cinco publicaciones vivas y
anuncia «RENTA DE HERRAMIENTA LIJERA Y MAQUINARIA PESADA». Es decir, **el sitio deja de
ofrecer algo que el cliente está promocionando hoy en Instagram.** Si eso es
deliberado, perfecto. Si no lo es, se reabre con un ADR nuevo.

**Advertencia sobre importaciones (D-04):** `post-maquinaria-lista.jpg` anuncia
«FINANCIAMIENTO · IMPORTACIÓN · VENTA» y `post-importaciones-2.jpg` dice «IMPORTAMOS
MAQUINARIA DE CALIDAD». Con compra venta dentro del sitio, **importaciones y compra
venta se enciman**. D-04 —si importaciones es otra entidad legal— ya no es solo una
pregunta contable: ahora también decide si son una página o dos.

## Consecuencias técnicas

- `src/lib/datos/giros.ts`: tres giros fuera, uno sustituido.
- `src/lib/seo/jsonld.ts`: el `@graph` pasa de **7** a **4** `department`.
- `src/routes/[giro]/+page.ts`: de 7 a 4 rutas prerenderizadas. El sitio pasa de **11**
  a **8** páginas.
- `herramientas/validar-a11y.mjs`: su lista de rutas está escrita a mano y hay que
  actualizarla, o valida páginas que ya no existen.
- `src/lib/seo/jsonld.test.ts`: los conteos de 7 y 2 están asertados.
- **La portada miente en dos sitios** y hay que corregirla: el titular propuesto dice
  «Empeño, **joyería** y maquinaria» y el primer diferenciador dice «**Siete** líneas
  de negocio».
- `docs/70-contenido/propuesta-textos.md`: tres de las siete frases de tarjeta sobran.
- `docs/40-seo/mapa-de-paginas.md`: la tabla de rutas.

## Lo que NO cambia

- Los **slugs siguen siendo provisionales**. El de compra venta nace provisional como
  los demás: el slug definitivo sale del estudio de búsqueda, no de aquí. Etapa 1.
- La **categoría primaria de Google** (D-02) sigue abierta.
- El **NAP** (D-08) sigue siendo lo que bloquea la publicación.
- El lenguaje visual del [[ADR-0007-lenguaje-visual|ADR-0007]] no se toca.

## Cómo se revierte

Quitar un giro es barato hoy porque **nada está publicado**: no hay dominio, no hay
índice de Google y no hay enlaces entrantes. Esa ventana se cierra el día que el sitio
salga. Después de publicar, esto mismo cuesta redirecciones y pérdida de posición.

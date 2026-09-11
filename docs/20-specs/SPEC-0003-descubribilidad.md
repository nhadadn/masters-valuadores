---
tipo: spec
id: SPEC-0003
estado: IMPLEMENTADA — 10 de 10 criterios con evidencia
aprobada: 2026-09-11 por Nadir · «Adelante con el SEO que propone»
c4: [C4-L3-componentes-web]
depende_de: [ADR-0013-sin-dominio-no-se-indexa, ADR-0008-alcance-de-cuatro-giros]
actualizado: 2026-09-11
---

# SPEC-0003 · Descubribilidad y tarjetas de enlace

## Qué había, antes de tocar nada

Medido sobre el build del 11 de septiembre, no supuesto:

| Pieza | Estado |
|---|---|
| `sitemap.xml` | **No existía** |
| `robots.txt` | **No existía** |
| Canónica | **En ninguna de las 8 páginas** |
| Open Graph / Twitter | **Ninguna etiqueta, en ninguna página** |
| `<title>` de la portada | `MASTERS VALUADORES · __POR_CONFIRMAR__` |
| `<meta description>` de la portada | `__POR_CONFIRMAR__ · descripción de la portada, no se inventa` |
| Descripción de las 4 páginas de giro | `__POR_CONFIRMAR__ · descripción de {giro}` |
| Descripción de las 2 legales | No tenían |

Lo del título merece decirse aparte: **CA-08 no lo cazaba**. El guardia que revienta el
build revisa el grafo JSON-LD, y el `<head>` no pasa por ahí. La marca de «esto no está
listo» llevaba días en el sitio, en el único lugar donde nadie del equipo la mira y el
primero que un buscador lee.

Y el efecto práctico, que es el que importa para este cliente: **pegar el enlace en
WhatsApp no mostraba ni título, ni imagen, ni descripción.** WhatsApp es el canal por el
que este sitio va a circular de verdad.

## Numeración de los criterios

Van con prefijo **CA-S** y no con la serie corrida. Los CA-01…CA-12 ya están repartidos
entre SPEC-0001 y SPEC-0002, y el `CLAUDE.md` cita CA-06, CA-08 y CA-10 por número. Un
prefijo propio evita que dos criterios distintos se llamen igual en dos documentos.

## Criterios de aceptación

### CA-S1 · Cada página tiene un título propio y utilizable

Único en el sitio, sin `__POR_CONFIRMAR__`, y de **60 caracteres o menos** —lo que
Google suele mostrar antes de cortar—.

> **Evidencia A** · `tests/seo.test.ts:25` · 10 aserciones, una por página más la de
> unicidad. **Evidencia B** · `src/lib/seo/meta.ts`.

| Ruta | Título | Largo |
|---|---|---|
| `/` | Empeño, maquinaria, fletes y taller en Torreón · MASTERS | 56 |
| `/empeno-y-prestamo/` | Empeño y préstamo en Torreón · MASTERS VALUADORES | 49 |
| `/compra-venta-de-maquinaria/` | Compra venta de maquinaria en Torreón · MASTERS | 47 |
| `/fletes-y-logistica/` | Fletes y logística en Torreón · MASTERS VALUADORES | 50 |
| `/taller-y-refaccionaria/` | Taller y refaccionaria en Torreón · MASTERS | 43 |
| `/contacto/` | Contacto · MASTERS VALUADORES en Torreón | 40 |

### CA-S2 · Cada página tiene descripción, y es propuesta

Única, de 110 a 160 caracteres en las indexables, **marcada `propuesta: true`** y sin
una sola cifra, precio, porcentaje, horario, teléfono ni plazo.

Ese último test no es decorativo. Una descripción es texto publicado: si se cuela una
cifra sale en Google **como hecho**, y esa es la línea que el `CLAUDE.md` no deja cruzar.

> **Evidencia A** · `tests/seo.test.ts:45`, incluida la lista de patrones prohibidos.

**Redactar no es inventar.** El `CLAUDE.md`, corregido el 10 de septiembre, autoriza
«titulares, subtítulos… descripciones de un giro que solo digan lo que ese giro es por
definición», siempre «marcado como propuesta». Un `<title>` es un titular y una
`description` es un subtítulo. Se escriben bajo la misma vara que los
`subtitularPropuesto` de `giros.ts`, que ya viven en el sitio con la misma marca — y
ninguna puede llegar a un resultado de búsqueda antes de que Cristóbal las corrija,
porque el sitio entero va `noindex` hasta que cierre D-07 (ADR-0013).

Las ocho van al documento de requerimientos para que las palomee o las tache.

### CA-S3 · El sitemap apunta exactamente a las páginas indexables

Ni una de más —un sitemap que apunta a una página que no existe es un 404 que le
enseñas a Google tú mismo— ni una de menos.

> **Evidencia A** · `tests/seo.test.ts:115`. **Evidencia B** ·
> `src/lib/seo/enlaces.ts:97` y `src/routes/sitemap.xml/+server.ts`.

**Solo lleva `<loc>`.** No lleva `priority` ni `changefreq` —Google declara
públicamente que los ignora— y **no lleva `lastmod`**, que es la decisión menos obvia:
el único valor que podríamos poner es la hora del build, y eso no es cuándo cambió el
contenido sino cuándo compilamos. Google descarta el `lastmod` de un sitio que lo
reporta mal, y que lo descarte cuesta más que no ponerlo.

### CA-S4 · `robots.txt` existe en la raíz del build

Verificado sobre el artefacto: `build/robots.txt`, 505 bytes, junto a `build/index.html`.

Las dos rutas se prerenderizan desde `+server.ts` con `trailingSlash = 'never'`. Sin
eso, el `trailingSlash: 'always'` del layout raíz las habría escrito como
`/sitemap.xml/`, que no es donde ningún rastreador las busca.

### CA-S5 · Sin dominio, nada se indexa · ADR-0013

`noindex, nofollow` en las ocho páginas, `Disallow: /` en robots, sitemap sin una sola
URL. Y **se abre solo** al escribir el dominio.

> **Evidencia A** · `tests/seo.test.ts:145` prueba los **dos** estados inyectando un
> origen falso, sin esperar a que cierre D-07.

Verificado además de punta a punta: se puso `dominio: 'mastersvaluadores.mx'` a mano, se
construyó, y salió esto —después revertido—:

```
robots.txt   Allow: /  ·  Disallow: /aviso-de-privacidad/  ·  Disallow: /terminos/
             Sitemap: https://mastersvaluadores.mx/sitemap.xml
sitemap.xml  6 <loc>, las seis indexables, absolutas y con barra final
/empeno-y-prestamo/   robots=index, follow    canonical absoluta  og:image absoluta
/terminos/            robots=noindex, follow  canonical absoluta
```

### CA-S6 · Canónica absoluta y coincidente

Con dominio: una `<link rel="canonical">` por página, absoluta, igual a la ruta y con
barra final. Sin dominio: **ninguna**, porque una canónica relativa apuntaría a la
propia URL provisional y no protegería de nada (ADR-0013).

> **Evidencia B** · `src/lib/componentes/Meta.svelte:25`.

### CA-S7 · Tarjeta de enlace completa

`og:title`, `og:description`, `og:url`, `og:image` con `width`/`height`/`alt`/`type`,
`og:site_name`, `og:type`, `og:locale` y `twitter:card`.

`twitter:card` es `summary_large_image` **solo si hay imagen**; sin origen baja a
`summary`, porque anunciar una tarjeta grande sin imagen que mostrar es peor que
anunciar una chica.

> **Evidencia B** · `src/lib/componentes/Meta.svelte`.

### CA-S8 · La imagen de la tarjeta

`static/marca/tarjeta-fachada.jpg` · **1200 × 630** · **142.6 KB**.

Dos razones para no usar la foto tal cual:

- `fachada-1600.jpg` es 16:9. Open Graph pide 1.91:1, y con otra proporción el recorte
  lo hace cada plataforma a su gusto y ninguna avisa qué cortó.
- Pesaba 253 KB. El lector de vistas previas de WhatsApp deja de generar miniatura con
  imágenes grandes, y WhatsApp es el canal real de este sitio. El umbral práctico que
  se fijó es 200 KB.

El recorte quita 20 px de cielo arriba y 40 de grava abajo: contenedor amarillo,
logotipo, banda del letrero y vitrina quedan enteros.

> **Evidencia A** · `tests/seo.test.ts:172` lee las dimensiones del propio JPEG y el
> tamaño en disco. **Evidencia B** · `herramientas/hacer-tarjeta.mjs`, que la regenera.

**Es la fachada en las ocho páginas, y eso es deliberado.** Las otras cuatro fotos son
de banco (ADR-0009) y en la página salen rotuladas como provisionales; una tarjeta de
WhatsApp no tiene dónde poner ese rótulo. Se vería una excavadora de catálogo firmada
por Masters, sin aviso. La fachada es la única foto real que existe y es la ventaja que
ninguna cadena puede copiar.

### CA-S9 · El presupuesto de JS no se mueve

**0 KB en las 8 páginas.** Son etiquetas del `<head>` y dos archivos de texto: se
resuelven al construir.

> **Evidencia A** · `node herramientas/presupuesto.mjs`, margen de 40.00 KB en la peor
> página.

### CA-S10 · Una sola lista de páginas

Este es el criterio que protege a los demás. El inventario vive en
`src/lib/seo/enlaces.ts:51` y un test lo compara **contra el disco**: ni una ruta de
más, ni una de menos.

Antes de esto la lista estaba escrita a mano en dos lugares, y uno de ellos
—`herramientas/validar-a11y.mjs`— llevaba su propia advertencia:

> «Esta lista está a mano y es una trampa: si alguien cambia `giros.ts` y olvida esto,
> el validador pide páginas que ya no existen y reporta menos cobertura de la que cree
> tener.»

Escribir la advertencia no desarma la trampa. El sitemap habría sido la tercera copia y
la más cara. Ahora el validador **recorre `build/`** y valida lo que de verdad se
construyó; el `<head>` se emite una sola vez desde el layout, así que una página nueva
no puede nacer sin él; y si una ruta no está en el inventario, `meta.ts` lanza excepción
durante el prerender y el build no sale.

> **Evidencia A** · `tests/seo.test.ts:95`. **Evidencia B** ·
> `herramientas/validar-a11y.mjs:34`, `src/routes/+layout.svelte:31`.

## Resultado de la verificación · 11 de septiembre

```
npm test                              103 tests en verde  (eran 64)
npm run build                         código 1 · 14 marcas en el grafo · CORRECTO
npm run build:revision                8 páginas · 0 KB de JS en todas
node herramientas/presupuesto.mjs     CA-10 cumplido · margen 40.00 KB
node herramientas/validar-a11y.mjs    CUMPLE · 16/16 · contraste mínimo 7.73:1
node herramientas/medir-piezas.mjs    CUMPLE · 12/12
```

## Lo que esto NO arregla

Hay que decirlo, porque el riesgo es creer que con esto el SEO está resuelto:

- **El sitio pesa ~15 % del posicionamiento local.** La ficha de Google pesa 32 %, las
  reseñas 20 % y los directorios 6 %, y Masters sigue en **cero** en esos 58 puntos.
  Esta spec mejora el 15 %, no toca el 58 %.
- **Los slugs siguen provisionales.** Salen de la Etapa 1, que no se ha ejecutado.
- **El contenido sigue siendo borrador.** Un `<title>` bueno sobre una página de huecos
  no posiciona: le dice a Google qué es la página y luego la página no lo sustenta.
- **Nadie ha visto estas tarjetas en un teléfono real.** Se verificaron las etiquetas en
  el HTML construido, no el render de WhatsApp, que se puede probar recién el día que
  haya una URL pública.

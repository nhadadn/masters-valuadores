---
tipo: adr
id: ADR-0013
estado: ACEPTADA
fecha: 2026-09-11
decide: Nadir
implementa: Claude Code
depende_de: [decisiones-pendientes]
bloqueado_por: D-07
---

# ADR-0013 · Mientras no haya dominio, el sitio no se deja indexar

## Qué se decide

Tres cosas, en una sola decisión porque las tres salen del mismo dato:

1. **El origen del sitio vive en un solo lugar**, `src/lib/seo/enlaces.ts`, derivado de
   `negocio.dominio`. La canónica, `og:url`, `og:image` y el `sitemap.xml` lo consumen.
   Ninguno escribe una URL por su cuenta.
2. **Mientras `negocio.dominio` siga en `__POR_CONFIRMAR__`** (D-07): todas las páginas
   salen con `robots: noindex, nofollow`, el `robots.txt` responde `Disallow: /` y el
   `sitemap.xml` sale sin una sola URL.
3. **Se abre solo.** El día que alguien escriba el dominio en `negocio.ts`, los tres
   archivos se invierten sin tocar una línea más. No hay una segunda tarea que recordar.

## Por qué, y no es prudencia de más

Hoy el sitio son huecos etiquetados, marcas `__POR_CONFIRMAR__` visibles en pantalla y
un aviso de borrador en la portada y en las cuatro páginas de giro. Es exactamente el
estado en que **no** conviene que Google lo conozca.

Y hay un daño concreto, no hipotético. Un sitio estático se despliega en cualquier
parte: una URL de vista previa de Vercel, un subdominio de pruebas, la carpeta de un
hospedaje compartido. Si Google indexa esa URL provisional:

- La primera impresión del proyecto queda hecha con el borrador.
- Cuando llegue el dominio bueno, ese contenido ya vive en otra URL y **compite contra
  él como duplicado**. Consolidar un duplicado cuesta semanas y no siempre se logra.
- Sin dominio no hay canónica que lo prevenga: una canónica es precisamente la etiqueta
  que dice «la versión buena está en esta otra dirección», y esa dirección es el dato
  que falta.

El `CLAUDE.md` ya decía «Publicación: **bloqueada por el NAP, a propósito**». Esta
decisión no añade una política nueva: pone esa política **en el artefacto** en lugar de
dejarla solo en un documento que un despliegue apresurado no lee.

## El costo, dicho completo

**El modo de fallo es un sitio invisible.** Si algún día se publica en el dominio de
verdad y nadie escribió ese dominio en `negocio.ts`, el sitio queda en línea y en
`noindex`, y eso puede pasar semanas sin que nadie lo note: la página se ve perfecta.

Lo que reduce el riesgo, y hay que decir hasta dónde llega:

- `npm run build` **ya falla** sin el dominio — CA-08, `src/lib/seo/jsonld.ts:135`. Un
  build publicable no se puede producir sin ese dato.
- El `robots.txt` explica en su propio texto por qué prohíbe y qué archivo hay que
  editar para abrirlo. Es el primer sitio donde alguien mira cuando algo no indexa.

**El hueco que queda:** `npm run build:revision` sí produce un sitio completo con las
marcas vivas. Si alguien publica esa salida, publica un sitio en `noindex`. El script
ya avisa a gritos —«NO SE PUBLICA ASÍ»— y esa advertencia es todo lo que hay. No se
cierra con código: un build de revisión tiene que poder construirse, o no habría manera
de medir ni de revisar nada hasta que el cliente entregue sus datos.

## Lo que se descartó

| Alternativa | Por qué no |
|---|---|
| **Escribir un dominio probable** (`mastersvaluadores.mx`) y corregirlo después | Es inventar un dato de negocio, que es la línea que sostiene el repo. Y si se publica sin corregirlo, cada canónica del sitio apunta a un dominio que no es suyo — peor que no tener canónica |
| **Canónica relativa** (`href="/empeno-y-prestamo/"`) | Es HTML válido, pero no resuelve nada: una canónica relativa se resuelve contra la URL del documento, así que en la URL de vista previa apunta a la propia vista previa. Y `og:url` y `og:image` **exigen** absoluta: Facebook y WhatsApp descartan la tarjeta sin ella |
| **No emitir nada de esto hasta que cierre D-07** | Entonces el día de publicar se estrenarían ocho `<head>`, un sitemap y un robots.txt sin haberlos visto funcionar nunca. Se prueban hoy con un origen inyectado: `tests/seo.test.ts` verifica los dos estados |
| **Indexar solo la portada** | Media medida sin beneficio: la portada es justo la que más huecos tiene |

## Qué NO decide este ADR

- **Los slugs siguen provisionales.** El sitemap publica lo que exista el día que se
  publique; que `empeno-y-prestamo` sea el slug definitivo lo decide la Etapa 1.
- **La prioridad entre páginas** tampoco: el sitemap no lleva `priority` porque Google
  declara que lo ignora, no porque esté decidida.
- **Las legales quedan fuera del índice para siempre**, no por D-07: un aviso de
  privacidad no responde a ninguna búsqueda y diluye el poco peso que un sitio nuevo
  tiene para repartir. Llevan `noindex, follow` —que no se indexen, pero que sus
  enlaces sí cuenten— y no entran al sitemap.

## Evidencia

| Qué | Dónde |
|---|---|
| Origen único y constructores | `src/lib/seo/enlaces.ts` |
| `noindex` mientras falte el dominio | `src/lib/componentes/Meta.svelte:33` |
| Los dos estados, probados | `tests/seo.test.ts` · CA-S5 |
| Se verificó que se abre solo | Se puso el dominio a mano, se construyó, y salieron canónica absoluta, `og:image` absoluta, `index, follow`, `robots.txt` con `Allow`, y un sitemap con las seis indexables. Revertido después |

Criterios y medidas completas en [[SPEC-0003-descubribilidad]].

---
tipo: adr
id: ADR-0016
estado: ACEPTADA
fecha: 2026-09-11
decide: Nadir
implementa: Claude Code
enmienda: ADR-0013-sin-dominio-no-se-indexa
---

# ADR-0016 · El borrador se cuelga en Vercel, sin dejar de ser borrador

## Qué se decide

> *«Quisiera cargar nuestra app a este dominio de Vercel que es mío para poder con ello
> compartir al cliente o ver en mi celular directo.»* — Nadir

El sitio se despliega en **`masters-valuadores.vercel.app`**, una dirección de Nadir.
Sirve para dos cosas concretas: verlo en un teléfono real, y pasárselo a Cristóbal.

**No es publicar.** Es poner el borrador donde se pueda mirar.

## Tres cosas que había que resolver antes, y ninguna era obvia

### 1 · `npm run build` falla a propósito, y Vercel no lo sabe

CA-08: el grafo JSON-LD revienta el prerender mientras queden marcas sin confirmar, y
hoy quedan 6. Un despliegue normal habría fallado con un error que parece un bug y no
lo es.

`vercel.json` apunta a **`npm run build:revision`**, la escotilla documentada. El script
avisa a gritos en el registro de Vercel —«NO SE PUBLICA ASÍ»— y ese aviso queda
guardado en cada despliegue, que es exactamente donde conviene que esté.

**Esto es el hueco que el [[ADR-0013-sin-dominio-no-se-indexa|ADR-0013]] dejó escrito**:

> «`npm run build:revision` sí produce un sitio completo con las marcas vivas. Si
> alguien publica esa salida, publica un sitio en `noindex`. El script ya avisa a
> gritos y esa advertencia es todo lo que hay.»

Se está usando ese hueco **a sabiendas y a propósito**. La diferencia con el escenario
que preocupaba al ADR-0013 es que aquí el `noindex` no es un accidente: es el objetivo.

### 2 · `Disallow: /` habría matado la vista previa de WhatsApp

Este es el hallazgo que cambió el plan. El `robots.txt` prohibía todo, y **el lector de
vistas previas de enlaces respeta `robots.txt`**. Resultado: pasarle el enlace a
Cristóbal por WhatsApp habría llegado como texto pelado — sin fachada, sin título y sin
descripción. Justo lo que se construyó en la [[SPEC-0003-descubribilidad|SPEC-0003]], y
justo el canal por el que este sitio circula.

`robots.txt` ahora abre **solo** para los lectores de vista previa —
`facebookexternalhit`, `WhatsApp`, `Twitterbot`, `Slackbot-LinkExpanding`,
`TelegramBot` — y sigue cerrado para todo lo demás. Esos agentes dibujan tarjetas; no
alimentan ningún índice.

### 3 · Sin origen no hay `og:image`

`og:url` y `og:image` exigen URL absoluta, y el ADR-0013 no emitía ninguna sin dominio.

Se añade **`ORIGEN_VISTA_PREVIA`** en `src/lib/seo/enlaces.ts`. Es la dirección donde
está colgado el borrador, y **no es un dato de negocio**: no entra en `negocio.ts`, no
cierra D-07, y se borra el día que haya dominio.

## Lo que NO cambia · el ADR-0013 sigue en pie

| Garantía del ADR-0013 | ¿Sigue? |
|---|---|
| Las 8 páginas van `noindex, nofollow` | **Sí** |
| `robots.txt` cierra a los buscadores | **Sí** — solo se abrió a los lectores de tarjetas |
| `sitemap.xml` sale vacío | **Sí** |
| **No se emite canónica** | **Sí** — y es la línea que más importa |
| `negocio.dominio` sigue en `__POR_CONFIRMAR__` | **Sí**, D-07 abierta |

La canónica es la que decide. Apuntarla a `vercel.app` sería declararle a Google que la
versión buena de este sitio vive ahí, y eso es precisamente el duplicado que el ADR-0013
existe para evitar. La tarjeta de enlace no tiene ese poder: solo dibuja una imagen.

**Tercer cerrojo, añadido aquí:** `vercel.json` manda una cabecera
`X-Robots-Tag: noindex, nofollow` en todas las respuestas. Así el `noindex` no depende
de que el HTML se lea: viaja en la respuesta HTTP. Son tres cerrojos —cabecera, etiqueta
y `robots.txt`— y no uno.

## Lo que hay que saber, y no es técnico

- **Quien tenga el enlace, entra.** No hay contraseña. Es un borrador con huecos
  etiquetados, marcas `__POR_CONFIRMAR__` a la vista y una banda que dice BORRADOR en
  cada página. Eso es lo que verá Cristóbal, y es lo que se quiere que vea.
- **El teléfono y la dirección del negocio son públicos ahí.** Ya lo son: están en su
  letrero y en su ficha de Google.
- **Vercel es un tercero más.** Hasta hoy el único era el mapa (ADR-0015); ahora también
  el hospedaje. Es lo normal para un preview y no compromete nada del sitio.

## Cómo se revierte

Borrar el despliegue en Vercel, quitar `vercel.json` y `ORIGEN_VISTA_PREVIA`. Ninguna
de las dos cosas toca el contenido ni los datos.

## Evidencia

| Qué | Dónde |
|---|---|
| Origen de vista previa, y qué NO hace | `src/lib/seo/enlaces.ts:33` |
| La tarjeta usa la vista previa; la canónica no | `src/lib/componentes/Meta.svelte:25` |
| `robots.txt` abre solo a lectores de tarjeta | `src/lib/seo/enlaces.ts:142` |
| Build permisivo, salida y cabecera `noindex` | `vercel.json` |

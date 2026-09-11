---
tipo: adr
id: ADR-0015
estado: ACEPTADA — con el costo medido y una alternativa sobre la mesa
fecha: 2026-09-11
decide: Nadir
implementa: Claude Code
depende_de: [ADR-0013-sin-dominio-no-se-indexa]
---

# ADR-0015 · Entra el mapa de Google incrustado

## Qué se decide

Las tres pantallas que tenían una ranura gris de mapa —portada, contacto y cada página
de giro— llevan ahora un **mapa de Google real, incrustado en un `<iframe>`**.

Decisión de Nadir el 11 de septiembre, elegida sobre «quitar la ranura» y «poner la foto
de la fachada», y tomada **sabiendo** que traía tercero, cookies y riesgo de
desplazamiento de maqueta: eso estaba escrito en la opción.

## Es la primera vez que este sitio carga un tercero

Hasta hoy no había ninguno. Fuentes autoalojadas, cero librerías de UI, cero analítica,
cero JavaScript de cliente. La línea está en el `CLAUDE.md` y en `+layout.ts:28`.

Esto la cruza. No la rompe —el presupuesto de CA-10 mide **el JS del sitio**, y sigue en
0 KB en las 8 páginas— pero sería deshonesto decir que no cambió nada.

## El costo, medido

`herramientas/medir-mapa.mjs`, a 390 px de ancho, 4G a 1.6 Mbps con 150 ms de latencia:

| Ruta | 3ros antes de bajar | KB antes | 3ros después | KB después | CLS |
|---|---|---|---|---|---|
| `/` | 17 | 450.1 | 33 | **643.8** | 0.0007 |
| `/contacto/` | 33 | 643.8 | 33 | **643.8** | 0 |
| `/empeno-y-prestamo/` | 17 | 450.1 | 33 | **643.8** | 0.0007 |

Seis dominios de Google: `maps.google.com`, `www.google.com`, `maps.googleapis.com`,
`maps.gstatic.com`, `fonts.googleapis.com`, `fonts.gstatic.com`.

**Lo que sale bien:**

- **El CLS aguanta.** 0.0007 contra un umbral de 0.1. El contenedor reserva el alto con
  `aspect-ratio: 4/3` antes de que el iframe exista, así que nada salta.
- **Cookies medidas: 0.** Con la salvedad de abajo.

**Lo que sale mal, y es lo importante:**

- **643.8 KB.** El HTML de esas páginas pesa entre 3.1 y 5.7 KB gzip. **El mapa pesa más
  de cien veces la página en la que vive.**
- **`loading="lazy"` casi no sirve aquí.** Se puso esperando que quien no bajara al mapa
  no lo pagara. Medido: en la portada y en las de giro ya se han descargado 450 KB antes
  de bajar, y en `/contacto/` **se descarga entero de inmediato**. El umbral de carga
  diferida de Chrome es generoso y estas páginas son cortas: el mapa casi siempre está
  dentro.

### Sobre las cookies

El script midió **cero** cookies de tercero. **No se concluye que el mapa no ponga
ninguna**: la medición corre en un contexto nuevo de Chromium, donde las cookies de
tercero pueden venir bloqueadas por omisión, y el comportamiento de Google cambia por
región y por estado de consentimiento. Lo único que se puede afirmar es lo que se midió,
en esa configuración.

**Consecuencia que no es técnica:** el aviso de privacidad del sitio —hoy un hueco que
redacta el abogado del cliente— **tiene que decir que la página incrusta Google Maps y
qué implica**. Quedó anotado en el documento de requerimientos.

## La alternativa, también medida

Se construyó y se midió la variante de **cargar al tocar**: el mismo iframe dentro de un
`<details>` nativo, con un renglón «Ver el mapa» que lo despliega. Cero JavaScript.

| | Mapa a la vista | Mapa al tocar |
|---|---|---|
| Terceros antes de tocar | 33 | **0** |
| KB antes de tocar | **643.8** | **0** |
| CLS | 0.0007 | 0.0007 |
| Mapa de Google real | Sí | Sí |
| Se ve un mapa sin hacer nada | Sí | **No** |

El navegador **no pide el iframe mientras el `<details>` esté cerrado**: comprobado, no
supuesto.

**No se implementó ese día**, y la razón fue de respeto a la decisión, no técnica:
Nadir eligió «incrustar el mapa» sobre «quitar la ranura», y la variante al tocar se
parece visualmente a quitarla.

## ENMENDADO el mismo día · se adopta cargar al tocar

Al medir la portada **en vivo** con `herramientas/medir-portada.mjs`, en las
condiciones del contrato —390 px, 4G a 1.6 Mbps, CPU a un cuarto—:

```
Peso total     590.4 KB en 31 peticiones
De terceros    450.1 KB en 17  →  el 76 %
JavaScript     425.6 KB
```

**El sitio cuyo primer principio es «CERO JavaScript en el cliente» estaba sirviendo
425.6 KB de JavaScript.** Ninguno propio —todo dentro del iframe— pero el visitante lo
descarga igual. El ADR original midió bytes y CLS; no midió que tres cuartas partes de
la página fueran de un tercero.

### Una corrección, porque el primer diagnóstico estaba mal

Esa misma medición reportó **4464 ms de LCP** y con ese número se dijo que el mapa
estaba costando el LCP. **Era falso.** El dato se tomó con la CDN de Vercel fría,
recién desplegado; repetido en caliente, la misma página da **1588–1932 ms**, que es
BUENO — y lo daba también con el mapa a la vista.

El LCP nunca estuvo mal. Lo que estaba mal era el peso.

`medir-portada.mjs` ahora hace una carga de descarte antes de medir, para no volver a
confundir un servidor dormido con el producto.

Con eso sobre la mesa, Nadir eligió cargar al tocar. Medido después del cambio:

| | Antes | Después |
|---|---|---|
| Peso de la portada | 590.4 KB | **140.3 KB** |
| Peticiones | 31 | **14** |
| JavaScript | 425.6 KB | **0 KB** |
| Terceros | 450.1 KB | **0 KB** |
| LCP local | 1824 ms | **1372 ms** |
| LCP en vivo, en caliente | ~1900 ms | **1588–1932 ms** |

El mapa sigue siendo un mapa de Google real e incrustado. Lo que cambia es **quién
paga**: antes lo pagaba todo el que abría la portada; ahora solo quien lo pide.

El control dice **«Ver el mapa · lo carga Google»**: el visitante sabe que va a
invocar a un tercero *antes* de tocarlo, no después.

## Qué se acotó, y qué no

| Atributo | Para qué | ¿Sirvió? |
|---|---|---|
| `aspect-ratio: 4/3` en el contenedor | Reservar el alto antes de cargar | **Sí** · CLS 0.0007 |
| `loading="lazy"` | Que no lo pague quien no baja | **Casi no** · ver arriba |
| `title` | Un iframe sin título es un marco anónimo para un lector de pantalla | Sí |
| `referrerpolicy="no-referrer-when-downgrade"` | No mandarle a Google la ruta completa | Sí |
| Sin clave de API (`output=embed`) | Una clave es una cuenta, una tarjeta y una cuota que vigilar | Sí |

La URL se arma con **coordenadas**, no con la dirección en texto: geocodificar texto
puede caer en la calle de al lado, y las coordenadas salen de su propia ficha.

## Qué pasa si faltan las coordenadas

`Mapa.svelte` cae a la ranura etiquetada de siempre. El componente no asume que D-11
esté cerrada solo porque hoy lo está.

## Evidencia

| Qué | Dónde |
|---|---|
| El componente | `src/lib/componentes/Mapa.svelte` |
| La URL, armada desde `negocio.ts` | `src/lib/config/negocio.ts:209` |
| La medición | `herramientas/medir-mapa.mjs` |
| Presupuesto de JS del sitio, intacto | `node herramientas/presupuesto.mjs` · 0 KB en las 8 |

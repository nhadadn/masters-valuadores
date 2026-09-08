---
tipo: adr
id: ADR-0001
estado: PROPUESTA
fecha: 2026-09-08
---

# ADR-0001 · Lockup web derivado del logo, y de dónde sale la paleta

## Contexto

El cliente entregó el logo y pidió que **sea ese mismo**. La propuesta firmada
además excluye explícitamente el rediseño de logo o manual de marca (pág. 6).
Esta decisión no rediseña nada: resuelve cómo ese logo entra a un sitio web.

Archivo recibido: `99-assets/logo-actual-raster.jpg` — JPG, 821 × 820 px.

### Medición del archivo

Análisis de píxeles sobre el JPG recibido:

| Medida | Resultado |
|---|---|
| Formato | JPG raster, 821 × 820 px. **No hay vectorial** |
| Píxeles neutros (acero, fondo, cromo) | 85.4 % del lienzo |
| Píxeles amarillos | 3.2 % del lienzo |
| Amarillo, mediana | `#938A30` — oliva oscuro, no amarillo |
| Amarillo, 2 % más brillante | `#BEB44D` |
| Neutros p5 → p95 | `#161617` → `#7C7E82` |
| Neutro p99.9 (brillo del cromo) | `#DFE2E4` |

**El amarillo del logo no es un color: es un degradado texturizado.** Va de oliva
oscuro a oro pálido según el bisel y la textura de concreto. Cualquier hex que
saque de este JPG es un punto arbitrario de ese degradado, no un valor de marca.

### Contraste WCAG del amarillo medido

| Combinación | Ratio | Texto normal AA (4.5) |
|---|---|---|
| `#938A30` sobre blanco | 3.55:1 | **FALLA** |
| `#938A30` sobre `#F7F7F5` | 3.31:1 | **FALLA** |
| `#938A30` sobre `#2C3A3F` | 3.32:1 | **FALLA** |
| `#938A30` sobre negro | 5.92:1 | Pasa |

| Botón candidato | Etiqueta | Ratio | AA |
|---|---|---|---|
| Fondo `#BEB44D` | texto `#111` | 8.83:1 | Pasa |
| Fondo `#BEB44D` | texto `#FFF` | 2.14:1 | **FALLA** |
| Fondo `#2C3A3F` | texto `#FFF` | 11.77:1 | Pasa |

Consecuencia dura: **el amarillo nunca puede ser texto sobre fondo claro.** Solo
sirve como relleno de un bloque con etiqueta casi negra encima, o como acento
sobre fondo oscuro. El botón primario no puede ser amarillo con texto blanco.

## Problemas del archivo para uso web

1. **Sin vectorial.** No escala, no se recolorea, no se hace favicon limpio.
2. **Insignia circular con tipografía fina de cromo.** Por debajo de ~120 px
   "MASTERS VALUADORES" se vuelve una mancha gris. Un header móvil pegajoso usa
   40–48 px de alto.
3. **Es una insignia oscura.** El sitio es modo claro únicamente (requisito). Un
   disco casi negro sobre fondo blanco se lee como calcomanía pegada, no como
   identidad del sitio.
4. **Dos banderas dentro de la marca.** A tamaño favicon son dos manchones de
   color. Además anclan la marca a comercio transfronterizo, lo que empuja en
   dirección contraria a una categoría primaria de empeño — ver D-02 y D-05.
5. **Bisel, brillo, textura de concreto y viñeta radial.** Efectos de avatar de
   red social. Sobre fondo claro se ven sucios y no imprimen bien.

## Lo que sí sirve

El monograma **M** de dos tonos —chevron amarillo + chevron acero— es fuerte,
legible y reconocible a tamaño pequeño. Es el activo aprovechable.

## Opciones consideradas

| Opción | A favor | En contra |
|---|---|---|
| A · Usar el JPG tal cual en el sitio | Cero fricción con el cliente | Header borroso, favicon ilegible, no cumple el presupuesto de imagen, se ve barato |
| B · Derivar un lockup web del mismo logo | Misma identidad, misma M, legible a todo tamaño | Requiere el vectorial o revectorizar; requiere OK de Cristóbal |
| C · Rediseñar la marca | Resolvería todo | **Descartada.** Fuera de alcance por propuesta firmada, pág. 6 |

## Decisión

`__POR_CONFIRMAR__` — pendiente de Nadir y Cristóbal.

Propuesta: **opción B**, con este alcance y ni un milímetro más:

- La insignia circular completa se conserva intacta para redes, ficha de Google
  e impresos. No se toca.
- Para el sitio se deriva un **lockup horizontal**: monograma M plano de dos
  colores + "MASTERS VALUADORES" en tipografía web, sin bisel, sin textura, sin
  banderas, sin viñeta.
- Favicon: solo la M, plana, dos colores.
- Las banderas se recuperan como elemento gráfico dentro de la sección de
  importaciones, no dentro de la marca.

Esto no es un rediseño: es la versión técnica del mismo logo, igual que un
vectorial para bordado o un negativo para una sola tinta.

## Lo que hace falta para ejecutar

| Necesidad | Prioridad |
|---|---|
| Archivo vectorial del logo (`.ai`, `.eps`, `.svg` o `.pdf`) | Alta. Sin él hay que revectorizar la M a mano |
| Hex oficial del amarillo, si existe en algún manual | Alta. Hoy no se puede derivar del JPG |
| Autorización de Cristóbal para el lockup plano | Bloqueante |

## Consecuencias si se acepta

- Nace un token `--color-acento` con valor real, no muestreado de un degradado.
- El botón primario se resuelve en acero oscuro con texto blanco (11.77:1), y el
  amarillo queda como acento y estado de foco. Se documenta en el design system.
- El header y el favicon dejan de ser el cuello de botella de legibilidad.

## Consecuencias si se rechaza

Se usa el JPG. El header carga una imagen pesada y borrosa, el favicon es un
manchón, y el sitio deja de poder llamarse de primer nivel — hay que decirlo así
en el entregable, no maquillarlo.

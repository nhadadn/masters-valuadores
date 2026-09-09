---
tipo: especificacion
estado: PARCIAL — color y tipografía provisionales
actualizado: 2026-09-08
---

# Sistema de diseño · capa de tokens

Lienzo: artefacto «Masters Valuadores — Sistema de diseño».
Fuente de los artboards: `diseno/sistema/`.

Esta hoja es el contrato que el código debe cumplir. Nada aquí está implementado:
sube a IMPLEMENTADO archivo por archivo, con cita `ruta:línea`.

## Grados

| Capa | Estado | Origen |
|---|---|---|
| Rampa de acero | **Medida** | Percentiles de los píxeles neutros de `99-assets/logo-actual-raster.jpg` (85 % del archivo) |
| Contrastes | **Calculados** | Fórmula WCAG 2.1 sobre los hex de abajo |
| Monograma | **Reconstruido** | Geometría medida del JPG. No es el vectorial original |
| Acento | **Provisional** | Balance de blanco del propio cromo del logo + corrección de exposición |
| Familia tipográfica | **Provisional** | Ver [[ADR-0002-tipografia]] |

## Acero

| Token | Hex | Rol | Sobre blanco |
|---|---|---|---|
| `--acero-950` | `#14181A` | tinta primaria, anillo de foco | 17.87:1 |
| `--acero-900` | `#1C2225` | superficie oscura | 16.09:1 |
| `--acero-800` | `#2A3237` | acción primaria | 13.04:1 |
| `--acero-700` | `#3A4449` | marca sobre claro | 9.99:1 |
| `--acero-600` | `#4E595F` | tinta secundaria | 7.20:1 |
| `--acero-500` | `#667276` | borde de campo | 4.96:1 |
| `--acero-400` | `#8C979C` | el plata del monograma | 2.99:1 |
| `--acero-300` | `#B3BCC0` | deshabilitado, borde de card | 1.93:1 |
| `--acero-200` | `#D2D8DB` | separador | 1.44:1 |
| `--acero-100` | `#E7EBEC` | relleno suave | 1.20:1 |
| `--acero-050` | `#F4F6F7` | superficie alterna | 1.08:1 |

## Acento — `__POR_CONFIRMAR__`

| Token | Hex provisional | Uso permitido |
|---|---|---|
| `--oro-500` | `#CCB642` | relleno de bloque con etiqueta `--acero-950` encima (8.80:1), o sobre acero oscuro |
| `--oro-700` | `#9A8830` | borde del acento sobre superficie clara (3.54:1) |

Derivación reproducible: amarillo p85 del JPG = `#A79E3C`; ganancias de balance
tomadas del cromo del propio logo (1.055 / 0.995 / 0.955) y exposición ×1.157
hasta que ese cromo lea como plata. Resultado `#CCB642`.

## Dos restricciones duras que salen de la medición

1. **El acento nunca es texto ni bloque suelto sobre fondo claro.** `#CCB642` sobre
   blanco da 2.03:1 — por debajo del 3:1 exigido para elementos no textuales.
2. **El borde de campo es `--acero-500`, no `--acero-300`.** El gris claro da 1.93:1
   y desaparece a plena luz, que es la condición de uso de esta audiencia.

## Tipografía

Una sola familia, autoalojada, subset latino + diacríticas del español. Cero Google Fonts.

| Rol | px / interlínea / peso |
|---|---|
| display | 34 / 1.12 / 700 |
| h1 | 28 / 1.15 / 700 |
| h2 | 22 / 1.25 / 700 |
| h3 | 18 / 1.30 / 600 |
| cuerpo | 17 / 1.55 / 400 |
| cuerpo-fuerte | 17 / 1.55 / 600 |
| pie | 14 / 1.45 / 400 |
| etiqueta | 13 / 1.20 / 700 · tracking .12em |

Cuerpo a 17 px, no 16: la audiencia lee a un brazo de distancia, con sol y prisa.

## Espacio, radios, foco, táctil

- Espacio base 4: `4 8 12 16 24 32 48 64 96`. Margen lateral móvil 20. Entre secciones 48 / 96.
- Radios: `0` bloques · `4` campos · `8` botones · `999` pastillas.
- Foco: anillo 3 px `--acero-950`, separación 3 px. El acento no sirve de anillo.
- Táctil: 48 × 48 de casa, 44 × 44 piso absoluto, 8 de separación mínima.
- Movimiento: 120 ms táctil, 200 ms aparición, `ease-out`, bajo `prefers-reduced-motion`.

## Inventario de componentes

| Componente | Estado |
|---|---|
| Button (primario, secundario, terciario, acento) | especificado |
| WhatsAppCTA (bloque, en línea, barra fija) | especificado |
| Section | especificado |
| Card | especificado |
| Field (reposo, foco, error, inactivo) | especificado |
| Placeholder · ImageSlot | en uso en las maquetas |
| Breadcrumb | **BLOQUEADO** por D-05 — en una landing única no tiene jerarquía |

## Regla que sostiene el test de publicación

Ningún componente escribe un teléfono, horario, precio ni nombre legal. Todo sale de
`src/lib/config/business.ts`. Si un dato se filtra a un componente, el test que
bloquea el build de producción deja de servir.

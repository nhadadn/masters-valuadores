---
tipo: especificacion
estado: PARCIAL — acento en dirección B sin confirmar por el cliente; tipografía cerrada
actualizado: 2026-09-10
---

# Sistema de diseño · capa de tokens

Lienzo: artefacto «Masters Valuadores — Sistema de diseño».
Fuente de los artboards: `diseno/sistema/`.

Esta hoja es el contrato que el código debe cumplir. Nada aquí está implementado:
sube a IMPLEMENTADO archivo por archivo, con cita `ruta:línea`.

## Grados

| Capa | Estado | Origen |
|---|---|---|
| Negro y crema | **Medidos** | Moda y mediana de dos publicaciones distintas del cliente (posts de maquinaria e importaciones), que dieron el mismo valor |
| Oro `--oro-500` | **Medido, con criterio** | Moda del logotipo de joyería en monograma y texto. El arte tiene degradado metálico: elegir un valor único de esa familia es decisión, no lectura. Ver [[ADR-0005-acento-corporativo]] |
| Pasos `--oro-300` y `--oro-700` | **Derivados** | El mismo tono subido y bajado en valor desde `#B58000` |
| Rampa de neutros | **Derivada** | Escalonada desde el negro de marca `#0C0D0F` |
| Contrastes | **Calculados** | Fórmula WCAG 2.1 sobre los hex de abajo |
| Monograma | **Reconstruido** | Geometría medida de la insignia; asignación de color corregida contra el arte plano. No es el vectorial |
| Familia tipográfica | **Decidida y medida** | Archivo. Tres candidatas medidas en navegador sobre los woff2 reales — [[ADR-0002-tipografia]] |

Identidad que gobierna: la plana — [[ADR-0004-identidad-plana]], enmendado en el
acento por [[ADR-0005-acento-corporativo]] (dirección B, oro corporativo).

## Neutros

| Token | Hex | Rol | Sobre blanco |
|---|---|---|---|
| `--negro-950` | `#0C0D0F` | tinta primaria, acción primaria, anillo de foco | 19.44:1 |
| `--negro-900` | `#16181B` | superficie oscura | 17.79:1 |
| `--negro-800` | `#232629` | presionado | 15.21:1 |
| `--negro-700` | `#33373B` | hover del primario | 12.00:1 |
| `--negro-600` | `#474C51` | tinta secundaria | 8.68:1 |
| `--negro-500` | `#5F656B` | borde de campo | 5.90:1 |
| `--negro-400` | `#848A90` | piso de borde no-texto | 3.49:1 |
| `--negro-300` | `#AEB4B9` | deshabilitado | 2.09:1 |
| `--negro-200` | `#D3D7DA` | separador | 1.45:1 |
| `--negro-100` | `#E9EBED` | relleno suave | 1.20:1 |
| `--crema-050` | `#F0EFED` | superficie alterna | 1.08:1 |

## Acento — dirección B

| Token | Hex | Uso permitido |
|---|---|---|
| `--oro-300` | `#D6A52F` | oro sobre superficie oscura (8.59:1 sobre `--negro-950`): texto pequeño, trazos finos, íconos |
| `--oro-500` | `#B58000` | relleno de bloque sobre blanco (3.47:1) y color del monograma. Etiqueta `--negro-950` encima: 5.60:1 |
| `--oro-700` | `#8C6300` | oro como **texto** sobre superficie clara (5.38:1, pasa AA) y como borde |

`#B58000` es la moda del oro del logotipo de joyería, medida por separado en el
monograma y en el texto, y reaparece como `#B57700` en el logo rugged con banderas.
Tres piezas, dos líneas de negocio.

El amarillo industrial `#E7C041` **no se descartó**: queda reservado como posible
acento de sección para maquinaria, importaciones, taller, fletes y renta. Activarlo
abre un ADR nuevo — es la dirección C del [[ADR-0005-acento-corporativo]].

## Tres restricciones duras que salen de la medición

1. **El bloque de acento ya se sostiene solo sobre blanco**: 3.47:1. Sobre
   `--crema-050` cae a **3.02:1** — pasa sin margen, así que ahí va sobre blanco
   o con borde `--oro-700`.
2. **Para escribir en oro se usa `--oro-700`** (5.38:1, pasa AA). `--oro-500` como
   texto sobre claro da 3.47:1 y no alcanza. Sobre superficie oscura el oro sube a
   `--oro-300`.
3. **El borde de campo es `--negro-500`, no `--negro-300`.** El gris claro da 2.09:1
   y desaparece a plena luz, que es la condición de uso de esta audiencia.

## Tipografía — Archivo

**Archivo**, una sola familia, autoalojada, subset latino + diacríticas del español.
Cero Google Fonts. Decidida el 10 de septiembre contra Inter y Barlow con métricas
medidas en navegador — [[ADR-0002-tipografia]].

Archivos en el repo: `static/fuentes/archivo-latin-{400,600,700}-normal.woff2` · 42 KB
los tres juntos.

| Medida | Archivo |
|---|---|
| Altura de x a 17 px | 9.0 px |
| Proporción x / mayúscula | 0.763 |
| Caracteres por renglón a 350 px | 45 |
| Peso de los tres pesos, subset latino | 42 KB |

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

**El h1 de 28 px no cabe en un renglón para los nombres de giro largos.** «Renta de
maquinaria y equipo» mide 392 px contra 350 disponibles. La escala no se encoge: se
diseña para dos renglones, y la tarjeta de giro lleva alto fijo para que la retícula
de ocho no se desalinee. Medido, no estimado — `diseno/sistema/medir-tipografia.mjs`.

## Espacio, radios, foco, táctil

- Espacio base 4: `4 8 12 16 24 32 48 64 96`. Margen lateral móvil 20. Entre secciones 48 / 96.
- Radios: `0` bloques · `4` campos · `8` botones · `999` pastillas.
- Foco: anillo 3 px `--negro-950`, separación 3 px. El acento no sirve de anillo.
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
| Breadcrumb | especificado — desbloqueado por [[ADR-0003-alcance-multigiro]] |

## Regla que sostiene el test de publicación

Ningún componente escribe un teléfono, horario, precio ni nombre legal. Todo sale de
`src/lib/config/business.ts`. Si un dato se filtra a un componente, el test que
bloquea el build de producción deja de servir.

---
tipo: adr
estado: ACEPTADA
id: ADR-0009
fecha: 2026-09-10
decide: Nadir
revierte_parcialmente: ADR-0007-lenguaje-visual
implementa: Claude Code
---

# ADR-0009 · Entran fotografías de banco, como provisionales

## Qué se decide

**Entran fotografías de archivo al sitio.** Una en la portada y una por cada giro.

Esto **revierte** una parte del [[ADR-0007-lenguaje-visual|ADR-0007]]. Su sección «Lo
que NO se toma de sus piezas» decía, textual:

> **«La maquinaria de banco.** Sus piezas usan imágenes de archivo o generadas. **En el
> sitio van fotos suyas o va hueco.»**

Y `RanuraImagen.svelte` decía: *«Nada de banco de imágenes ni marcadores
fotorrealistas: una foto de archivo en una maqueta se convierte en una expectativa que
el cliente no puede cumplir.»*

Decidido por **Nadir**, 10 de septiembre de 2026, tras plantearse la objeción por
escrito y reafirmarse la instrucción.

## La objeción, registrada

Se dijo antes de hacerlo y se deja aquí para que exista cuando alguien pregunte:

1. **Se renuncia a la única ventaja competitiva identificada.** Se revisó la competencia
   el mismo día: First Cash, Empeño Fácil, Monte de Piedad y Patrón Oro —el local más
   parecido, en Av. Juárez de Torreón— **ninguno enseña su local**. Las cadenas no
   pueden. Con foto de banco, el sitio se vuelve indistinguible de ellos justo donde
   podía ganarles.
2. **Una foto de archivo es una promesa.** Quien ve una excavadora impecable y llega a
   un patio distinto se siente engañado, y esa es la clase de daño que no se corrige
   con una disculpa.
3. **El [[ADR-0007-lenguaje-visual|ADR-0007]] estima que las fotos son la mitad de lo
   que falta.** Rellenar esa mitad con material ajeno no la cierra: la tapa.

Nada de eso es un veto. Es el costo, escrito antes de pagarlo.

## Cómo se limita el daño

Cuatro decisiones que acompañan a la principal:

**1 · Se marcan como provisionales, en pantalla.** Cada foto lleva un rótulo visible
que dice que es de archivo y que se sustituye. No es letra chica: es el mismo criterio
que la banda de BORRADOR del copy propuesto.

**2 · Ninguna finge ser la fachada.** El hueco `FOTO — FACHADA DEL LOCAL` **no se
rellena con un local ajeno**. Poner el escaparate de otro negocio, con su rótulo, no
es una foto genérica: es el negocio de otro presentado como el de Cristóbal. Esa ranura
sigue abierta y el [[brief-de-fotos]] sigue vigente.

**3 · Sin logotipos de terceros ni personas identificables.** Se revisó cada una.

**4 · Se revierte en un commit.** Las fotos viven en `static/fotos/` y entran por un
solo componente. Quitarlas es borrar una carpeta y cambiar una bandera.

## Procedencia y licencia

| | |
|---|---|
| Fuente | [Pexels](https://www.pexels.com/license/) |
| Licencia | Uso comercial permitido, sin atribución obligatoria |
| Prohibido por esa licencia | Sugerir que las personas retratadas respaldan el negocio; revender la foto tal cual |
| Archivos | `static/fotos/*.jpg`, dos anchos por foto |

## Peso, que para esta audiencia sí importa

Medido. **Cada página carga UNA sola foto**, no las diez:

| Foto | 800 px | 1600 px |
|---|---|---|
| portada · maquinaria | 68 KB | 237 KB |
| empeño | 65 KB | 198 KB |
| maquinaria | 79 KB | 284 KB |
| fletes | 85 KB | 267 KB |
| taller | 46 KB | 122 KB |

El sitio venía pesando entre 2.8 y 4.5 KB de HTML comprimido y **0 KB de JavaScript**.
Una foto de 68 KB es **quince veces** todo lo que pesaba la portada. Por eso:

- `srcset` con dos anchos: un teléfono de 390 px descarga el de 800, no el de 1600.
- `loading="lazy"` en todo lo que no sea la portada.
- `width` y `height` declarados, para que el hueco esté reservado y **el CLS siga en cero**.

El presupuesto de CA-10 son 40 KB de **JavaScript** y no se toca: sigue en 0. Pero el
peso de imagen es nuevo y se reporta aparte, porque la audiencia es teléfono de gama
baja sobre 4G.

## Qué reabre esto

Cuando lleguen las fotos de Cristóbal —el [[brief-de-fotos]] está listo para
ejecutarse—, estas salen y no queda rastro. Si no llegan nunca, esta decisión deja de
ser provisional por omisión, y eso sería el peor resultado posible: conviene ponerle
fecha.

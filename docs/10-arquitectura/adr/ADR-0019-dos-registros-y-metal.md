---
tipo: adr
id: ADR-0019
estado: ACEPTADA
fecha: 2026-09-11
decide: Nadir
enmienda: ADR-0012-tema-oscuro
implementa: Claude Code
---

# ADR-0019 · Dos registros, como su marca · y el oro vuelve a ser metal

## De dónde sale

> *«El cliente quiere más estilos frescos y no tan negros, pero tampoco blancos.»*
> *«¿Podemos aplicar algunas imágenes en 3D? Que se vea top tier futurista.»* — Nadir

Y de la tanda del 11 de septiembre, que dio la evidencia para contestar las dos sin
inventar nada. Ver [[evidencia-tanda-11-septiembre]].

## 1 · Su marca tiene DOS registros. El sitio se había quedado con uno

Veinticuatro piezas suyas y se separan en dos familias:

| Registro | Piezas | Cómo se ve |
|---|---|---|
| **Industrial** | 1–8, 16, 19, 21–23 | Campo **claro de acero**, negro pesado, oro, diagonales |
| **Lujo** | 11–14, 18, 20, 24 | Negro o **mármol blanco**, oro, serifas y cursiva |

El [[ADR-0012-tema-oscuro|ADR-0012]] había puesto el sitio entero en negro. Con su
material delante, eso es **más oscuro que su propia marca**.

Vuelve el registro claro, y con él la rampa de acero del
[[ADR-0010-degradados-de-superficie|ADR-0010]] — que ya existía, ya tenía sus ratios
calculados y se había quedado sin usar. No se empieza de cero: se recupera trabajo.

### Cómo, y por qué costó tan poco

`Seccion.svelte` llevaba escrito, desde que todo se fue a negro:

> «Las tres variantes quedan como el mismo cristal; se conservan porque todavía
> resuelven tintas y porque **volver a diferenciarlas es cambiar esto y nada más**.»

**Se cumplió.** `crema` pasa a ser el registro claro cambiando **el valor de los
roles**, no el CSS de los componentes. Tarjetas, huecos, botones, insignias y el
destello leen los mismos nombres y se dan la vuelta solos. Ningún componente sabe en
qué registro está.

### Y de paso esquiva un riesgo que llevaba tres ADR sin medirse

El ADR-0012 anotó, tres veces, que un sitio negro es lo que su audiencia
—«un teléfono de gama baja, a plena luz del día»— desaconseja, y que la prueba del
sol nunca se hizo. **La mitad de las páginas deja de estar expuesta a ese riesgo.**

## 2 · El «3D top tier» se resuelve con metal, no con renders

Lo que se pidió fue 3D futurista. Lo que se hizo es otra cosa, y conviene decir por
qué:

- **No se inventan renders de su maquinaria.** Sería lo que el
  [[ADR-0009-fotografia-de-banco|ADR-0009]] restringe, y además llegaron **fotos
  reales de su patio** en la misma tanda: cambiarlas por 3D genérico sería tirar lo
  único que ninguna cadena puede copiar.
- **«Futurista» no es su marca.** Su lenguaje es industrial pesado y lujo clásico:
  serifas, oro, mármol, metal. Eso es *premium*, que es otra cosa y les queda mejor.

La veta que sí es suya está en el tablero de marca: **el «M» de acero y oro con
relieve**. `--metal-oro` lleva ese acabado a las superficies de oro — un degradado en
diagonal que baja a oro sombra y vuelve a subir, como el metal pulido con luz de lado,
más un filo de luz de un píxel.

**El acabado cuesta contraste y queda anotado.** Negro sobre cada stop:

```
#F2D883  13.82:1      #E7C041  11.12:1      #C9A438   8.19:1  ← el peor
```

El oro plano daba 11.12:1 en todo el bloque; ahora el peor punto da 8.19:1. Sigue muy
por encima del 4.5, pero es menos.

## Lo que el validador cazó, y que yo había roto

Tres cosas, y ninguna se habría visto mirando una captura.

**a) Redefiní un token cuyo nombre miente.** `--tinta-sobre-oscuro` parecía significar
«la tinta del fondo de la sección» y significa lo que dice: tinta sobre superficie
OSCURA. Lo puse en negro para el registro claro y el rótulo «FOTO DE ARCHIVO» —que
pinta su propia pastilla oscura— quedó **negro sobre negro, 1:1, en las cuatro
tarjetas de la portada**.

**b) Un oro literal escrito en un componente.** `.apuesta .fuente { color:
var(--oro-500) }` daba 1.75:1 al cambiar de registro. Es la misma bomba de relojería
de siempre y van cuatro veces en este repo.

**c) El fondo en degradado sin color plano.** Ya documentado y repetido: un
`background-image` deja el `background-color` transparente y la medición se va al
ancestro. Se declara siempre el **peor** extremo.

## La regla del oro sobre claro, que ya estaba escrita

`tokens.css` lo decía desde el principio: *«el oro como texto va sobre `--superficie`
o sobre oscuro, NUNCA sobre `--superficie-alterna`»*. El campo de acero es esa
superficie alterna.

Medido: `--oro-800` sobre `--acero-100` da **3.36:1**. Pasa el piso de 3 del texto
grande y no el 4.5 del normal — el validador lo cazó en «Cómo llegar», 17 px negrita.

Se usa el par de tokens que ya existía para esto:

```
--oro-texto         texto normal → en claro NO hay oro. Va tinta.
--oro-texto-grande  display      → oro, con 3.36:1
```

Es exactamente lo que hacen sus piezas claras: en la nº 8 el titular grande va en oro
y todo lo demás en negro. **No se inventa un oro más oscuro** para tapar el caso:
sería un color que la marca no usa, y `tokens.css` ya lo prohíbe por escrito.

## Lo que NO se hizo

- **Serifas para el registro de lujo.** Su material de joyería las usa y Archivo no
  tiene. Meter una segunda familia son bytes nuevos y una decisión aparte.
- **Repartir registros por giro.** Hoy alternan por SECCIÓN, como ya hacía la página.
  Asignar «claro para empeño y joyería, oscuro para maquinaria y fletes» es el
  siguiente paso y depende de si joyería vuelve a ser giro.

## Evidencia

| Qué | Dónde |
|---|---|
| El registro claro | `src/lib/componentes/Seccion.svelte` · `.crema` |
| La rampa y el metal | `src/lib/estilos/tokens.css` |
| Metal en el botón y la regla | `Boton.svelte`, `ReglaDorada.svelte` |
| Contraste en los dos registros | `validar-a11y.mjs` · CUMPLE 16/16 |
| Las piezas del ADR-0007 intactas | `medir-piezas.mjs` · CUMPLE 12/12 |

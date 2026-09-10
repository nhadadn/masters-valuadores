---
tipo: adr
id: ADR-0004
estado: ACEPTADA — enmendada en el acento por ADR-0005
fecha: 2026-09-10
enmendada: 2026-09-10 por [[ADR-0005-acento-corporativo]]
cierra: parte de D-01 y D-06
---

# ADR-0004 · La identidad del sitio es la plana negro y amarillo

> **Enmienda del 10 de septiembre.** Lo que este ADR decide sobre el *tratamiento*
> —plano, sin bisel ni textura— y sobre la *grafía* —`MASTERS`— sigue vigente sin
> cambios. Lo único que se enmienda es el **valor del acento**: pasa de `#E7C041`
> (medido de los posts de maquinaria) a `#B58000` (medido del logotipo de joyería).
> La razón y los ratios están en [[ADR-0005-acento-corporativo]].

## Contexto

El 10 de septiembre aparecieron cuatro tratamientos de marca distintos, todos en uso
por el cliente:

| # | Tratamiento | Dónde vive |
|---|---|---|
| 1 | Insignia circular metálica «MASTERS VALUADORES», banderas | Foto de perfil de redes |
| 2 | Rugged con banderas «MÁSTER VALUADORES», otra M, otro metal | Pieza suelta |
| 3 | Oro y script «MÁSTER JOYERÍA / Master valuadores» | Sub-marca de joyería |
| 4 | **Plano negro y amarillo «MASTERS VALUADORES»** | Publicaciones de maquinaria e importaciones |

Y tres grafías del nombre: `MASTERS`, `MÁSTER`, y `mastervaluadores@outlook.com` sin la S.

Un sitio de nueve páginas repite esa inconsistencia nueve veces.

## Decisión

**Gobierna el tratamiento 4: plano, negro y amarillo.** Los otros tres no se usan en el sitio.

La grafía comercial en el sitio es **MASTERS**, como el arte que el cliente ya publica.
El **nombre legal** sigue en `__POR_CONFIRMAR__` para avisos legales y ficha de Google (D-01).

Decidido por: Nadir, 10 de septiembre de 2026.

## Por qué

- Es el único que ya está en plano — sin bisel, sin textura, sin viñeta.
- Es el único legible en un encabezado de celular y como ícono de 16 px.
- Su paleta es medible y **coincide entre dos piezas independientes**.
- Es el que el cliente está usando activamente en sus campañas.

## Consecuencias

- La rampa de acero derivada de la insignia **se retira**. El sistema pasa a neutros
  anclados en el negro de marca. Ver [[sistema-de-diseno]].
- El acento deja de ser provisional: `#E7C041`, medido.
  **Enmendado el 10 de septiembre a `#B58000`** — ver ADR-0005. `#E7C041` no se
  descarta: queda reservado como posible acento de sección para las líneas pesadas.
- El monograma corrige su asignación de color: el brazo superior derecho va en amarillo.
  Es un listón doblado que alterna color en cada pliegue.
- La joyería pierde su registro dorado dentro del sitio. Si el cliente lo pide de vuelta,
  entra como variante de sección, no como identidad, y abre un ADR nuevo.
  **Esto es justamente lo que pasó**: el ADR-0005 trajo el oro de vuelta, pero como
  acento del sistema entero, no como variante de una sola sección.

## Lo que sigue pendiente

- El **archivo vectorial**. Quien diseña las publicaciones del cliente lo tiene: no se
  produce ese arte plano sin él. Es el pedido concreto que destraba la geometría exacta
  y cierra la elección de tipografía.
- **D-01**, el nombre legal.
- **D-06**, la autorización de Cristóbal para el lockup web. Ojo: puede que ya no haga
  falta pedirla como tal, porque el lockup plano ya es suyo y ya lo publica.

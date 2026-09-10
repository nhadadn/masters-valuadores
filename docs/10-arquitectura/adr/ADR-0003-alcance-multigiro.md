---
tipo: adr
id: ADR-0003
estado: ACEPTADA
fecha: 2026-09-09
cierra: D-05
---

# ADR-0003 · El sitio es multigiro bajo la marca MÁSTER

## Contexto

Había dos lecturas del alcance y ninguna era invención nuestra:

- La **propuesta firmada** del 28 de julio (pág. 4) describe una landing de una
  página, ocho secciones, centrada en empeño y préstamo.
- La **ficha del proyecto** describe ocho giros bajo una sola marca.

Además, Cristóbal había declarado que su objetivo es salir en el mapa de Google
al buscar giros como «bazar» y «joyería» — cosa que la primera lectura no cumple.

Las dos rutas se le presentaron el 9 de septiembre de 2026 en el lienzo
«Masters Valuadores — Dos rutas», con lo que cada una gana y lo que cada una cuesta.

## Decisión

**Ruta B.** Cristóbal eligió la arquitectura multigiro: una portada que reparte
y una página propia por cada giro, todas bajo la marca MÁSTER.

Decidido por: Cristóbal, 9 de septiembre de 2026.

## Consecuencias

Lo que se abre:

- El sitio deja de ser una página y pasa a ser una portada más una página por giro.
- El `@graph` lleva `department`, uno por giro. Ver [[jsonld-graph]].
- **Breadcrumb vuelve al inventario** de componentes: ahora hay jerarquía de dos
  niveles donde vivir.
- Cada giro compite por su propia búsqueda: ocho puertas de entrada en vez de una.
- Las banderas del logo dejan de ser un misterio — importaciones tiene página.

Lo que esto obliga:

- **Ocho paquetes de contenido**, no uno. Fotos, requisitos y textos reales por giro.
  Es el costo real de esta ruta y ya se le dijo así al cliente antes de que eligiera.
- Publicación por fases: un giro vacío arrastra a los demás hacia abajo.
- Más superficie que auditar: cada página nueva es más contraste y más táctil que validar.

Lo que **no** destraba:

- La **categoría primaria de Google** sigue siendo una sola y sigue sin decidirse.
  Es D-02 y sale de la Etapa 1, no de esta decisión.
- El **orden de prioridad** de los giros y los términos exactos de búsqueda por
  cada uno: también Etapa 1.
- **D-04** — si importaciones es otra entidad legal, es otro negocio en Google y
  no un `department`.
- **D-03** — si existe el servicio de avalúos periciales.

## Alternativa descartada

Ruta A, landing única de empeño. Se descartó porque incumple el objetivo declarado
por el propio cliente y porque obligaría a rehacer la arquitectura en cuanto quisiera
posicionar bazar o joyería.

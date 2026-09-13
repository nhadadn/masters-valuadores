# Masters Valuadores · contrato de trabajo

Sitio multigiro para **Masters Valuadores**, Torreón, Coahuila. Cliente: Cristóbal.
Consultoría: **Nazmelia**. Este archivo es el contrato: léelo completo antes de tocar nada.

---

## Cómo se trabaja aquí

**SDD.** Nada se implementa sin spec aprobada. Las specs viven en `docs/20-specs/`
y pasan por BORRADOR → EN REVISIÓN → BLOQUEADA → APROBADA → IMPLEMENTADA → OBSOLETA.

**C4.** La forma del sistema está en `docs/10-arquitectura/c4/`. Nivel 4 no se mantiene
a propósito.

**ADR.** Toda decisión cara de revertir nace como ADR en `docs/10-arquitectura/adr/`.
No se borran: una decisión mala documentada vale más que una buena olvidada.

### Grados de evidencia — no negociables

| Grado | Qué significa |
|---|---|
| **A** | Hay un test que corre y pasa |
| **B** | Hay código de producción, citable como `ruta/archivo:línea` |
| Planeado | Existe una spec. **No** es implementado |
| Nada | Una mención en un README, un comentario, un TODO, un nombre de variable |

- **Nunca declares algo implementado sin cita `ruta/archivo:línea`.**
- **Ante la duda entre dos estados, elige el más bajo y dilo.**
- Distingue siempre «planeado» de «implementado».
- No asumas convenciones de este repo sin verificarlas **en este repo**.
- Si una instrucción choca con la documentación, **detente y pregunta**. No resuelvas
  el conflicto por tu cuenta.

### Tono

Cero adulación y cero optimismo de cortesía. Si algo no está listo, la frase es
«no está listo», no «está en camino». Un hallazgo negativo bien evidenciado vale más
que uno positivo mal sustentado.

---

## Lo que NO se inventa, nunca

Esta es la línea que sostiene el proyecto entero. Se marca y se sigue:

- **Cifras**: precios, tasas, plazos, porcentajes, aforos.
- **Horarios, dirección, teléfono, WhatsApp, razón social.**
- **Qué bienes aceptan.** Si el sitio dice que aceptan algo que no aceptan, el
  visitante llega, se va y no vuelve.
- **Reseñas, testimonios, superlativos** («los mejores de la Laguna»).
- **Categoría primaria de Google** — sale de la Etapa 1, no de la intuición.
- **Slugs definitivos** — el slug es la promesa que el sitio le hace a Google sobre
  qué contiene la página. Salen del estudio de búsqueda.

Todo eso se marca `__POR_CONFIRMAR__` y el build de producción **falla** si sobrevive.

### Lo que SÍ se puede redactar

Corregido el 10 de septiembre. Redactar no es inventar afirmaciones:

- **Sí**: titulares, subtítulos, etiquetas de sección, descripciones de un giro que
  solo digan lo que ese giro es por definición, texto de interfaz.
- **Siempre**: marcado como **propuesta** para que el cliente corrija, nunca publicado
  como hecho, y sin una sola afirmación que no se pueda respaldar.
- La regla operativa: un formulario en blanco no regresa; un borrador regresa marcado.

---

## Estado

| Capa | Estado |
|---|---|
| Etapa 1 · Data Intelligence | **NO EJECUTADA** — es el cuello de botella del SEO |
| Sistema de diseño | Cerrado y verificado |
| Fase 0 · armazón | **IMPLEMENTADA** · 10/10 criterios, 31 tests |
| Contenido | **CERO**. Es el trabajo que sigue |
| Descubribilidad | **IMPLEMENTADA** · SPEC-0003 · 10/10. Título, descripción, canónica, tarjeta de enlace, `sitemap.xml` y `robots.txt` |
| Publicación | Bloqueada por el **dominio** (D-07) y por el copy. El NAP ya no la bloquea |
| Registros visuales | **DOS** · crema cálido y oscuro, como su material · `ADR-0019` · el claro pasó de acero a crema y empeño lleva mármol · `ADR-0020` |
| JavaScript | **Solo en `/empeno-y-prestamo/`** · 11.2 KB propios, sin marco ni librería · `ADR-0021`, `ADR-0023` y `ADR-0026`. Las otras siete en 0 KB |
| Fotografías reales | **OCHO** · seis del patio · `ADR-0022`, más dos de su joyería · `ADR-0024`. El hero de empeño ya es suyo. **Falta autos**; monedas entró de banco · `ADR-0025` |
| Indexación | **Apagada a propósito** hasta que cierre D-07 · `ADR-0013` |

### Decisiones cerradas

| Qué | Dónde | Quién |
|---|---|---|
| Multigiro bajo la marca MÁSTER | `ADR-0003` | Cristóbal |
| Identidad plana | `ADR-0004` | Nadir |
| **La marca se escribe `MASTER`, sin S** — revierte la grafía del 0004 | `ADR-0018` | Cristóbal |
| Acento `#E7C041` — el que la marca sí publica | `ADR-0006` | Nadir · revierte el `ADR-0005` |
| **Lenguaje visual derivado de sus publicaciones** | `ADR-0007` | Nadir · **falta implementarlo** |
| Tipografía Archivo, autoalojada | `ADR-0002` | Nadir |
| SPEC-0001 aprobada e implementada | `SPEC-0001` | Nadir |
| **Sin dominio el sitio no se deja indexar** — se abre solo al cerrar D-07 | `ADR-0013` | Nadir |

Tablero de lo abierto: `docs/30-cliente/decisiones-pendientes.md`.

---

## Arquitectura

```
src/lib/config/negocio.ts   ÚNICA fuente de datos del negocio. Hay un test que lo vigila
src/lib/datos/              giros e íconos
src/lib/estilos/            tokens.css · fuentes.css · base.css. Ningún componente escribe un color
src/lib/componentes/        los primitivos. CERO librería de UI
src/lib/seo/jsonld.ts       el @graph. Lanza excepción si falta un dato
src/lib/seo/enlaces.ts      origen del sitio, inventario de páginas, sitemap y robots
src/lib/seo/meta.ts         título y descripción de cada ruta. TODAS son propuesta
src/routes/                 8 páginas, todas prerenderizadas · ADR-0008
herramientas/               presupuesto de JS, accesibilidad, peso y generadores de imagen
```

### Tres decisiones que hay que respetar

**1 · Cero marco en el cliente.** `csr = false` en `src/routes/+layout.ts:28`.
Medido: el runtime de Svelte 5 más el enrutador pesan 46 KB gzip por página contra un
presupuesto de 40. No se subió el presupuesto: se quitó el runtime. El acordeón usa
`<details>` nativo.

**Enmendado el 11 de septiembre · `ADR-0021`.** Aquí decía «cero JavaScript» y ya no
es literal: `/empeno-y-prestamo/` sirve **11.2 KB** de script propio —la banda de
monedas del `ADR-0021`, los puntos del carrusel del `ADR-0023` y la pausa del planeta
del `ADR-0026`—. Las otras siete
páginas siguen en 0 KB y el presupuesto sigue en 40.

La regla que queda es más estrecha, no más laxa: **nada de marco, nada de librería, y
lo que entre lo paga su ruta**. `csr` sigue en `false`; el script es un archivo de
`static/` que no arrastra bundle. Si una pantalla necesitara interacción de verdad,
`csr = true` en ESA ruta — pero eso son 46 KB antes de escribir nada, así que la
respuesta por defecto es no.

**2 · CA-08 no es un test, es el build.** `src/lib/seo/jsonld.ts:135`. El grafo se arma
durante el prerender, así que la excepción revienta la publicación. `npm run build`
sale con código 1 hoy, y **eso es correcto**. Escotilla: `npm run build:revision`.

**3 · Una sola ruta `[giro]`.** Las cuatro páginas de giro son la misma plantilla.
`entries()` en `src/routes/[giro]/+page.ts:14` las prerenderiza igual.

---

## LO PRIMERO QUE HAY QUE HACER · ADR-0007

El armazón está de pie y **se ve genérico**. Es una crítica aceptada, no una opinión:
el sistema codifica pisos —contraste, táctil, bytes— y ninguna voz. El resultado es que
nada está mal y nada es de nadie.

El [[ADR-0007-lenguaje-visual|ADR-0007]] está ACEPTADO y **sin implementar**. Define
seis piezas sacadas de las publicaciones vivas del cliente, no del gusto de nadie:
la diagonal, la banda de contacto, las insignias circulares, el titular a dos tintas
en peso 900, la arista del botón primario y la regla dorada.

**Léelo completo antes de tocar un estilo.** Trae las reglas, las restricciones que no
se negocian y lo que NO se toma de sus piezas. Ninguna de las seis rompe el cero
JavaScript ni el contraste: todas son CSS.

El peso 900 de Archivo ya está en `static/fuentes/` — 13.2 KB, medido — pero **no está
cableado**. Es parte del trabajo.

### Números medidos, no estimados

8 páginas · **0 KB de JS en siete**, 11.2 KB en `/empeno-y-prestamo/` · HTML de 3.5 a
6.5 KB gzip · 131 tests · contraste mínimo 7.73:1 · objetivo táctil mínimo 44 px ·
16/16 combinaciones página × ancho cumplen · 12/12 de las piezas del ADR-0007.

**LCP de empeño: ~2350 ms medido intercalado** · `ADR-0026` · 173.5 KB, 0 de terceros. Las cifras sueltas de esta página NO valen: la máquina dio 4356, 8948 y 7636 ms para el mismo código. En las otras tres de giro, 1888–1904 ms desde el `ADR-0023`. La foto de entrada
llevaba `loading="lazy"` siendo el elemento LCP, en las cuatro, desde el `ADR-0009`.
Vale cerca de un segundo y se destapó midiendo otra cosa.

La banda de monedas, medida contra la misma página sin ella y en la misma fase:
**+509 ms de hilo mientras caen**, **+66 ms ya asentadas**, cero tareas largas, y 49
fps con el reloj a 1/4. `node herramientas/medir-monedas.mjs`.

Titular más largo: «Renta de maquinaria y equipo» mide 392 px a h1 28/700 contra 350
disponibles. **No cabe en un renglón en ninguna tipografía.** Por eso la tarjeta de giro
lleva alto fijo: 176 a 390 de ancho, 150 a 1280.

---

## Verificación

```
npm test                              # grafo, giros, fugas, tokens, SEO y CA-10 · 125 tests
npm run build                         # DEBE fallar mientras falten datos
npm run build:revision                # permisivo, para medir
node herramientas/presupuesto.mjs     # CA-10 · TODO el JS de cada página y terceros
node herramientas/medir-portada.mjs   # peso real y LCP en 4G · RUTA=/empeno-y-prestamo/ para otra
npx serve build -l 5180               # en una terminal…
node herramientas/validar-a11y.mjs    # …y esto en otra (BASE=http://127.0.0.1:5180)
node herramientas/medir-monedas.mjs   # ADR-0021 · lo que cuesta la banda de empeño
cd diseno/sistema  && python verificar-contraste.py   # usan rutas relativas:
cd diseno/pantallas && node validar.mjs               # hay que entrar a su carpeta
```

Antes de declarar cualquier cosa terminada: corre lo que aplique y **reporta el
resultado real**, no el esperado.

---

## Lo que falta, y nada de esto es técnico

1. **~~NAP~~ · CERRADO el 11 de septiembre** con la ficha de Google que mandó Nadir.
   Dirección, horarios y coordenadas están en `negocio.ts`; el grafo bajó de 14 marcas
   a 7. Lo que queda del bloque: [[ficha-de-google]] y la decisión D-17, abajo.
2. **Copy** — hoy son 27 huecos etiquetados. Se redacta como propuesta, ver arriba.
3. **Fotos** — **parcialmente resuelto el 11 de septiembre** por el `ADR-0022`: entraron
   seis fotografías reales de su patio, recortadas de sus propias piezas, y viven en la
   retícula de empeño. Siguen pendientes: **los ORIGINALES** —las que hay vienen dentro
   de arte comprimido por WhatsApp y miden entre 440 y 985 px— y sobre todo **joyería,
   que no tiene ni una**. Lo que Nadir extrajo del Instagram son gráficos
   de redes con maquinaria de banco, no fotos del local. **El hueco de la fachada sigue
   abierto y es el activo más caro del proyecto**: es la única ventaja real frente a
   First Cash, y el ADR-0007 estima que las fotos son la mitad de lo que falta para que
   el sitio deje de verse plano. Ningún CSS las sustituye.
4. **Nombre legal** (D-01) · **dominio** (D-07) · **categoría de Google** (D-02).
5. **Destino del formulario** (D-13) — un sitio estático no procesa envíos solo.
6. **Confirmar el acento** (D-14) y conseguir el **vectorial** del logo (D-06).

## Contexto que cambia las prioridades

El sitio pesa **~15 %** del posicionamiento local. La ficha de Google pesa 32 %, las
reseñas 20 % y los directorios 6 %.

**Corregido el 11 de septiembre.** Aquí decía que Masters estaba en cero en esos 58
puntos. **No lo está, y el matiz cambia la acción.** La ficha de Google **existe**:
categoría `Bazar`, una reseña de 4,0, sin sitio web — y **SIN RECLAMAR**. Evidencia
completa en [[ficha-de-google]].

Así que la recomendación no es «abre tu ficha»: es **reclamarla**, que es más corto y
más urgente. Una ficha sin reclamar la puede reclamar un tercero, y cualquiera puede
sugerirle cambios de dirección u horario que Google aplica. Sigue yendo **antes que el
sitio**.

La audiencia: alguien que necesita liquidez hoy, buscando desde un teléfono de gama
baja, a plena luz del día, con prisa. Cada decisión técnica de este repo sale de ahí.

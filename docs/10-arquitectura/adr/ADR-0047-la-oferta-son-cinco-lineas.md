---
tipo: adr
id: ADR-0047
estado: ACEPTADA
fecha: 2026-09-16
decide: Cristóbal, transmitido por Nadir
enmienda: ADR-0008 · ADR-0014 · ADR-0041
cierra: D-03 · D-04 · D-18
abre: D-19 · D-20
implementa: Claude Code
---

# ADR-0047 · La oferta son cinco líneas

## Qué pidió el cliente

> *«Sería así: Empeño · Venta · Financiamiento · Fletes · Taller. El cliente está
> pensando en acotar las necesidades y soluciones que ofrecemos. Necesitamos eliminar
> todo rastro de cualquier otro negocio… Tenemos logística, lo cual va para afuera. Y
> tenemos un bloque de bloqueados, el cual también necesitamos eliminar.»* — Nadir

## Lo que se preguntó antes de tocar

Tres de esas palabras dejaban abierto **qué** se ofrece, y eso es de lo que este repo no
inventa. Se preguntó y se contestó:

| Pregunta | Respuesta de Nadir |
|---|---|
| ¿«Venta» de qué? | **De todo lo que tienen**: maquinaria, herramienta, autos y lo que no se recupera del empeño |
| ¿Qué financian? | **La compra de maquinaria** |
| El segundo teléfono, «Joyería · con cita» | **Se quita** |
| La foto de la fachada, cuyo letrero dice «contenedores marítimos» y «valuaciones» | **Se queda**: es su local, no oferta del sitio |

«Financiamiento» no llega de la nada. El [[ADR-0008-alcance-de-cuatro-giros|ADR-0008]]
había sacado «financiera», y su propia publicación `post-maquinaria-lista.jpg` anuncia
**«FINANCIAMIENTO · IMPORTACIÓN · VENTA»** sobre maquinaria. De esas tres, importación
sale del sitio; venta y financiamiento son dos de las cinco.

## Decisión

| Antes · 4 líneas + 3 bloqueadas | Ahora · 5 líneas | Ruta |
|---|---|---|
| Empeño y préstamo | **Empeño y préstamo** · sin cambio | `/empeno-y-prestamo/` |
| Compra venta de maquinaria | **Venta de maquinaria, herramienta y autos** | `/venta/` |
| — | **Financiamiento de maquinaria** · vuelve | `/financiamiento/` |
| Fletes y logística | **Fletes** | `/fletes/` |
| Taller y refaccionaria | **Taller** | `/taller/` |
| Importaciones · D-04 | sale | — |
| Avalúos periciales · D-03 | sale | — |
| Bazar · D-18 | sale | — |

**Empeño conserva nombre y ruta.** Su negocio no cambió, y «préstamo» es cómo funciona
el empeño, no otro negocio.

**Los slugs cambian ahora porque ahora es gratis.** Siguen siendo provisionales
(`SLUGS_PROVISIONALES`) y el sitio no se indexa (ADR-0013). Las rutas viejas redirigen
con **307 y no 301** en `vercel.json`: el slug definitivo sale del estudio de búsqueda, y
un permanente se queda guardado en los navegadores.

### Lo que dice cada línea, y de dónde sale

| Afirmación | Fuente |
|---|---|
| Venden maquinaria, herramienta y autos | `letrero` · «MAQUINARIA, HERRAMIENTAS, AUTOS Y MÁS…» |
| Venden equipo industrial y agrícola | `publicacion` · «VENTA DE EQUIPOS INDUSTRIALES Y AGRÍCOLAS» |
| Venden prendas de empeño | `deducido` · confirmado por Nadir al elegir «todo lo que tienen» |
| Financian la maquinaria que venden | `publicacion` + respuesta de Nadir |

**Lo que NO se publica:** tasas, plazos, requisitos, montos, ni el «a tu medida» de su
publicación, que promete condiciones que nadie ha dado. El test de SEO rechaza precios,
porcentajes y plazos en títulos y descripciones.

## Tres defectos que ya existían, y que las líneas nuevas habrían agravado

1. **Las páginas de línea titulaban sus secciones con las preguntas de empeño.** Fletes
   decía «¿Cuánto me dan y cuándo?» sobre su proceso; Venta lo habría dicho donde quien
   paga es el cliente. Ahora cada línea puede dar sus títulos (`tituloBienes`,
   `tituloProceso`): «¿Qué tienen a la venta?», «¿Cómo compro?», «¿Cómo funciona?», «¿Qué
   transportan?», «¿Cómo lo cotizo?», «¿Cómo es el servicio?».
2. **Los discos del planeta pedían un préstamo en todas las líneas.** El mensaje era
   siempre «quiero saber cuánto me pueden prestar». Ahora sale del dato
   (`preguntaBien`): en venta, «me interesa comprar»; en fletes, «quiero cotizar un flete».
3. **Bajo el titular, «Valuamos…» valía para todas.** Fletes publicaba «Valuamos
   maquinaria pesada y carga general», y Venta habría dicho que valúa lo que vende. El
   verbo es ahora de la línea (`verboBienes`): Vendemos, Movemos; Valuamos queda para
   empeño.

## Cuatro fallos propios, cazados antes de publicar

1. **La cabecera a 768 px.** Cinco líneas y Contacto pedían 729 px en 672. No desbordaba
   —el validador y la medición de desborde daban cero—, pero el navegador **encogía el
   monograma hasta borrarlo y aplastaba el botón de llamar**. Se vio en la captura. Ni
   el logotipo ni el botón encogen ya, y entre 768 y 1023 px los enlaces bajan a 15 px con
   medio relleno. Medido de 768 a 1280: monograma de 26 px, botón de 48×48, 34 px o más
   de aire y un renglón.
2. **Al arreglarla, cerré a la mitad el bloque de 768 px.** El WhatsApp flotante, la
   rejilla del pie y el ocultado de la barra fija quedaron dentro de un bloque que acaba
   en 1023: en escritorio habría vuelto la barra de teléfono y desaparecido el flotante.
   Cazado leyendo la estructura del CSS, y verificado con estilos computados en 390, 768,
   900, 1024 y 1280.
3. **El hover del menú daba 2.44:1.** Era `--oro-800`, medido sobre marfil, y el
   ADR-0046 cambió el suelo a acero. Pasa a `--negro-950` —10.19:1— con el oro de
   subrayado.
4. **Un «NO CUMPLE» que no era de este sitio.** El validador contra el puerto 5180 dio
   las cuatro páginas nuevas en «21:1 · 9999 px» y la portada en 3.47. Era **el servidor
   de la sesión paralela** del ADR-0045, que servía su rama en ese puerto: `/venta/` daba
   404. Se midió en un puerto propio (`--no-port-switching`) y dio 18/18. La lección: en
   un repo con dos sesiones, un puerto conocido no garantiza a quién le estás midiendo.

Y uno de maquetación: con cinco tarjetas, «Venta de maquinaria, herramienta y autos»
ocupaba cuatro renglones a 390 px y desalineaba la fila. **Las tarjetas de la portada
llevan el nombre corto**, como lo dice el cliente, y el largo se queda en el titular de su
página.

## Lo medido

| | |
|---|---|
| Páginas | **9** · 8 antes |
| Accesibilidad | **18/18 CUMPLE** · 9 páginas × 2 anchos |
| Contraste mínimo | 4.00 portada y empeño · 4.83 venta, financiamiento, fletes y taller · 6.29 contacto y legales |
| Tests | **153** |
| CA-10 | cumplido · **35.55 KB** de margen |
| CA-08 | `npm run build` sale con **código 1** |
| JS por página | empeño 4.45 KB · venta y fletes 2.05 · las otras **seis** en 0 |
| Rastros en el HTML construido | **0** de «logística», «refacción», «contenedores marítimos», «importación», «avalúo», «pericial», «bazar», «compra venta», «BLOQUEADOS», D-03/D-04/D-18, el teléfono de joyería y «Valuaciones» |

## Lo que se conserva a propósito

- **La foto de la fachada**, con su letrero real. Y dos textos alternativos que describen
  lo que se ve —«un contenedor amarillo» en la fachada y el camión con contenedor de la
  foto de archivo de fletes—: describen una imagen, no ofrecen un negocio.
- **Joyería como bien de empeño**: oro y joyería, relojes y monedas. Lo que salió es el
  teléfono de joyería como línea aparte.
- **El tipo `bloqueado`** en `giros.ts`: es la forma de enseñar una línea sin prometer su
  página, aunque hoy no haya ninguna.

## Lo que queda abierto

- **D-19 · Condiciones del financiamiento.** Qué máquinas, requisitos, tasa, plazos. Hasta
  que el cliente las dé, la página dice qué se financia y cómo se pide, nada más. Conviene
  que confirme también qué obliga la ley a mostrar cuando se anuncia un crédito, antes de
  publicar cifras.
- **D-20 · La lista de lo que se vende.** Autos y prendas de empeño salieron del letrero y
  de la respuesta de Nadir; conviene que Cristóbal la vea escrita.
- **D-02 se agrava.** La ficha de Google clasifica el negocio como **Bazar**, y bazar ya no
  es oferta del sitio. La categoría la cambia quien reclame la ficha (D-17).
- **Los dos rótulos «FOTO DE ARCHIVO»** de fletes y taller siguen, sin decidir desde el
  ADR-0031.
- **El ADR-0045 va en paralelo** y también toca `+layout.svelte`. Al unir, el índice de
  ADRs choca y se resuelve dejando las dos filas.

## Evidencia

| Qué | Dónde |
|---|---|
| Las cinco líneas | `src/lib/datos/giros.ts:244` · `:245` · `:246` · `:247` |
| Los bloqueados fuera | `src/lib/datos/giros.ts:251` |
| Títulos, mensaje y verbo por línea | `src/lib/datos/giros.ts:99` · `:102` · `:105` |
| Donde se usan | `src/routes/[giro]/+page.svelte:76` · `:197` · `:316` · `PlanetaBienes.svelte:68` |
| La portada: titular, tarjetas y rejillas | `src/routes/+page.svelte:90` · `:145` · `:147` · `:357` · `:370` |
| La cabecera | `src/routes/+layout.svelte:53` · `:260` · `:269` · `:280` |
| La cinta | `src/lib/componentes/CintaPalabras.svelte:33` |
| Sin teléfono de joyería | `src/lib/config/negocio.ts:211` |
| Títulos y descripciones | `src/lib/seo/meta.ts:72` · `:76` |
| El conteo del grafo | `src/lib/seo/jsonld.test.ts:50` |
| Las redirecciones | `vercel.json:11` |
| Las herramientas | `herramientas/auditar-fondos.mjs:21` · `herramientas/medir-piezas.mjs` |
| Cómo queda | `capturas/oferta-tablero.png` · `capturas/oferta-portada-lineas-390.png` · `capturas/oferta-cabecera-768.png` |

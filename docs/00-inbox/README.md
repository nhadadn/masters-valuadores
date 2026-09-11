---
tipo: proceso
estado: vigente
---

# Bandeja de entrada · aquí se deja lo que manda el cliente

**Todo lo que llegue de Cristóbal —fotos, audios, capturas, documentos, listas— se
deja aquí tal cual llega.** Sin renombrar a mano, sin recortar, sin corregir.

## Por qué existe esta carpeta y no se sube directo a `static/`

`static/fotos/` es el sitio **publicado**: lo que va ahí lo descarga un visitante.
Esta carpeta es **material en bruto**, y la diferencia importa por tres razones:

1. **Un original amplio sirve para todo; uno ya recortado, para nada.** Del 4:3
   grande salen después el 16:9 de la portada, el 4:3 de la ficha de Google y el 1:1
   del perfil. Al revés no se puede.
2. **Lo que entra al sitio pasa por optimización**: cuatro anchos, tres formatos —
   AVIF, WebP y JPEG— generados con `herramientas/hacer-miniaturas.mjs`,
   `hacer-webp.mjs` y `hacer-avif.mjs`. Una foto suelta en `static/` se salta eso y
   pesa cinco veces lo que debería.
3. **Aquí se puede dudar.** En `static/` no: lo que está ahí, se publica.

## Cómo dejar las cosas

**Arrástralas a `docs/00-inbox/` y ya.** Si puedes, agrupa por tanda:

```
docs/00-inbox/2026-09-11-fotos-cristobal/
docs/00-inbox/2026-09-11-audios/
```

El nombre del archivo puede ser el que traiga el teléfono —`IMG_4821.jpg` está bien—
pero si sabes qué es, decirlo ahorra una pregunta:

```
fachada-tarde.jpg          mostrador-01.jpg
taller-trabajando.jpg      excavadora-patio.jpg
```

## Lo que me ayuda saber, aunque sea en una línea

Con las fotos, **cualquier cosa de esto vale más que un nombre bonito**:

- **¿Es del negocio o es de internet?** Es la pregunta que más pesa. Una foto suya
  entra sin rótulo; una de archivo entra teñida y con la etiqueta «FOTO DE ARCHIVO»
  encima, por el [[ADR-0009-fotografia-de-banco|ADR-0009]].
- **¿De qué giro es?** Empeño, maquinaria, fletes o taller.
- **¿Sale alguien reconocible?** Si es cliente o empleado, hace falta su permiso —
  ver el apartado legal del [[brief-de-fotos]].
- **¿Hay bienes de clientes a la vista?** Una joya con grabado o un aparato con número
  de serie es información de un tercero y no se publica.

Si mandó audios o texto, déjalos igual: de ahí salen los huecos de contenido, y
**prefiero su frase textual a mi redacción** — el contrato dice que se corrige encima
de un borrador, no que yo invente mejor.

## Qué hago yo con esto

1. Lo leo y te digo qué resuelve y qué sigue faltando.
2. Lo que sea foto del negocio se procesa a los cuatro anchos y tres formatos, y
   entra a `static/fotos/` — que es cuando deja de ser material y pasa a ser sitio.
3. Lo que sea dato —horarios, bienes, cifras— va a `src/lib/config/negocio.ts` o a
   `src/lib/datos/giros.ts`, que son las dos fuentes únicas, nunca a una plantilla.
4. Lo que sea decisión suya se anota en [[decisiones-pendientes]] y cierra su D-XX.

**Nada se borra de aquí.** Aunque una foto no entre al sitio, queda el registro de
qué mandó y cuándo.

## Lo que NO va aquí

- Nada que ya esté en `static/` — eso ya es sitio.
- Capturas de pantalla de este mismo sitio: para eso está
  `herramientas/capturar.mjs`.
- Archivos de más de 50 MB. Un repositorio de git no es un disco duro; si llega un
  video pesado, se deja en otro lado y aquí solo el enlace.

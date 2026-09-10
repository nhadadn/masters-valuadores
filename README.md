# Masters Valuadores

Sitio multigiro para Masters Valuadores, Torreón, Coahuila. Consultoría: Nazmelia.

## Cómo correrlo

```
npm install
npm run dev              # desarrollo
npm test                 # 31 tests
npm run build            # producción · FALLA a propósito mientras falten datos
npm run build:revision   # permisivo, para medir y revisar
```

`npm run build` sale con código 1 y nombra los datos que faltan. No es un error del
proyecto: es [CA-08](docs/20-specs/SPEC-0001-armazon-fase-0.md) haciendo su trabajo.
Publicar con marcas vivas le diría a Google datos que nadie confirmó.

Para revisar el sitio mientras tanto: `npm run build:revision`, que avisa a gritos en
consola y no debe usarse para desplegar.

## Cómo está armado

| Carpeta | Qué hay |
|---|---|
| `src/lib/config/negocio.ts` | **Única** fuente de datos del negocio. Todo lo demás lo lee de aquí |
| `src/lib/datos/` | Los giros y los íconos |
| `src/lib/estilos/` | Tokens, fuentes y reset. Ningún componente escribe un color |
| `src/lib/componentes/` | Los primitivos. Cero librería de UI |
| `src/lib/seo/jsonld.ts` | El `@graph`. Lanza excepción si falta un dato |
| `src/routes/` | 11 páginas, todas prerenderizadas |
| `herramientas/` | Presupuesto de JS y validación de accesibilidad |
| `docs/` | Vault de Obsidian. C4 + SDD |
| `diseno/` | Fuentes de los lienzos publicados |

## Reglas que sostienen el proyecto

1. **Nada se implementa sin spec aprobada.** SDD. Ver `docs/20-specs/`.
2. **Nada se declara implementado sin cita `ruta/archivo:línea`.**
3. **Ningún dato de negocio vive fuera de `negocio.ts`.** Hay un test que lo vigila.
4. **Cero JavaScript en el cliente.** El runtime no cabía en el presupuesto y resultó
   que no hacía falta. Ver `src/routes/+layout.ts`.
5. **No se inventa contenido.** Ni un titular, ni una foto, ni una cifra.

## Verificación

```
npm test                              # grafo, giros, fugas de datos
node herramientas/presupuesto.mjs     # CA-10, tras un build
node herramientas/validar-a11y.mjs    # contraste y táctil, sobre el sitio construido
python docs/../diseno/sistema/verificar-contraste.py   # los ratios de las hojas de diseño
```

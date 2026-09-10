# Primeros pasos

Requisitos: **Node 20 o superior** y **npm**. Nada más.
Comprueba con `node -v`. Si no lo tienes: https://nodejs.org (versión LTS).

## 1 · Instalar y verificar

Abre PowerShell en la carpeta del proyecto y corre, en este orden:

```powershell
cd "D:\Proyectos\Máster Cristóbal"
npm install
npm test
```

Debe terminar con **31 tests en verde**. Si sale rojo, algo se rompió en el camino
y hay que revisarlo antes de seguir.

## 2 · Ver el sitio

```powershell
npm run dev
```

Abre la dirección que imprima (normalmente `http://localhost:5173`).
Para verlo como se ve en un celular: F12 y el ícono de dispositivo, con el ancho en 390.

Rutas que existen hoy:

```
/                          portada repartidora
/empeno-y-prestamo/        página de giro
/joyeria/  /bazar/  /taller-y-refaccionaria/
/fletes-y-logistica/  /renta-de-maquinaria/  /financiera/
/contacto/  /aviso-de-privacidad/  /terminos/
```

## 3 · El build de producción FALLA, y está bien

```powershell
npm run build
```

Sale con error y nombra los 16 datos que faltan. **No es un bug**: es el criterio
CA-08 de la SPEC-0001. El grafo de datos estructurados se arma durante el build, y
publicar con marcas `__POR_CONFIRMAR__` le diría a Google datos que nadie confirmó.

Para revisar el sitio construido sin publicarlo:

```powershell
npm run build:revision
npx serve build
```

Ese avisa a gritos en consola y no debe usarse para desplegar.

## 4 · Verificadores

```powershell
npm test                                  # grafo, giros y fugas de datos de negocio
node herramientas/presupuesto.mjs         # CA-10, después de un build
npx serve build                           # en una terminal
node herramientas/validar-a11y.mjs        # en otra: contraste y táctil, 22 combinaciones
python diseno/sistema/verificar-contraste.py
node diseno/pantallas/validar.mjs
```

## 5 · Commits pendientes

El puente entre esta sesión y tu computadora escribe archivos pero no puede correr
git, así que el repo tiene todo el trabajo sin commitear. Estos tres commits lo dejan
al día:

```powershell
cd "D:\Proyectos\Máster Cristóbal"
git add docs/
git commit -m "docs: ADR-0002 a ADR-0005, tablero de decisiones y SPEC-0001 aprobada"

git add diseno/ static/
git commit -m "diseno: lienzo de paletas, sistema rebaseado a direccion B y pantallas Fase 0"

git add src/ herramientas/ tests/ package.json svelte.config.js vite.config.ts tsconfig.json .gitignore README.md PRIMEROS-PASOS.md
git commit -m "feat: armazon Fase 0 - tokens, primitivos, rutas, JSON-LD y verificadores"

git log --oneline | head -5
```

## Si algo no funciona

| Síntoma | Qué pasa |
|---|---|
| `npm run build` falla nombrando datos | Correcto. Ver el punto 3 |
| `npm install` no baja nada | Sin conexión, o npm detrás de proxy corporativo |
| `node` no se reconoce | Node no está instalado o no está en el PATH |
| Los tests fallan | Avísame con la salida completa: eso sí es un problema |

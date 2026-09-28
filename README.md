# soleando-dr

## Pruebas

Requieren Node.js 24. `npm run test` ejecuta validadores reales y rutas HTTP sin servicios externos. `npm run typecheck` verifica TypeScript.

`npm run test:integration` requiere Docker Desktop activo y puertos 55320–55329, 55330 y 8583 libres. Construye la aplicación, crea un stack Supabase temporal con las migraciones del repositorio y verifica sesiones reales de Better Auth, lectura del perfil, aislamiento de viajeros entre cuentas, permisos de administración y carga de imágenes en Storage. Descarga la CLI fijada en 2.117.0 y las imágenes necesarias en la primera ejecución.

Las cuentas verificadas se crean sólo en la base temporal con contraseñas aleatorias. Se validan login y logout con contraseña; el registro, envío de correo y Google OAuth no están cubiertos por esta suite. No se copian archivos de entorno ni metadatos de enlace remoto al stack. Al terminar, se eliminan los contenedores, volúmenes y archivos de esa ejecución. Evita interrumpir el proceso durante la limpieza; si ocurre, identifica el proyecto `soleando-test-*` de esa ejecución y detén únicamente ese proyecto con `supabase stop --project-id <id> --no-backup`.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

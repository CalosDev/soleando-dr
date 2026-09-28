# soleando-dr

## Pruebas

Requieren Node.js 24. `npm run test` ejecuta validadores reales y rutas HTTP sin servicios externos. `npm run typecheck` verifica TypeScript.
Detén `next dev` de este mismo checkout antes de ejecutar suites que construyen la aplicación, para evitar escrituras simultáneas sobre tipos generados y caché.

`npm run test:integration` requiere Docker Desktop activo y puertos 55320–55329, 55330 y 8583 libres. Construye la aplicación, crea un stack Supabase temporal con las migraciones del repositorio y verifica sesiones reales de Better Auth, lectura del perfil, aislamiento de viajeros entre cuentas, permisos, carga y optimización de imágenes, y acciones reales para crear, editar, publicar y archivar el catálogo. Comprueba borradores ocultos, rechazo de duplicados, datos de cruceros y sitemap. Descarga la CLI fijada en 2.117.0 y las imágenes necesarias en la primera ejecución.

Las cuentas verificadas se crean sólo en la base temporal con contraseñas aleatorias. Se validan login y logout con contraseña; el registro, envío de correo y Google OAuth no están cubiertos por esta suite. No se copian archivos de entorno ni metadatos de enlace remoto al stack. Al terminar, se eliminan los contenedores, volúmenes y archivos de esa ejecución. Evita interrumpir el proceso durante la limpieza; si ocurre, identifica el proyecto `soleando-test-*` de esa ejecución y detén únicamente ese proyecto con `supabase stop --project-id <id> --no-backup`.

## Configuración de producción

- `DATABASE_URL`, `BETTER_AUTH_SECRET` y `BETTER_AUTH_URL`: conexión PostgreSQL y sesiones de Better Auth. Las credenciales administrativas no se guardan en el repositorio.
- `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`: necesarias para subir imágenes al bucket `soleando-media`. Exclusivamente server-side; la clave nunca lleva prefijo `NEXT_PUBLIC_`. Al cambiar la URL se requiere reconstruir el deployment para actualizar los dominios permitidos de Next/Image.
- `EMAIL_PROVIDER=resend`, `RESEND_API_KEY` y `EMAIL_FROM` de un dominio verificado: necesarios para registro, verificación de correo y recuperación de contraseña. La presencia de una clave no demuestra que el dominio o la entrega funcionen: probar un correo real.
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`: OAuth web, con callback `${BETTER_AUTH_URL}/api/auth/callback/google` registrado en Google. Esta aplicación usa Better Auth, no el callback de Supabase Auth.
- `NEXT_PUBLIC_APP_URL`: URL pública canónica del dominio efectivamente conectado a Vercel. No cambiar DNS sin autorización.

El editor permite galería de hasta 10 imágenes, fechas/frecuencia de salidas, inclusiones, exclusiones, recomendaciones y campos de cada tipo. Las etapas de experiencias se escriben una por línea: `horario o día | título | descripción`. Los cruceros usan un puerto por línea. Usa únicamente precios, fechas e inclusiones reales y confirmados. Las reservas hoteleras y pagos se completan en Grupo González; esta web no almacena reservas ni simula disponibilidad.

`SOLEANDO_LOCAL_INTEGRATION=1` es exclusivamente para la suite aislada: permite optimizar imágenes del loopback exacto del stack temporal. No configurarlo en Vercel.


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

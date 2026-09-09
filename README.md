# soleando-dr

## Configuración local

1. Copia `.env.example` como `.env.local` y completa `DATABASE_URL`, `BETTER_AUTH_SECRET` y `BETTER_AUTH_URL`.
2. Aplica `supabase/migrations/20260908045842_initial_schema.sql` al proyecto de Supabase.
3. Crea el primer administrador una sola vez con `pnpm auth:create-admin`. El comando toma las credenciales de las variables `SOLEANDO_ADMIN_*` y se niega a continuar si ya existe un administrador.
4. Elimina las variables `SOLEANDO_ADMIN_*` del entorno después del bootstrap y ejecuta `pnpm dev`.

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



# soleando-dr

## Configuración local

1. Copia `.env.example` como `.env.local` y completa `DATABASE_URL`, `BETTER_AUTH_SECRET` y `BETTER_AUTH_URL`.
2. Aplica `supabase/migrations/20260908045842_initial_schema.sql` al proyecto de Supabase.
3. Crea el primer administrador una sola vez con `pnpm auth:create-admin`. El comando toma las credenciales de las variables `SOLEANDO_ADMIN_*` y se niega a continuar si ya existe un administrador.
4. Elimina las variables `SOLEANDO_ADMIN_*` del entorno después del bootstrap y ejecuta `pnpm dev`.

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_nzFuBOzUKPOuQvwkE9SaJYMgjoC4)

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

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

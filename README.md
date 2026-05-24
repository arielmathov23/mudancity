# Mudancity

Marketplace POC para vender muebles de mudanza. Next.js App Router + Supabase Auth/Storage/RLS.

## Setup

1. Copiá `.env.example` a `.env.local` y completá las credenciales de Supabase.

2. Ejecutá la migración en el SQL Editor de Supabase:
   - [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)

3. Creá el bucket de Storage `item-photos` (público) en Supabase Dashboard.

4. Habilitá Google OAuth y email/password en Supabase Auth.

5. Instalá y corré:

```bash
npm install
npm run dev
```

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Landing |
| `/p/[slug]` | Publicación pública |
| `/p/[slug]/ofertar` | Formulario de oferta (auth) |
| `/login` | Login Google + email |
| `/onboarding` | Completar email/teléfono |
| `/mis-ofertas` | Ofertas del comprador |
| `/owner` | Panel vendedor |
| `/owner/analytics` | KPIs POC |

## Stack

- Next.js 16 (App Router)
- Supabase Auth + Postgres + Storage
- TanStack Query + ShadCN-style UI
- Turquoise minimalist mobile-first design

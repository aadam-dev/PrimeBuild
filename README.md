# Prime Build

E-commerce platform for building and construction materials in Ghana. Wholesale-backed retail with proforma quotes, stakeholder approval, and reliable fulfillment for contractors and builders.

## Overview

Prime Build connects buyers with trusted suppliers. Customers get formal proforma receipts, share them for approval, then complete purchase on the platform. Fulfillment is via partner suppliers or coordinated delivery—no warehouse required at launch.

## Repo

- **App:** Next.js 15 (App Router), Tailwind CSS, shadcn/ui, Supabase (optional).
- **Docs:** Business plan and SRS in `docs/plan/` and `docs/srs/`.

## Run without Supabase

You can run the app with **mock data and localStorage** (no database):

1. **Node:** Use Node 20+ (see `package.json` engines).
2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

- **Catalogue:** Categories and products are from mock data.
- **Cart / Proformas / Orders:** Stored in the browser (localStorage). Same device only.
- **Share link:** Proforma share links only work on the same browser where the proforma was created until Supabase is connected.
- **Auth:** Sign-in shows “not configured” until you add a Supabase project and set `.env.local` (see `.env.local.example`).

## Run with database (Neon + Better Auth)

1. Create a **Postgres** database (e.g. [Neon](https://neon.tech)).
2. Copy `.env.local.example` to `.env.local` and set:
   - `DATABASE_URL` — Postgres connection string
   - `BETTER_AUTH_SECRET` — e.g. `openssl rand -base64 32`
   - `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` — your app URL
3. Run migrations: `npm run db:push` (or apply `drizzle/0000_primebuild_init.sql` manually).
4. Optionally seed categories and products: `npm run db:seed`.
5. Run `npm run dev` — auth, cart, proformas, and orders use the DB when configured.

Optional: set `PAYSTACK_SECRET_KEY` and `RESEND_API_KEY` (and `RESEND_FROM_EMAIL`) in `.env.local` for payments and email. See `.env.local.example` for all variables.

**Production:** Use Node 20+ for build (`npm run build`). Secrets (`BETTER_AUTH_SECRET`, `PAYSTACK_SECRET_KEY`, `RESEND_API_KEY`, `DATABASE_URL`) are server-only; never use `NEXT_PUBLIC_` for them. Security headers (X-Frame-Options, X-Content-Type-Options, etc.) are set in `next.config.ts`.

## License

Proprietary.

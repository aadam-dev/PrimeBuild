# Prime Build — Supabase

This folder contains migrations for **Prime Build only**. Use a **dedicated Supabase project** for Prime Build (do not run these migrations on a project used by other apps).

## Setup

1. Create a new project at [Supabase Dashboard](https://supabase.com/dashboard) (e.g. “Prime Build”).
2. In the project root, set in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Prime Build project URL  
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Prime Build project anon key
3. Apply the schema using one of the options below.

## Applying the schema

**Option A — SQL Editor (Dashboard)**  
In your Prime Build Supabase project: SQL Editor → New query → paste the contents of `migrations/20250215000000_primebuild_schema.sql` → Run.

**Option B — Supabase CLI**  
From the project root, link and push:

```bash
npx supabase link --project-ref YOUR_PRIME_BUILD_PROJECT_REF
npx supabase db push
```

Replace `YOUR_PRIME_BUILD_PROJECT_REF` with the ref from your project URL (e.g. `https://xxxxx.supabase.co` → ref is `xxxxx`).

## Tables (this project only)

- `profiles` — extends `auth.users`
- `categories`, `products` — catalogue
- `cart_items` — user cart
- `proformas`, `proforma_items` — quotes
- `orders`, `order_items` — orders
- `approval_actions` — proforma approve/decline

All are in the `public` schema with RLS enabled.

# PORTUGOOOL

**The sound of the goal. The shirt for the moment.**

Ecommerce storefront for PORTUGOOOL — a Portuguese-inspired soccer fan
apparel brand. Premium game-day shirts released in limited drops.

> **Independence note:** PORTUGOOOL is an independent fan brand. All designs
> and marks are original. Nothing here uses or references official federation,
> club, league, player, or sportswear-company intellectual property.

## Stack

- **Next.js 14** (App Router, TypeScript, Tailwind CSS)
- **Netlify** — hosting (`@netlify/plugin-nextjs`)
- **Supabase** — products, orders, newsletter signups
- **Stripe Checkout** — payments (placeholder route ready for real keys)
- **Resend** — transactional email (later)
- **Printful / Printify** — fulfilment (later)

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in keys as you get them (optional to start)
npm run dev                  # http://localhost:3000
```

The site runs fully on **mock product data** (`src/lib/products.ts`) with no
env vars — Supabase and Stripe are only needed when you flip on the real
database and live checkout.

## Environment variables

See [.env.example](.env.example). Summary:

| Variable | Needed for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Stripe redirect URLs |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Reading products from Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server writes (newsletter, orders) |
| `STRIPE_SECRET_KEY` | Live checkout |
| `RESEND_API_KEY` | Order emails (later) |

## Supabase (new, dedicated project)

1. Create a **new** Supabase project (do not reuse an existing one).
2. Run the migrations in order:
   - `supabase/migrations/0001_initial_schema.sql` — tables + RLS
   - `supabase/migrations/0002_seed_products.sql` — Drop 01 seed data

   Either paste them into the SQL editor, or link the CLI and `supabase db push`.
3. Copy the project URL + keys into `.env.local` / Netlify env vars.

Tables: `products`, `orders`, `order_items`, `newsletter_signups`.
RLS is on everywhere; only active products are publicly readable.

## Stripe

`src/app/api/checkout/route.ts` is fully wired for Stripe Checkout:

- Without a real `STRIPE_SECRET_KEY` it returns a friendly "checkout isn't
  live yet" message (the UI shows it in the cart).
- With a key, it creates a Checkout Session with **server-side prices**
  (clients can never set their own price), shipping address collection,
  and per-line-item metadata (product id, size, color, custom name/number).

**TODO before launch** (marked in the route file):

1. Create a dedicated Stripe account/keys for PORTUGOOOL.
2. Add a `checkout.session.completed` webhook that inserts `orders` +
   `order_items` rows and triggers the Resend confirmation email.
3. Point product reads at Supabase instead of the mock catalog.

## Deploy to Netlify (new site)

1. Push this repo to a **new** GitHub repository (`portugooool-site`).
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
   `netlify.toml` already sets the build command, Next.js plugin, and Node 20.
3. Add the environment variables in **Site settings → Environment variables**
   (at minimum `NEXT_PUBLIC_SITE_URL` set to the live URL).
4. Deploy.

## Replacing placeholder images

Product images live in `public/products/*.svg` and are referenced in
`src/lib/products.ts` (and the Supabase seed). To swap in real photography,
drop files into `public/products/` and update the `images` arrays — nothing
else needs to change.

## Project structure

```
src/
  app/                 # routes: /, /shop, /shop/[slug], /drop, /about,
                       #         /faq, /contact, /cart, /success
    api/checkout/      # Stripe Checkout session (POST)
    api/newsletter/    # Email capture (POST)
  components/          # Header, Hero, ProductCard, ProductDetail, ...
  lib/                 # types, mock catalog, cart context, supabase clients
supabase/migrations/   # SQL schema + seed
public/products/       # placeholder product images (replace with photos)
```

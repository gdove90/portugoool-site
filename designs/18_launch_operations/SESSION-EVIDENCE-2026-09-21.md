# Launch session evidence — 2026-09-21

Read with TASK-LIST.md. Everything below was verified live this session,
not inferred from local files.

## PRIORITY 1 — database access RESOLVED, migration 0026 APPLIED

**Root cause of the "authentication blocker".** The Supabase MCP connector
is authenticated to a different Supabase account/org. `list_projects`
through it returns exactly one project, `localchefri`. GOOOL's project
`oexibflpshttgzmdvhpr` is in its own org and is invisible to that
connector. The failure was never a password problem with the GOOOL
database — it was the connector pointing somewhere else. Nothing was run
against `localchefri`.

Resolved by using the authenticated Supabase SQL editor, which is the
workflow every migration header already names.

**Migration status found (read-only LAUNCH-DB-CHECK):**

| Check | Found |
|---|---|
| `products` | present |
| `orders` | present |
| `order_items` | present |
| `stripe_events` | MISSING |
| `order_shipments` | MISSING |
| 7 Stripe/fulfillment columns on `orders` | 0 of 7 present |
| Athletics catalog rows (`80000000-%`) | 0 |

Migration 0026 was NOT applied. Every column the webhook writes was
absent, so the payment -> webhook -> order -> tracking flow could not have
succeeded. 0027/0028/0029 are also unapplied (no Athletics rows).

**0026 applied** after inspection. It is purely additive and idempotent:
`create table if not exists`, `add column if not exists`, `create index if
not exists`, RLS enable. No INSERT/UPDATE/DELETE/TRUNCATE. Its single
`drop` is `drop constraint if exists` immediately followed by re-adding
the same check constraint. `public.orders` held 0 rows, so there was no
data at risk.

Result: `Success. No rows returned.` Re-verified:

| Check | Before | After |
|---|---|---|
| Tables of 5 | 3 | 5 |
| `orders` columns of 7 | 0 | 7 |
| `order_items` columns of 2 | 0 | 2 |
| RLS enabled of 4 | 2 | 4 |

NOT applied, deliberately: 0027 (resets prices/images — prices must stay
unpublished), 0028, 0029.

## Catalog state in the database — FLAG

`public.products` holds 54 rows with **50 marked `available_for_sale =
true`** and 0 zero-priced. The live site reads the mock catalog in
`src/lib/products.ts` (10 products, all `availableForSale: false`) and
checkout sits behind the Coming Soon middleware, so nothing is purchasable
today. But if catalog reads are ever flipped to the database before this is
reconciled, 50 products become purchasable at old prices. Resolve before
any read-path switch.

## Stripe — live, read-only verification

Test-mode webhook endpoints: exactly 1, `https://goool.shop/api/stripe-webhook`,
status enabled, `livemode=false`, subscribed to
`checkout.session.completed`, `checkout.session.async_payment_succeeded`,
`checkout.session.async_payment_failed`.

It targets the custom domain, not the `*.netlify.app` subdomain, so the
Netlify rename below does not affect it. Route confirmed alive after the
rename: `GET https://goool.shop/api/stripe-webhook` -> HTTP 405 (POST only),
`https://goool.shop/` -> HTTP 200.

Still outstanding: a real test-card checkout proving webhook delivery,
stored order number, immutable item snapshot, success page, tracking, and
duplicate-event handling. Session creation alone is not that proof.

## Renames (owner request)

| Thing | Was | Now | Effect |
|---|---|---|---|
| Supabase organization | portugoool | GOOOL | display only |
| Supabase project | gdove90's Project | GOOOL | display only; ref `oexibflpshttgzmdvhpr` unchanged |
| Netlify project | portugoool | goool-shop | `*.netlify.app` subdomain changed |

`goool` alone was already taken on Netlify. Branch deploy URL is now
`main--goool-shop.netlify.app` (was `main--portugoool.netlify.app`); update
any bookmark or allowlist that used the old one. `goool.shop` and the
Stripe webhook are unaffected. No keys, refs or connection strings changed.

## Gates untouched

No prices published, no live Stripe activation, no supplier submission
enabled, no labels purchased, no samples ordered, nothing posted to
Instagram.

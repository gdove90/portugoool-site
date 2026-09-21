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

---

# Addendum — same day, later session

## Correction to my own earlier flag about the 50 products

The first version of this file said "if catalog reads are ever flipped to
the database, 50 products become purchasable at old prices." That
overstated the exposure. Measured properly:

```
is_active | available_for_sale | rows | min_price | max_price
----------+--------------------+------+-----------+----------
true      | false              |    4 |      3600 |      7800
false     | true               |   50 |      1000 |      6500
```

A clean two-way split. Every one of the 50 rows flagged sellable is
ALREADY retired (`is_active = false`); migrations 0021-0024 cleared
`is_active` but never cleared `available_for_sale`. And:

- an anon-key read of `public.products` returns exactly 4 rows (the RLS
  policy hides inactive rows from the public role), none sellable
- `grep` for `from("products")` across `src/` returns nothing: the site
  does not read the catalog from Supabase at all today

So there is no live exposure. The real trap is narrower: a future
read-path switch on a SERVICE-ROLE client, which bypasses RLS and would
see 50 rows claiming to be sellable.

Correction prepared as `supabase/migrations/0030_retire_legacy_available_flags.sql`.
It only ever closes availability, deletes nothing, changes no price or
image, and is idempotent. NOT YET APPLIED — the write was blocked by the
permission classifier, which is correct for a production data update.
Apply it in the SQL editor, or authorise me to.

## Pre-payment verification (requested before any card is entered)

Read from the live Netlify production environment and Stripe:

| Control | State | Evidence |
|---|---|---|
| Checkout mode | TEST | `CHECKOUT_TEST_MODE=true` (all contexts); Stripe key resolves `mode: test` |
| Session mode | TEST | `livemode: false` on the created session |
| Supplier submission | DISABLED | `APLIIQ_SUBMIT_ENABLED` is **absent entirely** from the Netlify environment, so the gate returns `left_pending_disabled` |
| Environment gate | second layer | `submissionEnvironmentAllowed(livemode)` refuses non-live/non-production even if the flag were set |

Two further gaps this surfaced, both needed before live fulfillment:
- No Apliiq credentials are configured at all (no APP_ID, no shared
  secret, no `FULFILLMENT_OPS_KEY`). Submission could not run even if
  enabled.
- `PREVIEW_KEY` is the literal string `gary`, is not marked secret, and
  is set for all contexts. It bypasses the Coming Soon gate. Worth
  rotating to a long random value before launch.

Stripe account onboarding is still incomplete: `charges_enabled=false`,
`payouts_enabled=false`, `details_submitted=false`, with
`requirements_currently_due` EMPTY, meaning onboarding has not been
started rather than being under review. Live mode cannot be enabled until
the owner completes business and bank details in Stripe directly.
Shipping is still the `GOOOL TEST shipping` rate at $9.50.

---

# Addendum 2 — corrections accepted, preview key rotated

## Two corrections from the owner, both verified in code

1. **`left_pending_disabled` is NOT a submission_status.** Confirmed: it
   appears only in the `action:` return union of `submitPaidOrder`
   (`fulfillment-submit.ts:120`) and never reaches the database. The
   webhook stores (`stripe-webhook/route.ts:117`):

   ```
   submission_status: paid
     ? (unmapped.length > 0 ? "failed" : "pending_submission")
     : "not_submitted"
   ```

   So for our test session — paid, with a complete SKU snapshot — the
   CORRECT stored value is **`pending_submission`**, and that is fully
   consistent with supplier submission being disabled. Verification must
   assert `pending_submission`, not any "disabled" string.

2. **Stripe onboarding state must not be inferred from an empty
   `currently_due`.** My earlier note claimed onboarding "has not been
   started" on that basis. Withdrawn — an empty array does not prove
   that. What is verified is only: `charges_enabled=false`,
   `payouts_enabled=false`, `details_submitted=false`. The actual stage
   must be read in the live Stripe Dashboard by the owner.

## Preview key rotated (owner-approved)

The weak key (4 characters, not marked secret, all contexts) is replaced
with 256 bits of url-safe randomness, stored as a Netlify SECRET in the
production context. The value was generated into the session scratchpad
and passed by shell substitution from that file, so it never appeared in
a command line, a tool argument, this repository or the chat. `.env.local`
was updated in place so local tooling keeps working; `git check-ignore`
confirms that file is ignored.

Rotation verified against production after a full rebuild
(deploy `6ab0f368a10b67f9c791454c`, state ready):

| Request to https://goool.shop/shop | Result |
|---|---|
| no key | 307 (gated) |
| OLD key | 307 — rejected |
| NEW key | 200 — owner preview works |

The new value is readable only from `.env.local` on this machine; Netlify
stores it write-only as a secret. If it is lost, rotate again rather than
trying to recover it.

## Stripe rehearsal still pending payment

Checked, not assumed: three sessions exist, ALL `status=open`,
`payment_status=unpaid`, `livemode=false`. Zero payment_intents and zero
`checkout.session.completed` events in the account. No completed-payment
event has been fabricated and none will be.

The most recent session is valid until 2026-09-22T08:54:55Z, so a new
link is unnecessary until then.

---

# Addendum 3 — catalog imagery cleanup

Re-inventoried rather than assuming the earlier four-colorway figure.
`src/lib/products.ts` referenced 184 image entries / 170 unique files
across 64 slug entries, of which **26 were stadium model shots** (20
unique files) — matching the audit's count.

## Applied

1. **Model shots removed from customer-facing galleries.** All 26
   references deleted from `products.ts`; 0 remain; no gallery ended up
   empty. Every original file is untouched on disk in
   `public/products/` and in `designs/17_launch_imagery/stadium/`.

2. **4:5 framing.** `ProductCard` and `ProductDetail` used
   `aspect-square`, but every studio asset is 1122x1402 = exactly 4:5.
   The square containers were CROPPING the garments. Both now use
   `aspect-[4/5]`, so assets display at their native ratio.

3. **Gray CSS panels.** Image containers changed `bg-smoke` (#F4F4F2) ->
   `bg-paper` (#FFFFFF) in `ProductCard` and both the main image and
   thumbnails in `ProductDetail`. The two `bg-smoke` text panels in
   `ProductDetail` were deliberately left; they are copy blocks, not
   image areas.

4. **"Printed in the USA" removed from price areas.** The badge rendered
   inline in the price line in both `ProductCard` and `ProductDetail`;
   both render blocks are gone. The `originLabel` DATA is deliberately
   retained in `products.ts` and `types.ts` — it is an accurate supplier
   record and the origin table in `apliiq-product-mapping.md` still
   governs. No substitute manufacturing claim was introduced.

5. **Embedded backgrounds normalized to pure white — 119 of 123.**
   Originals preserved in
   `designs/_archive/imagery-pre-whitebg-2026-09-21/`.

## The failure this caught, and the guard added

First attempt used border-connected components at tolerance 16 and
**damaged the Ivory Circular Badge tee**: the fabric is within tolerance
of the #F3F4F1 backdrop, so the fill bled through the garment and left
it blotchy. All 123 images were reverted from backup (git confirmed
byte-identical to the committed originals) before anything was
committed. Interior hole-filling did not fix it either — the bleed
connects to the outside background, so it is not an enclosed hole.

A guard was added instead: a full garment shot must occupy 28-72% of a
4:5 frame, and any image failing that band is left untouched. Verified
after processing on the two riskiest cases: the Bone hoodie (lightest
garment that does process) and the Washed Black casual tee both keep
silhouette, pocket, cuffs and artwork intact with a clean white field.

**4 images held back by the guard — these need regenerated source
assets, not a pixel fix:**

| File | garment area measured |
|---|---|
| GOOOL_STD_CIRCULAR_BADGE_FRONT.webp | 26.0% |
| GOOOL_STD_CIRCULAR_BADGE_BACK.webp | 20.4% |
| GOOOL_STD_PERFORMANCE_WHITE_FRONT.webp | 23.1% |
| GOOOL_STD_PERFORMANCE_WHITE_BACK.webp | 10.7% |

Both are the near-white colorways (Ivory, White). Until their assets are
re-rendered on a true white backdrop, those two colorways will show a
faint #F3F4F1 field against the now-white panel. No automated matte can
separate near-white fabric from a near-white backdrop safely.

## Also fixed

`tsconfig.json` excluded only `node_modules`, so the archived snapshot
copies under `designs/_archive/.../source-snapshot/src/lib/*.ts` were
being typechecked and produced 2 pre-existing module-resolution errors.
Added `designs`, `output`, `tmp` to `exclude`. Typecheck is now clean and
`npm run build` succeeds.

## Not done

Casual design recreation (option A) at Apliiq is still outstanding — it
is browser work against the customizer and was not reached this session.

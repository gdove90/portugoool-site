# PORTUGOOOL — Website Bible

**Engineering specification of the storefront as built.** This documents
exact behavior: routes, contracts, data shapes, states, and rules. If code
and this document disagree, fix one of them in the same commit.

Companion documents: [CLAUDE.md](../../CLAUDE.md) (operating manual) ·
[00_brand/](../00_brand/README.md) (visual/brand rules).

---

## 1. Route Map

| Route | File | Rendering | Data source | Primary conversion goal |
|---|---|---|---|---|
| `/` | `src/app/page.tsx` | Static | mock catalog | Shop the Drop |
| `/shop` | `src/app/shop/page.tsx` | Static | mock catalog | Enter a product page |
| `/shop/[slug]` | `src/app/shop/[slug]/page.tsx` | SSG (`generateStaticParams`) | mock catalog | Add to cart / Buy Now |
| `/drop` | `src/app/drop/page.tsx` | Static | limited-drop products | Buy a jersey |
| `/customize` | `src/app/customize/page.tsx` | Static | jersey category | Buy customized jersey |
| `/world-cup` | `src/app/world-cup/page.tsx` | Static | jersey category | Email capture + drop |
| `/about` | `src/app/about/page.tsx` | Static | — | Shop the Drop |
| `/faq` | `src/app/faq/page.tsx` | Static | `src/lib/faq.ts` | Resolve objection → shop |
| `/contact` | `src/app/contact/page.tsx` | Client | — (mailto) | Send message |
| `/track-order` | `src/app/track-order/page.tsx` | Client | — (placeholder) | Self-serve status |
| `/cart` | `src/app/cart/page.tsx` | Client | localStorage cart | Checkout |
| `/success` | `src/app/success/page.tsx` | Client | — | Clear cart, reassure |
| `/api/checkout` | `src/app/api/checkout/route.ts` | Dynamic POST | mock catalog + Stripe | — |
| `/api/newsletter` | `src/app/api/newsletter/route.ts` | Dynamic POST | Supabase | — |
| 404 | `src/app/not-found.tsx` | Static | — | Back to shop |

**Rule:** new pages default to server components + static rendering.
`"use client"` only where there is interaction.

---

## 2. Page Specifications

### 2.1 Home `/`
Section order (exact):
1. `Hero` — badge "Drop Version I · 500 Made · Live Now", H1 wordmark,
   gold line "The Sound of Victory.", sub "Made for the moment it goes in.",
   CTAs: Shop the Drop (red) → `/drop`, View the Collection (outline) → `/shop`
2. **Drop Version I** — 4 jerseys via `ProductGrid`, link → `/drop`
3. `FabricFeatureGrid` — 6 fabric cards on smoke background
4. **Wear the celebration** — first 4 casual tees, link → `/shop#casual`
5. Customization section — "$15" eyebrow, SILVA/10 back-of-jersey mock,
   CTA → `/customize`
6. `DropBanner` — green band, gold CTA → `/drop`
7. FAQ preview — first 4 items of `FAQ_ITEMS`, link → `/faq`
8. `EmailSignup` — ink band

### 2.2 Shop `/shop`
Three anchored sections in order: `#jerseys`, `#casual`, `#accessories`
(anchor ids are a public contract — home links to `/shop#casual`).
Header row: H1 + "Shop the Drop" red CTA.

### 2.3 Product `/shop/[slug]`
Two-column ≥lg, stacked below. Order in purchase panel (exact):
name → color swatch+label → price (sale strikethrough when
`compareAtPriceCents > priceCents`) → drop status panel (limited only) →
description → size selector (hidden when single size) → customization box
(customizable products only) → Buy Now (red) + Add to Cart (outline) →
trust copy grid → Material / Fit / Care rows. Below: "You might also like"
(4 other products).
**Mobile invariant: price, size, customization entry, and Buy Now render
above the fold on a 375×812 viewport.**

### 2.4 Cart `/cart`
Line items (image, name, color · size, custom line, qty stepper, remove) +
sticky summary card (subtotal, "Shipping: Calculated at checkout", Checkout
button, trust list). Empty state: "Your cart is empty / The next goal
deserves a shirt." → Shop CTA.

### 2.5 Success `/success`
Clears cart on mount (`useEffect → clear()`). Copy: "GOOOOOL!" display +
"Order confirmed." Stripe redirects here with `?session_id={CHECKOUT_SESSION_ID}`.

---

## 3. Data Model

Canonical TypeScript: `src/lib/types.ts`. Canonical SQL:
`supabase/migrations/0001_initial_schema.sql`. They map 1:1:

| TS (`Product`) | SQL (`products`) | Notes |
|---|---|---|
| `id` | `id uuid PK` | Mock catalog and seed share UUIDs — never diverge |
| `slug` | `slug unique` | URL segment |
| `priceCents` | `price_cents` | Integer cents, always |
| `compareAtPriceCents?` | `compare_at_price_cents` | Sale display only |
| `category` | `product_category` | `jersey \| casual \| accessory` |
| `supplierType` | `supplier_type` | `printful \| printify \| apliiq \| gelato \| local \| unassigned` |
| `isLimitedDrop` | `is_limited_drop` | |
| `dropVersion?` | `drop_version` | Roman numeral string ("I") |
| `dropLimit?` | `drop_limit` | 500 for Drop I jerseys; null = uncounted |
| `dropSoldCount` | `drop_sold_count` | Source for remaining math |
| `customNameAvailable` | `allow_custom_name` | |
| `customNumberAvailable` | `allow_custom_number` | |
| `customizationPriceCents` | `customization_price_cents` | 1500 on jerseys, 0 elsewhere |
| `sizes` | `sizes text[]` | Shirts: S–3XL · accessories: `["OS"]` |
| `images` | `images jsonb` | `[{src, alt}]`, paths under `/products/` |

Derived (functions in `types.ts`, never stored):
- `remainingUnits(p) = max(0, dropLimit − dropSoldCount)` (null if uncounted)
- `isSoldOut(p) = remainingUnits(p) === 0`

Other tables: `orders` (+`status`: pending/paid/cancelled/refunded,
`fulfillment_status`: unfulfilled/submitted/in_production/shipped/delivered/
cancelled), `order_items` (size, color, qty, custom_name, custom_number,
unit_price_cents), `newsletter_signups` (unique email).

DB helpers (admin-ready, no dashboard): `increment_drop_sold(product_id,
qty)` · `order_export` view (flat join for CSV fulfillment export).

**RLS:** products readable when `is_active`; orders/order_items/
newsletter_signups are service-role only.

---

## 4. Drop Logic

| Rule | Value |
|---|---|
| Drop size | 500 units per jersey design |
| Version label | "Drop Version {N}" — Roman numerals |
| Detail panel | "Drop Version I · 500 made" + "{n} remaining" + progress bar |
| No-reprint line | "Once this drop sells out, it will not be reprinted." (exact copy) |
| Card low-stock chip | Only when `0 < remaining ≤ 150` — honest urgency threshold |
| Sold-out card | Ink overlay + "Sold Out" pill; Limited Drop badge hidden |
| Sold-out detail | Buy buttons replaced by "This drop is gone." panel |
| Sold-out checkout | API rejects with 400 |
| Count source | `dropSoldCount` (manual now; Stripe webhook will call `increment_drop_sold` later) |

---

## 5. Cart Specification

`src/lib/cart.tsx` — React context + localStorage. No server state.

- **Storage key:** `portugooool-cart-v1` (bump suffix on breaking shape change)
- **Line-item key:** `productId|size|customName|customNumber` — same key
  increments quantity, different customization = separate line
- **Unit price** is computed at add-time (base + customization) and stored
  on the item; display only — checkout recomputes server-side
- Hydrates from storage on mount; persists after hydration (guards against
  wiping a saved cart); storage failures degrade silently to session cart
- Quantity → 0 removes the line; header badge shows total item count

---

## 6. API Contracts

### 6.1 `POST /api/checkout`
Request:
```json
{ "items": [{ "productId": "uuid", "size": "L", "color": "Deep Red",
  "quantity": 1, "customName": "SILVA" | null, "customNumber": "10" | null }] }
```
Server rules (order matters):
1. **No `STRIPE_SECRET_KEY`** → 503 `{error}` with the pre-launch message
   (cart renders it inline — this is the current production behavior)
2. Empty/malformed items → 400 "Invalid cart."
3. Unknown/inactive product → 400 "…no longer available."
4. Sold-out product → 400 "{name} is sold out…"
5. Size not in `product.sizes` → 400 "Invalid size."
6. Quantity clamped 1–10; name ≤12 chars; number ≤2 chars
7. Customization stripped unless the product allows it; add-on price from
   `product.customizationPriceCents`
8. **Prices always from server catalog — client prices are never trusted**

Success: creates Stripe Checkout Session (mode `payment`, shipping countries
US/CA/PT/GB, per-line metadata: product_id, size, color, custom_name,
custom_number) → 200 `{url}` → client redirects.
`success_url: {SITE}/success?session_id=…` · `cancel_url: {SITE}/cart`.

### 6.2 `POST /api/newsletter`
Request `{email}`. Normalizes (trim/lowercase), validates regex + ≤254
chars → 400 "Enter a valid email." Upserts into `newsletter_signups`
(`onConflict: email`, duplicates are silent success). No Supabase env →
logs and returns `{ok: true}` (pre-launch mode). Success: 200 `{ok: true}`.

### 6.3 Future: `POST /api/stripe-webhook` (not built)
On `checkout.session.completed`: insert `orders` + `order_items` from line
metadata, call `increment_drop_sold` per item, trigger Resend confirmation.
This is the next backend milestone before real sales.

---

## 7. Component API Reference

| Component | Props | Contract notes |
|---|---|---|
| `Header` | — | Sticky, backdrop-blur; nav: Shop, Limited Editions, Customize, About, FAQ; cart badge from `useCart().count` |
| `MobileNav` | `open, onClose, links` | Locks body scroll while open; full-height right drawer |
| `Hero` | — | Copy changes require brand-doc update first |
| `ProductCard` | `product` | Whole card is one link; renders sale, low-stock, sold-out states |
| `ProductGrid` | `products` | 2/3/4 columns; empty state: "Nothing here right now. The next drop is coming." |
| `ProductDetail` | `product` | Owns all purchase state; auto-selects single sizes |
| `SizeSelector` | `sizes, selected, onSelect` | Radiogroup semantics; selected = ink fill |
| `CustomizationSelector` | `nameAvailable, numberAvailable, priceCents, enabled, onToggle, customName, onNameChange, customNumber, onNumberChange` | Name: uppercase A–Z + space, ≤12. Number: digits, ≤2 |
| `FabricFeatureGrid` | — | Static 6-card content |
| `DropBanner` | — | Green band; gold CTA |
| `EmailSignup` | — | States: idle/loading/success/error; posts to `/api/newsletter` |
| `FAQAccordion` | `items?` (defaults to `FAQ_ITEMS`) | Single-open; content lives in `src/lib/faq.ts`, never inline |
| `Footer` | — | Must always carry the independence disclaimer |

**Shared-content rule:** copy used by both server and client components
lives in `src/lib/` (see `faq.ts`) — never export data from a
`"use client"` file.

---

## 8. Environment & Deploy

| Variable | Scope | Status |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | build+runtime | set: `https://portugoool.netlify.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | build+runtime | set |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | build+runtime | set |
| `SUPABASE_SERVICE_ROLE_KEY` | server only, **secret**, production context | set |
| `STRIPE_SECRET_KEY` | server only | **unset — checkout in placeholder mode** |
| `RESEND_API_KEY` | server only | future |

Pipeline: push to `main` → Netlify builds (`netlify.toml`: Next.js plugin,
Node 20) → production. No staging; `main` must always be shippable.
Local: `npm run dev` (or the `portugooool-dev` launch config). Missing env
vars must never break the build — all integrations degrade gracefully.

---

## 9. SEO & Metadata

- Title template: `%s · PORTUGOOOL`; default title carries the tagline
- Per-page `metadata` exports; product pages use name + description via
  `generateMetadata`
- `metadataBase` from `NEXT_PUBLIC_SITE_URL`
- Product images carry descriptive alt text (product, not filename)
- Future (pre-marketing-push): OG image, sitemap, `Product` JSON-LD

---

## 10. States & Edge Cases (must never regress)

| Case | Behavior |
|---|---|
| Checkout with no Stripe key | Friendly inline message in cart, 503 |
| Cart references removed product | Checkout 400s with clear message |
| Duplicate newsletter email | Silent success (no enumeration) |
| Invalid email | 400 + inline `role="alert"` error |
| No size selected | Inline "Select a size to continue." — no browser alerts |
| Single-size product | Selector hidden, size auto-applied |
| Sold-out product | Card overlay · detail panel swap · API rejection |
| Empty cart / empty grid | Branded empty states with a path forward |
| localStorage unavailable | Cart works in-memory for the session |
| Unknown route | Branded 404 ("Offside") → shop |

---

## 11. Change Control

1. Visual/brand changes: update [00_brand/](../00_brand/) first
2. Behavior changes: update this file in the same commit
3. Schema changes: new numbered migration in `supabase/migrations/`
   (0001/0002 are applied to production — append, never edit them again)
4. Copy changes: match [voice.md](../00_brand/voice.md); exact-copy strings
   quoted in this document are contracts — update both places
5. Verify in live preview before pushing; every push deploys

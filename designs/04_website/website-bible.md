# PORTUGOOOL — The Website Bible

**Master website specification.** The definitive reference for every page,
layout, user flow, responsive breakpoint, and future UI decision. A new
engineer should be able to build this website from this document alone.

**Governance:** [CLAUDE.md](../../CLAUDE.md) is the operating manual and wins
on conflicts. [designs/00_brand/](../00_brand/README.md) is the visual source
of truth for color, type, voice, materials, and principles — values are not
duplicated here; they are referenced.

**Status legend:** items marked **[LIVE]** exist in production;
**[FUTURE]** items are specified now so they're built consistently later.

---

## Contents

1. [Website Philosophy](#1-website-philosophy)
2. [Global Layout Standards](#2-global-layout-standards)
3. [Responsive Breakpoints](#3-responsive-breakpoints)
4. [Homepage](#4-homepage)
5. [Shop Page](#5-shop-page)
6. [Product Page](#6-product-page)
7. [Cart](#7-cart)
8. [Checkout Flow](#8-checkout-flow)
9. [About](#9-about)
10. [FAQ](#10-faq)
11. [Contact](#11-contact)
12. [Error States](#12-error-states)
13. [Accessibility](#13-accessibility)
14. [Performance](#14-performance)
15. [SEO](#15-seo)
16. [Future Expansion](#16-future-expansion)
— [Appendix A: Route & Rendering Map](#appendix-a-route--rendering-map)
— [Appendix B: API Contracts](#appendix-b-api-contracts)
— [Appendix C: Data Model](#appendix-c-data-model)
— [Appendix D: States That Must Never Regress](#appendix-d-states-that-must-never-regress)

---

## 1. Website Philosophy

The website sells **emotion before apparel** — the half-second after the
ball hits the net, rendered as an interface.

| Principle | What it means in practice |
|---|---|
| One conversion goal per page | Every page drives exactly one action. Secondary links exist; secondary *goals* don't. |
| Product-first design | The shirt is the hero of every composition. UI recedes; product advances. |
| Minimal interface | If an element doesn't build emotion or move toward purchase, cut it. |
| Premium presentation | Apple-meets-Nike. Restraint reads as quality: few colors, one display voice, disciplined spacing. |
| Mobile-first | Designed at 375px, enhanced upward. Majority of fan traffic is mobile. |
| Fast checkout | Cart → Stripe → done. No accounts, no multi-step forms, no upsell interruptions. |
| Large imagery | 4:5 product images, full-bleed emotional sections. |
| Clean typography | Condensed uppercase display + quiet system body. See [typography.md](../00_brand/typography.md). |
| Intentional whitespace | Space is a design element. Never compress sections to "fit more in." |

Per-page conversion goals are listed in [Appendix A](#appendix-a-route--rendering-map).

---

## 2. Global Layout Standards

| Standard | Specification |
|---|---|
| Maximum content width | **1200px** (`max-w-content`), centered |
| Container gutters | 16px mobile (`px-4`) · 24px ≥640px (`sm:px-6`) |
| Section vertical spacing | 64px mobile (`py-16`) · 80px ≥640px (`sm:py-20`) |
| Grid system | CSS grid. Products: 2 cols mobile → 3 cols ≥1024px → 4 cols ≥1280px. Content splits: 1 col mobile → 2 cols ≥1024px |
| Grid gaps | Products: 16px x / 32px y mobile, 24px x ≥640px. Content: 40px (`gap-10`) |
| Maximum paragraph width | ~65ch — enforce with `max-w-md`/`max-w-lg` on body copy |
| Heading spacing | 8px between heading and subhead (`mt-2`); 32–40px between section header block and content (`mb-8`/`mb-10`) |
| Card internal spacing | 24px padding (`p-6`) for content cards; product cards have no padding (image bleeds to card edge, radius 12px) |
| Button spacing | Stacked CTAs: 12px gap (`gap-3`). Inline pairs: 12px. Full-width on mobile, intrinsic width ≥640px |
| Button geometry | Pill (`rounded-full`), 16px vertical padding (`py-4`) primary, 12px (`py-3`) compact |
| Corner radius | 12px cards/inputs (`rounded-xl`/`rounded-lg`) · pill buttons/badges |
| Safe mobile margins | Nothing touches viewport edges; 16px minimum. Sticky elements respect safe-area insets |
| Section background rhythm | Alternate paper → smoke → paper → ink/green. Never two smoke sections adjacent |

---

## 3. Responsive Breakpoints

Tailwind thresholds govern behavior: **640 (`sm`) · 768 (`md`) · 1024 (`lg`)
· 1280 (`xl`) · 1536 (`2xl`)**. Device widths below map onto those bands.
Base styles = smallest screens; enhancements layer upward.

### Behavior matrix

| Concern | 320–414px (mobile band) | 768px (tablet) | 1024px | 1280px | 1536px |
|---|---|---|---|---|---|
| **Navigation** | Hamburger → right drawer (288px wide). Logo + cart + menu only | Full nav links appear (`md:`), drawer retired, "Shop the Drop" pill in header | unchanged | unchanged | unchanged |
| **Typography** | Hero 60px (`text-6xl`); section heads 30px; body 16px | Hero 96px (`sm:text-8xl` applies ≥640) | Hero 128px (`lg:text-9xl`); section heads 36px | unchanged | unchanged |
| **Spacing** | Sections 64px; gutters 16px | Sections 80px; gutters 24px (≥640) | unchanged | unchanged | unchanged |
| **Product grid** | 2 columns | 2 columns, wider gaps | 3 columns | 4 columns | 4 columns (content max-width caps growth) |
| **Images** | Full-column width, 4:5 | 4:5 maintained; `sizes` serves ~50vw | Product page: two-column, image ≈50vw | ~25vw in 4-col grids | unchanged |
| **Buttons** | Full width, stacked | Intrinsic width, side-by-side pairs | unchanged | unchanged | unchanged |
| **Cards** | Edge-to-edge within gutters | 2-up | 3-up | 4-up | unchanged |
| **Forms** | Single column, full-width inputs | Email signup collapses to inline input+button row (`sm:flex-row`) | unchanged | unchanged | unchanged |
| **Footer** | Stacked: brand block, then 2-col link grid | Brand left, links right (`sm:flex-row`) | unchanged | unchanged | unchanged |

### Narrow-band notes (320 / 375 / 390 / 414)

- **320px:** floor. Hero type may not wrap mid-word; wordmark stays on one
  line. All touch targets keep ≥44px. No horizontal scroll, ever.
- **375px:** design reference width. The product-page above-the-fold
  invariant (§6) is validated here at 375×812.
- **390/414px:** identical layout to 375; extra width goes to image area
  and line length, never to added columns.

---

## 4. Homepage

**Conversion goal:** click **Shop the Drop**.
Section order is a contract — reorder only via this document.

| # | Section | Status |
|---|---|---|
| 0 | Announcement Bar | [LIVE — Iteration 01] |
| 1 | Header | [LIVE — dark, Iteration 01] |
| 2 | Hero | [LIVE — photo-led, Iteration 01] |
| 3 | Trust Bar | [LIVE — Iteration 01] |
| 4 | Featured Collection — Drop Version I | [LIVE] |
| 5 | Fabric | [LIVE] |
| 6 | Product Grid — casual preview | [LIVE] |
| 7 | Customization | [LIVE] |
| 8 | Limited Drop banner | [LIVE] |
| 9 | FAQ preview | [LIVE] |
| 10 | Newsletter | [LIVE] |
| 11 | Footer | [LIVE] |

### 4.0 Announcement Bar [LIVE]
- **Purpose:** one time-sensitive message (drop live, free-shipping threshold).
- **Content:** single line ≤60 chars. One message at a time — never rotates.
  Current copy (contract): "Drop 01 · Limited to 500 jerseys · Once it's
  gone, it's gone."
- **Layout:** full-width strip above header, site-wide. Red background,
  paper text, 12px bold uppercase, 0.14em tracking, 40px tall. Dismissible
  (×), remembered per session (sessionStorage). Scrolls away; header alone
  is sticky.
- **CTA:** none currently; inline text link permitted.

### 4.1 Header [LIVE]
- **Purpose:** orientation + persistent path to cart and drop.
- **Hierarchy:** wordmark → nav → cart → CTA.
- **Desktop:** 64px tall, sticky, ink background, 1px paper/10 bottom
  border. Nav (12px semibold uppercase, 0.1em tracking, paper 75% → 100%
  hover): Shop · Limited Editions · Customize · About · Summer '26 (FAQ
  moved to footer). Red "Shop the Drop" pill right. Search/account icons
  from the Iteration 01 mockup are intentionally omitted until those
  features exist.
- **Tablet:** same as desktop (nav appears ≥768px).
- **Mobile:** wordmark + cart icon (badge = item count) + hamburger.
  Drawer: 288px, right-anchored, scroll-locked, links + full-width drop CTA.
- **Spacing:** content gutters per §2.

### 4.2 Hero [LIVE — photo-led, Iteration 01]
- **Purpose:** land the brand emotion in one screen.
- **Content hierarchy (centered):** wordmark H1 → display tagline → one CTA.
- **Visual:** full-bleed crowd photo (`public/hero-crowd.webp`, ≤180KB,
  `next/image` priority — the LCP element) under a legibility gradient
  (dark 55% top / open middle / dark 75% bottom). The image is
  AI-generated and **cleared for production** per the AI imagery policy
  (CLAUDE.md Image Standards): no likenesses, no marks, no legible text.
  Swappable at the same path if real photography arrives later.
- **Type:** H1 "Portugoool" in Permanent Marker (the single sanctioned
  usage — see typography.md): 150px desktop / 96px tablet / 60px mobile,
  0.95 line-height, soft shadow. Tagline "The Sound of Victory." in Anton,
  34px desktop / 20px mobile, 0.16em tracking, paper.
- **Section:** 680px min-height desktop, 560px mobile.
- **CTA:** single — "Shop the Drop", paper pill / ink text, hover scale
  1.03 (150ms; instant under reduced motion) → `/drop`. Full-width mobile.
- **Max copy:** H1 + tagline only. No paragraphs, no second CTA.

### 4.3 Trust Bar [LIVE — dark variant]
- **Purpose:** compress objections at first scroll.
- **Content:** exactly 4 items (title + sub): LIMITED DROPS / Never
  Reprinted · PREMIUM QUALITY / Built to Perform · WORLDWIDE SHIPPING /
  For Fans Everywhere · MADE FOR THE MOMENT / When It Hits Different.
- **Layout:** ink strip directly under hero, paper/10 top border, 28px
  padding. 4-across ≥1024px, 2×2 below. Gold (26px, 1.6 stroke) inline
  SVG icons; 12px bold uppercase titles, 11px paper/50 subs.
- **CTA:** none. This section never links.

### 4.4 Featured Collection — Drop Version I [LIVE]
- **Purpose:** put the four jerseys one tap from the hero.
- **Content:** H2 "Drop Version I" + sub "Four jerseys. 500 of each. A
  limited drop for the loudest fans." + 4 `ProductCard`s.
- **Desktop:** header row with "View the drop →" link right; 4-up grid ≥1280.
- **Tablet/Mobile:** 2-up grid; mobile swaps the header link for a
  full-width outline button below the grid.
- **Max copy:** sub ≤80 chars; card copy is fixed by the card spec (§6).

### 4.5 Fabric [LIVE]
- **Purpose:** justify premium price with material truth (specs:
  [materials.md](../00_brand/materials.md)).
- **Content:** H2 "The fabric" + sub + 6 feature cards (title ≤4 words,
  body ≤90 chars).
- **Layout:** smoke section; cards paper. 3-up ≥1024, 2-up ≥640, stacked mobile.
- **CTA:** none — this section informs, the next converts.

### 4.6 Casual Preview [LIVE]
- Mirror of §4.4 for the casual collection: H2 "Wear the celebration",
  4 tees, link → `/shop#casual`.

### 4.7 Customization [LIVE]
- **Purpose:** surface the $15 name/number upsell before product pages.
- **Content:** eyebrow "Optional add-on · $15" → H2 "Your name. Your
  number." → ≤2 sentence explainer → CTA. Visual: back-of-jersey mock
  (green panel, SILVA / gold 10) built in CSS — no image asset.
- **Desktop:** two-column, copy left, mock right. **Mobile:** stacked,
  copy first. CTA "Customize your jersey" (ink pill) → `/customize`.

### 4.8 Limited Drop Banner [LIVE]
- **Purpose:** scarcity as brand promise.
- **Content:** eyebrow "Drop Version I · 500 units per jersey" → H2 "When
  it's gone, it's gone." → ≤2 lines incl. the no-reprint line → gold CTA.
- **Layout:** full-width green band; copy left, CTA right desktop; stacked
  mobile.

### 4.9 FAQ Preview [LIVE]
- First 4 items of the FAQ accordion + "All questions →". Same component
  and rules as §10.

### 4.10 Newsletter [LIVE]
- **Purpose:** capture demand the current drop doesn't convert.
- **Content:** H2 "Get the next drop first." + one-line sub + email field
  + button "Join the list".
- **Layout:** ink band, centered, form max 448px. Inline success ("You're
  on the list. ⚽") replaces the form; errors inline below.
- **Max copy:** sub ≤90 chars.

### 4.11 Footer [LIVE]
- Wordmark + tagline left; 2-column link grid right (Shop, About, Limited
  Editions, FAQ, Customize, Track Order, Summer '26, Contact). Legal block
  below 1px paper/10 divider: © line + **independence disclaimer (immovable)**.

---

## 5. Shop Page

**Conversion goal:** enter a product page.

| Capability | Spec |
|---|---|
| Collections [LIVE] | Three anchored sections in fixed order: `#jerseys` → `#casual` → `#accessories`. Anchor ids are a public contract (deep-linked from home). Each: H2 + one-line blurb + grid |
| Grid behavior [LIVE] | Per §2. Cards per §6 card spec. Sold-out cards remain visible (overlay), never hidden — scarcity proof |
| Filtering [FUTURE] | Horizontal pill row under page header: All · Jerseys · Casual · Accessories (+ Size, Color when catalog >20). Filters scroll-to/show sections client-side; no page reload; URL reflects state (`?category=jersey`) |
| Sorting [FUTURE] | Single dropdown right of filters: Featured (default) · Newest · Price ↑ · Price ↓. No sort on <9 products |
| Pagination [FUTURE] | None below 24 products/section. Beyond: "Load more" button (never infinite scroll — footer must stay reachable) |
| Search [FUTURE] | Icon in header → full-screen overlay, fuzzy match on name/color/category, results as standard grid. No dedicated results page below 50 SKUs |
| Loading [FUTURE — applies when data goes live] | Skeleton cards (grey 4:5 blocks + two text bars), same grid dimensions — zero layout shift |
| Empty state [LIVE] | "Nothing here right now. The next drop is coming." + newsletter CTA. Never an unexplained blank grid |
| Responsive | Grid per §3 matrix. Filter pills horizontally scrollable on mobile (edge-fade hint) |

---

## 6. Product Page

**Conversion goal:** Add to Cart / Buy Now.

**THE mobile invariant:** at 375×812, name, price, size selector,
customization entry point, and Buy Now are all visible without scrolling.
Any change violating this is rejected.

### Gallery [LIVE]
- Main image 4:5, radius 12px, smoke background; thumbnails (64×80px) below,
  active = 2px ink ring. Limited-drop badge overlays top-left (gold on ink);
  swaps to "Sold Out" when gone.
- **[FUTURE]:** swipe gestures + pinch zoom mobile; hover zoom desktop.

### Purchase panel
- Order (contract): name → color swatch+label → price → drop status →
  description → size → customization → CTAs → trust copy → detail rows.
- **Sticky behavior:** ≥1024px the panel column may stick below the header
  while the gallery scrolls **[FUTURE]**; never sticky on mobile.
- **Price:** current price bold 24px; compare-at struck-through, 40% ink,
  left of price. Customization adds to displayed price live ("Buy Now · $110").
- **Drop status (limited products):** smoke panel — "Drop Version {N} ·
  {limit} made" + "{remaining} remaining" (red, bold) + progress bar +
  no-reprint line. Values from live product data; never hardcode.
- **Customization [LIVE]:** bordered card, checkbox "Add name & number ·
  +$15" + "Printed on the back. Optional." Expands to NAME (A–Z + space,
  ≤12, auto-uppercase) and NUMBER (0–99). Price from
  `customizationPriceCents` — never a global constant.
- **Size:** pill radio group; error "Select a size to continue." inline
  under the group. Single-size products (accessories): selector hidden,
  size auto-applied. **[FUTURE]:** size-guide link → modal table.
- **CTAs:** Buy Now (red, price in label; adds + routes to `/cart`) above
  Add to Cart (outline; stays, button reads "Added ✓" 2s).
- **Trust copy:** 2×2 grid, green checks: Secure checkout · Made to order ·
  Ships after production · Limited drop (4th only when limited).
- **Fabric/Shipping rows:** Material / Fit / Care as divided rows below
  CTAs — specs echo [materials.md](../00_brand/materials.md).
  **[FUTURE]:** Shipping row ("Made to order. Production 5–7 business
  days, shipping 3–7.").

### Recommendations [LIVE]
"You might also like" — 4 other products, standard grid, below main block.
**[FUTURE]:** same-category-first ordering, then cross-category by price
proximity.

### Image sizes
Source ≥1600×2000px (4:5). Served via `next/image` with `sizes`:
full-viewport-width mobile, ~50vw ≥1024, thumbnails 64px.

---

## 7. Cart

**Conversion goal:** click Checkout.

| Viewport | Layout |
|---|---|
| Desktop ≥1024 | Two columns: line items (fluid) + 360px summary card, sticky below header |
| Tablet | Single column: items then summary |
| Mobile | Single column; summary is the natural scroll end — checkout button in thumb zone |

- **Line item:** 96×112px image (links back) · name · "{color} · Size {size}"
  · customization line ("Custom: SILVA · #10") when present · pill quantity
  stepper (− count +) · Remove (text link, red on hover) · line total.
- **Customization summary:** custom name/number always visible in-line —
  the customer must see exactly what will be printed before paying.
- **Summary card:** smoke, radius 12px: Subtotal → "Shipping: Calculated at
  checkout" → red full-width Checkout pill → trust list (Secure checkout
  via Stripe · Made to order · Ships after production · Limited drop).
- **Shipping estimate:** never fake a number; Stripe owns shipping.
  **[FUTURE]:** free-shipping threshold progress line when policy exists.
- **Empty state:** "Your cart is empty" + "The next goal deserves a shirt."
  + red "Shop the Collection" → `/shop`.
- **Checkout errors** (Stripe unset, product removed/sold out): inline
  `role="alert"` under the button — never a browser alert, never silent.

---

## 8. Checkout Flow

```
/cart ──POST /api/checkout──▶ Stripe Checkout (hosted) ──▶ /success
   ▲                                    │
   └────────────── cancel ◀─────────────┘
```

1. **Cart → API:** client sends product ids, sizes, quantities,
   customization only. **Server recomputes all prices** — client prices are
   display-only. Full contract: [Appendix B](#appendix-b-api-contracts).
2. **Stripe Checkout [LIVE, gated]:** hosted page collects payment,
   shipping address (US/CA/PT/GB), email. Line items carry
   name/size/color/customization in description + metadata. Until
   `STRIPE_SECRET_KEY` is set, the API returns the friendly pre-launch
   message and the cart displays it inline.
3. **Success `/success`:** clears cart on mount. "GOOOOOL!" display +
   "Order confirmed." + production expectation + "Keep shopping".
4. **Cancel:** Stripe's cancel returns to `/cart` with cart intact. No
   guilt copy.
5. **Order confirmation [FUTURE — next backend milestone]:** webhook on
   `checkout.session.completed` writes `orders` + `order_items`, increments
   `drop_sold_count`, fires confirmation email.
6. **Email sequence [FUTURE, Resend]:** Order confirmed (instant) → In
   production (+1 day) → Shipped + tracking. Designs: `designs/10_email/`.
   Voice: [voice.md](../00_brand/voice.md).
7. **Future account support:** flows stay guest-first forever. Accounts
   (if ever) add order history — they never gate purchase.

---

## 9. About

**Conversion goal:** Shop the Drop (emotional detour, same destination).

- Single column, max 768px. H1 "Born from the sound." (red "sound").
- **Mission:** the GOOOOOOOL moment, ≤3 sentences [LIVE].
- **Brand story [FUTURE — owner's words]:** beats: stadium reaction ·
  family watch party · Portuguese neighborhoods · kids celebrating · raw
  excitement. ≤4 short paragraphs. Draft space: [brand-guide.md](../00_brand/brand-guide.md).
- **Values:** premium quality · honest scarcity · independence (with
  disclaimer) · fan-first.
- **Future timeline [FUTURE]:** simple vertical list (founded → Drop I →
  Summer '26 → beyond). No animation.
- Closes with red Shop the Drop CTA.

---

## 10. FAQ

- **Organization:** single list, ordered by purchase-objection priority:
  shipping → sizing → returns → customization → drops → legitimacy.
  Content lives in `src/lib/faq.ts` — one source for page + home preview.
  Split into grouped sections only past 12 items.
- **Accordion:** one item open at a time; first item open by default
  on the FAQ page; plus icon rotates 45° (150ms, the only animation);
  full row is the hit target; `aria-expanded` managed.
- **Search [FUTURE]:** client-side filter field above list past 15 items.
- **Mobile:** identical component; answer text 14px/relaxed; generous 20px
  row padding preserved.
- Page ends with contact hand-off card ("Still have a question?" → Contact).

---

## 11. Contact

- **Layout:** single column, max 576px. H1 + one reassurance line
  ("we reply within one business day").
- Name + message fields → mailto handoff to **hello@portugooool.com**
  [LIVE]. Direct email always printed as fallback below the button.
- **[FUTURE]:** `/api/contact` via Resend replaces mailto (same layout);
  order-number field appears when order support volume justifies it.
- **Future chat support:** none planned near-term. If ever added: no
  third-party chat bubble may load JS on non-contact pages.

---

## 12. Error States

Every error state is branded, explains what happened, and offers a path
forward. Football language, one line, never blame the user.

| State | Spec |
|---|---|
| 404 [LIVE] | "Offside" ghost display + "This page doesn't exist." → red Back to the Shop |
| 500 [FUTURE — `error.tsx`] | "Own goal. Something broke on our end." + Try again (reset) + link home. Same visual family as 404 |
| Offline | Cart is localStorage-persistent; static pages served from cache. Failed API POSTs show inline "Something went wrong. Try again." — no dedicated offline page at launch |
| Empty search [FUTURE] | "No match for '{query}'." + clear-search + full grid below — never a dead end |
| No products | Grid empty state per §5 + newsletter capture |
| Sold out | Never an error — a brand moment. Card overlay + detail panel per §6; copy sells the next drop |
| Payment failure | Stripe handles on its page (retry in place). Cancel/return → `/cart` intact. Checkout API failures → inline alert under Checkout button |

---

## 13. Accessibility

Contract, not aspiration. WCAG 2.1 AA minimum.

- **Touch targets:** ≥44×44px interactive elements; ≥8px between adjacent targets.
- **Keyboard:** everything operable by keyboard; drawer and (future) modals
  trap focus and close on Escape; logical tab order; skip-to-content link [FUTURE].
- **ARIA:** labels on all icon-only buttons ("Cart, 2 items", "Open menu");
  `role="radiogroup"`/`radio` + `aria-checked` on size pills;
  `aria-expanded` on accordions; `role="alert"` on errors; decorative
  SVGs `aria-hidden`.
- **Contrast:** AA pairs only — approved combinations in
  [colors.md](../00_brand/colors.md). Gold never carries text on paper.
- **Focus states:** visible on every interactive element; never
  `outline: none` without a replacement.
- **Reduced motion:** honor `prefers-reduced-motion` — hover scale and
  icon rotation drop to instant state changes.
- **Typography:** body ≥16px; state never communicated by color alone
  (sold-out = overlay + text; errors = icon/text + color).

---

## 14. Performance

Budgets (CLAUDE.md targets: Lighthouse 95+ across the board):

| Budget | Value |
|---|---|
| LCP | < 2.5s (4G mid-range device) |
| CLS | < 0.1 — reserve space for all media; skeletons match final dimensions |
| INP | < 200ms |
| First Load JS | ≤ 110KB per route (current ~100KB — treat as ceiling, not license) |
| Product source images | ≥1600×2000, ≤350KB after optimization (WebP/AVIF via `next/image`) |
| Hero | CSS-only today; if imagery is added: ≤180KB, `priority` loaded |

Rules: `next/image` for every raster (lazy by default, accurate `sizes`,
`priority` only above-fold) · SVG for icons/logos/placeholders (inline UI
icons, no icon-font, no icon library) · system fonts today — a hosted
display font must use `next/font` subsetting · static generation everywhere,
CDN-cached; only API routes dynamic · server components by default,
`"use client"` only for interaction · every new dependency justifies its
bundle cost in the PR.

---

## 15. SEO

- **Metadata [LIVE]:** title template `%s · PORTUGOOOL`; unique
  title + ≤160-char description per page; product pages derive from
  name/description; `metadataBase` = `NEXT_PUBLIC_SITE_URL`.
- **Open Graph [PARTIAL]:** site-level OG live. **[FUTURE]:** 1200×630 OG
  image (wordmark on ink); product pages use product image + price.
- **Twitter Cards [FUTURE]:** `summary_large_image`, same assets as OG.
- **Canonical URLs [FUTURE]:** self-referencing canonicals; one URL per
  product (`/shop/{slug}` only); filter/sort query params get canonical to
  the clean path.
- **Schema.org [FUTURE — before marketing push]:** `Product` + `Offer`
  (price, currency, availability — sold-out maps to `OutOfStock`) on
  product pages; `Organization` on home; `FAQPage` on FAQ.
- **Image metadata:** alt text describes the product ("Home Red Jersey —
  front"), never filenames or keyword stuffing.
- **Sitemap/robots [FUTURE]:** `sitemap.xml` + `robots.txt` when catalog
  stabilizes.

---

## 16. Future Expansion

Design decisions that keep tomorrow cheap — build nothing early, block
nothing either:

| Expansion | Website readiness rule |
|---|---|
| Women's / kids collections | Shop is category-section-driven; new categories = new section + `product_category` value. Nav gains a Collections dropdown only when categories >5 |
| Accessories growth | Already a first-class category; accessory pages auto-hide size UI (single-size pattern) |
| Gift cards | Modeled as a product (category `gift-card`, no shipping); Stripe supports directly; cart/checkout unchanged |
| Customer accounts | Guest checkout remains the default path forever; accounts only ever add history/speed |
| Loyalty program | Keyed on customer email captured at checkout — no schema change required to start |
| Wholesale | Separate quote-request page; never mixes with retail cart |
| Multiple languages | All copy lives in components/`src/lib` (no CMS); i18n = extract to locale dictionaries; routes gain `/{locale}` prefix; PT is the obvious second language |
| International shipping | Add countries to the Stripe allowlist; display currency remains USD until a localization pass |
| Reviews / recommendations | Product schema reserved fields; recommendations slot exists on product page (§6) |

Every expansion must re-pass: one conversion goal per page · mobile
invariant (§6) · performance budgets (§14) · legal standards (CLAUDE.md).

---

## Appendix A: Route & Rendering Map

| Route | Rendering | Conversion goal |
|---|---|---|
| `/` | Static | Shop the Drop |
| `/shop` | Static | Enter a product page |
| `/shop/[slug]` | SSG per product | Add to cart / Buy Now |
| `/drop` | Static | Buy a jersey |
| `/customize` | Static | Buy a customized jersey |
| `/world-cup` | Static | Email capture + drop |
| `/about` | Static | Shop the Drop |
| `/faq` | Static | Resolve objection → shop |
| `/contact` | Client | Send message |
| `/track-order` | Client | Self-serve order status |
| `/cart` | Client | Checkout |
| `/success` | Client | Clear cart, reassure |
| `/api/checkout` · `/api/newsletter` | Dynamic POST | — |

New pages default to static server components; client rendering requires
interaction as justification.

## Appendix B: API Contracts

**`POST /api/checkout`** — request:
`{items: [{productId, size, color, quantity, customName|null, customNumber|null}]}`.
Validation order: (1) Stripe key missing → 503 pre-launch message ·
(2) malformed/empty → 400 · (3) unknown/inactive product → 400 ·
(4) sold out → 400 · (5) invalid size → 400 · then: quantity clamped 1–10,
name ≤12 chars, number ≤2 digits, customization stripped unless product
allows it, add-on priced from `customizationPriceCents`. **All prices
resolved server-side.** Success: 200 `{url}` (Stripe session; shipping
countries US/CA/PT/GB; per-line metadata product_id/size/color/custom_name/
custom_number; success `/success?session_id=…`, cancel `/cart`).

**`POST /api/newsletter`** — `{email}` → normalize, validate (regex, ≤254)
→ 400 invalid · upsert on unique email (duplicate = silent success) · no
Supabase env → log-only `{ok:true}` · success 200 `{ok:true}`.

**`POST /api/stripe-webhook` [FUTURE]** — `checkout.session.completed`:
insert order + items from metadata → `increment_drop_sold()` per item →
Resend confirmation.

## Appendix C: Data Model

Canonical: `src/lib/types.ts` ↔ `supabase/migrations/0001_initial_schema.sql`
(1:1 field map; mock catalog and DB seed share UUIDs until reads go live).

Product essentials: `slug` (URL) · `priceCents` (integer cents, always) ·
`compareAtPriceCents` (sale display) · `category`
(jersey/casual/accessory) · `supplierType` (fulfillment routing, unassigned
today) · drop trio `dropVersion`/`dropLimit`/`dropSoldCount` (derived:
`remaining = max(0, limit − sold)`; `soldOut = remaining === 0`) ·
customization flags + `customizationPriceCents` (1500 jerseys, 0 others) ·
`sizes` (S–3XL shirts, `["OS"]` accessories) · `images [{src, alt}]`.

Orders: `status` (pending/paid/cancelled/refunded) + `fulfillment_status`
(unfulfilled/submitted/in_production/shipped/delivered/cancelled).
Cart (client): localStorage `portugooool-cart-v1`; line key =
`productId|size|customName|customNumber`. RLS: products public-read when
active; everything else service-role only. Admin helpers:
`increment_drop_sold()`, `order_export` view.

## Appendix D: States That Must Never Regress

| Case | Required behavior |
|---|---|
| Checkout without Stripe key | Inline friendly message in cart (503) |
| Cart references removed product | 400 with clear message |
| Duplicate newsletter signup | Silent success (no email enumeration) |
| No size selected | Inline alert, no browser dialogs |
| Single-size product | Selector hidden, auto-applied |
| Sold out | Card overlay · detail panel swap · API rejection |
| Empty cart/grid | Branded empty state with a path forward |
| localStorage blocked | Cart degrades to in-memory session |
| Unknown route | Branded 404 → shop |
| Mobile product page | Purchase block above the fold at 375×812 |

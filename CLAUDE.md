> **Production lettering hold:** [Measured small-letter failures and latest crewneck font](designs/19_colorway-and-back-print-review/README.md) govern every upload. Use the crewneck FRONT badge font on its curved back, not italic Modern Sport. Correct failed actual-size lettering before production; sharp concepts are not print approval.

> **Latest owner decisions (2026-09-21):** Modern Sport is performance-only; cotton is archived with files retained. Pricing now targets 25% modeled contribution: [current price model](designs/18_launch_operations/PRICING-25-PERCENT.md). [Current design review](designs/19_colorway-and-back-print-review/README.md) supersedes the straight crewneck back layout and seven-active-product color plan: six color proposals remain, crew lettering follows the collar curve, and detail views apply only to small back prints. Keep sewn-tag/sample/payment requirements.

> **Latest launch/tag decision:** Read [CLAUDE-LAUNCH-PRIORITY-PROMPT.md](CLAUDE-LAUNCH-PRIORITY-PROMPT.md). Owner requires the approved sewn tag; any necessary alternative needs a mockup and approval first. No physical samples are approved. Stripe live activation remains unconfirmed. A 24-hour target does not waive product or payment checks.

> **Current price publication:** The owner authorized publishing all six Athletics retail prices on 2026-09-21. Read [PRICING-RELEASE-2026-09-21.md](designs/18_launch_operations/PRICING-RELEASE-2026-09-21.md). This supersedes the earlier publication hold for these six prices; full landed-cost and product-readiness checks remain open. Casual Wordmark Tee rebuilt on the Bella+Canvas 3010 and split into two shop rows by owner decision 2026-09-24: …0003 "GOOOL Casual Wordmark Tee · Red" (slug unchanged; Black live, Apliiq 6120860; Natural live, Apliiq id pending the owner's save) and …0005 "GOOOL Casual Wordmark Tee · Club Blue" (slug goool-heavyweight-casual-tee-blue; Natural live, Apliiq 6120887; Black live, Apliiq 6120898). Both are availableForSale: true since 2026-09-24 (owner: no casual tee sits behind Coming Soon unless they say so); the order store upserts the catalog row before writing order items (ensureProductRows), and migration 0034 remains to run in the SQL editor for the audit trail. See designs/00_asset-library/CASUAL-TEE-3010-DECISION.md (split section) and designs/24_casual-tee-3010-2026-09-23/site-imagery/README.md. The Core Hoodie was remade the same day with the same print sets on the IND4000: two rows, …0002 "GOOOL Core Hoodie · Red" and …0006 "GOOOL Core Hoodie · Club Blue", Black/Bone/Grey Heather, six Apliiq designs, imagery from Apliiq's saved-design renders; see designs/00_asset-library/CORE-HOODIE-REMAKE-DECISION.md and designs/25_core-hoodie-remake-2026-09-24/. The **Core Capsule** is the first collection to launch (Friday 2026-09-25): nine rows, all for sale; the Athletics Varsity Tee, Circular Badge Tee and Circular Center Crewneck were retired from the site on 2026-09-24 (designs kept on Apliiq); see designs/00_asset-library/CORE-CAPSULE-LAUNCH-DECISION.md. Every launch piece is gathered per product in CORE-CAPSULE-LAUNCH-2026-09-25/ at the repo root (a curated copy; rebuild with `python scripts/assemble-core-capsule.py`, canonical files stay in designs/ and public/products/).

> **Current catalog presentation:** Follow [PRODUCT-TILES-IMPLEMENTATION.md](designs/18_launch_operations/PRODUCT-TILES-IMPLEMENTATION.md). The owner approved reference-style 4:5 studio tiles with visible separation and original garment images preserved. This supersedes blanket white-background/no-box requirements in older prompts. Generated model references and price-area origin badges stay removed. Do not repeat masking or recoloring of garment assets. The six new prices were subsequently authorized and published; see the price publication note above.

> **Current launch priorities and communication preference:** Read [LAUNCH-TASK-LIST.md](LAUNCH-TASK-LIST.md). Prioritize Stripe, then verified costs/new prices, product readiness and an Instagram-only launch. Owner subsequently authorized the six displayed prices; full landed costs remain launch checks. Include a ready-to-copy next-action prompt in every response.

> **Artwork audit — 2026-09-21:** Current artwork authority for all active and unlaunched designs: [designs/00_asset-library/START-HERE.md](designs/00_asset-library/START-HERE.md). Read its family-specific source selections and conflict register before the historical brand rules below. Current v2 packages include ARTWORK-AUDIT.md; original and derived files have different roles.

# GOOOL — Project Operating Manual

Permanent source of truth for every contributor: engineers, designers,
marketers, manufacturers, and AI agents. Read this before changing anything.

---

# Project Overview

**GOOOL** (house brand, launched from the PORTUGOOOL pivot 2026-07-08)
does not sell shirts. It sells the emotion of hearing **"GOOOOOOOOL"** —
the one word every stadium on earth screams the same.

Brand architecture: **GOOOL is the house brand** (domain: goool.shop).
**PORTUGOOOL is The Portugal Collection** — chapter one, the name lives on
the apparel and collection pages, not as the store brand. Future chapters
follow the same pattern: nation-inspired colorways + the sound, never
federation symbolism. Collection portmanteaus (PORTUGOOOL, ENGOOOLAND) are
optional — only when natural; otherwise the GOOOL house mark carries it.

Every design decision reinforces excitement, celebration, pride, passion,
and premium quality. The apparel is timeless, not trendy. The website feels
like **Apple meets Nike** — never a typical Shopify template.

Brand line: **"The Sound of Victory."**

- Live site: **https://portugoool.com** → becomes **https://goool.shop** once its nameservers land (phase 2 of the pivot; both domains stay, loser 301s to winner)
- Repo: `gdove90/portugoool-site` (main branch auto-deploys)
- Extended brand documentation: [designs/00_brand/](designs/00_brand/README.md)

---

# Core Brand Principles

1. Emotion before product
2. Premium over flashy
3. Simple beats complex
4. Large imagery
5. Minimal UI
6. Fast purchasing — no account required
7. Drops as releases, never fake scarcity — everything is made to order (POD)
8. Quality over quantity

Every page has **one primary conversion goal**. On most pages that goal is
"Shop the Drop."

---

# Technology Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (tokens in `tailwind.config.ts`) |
| Hosting | Netlify (project `goool-shop`, `@netlify/plugin-nextjs`) |
| Database | Supabase (project ref `oexibflpshttgzmdvhpr`, dedicated free org) |
| Payments | Stripe Checkout (server-side pricing only) |
| Source | GitHub (`gdove90/portugoool-site`) |
| Fulfillment | Printful / Printify / Apliiq / Gelato — later (`supplier_type` field ready) |
| Email | Resend — later |

**Never introduce unnecessary frameworks. Keep dependencies minimal.**
No component libraries, no state managers, no CSS-in-JS. Justify every new
dependency in the PR/commit that adds it.

---

# Project Isolation

This project is **completely independent**. Never reuse, connect, import,
or reference anything from **HireOnTheFly** or **LocalChef RI**.

Kept separate, always: repositories · Supabase projects · Stripe accounts ·
Netlify sites · environment variables · GitHub Actions · assets · databases.

The Supabase project lives in its own free org, renamed 2026-09-21 from
"portugoool" to "GOOOL"; the project itself is now "GOOOL" too. Only the
display names changed — project ref `oexibflpshttgzmdvhpr` and every key
and connection string are unaffected.

The org-scoped Supabase MCP connector CANNOT see this project. Verified
2026-09-21: `list_projects` through that connector returns only
`localchefri` (an earlier note here said HireOnTheFly; that was wrong).
The empty result is the isolation working, not an outage — never read it
as "the GOOOL database is missing". Use the authenticated Supabase SQL
editor (the established workflow, named in each migration header), or the
Management API / CLI with a user token. Never run GOOOL SQL against the
connector's project.

---

# Folder Standards

| Folder | Purpose |
|---|---|
| `src/app/` | Routes + API endpoints (App Router) |
| `src/components/` | Reusable UI components — one component per file |
| `src/lib/` | Types, data access, cart, Supabase clients, helpers |
| `public/` | Production static assets; product images in `public/products/` |
| `supabase/` | SQL migrations — the schema's source of truth |
| `designs/` | **Visual documentation source of truth** — brand docs, mockups, tech packs. Never imported by app code. Start at [`designs/_LIBRARY/`](designs/_LIBRARY/README.md): logos, designs by garment, kit sponsorship, and `1-PRINT-FILES/` (what you upload to Apliiq). |
| `scripts/` | Build/ops scripts (create when first needed) |
| `src/styles/` | Only `app/globals.css` today; add here if styles grow |
| `src/lib/types.ts` | Domain types (split into `src/types/` if it outgrows one file) |

---

# Design System Rules

- Mobile first; desktop is the enhancement
- White space is intentional — don't fill it
- Products are always the hero
- No unnecessary animations; minimal gradients
- Premium typography, large photography
- Design tokens live in `tailwind.config.ts` (extend with CSS variables in
  `globals.css` when theming requires it)
- Components are reusable — no page-specific one-offs
- Accessibility first

Canonical references: [designs/00_brand/colors.md](designs/00_brand/colors.md),
[typography.md](designs/00_brand/typography.md),
[design-principles.md](designs/00_brand/design-principles.md).

---

# UI Principles

Large product imagery (4:5 cards) · simple navigation · large pill CTA
buttons · clean spacing · limited text · readable typography · high contrast ·
fast loading · simple checkout (one Stripe handoff, no accounts).

Product pages keep price, size, customization, and the buy button above the
fold on mobile. Trust copy sits near every buy button: *Secure checkout ·
Delivery within 5–7 business days · Limited drop*. Never mention
made-to-order/on-demand production in customer-facing copy (owner
decision, 2026-07-23).

---

# Color System

Defined in `tailwind.config.ts`; documented in
[designs/00_brand/colors.md](designs/00_brand/colors.md).

| Token | Name | HEX |
|---|---|---|
| `red` | Primary Red | `#C1121F` |
| `red-dark` | Red (hover) | `#8E0D17` |
| `green` | Forest Green | `#0B3D2E` |
| `gold` | Gold | `#C9A227` |
| `ink` | Black | `#0A0A0A` |
| `smoke` | Cream / section bg | `#F4F4F2` |
| `paper` | White | `#FFFFFF` |
| — | Light Gray | `#E5E5E3` *(placeholder — formalize before use)* |
| — | Dark Gray | `#4A4A4A` *(placeholder — formalize before use)* |

Rules: red = action only · gold never on white · ink/paper for reading ·
all pairs pass WCAG AA.

---

# Typography Rules

- **Display/Heading:** **Anton** via `next/font` (`font-display`, single
  weight). **Permanent Marker** (`font-marker`) is a restricted accent —
  hero wordmark only (see designs/00_brand/typography.md)
- **Body:** system stack (`font-sans`)
- **Buttons:** body stack, semibold, sentence case — never all-caps
- **Scale:** hero `text-6xl→text-9xl`, section heads `text-3xl→text-4xl`,
  body `text-base`, captions `text-xs`
- **Letter spacing:** display gets `tracking-tightest` (âˆ’0.03em); tiny
  eyebrow labels get `tracking-widest`; nothing in between
- **Line height:** `leading-none` for display, `leading-relaxed` for body
- **Responsive:** set mobile size first, scale with `sm:`/`lg:` prefixes
- Body copy max width ~65ch

---

# Component Standards

Every component is reusable, typed, and lives in `src/components/`.

| Component | Status | Standard |
|---|---|---|
| Buttons | live (pattern) | Pill shape. Red = primary, ink/outline = secondary |
| Cards (`ProductCard`) | live | 4:5 image, name + swatch + price, sold-out overlay |
| Forms | live (pattern) | Visible labels, rounded-lg inputs, inline validation |
| Navigation (`Header`, `MobileNav`) | live | Sticky header, drawer on mobile |
| Footer | live | Nav + independence disclaimer |
| Announcement Bar | live | Single line, dismissible (session), one message at a time |
| Trust Bar | live (`TrustBar`) | 4 items, gold icons on ink, never links |
| Drop Counter | live (inline in `ProductDetail`) | "Drop Version N · X made · Y remaining" + bar |
| Product Grid | live | 2-col mobile → 4-col desktop |
| Product Gallery | live (inline) | Main image + thumbnails |
| Cart | live | localStorage, no server state |
| Checkout | live | Stripe handoff; prices always server-side |
| Accordion (`FAQAccordion`) | live | One open at a time, plus-icon rotation |
| Email Signup | live | Single field + button, inline success state |

---

# Product Rules

Every product supports: limited drops (`dropLimit`/`dropSoldCount`) ·
version numbers (`dropVersion`) · custom name · custom number ·
future inventory tracking · future fulfillment (`supplier_type`,
`fulfillment_status`) · future reviews · future recommendations.

- Customization is a paid add-on (**$15**, jerseys only), priced per product
  (`customizationPriceCents`) — never hardcode
- Mock catalog (`src/lib/products.ts`) and Supabase seed share UUIDs; keep
  them in sync until reads flip to the database
- Drop copy: *"Once this drop sells out, it will not be reprinted."*

---

# Performance Goals

- Lighthouse: **95+ performance, 95+ accessibility, 95+ SEO**
- Minimal JavaScript — server components by default, `"use client"` only
  when interactive
- Images: `next/image` everywhere, lazy by default, responsive `sizes`
- Fonts: system stacks now; if a hosted display font lands, use
  `next/font` with subsetting
- Watch bundle size on every dependency addition

---

# Accessibility Standards

Keyboard navigable (real focus states) · ARIA labels on icon buttons and
widgets · WCAG AA contrast minimum · readable font sizes (≥16px body) ·
touch-friendly targets (≥44px) · screen-reader support (semantic HTML,
`role="alert"` on errors, `aria-live` where state changes) · respect
`prefers-reduced-motion` · never communicate state by color alone.

---

# Image Standards

- Never ship low-resolution assets
- SVG whenever possible (icons, logos, placeholders)
- Optimize every raster image before it enters `public/`
- Concepts and explorations live in `designs/` — **never** in `public/`
- **AI imagery policy:** atmosphere/emotion imagery (heroes, banners,
  social) MAY be AI-generated if it contains no recognizable real-person
  likeness, no crests/trademarks, and no legible text. **Product listing
  photos must always show the real product** customers receive — never AI.
  UI mockups (dc.html etc.) are references, never shipped directly.
- Product image paths stay swappable: replace files, not code

---

# Legal Standards

**Never use:** official Portugal Federation assets · FIFA branding · UEFA
branding · official World Cup branding (use "Summer '26" language) · player
names or likenesses · official crests · Nike, Adidas, or Puma assets.

Build an original fan-inspired brand. All marks and designs are original.
The independence disclaimer stays in the footer, FAQ, and About page.

---

# Coding Standards

Small functions · prefer composition · avoid duplication · strong typing
(no `any`) · reusable components · clean file names · simple architecture ·
readable code · comment only where the *why* isn't obvious.

Match the existing code's style: Tailwind utilities inline, domain logic in
`src/lib/`, data-shape parity between mock data and SQL schema.

---

# Git Standards

- Small commits with clear messages (imperative subject, context in body)
- Feature branches when a change is risky or multi-session
- **Never commit:** secrets, API keys, `.env*` files (`.gitignore` enforces;
  keys live in Netlify env vars and `.env.local` only)
- `main` auto-deploys to production — keep it shippable

---

# Future Expansion

Design every system assuming these will exist: women's collection · kids
collection · expanded accessories · wholesale · retail stores ·
international shipping · multiple languages · customer accounts ·
gift cards · loyalty program.

Practical implication: keep product schema category-driven, price logic
server-side, copy centralized, and components prop-driven — nothing that
assumes "one collection, one language, one currency" forever.

---

# Design Philosophy

The customer should immediately feel: **energy · celebration · premium
quality · scarcity · confidence · pride · emotion.**

Every page reinforces: **"The Sound of Victory."**

---

# AI Instructions

Future Claude Code sessions must:

1. **Read this file first** — it is the operating manual
2. Follow these standards unless explicitly instructed otherwise
3. Check [designs/00_brand/](designs/00_brand/README.md) before visual changes
4. Do not introduce unnecessary complexity
5. Do not overwrite established design decisions — document changes in
   `designs/` first, then implement
6. **Always preserve project isolation** (see Project Isolation above)
7. Always preserve brand consistency and the legal standards
8. When uncertain, choose the simpler solution
9. Verify changes in a live preview before declaring them done, and keep
   `main` deployable — every push goes to production

# PORTUGOOOL — Project Operating Manual

Permanent source of truth for every contributor: engineers, designers,
marketers, manufacturers, and AI agents. Read this before changing anything.

---

# Project Overview

PORTUGOOOL does not sell shirts. It sells the emotion of hearing
**"GOOOOOOOOL."**

Every design decision reinforces excitement, celebration, pride, passion,
and premium quality. The apparel is timeless, not trendy. The website feels
like **Apple meets Nike** — never a typical Shopify template.

Brand line: **"The Sound of Victory."**

- Live site: **https://portugoool.com** (Netlify DNS; `portugoool.netlify.app` is the underlying site)
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
7. Limited drops — honest scarcity, never fake urgency
8. Quality over quantity

Every page has **one primary conversion goal**. On most pages that goal is
"Shop the Drop."

---

# Technology Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (tokens in `tailwind.config.ts`) |
| Hosting | Netlify (project `portugoool`, `@netlify/plugin-nextjs`) |
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

The Supabase project lives in its own free org ("portugoool"). The
org-scoped Supabase MCP connector sees only the HireOnTheFly org — use the
Management API or CLI with a user token for this project's database.

---

# Folder Standards

| Folder | Purpose |
|---|---|
| `src/app/` | Routes + API endpoints (App Router) |
| `src/components/` | Reusable UI components — one component per file |
| `src/lib/` | Types, data access, cart, Supabase clients, helpers |
| `public/` | Production static assets; product images in `public/products/` |
| `supabase/` | SQL migrations — the schema's source of truth |
| `designs/` | **Visual documentation source of truth** — brand docs, mockups, tech packs. Never imported by app code. |
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
Made to order · Ships after production · Limited drop*.

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
- **Letter spacing:** display gets `tracking-tightest` (−0.03em); tiny
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

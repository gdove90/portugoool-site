# Handoff: PORTUGOOOL Homepage — Iteration 01 "Bold & Emotional"

## Overview
Redesign of the PORTUGOOOL homepage based on the approved mockup
(`designs/ChatGPT Image Jul 7, 2026, 10_37_21 PM.png`, Iteration 01).
Turns the current CSS-only light hero into a dark, photo-led, emotional
landing: red announcement bar → dark header → full-bleed crowd hero with
brush-script wordmark → gold trust bar → the existing homepage sections.

## About the Design Files
`Portugoool Homepage.dc.html` in this bundle is a **design reference built in
HTML** — a prototype showing intended look and behavior, NOT production code.
The task is to **recreate this design in the existing Next.js 14 + Tailwind
codebase** (the `Portugoool` repo), reusing its established components and
tokens. Do not ship the HTML file.

## Fidelity
**High-fidelity.** Colors, type, spacing, and copy are final and reconciled
with `designs/00_brand/` (colors.md, typography.md) and
`designs/04_website/website-bible.md`. Recreate pixel-perfectly.

## Target codebase mapping
Most sections below §3 already exist and are unchanged — this handoff mostly
restyles the top of the page:

| Design section | Codebase change |
|---|---|
| Announcement bar | NEW component (website-bible §4.0 was [FUTURE] — now live) |
| Header | `src/components/Header.tsx` — restyle light → dark |
| Hero | `src/components/Hero.tsx` — full rewrite (photo hero) |
| Trust bar | NEW component (website-bible §4.3, dark variant) |
| Drop Version I, Fabric, Casual, Customization, Drop banner, FAQ, Newsletter, Footer | **Unchanged** — keep existing components (`src/app/page.tsx`) |
| Fonts | `tailwind.config.ts` + `next/font` — add Anton + Permanent Marker |

## Screens / Views

### 0 · Announcement Bar (new)
- Full-width strip above header. Background `#C1121F` (red), text `#FFFFFF`.
- Height 40px, flex-centered. Copy (uppercase, 12px, weight 700,
  letter-spacing 0.14em): `Drop 01 · Limited to 500 jerseys · Once it's gone, it's gone.`
- One message, never rotates. Dismissible per website-bible §4.0 (× optional).

### 1 · Header (restyled dark)
- Background `#0A0A0A` (ink), bottom border `1px solid rgba(255,255,255,0.08)`.
- Height 64px, content max-width 1200px, 24px gutters, sticky.
- Wordmark: Anton 24px uppercase, `#FFFFFF`, "OOO" in `#C1121F` —
  `PORTUG<span red>OOO</span>L`.
- Nav (center): Shop · Limited Editions · Customize · About · World Cup
  Collection. 12px, weight 600, uppercase, letter-spacing 0.1em,
  `rgba(255,255,255,0.75)` → `#FFFFFF` on hover. Gap 28px.
- Right: 3 icon buttons 40×40 (search, account, cart bag — existing inline
  SVG style, stroke-width 2, 18px), hover `rgba(255,255,255,0.1)` circle.
  Keep cart badge behavior from current `Header.tsx` (red circle, count).
- Mobile: unchanged drawer pattern from current codebase, dark palette.

### 2 · Hero (photo-led)
- Section height 680px desktop, `position: relative`, overflow hidden.
- Background image: `assets/hero-crowd.png` (fan with raised fist, red
  crowd) — object-fit cover, full-bleed. Serve via `next/image` with
  `priority` (LCP element; keep ≤180KB after optimization per §14).
- Overlay gradient:
  `linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 35%, rgba(10,10,10,0.15) 55%, rgba(10,10,10,0.75) 92%)`.
- Content: absolutely centered column, text-align center.
  - H1 wordmark: font **Permanent Marker**, 150px, line-height 0.95,
    `#FFFFFF`, text-shadow `0 6px 40px rgba(0,0,0,0.6)`. Text: `Portugoool`.
  - Tagline: **Anton**, 34px, uppercase, letter-spacing 0.16em, `#FFFFFF`:
    `The Sound of Victory.`
  - CTA (36px below): pill button, `#FFFFFF` bg / `#0A0A0A` text
    (alt variant: `#C1121F` bg / white text), padding 16px 40px, 15px
    weight 600, shadow `0 4px 24px rgba(0,0,0,0.35)`, hover scale 1.03.
    Label `Shop the Drop` → `/drop`.
- Mobile: H1 scales down to ~64px, tagline ~20px, CTA full-width; 80px
  vertical padding (typography.md scale).

### 3 · Trust Bar (new, dark)
- Background `#0A0A0A`, top border `rgba(255,255,255,0.08)`, padding 28px.
- 4-column grid (2×2 on mobile per §4.3), each item flex row, gap 14px,
  centered:
  1. Box icon — **LIMITED DROPS** / Never Reprinted
  2. Shield-check — **PREMIUM QUALITY** / Built to Perform
  3. Globe — **WORLDWIDE SHIPPING** / For Fans Everywhere
  4. Star — **MADE FOR THE MOMENT** / When It Hits Different
- Icons: 26px inline SVG, stroke `#C9A227` (gold), stroke-width 1.6.
- Title: 12px weight 700 uppercase letter-spacing 0.1em `#FFFFFF`.
  Sub: 11px `rgba(255,255,255,0.5)`. No links (contract).

### 4–11 · Existing sections (unchanged)
Keep exactly as in `src/app/page.tsx` today, in this order: Drop Version I
grid → FabricFeatureGrid → Casual preview → Customization → DropBanner →
FAQ preview → EmailSignup → Footer. Section headings switch to the new
display font (Anton) automatically via the `font-display` token change.

## Interactions & Behavior
- Header sticky; hover states as specified above.
- Hero CTA: hover scale(1.03), 150ms; routes to `/drop`.
- FAQ accordion, newsletter form, cart: existing behavior, unchanged.
- Reduced motion: hero CTA scale drops to instant state change (§13).

## State Management
No new state. Announcement bar dismissal (if implemented): sessionStorage
flag per website-bible §4.0.

## Design Tokens
Colors (already in `tailwind.config.ts` — no changes):
- ink `#0A0A0A` · paper `#FFFFFF` · red `#C1121F` · red-dark `#8E0D17`
- green `#0B3D2E` · gold `#C9A227` · gold-light `#E4C65B` · smoke `#F4F4F2`

Typography (CHANGE — implements the planned upgrade in typography.md):
- Display: **Anton** (replaces Arial Narrow/Impact stack) — load via
  `next/font/google`, update `fontFamily.display` in tailwind.config.ts.
  Update `designs/00_brand/typography.md` to record the decision.
- Hero wordmark only: **Permanent Marker** (brush script). Load subsetted;
  used in exactly one place.
- Body: existing system stack, unchanged.

Spacing/radius: existing scale (sections 80px, gutters 24px, max-width
1200px, radius 12px cards / pill buttons) — unchanged.

## Assets
- `assets/hero-crowd.png` (1536×864, AI-generated placeholder matching the
  mockup's art direction) — replace with licensed photography before launch;
  compress to WebP/AVIF ≤180KB either way.
- Product images: existing `public/products/*.svg` — unchanged.
- Icons: inline SVGs (spec above) — no icon library, per §14.

## Files
- `Portugoool Homepage.dc.html` — the full design reference (open in a browser)
- `assets/hero-crowd.png` — hero image
- Source mockup: repo `designs/ChatGPT Image Jul 7, 2026, 10_37_21 PM.png` (Iteration 01)

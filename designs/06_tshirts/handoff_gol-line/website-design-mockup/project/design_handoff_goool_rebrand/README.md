# Handoff: GOOOL Rebrand + Drop 01 (PORTUGOOOL) + Drop 02 (ENGOOOLAND)

## Overview
Since the original homepage handoff (`design_handoff_homepage_iteration01/`),
the brand pivoted: **GOOOL is now the master brand** (domain **goool.shop**),
and nation collections live under it as limited drops:
- **Drop 01 · The Portugal Collection (PORTUGOOOL)** — 4 jerseys + 4 tees
- **Drop 02 · The England Collection (ENGOOOLAND)** — 3 jerseys + 4 tees

This package tells a developer exactly how to rebrand the existing Next.js
site (the `Portugoool` repo) to goool.shop and add both drops to the store.

## About the Design Files
The bundled `.dc.html` files are **design references built in HTML** — open
them in a browser to see every design. Recreate them in the codebase's
Next.js 14 + Tailwind environment; do not ship the HTML.

## Fidelity
**High-fidelity.** Colors, geometry, and copy are final and locked.
Product print files (already sent to Printful) live in `printful/` and
`printful-drop02/` in the project — product photos will come from Printful
mockups once samples are approved; until then the spec-sheet SVGs are the
product art reference.

## 1 · Brand system (replaces PORTUGOOOL-as-brand)
Reference: `GOOOL Brand.dc.html`

### The Echo mark (hero logo / favicon) — exact construction
- Solid dot radius 15 · three arcs = circles r38 / r68 / r98 centered ON
  the dot · stroke width 13 · clipped to show only the right half
- Master colors: dot ink #0A0A0A, inner two arcs red #C1121F, outer arc
  gold #C9A227
- Recolor per background (see recolor strip in `Apparel Spec Sheet.dc.html`);
  proportions/arc count/direction never change
- Use as favicon (32px), header mark, social avatar

### GOOOL wordmark
- Anton, uppercase; the three O's are the hero — red #C1121F, equal size
- HTML form: `G<span style="color:#C1121F">OOO</span>L`
- Domain lockup: Echo mark + `goool.shop` (".shop" in red)

### Brand architecture
- GOOOL = house. Gold #C9A227 is reserved for the house brand only.
- Collections recolor the Echo + wordmark to the nation's palette:
  - PORTUGOOOL: red/green/gold (green #0B3D2E, green-light #125A43)
  - ENGOOOLAND: red/white/navy ONLY (England navy **#0A1F3C**; grey
    #9CA3AF allowed only for the goool.shop hem hit on white garments)
- Collection wordmarks: brush script (Permanent Marker) on garment fronts
  with the OOO accented; condensed (Anton) uppercase elsewhere, e.g.
  `PORTUG<span red>OOO</span>L`, `ENG<span accent>OOO</span>LAND`

### Site rebrand tasks
1. Wordmark in `Header.tsx` / `Footer.tsx` → GOOOL (+ Echo mark SVG);
   PORTUGOOOL becomes the Collection 01 page title, not the site brand.
2. `NEXT_PUBLIC_SITE_URL` / metadata / OG → goool.shop; title template
   `%s · GOOOL`.
3. Add favicon from the Echo mark geometry above (inline SVG → .ico/png).
4. Tagline stays "The Sound of Victory." (PT: "O som da vitória.")

## 2 · Catalog additions
Update `src/lib/products.ts` (+ Supabase seed) with two collections.
Suggested `collection` field: `"portugal-01"` / `"england-02"`.

### Drop 01 · PORTUGOOOL (reference: `Apparel Spec Sheet.dc.html`)
Jerseys (AOP, $70–80): Casa Red $75 · Marfim White $75 · Noite Black $80 ·
Emerald $70. All: small Echo badge left chest (~4cm), angled brush
"Portugoool" wordmark on the diagonal paint-stroke sash, name/number
personalization +$15 (Anton).
Tees (DTG, $32–38): T1 Echo Hero $34 · T2 Echo + Word $36 · T3 Radiating
("ouves?" front, "O SOM DA VITÓRIA" back) $36 · T5 Spray Stack $38.
All tees: goool.shop at back bottom hem.
Taglines/copy bank: `printful/TAGLINES.md`.

### Drop 02 · ENGOOOLAND (reference: `ENGOOOLAND Drop 02 Spec Sheet.dc.html`)
Jerseys (AOP, $70–80): E1 Home White $75 · E2 Away Red $75 · E3 Navy $80.
All: Echo badge left chest, brush "Engoooland" riding the sash at −24°
with the top stripe as its underline, red/white/navy only.
Tees (DTG, $32–38): ET1 Echo Hero (white) · ET2 From London to the World
(navy) · ET3/ET4 Made for the Moment (red + navy colorways — list as one
product, two colors). All tees: full-length ENGOOOLAND spine down the back,
shoulder tagline, goool.shop hem hit (white, or grey #9CA3AF on white tees).

### Legal (bake into product copy review)
- Drop 01: no FPF crest/quinas, no FIFA/World Cup marks, no player names;
  "Verão '26" is the only tournament-adjacent phrase.
- Drop 02: no lions, no FA crest shapes, no St George's cross as
  flag/badge, no "It's Coming Home", no Wembley; "England" appears only
  inside ENGOOOLAND.
- Independence disclaimer stays in the footer, unchanged.

## 3 · Storefront structure
- `/shop` gains collection sections: "The Portugal Collection · Drop 01"
  and "The England Collection · Drop 02" (anchored ids per website-bible §5).
- Homepage hero: keep Iteration 01 layout from the previous handoff, brand
  swapped to GOOOL; drop badge points at the current collection.
- Product images: pull Printful-generated mockups after samples approve;
  file mapping in `printful/README.md` and `printful-drop02/README.md`.

## Design tokens (delta from previous handoff)
Add to `tailwind.config.ts`: `navy: "#0A1F3C"` (England), keep existing
palette. Fonts: Anton (display) + Permanent Marker (brush accents only) via
`next/font/google`.

## Files in this package (complete spec set)
- `GOOOL Brand.dc.html` — master brand sheet (wordmark, Echo, lockups, palette)
- `Logo Concept.dc.html` — original Echo concept sheet (construction record)
- `Apparel Spec Sheet.dc.html` — Drop 01 garment designs, front/back + Echo recolor guide
- `PORTUGOOOL Drop 01 — Final Drafts (standalone).html` — single-file Drop 01 record incl. tagline bank (opens offline)
- `ENGOOOLAND Drop 02 Spec Sheet.dc.html` — Drop 02 garment designs + legal checklist
- `Portugoool Homepage.dc.html` (+ `support.js`, `image-slot.js`, `hero-crowd.png`, `products/`) — homepage design reference from the first handoff, still the layout source
- `printful/` — Drop 01 production print files + README (file table, placements, personalization spec) + `TAGLINES.md`
- `printful-drop02/` — Drop 02 production print files + README (incl. England legal checklist)
- `mockups/` — AI photo mockups from early Drop II concepting (reference only; final product photos come from Printful)

Note: the `.dc.html` files need `support.js` alongside them to render; the
standalone Drop 01 file is fully self-contained.

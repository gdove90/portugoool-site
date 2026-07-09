# Handoff: GOL House Line — Five Casual Tees

## Overview
GOL is the house-brand line for goool.shop (no nation collections — just
the mark). This package adds **five GOL tees** to the storefront catalog.
It builds on the previous handoff (`design_handoff_goool_rebrand/README.md`)
— brand architecture, site rebrand, and Drops 01/02 are covered there.

## About the design files
`GOL Line Tees.dc.html` is the design reference — open it in a browser
(needs `support.js` + `gol-assets/` alongside, both included). Recreate the
product cards in the existing Next.js 14 + Tailwind storefront; do not ship
the HTML.

## The GOL mark (locked)
- Extended, slightly italic geometric sans "GOL" with a diagonal slash
  through the O. Letterforms are the approved production vector —
  `gol-assets/gol-wordmark-*.svg` (1890×660 viewBox) — **never redrawn**.
- Solo slash minimal mark: `gol-assets/gol-slash-*.svg` (600×380).
- GOL-line gold is **#B18844** (bronze-gold) — NOT the house #C9A227.
- Lockup line "THE LANGUAGE OF THE GAME" (Anton, tracked out) appears
  only on G3/G4/G5, always the smallest element.

## The five tees (suggested $32–38, casual line)
| ID | Name | Body | Front | Back neck line |
|---|---|---|---|---|
| G1 | Clean Sheet | White | Ink GOL ~28cm, high chest, no lockup | MADE FOR THE MOMENT. |
| G2 | Gold Standard | Black | Gold GOL ~28cm, high chest + tonal grey slash sweep low (≤10% contrast) | MADE FOR THE MOMENT. |
| G3 | Concrete | Sport grey heather | Ink slash shoulder→hip (~55°), small ink GOL 15cm upper chest, white lockup low | MADE FOR THE MOMENT. |
| G4 | Concrete White | White | Same comp: ink slash, ink GOL, gold lockup | THE SOUND OF VICTORY. |
| G5 | Concrete Black | Black | Same comp: paper slash, gold GOL, gold lockup | THE SOUND OF VICTORY. |

All backs also carry tiny `goool.shop` at the hem (grey #9CA3AF on white
bodies, white on dark bodies).

## Product data
- One product per composition is fine, or group G3/G4/G5 as one
  "Concrete Tee" with three colorways — owner's call.
- Fulfillment: Printful DTG/DTF. Production PNGs (4500×5100 transparent)
  live in `printful-gol/` with a README covering placements, print widths,
  exact hex values, and the legal checklist.

## Colors used (exact)
GOL gold #B18844 · Ink #0A0A0A · Paper #FFFFFF · Deep red #C1121F (rare
accent only) · Tonal grey #1D1D1D (G2 slash) · Hem grey #9CA3AF.

## Legal (confirmed on every design)
No federation/FIFA/club marks · no flags or crests · no player references
· nothing derivative of Nike/adidas/Puma · 100% original geometry · "GOL"
appears as our mark only.

## Files in this package
- `GOL Line Tees.dc.html` + `support.js` — spec sheet (front/back, all five)
- `gol-assets/` — production vectors: wordmark (gold-original/ink/paper),
  slash (gold-original/ink/paper/greydark), brand sheet reference PNG
- `printful-gol/` — 10 print-ready PNGs + README

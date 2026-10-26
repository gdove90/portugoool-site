# TEMPO Collection placement proofs — implemented 2026-10-26

Owner instruction 2026-10-26: implement the Claude Design file
`TEMPO Collection.dc.html` from project
`https://claude.ai/design/p/b9b09d57-f93e-4f13-a93b-4a7ecdae2f93`.

## What the design is

A placement-proof sheet for the TEMPO women's collection: 7 products,
21 colourways, the V1.3 GA monogram / horizontal lockup / wordmark drawn
at production size on flat garment silhouettes (1 unit = 1 in, smallest
supplier size), plus the spec per product, an asset register, a supplier
check and open items. It is an internal document, not a storefront page,
and its own handoff (`handoff/CLAUDE-CODE-HANDOFF.md`) says: "Do not
implement until images, prices and supplier IDs are filled in." All three
are still null in `handoff/products.json`.

## Owner correction, same day

The owner does not want the Claude Design sheet published. The
`/references/tempo` page, its component, data module and `public/tempo`
artwork were reverted from main (commit after 06642ba). The artwork PNGs
now live here in `artwork/` for the supplier builds. The instruction is to
build the garments themselves on Apliiq and Tapstitch and list them on the
site; Printful (leggings) was not named.

## What was built first (reverted)

- **Owner-only page** `/references/tempo` (same sign-in gate as `/admin`,
  `robots: noindex`, off the menus and sitemap). `?grid=0` hides the 1 in
  grid, `?dims=0` hides the red dimension lines (the design's two props).
- `src/lib/tempo-proofs.ts`: the design's data (`P`, `INK`, `MARK`) and
  its `renderVals` logic ported line for line, typed.
- `src/components/TempoProofs.tsx`: the sheet, in the design's own inline
  styles (Anton display via `font-display`, #E51226 accent).
- `public/tempo/artwork/`: the 13 V1.3 production PNGs the sheet places
  (GA + lockup in five inks, wordmark in three) and the header lockup,
  copied byte for byte from the design project's
  `uploads/GOAL_ATHLETICS_V1.3_APPROVED_PALETTES_NO_ORANGE/01_PRODUCTION_ARTWORK`.
- No catalog rows, prices, fulfilment entries or public pages: the TEMPO
  products are not on the site and `/women` still shows Coming Soon.

## Records in this folder

- `design-source/TEMPO Collection.dc.html` and `support.js`: the design
  file as read on 2026-10-26.
- `handoff/`: products.json, variants.csv, asset-manifest.csv,
  supplier-notes.md, CLAUDE-CODE-HANDOFF.md, README.md from
  `tempo/handoff/` in the design project.

## Still open (from the design's own list)

1. Supplier blank photos for the 21 colourways (63 website images).
2. Apliiq pages for P01, P04, P05 and Printful #3012 unverified.
3. Supplier minimum artwork sizes per placement.
4. Printful #3012 panel templates for the leggings print files.
5. Training Tee fit wording (regular vs slim).
6. Prices, supplier ids, product copy, then the catalog rows.

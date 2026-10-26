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

## Built on the suppliers, 2026-10-26 (owner instruction)

Artwork: the trimmed V1.3 PNGs in `print/` (GA 1164 x 1048 px, lockup
2973 x 793 px, wordmark 2666 x 814 px, all 300 ppi originals). One colour
per saved design, transfer print, no recolouring.

### Apliiq (customizer v5, 20 px per inch; print boxes read off each blank)

| Product | Blank | Colour | Design | SKUs S / M / L / XL / XXL | Placement entered | Dropship |
|---|---|---|---|---|---|---|
| TEMPO Core Training Tee | Sport-Tek LST350 | Black (white/red GA) | 6240566 | APQ-6240566 S6A1 / S7A1 / S8A1 / S1A1 / S2A1 | GA 3.00 x 2.70 in, wearer's left chest, top at the print box top (about 4.25 in below the collar seam on Apliiq's mockup), centre 4 in from CF | $14.59, XXL +$2 |
| | | White (black/red GA) | 6240570 | APQ-6240570 … | same | |
| | | Iron Grey (solid black GA) | 6240571 | APQ-6240571 … | same | |
| TEMPO Training Pants (rebuilt, see below) | Sport-Tek LPST800 | Deep Red/White (solid white) | 6240609 | APQ-6240609 S6A1 / S7A1 / S8A1 / S1A1 / S2A1 | GA 2.00 x 1.80 in in the wearer's left hip box (4 x 4 in), top 8.50 in below the waistband seam; wordmark 4.00 x 1.22 in in the back right hip box (4 x 4 in, top about 3 in below the waist) | $41.98, XXL +$2 |
| | | True Navy/White (light cream) | 6240610 | APQ-6240610 … | same | |
| | | Black/White (white/red) | 6240611 | APQ-6240611 … | same. The brief's Black/Black is a separate Apliiq listing, not built | |
| TEMPO Training Shorts | Sport-Tek LST485 | Black (white/red GA) | 6240613 | APQ-6240613 S6A1 / S7A1 / S8A1 / S1A1 / S2A1 | GA 2.00 x 1.80 in filling the wearer's left leg box (2 x 2 in, 40 px per inch; the only box on the blank) | $23.99, XXL +$2 |
| | | Iron Grey (solid black) | 6240615 | APQ-6240615 … | same | |
| | | True Navy (light cream) | 6240616 | APQ-6240616 … | same | |
| TEMPO Warmup Hoodie | Bella+Canvas 7519 | Black (white/red) | 6240580 | APQ-6240580 … | GA 3.25 x 2.93 in centred, top 3.00 in below the hood seam | $37.28, XXL +$2 |
| | | Vintage White (black/red) | 6240581 | APQ-6240581 … | same | |
| | | Navy (light cream) | 6240582 | APQ-6240582 … | same | |

Apliiq also lists XS (S5A1), 3XL (S21A1) and, on the tee, 4XL (S61A1);
the site sells S to XXL. Hi-res production files: linked on the pants
front GA of 6240577; elsewhere the uploaded PNGs are themselves 300 ppi or
better at the printed size (388 ppi GA, 666 ppi wordmark) and Apliiq reads
"ideal quality". Private label: none selected on these nine designs.

**Design update, later on 2026-10-26 (pasted by the owner):** the front
GA on the Training Pants comes down from 3.00 x 2.70 in to 2.00 x 1.80 in
(Apliiq's smallest GA, the sleeve size the owner accepted); it stays
8.50 in below the waistband seam on the wearer's left upper thigh; the
back wordmark is unchanged. So the pants were rebuilt as 6240609 / 6240610
/ 6240611 (above) and 6240577 / 6240578 / 6240579 were renamed "delete" on
Apliiq (never map them again). The same 2.00 in GA fits the LST485 leg
box, so the **Training Shorts** were built the same evening (above).
Apliiq has not generated the front renders (template 7149) of the rebuilt
pants; the back renders (7150) and the shorts renders (5608) exist and are
in `apliiq-renders/` (`pants2-*`, `shorts-*`). The Leggings (Printful) are
still not built.

### Tapstitch (designer, inches typed; drag placement)

| Product | Blank | Colour | Design | Placement | Unit cost |
|---|---|---|---|---|---|
| TEMPO Quarter Zip | WT0092-P001-V2 | Black (white/red GA) | 1564321596708188160 | GA 3.00 x 2.70 in, wearer's left chest, centre 4 in right of the zip, top 3 in below the collar | $11.98 ($8.99 + $2.99 print) |
| | | White (black/red) | 1564322937081917440 | same | |
| | | Light Purple (solid black) | 1564323621013516288 | same | |
| TEMPO Training Tee | WT0216-P001-V2 | White (black/red lockup) | 1564324134866087936 | lockup 7.00 x 1.87 in centred, top 3 in below the collar | $9.98 ($6.99 + $2.99) |
| | | Red (solid white) | 1564325002000687104 | same | |
| | | Purple (solid black) | 1564325488367988736 | same | |

Tapstitch has no public order API and no connector for a custom site
(their integrations are Shopify, Etsy, Wix and their own hosted store), so
these lines are placed by hand: `fulfillment-submit.ts` mails the owner the
Tapstitch lines (sku `TAP-<design>-<size>`) and never sends them to Apliiq.
Tapstitch ships internationally, 10 to 17 days; the product pages say so.

### Site

Rows …0017 Core Training Tee $38, …0018 Quarter Zip $44, …0019 Training
Pants $72, …0020 Warmup Hoodie $68, …0021 Training Tee $34, …0022 Training
Shorts $48 (25% model floors $32 / $32 / $72 / $65 / $29 / $46; house
rounding; none owner-set), women's audience,
`/women` opened (TEMPO_COLLECTION_COMING_SOON false), categories `pants`
and `pullover`, supplier `tapstitch`, migration 0045 applied. Images:
`apliiq-renders/` and `tapstitch-mockups/` on the studio backdrop in
`site-images/`, copied to `public/products/tempo-*`. Apliiq has not
rendered the fronts of the rebuilt pants, so every pants colour leads with
its back render (the first Deep Red front, which showed the 3 in GA, was
taken down). Migration 0046 (shorts row) applied the same day. Size charts: LST350 and LPST800
from the maker's spec sheets, 7519 from the Blankstyle listing; Tapstitch
blanks carry a note until their size guides are read.

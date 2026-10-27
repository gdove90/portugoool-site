# PST871 Circuit Jogger · vertical lockup proof — 2026-10-27

Owner instruction 2026-10-27: implement `PST871 Lockup Jogger Proof.dc.html`
from Claude Design project b9b09d57. The proof is a placement spec for a
men's jogger: Sport-Tek PST871 Circuit Jogger via Apliiq, Deep Black and
Graphite, S to XXL, one DTF print, no back print, GOAL private label.

The mark: V1.3 GA + GOAL ATHLETICS lockup turned vertical, **1.60 x 6.00 in**,
wearer's left leg, outer front thigh, top of art 10.50 in below the
waistband seam, outer edge 1.00 in in from the side seam, reading bottom to
top. Measured smallest gap at 6.00 in: 2.20 mm (the 2 mm rule holds; the
proof says 6.00 in is the minimum, never scale down).

Print files as received (480 x 1800 px = 1.60 x 6.00 in at 300 ppi, RGBA):
`print/Lockup-Vertical_WhiteRed_1.60x6.00in.png` (Deep Black) and
`print/Lockup-Vertical_White_1.60x6.00in.png` (Graphite). Design source
copy in `design-source/`, notes in `PRODUCTION-NOTES-AS-RECEIVED.md`.

## Apliiq check (the proof's own open item) — FAILS

Read in the v5 customizer on 2026-10-27
(`/customize/v5/mens/pants/Circuit-Jogger/design`, base product 1414,
colours Graphite #515151 id 544 and Deep Black #2b2b2b id 2402):

| View | Print boxes | Size (20 px/in) | Where |
|---|---|---|---|
| Front 6860 | box 1 at (370,280) 80 x 80 px; box 2 at (136,280) 80 x 80 px | **4 x 4 in each** | the two hip/pocket areas, roughly 7 to 11 in below the waistband |
| Back 6861 | box 1 at (166,168) 80 x 80 px | 4 x 4 in | right hip |

There is **no thigh or leg zone** on this blank at Apliiq. A 6.00 in tall
art cannot go in a 4 in box, and nothing can start 10.50 in below the
waistband. The proof as drawn cannot be built on Apliiq. (The women's
LPST800 had long leg boxes; the PST871 does not.)

What fits the 4 x 4 in hip box under the 2 mm rule:

- **GA monogram 2.00 x 1.80 in** (gap 2.35 mm), the same crest the Core
  Quarter Zip and the TEMPO pants carry; white/red on Deep Black, white on
  Graphite.
- **GOAL ATHLETICS wordmark 4.00 x 1.22 in** (gap 2.35 mm), filling the box
  width.
- The lockup does not: horizontal it is 4.00 x 1.07 in (gap about 1.47 mm);
  vertical at 4.00 in tall it is the same art, same gaps. Both fail the
  2 mm rule, the way the quarter zip lockup did.

Cost: Apliiq start-selling price $44.99, **$35.99 with VIP, one imprint
included** (customizer "starting at" $37.50). 25% model price
ceil((35.99 + 2 + 3 + 1 + 0.30) / 0.671) = **$64**.

Nothing was built or saved on Apliiq and nothing was added to the site.
Waiting on the owner: which mark goes in the hip box, or a different
supplier with a leg zone.

## Built 2026-10-27 (owner decision: GA monogram, 3.00 in)

Owner brief 2026-10-27: the men's GA minimum is 3.00 in (2.00 in is only
approved for the hoodie sleeve and TEMPO), so the hip-box mark is the **GA
monogram 3.00 x 2.70 in** in the **wearer's left** front hip box (right
side as viewed). Print files `print/GA_WhiteRed_3.00x2.70in.png` (Deep
Black) and `print/GA_White_3.00x2.70in.png` (Graphite), 900 x 811 px at
300 ppi, cut from the ST720 3.00 in GA exports.

| Colour | Apliiq design | Mark | Position (customizer px, 20 px/in) | Label |
|---|---|---|---|---|
| Deep Black | **6242924** "GOAL Athletics Core Jogger - Deep Black" | GA white/red 3.00 x 2.70 in, hi-res linked, ideal quality | view 6860 box 1, left 380 top 292 (centred in the 80 x 80 box at 370,280) | private label sb-6-161561, inside waist |
| Graphite | **6242929** "GOAL Athletics Core Jogger - Graphite" | GA solid white 3.00 x 2.70 in, hi-res linked, ideal quality | identical | identical |

Transfer print, enable recoloring off, stroke artwork off, back blank.
"Inside waist" is the only private-label placement Apliiq offers on this
blank (the back waistband). Pre-save proof: `apliiq/deep-black-ga-3.00in-pre-save-2026-10-27.jpg`.
Renders `renders/<id>_6860.jpg` (front); Apliiq had no back render yet.

Site: row `80000000-0000-4000-8000-000000000024` "GOAL Athletics Core
Jogger", slug `goal-athletics-core-jogger`, men, category pants, **$64**
(25% model on the $35.99 VIP quote), sizes S to XXL, size-guide tab
`joggers` (note only), images = Apliiq front renders on the studio
backdrop. Migration 0050. No physical sample exists.

## Owner product shots, 2026-10-27

The owner's own front and back shots per colour (1122 x 1402;
`owner-photos/<colour>-product-{front,back}-as-received.webp`), framed to
2:3 (1122 x 1683, own backdrop extended) replaced the Apliiq renders at
`public/products/goal-core-jogger-<colour>-catalog-product-{front,back}-owner-20261027.webp`.
The render-based fronts were removed from public/; renders stay in `renders/`.

## Descriptions, 2026-10-27

Owner rule: never sound like a print-on-demand company; descriptions talk
about the benefits of wearing the piece (movement, comfort, what it is
good for), drawn from the maker's specs and reworded in brand language.
Both Apliiq designs had the save dialog's default supplier copy in their
description field; replaced on 6242924 and 6242929 with the brand copy
(also used, colour-neutral, on the site row). No supplier names, no
print-on-demand language.

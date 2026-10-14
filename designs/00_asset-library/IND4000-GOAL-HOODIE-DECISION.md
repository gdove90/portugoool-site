# IND4000 GOAL Hoodie: owner decisions (14 Oct 2026)

## Update (14 Oct 2026, later): handoff v2 from Claude Design

This supersedes the style list and the back print below.

- **Big Stack (vertical GA / GOAL / ATHLETICS) is dropped.** Its four saved Apliiq designs (6206428, 6206432, 6206441, 6206442) stay on Apliiq, untouched, and do not go on the site. The owner said: "remove the vertical lockup from the site and replace with the horizontal lockup".
- **Lockup replaces it:** the horizontal GA + GOAL ATHLETICS lockup 10.00 × 2.67 in, centred on the chest, top 3.00 in below the hood seam, no back. Four colours, four new Apliiq designs.
- **No back print on any style.** Apliiq only allows back art below the hood, and the owner doesn't want it there. The back transfer is removed from the eight saved Heritage and Minimal designs, which are then saved again.
- **Lockup artwork:** the three lockup files are exported from the owner's V1.3 vector master (combined lockup SVG, paths unmodified), so the enlarged 1125 px PNG named in the handoff is not used.
  - Inks: White + Red, Cream, and Black #080808 + Red.
  - Exported at 10.00 in, 300 dpi.

Source: `designs/27_ind4000-goal-hoodie-2026-10-14/CLAUDE-IND4000-GOAL-HOODIE-HANDOFF.md`, from the owner's Claude Design project (proof: `IND4000 GOAL Hoodie Proof.dc.html`).

- **Brand:** GOAL Athletics. The legal entity and the domain stay the same until the owner confirms.
- **Blank and method:** Independent Trading Co IND4000 heavyweight pullover hoodie, DTF transfer only, sizes S to XXL.
- **Colours:** Black, Classic Navy, Bone, Grey Heather. Each colour uses Apliiq's exact swatch name.
- **Three styles, 12 Apliiq designs:**
  - **Heritage:** GA 3.50 in centred on the chest, GA 3.00 in on the left sleeve (3.00 in above the cuff seam), GOAL ATHLETICS wordmark 8.00 in on the upper back.
  - **Minimal:** GA 3.50 in on the left chest, plus the same upper-back wordmark.
  - **Big Stack:** GA / GOAL / ATHLETICS stack 9.00 in across the chest, no back print.
- **Back print:** sits on the upper back, 2.00 in below the back hood seam. The owner said a print "in the middle it's weird".
- **Existing hoodies:** the GOOOL Core Hoodie products and their Apliiq designs stay as they are.
- **Label:** the GOOOL private label is not added. The stacked AutoCap tag needs an owner-approved Apliiq preview first, so the designs save with the blank's standard label.
- **Price:** not set. Three model floors (PRICING-25-PERCENT.md formula) are reported to the owner. The site stays unpublished for these products until the owner sets prices.

## Artwork provenance

- All 12 print PNGs are rendered from the owner's V1.3 vector masters (`vector/GA-Stack-*.svg`) at 300 dpi, final size.
- Checksums matched `FILES.json` on receipt.
- A 300 dpi tag was then added with the pixels unchanged, because Apliiq reads untagged files as "nan dpi". The new checksums are recorded in `FILES.json`.
- `src/` holds the owner's apparel PNGs (Desktop `vertical v1.3 logo/GOAL%20Stacked%20Colorways/02 Apparel/`), kept for reference only.

## Apliiq designs (handoff v2, 14 Oct 2026)

| Colour | Heritage | Minimal | Lockup | Big Stack (dropped) |
|---|---|---|---|---|
| Black | 6206334 | 6206401 | 6206733 | 6206428 |
| Navy (Apliiq name "navy") | 6206365 | 6206408 | 6206737 | 6206432 |
| Bone | 6206384 | 6206414 | 6206741 | 6206441 |
| Grey Heather | 6206395 | 6206424 | 6206746 | 6206442 |

- **Back prints:** removed from all eight Heritage and Minimal designs. The design ids are unchanged, and Apliiq logs each one as "removing transfer print".
  - Apliiq still serves the old back renders for those eight, so the site uses each colour's plain Lockup back render.
- **Big Stack:** its four designs are left on Apliiq, never mapped and not on the site.
- **Lockup:** four new designs, transfer print, using the vector-exported lockup.
- **Every zone:** hi-res file linked, and the handoff's production note pasted verbatim.
- **Supplier constraint:** Apliiq keeps art inside its print areas, so the canvas positions differ from the handoff figures. The notes carry the handoff figures.

  | Zone | Handoff figure | Nearest position inside Apliiq's area |
  |---|---|---|
  | Front | 3.00 in below the hood seam | Top of the front area, about 3.6 in below the seam |
  | Sleeve | 3.00 in above the cuff | Bottom of the sleeve area, 3.75 in above the cuff seam |

- **Quotes and floors:**
  - Heritage: $35.54 to $37.54, floor $63.
  - Minimal: $29.55 to $31.55, floor $54.
  - Lockup: $29.55 to $31.55, floor $54.

## Website (branch `claude/ind4000-goal-hoodie-v2`, on top of `claude/minimal-tee-centred`; not merged)

- Products `80000000-0000-4000-8000-000000000013` (Heritage), `…0014` (Minimal) and `…0015` (Lockup) are in `src/lib/products.ts`.
  - All three are hidden (`isActive: false`), not for sale, with `priceCents: 0`.
  - Variants are mapped in `src/lib/fulfillment.ts`.
  - Images are Apliiq's renders, captioned as concept renders.
- Migration `0040_ind4000_goal_hoodies.sql` is written but not applied.

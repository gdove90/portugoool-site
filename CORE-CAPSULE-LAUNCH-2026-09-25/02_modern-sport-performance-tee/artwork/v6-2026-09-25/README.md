# GOOOL Matchday Tee — back print v6 and the White colourway (2026-09-25)

Package received from the owner's production artist on 2026-09-25
(`package-as-received.zip`, handoff text in `HANDOFF-AS-RECEIVED.md`,
numbers in `MEASUREMENTS.json`). Every letter was measured at real print
size against Apliiq's 2 mm DTF minimum, with a 2.5 mm house target.

| Placement | Size (W × H) | Position | Result |
|---|---|---|---|
| Front, GA-01-F v3 | 11.00 × 3.72 in | top 3.00 in below front collar seam | **Passes as saved.** Thinnest stroke 3.03 mm, smallest gap 2.65 mm. No change. |
| Back, GA-01-B v5 (3.25 in) | 3.25 × 1.235 in | | **Failed.** ATHLETICS gaps 1.45 mm, GOOOL gaps 1.83 mm; also under the 4 in lockup minimum. Superseded, never uploaded. |
| Back, GA-01-B **v6** | **5.00 × 1.812 in** | top 2.00 in below back collar seam | Thinnest stroke 3.03 mm, smallest gap 2.58 mm. Open A kept. Letter spacing widened; ATHLETICS weight matched to the front. |

**White colourway:** the same two files recoloured, Ink #0A0A0A in place of
white, red rule #C52D32 unchanged. Same ST720 blank in white.

Name: the handoff proposes "GOOOL Core Matchday Tee". The owner locked
**GOOOL Matchday Tee** earlier the same day, so the site keeps that.

## Files

- `exports/front/GA-01-F_v3_WHITE-PRINT_3300px_300ppi.png` — Black and True Royal front (unchanged art)
- `exports/front/GA-01-F_v3_INK-PRINT_3300px_300ppi.png` — White front
- `exports/back/GA-01-B_v6_5IN_WHITE-PRINT_3000px_600ppi.png` — Black and True Royal back, **5.00 in**
- `exports/back/GA-01-B_v6_5IN_INK-PRINT_3000px_600ppi.png` — White back, **5.00 in**
- `site-images/` — concept renders now served from `public/products/`: V6 backs for Black, True Royal and White, and the White front (V3).

## Applied to the website (2026-09-25)

- Back images on the product page are the V6 renders for Black and True Royal.
- White is on the page as a third colourway, marked **coming soon** on the
  variant, so the swatch and images show but the buy buttons are replaced
  until its Apliiq design and SKUs exist (`fulfillment.ts` has no White
  entry on purpose; checkout would refuse it).
- Description now says black, true royal or white.
- Image cache revision bumped for the V6 backs.

## Apliiq (supplier) — done 2026-09-25

Apliiq cannot change a placement's size on a saved design, so all three
colourways were rebuilt as NEW saved designs in the v5 customizer (owner's
instruction: reupload and mark the old ones "delete"). Every placement was
set numerically through the customizer's own resize handler, then verified
on each design page.

| Colour | Saved design | Front | Back | SKUs (S, M, L, XL, XXL) |
|---|---|---|---|---|
| Black | **6136475** | `GA-01-F_v3_WHITE-PRINT_3300px_300ppi.png`, 11 in x 3.72 in, ideal quality | `GA-01-B_v6_5IN_WHITE-PRINT_3000px_600ppi.png`, 5 in x 1.81 in, ideal quality | `APQ-6136475S6A1 S7A1 S8A1 S1A1 S2A1` |
| True Royal | **6136494** | same file, same size | same file, same size | `APQ-6136494S6A1 S7A1 S8A1 S1A1 S2A1` |
| White | **6136511** | `GA-01-F_v3_INK-PRINT_3300px_300ppi.png`, 11 in x 3.72 in | `GA-01-B_v6_5IN_INK-PRINT_3000px_600ppi.png`, 5 in x 1.81 in | `APQ-6136511S6A1 S7A1 S8A1 S1A1 S2A1` |

Common to all three: Sport-Tek ST720, one colour offered per design,
transfer print (DTF, Apliiq service id 17) on both placements, the
production file linked as the hi-res version of each placement (Apliiq
reads "ideal quality"), no branding service (matches the old 6112037),
7 sizes offered XS–XXXL (the site sells S–XXL; XS is `S5A1`, XXXL `S21A1`).
Apliiq displays the back height rounded to 1.81 in; the stored size is
100 x 36.24 px at 20 px/in = 5.00 x 1.812 in.

Placement offsets, measured on Apliiq's base mockups (590 x 900 px,
20 px/in, front base 4902, back base 4903): front collar seam at y 252,
front art top at y 312 = **3.00 in below the front seam**, centred;
back collar seam at y 203, back art top at y 243 = **2.00 in below the
back seam**, centred. The front print box starts 2.4 in below the front
seam, the back box 0.15 in below the back seam, so both targets sit inside
Apliiq's allowed area.

The earlier designs **6112037** (Black) and **6113361** (True Royal),
which carry the failed 3.25 in back, were renamed **"delete"** on Apliiq
(not deleted; Apliiq offers no delete). `fulfillment.ts` no longer maps
them. Any open order placed against them before this change still prints
from them; check Apliiq orders before deleting for good.

Activity-log lines: 6136475 "9/25/2026, 10:34:48 pm - product name
updated", 6136494 "10:43:31 pm", 6136511 "10:48:05 pm" (the customizer
logs the save as a name update).

Still unverified: no physical sample of any colourway exists. Order one
before treating the v6 back as production-approved.

## Owner note

The back is visibly bigger than before, 5 in wide instead of 3.25 in.
That is the smallest size at which every letter clears 2.5 mm. The site
renders show it at the new size.

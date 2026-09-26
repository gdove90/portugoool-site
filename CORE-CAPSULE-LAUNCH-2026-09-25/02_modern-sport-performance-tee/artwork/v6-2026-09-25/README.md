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

## Apliiq (supplier) — still to do

Follow section 3 of `HANDOFF-AS-RECEIVED.md`:

1. 6112037 (Black) and 6113361 (True Royal): replace the back art with the
   v6 WHITE-PRINT file at exactly 5.00 × 1.812 in, top 2.00 in below the
   back collar seam. Never let Apliiq auto-fit. Front stays as saved.
2. Create the White design from the ink files, same sizes and positions,
   read its id and five SKUs from the account, then add a White entry to
   `fulfillment.ts` and remove `comingSoon` from the variant.
3. Proof-check all three (A opening, E arms, S openings, cut tips, solid rule).
4. No physical sample exists for any of them. Order one before selling on
   the new back.

## Owner note

The back is visibly bigger than before, 5 in wide instead of 3.25 in.
That is the smallest size at which every letter clears 2.5 mm. The site
renders show it at the new size.

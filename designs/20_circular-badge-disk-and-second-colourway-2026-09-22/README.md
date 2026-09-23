# Circular Badge Tee: disk mark + a second colourway

**Exploration. Nothing here is approved, ordered or on the site.**
Requested by the owner on 2026-09-22: move the Athletics mark from
letters-alone to a filled disk, and add a second colourway.

## What changed in the mark

Today the mark is the letters alone forming a circle. The proposal
knocks those same letterforms out of a solid disk. The letterform
geometry is untouched in every file here; only the two inks differ.

## This supersedes a filed rule

`16_goool_athletics/circular_logo/LAUNCH_SELECTION.md` states the mark is
"the letters alone forming a circle ... **no ring, disk, shield or extra
emblem**." That is the owner's to change, and this is the record of the
change being proposed. It is not yet a decision.

## Finding: the four existing concepts cannot carry a dark colourway

`circular_logo/color_badge_concepts/` holds four pairings, and all four
are a DARK disk with LIGHT letters. On a dark garment the disk merges
into the shirt and only the letters read - which is the old mark again,
at extra print cost. A dark second colourway therefore needs a variant
that did not exist. `badges/` holds three, built by exchanging the two
inks on the ink/cream master:

| File | Disk | Letters |
|---|---|---|
| `badge-cream-ink-1080.png` | `#E9E4DA` | `#0A0A0A` |
| `badge-cream-forest-1080.png` | `#E9E4DA` | `#0A371E` |
| `badge-gold-ink-1080.png` | `#C9A227` | `#0A0A0A` |

## Studies

- `studies/compare-ivory-chest.png` - current mark against navy, forest
  and ink disks, composited on the real Comfort Colors C1717 Ivory
  render at the approved 3 in print width and position.
- `studies/study-dark-colourways.png` - the three light-disk variants on
  Black, Pepper and True Navy.

Recommendation: **Black + cream/ink**. Highest contrast of the set, and
it introduces no new ink - cream is already the letter colour and ink is
a brand colour.

## What is NOT established here

- **Garment colours are approximate.** The Black, Pepper and True Navy
  swatches are screen approximations, not Comfort Colors' own values.
  Confirm against the supplier swatch before anything is ordered.
- **Print cost is unquoted and will rise.** A solid disk is a much larger
  ink area than letters alone. Requote with Apliiq.
- **These are 1080 screen exports.** A chosen direction must be rebuilt
  as a 300 dpi master at actual print size and proofed.
- **A second colourway is not just a code change.** Per the Modern Sport
  precedent in `src/lib/fulfillment.ts`, Apliiq keeps one saved design
  per colour, so a new colourway needs its own saved design, product id
  and full SKU set before it can be sold.
- **The garment was not recoloured.** Per CLAUDE.md, garment assets are
  never masked or recoloured, so the dark colourways are shown as colour
  studies rather than as fabricated product photographs. A real second
  colourway render comes from Apliiq or a photograph.

---

# UPDATE, same day: disk rejected, font direction instead

The owner reviewed the studies above and **declined the disk**. The mark
stays letters-alone, which keeps `LAUNCH_SELECTION.md` intact and removes
the print-cost increase entirely. The `badges/` and `studies/` files above
are kept as the record of a direction considered and closed.

The live request is now: **a second colourway carrying the same
letters-only mark set in a different typeface.**

## What is in `font-study/`

`scripts/build-circular-mark.py` typesets the mark from an actual font
file rather than redrawing it, so any face can be tried and the arc
geometry stays identical between candidates.

- `compare-fonts-v3.png` - current mark vs the two candidates, flat.
- `garment-fonts-v2.png` - both composited on the real C1717 Ivory render
  at the approved position and print width.
- `study-colourway-fonts.png` - both in cream on Black, Pepper and
  True Navy.

| Candidate | Character | Rules position |
|---|---|---|
| **Anton** | Tall, condensed, narrow ovals | **In rules.** Already the brand display face per `typography.md`. |
| **Rockwell Bold** | Slab serif, collegiate | **Needs a decision.** A new face; `typography.md` would have to be amended. |

## Still unresolved

- Garment colours remain screen approximations, not Comfort Colors'
  values. Confirm against the supplier swatch.
- A second colourway still needs its own Apliiq saved design, product id
  and SKU set before it can be sold.
- Marks here are screen exports. A chosen face must be rebuilt as a
  300 dpi master at actual print size and proofed.

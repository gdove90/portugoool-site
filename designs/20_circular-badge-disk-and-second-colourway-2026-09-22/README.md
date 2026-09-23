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

# UPDATE, same day: disk declined, and the font direction removed

The owner declined the disk. The mark stays letters-alone, which keeps
`LAUNCH_SELECTION.md` intact and removes the print-cost increase.

A second direction was then explored - the same letters-only mark set in
a different typeface for a second colourway - and the owner declined that
too and asked for it to be deleted. Those files and the script that made
them have been removed from the repository. No typeface change is
proposed, and `typography.md` is unaffected.

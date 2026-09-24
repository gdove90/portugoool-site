# OTTO 31-069 cap — Apliiq artwork spec

Keep this. It governs every future hat design on this cap.

## Customizable area (from Apliiq's own artwork guide, 2026-09-22)

| area | max size (in) | max size (px) | max size (cm) |
|---|---|---|---|
| Front | 4" x 4" | 1200 x 1200 | 10.16 x 10.16 |

Note: Apliiq's general embroidery help page says hats are limited to about
4" x 2" "because hats require special hooping". The per-product guide for
THIS cap says 4" x 4". The per-product figure is the one the customizer
enforces, and a 3.75 x 1.70in design was accepted. Treat 4 x 4 as the
ceiling and expect the hoop to be the real constraint on tall designs.

## File requirements

- **.png**, transparent
- **300 dpi at final production size** (1" of print = 300px)
- **crop tightly** — no extra transparent margin
- max **5 thread colours** per online order

## Embroidery limits that decide whether a design is possible

- **Minimum detail: 2mm.** "The smallest a single stitch can be is 2mm.
  This means the smallest level of detail within your artwork must be at
  least 2mm. If your artwork contains details smaller than 2mm our artist
  will update your file... this may alter the look of your embroidery."
- **Letter height:** 1/2" (12.7mm) recommended · 1/4" (6.35mm) acceptable
  · **below 1/4" not acceptable**
- **Stitch count:** 15,000 included; **+$0.40 per additional 1,000**
- 3D puff: +$3.50 per colour; puff shapes 5-12.5mm thick, 1.8mm apart
- Apliiq **will not remake or refund** embroideries that do not run
  cleanly when the cause is artwork detail, fonts or text.

## The trap this caught

Wide letter-tracking is what kills small text, not the letter size on
screen. The Modern Sport lockup's ATHLETICS line was **62% gap by width**,
which forced the letters down to 4.23mm at 3.5in wide - below the "not
acceptable" line, and unreachable by scaling because the cap caps out at
4in. The fix was to re-typeset with tighter tracking so the same width
carries 13mm letters. Check tracking before assuming a mark just needs
scaling up.

## Verified-compliant artwork in this folder

| file | size | min detail | smallest glyph |
|---|---|---|---|
| `HAT-BADGE-INK-2IN.png` | 1.98 x 2.00in | 2.12mm | 7.37mm |
| `HAT-LOCKUP-ATHLETICS-INK.png` | 3.77 x 1.70in | 2.38mm | 12.87mm |

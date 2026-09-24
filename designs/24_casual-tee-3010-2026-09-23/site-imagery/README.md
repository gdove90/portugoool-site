# Casual Wordmark Tee (3010) — website imagery

Owner-chosen product images for goool.shop, 2026-09-24. All are
AI-generated concept renders (ChatGPT) of the Bella+Canvas 3010 with the
front lockup and the 2l back band, not photographs of a manufactured
sample; the product page carries the "Concept render" caption for that
reason. Checksums in `FILES.json`.

File names carry the shirt colour and the print colour, because the two
print colours are separate products on the site since 2026-09-24
(`goool-heavyweight-casual-tee` = Red set, `goool-heavyweight-casual-tee-blue`
= Club Blue set):

| here | print set | served as |
|---|---|---|
| `casual-tee-3010-black-red-*.png` | 4a black, red band | `GOOOL_STD_CASUAL_3010_BLACK_RED_*.webp` |
| `casual-tee-3010-natural-red-*.png` | 4a-N natural, red band | `GOOOL_STD_CASUAL_3010_NATURAL_RED_*.webp` |
| `casual-tee-3010-natural-blue-*.png` | 4b natural, Club Blue band | `GOOOL_STD_CASUAL_3010_NATURAL_BLUE_*.webp` |
| `casual-tee-3010-black-blue-*.png` | 4b black, Club Blue band | `GOOOL_STD_CASUAL_3010_BLACK_BLUE_*.webp` |

Format: the renders are 1254 x 1254 squares, but the product gallery and
the shop tiles are 4:5 frames (`aspect-[4/5]`, `object-contain`) and every
other studio image is 1122 x 1402. Served square, they sat in the frame
with the box colour showing above and below. Since 2026-09-24 the site
copies are made with `scripts/fit-product-image-4x5.py`: the render's own
background is extended to 4:5 (per-column edge colour, seam delta under
one level) and the side margins trimmed so the garment is drawn at 0.90 of
the frame width with the top margin at 0.115, the same framing as the rest
of the catalogue. Exact pixel sizes per file are in `FILES.json`
(`site_px`). The PNGs here are untouched originals.

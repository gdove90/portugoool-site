# Casual Wordmark Tee (3010) — website imagery

Owner-chosen product images for goool.shop, 2026-09-24. Both are
AI-generated concept renders (ChatGPT) of the black Bella+Canvas 3010 with
the front lockup and the 2l back band, not photographs of a manufactured
sample; the product page carries the "Concept render" caption for that
reason. Site copies are the `GOOOL_STD_CASUAL_3010_BLACK_*.webp` files in
`public/products/`. Checksums in `FILES.json`.

Natural (4b blue band): `casual-tee-3010-natural-*.png` here, served as
`GOOOL_STD_CASUAL_3010_NATURAL_*.webp`. Added 2026-09-24, same provenance.

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

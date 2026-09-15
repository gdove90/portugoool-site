# Apliiq Fulfillment Mapping — First Capsule

One row per sellable website product. When a customer order comes in,
the matching Apliiq product must be built EXACTLY to this spec, which
mirrors `designs/GOOOL_POD_SAMPLE_PACKET/GOOOL_POD_SAMPLE_SPECIFICATIONS.pdf`
(private, gitignored — the packet is the production authority).
**No redraw, substitution, recolor, resize, or portal-generated artwork.**

| Website product (products.ts id suffix) | Price | Apliiq blank | Color | Front artwork (exact packet file) | Print size | Placement |
|---|---|---|---|---|---|---|
| GOOOL Performance Badge Tee (…0001) | $48 | Sport-Tek ST720 | Black | `GOOOL_SAMPLE_01_ST720_BADGE_FRONT_5IN.png` | 5.00 × 6.40 in | Crest top 2.25 in below collar seam, centered |
| GOOOL Core Hoodie (…0002) | $78 | Independent IND4000 | Black | `GOOOL_SAMPLE_02_IND4000_WORDMARK_FRONT_6.75IN.png` | 6.75 × 2.34 in | Art top 4.00 in below hood/neck seam, centered; ≥1.5 in above pocket |
| GOOOL Casual Wordmark Tee (…0003) | $38 | Bella+Canvas 4810GD | **Washed Black** (never plain Black without owner approval) | `GOOOL_SAMPLE_03_4810GD_WORDMARK_FRONT_6.75IN.png` | 6.75 × 2.34 in | Art top 3.25 in below collar seam, centered |
| GOOOL Touchline Cap (…0004) | $36 | OTTO 31-069 | Black/Natural | Front: `..._WORDMARK_FRONT_EMBROIDERY_REFERENCE.pdf/png` 3.75 × 1.30 in · Right side: `..._SOUND_OF_VICTORY_RIGHT_SIDE.svg/png` 2.25 × 0.86 in | flat embroidery, no puff | Front centered 0.50 in above visor seam; slogan wearer's right, 0.55 in above sweatband; rear + left blank |

Shared rules (all garments): DTF/transfer front only · backs blank ·
sizes S–2XL (cap One Size) · GOOOL 1×1 in satin private label on the
three garments, never the cap · center tolerance ±0.25 in max, scale ±2%.

## Order flow (until automation exists)

Checkout is closed today (Coming Soon). When Stripe opens: orders arrive
in Stripe → owner places the matching Apliiq order by hand from this
table. Apliiq account: hello@goool.shop. `supplier_type` in the schema is
ready for automated routing later.

## Apliiq saved products (final, verified 2026-09-15)

Exactly four saved products remain; every superseded or artless
duplicate was deleted with owner approval on 2026-09-15.

| Apliiq product id | Name | Verified state |
|---|---|---|
| 6098962 | GOOOL Performance Badge Tee | ST720 Black only; packet crest 5.00x6.40 in, transfer, centered (drag-recorded position; mockup verified) |
| 6098963 | GOOOL Casual Wordmark Tee | 4810GD Washed Black; packet wordmark 6.75x2.34 in, transfer, centered (verified) |
| 6098974 | GOOOL Core Hoodie | IND4000 Black only (Bone removed); packet wordmark 6.75x2.34 in, transfer, centered high chest (verified) |
| 6098980 | GOOOL Touchline Cap | OTTO 31-069 Black/Natural; front flat embroidery 3.75x1.30 in, black + cranberry (201C), no puff, front only (verified) |

Positioning note: Apliiq's old customizer only persists artwork
position through real drag events (its Knockout model ignores raw CSS
changes). First-generation saves rendered art off-center or missing;
all four were rebuilt with event-driven positioning and their grid
mockups visually confirmed centered.

## Alternate colorway samples (added 2026-09-15)

Owner-approved second colorway (concept board 06; final colors chosen
from Apliiq's actual stock). Artwork masters recolored pixel-for-pixel
on the approved palette: navy #182A40, cream #EEE5D5 (unused; white tee
took the navy badge instead), burgundy #742E3D. Production files live
in `designs/GOOOL_POD_SAMPLE_PACKET/07_Alternate_Colorway_Artwork/`.

| Apliiq product id | Name | Verified state |
|---|---|---|
| 6099046 | GOOOL Performance Badge Tee White | ST720 White only; navy/burgundy crest 5.00x6.40 in, transfer, centered (preview verified) |
| 6099060 | GOOOL Casual Wordmark Tee Grey | 4810GD Washed Grey only; navy/burgundy wordmark 6.75x2.34 in, transfer, centered, contrast verified |
| 6099064 | GOOOL Core Hoodie Bone | IND4000 Bone only; navy/burgundy wordmark 6.75x2.34 in, transfer, centered high chest (rebuilt on approved palette; off-palette v1 deleted) |

Notes: Apliiq stocks NO navy ST720 (white/silver/true royal/black/true
red/iron grey only) and NO bone 4810GD (13 washed colors) - owner chose
White and Washed Grey instead. The concept board's navy cap was NOT
approved; the single Black/Natural Touchline Cap is unchanged. SKUs
cover S-2XL on all three additions (ST720 and IND4000 run xs-xxxl,
4810GD xs-4xl); Bella+Canvas provides no automated inventory feed, so
per-size stock is confirmed at order time. Seven saved products total;
no orders placed.

## Known deviation log

- 2026-09-14: the original Apliiq drafts used wrong artwork (an 8 in
  shoulder-variant wordmark on the 4810GD; front-CC-DARK on the ST720).
  Both products were rebuilt from the exact packet files; see the
  table above.
- 2026-09-14 OWNER DECISION: the cap ships FRONT WORDMARK ONLY. The
  packet's right-side "THE SOUND OF VICTORY" embroidery is dropped,
  matching the website photos.
- 2026-09-14 retraction: an earlier report that 4810GD Washed Black and
  ST720 were discontinued at Apliiq was FALSE (hidden template text was
  misread); both blanks are live.
- Cap red thread: Cranberry (PMS 201C), the numerically nearest stock
  thread to #C61322; confirm on the digitized proof.
- New products may carry an extra default color (e.g. Silver on ST720,
  Bone on IND4000) alongside Black; remove extras in the product's
  "color offered" menu before ordering.

## Superseded log entries
- 2026-09-14: Apliiq draft of the 4810GD casual tee found using
  `goool-wordmark-v2-shoulder-dark-7.png` at 8 × 2.75 in. Both wrong
  (file not in the packet manifest; size exceeds spec 6.75 × 2.34 in).
  Must be replaced with the packet file at packet size before any
  sample or customer order.

## Release gate
Per the packet: no customer fulfillment until the physical samples are
approved in writing by the owner. Sample sizes for the three garments
are still OWNER TO CONFIRM.

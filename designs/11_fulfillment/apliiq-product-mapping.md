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

## Order flow (automated pipeline built 2026-09-15; live sales still gated)

Checkout is closed today (Coming Soon). The integration exists and is
tested end to end against simulated services:

Stripe Checkout → `/api/stripe-webhook` (signature-verified, the only
payment authority) → order snapshot in Supabase (`orders`,
`order_items`, `stripe_events`, `order_shipments`; migration 0026) →
Apliiq `POST /v1/Order` using the per-size SKUs below → Apliiq
Fulfillment URL callback (`/api/apliiq-fulfillment`, HMAC-verified) →
`/track-order` lookup by order reference + email.

The executable mapping lives in `src/lib/fulfillment.ts`; this table
mirrors it. Prices and SKUs are snapshotted into the Stripe session at
checkout creation and fulfillment reads only that persisted snapshot,
so later catalog edits never change what a paid order ships. Real
supplier submission is layered behind `APLIIQ_SUBMIT_ENABLED=true` AND
Netlify `CONTEXT=production` AND a live-mode Stripe event — test
events, previews, and local runs are refused in code, not by
convention. Apliiq account: hello@goool.shop.

### Rollout order (each step verified behind the closed purchase gate before the next)

1. Apply migration 0026 in the Supabase SQL editor.
2. Configure Stripe (secret key, webhook endpoint + secret, shipping
   rate, tax decision) — verify with Stripe TEST mode end to end; the
   environment gate keeps test events away from Apliiq by design.
3. Configure the Apliiq custom store (APP_ID / shared secret,
   Fulfillment URL) and `FULFILLMENT_OPS_KEY`.
4. Transactional email decision (Resend or equivalent) — customers
   currently get the order reference on /success plus Stripe's receipt.
5. Physical samples approved in writing (the packet release gate).
6. Open purchasing (`availableForSale: true`) — and only after that,
   flip `APLIIQ_SUBMIT_ENABLED=true` in the production context.

## Verified per-size fulfillment SKUs (read from Apliiq records 2026-09-15)

A saved-design id is NOT a SKU. Apliiq's Order API takes the per-size
SKUs below (`APQ-{savedProduct}S{sizeCode}A1`). Launch sizes S–2XL only
(cap One Size); XS/3XL+ SKUs exist at Apliiq but are not sold.

| Garment / color | Apliiq id | S | M | L | XL | 2XL |
|---|---|---|---|---|---|---|
| Perf Tee Black | 6098962 | APQ-6098962S6A1 | APQ-6098962S7A1 | APQ-6098962S8A1 | APQ-6098962S1A1 | APQ-6098962S2A1 |
| Perf Tee White | 6099046 | APQ-6099046S6A1 | APQ-6099046S7A1 | APQ-6099046S8A1 | APQ-6099046S1A1 | APQ-6099046S2A1 |
| Perf Tee True Royal | 6099129 | APQ-6099129S6A1 | APQ-6099129S7A1 | APQ-6099129S8A1 | APQ-6099129S1A1 | APQ-6099129S2A1 |
| Hoodie Black | 6098974 | APQ-6098974S6A1 | APQ-6098974S7A1 | APQ-6098974S8A1 | APQ-6098974S1A1 | APQ-6098974S2A1 |
| Hoodie Bone | 6099064 | APQ-6099064S6A1 | APQ-6099064S7A1 | APQ-6099064S8A1 | APQ-6099064S1A1 | APQ-6099064S2A1 |
| Casual Tee Washed Black | 6098963 | APQ-6098963S6A1 | APQ-6098963S7A1 | APQ-6098963S8A1 | APQ-6098963S1A1 | APQ-6098963S2A1 |
| Casual Tee Washed Grey | 6099060 | APQ-6099060S6A1 | APQ-6099060S7A1 | APQ-6099060S8A1 | APQ-6099060S1A1 | APQ-6099060S2A1 |
| Touchline Cap Black/Natural | 6098980 | One Size: APQ-6098980S34A1 | | | | |

Unmapped combinations make an order fail loudly (`submission_status =
failed` with the exact variant named); the pipeline never substitutes a
color, size, or garment.

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
| 6099129 | GOOOL Performance Badge Tee True Royal | ST720 True Royal only; cream/burgundy crest `GOOOL_ALT_03_ST720_BADGE_CREAM_BURGUNDY_FRONT_5IN.png` (cream #EEE5D5 base, burgundy #742E3D underline) 5.00x6.40 in, transfer, front only, back/sleeves blank. Saved position verified against the black original from the rendered mockup: canonical left 125.3 / top 164.4 vs black 125.3 / 163.4 (10 px/in space; 0.09 in delta, inside the ±0.25 in tolerance). ArtworkId 8133250, PAFId 5944867. SKUs xs-xxxl (S-2XL covered; site sells S-2XL only). Added 2026-09-15, no order placed |

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

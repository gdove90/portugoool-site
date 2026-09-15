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

## Known deviation log

- 2026-09-14: Apliiq draft of the 4810GD casual tee found using
  `goool-wordmark-v2-shoulder-dark-7.png` at 8 × 2.75 in. Both wrong
  (file not in the packet manifest; size exceeds spec 6.75 × 2.34 in).
  Must be replaced with the packet file at packet size before any
  sample or customer order.

## Release gate

Per the packet: no customer fulfillment until the physical samples are
approved in writing by the owner. Sample sizes for the three garments
are still OWNER TO CONFIRM.

# ST720 GA Tee: owner decisions (14 Oct 2026)

Source: `designs/26_st720-ga-tee-2026-10-14/CLAUDE-ST720-GA-TEE-HANDOFF.md`.

- Brand on this line: **GOAL Athletics**. The GA monogram is the main logo. The legal entity and domain are unchanged until the owner confirms.
- Blank: **Sport-Tek ST720** (Apliiq "Sustainable Athletic Tee"), DTF transfer only, sizes S to XXL. This is a separate owner-requested line; it does not replace any existing tee.
- Two styles:
  - **Minimal:** GA 3.00 in on the left chest, plus the stacked GOAL / bar / ATHLETICS 6.00 in on the upper back.
  - **Big:** horizontal GA + GOAL ATHLETICS lockup 10.00 in across the chest, with no back print.
- Six colourways per style, 12 Apliiq designs. Indigo was dropped by the owner.
- Label: the existing private labels are not added. Designs save with the ST720 tear-away label; a GOAL label needs an owner-approved mockup first.
- Price: not set. Two model floors are reported to the owner (PRICING-25-PERCENT.md formula). The site stays unpublished for these products until the owner sets the price.

## Artwork provenance

- GA monogram (3.00 in) and big lockup (10.00 in) are re-exported from the owner's V1.3 vector master (`GOAL_ATHLETICS_V1.3_APPROVED_NO_ORANGE`, combined lockup SVG, paths unmodified), in the handoff's inks.
  - The supplied enlarged PNGs are kept in `print/supplied-enlarged/`.
  - The supplied GA matched the vector at 99.2% overlap.
  - The supplied lockup was 0.4% wider than the vector, with 96.7% overlap.
- Stacked GOAL / bar / ATHLETICS (6.00 in back): no vector master exists in the repo or on the Desktop, so the supplied PNGs are used as delivered. Vector master still pending.

## Apliiq designs (saved 14 Oct 2026)

| Colourway | Minimal | Big |
|---|---|---|
| Black | 6206215 | 6206229 |
| True Royal | 6206254 | 6206234 |
| White · Black-Red | 6206255 | 6206236 |
| White · Royal | 6206257 | 6206239 |
| Silver | 6206263 | 6206241 |
| True Red | 6206277 | 6206251 |

- Every design is a transfer print with its hi-res file linked (ideal quality) and a production note per zone, and uses the ST720 tear-away label.
- Template, placements, quotes and checksums: `designs/26_st720-ga-tee-2026-10-14/FILES.json`.

## Website (branch `claude/st720-ga-tee`, not merged)

- Products `80000000-0000-4000-8000-000000000011` (Minimal) and `…0012` (Big) are in `src/lib/products.ts`.
  - Both are hidden (`isActive: false`), not for sale, with `priceCents: 0`.
  - Variants are mapped to the Apliiq designs in `src/lib/fulfillment.ts`.
  - Images are Apliiq's front and back renders, captioned as concept renders.
- Migration `supabase/migrations/0039_st720_ga_tees.sql` is written but not applied.
- Publishing waits on the owner's price.

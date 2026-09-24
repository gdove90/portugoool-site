# Core Capsule: the first collection we launch (owner decision, 24 Sep 2026)

Owner instruction, verbatim: "The Core Capsule will be the first capsule
(collection we launch) with all the new uploads. and we can launch
friday." Friday is **2026-09-25**.

## What is in the Core Capsule (the live catalogue after this decision)

| Row | Product | Colours | Apliiq designs |
|---|---|---|---|
| Match Ready | GOOOL Performance Badge Tee | Black, White, True Royal | 6098962, 6099046, 6099129 |
| Match Ready | GOOOL Athletics Modern Sport Performance Tee | Black, True Royal | 6112037, 6113361 |
| Warm-Up Club | GOOOL Core Hoodie · Red | Black, Bone, Grey Heather | 6121031, 6120990, 6121043 |
| Warm-Up Club | GOOOL Core Hoodie · Club Blue | Black, Bone, Grey Heather | 6121042, 6121021, 6121044 |
| Off the Pitch | GOOOL Casual Wordmark Tee · Red | Black, Natural | 6120860, 6120889 |
| Off the Pitch | GOOOL Casual Wordmark Tee · Club Blue | Natural, Black | 6120887, 6120898 |
| Headwear | GOOOL Touchline Cap | Black/Natural | 6098980 |
| Headwear | GOOOL Athletics Badge Cap | Black/Natural | 6117349 |
| Headwear | GOOOL Athletics Stacked Cap | Black/Natural | 6117282 |

All nine rows are `availableForSale: true`.

## Removed from the website the same day (designs stay saved on Apliiq)

- GOOOL Athletics Varsity Tee (`goool-athletics-varsity-tee`, id
  `80000000-0000-4000-8000-000000000002`; Apliiq 6114178 / 6114196)
- GOOOL Athletics Circular Badge Tee (`goool-athletics-circular-badge-tee`,
  id `…0004`; Apliiq 6112033)
- GOOOL Athletics Circular Center Crewneck
  (`goool-athletics-circular-center-crewneck`, id `…0005`; Apliiq 6112046)
- The original wordmark-only Core Hoodie (Apliiq 6098974 Black, 6099064
  Bone) had already left the site with the hoodie remake earlier the same
  day (`CORE-HOODIE-REMAKE-DECISION.md`).

How: `isActive: false` and `availableForSale: false` in
`src/lib/products.ts`, slugs removed from `src/lib/collections.ts`, and
301s to `/shop` in `src/middleware.ts` (same pattern as the Modern Sport
Tee and the Minimal Club Tee). Fulfillment mappings are left in place for
the record; the reconciliation registry marks them inactive. Nothing was
deleted on Apliiq.

## Launch dependencies (as of 24 Sep 2026, ~05:30)

1. **Netlify deploys are paused** (team on operational credits). The
   catalogue above, the hoodie remake and these removals are committed
   locally but not live. Credits or the billing-cycle reset must happen
   before Friday, then: `rm -rf .next && npx netlify deploy --prod --build`.
2. Supabase migrations 0034 and 0035 (SQL editor, audit trail; the order
   store guards the rows at runtime).
3. Bone · Red hoodie renders from the owner (Apliiq's render stands in).
4. The preview gate (password) stays until the owner decides ads and
   opening; that is a separate switch from purchasing, which is open.

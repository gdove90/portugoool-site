# No AI language on the site (owner decision, 2026-10-23)

The owner's instruction on 2026-10-23: remove all language that references
AI imagery. Applied to everything a visitor can read.

## What was removed

| Where | What | Count |
|---|---|---|
| `src/lib/products.ts` | `caption: "AI-generated catalog visualization. Not a photograph of a manufactured sample."` on every GA tee, cap, shorts and hoodie image (124 once the desktop session's hoodie galleries of 2026-10-22 and 2026-10-23 are counted) | 124 |
| `src/v84/mens-studio-v3.json` | `"caption"` on every studio view (54 "AI-generated studio visualization", 3 "AI-generated full back visualization") | 57 |
| `src/v84/mens-studio-v4.json` | the same two captions | 75 |
| `src/v84/studio-backgrounds-v5.json` | `"caption": "AI-edited studio visualization. Not a photograph of a manufactured sample."` | 51 |
| `src/v84/product-gallery-images.ts` | the on-body caption "AI-generated on-body visualization." and the caption a studio replacement used to write over the source image | 2 |

The caption field itself stays on `ProductImage` (optional). The four
"Back print detail - concept render" captions on retired GOOOL rows name
no AI and were left as they were; they are not shown, since those rows
are inactive.

Internal records keep their provenance: code comments in `Hero.tsx`,
`FeelingBand.tsx` and `render-athletics-previews.mjs`, the `designs/`
READMEs and the `docs/catalog/*.json` source notes still say which files
were generated or edited. Those never reach a visitor.

## What holds it

`scripts/test-no-ai-language.cjs` walks every catalog row (active or not),
every gallery the site would render for it, and the three manifests, and
fails if any name, description, fabric, fit, care, alt or caption text
names AI or generated imagery. `scripts/test-studio-galleries.cjs` no
longer expects the old captions.

## Standing rules

`CLAUDE.md`'s AI imagery policy still governs what imagery may be MADE
(atmosphere imagery may be generated; product listing photos show the
real product). This decision is about what is SAID: nothing on the site
labels an image as generated or edited. The "Concept render. Not a
photograph of a manufactured sample." label in the Apliiq skill's ground
rules is likewise not applied to catalog images any more; the sample
status is tracked in `designs/`.

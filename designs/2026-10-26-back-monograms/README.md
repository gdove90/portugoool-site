# GOAL Athletics back monograms — 2026-10-26

Owner request: replace the double-strike prints on the backs of clothing in the website photography with the supplied white GOAL Athletics GA monogram. The reference is `GoalAthletics/01 Logos/GA logo v1.3/3 Monograms/White/Monogram White.png`.

Three shared editorial photos contain four placements: `women.png` (one), `hero.png` (one), and `collection-editorial.png` (two). All 19 active catalog back photos were checked; none contains the double-strike print. Front garment marks and standalone brand graphics are outside this request.

The built-in imagegen tool edited each photo using the supplied monogram as its insert reference. Only small, feathered patches around the four back prints are taken from the edited outputs; every original source pixel outside those patches remains unchanged. Original dimensions, crops, people, clothing and lighting are preserved. Original source images are recoverable from base commit `c00f405cde0f06a6c02ffcab97fc2a5301ed6cbc` and retained in the local review output.

The same three PNG paths are retained, along with regenerated desktop lossless WebP and mobile quality-82 WebP versions. This updates the public Tempo page, home and men imagery, collection header, About story and product editorials through existing references.

Prompt set (built-in tool, one call per photograph):

- Women: replace only the tiny upper-back white two-slash print with the supplied GA monogram, approximately 30 px wide, preserving reference proportions and matching the fabric perspective and lighting. Preserve original dimensions and every other part of the photograph.
- Stadium tunnel: replace only the male athlete's tiny upper-back two-slash print with the supplied GA monogram, approximately 25 px wide, matching black fabric and subdued white print. Preserve original dimensions and every other part of the photograph.
- Collection editorial: replace both athletes' upper-back two-slash prints with the supplied GA monogram, approximately 27 px wide each, retaining exact reference proportions and natural perspective. Preserve original dimensions and every other part of the photograph.

Verification: compare original and final RGB pixels outside the four edit regions; verify desktop WebP decodes identically to the PNG; inspect all four placements and affected desktop/mobile page views. No application code, commerce state, garment production artwork or master monogram asset is changed.

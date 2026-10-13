# GOAL Athletics — approved identity and corrected vector construction QA

## CRITICAL RECALL — prior files were defective

The original automatic exports named `goal-athletics-horizontal-lockup-proof.svg` and `goal-athletics-halo-02-proof.svg` were rejected on 2026-10-12:

- The horizontal SVG had **no independent vertical divider geometry**, despite the owner's required design.
- Halo #2 was an aggregate raster trace with **missing tiny curved text**.

Both failed originals have been moved from active paths to `REJECTED_PROOFS_DO_NOT_USE/`. **Do not place the old ZIP or any derived PNGs into production.** The separate full-package audit identified 18 affected old exports, plus source crops kept solely as design references.

## Controlled corrected references

Six versions in `CORRECTED_QA_PROOFS/`:
- Horizontal GOAL Athletics logo with **actual mandatory vector divider**, white/ink, with and without tagline.
- Halo Badge #2 with full individual vector glyph outlines for **GOAL ATHLETICS** (top) and **PERFORMANCE LIVES HERE** (bottom), white/ink.

Geometry/structure:
1. The original V1.2 twin-slash has the exact source path coordinates from the original master, transformed using only uniform scale and translation.
2. Divider is a standalone vector rectangle with ID `MANDATORY_VERTICAL_DIVIDER`; it must not be removed.
3. Halo #2 has two balanced side arcs and **individually outlined** glyph paths with explicit full text data.
4. All corrected SVGs are standalone and do not require an installed font or raster file.
5. These are **VECTOR CONSTRUCTION PROOFS**, not manufacturer-certified production masters.

## Automatic checks before build

`npm run test:brand` runs `scripts/test-goal-brand-assets.cjs`, also invoked automatically via `prebuild`. It fails if any horizontal divider, V1.2 strike paths or Halo #2 text outlines are missing, if a rejected active export reappears, or if nonoutlined bitmap/text dependencies are introduced. Production/preview build must refuse invalid structure.

## Boundaries that cannot be bypassed

**Only the V1.2 strike was supplied as an authored vector master.** The official futuristic GOAL wordmark was approved from a generated concept board; the source font and designer-authored master have not been identified. Its vector component remains an optical trace and requires professional point-level cleanup, kerning review, and owner signoff. Badge #2's curved copy is reconstructed in newly outlined Lato Bold glyphs, not exact original source font. It also requires owner visual approval.

Manufacturing feasibility: the divider is very thin at common chest-print widths; the Halo #2 text is extremely small for embroidery. APLIIQ/Printful/Printify/YCL compliance cannot be inferred from the SVG being valid or from 300 DPI. Product-template checks, decorated sample inspection and embroidery digitization/stitchout are still mandatory. No special use of the word 'manufacturer-ready' until a supplier-approved file is issued.

## Relevant locations

- Original authentic live-geometry master: `public/v84/assets/strike-v1.2-ink.svg`.
- Header/footer controlled GOAL wordmark preview: `src/v84/Brand.tsx`, with mandatory divider and retained V1.2 animation.
- Fully documented failed-package audit, source references, render previews, physical feasibility report and zipped corrections: ChatGPT Library `/GOAL Brand Group/Approved Brand Assets/Vector Corrections 2026-10-12`.

**Branch only: no production deploy, manufacturer submission, or user OneDrive edits.**

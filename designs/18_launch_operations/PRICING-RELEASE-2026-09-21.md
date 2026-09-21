> **Superseded pricing:** The owner approved the 25% model and archived cotton Modern Sport. Use [PRICING-25-PERCENT.md](PRICING-25-PERCENT.md). Historical numbers below are preserved as evidence, not current instructions.

# Pricing release — 2026-09-21

The owner explicitly requested: "put prices all garments that dont have them and deploy it!" This authorizes publishing the six proposed prices from the preceding discussion. It supersedes the earlier publication hold for these six prices, but does not mean all landed costs, labels, samples, shipping or live payment activation are complete.

| Product | Retail USD, S–2XL |
|---|---:|
| Modern Sport cotton | 64 |
| Varsity | 68 |
| Minimal Club | 64 |
| Circular Badge tee | 48 |
| Circular Center Crewneck | 128 |
| Modern Sport Performance | 64 |

The server catalog in src/lib/products.ts is the current runtime authority. Cards, detail pages, metadata and checkout price calculations read it. Existing four prices are unchanged. No database migration, supplier artwork/SKU change, Stripe change or sale/fulfillment activation is part of this release. Unknown COST-INPUTS fields stay null; full quote_verified stays false. The research and its proposed margins remain qualified estimates, not verified net profit.

Pricing evidence: APLIIQ-PRICING-RESEARCH-2026-09-21.json. That file records the preceding research state; this release records the subsequent owner instruction.

## Casual wordmark placement remains unfinished

The owner's screenshot and CASUAL-TEE-PLACEMENT-VERIFICATION.json confirm that the 3.00in collar-to-visible-art top target was documented, but website images and supplier designs were not changed. Preserve the 6.75in width, both Washed Black and Washed Grey, and existing source artwork. Do not claim this pricing release fixes placement. Follow the root CLAUDE-CASUAL-TEE-PLACEMENT-PROMPT.md; ignore its obsolete model-image work because model shots have since been removed.

## Claude handoff

Work in C:\Users\gdove\OneDrive\Desktop\GOOOL. Preserve the published six prices and approved studio tiles. Finish the Casual Wordmark Tee placement in both colors: visible artwork top 3.00in below the bottom center-front collar seam, width 6.75in. Update Apliiq and garment-only website imagery, preserve originals, reopen the saved designs, and show dimensioned before/after evidence. Do not replace the logo, move the whole photograph, or mark physical samples approved. Keep Coming Soon and real fulfillment disabled. Pricing has been authorized for display; unresolved landed costs remain launch checks.

## Deployment verification

Production deployment 6ab107734e189f0008826534 is ready for commit 6fbfef92db3f22fdc2529aa50a1ba502c2387d79. Build, lint and TypeScript checks passed. PRICING-LIVE-VERIFICATION.json confirms all ten active products show their prices and remain Coming Soon; anonymous shop requests still redirect to the prelaunch landing page. No image asset or supplier placement was changed.


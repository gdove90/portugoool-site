# Reference-style product tiles — 2026-09-21

Owner direction: use the supplied Peace Collective screenshots as a presentation reference, while preserving GOOOL garments and artwork. Visible studio tiles and consistent whitespace are intentional. This supersedes older blanket requirements to remove every box or make every backdrop pure white.

## Implemented

- Collection width increased to 1480px maximum with responsive gutters; four columns on large desktop, three at intermediate desktop, two on mobile.
- Consistent 4:5 media tiles, restrained 2px corners and a subtle one-pixel edge separate the original pale studio backgrounds from the white page.
- Cards use `object-contain`; hover enlargement is removed so sleeves and hems remain visible.
- Main galleries retain the complete original image. Thumbnails now also use 4:5 dimensions and contain fitting instead of square cropping. Inactive thumbnails no longer fade the garment to 70% opacity.
- Responsive image sizing is corrected at the three-column breakpoint; Next image delivery quality is explicitly 90.
- Removed six additional generated model references remaining in Modern Sport cotton, Varsity and Minimal Club galleries. The earlier cleanup had removed STADIUM references but left these MODEL references. Original model files remain on disk.

## Preservation and scope

No file in public/products was edited, recompressed, recolored, masked or regenerated. Current garment geometry, design placement, lettering, colors and original studio shadows remain intact. The original pale backdrops preserve light-garment edges without another destructive masking pass. A stronger background treatment would be separate artwork work requiring an accurately isolated original, not a CSS filter over the fabric.

No supplier IDs, checkout snapshots, prices, sale gates, Stripe settings or migration state were changed. Casual Apliiq recreation and the new placement proof remain separate outstanding work; this display fix is not evidence that manufacturing placement was changed.

## Validation

Production build includes lint and TypeScript validation. Browser review covers all 10 product pages, the 14 colorways, desktop and mobile collection layouts, swatch changes and gallery controls. Check PRODUCT-TILES-VERIFICATION.json for final automated results. Screenshots are retained locally in output/product-tiles rather than bundled with production artwork.

## Claude continuation

Preserve the implemented reference-style tiles and original garment files. Do not repeat blanket background whitening, square cropping, hover clipping or model-image restoration. Continue the existing launch task list: approved casual supplier recreation, test-payment verification, verified costs before new prices, labeling/sample readiness, and Instagram-only drafts. Do not claim this presentation deployment opens sales or completes the launch.

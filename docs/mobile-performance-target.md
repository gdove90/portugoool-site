# GOOOL Athletics — 2.5-second LCP target

The three measured routes meet the target in all nine cold-cache laboratory runs. This is a local production-build result, not a claim about live field Core Web Vitals. Deployment remains on hold for the owner's preview.

| Route | Previous local preview median | Optimized median | Individual runs | Observed maximum CLS |
|---|---:|---:|---|---:|
| / | 3.676s | 2.340s | 2.336s, 2.340s, 2.344s | 0.000000 |
| /shop | 3.172s | 1.984s | 1.984s, 2.016s, 1.980s | 0.000198 |
| /shop/goool-performance-tee | 0.992s | 0.792s | 0.760s, 0.792s, 0.840s | 0.000190 |

## What was needed

1. Retain the earlier mobile image optimization: eight WebP derivatives of the same approved campaign photographs, selected only below 1024px. Their full-resolution desktop originals remain unchanged. This removed the original 1.8–2.1 MB campaign downloads on phones.
2. Trace the remaining delay rather than changing the measurement profile. The homepage LCP element was the hero image; shop LCP was the collection image. Nine eager original catalog images inside the closed search dialog were discovered first and preloaded by server rendering. They transferred about 1.3 MB on every page, competing with the visible hero and delaying fonts. The before trace records this request sequence.
3. Set native loading="lazy" on search and bag thumbnails in src/v84/Shell.tsx. Closed dialogs now produce zero initial original-catalog image requests in Chrome at 320, 390, 768, 1024, 1440 and 1920px, and WebKit at 390px. All nine search images load when exposed, filtering and closing still work, and image sources, dimensions, assets and navigation remain unchanged. Applying this resource-loading correction to the shared closed dialogs changes no desktop design. No new package, image replacement, font change, business logic, backend, environment or Netlify configuration was needed.
4. Rebuild production mode and repeat the identical cold-cache profile, then verify search, bag/cart/checkout controls and desktop screenshots.

| Route | Previous resource transfer | Optimized resource transfer | Reduction |
|---|---:|---:|---:|
| / | 1.837 MB | 0.538 MB | 1.299 MB |
| /shop | 1.726 MB | 0.427 MB | 1.299 MB |
| /shop/goool-performance-tee | 4.028 MB | 2.821 MB | 1.207 MB |

Resource totals are measured through network idle plus 2.5 seconds, before menu interactions; they include more than the LCP resource. Native lazy loading can still fetch nearby page imagery.

## Measurement conditions and evidence

Both previous and optimized previews use http://localhost:3109 with production builds: the previous preview is commit e1483377dee45e7634c26a4cbaeb754a5a13a507. Chrome at 390×844, device scale 1, cold browser cache, 4× CPU slowdown, 1.6 Mbps download, 0.75 Mbps upload, 150 ms latency; three runs per route. The profile was not relaxed. CPU/browser QA ran after the measurements.

Raw evidence: performance-target-before.json, performance-target-after.json, lcp-trace-before.json and lazy-dialogs.json in output/mobile-overhaul. The broader original production-vs-local comparison remains in REPORT.md; unlike this target comparison, those hosts differ.

Field LCP/INP/CLS, actual iOS/Android hardware, all other routes' LCP and the eventual Netlify preview are unmeasured. Real network latency, geographic CDN behavior and production analytics can affect the live result. Once the owner proceeds beyond this local preview, rerun this same profile on the Netlify preview and verify the deployed commit before release.

Local preview: http://localhost:3112. No push, PR or deployment was performed.

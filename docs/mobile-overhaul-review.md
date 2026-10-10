# GOOOL Athletics mobile review — 2026-10-09

The mobile storefront extends the approved v84 identity below 1024px. Desktop layout, product data, availability gates, integrations, original assets, and navigation destinations are preserved. Deployment is on hold at the owner's request to preview first.

## Baseline and scope

- Production baseline: `0e0cb30d10fd0a2874f772f5df7e31ecc3aadbe6`, `main`, published Netlify deploy `6ac7f10c6cf0b00008ac6822`.
- Isolated branch: `codex/mobile-experience-overhaul-20261009`. Existing `codex/tempo-copy` work and its checkout were not overwritten.
- Next.js 15.5.24 / React 18, App Router, existing v84 templates and styles. Self-hosted Inter and Barlow Condensed remain the brand fonts.
- Public route inventory and original screenshots: `../output/mobile-overhaul/routes.json` and `baseline/`. 37 storefront/document routes plus the invalid-token unsubscribe surface and eight retired-route redirects are checked. A valid unsubscribe token is deliberately not used because it changes a subscriber record. Private admin pages and backend endpoints are outside presentation scope.

## Audit and repairs

| Severity | Finding / root cause | Affected surfaces | Repair |
|---|---|---|---|
| Major | Mobile menu inherited 40px desktop-style navigation, exceeded the viewport, and did not lock background scrolling | Shared header / all storefront routes | Branded drawer, 17px hierarchy, scrolling, safe areas, focus cycling, scroll restoration, Escape/outside/close/link dismissal |
| Major | Small labels, product titles, supporting text, and scattered breakpoint overrides obscured hierarchy | Home, catalog, product, story, kit, footer, forms | Central mobile role tokens; Inter body/navigation and Barlow hero treatment; consistent gutters and controls |
| Major | Directional Unicode symbols varied across platforms | Editorial CTAs, galleries, size guide, contact, promotions, submission reviews | One SVG icon family; accessible controls and mobile gallery buttons |
| Major | Narrow story feature image inherited a 360px minimum height; square ratio forced 360px width at a 320px viewport. Story CTA retained desktop centering | Your Story | Corrected actual sizing constraints and CTA positioning |
| Major | Campaign PNGs were around 1.8–2.1MB each | Home / collection / editorial | Mobile-only WebP copies of the same approved imagery, preserving aspect and composition. Original files and desktop sources remain untouched |
| Moderate | Different title lengths displaced product prices | Two-column cards | Flexible metadata aligns prices within each grid row without truncating titles |
| Moderate | Tiny footer links and inconsistent mobile controls | Shared footer, forms, bag, product options, dialogs | Readable groups, larger targets, viewport-aware scrolling and layout |
| Moderate | Standalone legal documents used inconsistent mobile typography and obsolete hash-based return links | Three submission documents | Mobile Inter styles, controlled heading sizes, correct existing route destinations; legal copy unchanged |

## Design reference review

Current mobile homepages from [Nike](https://www.nike.com/) and [Represent](https://representclo.com/) were inspected and captured. Applicable principles are compact headers, recognizable controls, image-led merchandising, short navigation labels, disciplined spacing, and clear CTAs. Represent's consent overlay was also inspected. [adidas](https://www.adidas.com/) and [Classic Football Shirts](https://www.classicfootballshirts.com/) returned security blocks in the automated browser; detailed interactions on those sites were not verified. Reference screenshots and raw observations are in `references/`, `references.json`, and `reference-review.json`. No competitor copy, imagery, branding, or layout was imported.

## Validation and practical limits

Browser evidence and the final report are saved in `../output/mobile-overhaul/`. The QA runner uses the host's bundled Playwright, Chrome, and installed WebKit; no runtime package or site configuration was added for tests.

- Ten widths: 320, 360, 375, 390, 414, 430, 768, 1024, 1440, 1920. Portrait matrix, landscape 844×390, narrow 320×568, and enlarged catalog text.
- Emulated Pixel 5 / Chrome and iPhone 13 / WebKit interaction suites. These are not actual Android/iPhone hardware or installed iOS Safari results.
- Flat navigation has no submenus; no new categories were invented. All existing destinations remain reachable.
- Checkout is intercepted with an explicit error fixture. No Stripe session, purchase, real form submission, or subscriber change is created.
- Type checking, explicit Next ESLint configuration, production build, existing v84 checks, and gallery sequence tests are run. Historical test guards now use the actual production baseline, and gallery preservation comparisons normalize Windows line endings.
- All 101 protected baseline files and 32 approved reference assets pass preservation checks. Gallery validation covers 8 products, 18 colors, 103 views, and 54 approved studio assets.
- Desktop comparisons mask only the Next development indicator and the intentionally changed SVG-bearing controls. Page dimensions and all pixels outside those regions are checked. Original desktop photography remains selected at 1024px and above.
- Existing lint warnings concerning raw image elements and the catalog's redundant `aria-pressed` remain documented; this is not a claim of a complete WCAG certification.
- Lab measurements use 390×844, cold cache, 4× CPU throttling, 1.6Mbps download / 0.75Mbps upload and 150ms latency, three runs per route. Production-before measurements use the published Netlify permalink; after measurements use the local production build. Hosting differs, so these are diagnostic comparisons, not a controlled CDN benchmark. Field LCP/INP/CLS, real-device results, and staging measurements remain unmeasured. The follow-up controlled local comparison achieves the 2.5s LCP target in all nine runs on home, collection and the tested product page. See mobile-performance-target.md for the request trace, changes and exact measurements.

## Review and release control

Local production-mode preview: http://localhost:3109. The server must remain running on this computer; this is not a public staging URL.

No branch push, PR, Netlify preview deployment, production merge, or production deployment is performed while the owner reviews the local preview. The next authorized staging step is to push this isolated branch and create a draft PR against `main` using the existing Netlify preview workflow, then verify that preview and its commit before production approval.

Reversal before release: switch away from this isolated branch; the production branch is unchanged. If these changes are later released, revert the reviewed mobile commit (or its merge commit) and let the existing Git/Netlify workflow build the revert. Do not edit payment, backend, environment, product, availability, or publishing settings to reverse presentation changes.

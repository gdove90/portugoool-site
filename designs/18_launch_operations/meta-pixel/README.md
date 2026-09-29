# Meta Pixel

- Dataset name in Events Manager: **GOOOL PIXEL**
- Pixel ID: **1633958724829471**
- Created 2026-09-29 in Business Manager 927605020407403 (ad account 66736152)
- Events Manager: https://business.facebook.com/events_manager2/overview?business_id=927605020407403

`META-PIXEL-BASE-CODE.html` is the snippet Meta generated, kept for reference
only. It is NOT pasted into the site. goool.shop already carries its own
consent-gated pixel loader (`src/lib/meta-pixel.ts`, `MarketingConsent.tsx`)
that reads the ID from the `NEXT_PUBLIC_META_PIXEL_ID` environment variable,
set in the Netlify production context on 2026-09-29. Because the variable is
baked into the client bundle at build time, changing it needs a deploy.

What the site sends once a visitor allows advertising cookies: PageView on
every page and Purchase from the success page (verified against the order,
so refreshes never double-count). Nothing else is instrumented yet; ViewContent
and AddToCart would be additions. Events Manager → Test events shows them
arriving.

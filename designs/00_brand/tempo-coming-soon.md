# Tempo coming-soon view

Owner request, October 7, 2026: Women opens a temporary coming-soon landing
page for The Tempo Collection, then returns to the existing women's page
when the collection is ready.

The existing `/women` route, navigation links, editorial template, catalog
and products are preserved. A server-rendered view uses the existing women's
hero photograph and website typography. The primary action reaches the
existing newsletter form; the secondary action links to `/men`. No release
date or new identity concept is introduced.

## Restore the collection

Set `TEMPO_COLLECTION_COMING_SOON` to `false` in
`src/lib/collection-launch.ts`, then build and deploy. This restores the
original `<Editorial route="women" />` and original Women page metadata.
No navigation changes or product reconstruction are required.

The flag does not switch automatically: launch readiness is an owner decision.
This change covers the women's landing page, not product availability on other routes.

# GOOOL launch verification — 2026-09-25

## Completed in this pass

- Public audit: 40 pages/variants, 36 matching catalog images, 78 mapped variants, 10 redirects and 9 rejection/privacy checks passed. Public gate remains removed. All sampled backdrop regions match #F2F2F2.
- Netlify CLI authorization restored.
- Production authenticated against Apliiq using the existing store's credentials; database reads succeeded.
- Production/functions APLIIQ_SUBMIT_ENABLED set to true. Final deployed runtime verified submissionEnabled=true, liveEnvironmentAllowed=true, supplier authentication successful, and order storage connected.
- Added a protected read-only status action to the existing operator endpoint, with a production/functions secret key. No credentials or customer data returned.
- Fixed receipt names for retired catalog products; prices continue to use the purchase snapshot.
- Matched Apliiq's official wrapped fulfillment callback and original outbound numeric order ID. Retained support for existing flat callbacks and supplier IDs. Ambiguous identifiers are refused. Failed shipment callbacks preserve order status; late shipped callbacks cannot downgrade delivered.
- Supplier addresses now send full country names plus ISO country codes.
- Updated Next.js to 15.5.24, its lint config, Supabase client to 2.50.0, and PostCSS to 8.5.28 with a pinned override; refreshed compatible transitive patches. Both isolated and actual installs reported zero npm advisories.
- Updated the product route for awaited Next.js params and constrained build tracing to the site directory.

## Final production release

- Deploy: 6ab6e0327189d8dfa84df697, published successfully.
- Live browser checkout displayed Black/M Casual Wordmark Tee at $48 + $9.50 shipping = $57.50. No personal/payment data entered and no payment submitted. Returned to the site and removed only the audit-added item; cart restored empty. No browser errors observed.
- Next.js 15 production build passed. An earlier pre-publication attempt encountered a OneDrive cache lock; the generated .next directory was preserved as .next-cache-before-next15-20260925 and the successful retry built a fresh cache.

## Tests

- email-gmail: 29 passed, 0 failed.
- email-http: 36 passed, 0 failed.
- email-smtp: 23 passed, 0 failed.
- fulfillment-gaps: 34 passed, 0 failed.
- integration: 60 passed, 0 failed.
- isolate-nonproduction: 1 passed, 0 failed.
- isolate-test-payment: 1 passed, 0 failed.
- launch-status: 12 passed, 0 failed.
- recovery: 9 passed, 0 failed.

Total: 205 passed, 0 failed. Isolated production build generated all 30 routes and passed types/lint. These tests used a local file order store and local mock providers. They do not prove an actual supplier order, production write, physical shipment or inbox delivery. No live charge, supplier test order or customer email was sent.

## Latest read-only production diagnostic

```json
{
  "checkedAt": "2026-09-25T21:00:38.225Z",
  "httpStatus": 200,
  "supplier": {
    "configured": true,
    "authenticated": true,
    "status": 200
  },
  "submissionEnabled": true,
  "liveEnvironmentAllowed": true,
  "emailProvider": "disabled",
  "orderStorageConnected": true
}
```

## Still requires completion

- Branded order email: no Gmail service-account, SMTP or Resend sending credentials configured. Existing hello@goool.shop mailbox should be connected; no new provider/account created. Google App Password requires owner setup and 2-Step Verification. Do not put passwords into chat.
- A controlled, explicitly authorized paid purchase is still required to verify production order persistence, one supplier acceptance, inbox delivery and later tracking end to end.
- Modern Sport Black/True Royal supplier designs still have earlier artwork. Website v5 artwork is live; replacement supplier-design approval remains unanswered. Do not claim supplier artwork was updated.
- Existing $9.50 shipping rate displays a universal 7–12-business-day estimate, while international copy says 3–5 weeks. Confirm appropriate international rate/estimate.
- Prior legal/tax/sample/inventory limitations in the earlier audit remain; they were not certified here.
- Failed confirmation email has no automatic scheduled retry; original webhook dedupe means replaying the same event does not resend it. Earlier proposed webhook/email retry refactor was not applied.

## Scope preservation

No existing products, supplier designs, images or customer records removed. Satin label remains prepare-only, with no garment assignment or purchase. Deployment uses current local source; remote main was older and was not used to trigger a rebuild.

## Supplier references

- https://help.apliiq.com/portal/en/kb/articles/create-order
- https://help.apliiq.com/portal/en/kb/articles/fulfillment-url
- https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4
- https://support.google.com/accounts/answer/185833?hl=en

## Re-verification — 2026-09-25, late evening (Claude)

- Netlify production env re-listed: `APLIIQ_APP_ID`, `APLIIQ_SHARED_SECRET`, `APLIIQ_SUBMIT_ENABLED=true`, `APLIIQ_ALLOW_LIVE=true`, `FULFILLMENT_OPS_KEY`, Stripe live keys, shipping rate id and Supabase keys all present (values secret-masked). Nothing was added or changed; the keys above were already set in the pass recorded here.
- Live `POST /api/fulfillment-ops {"action":"status"}` on goool.shop returned HTTP 200: supplier configured + authenticated (Apliiq 200), submissionEnabled true, liveEnvironmentAllowed true, orderStorageConnected true, emailProvider **disabled** (unchanged: the branded order email still has no sending credentials).
- Code audit of the order pipeline (checkout -> Stripe -> webhook -> orders store -> Apliiq submit -> email -> success page) found every product for sale resolves a SKU for every colour and size (78 mapped variants incl. the three new Matchday designs). Checkout now also refuses a colourway flagged `comingSoon` server-side (commit b321f4c).
- "Modern Sport Black/True Royal supplier designs still have earlier artwork" is superseded: the product is now Apliiq designs 6136475 Black, 6136494 True Royal, 6136511 White with the v6 back at 5.00 x 1.812 in and the v3 front at 11 x 3.72 in; 6112037 and 6113361 were renamed "delete". See `designs/31_matchday-tee-v6-all-colours-2026-09-25/README.md`.
- Still open, unchanged: order email provider; a controlled paid test order; physical samples.

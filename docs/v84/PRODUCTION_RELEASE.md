# Authorized production release - 2026-10-07

The owner explicitly authorizes immediate deployment of the approved facelift, superseding the prior requirement to complete blocked browser-only acceptance first. Defer those checks transparently; do not bypass saved permissions or claim screenshots/browser acceptance passed. Existing release/access-audit notes describing browser checks as pre-merge blockers are historical and superseded by this direction.

## Included scope

Approved v84 reference design, nine existing Men products, unassigned Women catalog, and homepage order Core Hoodie Red ($78), Terrace Tee Red ($38), Matchday Tee ($38), Touchline Cap ($32). Existing product IDs, prices, variants and fulfillment mappings remain unchanged. Original number artwork is used for kit requests. Both community submission flows and the private intake dashboard are included.

Confirmed hello@goool.shop UUID is allowlisted. Nine INTAKE variables are set functions-only in production and deploy-preview contexts. Private Supabase tables/bucket, scoped uploads, receipts/retries, authorization and cleanup have passed provider API tests. No customer password is recorded. Existing Stripe, Apliiq and Resend environment variables remain configured and untouched.

## Pre-merge evidence

- Fresh clean Next production build, lint/types and 42-page generation passed. Generated OneDrive cache was preserved under a different local name after a readlink error; it is not part of the release.
- Fresh automated suites: 27 v84, nine dashboard, five upload-client, six maintenance, 44 network-disabled commerce regressions, 123 public route/link/asset checks across 32 pages, six fail-closed HTTP checks.
- Protected comparisons: 89 commerce files and 32 approved visual assets unchanged. No diff in checkout, Stripe webhook, Apliiq fulfillment, cart, core product/fulfillment/email modules or catalog data. New migrations are additive intake and the reviewed internal sold-counter privilege restriction; no legacy migration replay.
- Added-text scan found no private-key, Stripe secret, GitHub token, Supabase secret or JWT credential patterns. The only changed tracked environment file is names-only `.env.v84.example`. Netlify's server-side secrets scanner remains enabled.
- Final change scope is v84 UI/assets, required upload/owner integration, tests/docs and pinned dependencies; unrelated original-checkout work is excluded.

## Deferred / limitations

Full desktop/mobile reference/accessibility browser acceptance, browser-to-provider review/edit/receipt workflows, actual owner's private browser sign-in and new deployed screenshots are deferred due denied browser permissions. Prior spot checks are not complete acceptance. Preview test Stripe key is absent; no paid transaction/webhook/real customer email or fulfillment is used as a substitute. Development-tool audit findings and disabled leaked-password protection remain disclosed in IMPLEMENTATION_STATUS.md; security protections were not weakened.

## Publication and recovery

Merge the existing PR #4 on codex/v84-facelift into main through GitHub and let the existing goool-shop Netlify Git workflow publish. Verify production ready and exact merge commit identity before declaring live. Record final merge/deploy IDs and permitted live HTTP/provider checks in the release report.

Immediately before merge, Netlify confirmed current production ready at commit `11b1a2f8182b71785205f2ff6bd2ba537ce52081`, deploy `6abeb64d0b1957000816ba19`. This is the recovery target. If a material published regression occurs, create a corrective Git revert of the release merge (`git revert -m 1 <release-merge>`) and deploy through CI. Do not reset/force-push main, restore an old Netlify snapshot, roll back customer data or replay commerce migrations.

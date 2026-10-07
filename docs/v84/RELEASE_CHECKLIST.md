# V84 release checklist

## Authority and scope

The owner's October 6 release request authorizes completing the verified full facelift, merging into main and deploying through the existing repository-to-Netlify workflow. Do not ask for another deployment approval. Do not publish a partial redesign. Do not modify customer or supplier orders, DNS, existing commerce identities, email triggers or consent behavior.

The latest owner direction identifies the existing GOOOL organization `lhinkmqrxofihbokgjfo` and project `oexibflpshttgzmdvhpr` for intake integration. Direct verification confirms Pro and ACTIVE_HEALTHY. Use additive intake objects only, retain the spend cap, make no additional purchase and do not use Hireonthefly.

## Known-good production

- Site: goool-shop, ID `047c082c-2bc2-42d5-889f-57876fa55b78`.
- Domain: https://goool.shop.
- Production branch: main.
- Verified baseline commit: `11b1a2f8182b71785205f2ff6bd2ba537ce52081`.
- Published deploy: `6abeb64d0b1957000816ba19`.
- Immutable baseline URL: https://6abeb64d0b1957000816ba19--goool-shop.netlify.app.
- Preserve the original dirty checkout and separate checkout-delivery reliability work. Work only in the isolated facelift checkout.

## Gates before merge

- [x] Verify production commit and baseline before modifying production.
- [x] Recheck package manifests: 194 hashes and all 44 manifest assets match.
- [x] Check protected baseline: 89 commerce files and 32 approved public assets unchanged.
- [x] Run local v84, admin, upload and network-disabled backend tests; v84 now includes 26 checks and the bounded-cancellation regression.
- [x] Run six maintenance transport tests without contacting providers.
- [x] Crawl 32 local public pages: 123 route, link and asset checks pass, including all nine product headings and canonical paths.
- [x] Decode and resize the approved hero and ten original print-number assets through patched Sharp 0.35.5.
- [x] Compare nine principal route heading/hero geometry at 390, 768 and 1440 widths without overflow or loaded-image failures. This is not a full pixel or footer comparison.
- [ ] Finish full visual/interaction/accessibility acceptance, including section spacing, footer, narrow mobile, keyboard, touch and reduced motion.
- [x] Owner approved reference-order exact matches Core Hoodie Red and Terrace Tee Red, followed by Matchday Tee and Touchline Cap instead of unavailable leggings/crop tank. Men has nine approved existing products; Women remains unassigned.
- [x] Directly verify the exact GOOOL organization/project IDs supplied by the owner; confirm normal CLI management access.
- [x] Apply only the new additive intake migration; verify service-only privileges, RLS and a private bucket capped at 100 MiB.
- [x] Verify real 100 MiB signed resumable upload, exact size, private download, atomic receipt, wrong-token rejection, idempotency, deletion scrub and fixture cleanup. This is a provider transport/RPC test, not complete browser end-to-end acceptance.
- [ ] Provision hello@goool.shop securely; verify the actual owner UUID, non-owner rejection, refresh and sign-out. Email alone must never confer access.
- [ ] Test actual story, match and kit submissions, durable private uploads, retries, receipts, review/edit retention and all required permissions using isolated data.
- [x] Test actual application API routes against Supabase: all three form kinds, owner/non-owner authorization, HttpOnly/Strict cookies, review/status/notes, signed media, deletion, refresh and sign-out. Disposable fixtures cleaned. Browser-to-provider acceptance, pagination and scheduled maintenance remain separate gates.
- [x] Provider-test owner inbox search, status/kind filters, 50+5 pagination, detail, notes/status, private media and deletion with cleaned disposable fixtures.
- [ ] Verify abandoned-draft cleanup against the provider and the configured schedule.
- [ ] Configure deployment-scoped intake keys, exact origins and maintenance secret. Keep secrets out of Git, browser bundles and reports.
- [ ] Verify checkout/email provider behavior in test mode without live charges, fulfillment or customer emails.
- [x] Verify existing live checkout totals and an unpaid Stripe handoff without customer email, charge or fulfillment; preserve production Stripe configuration. This does not verify a paid webhook or redesigned live checkout.
- [ ] Run final build, types, lint, local fail-closed HTTP checks and regression suites after the last code change.
- [ ] Review full diff and inherited development dependency findings; exclude unrelated changes.

## Deployment and live evidence

- [ ] Push the reviewed isolated branch and merge verified code into main without force pushes.
- [ ] Wait for Netlify production deploy to report ready; record release commit and deploy ID.
- [ ] Confirm the deployed commit exactly matches the release commit.
- [ ] Verify principal pages, mobile navigation, asset loading, cart and checkout handoff on goool.shop without creating unintended transactions.
- [ ] Verify live intake health and owner access without customer data exposure.
- [ ] Capture desktop and mobile evidence of the deployed design.
- [ ] Report verified local checks separately from provider and live checks.

## Recovery

Before merging, record the final release commit and whether main advances through a merge commit or a single commit. On a material live regression, stop further writes and create a corrective Git revert of that release on main, then push through the same Netlify production workflow. Use `git revert -m 1 <merge-commit>` only when the recorded release is a merge commit; otherwise revert the actual release commit(s). Do not reset or force-push main, restore an old deploy through dashboard tooling, roll back database data, delete uploads or replay commerce migrations. Confirm the corrective deploy is ready, matches its commit and restores the known-good interface. Preserve additive intake data for investigation and disable intake through scoped configuration only when needed to contain the regression.

Intake schema/bucket provisioning and global upload-capacity configuration have occurred; the production storefront has not been deployed. Existing commerce objects remain unchanged.

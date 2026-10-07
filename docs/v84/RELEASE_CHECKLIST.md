# V84 release checklist

## Authority and scope

The owner's October 6 release request authorizes completing the verified full facelift, merging into main and deploying through the existing repository-to-Netlify workflow. Do not ask for another deployment approval. Do not publish a partial redesign. Do not modify customer or supplier orders, DNS, existing commerce identities, email triggers or consent behavior.

Separate approval permits a dedicated GOOOL intake Supabase Pro organization with one Micro project at $25/month plus tax. Verify actual checkout, keep spend cap enabled and add no paid extras. Do not use the connected Hireonthefly organization.

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
- [x] Run 25 local v84, nine admin, five upload and 44 network-disabled backend tests.
- [x] Run six maintenance transport tests without contacting providers.
- [x] Crawl 23 local public pages: 114 route, link and asset assertions pass.
- [x] Compare nine principal route heading/hero geometry at 390, 768 and 1440 widths without overflow or loaded-image failures. This is not a full pixel or footer comparison.
- [ ] Finish full visual/interaction/accessibility acceptance, including section spacing, footer, narrow mobile, keyboard, touch and reduced motion.
- [ ] Resolve homepage feature assignment. Men has nine approved existing products; do not invent unavailable concept products for Women.
- [ ] Provision the approved dedicated intake project after the owner completes sign-in; verify billing total before purchase.
- [ ] Apply only new intake migrations to the dedicated project; verify service-only privileges, RLS and private bucket with 100 MiB support.
- [ ] Provision hello@goool.shop securely; verify the actual owner UUID, non-owner rejection, refresh and sign-out. Email alone must never confer access.
- [ ] Test actual story, match and kit submissions, durable private uploads, retries, receipts, review/edit retention and all required permissions using isolated data.
- [ ] Test owner lists, filters, pagination, detail, notes/status, authorized media, deletion and abandoned-draft cleanup.
- [ ] Configure deployment-scoped intake keys, exact origins and maintenance secret. Keep secrets out of Git, browser bundles and reports.
- [ ] Verify checkout/email provider behavior in test mode without live charges, fulfillment or customer emails.
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

No deployment or provider provisioning has occurred at this checkpoint.

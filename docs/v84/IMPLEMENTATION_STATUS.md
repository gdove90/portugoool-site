# V84 implementation checkpoint - 2026-10-05

## Release state

IN PROGRESS. Not a finished staging release, and not approved for production.

Branch: `codex/v84-facelift`, based on deployed `11b1a2f8182b71785205f2ff6bd2ba537ce52081`.
Checkout: `C:/Users/gdove/OneDrive/Desktop/Portugoool/v84-implementation`.
This is a separate shared clone. Its Git object store references the original checkout; do not delete or prune the original repository while this clone depends on it.

No production files, deployments, database schema, storage settings, account billing or credentials were changed. No code has been pushed. The original dirty checkout is excluded.

## Implemented locally

- Approved v84 assets, self-hosted fonts, scoped styles, brand, navigation, search, bag, footer and pointer-depth motion.
- Home, Men, Women, collection, product details, Our World, both community flows, kit configurator, support, FAQ, shipping, references and all three match sample routes.
- Actual nine-product production catalog and existing cart context; real identifiers, prices, variants, availability and checkout payloads. Concept products are not sold.
- Approved story/match/kit controllers, retained previews and edits, mandatory acknowledgments, separate optional marketing/tag choices and server validation.
- Server-side owner authentication with verified Supabase user IDs and HttpOnly cookies. Private inbox/list/detail/review/download/delete API and approved dashboard UI.
- Direct resumable private uploads, scoped upload authorization, signature/content checks, request limits, immutable consent snapshots, atomic completion and retry handling.
- Unapplied SQL proposal with RLS, service-only privileges, transactional intake functions and deletion protection.
- Existing discount workflow kept, with v84 visual treatment and a native modal. Tracking opt-out remains available; original cookie decisions are preserved.
- Existing cart, receipt, tracking and policy screens receive shared typography and restrained controls without changing their commerce handlers or legal text.

## Verified

- Final complete Next production build, lint and types passed, including all 42 generated pages and the nine product pages.
- 23 local v84 checks passed: form rules, 20/100 MiB boundaries, media count, all three acknowledgments, optional tagging, SVG safety, disabled service, SQL roles/RLS, atomic creation, idempotency, expiry and deletion.
- 89 protected baseline files compared unchanged: catalog, cart, checkout, payment, fulfillment, email, existing API handlers and existing migrations.
- 32 approved visual assets compared byte-identical.
- Existing launch-backend regression suite: 44 passed, with external network disabled. Includes all 83 sellable variants, discounts, fulfillment snapshots, webhook retries, email delivery and tracking consent.
- Six local HTTP checks passed in development and production mode: forged admin headers rejected, private files denied anonymously, owner page redirects, cross-origin writes rejected, intake disabled without configuration.
- Browser spot checks at 1440x900 and 390x844: desktop home; kit number/back rendering; story suggestion/sample/edit; mobile Save sample; real product size gating; cart addition, totals and free-shipping threshold; mobile navigation.
- Browser testing found and fixed template fragment nesting, shared-header access, scoped CSS link selectors, font loading, mobile cart minimum widths and local origin normalization.
- Production-mode mobile cart rechecked: content width equals viewport width, no overflowing child elements, all prices/actions visible.

These are local tests. They do not demonstrate a live payment, real email delivery, durable cloud uploads or authenticated owner access. The native browser sandbox did not expose canvas pixel reads; kit number rendering was checked visually.

## Blocking decisions and configuration

1. Confirm Men/Women assignments for the nine real products and the four homepage feature selections. They are deliberately unset in `src/v84/catalog-data.ts`; those grids remain empty. No active leggings/tanks/shorts were invented.
2. Approve a private staging storage/auth destination that supports 100 MiB per clip. The inspected GOOOL Supabase Free project was limited to 50 MB. No upgrade or new paid resource has been authorized. The installed Supabase connector targets an unrelated project and must not be used for GOOOL changes.
3. Supply original number font/vector/high-resolution artwork, or approve a separately reviewed reconstruction. The supplied 94-pixel number strip remains visibly soft when enlarged.
4. Confirm the actual kit garment and material before publishing the reference's recycled-polyester statement or a sizing table. Real product galleries currently have fewer than the six requested production views.

## Still required before finished staging

- Provision isolated private storage and owner auth through the correct project; disable public signup, set exact owner UUIDs and deployment-scoped environment values.
- Review the SQL proposal against that project's schema, generate a real migration using the Supabase CLI, apply only to staging, and verify bucket privacy and permissions.
- Test actual resumable uploads, token renewal, each supported file type, 100 MiB footage, persistence, interrupted retry, double submission, deletion and cleanup. Never substitute mock success screens.
- Authenticate the owner and test the complete inbox workflow and non-owner rejection, refresh/sign-out, status/notes, filtering, pagination and private media access.
- Configure an authenticated schedule for `/api/intake/maintenance`; it deletes expired abandoned drafts/tombstones after a safety window. Tokens expire after 24 hours; cleanup starts after a further day. Deletion immediately scrubs submission personal fields and removes available objects; opaque identifiers remain only for late-upload cleanup.
- Finish the full visual/accessibility/interaction matrix, including all widths, gallery gestures, upload previews, keyboard sorting, popup and dialogs, validation/failure states, metadata and analytics.
- Perform payment/email/fulfillment staging verification using test-only services and blocked live fulfillment. Do not copy production secrets into local previews.
- Address or explicitly accept the seven inherited npm high-severity findings after reviewing their impact. No unrelated major dependency upgrades were made.
- Create the complete deploy preview, collect owner review, then obtain separate explicit approval before any production replacement. Keep the previous production deployment available for rollback.

## Local commands

```powershell
npm ci --ignore-scripts
npm run typecheck
npm run test:v84
node -e "global.fetch=async()=>{throw new Error('Network disabled for regression tests')};require('./scripts/test-launch-backend.cjs')"
npm run build
npm run start -- --hostname 127.0.0.1 --port 3184
# Only against the local unconfigured preview:
npm run test:v84:http
```

`scripts/import-v84.cjs` regenerates trusted reference templates, styles, media, validation and dashboard code from the audited package copy. Keep changes to generated code in that importer. The source package path can be passed as its first argument.

Local production-mode preview: `http://127.0.0.1:3184`, started as hidden detached Node process 24608. This is localhost only, not a deployed staging URL. Intake and owner sign-in remain unconfigured and fail closed.

The discovery plan, product inventory, asset map and 331-row requirement ledger remain in `../output/v84-discovery-2026-10-05/`. The ledger is an acceptance checklist, not a blanket completion claim.

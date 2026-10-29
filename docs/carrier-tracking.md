# GOAL carrier tracking release

Production baseline checked October 29, 2026 (Eastern): `gdove90/portugoool-site`, main
`3b22acc0f8e7c80a16514b4aaaaf498f176de0e4`, Netlify `goool-shop`
(`047c082c-2bc2-42d5-889f-57876fa55b78`), published deploy `6ae2be7286d37eddee8c26be`.
GOAL commerce Supabase URL was independently verified as `https://oexibflpshttgzmdvhpr.supabase.co`.
The org-scoped Supabase connector sees an unrelated project: never use it for this migration.

## Behavior and isolation

The original `/api/track-order` remains byte-for-byte unchanged. After its successful
reference/email lookup, `/track-order` POSTs the same credentials to `/api/track-order-details`.
That route repeats authorization, hides pending orders and reads only cached tracking data.
It never calls EasyPost. Failure, missing migration, missing credentials or a disabled flag
leaves the original result and safe official carrier links usable. Email never enters a URL,
browser storage or external tracking link. Financial/supplier status remains separate.

Each carrier/number is displayed independently, deduplicated across supplier callbacks and
number order changes. No complete-order delivery claim is derived from package scans.
Locations describe the reported event, including label origin, not current GPS position.
Naive carrier timestamps explicitly say the time zone was not supplied. ETA comes only from
the provider. History is bounded to 50 known packages, the current provider snapshot (up to
1,000 scans) and up to 1,000 previously saved scans per package. All saved history remains in
the database. Tracking snapshots over 24 hours since successful synchronization are labeled stale.

New tracking-only tables have RLS enabled and no customer/anonymous grants or policies.
All new SQL functions use invoker permissions and EXECUTE is restricted to service_role.
The server rejects a configured database URL other than the verified GOAL commerce URL.
Only the three exact new API routes were added to the existing gate allowlist. The compiled
MIGRATION_PREVIEW behavior, other gates, redirects, existing workers and schedules are untouched.

## Provider and cost boundary

One provider: EasyPost standalone Tracking API; no label purchase or hosted-page replacement.
Its published basic tracking price was $0.01–$0.03 per shipment when checked. Actual account
eligibility, price and ability to read an existing Apliiq-issued USPS label require owner account
access and explicit authorization for any provider charges. No test-mode result proves live access.
No provider key or tracking configuration was present in the audited Netlify environment.

The Node SDK's published 9.1.0 validator still validates the legacy body-only signature. This
implementation adds no SDK and implements EasyPost's documented v2 procedure: raw-body
HMAC-SHA256 over timestamp + POST + signed path + raw JSON, signature prefix
`hmac-sha256-hex=`, signed RFC2822 timestamp within 60 seconds past / 30 seconds future.
The signed path must be `/api/carrier-tracking-webhook`; register that exact URL without query.
Only tracker.created/tracker.updated events, expected production mode and bounded sanitized
tracker content are accepted. Recipient names, addresses, signatures, payment IDs and raw payloads
are never persisted or returned. Descriptions use sanitized generic scan wording.

## Ingestion, retries and observability

The separate `carrier-tracking` scheduled function runs every ten minutes only when its
build-time operational guard and runtime server flag both allow it. The API requires the new
`x-tracking-ops-key`; it never accepts a customer-supplied tracking number. Production context,
MIGRATION_PREVIEW=false, and all three independent secrets are required for live operation.
Netlify omits CONTEXT from its function runtime, so a missing runtime CONTEXT is accepted
only alongside the production-scoped enabled flag and compiled preview guard; an explicit
nonproduction CONTEXT is refused. The scheduler additionally requires the immutable
operational build marker emitted by the unchanged prebuild script.

Discovery reads live paid orders and success/shipped/delivered shipment rows received within
30 days on orders created within 90 days, most recent first, at most 100 new identities per invocation. Unknown carriers remain
on the official-link fallback when supported. Each normalized carrier/number is unique per
order and environment. Two packages at a time are claimed transactionally with two-minute
leases, bounded backoff, six attempts and a review state. No email/supplier/payment work is
imported or invoked. There is no unbounded historical backfill.

Registration intent is committed before the external POST. On timeout, crash, or response loss,
later attempts only search within bounded creation dates; they never blindly repeat POST.
An unresolved or rejected registration moves to review for an operator. A mapping uniqueness
conflict also stops registration; recycled numbers must be investigated, never reassigned blindly.
Each package stores its order-creation time as a tracking identity boundary. Both worker and
SQL reject a provider tracker created before that order, or offset-bearing scan history from
before it. These cases require operator review; naive timestamps retain their unknown zone.
Registered trackers are reconciled once per day for up to 60 days; provider webhooks drive updates.
The ten-minute discovery schedule does not promise ten-minute carrier scans. Carrier polling
frequency and latency vary.

Inbox receipt and processing completion are transactional. Webhooks arriving before mapping
are retained, consumed at registration completion and checked by a bounded reconciliation
pass on every worker invocation. Duplicate events acknowledge safely. DB failures return 503.
Request-body reads have a 1.5-second deadline and webhook persistence has a 4-second deadline,
leaving time for an acknowledgement within EasyPost's seven-second delivery limit. An aborted
persistence request may have committed; the provider retry is safe through transactional deduplication.
Newer provider updated_at replaces state, including legitimate corrections; stale snapshots
cannot overwrite current status. Event fingerprints are independent of callback array order.

The worker emits only redacted counters (`review`, `pendingRetry`, `stale`, `unmappedWebhooks`)
and fixed registration/webhook/persistence error labels in Netlify function logs. Configure
operator log alerts on nonzero review/unmappedWebhooks, webhook_persistence_failed,
worker_persistence_failed and persistent stale counts. This release adds no customer messages
and does not automatically install an external alert service.

## Release procedure

1. Run `npm run test:carrier-tracking`, typecheck, lint, build and the unchanged preservation
   checks against the captured production commit. Review the new migration and protected hashes.
2. Create a preview with `CONTEXT=deploy-preview` / MIGRATION_PREVIEW enabled. All live APIs
   and workers must refuse operations even if copied secrets exist. Use local isolated mock
   tests for the dynamic tracking UI; preview protection intentionally disables real lookups.
3. In the authenticated GOAL SQL editor, verify project `oexibflpshttgzmdvhpr`, inspect existing
   migration history, and apply only `20261029215205_carrier_tracking.sql`. Confirm four new
   tables have RLS, anon/authenticated lack access, and RPC EXECUTE is service_role only.
   No pre-existing migration or commerce row is modified.
4. Release with CARRIER_TRACKING_ENABLED absent/false. Safe official carrier links work now.
5. Obtain suitable EasyPost account access, verify actual pricing/production entitlement, and
   authorize any standalone registration charge. Set the three new production-only secrets
   using the example file; do not print or paste secrets into chat.
6. Configure EasyPost's production webhook to
   `https://goalathletics.shop/api/carrier-tracking-webhook`, secret and v2 signing before
   registration. While the feature flag is off the endpoint deliberately returns 503; enable
   only after the webhook configuration is saved so provider retries can recover early events.
7. Enable the flag, then run the authenticated ops route once (or wait ten minutes). Prioritize
   the owner's existing recent persisted shipment by reviewing discovery before enabling; no
   customer identifier is hardcoded. Verify its live Apliiq-issued USPS tracker against USPS,
   including label-created versus physical acceptance, and compare the customer cache response.
   No purchase, label creation, fulfillment replay or manual status promotion is permitted.

Missing external credentials or billing authorization blocks activation, not the disabled
release. Keep the distinction explicit in the handoff.

## Disable / revert

Set CARRIER_TRACKING_ENABLED=false in production; worker does no work and details fall back
to safe carrier links. Leave all history tables intact. If code must be reverted, revert only
the tracking change and let the existing Git/Netlify release workflow build it. Never drop
customer history, change existing secrets or alter email/fulfillment schedules.

## Primary sources checked

- https://docs.easypost.com/docs/trackers
- https://docs.easypost.com/guides/tracking-guide
- https://docs.easypost.com/guides/webhooks-guide
- https://support.easypost.com/hc/en-us/articles/39826034964237-Webhook-HMAC-Validation
- https://support.easypost.com/hc/en-us/articles/360044353091-Understanding-Trackers
- https://www.easypost.com/pricing/
- https://raw.githubusercontent.com/EasyPost/easypost-node/v9.1.0/src/utils/util.ts

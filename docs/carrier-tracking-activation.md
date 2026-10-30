# Controlled GOAL carrier tracking activation

Keep `CARRIER_TRACKING_ENABLED` absent/false throughout preparation and the single-shipment
preflight. Credentials alone never start automatic discovery or customer enrichment.

## Independently verified baseline, October 29, 2026 (Eastern)

Production was rechecked at commit `6867721bd7b2c3982eb8081f67c0cb3895f96dd9`, Netlify deploy
`6ae3c4fb5cb2636cd20ecf60`, site `047c082c-2bc2-42d5-889f-57876fa55b78` (`goool-shop`).
The tracking flag and all three dedicated secrets were absent at both site and team scope.
The effective flag was OFF. The commerce URL matched `oexibflpshttgzmdvhpr`.

A fresh authenticated GOAL SQL-editor query, rather than the prior handoff alone, confirmed
four tracking tables with RLS and no customer privileges, ten private invoker functions and
zero package/event/inbox/rate rows. The org-scoped connector was not used for GOAL SQL.
All 21 protected files and 56 original migrations matched their audited hashes. The already
applied tracking migration remains unchanged too. Current schedules were tracking every ten
minutes, email every minute and intake maintenance hourly; none were changed for preflight.

## Account and cost gates

No authenticated EasyPost account or production key was established during the independent
audit. Reaching the public homepage and finding no account emails does not prove an account
does not exist. Public documentation does not prove GOAL's price or entitlement.

Before registration, inspect the actual GOAL account's plan, production access, USPS standalone
tracking entitlement, wallet balance, automatic reload settings and any recurring/minimum fees.
The public Wallet-plan billing article currently lists USPS standalone tracking at $0.03 per
unique tracker, debited daily. It also describes automatic reload funding. A small tracker fee
must not indirectly trigger wallet funding, which this task does not authorize. Do not fund
a wallet, enroll a plan/subscription, add a payment method or accept binding account terms.

Read-only references:

- https://support.easypost.com/hc/en-us/articles/360042414212-Billing-Payments
- https://support.easypost.com/hc/en-us/articles/360004588571-API-Keys
- https://docs.easypost.com/guides/tracking-guide
- https://support.easypost.com/hc/en-us/articles/39826034964237-Webhook-HMAC-Validation

The current HMAC article specifies v2; the generic webhook guide still mentions the older
header. Verify the actual production delivery supports timestamp/path/body v2 signing. Do not
remove replay protection or fall back to body-only HMAC to make an account appear verified.

## Preparation

1. Review/test the preflight change and apply only the new tracking migration
   `20261029235556_carrier_tracking_preflight.sql` on verified GOAL. It adds a nullable enrollment
   expiry to tracking packages and two service-role-only invoker RPCs. It does not change
   commerce tables, existing policies/functions, source histories, schedules or notifications.
2. Securely configure `EASYPOST_API_KEY`, `EASYPOST_WEBHOOK_SECRET`, and
   `CARRIER_TRACKING_OPS_KEY` in Netlify **production / functions** scope. Mark secrets as secret;
   the operations key must have at least 32 characters. Preserve all existing values. Use
   dedicated secrets, never fulfillment/email secrets. Do not put them in chat, source, public
   fixtures, browser storage or `NEXT_PUBLIC_*` variables. Deploy changed values as required.
3. Configure `https://goalathletics.shop/api/carrier-tracking-webhook` in the production account
   with the matching dedicated secret and exact v2 signed path. Configure before any registration.
4. Securely select one owner-authorized existing Apliiq-issued USPS shipment from persisted
   `order_shipments`. The preflight request uses its internal shipment UUID and zero-based
   tracking-number index; it accepts no arbitrary carrier, tracking number or URL. Do not place
   customer identifiers in public reports, commands committed to Git or screenshots to share.

## One-package preflight while OFF

Use the existing POST `/api/carrier-tracking-ops` with the dedicated `x-tracking-ops-key`.
The private operator body is:

```json
{
  "action": "preflight",
  "shipmentId": "<securely selected existing shipment UUID>",
  "trackingIndex": 0,
  "allowRegistration": false
}
```

The default searches/reuses an existing provider tracker and reads its production data. A new
tracker is never created when `allowRegistration` is absent/false. If none exists, the redacted
result says `authorization_required`; the temporary lease is released without consuming an
attempt. Present the actual verified account charge and obtain human authorization before
an operator sends `allowRegistration:true`. That single explicit request can POST only once,
after committing registration intent. A timeout/ambiguous outcome returns
`registrationAttempted:true`; later requests search/read only and cannot POST again.

The target RPC derives order, carrier and number from the persisted row. It enforces a live
paid order created within 90 days, a recent eligible shipment, USPS, index bounds, no live lease
or review state, and one active target across all preflights. The enrollment lasts 24 hours.
Existing tracker IDs and registration-intent markers are preserved. The usual order-window,
recycled-number, mode and identity checks apply before attaching any history.

While OFF, a valid signed webhook can reach only that enrolled package. Early mapping events
are durably retained in the existing inbox and reconciled by the existing finish transaction.
Unenrolled, expired, foreign or invalid events cannot update other orders while OFF. A bodyless
scheduled operations request still does nothing until the global flag is enabled. Previews
remain blocked at build and middleware level even with copied credentials.

Results contain only redacted state/counts/booleans. `verified` requires matching production
data; `awaiting_carrier_data` distinguishes an empty unknown/error tracker from real carrier
access. In either case, durable mapping prevents repeated creation. A label-created state can
be valid carrier information, but it does not prove carrier possession. Independently compare
actual carrier data and verify an actual signed event appears in the inbox and stored history.
Synthetic tests and manually fabricated scans do not count as production proof.

## Activation and validation

Only after the preflight passes, inspect bounded eligible discovery counts and obtain human
authorization for ongoing registration charges and the intended scope (recent live paid
shipments, 30-day shipment lookback, 90-day order window). Then set the global flag true only
in production and deploy. The existing worker registers at most two claimed packages per run;
do not replay supplier callbacks or enable discovery merely to test provider access.

Verify the actual signed delivery, persistence, original reference/email lookup, real package
history, official carrier link, mobile rendering and unavailable-provider fallback. Leave the
flag OFF if access, actual charges, signature support or history cannot be proven. Record
implemented/deployed/activated states separately, with redacted evidence and exact identifiers.

To roll back, set `CARRIER_TRACKING_ENABLED=false` and deploy. Automatic registration and
customer enrichment stop. The one explicitly enrolled package may retain valid callbacks
until its 24-hour enrollment expires; this never registers packages or sends notifications.
Keep tracking tables/history and all fulfillment/email secrets and schedules intact.

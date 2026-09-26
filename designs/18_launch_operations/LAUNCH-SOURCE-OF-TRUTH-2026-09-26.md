# GOOOL launch backend — 26 September 2026

The approved promotion cards and popups are unchanged.

| Responsibility | Authority |
|---|---|
| Offered products, prices, sizes and colors | `src/lib/products.ts` |
| Variant-to-supplier mapping | `src/lib/fulfillment.ts` |
| Checkout pricing and purchase snapshot | One validated loop in `api/checkout` |
| Whether a payment succeeded | Signed Stripe webhook |
| What an order fulfills | Persisted order/item snapshot |
| Subscriber consent and marketing audience | Existing Mailchimp audience |
| First-order discount issuance | Stripe promotion code + mode-isolated `discount_codes` ledger |
| Transactional email intent and delivery | `email_deliveries` |
| Transactional transport | Resend; `GOOOL <hello@goool.shop>` |
| Support replies and incoming email | Existing Google Workspace inbox |

No Gmail/SMTP fallback exists in production code. Failed sends retain their delivery ID. One scheduled worker calls the authenticated delivery endpoint every minute, sending at most three queued messages per invocation. The database claim prevents concurrent workers from sending the same job. Resend receives the same idempotency key on each retry. Ambiguous jobs older than 23 hours are parked for provider reconciliation, before Resend's 24-hour deduplication window expires. `sent` means provider acceptance, not confirmed inbox delivery.

Order confirmations are queued before a Stripe event is recorded. Queue persistence errors remain retryable; provider errors do not replay fulfillment. Replaying a completed payment repairs missing email intent without repeating fulfillment. The authenticated ops action `retry-confirmation` queues an unsent paid order. `deliver-emails` processes due messages for the configured Stripe mode. Test-mode jobs cannot be selected by the live worker.

The discount API returns success only after a usable code and durable delivery intent exist. It returns a retryable error when issuance or queuing fails. Repeated requests retain one code and one email. Unsubscribed Mailchimp contacts are not silently re-subscribed or reported as subscribed. No marketing campaigns are activated by these code changes.

Email delivery configuration: production `RESEND_API_KEY`, restricted to sending on goool.shop, and existing function-scoped `FULFILLMENT_OPS_KEY`. Do not put either key in client code or committed files. Google Workspace MX and existing Mailchimp/Google DNS records remain intact; separate Resend verification records are added.

Shipping remains USD 9.50. The replacement Stripe rate removes a misleading universal US delivery estimate; existing country-specific checkout wording continues to state US 7–12 business days and international 3–5 weeks. Taxes remain an owner/account configuration decision, not silently enabled by this release.

Validation so far: production build/type checks passed; 24 regression cases passed, covering all 83 sellable variants. Live database migration applied; anonymous queue/report/function access denied. Real atomic claim and duplicate-claim checks passed inside a rolled-back transaction. No paid order or real test email has yet been sent in this repair session.

Deployed as 2b2a307 on 2026-09-26 (Netlify 6ab8202360b9dc00085bb6f9). Both official Resend simulator deliveries passed, once each, via the scheduled worker. All nine live checkout tests passed and were expired. Real inbox placement and a paid-order rehearsal remain unverified; Free capacity is 100 emails/day. See LAUNCH-REPAIR-VERDICT-2026-09-26.md for the release boundary.

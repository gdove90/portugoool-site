# GOOOL launch repair verdict — 26 September 2026

The audited backend defects are repaired and deployed. Production is running commit `2b2a3075c276c59138d89b3ed4578dc8b2fd46d7`, Netlify deploy `6ab8202360b9dc00085bb6f9`.

## Verified

- Production build, type checking and 24 regression cases pass. All 83 sellable variants have consistent server pricing and fulfillment snapshots.
- All nine product rows create valid LIVE Stripe Checkouts with correct prices, promotion entry, USD 9.50 shipping and canonical return URLs. All nine audit sessions were expired; no payments were made.
- Malformed cart lines return HTTP 400; unauthorized operator requests return HTTP 401.
- Resend is the sole transactional sender, using a production-only, Functions-only secret and a send-only key restricted to goool.shop. Sending domain verified. Google Workspace retains incoming support email.
- Scheduled production worker exists and runs every minute. Two messages sent to Resend's official simulation addresses reached simulated delivered status. Database records one attempt and one provider acceptance for each. This is not a real inbox test.
- Discount codes are durably queued for email, repeated requests share one delivery identity, expired codes renew safely, and test/live ledgers are isolated. Failures do not claim that an unqueued email is coming.
- Failed order-email intent can recover through Stripe replay or authenticated operations without repeating fulfillment. Discount totals appear on confirmations.
- Anonymous access to the discount-repeat view and email queue/claim function is denied. Atomic first-claim and duplicate-claim tests passed in a rolled-back database transaction.
- One active LIVE shipping rate remains, at USD 9.50, without the misleading US-only universal estimate. Nine new checkouts confirmed use of the replacement before the old rate was retired.
- One enabled LIVE Stripe webhook remains. The older of two identical TEST webhooks was disabled; one enabled TEST endpoint remains.
- Existing Mailchimp welcome and launch campaigns are drafts. Automations showed the initial setup screen, not a running welcome flow. No campaigns were sent or activated.
- Promotion cards, popups and frontend presentation files were not modified.

## Remaining release checks and limits

- No controlled real paid order has yet proved the complete Stripe → stored order → supplier acceptance → tracking path. Supplier authentication and release gates pass; that is not a paid-order rehearsal.
- Owner-inbox tests to hello@goool.shop await the pending answer. Provider simulator delivery proves transport, not inbox placement or the complete signup/customer journey.
- Resend Free currently allows 100 transactional emails/day and 3,000/month; the two simulator messages consumed two. Signup codes and order confirmations share this capacity. A larger launch needs an approved capacity upgrade.
- Stripe automatic tax remains OFF. Tax configuration requires the business owner's determination; this repair does not establish tax obligations or enable collection.
- Physical sample, label and landed-cost approvals were not part of this backend repair and have not been newly verified.

Technical verdict: the repaired backend is live and passing its verified tests. Do not describe the entire launch as completely proven until the paid-order and real-inbox checks are completed and expected email volume fits the plan.

The canonical implementation map is `designs/18_launch_operations/LAUNCH-SOURCE-OF-TRUTH-2026-09-26.md` in the GOOOL repository. Tests: `node scripts/test-launch-backend.cjs`.

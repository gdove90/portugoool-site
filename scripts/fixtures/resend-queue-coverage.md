# Offline queued receipt regression tests

The historical SMTP and Gmail filenames remain in the 35-script inventory. Their
assertions now cover the supported Resend receipt path rather than removed adapters.

Run from the repository root, with the existing project dependencies installed:

```text
node scripts/test-order-email-smtp.mjs
node scripts/test-order-email-gmail-sa.mjs
```

No server or positional arguments are needed. Historical loopback arguments are
ignored for runner compatibility. Expected results are 15 queued-receipt checks
and 16 Resend isolation checks. Any failed assertion exits nonzero.

`resend-queue-harness.cjs` loads the unchanged TypeScript webhook, receipt template,
delivery worker and email transport using the existing TypeScript dependency.
It supplies a fixed clock, fresh in-memory order/queue persistence, isolated dummy
environment values, mock Stripe signature/receipt responses and captured `fetch`.
It never reads `.env` files, starts Next, opens a network socket, writes order data
to disk or sends a real email. Unknown module dependencies fail closed.

The queued-receipt suite checks payment timing, queue persistence failure and replay,
snapshot quantities/prices/totals, escaping, receipt wording, sender/reply identity,
one-send behavior, rejection/backoff, ambiguous results, disabled configuration and
delivery-result persistence failures. The provider suite checks removed adapter
isolation, payloads, invalid recipients, idempotency, endpoint restrictions, errors,
live/test separation, bounded drains, leases, retry-window parking and consent.

The memory adapter models the database uniqueness and atomic claim contract. These
tests validate application behavior against that contract; they do not replace
real Postgres migration, locking or provider-authentication verification. No real
supplier, Stripe, Supabase or Resend account is used.

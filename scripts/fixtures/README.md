# Local HTTP commerce fixture

These helpers exercise the real Next API routes with disposable records and loopback provider substitutes. They do not authenticate real Stripe, Supabase, APLIIQ or Resend accounts.

Use three terminals in the repository:
1. `node scripts/fixtures/postgrest-local.cjs`
2. `pwsh -File scripts/fixtures/start-local-commerce.ps1 -OrdersDir C:/path/to/a/fresh/fixture-directory`
3. Set `STORE_DIR` to that same fresh path, then run `node scripts/test-integration.mjs http://127.0.0.1:3040`.

The test owns an APLIIQ simulator on port 4242. PostgREST/Stripe receipt stubs use port 4243. The preload routes Stripe receipt requests to loopback and blocks other external HTTPS/fetch destinations. Resend is disabled. The queue substitute models persistence calls, not real Postgres leases; the SQL and backend suites cover those separately. Never supply real credentials or run this against production. Stop all three processes after testing. Keep fixture records outside source control.

The reconciliation cases assert that an empty supplier listing stays parked. Only an explicit authenticated fixture-operator release may enable a single retry. This does not authorize releasing a live order.

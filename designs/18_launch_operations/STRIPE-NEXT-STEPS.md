# Stripe is connected in TEST mode; live launch is not ready

Fresh check 2026-09-21: the local test key belongs to account acct_1UHzc3BtaM9tSdZu with business website goool.shop. Enabled test endpoint /api/stripe-webhook handles the three checkout events. The deployed route returned HTTP200 and created a Stripe test Checkout Session for the $38 casual tee plus $9.50 TEST shipping. Stripe readback confirmed livemode=false, unpaid, open, total 4750 cents. No card was charged and no supplier order was created. See STRIPE-PREFLIGHT-RESULT.json.

The account response through the test key reports charges_enabled=false, payouts_enabled=false and details_submitted=false. Confirm live dashboard onboarding and complete the company's required verification/bank steps directly in Stripe. This response does not certify the current live account's complete checklist. [Stripe account setup](https://docs.stripe.com/get-started/account/set-up).

Production Netlify configuration contains Stripe secret/webhook keys, shipping-rate ID, test-mode flag, Supabase URL/anon/service-role settings with function scope where needed. Values were not printed. Presence is not proof that all values/modes are correct.

Supabase project oexibflpshttgzmdvhpr is reachable through management metadata, but SQL/migration inspection fails with password authentication errors from the connector. Restore the connection or use the authenticated SQL editor and run LAUNCH-DB-CHECK.sql. Do not change the other Supabase project. Do not infer migrations are missing from an authentication error.

Once schema is verified, complete an actual controlled Stripe test-card checkout and prove webhook→order snapshot→success page→tracking, including duplicate-event handling and disabled real fulfillment. Test-session creation alone is not this proof. [Stripe testing](https://docs.stripe.com/testing).

Then configure separate live key, live webhook signing secret and live shipping rate in production function context. Existing $9.50 shipping is a placeholder. Remove the test exception and verify mode matching; retain per-product release gates until prices, samples and imagery are approved. Do not expose credentials in chat, logs, screenshots or Git. Reuse existing endpoints where appropriate; no blind account reset.

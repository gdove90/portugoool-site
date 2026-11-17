# Command Center live presence
Lead writer: Codex, current Command Center chat. Reviewer: read-only; no parallel implementation agents.
Base: origin/main dfa0bdb. Owner authorization: November 16, parity with Dove admin live analytics, deploy now, preserve existing behavior.
Writable: public/cc-presence.js, netlify/functions/cc-presence.mjs, existing analytics component (lifecycle hook only), this record.
Protected: all business UI, auth, commerce, customer data, catalogs, pricing, artwork, supplier and payment behavior.
No visible layout change, including LocalChef /customer. Presence follows existing consent and privacy choices.

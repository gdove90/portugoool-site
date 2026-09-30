# Welcome sequence (2026-09-29)

Branch `email/welcome-sequence`, commit on top of main `72baa1e`. BUILD
only, NOT deployed. Production still runs the old sign-up path
(Mailchimp subscribe plus the old code email) until the owner says deploy.

## What was built

Three Resend emails for every popup sign-up, copy final per the owner
brief. Email 1 at sign-up, Email 2 at +120 h, Email 3 at +288 h. Emails
2 and 3 stop when the GOOOL20 code is redeemed (same `redeemed_at` the
checkout webhook writes), when the code has expired, or when the person
unsubscribes. Footer sign-ups get a row and an Audience entry, no code,
no emails.

| Piece | File |
|---|---|
| List of record | Supabase `newsletter_signups`, migration `supabase/migrations/0038_newsletter_signups_welcome.sql` (applied 2026-09-29) |
| Sign-up store + Resend Audience "goool" | `src/lib/signups.ts` |
| Welcome pass (Emails 2 and 3) | `src/lib/welcome.ts` |
| Templates | `src/lib/emails/footer.ts`, `welcome-1.ts`, `welcome-2.ts`, `welcome-3.ts` (HTML + text) |
| Popup sign-up | `src/app/api/discount/route.ts` (row, Audience, code as before, Email 1 queued and pushed once) |
| Footer sign-up | `src/app/api/newsletter/route.ts` (row, Audience, nothing else) |
| Unsubscribe | `src/app/unsubscribe/[token]/route.ts` (GET link and POST one-click, plain page) |
| Scheduler | `netlify/functions/deliver-emails.mts` sets `welcome: true` at minute 0; `src/app/api/fulfillment-ops/route.ts` runs the pass (`deliver-emails` with the flag, or `welcome-pass` on demand) |
| Sender | `src/lib/email.ts`: "Goool Athletics <hello@goool.shop>", forwards List-Unsubscribe headers |
| Removed | `src/lib/mailchimp.ts`, `src/lib/emails/discount-code.ts` (EMAIL_RE moved to signups.ts) |

Design decisions inside the brief's limits:

- `unsubscribe_token uuid` is one column beyond the listed set. It is the
  only thing in the unsubscribe URL, so no address or hash leaves the
  server and the link cannot be forged without a new shared secret.
- The pass writes `sent_at_emailN` as soon as the queue row is created;
  the queue key `welcome/<mode>/<step>/<row id>` is unique per row and
  step, so a re-run cannot double-send even if one write is lost.
- A popup sign-up from an address that was only a footer or import row
  turns it into a popup row with a fresh clock; a repeat popup sign-up
  keeps its clock. Any fresh sign-up clears an earlier unsubscribe.
- Email 2 links to the Matchday performance tee
  (`goool-athletics-modern-sport-performance-tee`), never the Core Badge
  Tee. Its gate is one boolean read from that product record:
  `blank === "BC3413"` (Bella + Canvas 3413) and live. The Matchday tee
  carries `blank: "ST720"` today, so the gate reads false against the live
  catalog and the pass writes nothing for Email 2 (`email2_gate_closed`).
  It flips in the same commit that swaps the blank. (Owner decision
  2026-09-29, second pass.)
- The cart has no code query parameter, so Email 1 and Email 3 buttons go
  to /shop.
- `MAILING_STREET` in footer.ts was filled with 242 Earle Dr from the
  business address on the owner's own Mailchimp account record. Confirm
  before deploy.

## Import

Mailchimp audience 8db4c1ea41 had 8 contacts (all subscribed). All 8
were inserted into `newsletter_signups` with `source = import`,
`imported = true` (`supabase-import-8-rows-5-with-code.jpg`): 5 of them
match a `discount_codes` row by hash. The two Mailchimp drafts
("Welcome · You're in", "Launch · The door is open") were deleted; the
campaigns list is empty. The Resend Audience side of the import is NOT
done (see blocked items).

## Verification

- Domain: goool.shop Verified in Resend; DKIM `resend._domainkey` and
  the `send.goool.shop` SPF/MX records resolve; DMARC `p=none` (kept).
- Suite `node scripts/test-launch-backend.cjs`: 33/33. New cases: footer
  has the address and unsubscribe link; popup sign-up writes a popup row,
  adds to the Audience, queues Email 1 with the code as the first text
  line and pushes it once; footer sign-up writes a footer row, adds to
  the Audience, sends nothing; forced clock at 121 h sends Email 2 with
  "9 more days" and List-Unsubscribe headers, re-run sends nothing; 289 h
  sends Email 3, re-run sends nothing; no Email 2 when redeemed, when
  unsubscribed, or when the tee is not live; unsubscribe route sets the
  flag once, removes the address from the Audience, 404 on bad tokens;
  sendEmail forwards the headers and the new sender name.
- 375 px renders of all three (`renders-375px-top.jpg`,
  `renders-375px-bottom.jpg`), HTML and text alternatives in this folder.

## Verify pass, second attempt (same day)

The two follow-up changes were made and pass the suite (33/33): Email 2
link moved to the Matchday tee; the 3413 gate added (`src/lib/types.ts`
`blank?`, `src/lib/products.ts` Matchday `blank: "ST720"`,
`src/lib/welcome.ts` `TRIBLEND_BLANK` / `email2GateOpen()`). Gate against
the live catalog: `live true | blank ST720 | gate open: false`
(`tmp/gate-check.cjs`). The real-send run (Audience import, Email 1 in
60 s, forced Emails 2 and 3, unsubscribe round trip, mail-tester) did not
run: `.env.local` still has none of `RESEND_API_KEY`,
`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Netlify has all
three). Renders in this folder were regenerated with the Matchday image
and link.

## Blocked on this machine

`.env.local` has no `RESEND_API_KEY` (the brief said it was there) and no
`NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`. Without them:
no real Email 1 within 60 s from a local sign-up, no mail-tester scores,
no Resend Audience created or filled (8 imported contacts still to add),
no real unsubscribe round trip against Resend. Everything above those
lines was proven with the in-memory store and the real templates. Add the
two Resend and Supabase variables locally and rerun the verification.

## Rollback

Not deployed: nothing to roll back on the site. Migration 0038 only adds
columns and indexes to a table nothing in production writes to; the 8
imported rows can be removed with
`delete from public.newsletter_signups where imported;`.

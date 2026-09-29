# Email templates

Claude Design handoffs for the transactional emails, kept here as the visual
reference. The site does not read these files: each email is built in code in
`src/lib/emails/*.ts` (table layout, inline styles, dark receipt styling), and
the builder is written to match the file here line for line.

| Template | Reference | Builder | Trigger |
|---|---|---|---|
| Order delay notice | `order-delay-notice.html` / `.txt` (Claude Design, goool (12).zip, 2026-09-29) | `src/lib/emails/order-delay-notice.ts` | a paid order parks at the supplier (`failed` / `needs_reconcile`), same moment as the owner alert |

Copy rules for every template: truthful, short, no invented reason, no promised
date, no supplier name, no "football", no made-to-order language, no em dashes.
Placeholders in the reference files are `{{first_name}}` and `{{reference}}`.

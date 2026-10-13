# GOAL Athletics V1.3 customer-email rebrand — staged release
Last reviewed: October 13, 2026.

## Scope
The existing Next.js application generates order, shipment, delay and welcome emails directly and uses one Resend transport with the same Supabase delivery ledger. The connected Resend account has **zero hosted templates**, **zero broadcasts**, **zero automations**, and **one existing audience segment**. Do not create parallel live email flows or migrate historical recipients.

### Verified current Resend state (read-only)
- `goalathletics.shop`: verified, sending enabled, receiving disabled
- `goool.shop`: verified, sending enabled, receiving disabled
- Existing Netlify `RESEND_API_KEY` in Functions context; never rotate it for rebranding.

## Approved customer email identity
- Display name: **GOAL Athletics**
- Outbound only: `hello@goalathletics.shop`
- Customer support and Reply-To: `support@goalathletics.com`
- Canonical website: `https://goalathletics.shop`
- Mailing address: **PO Box 19, Saunderstown, RI 02874** (mailing only, not a returns address)
- Registered seller display: retain **GOOOL Athletics LLC** until independently confirmed changed.
- Preserve pre-rebrand `GOOOL-` order-reference prefix and all historical order records.
- Approved V1.3 artwork: rasterized from `public/brand/goal-athletics-horizontal-lockup-white.svg`, and staged as email-safe `public/brand/goal-athletics-email-lockup-white.png`.

## Safety and go-live checklist
- [ ] Confirm `support@goalathletics.com` is provisioned as a real receiving mailbox or alias on its email host and can send a human response.
- [ ] Send a controlled test from the verified sending domain **to the support inbox** and confirm an actual reply lands there, without using `hello@goalathletics.shop` as a reply destination.
- [ ] Test real Resend deliverability and DKIM/SPF/DMARC alignment for the new From identity. Existing domain verification alone does not prove inbox placement.
- [ ] Validate the PNG file is accessible as `https://goalathletics.shop/brand/goal-athletics-email-lockup-white.png` after staging deployment.
- [ ] Run `node scripts/test-goal-email-identity.cjs`, `npm run typecheck`, `npm run build`, and existing email regression tests.
- [ ] Preview HTML and plain-text order, shipment, delay, welcome 1–3 and owner-alert messages on mobile and in Gmail/Outlook/Apple Mail.
- [ ] Verify correct site links, physical mailing address, refund directions, unsubscribe URLs and one-click unsubscribe handling.
- [ ] Confirm scheduled retry worker and Supabase idempotency keys remain untouched; do not requeue previously sent emails.
- [ ] Verify the historic internal fulfillment alert inbox is still monitored; its recipient remains `hello@goool.shop` until support routing is independently validated.
- [ ] Obtain owner approval before merging and publishing the production change.

## Intentionally preserved
No Stripe/checkout/order/product/SKU/fulfillment provider changes. No email API key/Netlify environment changes. No Resend domain removals, no new audience, no blast sends, no scheduled automation, no artificial order recreation. Historic promos, `GOOOL20` redemption IDs and existing unsubscribe records remain valid.

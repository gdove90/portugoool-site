# GOAL Athletics email readiness — corrected staged release
Reviewed October 13, 2026. Consolidated draft PR #39 includes PR #36 without discarding either history. Production sender remains unchanged until approval.

## Official configuration
From: GOAL Athletics <hello@goalathletics.shop> (outbound only).
Reply-To and every customer support link: support@goalathletics.shop.
Website: https://goalathletics.shop.
Mailing address: PO Box 19, Saunderstown, RI 02874 (not a returns address).
Registered seller: GOOOL Athletics LLC while the amendment is pending.

## Verified
- Entire tracked staging tree scanned for the unowned domain; regression blocks recurrence.
- Transport forces the shared support Reply-To even when callers supply an obsolete override.
- External owner test already received in the existing Workspace inbox at support@goalathletics.shop, October 13 at 8:52 AM; recipient details and Inbox placement inspected. No new email sent.
- Public DNS: Google MX smtp.google.com priority 1, Workspace SPF, Google DKIM key, Resend DKIM key and Forge CNAME, DMARC quarantine published.
- Existing Resend account: both current and legacy domains verified; no hosted templates, broadcasts or automations; existing audience preserved. Receiving in Resend is disabled because Workspace receives mail.
- V1.3 email PNG exported directly from GAMonogram and BrandWordmark component paths (three GA paths and thirteen outlined letters), 2254 by 544. Apparel V1.2 and supplier artwork preserved.
- White outer email canvas, black central writing panel. Four active previews: requested discount code, receipt, shipment and delay. No product upsells or automatic day-five/day-twelve promotion. Existing queue records are retained; promotional entries refused before send.
- Typecheck, identity and routing tests, 27 v84 checks, 9 shipment checks and six non-transactional payment preservation checks passed. Mock backend suite passed after updating isolated closure fixtures and replacing obsolete promotional expectations; no real Checkout Sessions, provider requests or fulfillment were created.
- Idempotency identities, queue schema, discount redemption codes, legacy order IDs, operational inboxes and supplier integrations preserved.

## Outstanding before production approval
- Gmail signature artwork upload requires Chrome extension file URL permission. New signature draft is being prepared; defaults have not been switched until artwork is installed and verified.
- Deploy-preview build passed at 9623f55; both hosted PNGs returned HTTP 200 with bytes matching local V1.3 exports. The domain regression now runs before every build. Receipt desktop/mobile browser previews verified; real mail-client tests remain unverified.
- Canonical email PNG becomes available on production only after approved release; preview availability alone is not production publication.
- New-template real Gmail/Outlook/Apple Mail delivery and rendering are unverified. Previous approved Resend owner test authenticated SPF/DKIM/DMARC but had spam placement; do not mark inbox delivery passed. No new send authorized.
- Human outbound response from support alias is not newly tested. Existing external inbound test is verified.
- Owner approval required before merge, production sender activation, deployment or any live test send.

## Rollback
Before approved release record production SHA and deploy ID. Revert the email PR and redeploy that known good version; do not edit database or replay queues. Old operational mailbox, domain authentication, audience, legal identity, order references and supplier URLs remain available. Gmail old signatures are retained so defaults can be restored without losing their original content. No credentials, DNS, Resend configuration, payments or records are changed by this draft.

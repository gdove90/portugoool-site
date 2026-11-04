# Core Sweatpant: paid order to Tapstitch

Owner request: `135218e7-a503-47c5-ab42-9fd7ff626ad8`. Four colors at $38, immediately before the raincoat. Preserve the approved galleries and all other product decisions.

## Saved designs and size identity

| Site color | Supplier color | Saved design ID | Ordering product page ID |
| --- | --- | --- | --- |
| Black | Black | 1567484017748627456 | 1567486704926019584 |
| Haze Blue | Haze Blue | 1567487271354122240 | 1567487271568105472 |
| Oat | Apricot | 1567489152965033984 | 1567489153183207424 |
| Flower Gray | Flower Gray | 1567491247352987648 | 1567491247541817344 |

All four are saved UB0050 designs, DTF front only, 3.00 × 3.00 inches on the wearer's left thigh, 400 DPI in the editor, blank back. Supplier sizes S/M/L/XL/2XL map to site S/M/L/XL/XXL. The current displayed unit quote is $18.99 plus $1.99 print. Landed costs and contribution margin remain unknown.

`TAP-<saved-design-ID>-<site-size>` is the immutable internal routing reference carried by Stripe metadata and persisted with each order line. It is not a genuine supplier API SKU. The saved design ID and product-page ID are distinct. A deleted pre-Halo product URL must never replace one of these current saved designs.

Source verification used the authenticated Designs list and each saved editor. Both uploaded Halo asset thumbnails preserve an alpha channel, with 81.1% fully transparent pixels. The editor's automatic background warning was reviewed against the transparent assets and supplier garment previews; no background removal or artwork changes were made.

## Payment and durable task

1. Checkout derives the $38 price and exact design/size reference on the server. Oat remains the customer label; the saved supplier design is Apricot. Existing $6.95 shipping and free shipping at $70 after discounts remain unchanged.
2. A verified Stripe paid webhook writes the immutable purchase snapshot. A null Apliiq product ID is valid for a well-formed Tapstitch reference. Delayed payments wait for payment success.
3. The site persists an owner task in the existing private email delivery ledger. A storage failure leaves the webhook event retryable. Email delivery failures remain in the normal retry queue. One task identity survives duplicate events and later Apliiq attempts.
4. Tapstitch-only orders stay paid, unfulfilled and not submitted to Apliiq. They do not trigger a customer delay email. Mixed orders queue the manual task and send only Apliiq lines to Apliiq under its unchanged submission gate.

## Operator: Gary Dove

1. Open the paid Stripe payment and the private owner task. Reconcile the GOAL order reference, Stripe session/payment ID, quantity, shipping address and every design/color/size line. Never infer payment from the customer success redirect.
2. Before ordering, check the payment metadata `tapstitch_order_id` and the Tapstitch Orders list. Only one operator places this supplier order. If a supplier order already exists, reconcile it rather than placing another.
3. Open each exact saved ordering page linked in the task. Select its verified supplier size; site XXL is 2XL. Select the exact supplier color, including Apricot for Oat. Use the saved Halo design without changing the artwork. Group this Stripe order's Tapstitch lines in one supplier order when possible.
4. Place the supplier order once. Immediately record its ID on the private Stripe payment metadata as `tapstitch_order_id` and the GOAL reference as `goal_order_ref`; retain the supplier receipt. For multiple supplier orders use a clearly recorded list of their IDs. If checkout times out or the result is uncertain, inspect supplier orders/payment records before retrying. Do not charge the customer again.
5. At dispatch, use the existing authenticated `manual-shipped` operation with the GOAL order ID, actual carrier, tracking number(s) and HTTPS tracking URL(s). It records a deduplicated shipment and queues the normal customer shipment notice. Reconcile all parcels for mixed orders; do not assume one parcel contains all items.
6. Daily missed-alert fallback: compare successful Stripe payments containing `TAP-` references with the site's private orders/task ledger and the Tapstitch Orders list. Check pending/needs-review notifications, missing supplier order IDs and unfulfilled paid orders. Reconcile first; never blindly replay a charge, supplier order or ambiguous email.

Real supplier placement, real customer email, a paid transaction and historical order repair were not performed as tests. The operator steps above describe the normal fulfillment work required after a customer pays.

## Release checks

`npm run test:halo-checkout` exercises all 20 references through Checkout, signed webhook, real local PostgreSQL constraints and manual handoff. It covers duplicates, forced concurrent line repairs, repeated identical lines, missing task storage, delayed payments, invalid snapshots, Apliiq-disabled operation, mixed routing, pricing/discounts, owner task content and shipment deduplication. Providers are captured fixtures. Both the old null-ID behavior and the old duplicate-line race were separately reproduced as failures against their baseline source.

Publish the backend repair and price with sweatpant sales held first. Check the existing live Tapstitch quarter-zip checkout preview to verify the private runtime manual-route prerequisites without creating a payment. Only then activate all four sweatpant colors and confirm their live totals, gallery preservation, catalog order and hosted Stripe Checkout handoff. No environment values or settings are changed.

If release verification fails, preserve the sales hold and fix forward. A code revert does not undo any real customer order, supplier placement or Stripe payment.

# TEMPO Training Tee purchase release

Owner instruction `683b2d58-288d-446c-b5cb-1df34f5d80ba` authorizes making the women's products already online purchasable. This release covers only WT0216, product `80000000-0000-4000-8000-000000000021`, at the existing $34 price, White / Lake Blue / Light Purple, S–XL. All 15 approved gallery files, descriptions, fit chart, page layout and other products remain unchanged. The Core Training Tee and Training Bra retain their holds pending supplier verification.

## Saved supplier evidence

| Color | Saved design | Ordering page ID | Ink |
| --- | --- | --- | --- |
| White | 1564324134866087936 | 1564324861776748544 | Black / red |
| Lake Blue | 1567566232960516096 | 1567566233338085376 | White |
| Light Purple | 1564325488367988736 | 1564325823350292480 | Black |

Authenticated editors on November 4 show WT0216-P001-V2, DTF, reference size L, 7.5 × 2 inches and Good · 396 DPI in every color. Supplier sizes are S/M/L/XL/2XL; GOAL offers the owner-selected S–XL. Tapstitch scales decoration by garment size. The artwork stays within the permitted front area. No artwork or generated image was changed during this audit.

The White background warning was reviewed in the supplier's Image Review with its red print mask enabled. Only the lockup is masked; checkerboard remains around the mark and inside letter openings. The observed preview PNG also has 70,896 fully transparent pixels and transparent corners. This is evidence of a false positive, not permission to run background removal. The 700 × 186 downloaded preview is not claimed as the full production file; production resolution is the editor's separate 396 DPI reading. No physical sample approval is claimed.

All three saved designs now include the existing approved **My clothing label**, GOAL V1.3 vertical lockup, 4 × 4 cm, $0.99 each. Assignment survived a Designs-page reload and was also present in the saved editor. Current garment / print / label quote is $10.97 per tee. Contribution margin is **unknown** until shipping, taxes, fees and landed costs are established. Retail remains $34.

## Paid manual fulfillment

Use the existing [paid Tapstitch procedure](core-sweatpant-tapstitch-fulfillment.md), with **Gary Dove** as operator, for receipt, supplier placement, deduplication, actual supplier order ID, tracking, missed-alert reconciliation and failure handling. The same signed webhook and durable private owner-task ledger serve these tees. No tee line goes to Apliiq.

The task now supplies each exact saved design, supplier color, supplier size and ordering-page link, plus an instruction to retain the saved GOAL 4 × 4 cm clothing label. Reconcile every paid line against these details before placing an international-fulfillment order. The site's `TAP-<design>-<size>` references are internal routing identifiers, not supplier API SKUs. Never substitute a blank, an older draft or an unbranded design. Record the actual supplier order ID only after a confirmed order; reconcile an uncertain result before retrying.

Current shipping rules remain $6.95 below $70 of merchandise after discounts. One tee is $40.95 delivered before any applicable tax; two are $74.95 including shipping; three are $102 with free shipping. Prices are derived on the server. Do not change store, Apliiq submission or email settings as part of this release.

## Verification and release boundary

Run the gallery regression, bra hold regression, 20-check Tapstitch integration suite, typecheck, production build and whitespace check. The integration suite covers all 12 tee references through captured Checkout, signed fixture payment, local PostgreSQL persistence and the tagged manual task, in addition to the existing 17 Halo regressions. No test places an order, sends email, creates a real Stripe session or charges a card.

After publishing the reviewed source, verify a **women's WT0216** `preview:true` request with no email or promotion code. The deployed handler returns totals before Checkout Session creation; this checks the live runtime's existing manual-route readiness guard without placing an order. If that guard fails, restore only the tee's availability hold in a forward commit and retain the valid supplier-label corrections. Never bypass the guard or change runtime settings to make a release pass. Public gallery checks do not prove a successful paid transaction.

The attempted men's production-checkout preflight was rejected by automatic approval review as outside the women's purchase authorization. It did not execute and must not be retried. This release uses isolated men's regressions and only the explicitly authorized women's preview described above.

# Current pricing: 25% modeled contribution

Owner authorized implementation on 2026-09-21. This replaces the prior 40–50% target and six-price release. Current runtime prices are in src/lib/products.ts; cards, details and server checkout use that authority. No sales, Stripe or fulfillment gates are enabled.

Formula: ceil((highest current size garment/decoration quote + $3 label contingency + $1 fulfillment + setup allowance + $0.30) / (1 - .029 - .05 - .25)). This is a contribution target after card fees and 5% returns reserve, before overhead/income tax, not 25% markup or guaranteed net profit. Shipping is charged separately; shipping/tax processing fees, supplier tax, extras and actual sewn-label cost still require reconciliation. The $3 is a budget, not an approved label quote or a change from sewn branding. One price covers offered sizes, so smaller sizes often have a higher margin.

| Product | Display price | Modeled worst-size contribution |
|---|---:|---:|
| Varsity | $50 | 25.3% |
| Minimal Club | $46 | 25.19% |
| Circular Badge | $35 | 25.41% |
| Circular Center Crewneck | $93 | 25.34% |
| Modern Sport Performance | $48 | 25.68% |
| Performance Badge Tee | $37 | 26.18% |
| Core Hoodie · Red and · Club Blue (remake 2026-09-24, both transfers, $44.43 quote) | $78 | 27.06% |
| Casual Wordmark Tee | $39 | 25.66% |
| Touchline Cap | $36 | 26.49% |

The cap dialog distinguishes $18.88 repeat cost from $29.88 including $11 first-order digitization. The model budgets that $11 over 25 assumed units; first-order cash contribution is lower and 25-unit sell-through is not guaranteed. Stitch count and final digitized cost remain supplier-confirmed later.

The crewneck $93 is for its CURRENT front-print/blank-back design. The proposed curved back print is not approved or implemented. A standard extra $7.49 transfer would imply approximately $104 retail at the same model. Requote the actual artwork first. Do not publish the curved design as included in $93, quietly reduce quality, or claim it meets an $85 price cap.

Cotton Modern Sport is archived by explicit owner confirmation, with source files and saved Apliiq design preserved. Its prior URL temporarily redirects to the performance edition. Six second-color proposals remain for the nine active products; these are not approved supplier variants.

All unknown fields in COST-INPUTS.json stay null and quote_verified stays false. calculate-prices.py uses the authorized 25% target but continues to refuse a final fully verified landed-cost result until missing inputs are supplied. PRICING-25-PERCENT.json is the transparent display-price model, not a workaround that certifies unknowns.

Sources: [Apliiq item/fulfillment charges](https://help.apliiq.com/portal/en/kb/articles/understanding-apliiq-dropship-product-pricing), [Stripe domestic-card pricing](https://stripe.com/pricing), authenticated saved-design quote links in PRICING-25-PERCENT.json.

## Casual Wordmark Tee (3010): $48, decided 2026-09-24

Inputs read from Apliiq design 6120860's dropship dialog: $24.48 per unit,
XXL +$2.00. The model floor at the 25% target is $46. The owner briefly
set $42, then kept the displayed price at **$48** (above the floor;
modelled worst-size contribution ≈ 27%). Recorded so the table above is
not read as the current price.

## Core Hoodie re-run (2026-09-24, remake with the 3010 print sets)

Inputs read from the saved designs 6121031 (Black · Red Band) and 6121043 (Grey Heather · Red Band): **$44.43 per unit** with both transfers, XXL +$2.00 (carried from the 2026-09-21 quote). Six designs, all quoting the same base.

  (44.43 + 2.00 XXL + 3 label + 1 fulfilment + 0.30) / (1 − .029 − .05 − .25)
  = 75.60  →  modelled floor **$76**. Display **$78** stays (owner has not changed it); worst-size contribution $21.11, **27.06%**.

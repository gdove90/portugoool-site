# Verified Apliiq item costs and margin discussion

Checked 2026-09-21T10:26:01.497594+00:00. No website prices changed. The owner asked to understand percentage profit before prices are finalized.

Authenticated Apliiq access is working. Created the GOOOL custom-store record (199130), which unlocked dropship quotes. No API credentials read, callback connected, order placed, subscription purchased or production gate changed.

| Garment | S–XL printed cost | 2XL extra | Draft retail | 2XL contribution* |
|---|---:|---:|---:|---:|
| Modern Sport cotton | $24.48 | $2.00 | $64 | $28.16 / 44.0% |
| Varsity | $27.60 | $1.50 | $68 | $29.23 / 43.0% |
| Minimal Club | $24.48 | $2.00 | $64 | $28.16 / 44.0% |
| Circular Badge | $17.04 | $2.00 | $48 | $20.87 / 43.5% |
| Circular Center Crewneck | $55.29 | $2.50 | $128 | $55.80 / 43.6% |
| Modern Sport Performance | $25.58 | $2.00 | $64 | $27.06 / 42.3% |

*Planning calculation includes quoted garment/prints, 2XL surcharge, a $3 printed-label allowance, $1 fulfillment, 2.9% + $0.30 card processing on the item, and a 5% returns/reprint reserve. Excludes shipping/tax processing fees, any shipping subsidy, supplier tax, unverified packing extras, overhead and income tax. It is contribution, not net profit. Labels have not been purchased or applied. The proposed 40% minimum is a recommendation, not an owner-approved policy. The prior 50% model remains unchanged.

Thirty variant garment/decoration costs are now recorded in COST-INPUTS.json. Full quote_verified stays false because landed-cost fields remain unresolved. Do not overwrite unknown charges with zeros or publish placeholder prices. See APLIIQ-PRICING-RESEARCH-2026-09-21.json for exact sources and calculations.

## Claude next-action prompt

Work in C:\Users\gdove\OneDrive\Desktop\GOOOL. Read designs/18_launch_operations/APLIIQ-PRICING-RESEARCH-2026-09-21.md and its JSON. Explain and settle the contribution-margin target before finalizing prices. Use the verified dropship costs, not sample/bulk prices. Reuse custom store 199130; do not create duplicates. Confirm label compatibility, packaging, actual shipping weights/rates and tax/fee assumptions; preserve null unknowns. Then apply finalized prices consistently while Coming Soon and fulfillment stay disabled. Preserve the approved studio product tiles. Do not claim label purchase, sample approval or a completed supplier API connection.

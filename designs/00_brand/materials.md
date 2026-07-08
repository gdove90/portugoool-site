# Materials

Canonical fabric + print specs. Product data (`src/lib/products.ts` and the
Supabase seed) mirrors this file — update here first.

## Jersey Fabrics (Performance Collection)
- **CONFIRMED GARMENT (2026-07-08):** Printful "All-Over Print Recycled
  Unisex Sports Jersey" — base cost ~$30.55, sizes 2XS–6XL
- 100% recycled polyester, lightweight performance knit
- Moisture-wicking · breathable · silky smooth finish
- All-over sublimation (edge-to-edge print)
- Athletic fit
- Do NOT claim: elastane content, four-way stretch, exact GSM, laser-cut
  ventilation, UPF — Printful does not confirm these for this garment.
  Verify GSM from the listing when sampling before adding a number back.
- Retail target: $85–120 (current: $95 home/away, $105 editions)

## T-Shirt Fabrics (Casual Collection)
- Standard: 180 GSM soft-touch cotton-poly blend, relaxed fit
- Heavyweight: 220 GSM polyester blend, soft-touch, oversized fit
- DTG / DTF print compatible
- Retail target: $38–55 (current: $38–48)

## Accessories
- Scarf: double-sided acrylic knit, fringed ends, 145 × 18 cm
- Cap: brushed cotton twill, embroidered front, adjustable
- Stickers: weatherproof matte vinyl, 5–8 cm, six per pack
- Flag: knitted polyester, reinforced grommets, 90 × 150 cm

## Printing Methods
| Product | Method | Notes |
|---|---|---|
| Jerseys | Sublimation | All-over capable; name/number add-on printed on back |
| Casual tees | DTG or DTF | Chest prints; heavyweight prefers DTF |
| Cap | Embroidery | Front hit only |
| Scarf | Woven/knit-in | Design must survive two-color knit |

## Care Instructions (customer-facing)
- Jerseys: machine wash cold inside out · no bleach · hang dry · do not iron print
- Tees: machine wash cold with like colors · tumble dry low · do not iron print
- Accessories: spot clean or hand wash cold · lay flat to dry

## Supplier Notes
- Candidate fulfillment: Printful, Printify, Apliiq, Gelato, local print partners
- `supplier_type` field exists on every product for future routing
- No claims on the site (UPF, ventilation) until a supplier confirms them

# Claude Code handoff — TEMPO (draft, phase 1)
Do not implement until images, prices and supplier IDs are filled in.
1. Read this folder and inspect the GOAL Athletics repo, catalog schema, asset storage and supplier integrations (Netlify, Supabase, Stripe, Apliiq). Verify rather than assume Tapstitch and Printful routes exist.
2. Add 7 TEMPO products from products.json, 3 colourways each, in merch_order.
3. Map variants from variants.csv. P06 Black/Black is a separate Apliiq listing. P07 colours are print designs, not stock fabrics.
4. Map images from asset-manifest.csv; keep framing uniform across colours.
5. Test navigation, mobile, image loading, colour/size selection, cart variant, price and fulfilment mapping.
6. Variants with null price or external ID stay unpurchasable.
7. Leave existing products untouched. Report status accurately; uploaded images are not a working fulfilment connection.

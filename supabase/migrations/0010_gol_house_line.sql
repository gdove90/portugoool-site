-- GOL House Line: 5 performance tees (Printify/SwiftPOD Gildan 42000,
-- DTF, base $15.16 -> retail $30 per the 2x rule). First printify-supplied
-- products in the catalog.

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '40000000-0000-4000-8000-000000000007', 'GOL Clean Sheet Tee', 'gol-clean-sheet-tee', 'The mark in ink on clean white. Performance fabric, daylight energy.',
  3000, null, 'White', '#FFFFFF',
  'Moisture-wicking 100% polyester performance knit (Gildan Performance). Lightweight, breathable, DTF printed.', 'Athletic cut. True to size.', 'Machine wash cold. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/gol-clean-sheet-tee.webp", "alt": "GOL Clean Sheet Tee \u2014 front"}, {"src": "/products/gol-clean-sheet-tee-alt.webp", "alt": "GOL Clean Sheet Tee \u2014 detail"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'casual', 'printify', true, false, null, null, 0, false, false, 0
),
(
  '40000000-0000-4000-8000-000000000008', 'GOL Gold Standard Tee', 'gol-gold-standard-tee', 'Gold on black with a tonal slash. The house look, built to move.',
  3000, null, 'Black', '#0A0A0A',
  'Moisture-wicking 100% polyester performance knit (Gildan Performance). Lightweight, breathable, DTF printed.', 'Athletic cut. True to size.', 'Machine wash cold. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/gol-gold-standard-tee.webp", "alt": "GOL Gold Standard Tee \u2014 front"}, {"src": "/products/gol-gold-standard-tee-alt.webp", "alt": "GOL Gold Standard Tee \u2014 detail"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'casual', 'printify', true, false, null, null, 0, false, false, 0
),
(
  '40000000-0000-4000-8000-000000000009', 'GOL Concrete Tee', 'gol-concrete-grey-tee', 'The slash oversized, the mark up top. Street energy on performance poly.',
  3000, null, 'Sport Grey', '#9CA3AF',
  'Moisture-wicking 100% polyester performance knit (Gildan Performance). Lightweight, breathable, DTF printed.', 'Athletic cut. True to size.', 'Machine wash cold. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/gol-concrete-grey-tee.webp", "alt": "GOL Concrete Tee \u2014 front"}, {"src": "/products/gol-concrete-grey-tee-alt.webp", "alt": "GOL Concrete Tee \u2014 detail"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'casual', 'printify', true, false, null, null, 0, false, false, 0
),
(
  '40000000-0000-4000-8000-000000000010', 'GOL Concrete White Tee', 'gol-concrete-white-tee', 'Ink slash shoulder to hip, gold lockup. The loud one in white.',
  3000, null, 'White', '#FFFFFF',
  'Moisture-wicking 100% polyester performance knit (Gildan Performance). Lightweight, breathable, DTF printed.', 'Athletic cut. True to size.', 'Machine wash cold. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/gol-concrete-white-tee.webp", "alt": "GOL Concrete White Tee \u2014 front"}, {"src": "/products/gol-concrete-white-tee-alt.webp", "alt": "GOL Concrete White Tee \u2014 detail"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'casual', 'printify', true, false, null, null, 0, false, false, 0
),
(
  '40000000-0000-4000-8000-000000000011', 'GOL Concrete Black Tee', 'gol-concrete-black-tee', 'Paper slash, gold mark. Blackout energy for the performance line.',
  3000, null, 'Black', '#0A0A0A',
  'Moisture-wicking 100% polyester performance knit (Gildan Performance). Lightweight, breathable, DTF printed.', 'Athletic cut. True to size.', 'Machine wash cold. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/gol-concrete-black-tee.webp", "alt": "GOL Concrete Black Tee \u2014 front"}, {"src": "/products/gol-concrete-black-tee-alt.webp", "alt": "GOL Concrete Black Tee \u2014 detail"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'casual', 'printify', true, false, null, null, 0, false, false, 0
)
on conflict (slug) do nothing;

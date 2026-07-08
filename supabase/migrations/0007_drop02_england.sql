-- Drop 02: The England Collection (ENGOOOLAND) — 3 jerseys + 4 tees.
-- Jerseys: Drop II, 500 units, honest zero sold at launch. Prices per the
-- 2x-Printful-base policy (jersey $61, tee $23 front-print).

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '10000000-0000-4000-8000-000000000005', 'ENGOOOLAND Home White Jersey', 'engoooland-home-white-jersey', 'The scream, embedded. Crisp white with the red and navy sash — chapter two starts loud.',
  6100, null, 'White', '#FFFFFF',
  'Lightweight performance knit. 100% recycled polyester. Moisture-wicking and breathable with a silky smooth finish, printed edge to edge.', 'Athletic fit. True to size. Size up for a relaxed feel.', 'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
  '[{"src": "/products/engoooland-home-white-jersey.webp", "alt": "ENGOOOLAND Home White Jersey \u2014 front, on model"}, {"src": "/products/engoooland-home-white-jersey-back.webp", "alt": "ENGOOOLAND Home White Jersey \u2014 back, ready for custom name and number"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'jersey', 'printful', true, true, 'II', 500, 0, true, true, 1500
),
(
  '10000000-0000-4000-8000-000000000006', 'ENGOOOLAND Away Red Jersey', 'engoooland-away-red-jersey', 'Deep red with white and navy movement. For the away days and the loud ends.',
  6100, null, 'Deep Red', '#C1121F',
  'Lightweight performance knit. 100% recycled polyester. Moisture-wicking and breathable with a silky smooth finish, printed edge to edge.', 'Athletic fit. True to size. Size up for a relaxed feel.', 'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
  '[{"src": "/products/engoooland-away-red-jersey.webp", "alt": "ENGOOOLAND Away Red Jersey \u2014 front, on model"}, {"src": "/products/engoooland-away-red-jersey-back.webp", "alt": "ENGOOOLAND Away Red Jersey \u2014 back, ready for custom name and number"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'jersey', 'printful', true, true, 'II', 500, 0, true, true, 1500
),
(
  '10000000-0000-4000-8000-000000000007', 'ENGOOOLAND Navy Jersey', 'engoooland-navy-jersey', 'England Navy with the red-white sash and a gold pinline. Quiet colour, loud intent.',
  6100, null, 'England Navy', '#0A1F3C',
  'Lightweight performance knit. 100% recycled polyester. Moisture-wicking and breathable with a silky smooth finish, printed edge to edge.', 'Athletic fit. True to size. Size up for a relaxed feel.', 'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
  '[{"src": "/products/engoooland-navy-jersey.webp", "alt": "ENGOOOLAND Navy Jersey \u2014 front, on model"}, {"src": "/products/engoooland-navy-jersey-back.webp", "alt": "ENGOOOLAND Navy Jersey \u2014 back, ready for custom name and number"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'jersey', 'printful', true, true, 'II', 500, 0, true, true, 1500
),
(
  '20000000-0000-4000-8000-000000000007', 'ENGOOOLAND Echo Hero Tee', 'engoooland-echo-hero-tee', 'The Echo, oversized, in red and navy. Chapter two on a clean white staple.',
  2300, null, 'White', '#FFFFFF',
  'Soft 100% ring-spun cotton staple tee. Lightweight and breathable — holds color, holds shape, feels broken-in from day one.', 'Relaxed fit. Between sizes? Stay true.', 'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/engoooland-echo-hero-tee.webp", "alt": "ENGOOOLAND Echo Hero Tee \u2014 front"}, {"src": "/products/engoooland-echo-hero-tee-back.webp", "alt": "ENGOOOLAND Echo Hero Tee \u2014 back"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'casual', 'printful', true, false, 'II', null, 0, false, false, 0
),
(
  '20000000-0000-4000-8000-000000000008', 'From London to the World Tee', 'london-to-the-world-tee', 'One city, every corner bar. The London mirror of a Lisbon classic.',
  2300, null, 'England Navy', '#0A1F3C',
  'Soft 100% ring-spun cotton staple tee. Lightweight and breathable — holds color, holds shape, feels broken-in from day one.', 'Relaxed fit. Between sizes? Stay true.', 'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/london-to-the-world-tee.webp", "alt": "From London to the World Tee \u2014 front"}, {"src": "/products/london-to-the-world-tee-back.webp", "alt": "From London to the World Tee \u2014 back"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'casual', 'printful', true, false, 'II', null, 0, false, false, 0
),
(
  '20000000-0000-4000-8000-000000000009', 'Made for the Moment Tee', 'made-for-the-moment-tee', 'The tagline, front and center. Deep red, built for the second it goes in.',
  2300, null, 'Deep Red', '#C1121F',
  'Soft 100% ring-spun cotton staple tee. Lightweight and breathable — holds color, holds shape, feels broken-in from day one.', 'Relaxed fit. Between sizes? Stay true.', 'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/made-for-the-moment-tee.webp", "alt": "Made for the Moment Tee \u2014 front"}, {"src": "/products/made-for-the-moment-tee-back.webp", "alt": "Made for the Moment Tee \u2014 back"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'casual', 'printful', true, false, 'II', null, 0, false, false, 0
),
(
  '20000000-0000-4000-8000-000000000010', 'ENGOOOLAND Roar Tee', 'engoooland-roar-tee', 'Echo badge at the breast, the moment stacked beneath. Navy, understated, ready.',
  2300, null, 'England Navy', '#0A1F3C',
  'Soft 100% ring-spun cotton staple tee. Lightweight and breathable — holds color, holds shape, feels broken-in from day one.', 'Relaxed fit. Between sizes? Stay true.', 'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/engoooland-roar-tee.webp", "alt": "ENGOOOLAND Roar Tee \u2014 front"}, {"src": "/products/engoooland-roar-tee-back.webp", "alt": "ENGOOOLAND Roar Tee \u2014 back"}]'::jsonb, array['S','M','L','XL','XXL','3XL'],
  'casual', 'printful', true, false, 'II', null, 0, false, false, 0
)
on conflict (slug) do nothing;

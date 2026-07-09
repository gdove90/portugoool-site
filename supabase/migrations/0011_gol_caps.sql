-- Accessories reset: retire scarf/old cap/stickers/flag; add two GOL
-- embroidered caps (Printful Yupoong 6245CM, base $14.65 -> $29).

update public.products set is_active = false
  where slug in ('supporters-scarf','goool-cap','sticker-pack','terrace-flag');

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '50000000-0000-4000-8000-000000000001', 'GOL Cap Black', 'gol-cap-black', 'Gold GOL, stitched. Low-profile classic cap, adjustable strap.',
  2900, null, 'Black', '#0A0A0A',
  'Brushed cotton twill, embroidered GOL mark, adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/gol-cap-black.webp", "alt": "GOL Cap Black \u2014 front"}, {"src": "/products/gol-cap-black-alt.webp", "alt": "GOL Cap Black \u2014 angle"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000002', 'GOL Cap White', 'gol-cap-white', 'Ink GOL, stitched clean on white. Low-profile classic cap, adjustable strap.',
  2900, null, 'White', '#FFFFFF',
  'Brushed cotton twill, embroidered GOL mark, adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/gol-cap-white.webp", "alt": "GOL Cap White \u2014 front"}, {"src": "/products/gol-cap-white-alt.webp", "alt": "GOL Cap White \u2014 angle"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
)
on conflict (slug) do nothing;

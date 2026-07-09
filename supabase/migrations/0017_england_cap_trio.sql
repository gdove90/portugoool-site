-- England cap trio (Yupoong 6245CM dad hats: White 7853, Navy 7857,
-- Cranberry 12735). Front GOOOL/ENGLAND stack, left-side St George
-- shield, back GOOOL. Replaces the rejected trucker version.

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '50000000-0000-4000-8000-000000000006', 'GOOOL England Cap White', 'goool-england-cap-white', 'White crown, navy GOOOL, England red. The cross on the side, GOOOL on the back.',
  3500, null, 'White', '#FFFFFF',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-england-cap-white.webp", "alt": "GOOOL England Cap White — front"}, {"src": "/products/goool-england-cap-white-alt.webp", "alt": "GOOOL England Cap White — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, 'II', null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000007', 'GOOOL England Cap Navy', 'goool-england-cap-navy', 'England navy, white GOOOL, red England. The cross on the side, GOOOL on the back.',
  3500, null, 'Navy', '#0A1F3C',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-england-cap-navy.webp", "alt": "GOOOL England Cap Navy — front"}, {"src": "/products/goool-england-cap-navy-alt.webp", "alt": "GOOOL England Cap Navy — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, 'II', null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000008', 'GOOOL England Cap Red', 'goool-england-cap-red', 'Deep red, white GOOOL. The cross on the side, GOOOL on the back.',
  3500, null, 'Red', '#9E1B32',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-england-cap-red.webp", "alt": "GOOOL England Cap Red — front"}, {"src": "/products/goool-england-cap-red-alt.webp", "alt": "GOOOL England Cap Red — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, 'II', null, 0, false, false, 0
)
on conflict (slug) do nothing;

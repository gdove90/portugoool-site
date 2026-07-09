-- Country caps wave 2: Italy, Netherlands, Germany, Belgium, Norway,
-- Spain, France (13 colorways, Yupoong 6245CM). One shared design system
-- (designs/07_accessories/hats/country-cap-guidelines.md); flag-shield
-- side crests only, never federation crests. Netherlands Orange colorway
-- pending: blank unavailable in orange.

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '50000000-0000-4000-8000-000000000011', 'GOOOL Italy Cap Navy', 'goool-italy-cap-navy', 'Azzurri navy, white GOOOL, green Italy. The tricolore shield on the side, GOOOL on the back.',
  3500, null, 'Navy', '#0A1F3C',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-italy-cap-navy.webp", "alt": "GOOOL Italy Cap Navy — front"}, {"src": "/products/goool-italy-cap-navy-alt.webp", "alt": "GOOOL Italy Cap Navy — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000012', 'GOOOL Italy Cap White', 'goool-italy-cap-white', 'White crown, navy GOOOL, green Italy. The tricolore shield on the side, GOOOL on the back.',
  3500, null, 'White', '#FFFFFF',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-italy-cap-white.webp", "alt": "GOOOL Italy Cap White — front"}, {"src": "/products/goool-italy-cap-white-alt.webp", "alt": "GOOOL Italy Cap White — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000013', 'GOOOL Netherlands Cap Navy', 'goool-netherlands-cap-navy', 'Navy crown, white GOOOL, Oranje accent. The flag shield on the side, GOOOL on the back.',
  3500, null, 'Navy', '#0A1F3C',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-netherlands-cap-navy.webp", "alt": "GOOOL Netherlands Cap Navy — front"}, {"src": "/products/goool-netherlands-cap-navy-alt.webp", "alt": "GOOOL Netherlands Cap Navy — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000014', 'GOOOL Germany Cap Black', 'goool-germany-cap-black', 'Black crown, white GOOOL, red Germany. The flag shield on the side, GOOOL on the back.',
  3500, null, 'Black', '#0A0A0A',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-germany-cap-black.webp", "alt": "GOOOL Germany Cap Black — front"}, {"src": "/products/goool-germany-cap-black-alt.webp", "alt": "GOOOL Germany Cap Black — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000015', 'GOOOL Germany Cap White', 'goool-germany-cap-white', 'White crown, black GOOOL, red Germany. The flag shield on the side, GOOOL on the back.',
  3500, null, 'White', '#FFFFFF',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-germany-cap-white.webp", "alt": "GOOOL Germany Cap White — front"}, {"src": "/products/goool-germany-cap-white-alt.webp", "alt": "GOOOL Germany Cap White — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000016', 'GOOOL Belgium Cap Red', 'goool-belgium-cap-red', 'Deep red, gold GOOOL, black Belgium. The flag shield on the side, gold GOOOL on the back.',
  3500, null, 'Red', '#9E1B32',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-belgium-cap-red.webp", "alt": "GOOOL Belgium Cap Red — front"}, {"src": "/products/goool-belgium-cap-red-alt.webp", "alt": "GOOOL Belgium Cap Red — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000017', 'GOOOL Belgium Cap Black', 'goool-belgium-cap-black', 'Black crown, gold GOOOL, red Belgium. The flag shield on the side, gold GOOOL on the back.',
  3500, null, 'Black', '#0A0A0A',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-belgium-cap-black.webp", "alt": "GOOOL Belgium Cap Black — front"}, {"src": "/products/goool-belgium-cap-black-alt.webp", "alt": "GOOOL Belgium Cap Black — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000018', 'GOOOL Norway Cap Navy', 'goool-norway-cap-navy', 'Navy crown, white GOOOL, red Norway. The Nordic cross shield on the side, GOOOL on the back.',
  3500, null, 'Navy', '#0A1F3C',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-norway-cap-navy.webp", "alt": "GOOOL Norway Cap Navy — front"}, {"src": "/products/goool-norway-cap-navy-alt.webp", "alt": "GOOOL Norway Cap Navy — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000019', 'GOOOL Norway Cap Red', 'goool-norway-cap-red', 'Deep red, white GOOOL. The Nordic cross shield on the side, GOOOL on the back.',
  3500, null, 'Red', '#9E1B32',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-norway-cap-red.webp", "alt": "GOOOL Norway Cap Red — front"}, {"src": "/products/goool-norway-cap-red-alt.webp", "alt": "GOOOL Norway Cap Red — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000020', 'GOOOL Spain Cap Black', 'goool-spain-cap-black', 'Black crown, gold GOOOL, red Spain. The rojigualda shield on the side, gold GOOOL on the back.',
  3500, null, 'Black', '#0A0A0A',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-spain-cap-black.webp", "alt": "GOOOL Spain Cap Black — front"}, {"src": "/products/goool-spain-cap-black-alt.webp", "alt": "GOOOL Spain Cap Black — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000021', 'GOOOL Spain Cap Red', 'goool-spain-cap-red', 'Deep red, gold GOOOL. The rojigualda shield on the side, gold GOOOL on the back.',
  3500, null, 'Red', '#9E1B32',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-spain-cap-red.webp", "alt": "GOOOL Spain Cap Red — front"}, {"src": "/products/goool-spain-cap-red-alt.webp", "alt": "GOOOL Spain Cap Red — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000022', 'GOOOL France Cap Navy', 'goool-france-cap-navy', 'Navy crown, white GOOOL, red France. The tricolore shield on the side, GOOOL on the back.',
  3500, null, 'Navy', '#0A1F3C',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-france-cap-navy.webp", "alt": "GOOOL France Cap Navy — front"}, {"src": "/products/goool-france-cap-navy-alt.webp", "alt": "GOOOL France Cap Navy — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000023', 'GOOOL France Cap White', 'goool-france-cap-white', 'White crown, navy GOOOL, red France. The tricolore shield on the side, GOOOL on the back.',
  3500, null, 'White', '#FFFFFF',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-france-cap-white.webp", "alt": "GOOOL France Cap White — front"}, {"src": "/products/goool-france-cap-white-alt.webp", "alt": "GOOOL France Cap White — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
)
on conflict (slug) do nothing;

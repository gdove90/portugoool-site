-- GOOOL house caps: extended wordmark (logo v4 trace) front, The Sound
-- of Victory. side embroidery. Yupoong 6245CM via Printful, $35.

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '50000000-0000-4000-8000-000000000003', 'GOOOL Cap Black', 'goool-cap-black', 'The house wordmark in gold thread. The Sound of Victory. on the side.',
  3500, null, 'Black', '#0A0A0A',
  'Brushed cotton twill, embroidered GOOOL wordmark, adjustable strap.', 'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-cap-black.webp", "alt": "GOOOL Cap Black — front angle"}, {"src": "/products/goool-cap-black-alt.webp", "alt": "GOOOL Cap Black — front"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000004', 'GOOOL Cap White', 'goool-cap-white', 'GOOOL stitched in ink on white. The Sound of Victory. on the side.',
  3500, null, 'White', '#FFFFFF',
  'Brushed cotton twill, embroidered GOOOL wordmark, adjustable strap.', 'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-cap-white.webp", "alt": "GOOOL Cap White — front angle"}, {"src": "/products/goool-cap-white-alt.webp", "alt": "GOOOL Cap White — front"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
)
on conflict (slug) do nothing;

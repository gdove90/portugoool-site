-- Argentina cap pair (Yupoong 6245CM: White 7853, Light Blue 7856).
-- Front GOOOL/ARGENTINA stack, left-side flag shield (celeste bands +
-- simplified gold sun; national flag imagery per owner call — never the
-- AFA crest), back GOOOL.

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '50000000-0000-4000-8000-000000000009', 'GOOOL Argentina Cap White', 'goool-argentina-cap-white', 'White crown, navy GOOOL, celeste Argentina. The flag shield on the side, GOOOL on the back.',
  3500, null, 'White', '#FFFFFF',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-argentina-cap-white.webp", "alt": "GOOOL Argentina Cap White — front"}, {"src": "/products/goool-argentina-cap-white-alt.webp", "alt": "GOOOL Argentina Cap White — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
),
(
  '50000000-0000-4000-8000-000000000010', 'GOOOL Argentina Cap Sky Blue', 'goool-argentina-cap-sky', 'Celeste, white GOOOL. The flag shield on the side, GOOOL on the back.',
  3500, null, 'Sky Blue', '#75AADB',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-argentina-cap-sky.webp", "alt": "GOOOL Argentina Cap Sky Blue — front"}, {"src": "/products/goool-argentina-cap-sky-alt.webp", "alt": "GOOOL Argentina Cap Sky Blue — side crest"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, null, null, 0, false, false, 0
)
on conflict (slug) do nothing;

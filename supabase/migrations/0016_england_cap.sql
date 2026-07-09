-- GOOOL England Cap: Yupoong 6006 trucker (Red/White/Red, variant 4819),
-- front embroidery GOOOL/ENGLAND/St George shield. Owner call 2026-07-09:
-- national flag imagery approved (public domain); never the FA crest.

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values (
  '50000000-0000-4000-8000-000000000005', 'GOOOL England Cap', 'goool-england-cap',
  'Red, white, and navy. GOOOL in navy thread, England in red, the cross on the shield. Part of The England Drop.',
  3500, null, 'Red / White', '#C1121F',
  'Structured 5-panel trucker, embroidered front panel, mesh back, snapback.',
  'One size · snapback.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-england-cap.webp", "alt": "GOOOL England Cap — front"}, {"src": "/products/goool-england-cap-alt.webp", "alt": "GOOOL England Cap — angle"}]'::jsonb, array['OS'],
  'accessory', 'printful', true, false, 'II', null, 0, false, false, 0
)
on conflict (slug) do nothing;

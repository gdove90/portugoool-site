-- Hats become a first-class category: extend the check constraint, move
-- every cap over, and add the Netherlands white colorway (every country
-- now has two colorways; NL orange still pending an orange blank).

alter table public.products drop constraint products_product_category_check;
alter table public.products add constraint products_product_category_check
  check (product_category in ('jersey', 'casual', 'accessory', 'hat'));

update public.products set product_category = 'hat' where slug like '%cap%';

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values (
  '50000000-0000-4000-8000-000000000024', 'GOOOL Netherlands Cap White', 'goool-netherlands-cap-white',
  'White crown, navy GOOOL, Oranje accent. The flag shield on the side, GOOOL on the back.',
  3500, null, 'White', '#FFFFFF',
  'Brushed cotton twill, embroidered front, side crest, and back mark. Adjustable strap.',
  'One size · adjustable.', 'Spot clean or hand wash cold. Lay flat to dry.',
  '[{"src": "/products/goool-netherlands-cap-white.webp", "alt": "GOOOL Netherlands Cap White — front"}, {"src": "/products/goool-netherlands-cap-white-alt.webp", "alt": "GOOOL Netherlands Cap White — side crest"}]'::jsonb,
  array['OS'], 'hat', 'printful', true, false, null, null, 0, false, false, 0
)
on conflict (slug) do nothing;

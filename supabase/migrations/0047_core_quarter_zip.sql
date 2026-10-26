-- 0047: GOAL Athletics Core Quarter Zip (owner instruction 2026-10-26):
-- the men's Tapstitch MT0063 quarter zip in Black, White and Dark Gray,
-- designs 1564299910617194496 / 1564523403115982848 / 1564524205054324736,
-- S to XXL on the site. Category 'pullover' and supplier 'tapstitch' are
-- already allowed (0045). Price is the 25% model with house rounding
-- ($41 floor, $48). Idempotent. Applied 2026-10-26 in the Supabase SQL editor.

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000023', 'GOAL Athletics Core Quarter Zip', 'goal-athletics-core-quarter-zip', '', 4800, 'Black', '#171717', array['S','M','L','XL','XXL'], 'pullover', 'tapstitch', true, true)
on conflict (id) do update
  set name              = excluded.name,
      slug              = excluded.slug,
      price_cents       = excluded.price_cents,
      color             = excluded.color,
      color_hex         = excluded.color_hex,
      sizes             = excluded.sizes,
      product_category  = excluded.product_category,
      supplier_type     = excluded.supplier_type,
      is_active         = excluded.is_active,
      available_for_sale = excluded.available_for_sale;

-- verify: expect one row
select id, name, price_cents, product_category, supplier_type, is_active, available_for_sale
from public.products
where id = '80000000-0000-4000-8000-000000000023';

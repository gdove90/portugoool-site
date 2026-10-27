-- 0050: GOAL Athletics Core Jogger (owner instruction 2026-10-27): the
-- men's Sport-Tek PST871 Circuit Jogger on Apliiq in Deep Black (design
-- 6242924, GA white/red 3.00 x 2.70 in, wearer's left front hip) and
-- Graphite (GA solid white, same placement), private label inside the
-- waist, S to XXL. Price is the 25% model on the $35.99 VIP quote
-- (ceil((35.99 + 2 + 3 + 1 + 0.30) / 0.671) = $64). Category 'pants' and
-- supplier 'apliiq' are already allowed. Idempotent. Applied 2026-10-27 in the
-- Supabase SQL editor (verify select returned the row, 6400, pants, apliiq, true, true).

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000024', 'GOAL Athletics Core Jogger', 'goal-athletics-core-jogger', '', 6400, 'Deep Black', '#2B2B2B', array['S','M','L','XL','XXL'], 'pants', 'apliiq', true, true)
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
where id = '80000000-0000-4000-8000-000000000024';

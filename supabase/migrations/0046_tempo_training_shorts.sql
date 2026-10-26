-- 0046: TEMPO Training Shorts (the owner's design update of 2026-10-26
-- brought the GA down to 2.00 x 1.80 in, which fits Apliiq's 2 x 2 in leg
-- box on the Sport-Tek LST485). Three Apliiq designs: 6240613 Black,
-- 6240615 Iron Grey, 6240616 True Navy. The Training Pants (...0019) were
-- rebuilt the same day at the new GA size (6240609/610/611); their catalog
-- row does not change, only fulfillment.ts.
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id); the order store upserts the catalog row before writing
-- items (SupabaseStore.ensureProductRows). 'shorts' is already an allowed
-- category (0045). Price is the 25% model with house rounding ($46 floor,
-- $48). Idempotent. Applied 2026-10-26 in the Supabase SQL editor.

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000022', 'TEMPO Training Shorts', 'tempo-training-shorts', '', 4800, 'Black', '#252525', array['S','M','L','XL','XXL'], 'shorts', 'apliiq', true, true)
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
where id = '80000000-0000-4000-8000-000000000022';

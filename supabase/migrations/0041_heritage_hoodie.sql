-- 0041: products row for the GOAL Athletics Heritage Hoodie (Independent
-- IND4000; Black, Grey Heather, Bone, Navy; four Apliiq saved designs seen
-- on the account on 2026-10-22).
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id). The order store upserts the catalog row itself before
-- writing items (SupabaseStore.ensureProductRows in
-- src/lib/orders-store.ts); this file keeps the audit trail, as 0039 and
-- 0040 do.
--
-- Hidden, not for sale, price 0: the design ids, per-size SKUs, renders and
-- retail price are not in the repo yet (the gates are in src/lib/products.ts
-- and scripts/test-heritage-hoodie.cjs). When the owner publishes the hoodie,
-- update the three values below to match products.ts and run this file
-- again; the upsert carries them.
-- Idempotent; no historical orders or supplier designs changed.
-- Not yet applied. Run in the Supabase SQL editor (supabase-sql-editor skill).

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000014', 'GOAL Athletics Heritage Hoodie',
   'goal-athletics-heritage-hoodie', '', 0, 'Black', '#1E1E1E',
   array['S','M','L','XL','XXL'], 'hoodie', 'apliiq', false, false)
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

-- verify: expect one row, hidden and not for sale at 0
select id, name, slug, color, price_cents, product_category, is_active, available_for_sale
from public.products
where id = '80000000-0000-4000-8000-000000000014';

-- 0042: products row for the GOAL Athletics Lockup Hoodie (Independent
-- IND4000; Black, Grey Heather, Bone, Navy; four Apliiq saved designs seen
-- on the account on 2026-10-22, GA monogram and GOAL ATHLETICS lockup across
-- the chest).
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id). The order store upserts the catalog row itself before
-- writing items (SupabaseStore.ensureProductRows in
-- src/lib/orders-store.ts); this file keeps the audit trail, as 0039 to
-- 0041 do.
--
-- Retail price $78 (owner's hoodie price, 2026-10-22). Hidden and not for
-- sale: the design ids, per-size SKUs and renders are not in the repo yet
-- (the gates are in src/lib/products.ts and scripts/test-goal-hoodies.cjs).
-- When the owner publishes the hoodie, set is_active and available_for_sale
-- below to match products.ts and run this file again; the upsert carries
-- them. Idempotent; no historical orders or supplier designs changed.
-- Not yet applied. Run in the Supabase SQL editor (supabase-sql-editor skill).

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000015', 'GOAL Athletics Lockup Hoodie',
   'goal-athletics-lockup-hoodie', '', 7800, 'Black', '#1E1E1E',
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

-- verify: expect one row, hidden and not for sale at 7800
select id, name, slug, color, price_cents, product_category, is_active, available_for_sale
from public.products
where id = '80000000-0000-4000-8000-000000000015';

-- 0041: products row for the GOAL Athletics Heritage Hoodie (Independent
-- IND4000; Black first, owner catalog photos 2026-10-22).
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id). The order store upserts the catalog row itself before
-- writing items (SupabaseStore.ensureProductRows in
-- src/lib/orders-store.ts); this file keeps the audit trail, as 0039 and
-- 0040 do. The 'hoodie' category already passes the category check.
--
-- Not for sale yet: no retail price (price_cents 0 = "Price to be
-- announced") and the Apliiq design ids / SKUs are not mapped in
-- src/lib/fulfillment.ts. Update price_cents and available_for_sale here
-- and in src/lib/products.ts together when the owner sets them.
-- Idempotent; no historical orders or supplier designs changed.
-- NOT YET APPLIED (written 2026-10-22).

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000014', 'GOAL Athletics Heritage Hoodie',
   'goal-athletics-heritage-hoodie', '', 0, 'Black', '#1E1E1E',
   array['S','M','L','XL','XXL'], 'hoodie', 'apliiq', true, false)
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
select id, name, slug, color, price_cents, product_category, is_active, available_for_sale
from public.products
where id = '80000000-0000-4000-8000-000000000014';

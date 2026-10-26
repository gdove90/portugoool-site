-- 0043: products row for the GOAL Athletics Core Everyday Raincoat
-- (waterproof shell jacket, supplier blank J333; Black, True Navy, Dark Grey
-- Heather; three Apliiq saved designs 6240401 / 6240414 / 6240424 read on
-- 2026-10-26), plus the new 'jacket' product category.
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id). The order store upserts the catalog row itself before
-- writing items (SupabaseStore.ensureProductRows in
-- src/lib/orders-store.ts), and that upsert would fail the category check
-- without 'jacket'. This file keeps the audit trail, as 0040 does.
--
-- Retail price $108 at launch (25% model on the $64.58 dropship quote,
-- XXL +$2.00; floor $106); $98 from migration 0044 (owner). Live and for sale on the owner's instruction
-- 2026-10-26, men's section. Idempotent; no historical orders or supplier
-- designs changed.
-- Applied 2026-10-26 in the Supabase SQL editor (bundled with 0041 and 0042);
-- verified the row (10800, jacket, active, for sale) and the widened check.

alter table public.products drop constraint if exists products_product_category_check;
alter table public.products add constraint products_product_category_check
  check (product_category in ('jersey', 'casual', 'tshirt', 'hoodie', 'accessory', 'hat', 'shorts', 'jacket'));

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000016', 'GOAL Athletics Core Everyday Raincoat',
   'goal-athletics-core-everyday-raincoat', '', 10800, 'Black', '#151515',
   array['S','M','L','XL','XXL'], 'jacket', 'apliiq', true, true)
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

-- verify: expect one row, active and for sale at 10800, category jacket
select id, name, slug, color, price_cents, product_category, is_active, available_for_sale
from public.products
where id = '80000000-0000-4000-8000-000000000016';

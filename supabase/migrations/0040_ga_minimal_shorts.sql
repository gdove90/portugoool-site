-- 0040: products row for the GOAL Athletics GA Minimal Shorts (AS Colour
-- 5620; Black, Ink Blue, Shadow; owner proof 2026-10-14), plus the new
-- 'shorts' product category.
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id). The order store upserts the catalog row itself before
-- writing items (SupabaseStore.ensureProductRows in
-- src/lib/orders-store.ts), and that upsert would fail the category check
-- without 'shorts'. This file keeps the audit trail, as 0039 does.
--
-- Coming Soon: no price (0) and available_for_sale false until the owner
-- sets a price. Sizes S to XXL map to waist 30 to 38 (fulfillment.ts).
-- Idempotent; no historical orders or supplier designs changed.

alter table public.products drop constraint if exists products_product_category_check;
alter table public.products add constraint products_product_category_check
  check (product_category in ('jersey', 'casual', 'tshirt', 'hoodie', 'accessory', 'hat', 'shorts'));

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000013', 'GOAL Athletics GA Minimal Shorts',
   'goal-athletics-ga-minimal-shorts', '', 0, 'Black', '#242424',
   array['S','M','L','XL','XXL'], 'shorts', 'apliiq', true, false)
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
where id = '80000000-0000-4000-8000-000000000013';

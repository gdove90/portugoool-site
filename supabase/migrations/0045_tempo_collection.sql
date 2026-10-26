-- 0045: the TEMPO women's collection (owner instruction 2026-10-26): five
-- products built the same day on Apliiq (Core Training Tee LST350, Training
-- Pants LPST800, Warmup Hoodie 7519) and Tapstitch (Quarter Zip WT0092,
-- Training Tee WT0216), three colourways each, plus the new product
-- categories 'pants' and 'pullover' and the supplier 'tapstitch'.
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id); the order store upserts the catalog row before writing
-- items (SupabaseStore.ensureProductRows), and that upsert would fail the
-- category and supplier checks without these values. Prices are the 25%
-- model with house rounding (see products.ts). Idempotent.
-- Applied 2026-10-26 in the Supabase SQL editor.

alter table public.products drop constraint if exists products_product_category_check;
alter table public.products add constraint products_product_category_check
  check (product_category in ('jersey', 'casual', 'tshirt', 'hoodie', 'accessory', 'hat', 'shorts', 'jacket', 'pants', 'pullover'));
alter table public.products drop constraint if exists products_supplier_type_check;
alter table public.products add constraint products_supplier_type_check
  check (supplier_type in ('printful', 'printify', 'apliiq', 'tapstitch', 'gelato', 'local', 'unassigned'));

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000017', 'TEMPO Core Training Tee', 'tempo-core-training-tee', '', 3800, 'Black', '#141414', array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', true, true),
  ('80000000-0000-4000-8000-000000000018', 'TEMPO Quarter Zip', 'tempo-quarter-zip', '', 4400, 'Black', '#141414', array['S','M','L','XL'], 'pullover', 'tapstitch', true, true),
  ('80000000-0000-4000-8000-000000000019', 'TEMPO Training Pants', 'tempo-training-pants', '', 7200, 'Black/White', '#141414', array['S','M','L','XL','XXL'], 'pants', 'apliiq', true, true),
  ('80000000-0000-4000-8000-000000000020', 'TEMPO Warmup Hoodie', 'tempo-warmup-hoodie', '', 6800, 'Black', '#161616', array['S','M','L','XL','XXL'], 'hoodie', 'apliiq', true, true),
  ('80000000-0000-4000-8000-000000000021', 'TEMPO Training Tee', 'tempo-training-tee', '', 3400, 'White', '#F7F7F5', array['S','M','L','XL','XXL'], 'tshirt', 'tapstitch', true, true)
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

-- verify: expect five rows
select id, name, price_cents, product_category, supplier_type, is_active, available_for_sale
from public.products
where id between '80000000-0000-4000-8000-000000000017' and '80000000-0000-4000-8000-000000000021'
order by id;

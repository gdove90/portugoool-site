-- 0035: products rows for the remade GOOOL Core Hoodie (two rows, one
-- per print set).
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id). Since 2026-09-24 the order store upserts the catalog row
-- itself before writing items (SupabaseStore.ensureProductRows in
-- src/lib/orders-store.ts), so a missing row can no longer lose an
-- order's lines; this file keeps the audit trail and the name sync, as
-- 0033 and 0034 do.
--
-- ...0002 already has a row (old name "GOOOL Core Hoodie") and is renamed
-- here; ...0006 is new. Both products are availableForSale in
-- products.ts (owner: "no shirt not available for sale unless I say so").
--
-- Apply via the Supabase dashboard SQL editor (the established workflow;
-- the org-scoped MCP connector cannot see this project). Idempotent.
-- NOT YET APPLIED from the workstation (2026-09-24).

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('70000000-0000-4000-8000-000000000002', 'GOOOL Core Hoodie · Red',
   'goool-heavyweight-hoodie', '', 7800, 'Black', '#1E1E1E',
   array['S','M','L','XL','XXL'], 'hoodie', 'apliiq', true, true),
  ('70000000-0000-4000-8000-000000000006', 'GOOOL Core Hoodie · Club Blue',
   'goool-heavyweight-hoodie-blue', '', 7800, 'Black', '#1E1E1E',
   array['S','M','L','XL','XXL'], 'hoodie', 'apliiq', true, true)
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

-- verify: expect two rows
select id, name, slug, color, price_cents, is_active, available_for_sale
from public.products
where id in ('70000000-0000-4000-8000-000000000002',
             '70000000-0000-4000-8000-000000000006')
order by id;

-- 0040: products rows for the GOAL Athletics IND4000 hoodies (three rows,
-- Heritage, Minimal and Lockup, four colourways each; owner handoff v2
-- 2026-10-14; Big Stack dropped).
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id). The order store upserts the catalog row itself before
-- writing items (SupabaseStore.ensureProductRows in
-- src/lib/orders-store.ts); this file keeps the audit trail, as 0033 to
-- 0035 and 0039 do.
--
-- All three rows are hidden (is_active false) with price_cents 0 ("Price
-- to be announced") until the owner sets prices. Re-run with the real
-- prices and flags in the same commit that publishes them.
--
-- Apply via the Supabase dashboard SQL editor (the established workflow;
-- the org-scoped MCP connector cannot see this project). Idempotent.
-- NOT YET APPLIED (2026-10-14).

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000013', 'GOAL Athletics Heritage Hoodie',
   'goal-athletics-heritage-hoodie', '', 0, 'Black', '#1E1E1E',
   array['S','M','L','XL','XXL'], 'hoodie', 'apliiq', false, false),
  ('80000000-0000-4000-8000-000000000014', 'GOAL Athletics Minimal Hoodie',
   'goal-athletics-minimal-hoodie', '', 0, 'Black', '#1E1E1E',
   array['S','M','L','XL','XXL'], 'hoodie', 'apliiq', false, false),
  ('80000000-0000-4000-8000-000000000015', 'GOAL Athletics Lockup Hoodie',
   'goal-athletics-lockup-hoodie', '', 0, 'Black', '#1E1E1E',
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

-- verify: expect three rows
select id, name, slug, color, price_cents, is_active, available_for_sale
from public.products
where id in ('80000000-0000-4000-8000-000000000013',
             '80000000-0000-4000-8000-000000000014',
             '80000000-0000-4000-8000-000000000015')
order by id;

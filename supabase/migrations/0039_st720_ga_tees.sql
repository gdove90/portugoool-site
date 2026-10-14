-- 0039: products rows for the GOAL Athletics ST720 GA tees (two rows,
-- Minimal and Big, six colourways each; owner handoff 2026-10-14).
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id). The order store upserts the catalog row itself before
-- writing items (SupabaseStore.ensureProductRows in
-- src/lib/orders-store.ts); this file keeps the audit trail, as 0033 to
-- 0035 do.
--
-- Both rows are hidden (is_active false) with price_cents 0 ("Price to
-- be announced") until the owner sets the price. Re-run with the real
-- price and flags in the same commit that publishes them.
--
-- Apply via the Supabase dashboard SQL editor (the established workflow;
-- the org-scoped MCP connector cannot see this project). Idempotent.
-- NOT YET APPLIED (2026-10-14).

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000011', 'GOAL Athletics GA Minimal Tee',
   'goal-athletics-ga-minimal-tee', '', 0, 'Black', '#373737',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', false, false),
  ('80000000-0000-4000-8000-000000000012', 'GOAL Athletics GA Big Tee',
   'goal-athletics-ga-big-tee', '', 0, 'Black', '#373737',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', false, false)
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
where id in ('80000000-0000-4000-8000-000000000011',
             '80000000-0000-4000-8000-000000000012')
order by id;

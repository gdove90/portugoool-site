-- 0034: products rows for the two 3010 Casual Wordmark Tee products.
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id). A product that exists only in src/lib/products.ts can be
-- added to a cart and paid for (checkout bypasses availableForSale under
-- a test key with CHECKOUT_TEST_MODE), and then the line-item insert
-- fails the FK: the webhook 500s, Stripe retries, and the order sits with
-- no items. That is the failure migration 0031 was written to clear and
-- the reason 0033 shipped with the caps.
--
-- On 2026-09-24 the owner split the casual tee into one shop row per
-- print colour. ...0003 already has a row (old name "GOOOL Casual
-- Wordmark Tee") and is renamed here; ...0005 is new.
--
-- Apply via the Supabase dashboard SQL editor (the established workflow;
-- the org-scoped MCP connector cannot see this project). Idempotent.
--
-- NOT YET APPLIED. Both products stay available_for_sale = false in
-- products.ts and here until the owner opens purchasing; apply this
-- before that flag is ever flipped.

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('70000000-0000-4000-8000-000000000003', 'GOOOL Casual Wordmark Tee · Red',
   'goool-heavyweight-casual-tee', '', 4800, 'Black', '#111111',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', true, false),
  ('70000000-0000-4000-8000-000000000005', 'GOOOL Casual Wordmark Tee · Club Blue',
   'goool-heavyweight-casual-tee-blue', '', 4800, 'Natural', '#E8E2D3',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', true, false)
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
where id in ('70000000-0000-4000-8000-000000000003',
             '70000000-0000-4000-8000-000000000005')
order by id;

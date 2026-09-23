-- 0033: products rows for the two embroidered GOOOL Athletics caps.
--
-- WHY THIS EXISTS: order_items.product_id carries a FOREIGN KEY to
-- products(id). A product that exists only in src/lib/products.ts can be
-- added to a cart and paid for, and then the line-item insert fails the
-- FK -- the webhook 500s, Stripe retries forever, and the order sits with
-- no items, which fulfillment-submit then refuses. That is exactly the
-- failure migration 0031 was written to clear, and it is why both caps
-- ship with availableForSale FALSE until this has been applied.
--
-- Apply via the Supabase dashboard SQL editor (the established workflow;
-- the org-scoped MCP connector cannot see this project). Idempotent.
--
-- AFTER APPLYING: set availableForSale: true on both caps in
-- src/lib/products.ts and redeploy. Nothing here opens sales on its own.

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('80000000-0000-4000-8000-000000000007', 'GOOOL Athletics Badge Cap',
   'goool-athletics-badge-cap', '', 4800, 'Black/Natural', '#E4DFC9',
   array['OS'], 'hat', 'apliiq', true, false),
  ('80000000-0000-4000-8000-000000000008', 'GOOOL Athletics Stacked Cap',
   'goool-athletics-stacked-cap', '', 4800, 'Black/Natural', '#E4DFC9',
   array['OS'], 'hat', 'apliiq', true, false)
on conflict (id) do update
  set name              = excluded.name,
      slug              = excluded.slug,
      price_cents       = excluded.price_cents,
      color             = excluded.color,
      color_hex         = excluded.color_hex,
      sizes             = excluded.sizes,
      product_category  = excluded.product_category,
      supplier_type     = excluded.supplier_type,
      is_active         = excluded.is_active;

-- verify: expect two rows
-- select id, name, slug, price_cents, available_for_sale
--   from public.products
--  where id in ('80000000-0000-4000-8000-000000000007',
--               '80000000-0000-4000-8000-000000000008');

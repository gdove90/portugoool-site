-- 0031: catalog/FK parity for every purchasable product.
--
-- WHY THIS EXISTS (found 2026-09-21 during the first end-to-end
-- test-mode payment): order_items.product_id has a FOREIGN KEY to
-- products(id), but the six GOOOL Athletics products (8000...) had
-- never been inserted -- migrations 0027, 0028 and 0029 were written
-- and committed but never applied to the live project (there is no
-- supabase_migrations tracking table; migrations are run by hand).
--
-- Effect of the gap: a paid checkout containing an Athletics product
-- created the orders row, then failed the order_items insert on the
-- FK. The webhook returned 500, Stripe retried forever, and the order
-- sat with no line items -- which fulfillment-submit then refuses
-- ("Order has no persisted line items"). Money taken, order
-- unfulfillable. That is the failure this migration removes.
--
-- Scope: make a row exist for every id the checkout route can sell,
-- carrying the price, colour and size range currently in
-- src/lib/products.ts (still the storefront's source of truth).
-- available_for_sale stays FALSE on all ten -- this migration does
-- not open sales, it only makes the FK satisfiable. Idempotent.
--
-- Apply via the Supabase dashboard SQL editor (established workflow).

insert into public.products
  (id, name, slug, description, price_cents, color, color_hex,
   sizes, product_category, supplier_type, is_active, available_for_sale)
values
  ('70000000-0000-4000-8000-000000000001', 'GOOOL Performance Badge Tee',
   'goool-performance-tee', '', 3800, 'Black', '#0A0A0A',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', true, false),
  ('70000000-0000-4000-8000-000000000002', 'GOOOL Core Hoodie',
   'goool-heavyweight-hoodie', '', 6800, 'Black', '#0A0A0A',
   array['S','M','L','XL','XXL'], 'hoodie', 'apliiq', true, false),
  ('70000000-0000-4000-8000-000000000003', 'GOOOL Casual Wordmark Tee',
   'goool-heavyweight-casual-tee', '', 3800, 'Washed Black', '#2E2E30',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', true, false),
  ('70000000-0000-4000-8000-000000000004', 'GOOOL Touchline Cap',
   'goool-touchline-cap', '', 4800, 'Black/Natural', '#E4DFC9',
   array['OS'], 'hat', 'apliiq', true, false),
  ('80000000-0000-4000-8000-000000000001', 'GOOOL Athletics Modern Sport Tee',
   'goool-athletics-modern-sport-tee', '', 6400, 'Black', '#0A0A0A',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', true, false),
  ('80000000-0000-4000-8000-000000000002', 'GOOOL Athletics Varsity Tee',
   'goool-athletics-varsity-tee', '', 4800, 'Washed Black', '#262626',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', true, false),
  ('80000000-0000-4000-8000-000000000003', 'GOOOL Athletics Minimal Club Tee',
   'goool-athletics-minimal-club-tee', '', 4600, 'Natural', '#E5E5DD',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', true, false),
  ('80000000-0000-4000-8000-000000000004', 'GOOOL Athletics Circular Badge Tee',
   'goool-athletics-circular-badge-tee', '', 3500, 'Ivory', '#E9E1D7',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', true, false),
  ('80000000-0000-4000-8000-000000000005', 'GOOOL Athletics Circular Center Crewneck',
   'goool-athletics-circular-center-crewneck', '', 8800, 'Gray Heather', '#B2B2B2',
   array['S','M','L','XL','XXL'], 'casual', 'apliiq', true, false),
  ('80000000-0000-4000-8000-000000000006', 'GOOOL Athletics Modern Sport Performance Tee',
   'goool-athletics-modern-sport-performance-tee', '', 3800, 'Black', '#0A0A0A',
   array['S','M','L','XL','XXL'], 'tshirt', 'apliiq', true, false)
on conflict (id) do update set
  name              = excluded.name,
  slug              = excluded.slug,
  price_cents       = excluded.price_cents,
  color             = excluded.color,
  color_hex         = excluded.color_hex,
  sizes             = excluded.sizes,
  product_category  = excluded.product_category,
  supplier_type     = excluded.supplier_type,
  is_active         = true,
  available_for_sale = false;

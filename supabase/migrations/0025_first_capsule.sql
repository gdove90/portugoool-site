-- 0025: The First Capsule (Apliiq, four products, Coming Soon).
-- Idempotent: safe to run more than once.
-- 1) availability gate  2) 'hoodie' category  3) archive the six current
-- actives (recoverable flip)  4) upsert the four capsule products as
-- active but NOT available for sale. No rows are deleted.

alter table public.products
  add column if not exists available_for_sale boolean not null default true;

alter table public.products drop constraint if exists products_product_category_check;
alter table public.products add constraint products_product_category_check
  check (product_category in ('jersey', 'casual', 'tshirt', 'hoodie', 'accessory', 'hat'));

update public.products set is_active = false
where slug in (
  'crest-statement-tee-cream', 'crest-statement-tee-faded-black',
  'crest-statement-tee-faded-navy', 'goool-oval-tee',
  'goool-cap-black', 'goool-cap-white'
);

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active, available_for_sale,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '70000000-0000-4000-8000-000000000001', 'GOOOL Performance Badge Tee', 'goool-performance-tee',
  'Lightweight training tee with the GOOOL crest printed at the visual center of the chest. Athletic fit, taped neck, blank back. Black.',
  4800, null, 'Black', '#0A0A0A',
  '3.8 oz 100% recycled polyester with PosiCharge (Sport-Tek ST720).',
  'Athletic fit. True to size.', 'Machine wash cold. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/GOOOL_MOCKUP_01_ST720_PERFORMANCE_TEE_BLACK.png", "alt": "GOOOL Performance Badge Tee in black, front view with the centered GOOOL crest"}, {"src": "/products/GOOOL_LIFESTYLE_01_ST720_PERFORMANCE_TEE_SOCCER_FIELD.png", "alt": "GOOOL Performance Badge Tee worn on a soccer field"}]'::jsonb,
  array['S','M','L','XL','XXL'], 'tshirt', 'printful', true, false,
  false, null, null, 0, false, false, 0
),
(
  '70000000-0000-4000-8000-000000000002', 'GOOOL Core Hoodie', 'goool-heavyweight-hoodie',
  'Heavyweight pullover hoodie with the underlined GOOOL wordmark centered across the chest. Generous fit, kangaroo pocket, blank back. Black.',
  7800, null, 'Black', '#0A0A0A',
  '10 oz (330 gsm) 3-end fleece, 70/30 cotton-poly with 100% cotton face yarn (Independent Trading Co. IND4000).',
  'Generous, relaxed fit.', 'Machine wash cold. Tumble dry low. Do not iron the print.',
  '[{"src": "/products/GOOOL_MOCKUP_02_IND4000_HOODIE_BLACK.png", "alt": "GOOOL Core Hoodie in black, front view with the centered underlined GOOOL wordmark"}, {"src": "/products/GOOOL_LIFESTYLE_02_IND4000_HOODIE_STADIUM_TUNNEL.png", "alt": "GOOOL Core Hoodie worn in a stadium tunnel"}]'::jsonb,
  array['S','M','L','XL','XXL'], 'hoodie', 'printful', true, false,
  false, null, null, 0, false, false, 0
),
(
  '70000000-0000-4000-8000-000000000003', 'GOOOL Casual Wordmark Tee', 'goool-heavyweight-casual-tee',
  'Garment-dyed heavyweight cotton tee in washed black. Relaxed fit, semi-dropped shoulder, the underlined GOOOL wordmark centered across the chest. Blank back.',
  3800, null, 'Washed Black', '#2E2E30',
  '6.5 oz 100% ring-spun cotton, garment-dyed (Bella+Canvas 4810GD).',
  'Relaxed heavyweight fit, semi-dropped shoulder.', 'Machine wash cold with like colors. Tumble dry low.',
  '[{"src": "/products/GOOOL_MOCKUP_03_4810GD_CASUAL_TEE_WASHED_BLACK.png", "alt": "GOOOL Casual Wordmark Tee in washed black, front view with the centered underlined GOOOL wordmark"}, {"src": "/products/GOOOL_LIFESTYLE_03_4810GD_CASUAL_TEE_SOCCER_FIELD.png", "alt": "GOOOL Casual Wordmark Tee worn on a soccer field"}]'::jsonb,
  array['S','M','L','XL','XXL'], 'tshirt', 'printful', true, false,
  false, null, null, 0, false, false, 0
),
(
  '70000000-0000-4000-8000-000000000004', 'GOOOL Touchline Cap', 'goool-touchline-cap',
  'Structured five-panel cap in black and natural. Flat-embroidered GOOOL wordmark centered on the front panel, curved visor, adjustable snap. Blank back.',
  3600, null, 'Black/Natural', '#E8E0CE',
  '65/35 polyester-cotton twill with firm buckram front (OTTO 31-069).',
  'Adjustable - One Size. Structured mid-profile crown.', 'Spot clean only.',
  '[{"src": "/products/GOOOL_MOCKUP_04_OTTO31069_CAP_BLACK_NATURAL.png", "alt": "GOOOL Touchline Cap in black and natural, front view with the embroidered GOOOL wordmark"}, {"src": "/products/GOOOL_LIFESTYLE_04_OTTO31069_CAP_STADIUM.png", "alt": "GOOOL Touchline Cap worn in a stadium"}]'::jsonb,
  array['OS'], 'hat', 'printful', true, false,
  false, null, null, 0, false, false, 0
)
on conflict (slug) do update set
  is_active = true,
  available_for_sale = false,
  price_cents = excluded.price_cents,
  images = excluded.images,
  description = excluded.description;

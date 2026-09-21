-- 0029: GOOOL Athletics Modern Sport Performance Tee (owner-authorized
-- 2026-09-21, Coming Soon, unpriced). Idempotent. Mirrors
-- src/lib/products.ts (same UUID). Separate product from the cotton
-- Modern Sport tee; performance blank is UNVERIFIED with the supplier.
-- Apply via the Supabase dashboard SQL editor (established workflow).

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active, available_for_sale,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '80000000-0000-4000-8000-000000000006', 'GOOOL Athletics Modern Sport Performance Tee', 'goool-athletics-modern-sport-performance-tee',
  'The Modern Sport graphic on a performance training tee: white GOOOL with a red underline and spaced ATHLETICS across the chest, small white GOOOL Athletics mark at the upper back. Black athletic-fit crewneck.',
  0, null, 'Black', '#0A0A0A',
  'Performance polyester training tee. Blank, fabric weight and construction are confirmed at sample approval.',
  'Athletic fit. Confirmed at sample approval.',
  'Care instructions follow the approved blank and print process.',
  '[{"src": "/products/GOOOL_ATHLETICS_MODERN_SPORT_PERF_FRONT.webp", "alt": "GOOOL Athletics Modern Sport Performance Tee in black, front view with the white GOOOL wordmark, red underline and ATHLETICS", "caption": "Concept render. Not a photograph of a manufactured sample."}]'::jsonb,
  array['S','M','L','XL','XXL'], 'tshirt', 'unassigned', true, false,
  false, null, null, 0, false, false, 0
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  images = excluded.images;

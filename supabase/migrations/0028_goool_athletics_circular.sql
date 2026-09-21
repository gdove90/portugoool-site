-- 0028: GOOOL Athletics circular-logo additions (GA-CIRCLE-08 and -09,
-- Coming Soon, unpriced). Idempotent: safe to run more than once.
-- Mirrors src/lib/products.ts (same UUIDs). Source:
-- designs/16_goool_athletics/circular_logo/ (2026-09-20 handoff packet;
-- proposed blanks Comfort Colors 1717 and AS Colour 5150 are UNVERIFIED
-- with Apliiq; no price, size range or supplier mapping confirmed).
-- price_cents 0 = "Price to be announced"; the checkout route refuses
-- unpriced, unavailable and unmapped products server-side.
-- Apply via the Supabase dashboard SQL editor (established workflow).

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active, available_for_sale,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '80000000-0000-4000-8000-000000000004', 'GOOOL Athletics Circular Badge Tee', 'goool-athletics-circular-badge-tee',
  'Circular GOOOL Athletics mark in navy at the wearer''s left chest: GOOOL arcs over the top, ATHLETICS around the bottom, the letters alone forming the circle. Ivory crewneck tee.',
  0, null, 'Ivory', '#E9E1D7',
  'Premium heavyweight cotton crewneck tee, ivory. Blank and fabric weight are confirmed at sample approval.',
  'Relaxed body with a moderate dropped shoulder.',
  'Care instructions follow the approved blank and print process.',
  '[{"src": "/products/GOOOL_ATHLETICS_CIRCLE_08_BADGE_TEE.webp", "alt": "GOOOL Athletics Circular Badge Tee: navy circular GOOOL Athletics mark at the left chest of an ivory tee", "caption": "Concept render at the proposed logo size and placement. Not a photo of a finished garment."}]'::jsonb,
  array['S','M','L','XL','XXL'], 'tshirt', 'unassigned', true, false,
  false, null, null, 0, false, false, 0
),
(
  '80000000-0000-4000-8000-000000000005', 'GOOOL Athletics Circular Center Crewneck', 'goool-athletics-circular-center-crewneck',
  'Circular GOOOL Athletics mark in forest green, small and centered on the upper chest: GOOOL arcs over the top, ATHLETICS around the bottom, the letters alone forming the circle. Gray heather crewneck sweatshirt.',
  0, null, 'Gray Heather', '#C7C7C9',
  'Premium heavyweight fleece crewneck, gray heather, rib collar, cuffs and hem. Blank and fabric weight are confirmed at sample approval.',
  'Relaxed body with a moderate dropped shoulder.',
  'Care instructions follow the approved blank and print process.',
  '[{"src": "/products/GOOOL_ATHLETICS_CIRCLE_09_CENTER_CREWNECK.webp", "alt": "GOOOL Athletics Circular Center Crewneck: small forest-green circular GOOOL Athletics mark centered on the upper chest of a gray heather crewneck", "caption": "Concept render at the proposed logo size and placement. Not a photo of a finished garment."}]'::jsonb,
  array['S','M','L','XL','XXL'], 'hoodie', 'unassigned', true, false,
  false, null, null, 0, false, false, 0
)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  images = excluded.images;

-- 0027: GOOOL Athletics concept line (three tees, Coming Soon, not for sale).
-- Idempotent: safe to run more than once. Mirrors src/lib/products.ts
-- (same UUIDs). Source: designs/16_goool_athletics/GOOOL_ATHLETICS_POD_Packet_v1.pdf
-- (v1, 18 Sep 2026, quoting stage: no blank, size range or supplier
-- confirmed). Retail set 2026-09-19: $44 / $48 / $44 (basis in the design
-- README). The checkout route refuses unavailable and unmapped products.
-- Apply via the Supabase dashboard SQL editor (established workflow).

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active, available_for_sale,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
(
  '80000000-0000-4000-8000-000000000001', 'GOOOL Athletics Modern Sport Tee', 'goool-athletics-modern-sport-tee',
  'Bold, forward-leaning GOOOL in white across the chest, a red underline, and widely spaced ATHLETICS beneath. Small white GOOOL Athletics mark at the upper back. Solid black crewneck.',
  4400, null, 'Black', '#0A0A0A',
  'Premium cotton crewneck tee, opaque, rib collar. Blank and fabric weight are confirmed at sample approval.',
  'Relaxed body with a moderate dropped shoulder.',
  'Care instructions follow the approved blank and print process.',
  '[{"src": "/products/GOOOL_ATHLETICS_01_MODERN_SPORT_FRONT.webp", "alt": "GOOOL Athletics Modern Sport Tee, front: white GOOOL wordmark with red underline and ATHLETICS on a black tee", "caption": "Artwork illustration at the proposed print size and placement. Not a photo of a finished garment."}, {"src": "/products/GOOOL_ATHLETICS_01_MODERN_SPORT_BACK.webp", "alt": "GOOOL Athletics Modern Sport Tee, back: small white GOOOL Athletics mark below the collar", "caption": "Artwork illustration at the proposed print size and placement. Not a photo of a finished garment."}, {"src": "/products/GOOOL_ATHLETICS_01_MODERN_SPORT_CONCEPT.webp", "alt": "Concept render of the GOOOL Athletics Modern Sport Tee, front and back", "caption": "Concept render from the design brief. Not a photograph of a manufactured sample."}]'::jsonb,
  array['S','M','L','XL','XXL'], 'tshirt', 'unassigned', true, false,
  false, null, null, 0, false, false, 0
),
(
  '80000000-0000-4000-8000-000000000002', 'GOOOL Athletics Varsity Tee', 'goool-athletics-varsity-tee',
  'Arched collegiate GOOOL in warm ivory with a thin dark red outline, ATHLETICS below between short rules. Small ivory GOOOL Athletics mark at the upper back. Washed black crewneck.',
  4800, null, 'Washed Black', '#2E2E30',
  'Premium cotton crewneck tee, garment-dyed washed black, opaque, rib collar. Blank and fabric weight are confirmed at sample approval.',
  'Relaxed body with a moderate dropped shoulder.',
  'Care instructions follow the approved blank and print process.',
  '[{"src": "/products/GOOOL_ATHLETICS_02_VARSITY_FRONT.webp", "alt": "GOOOL Athletics Varsity Tee, front: arched ivory GOOOL with dark red outline and ATHLETICS on a washed black tee", "caption": "Artwork illustration at the proposed print size and placement. Not a photo of a finished garment."}, {"src": "/products/GOOOL_ATHLETICS_02_VARSITY_BACK.webp", "alt": "GOOOL Athletics Varsity Tee, back: small ivory GOOOL Athletics mark below the collar", "caption": "Artwork illustration at the proposed print size and placement. Not a photo of a finished garment."}, {"src": "/products/GOOOL_ATHLETICS_02_VARSITY_CONCEPT.webp", "alt": "Concept render of the GOOOL Athletics Varsity Tee, front and back", "caption": "Concept render from the design brief. Not a photograph of a manufactured sample."}]'::jsonb,
  array['S','M','L','XL','XXL'], 'tshirt', 'unassigned', true, false,
  false, null, null, 0, false, false, 0
),
(
  '80000000-0000-4000-8000-000000000003', 'GOOOL Athletics Minimal Club Tee', 'goool-athletics-minimal-club-tee',
  'Small black GOOOL Athletics mark at the left chest. Large black GOOOL and ATHLETICS across the upper back with a single red underline. Natural cream crewneck.',
  4400, null, 'Natural', '#E9E2D2',
  'Premium cotton crewneck tee, natural cream, opaque, rib collar. Blank and fabric weight are confirmed at sample approval.',
  'Relaxed body with a moderate dropped shoulder.',
  'Care instructions follow the approved blank and print process.',
  '[{"src": "/products/GOOOL_ATHLETICS_03_MINIMAL_CLUB_FRONT.webp", "alt": "GOOOL Athletics Minimal Club Tee, front: small black GOOOL Athletics mark at the left chest of a natural cream tee", "caption": "Artwork illustration at the proposed print size and placement. Not a photo of a finished garment."}, {"src": "/products/GOOOL_ATHLETICS_03_MINIMAL_CLUB_BACK.webp", "alt": "GOOOL Athletics Minimal Club Tee, back: large black GOOOL and ATHLETICS with a red underline across the upper back", "caption": "Artwork illustration at the proposed print size and placement. Not a photo of a finished garment."}, {"src": "/products/GOOOL_ATHLETICS_03_MINIMAL_CLUB_CONCEPT.webp", "alt": "Concept render of the GOOOL Athletics Minimal Club Tee, front and back", "caption": "Concept render from the design brief. Not a photograph of a manufactured sample."}]'::jsonb,
  array['S','M','L','XL','XXL'], 'tshirt', 'unassigned', true, false,
  false, null, null, 0, false, false, 0
)
on conflict (slug) do update set
  is_active = true,
  available_for_sale = false,
  price_cents = excluded.price_cents,
  images = excluded.images,
  description = excluded.description;

-- ─────────────────────────────────────────────────────────────
-- PORTUGOOOL — seed products (Drop Version I launch catalog)
-- Mirrors src/lib/products.ts exactly (same UUIDs), so the frontend
-- can switch from mock data to Supabase without any id churn.
-- ─────────────────────────────────────────────────────────────

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   product_category, supplier_type, is_active,
   is_limited_drop, drop_version, drop_limit, drop_sold_count,
   allow_custom_name, allow_custom_number, customization_price_cents)
values
  -- ── Performance Jersey Collection (Drop Version I · 500 each) ──
  (
    '10000000-0000-4000-8000-000000000001',
    'Home Red Jersey', 'home-red-jersey',
    'The one you wear when it matters. Silky, four-way stretch performance knit made for the moment it goes in.',
    9500, null, 'Deep Red', '#C1121F',
    '150 GSM performance knit. 95% polyester, 5% elastane. Four-way stretch, moisture-wicking, silky smooth finish with a breathable athletic feel.',
    'Athletic fit. True to size. Size up for a relaxed feel.',
    'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
    '[{"src": "/products/home-red-jersey.svg", "alt": "Home Red Jersey — front"}, {"src": "/products/home-red-jersey-back.svg", "alt": "Home Red Jersey — back with custom name and number"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    'jersey', 'unassigned', true,
    true, 'I', 500, 212, true, true, 1500
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Away White Jersey', 'away-white-jersey',
    'Clean and loud at the same time. A crisp away-style jersey that shows up in every crowd photo.',
    9500, null, 'White', '#FFFFFF',
    '150 GSM performance knit. 95% polyester, 5% elastane. Four-way stretch, moisture-wicking, silky smooth finish with a breathable athletic feel.',
    'Athletic fit. True to size. Size up for a relaxed feel.',
    'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
    '[{"src": "/products/away-white-jersey.svg", "alt": "Away White Jersey — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    'jersey', 'unassigned', true,
    true, 'I', 500, 148, true, true, 1500
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'Blackout Edition Jersey', 'blackout-edition-jersey',
    'All black, gold detail, zero apologies. The limited edition for fans who don''t need to be told the score.',
    10500, null, 'Black', '#0A0A0A',
    '150 GSM performance knit. 95% polyester, 5% elastane. Four-way stretch, moisture-wicking, silky smooth finish with a breathable athletic feel.',
    'Athletic fit. True to size. Size up for a relaxed feel.',
    'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
    '[{"src": "/products/blackout-edition-jersey.svg", "alt": "Blackout Edition Jersey — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    'jersey', 'unassigned', true,
    true, 'I', 500, 373, true, true, 1500
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'Emerald Edition Jersey', 'emerald-edition-jersey',
    'Deep green with gold accents. A nation''s color, cut for match day and everything after.',
    10500, null, 'Emerald Green', '#0B3D2E',
    '150 GSM performance knit. 95% polyester, 5% elastane. Four-way stretch, moisture-wicking, silky smooth finish with a breathable athletic feel.',
    'Athletic fit. True to size. Size up for a relaxed feel.',
    'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
    '[{"src": "/products/emerald-edition-jersey.svg", "alt": "Emerald Edition Jersey — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    'jersey', 'unassigned', true,
    true, 'I', 500, 84, true, true, 1500
  ),

  -- ── Casual Shirt Collection ─────────────────────────────────
  (
    '20000000-0000-4000-8000-000000000001',
    'PORTUGOOOL Brush Script Tee', 'brush-script-tee',
    'The brand name in one loud stroke. Soft, heavy, and easy to live in.',
    4200, null, 'Black', '#0A0A0A',
    '180 GSM soft-touch cotton-poly blend. Holds color, holds shape, feels broken-in from day one. DTG/DTF print compatible.',
    'Relaxed fit. Between sizes? Stay true.',
    'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
    '[{"src": "/products/brush-script-tee.svg", "alt": "PORTUGOOOL Brush Script Tee — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    'casual', 'unassigned', true,
    false, null, null, 0, false, false, 0
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'GOOOOOOOL!!! Tee', 'goool-tee',
    'The whole moment in one word. Wear the celebration.',
    4400, null, 'Deep Red', '#C1121F',
    '180 GSM soft-touch cotton-poly blend. Holds color, holds shape, feels broken-in from day one. DTG/DTF print compatible.',
    'Relaxed fit. Between sizes? Stay true.',
    'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
    '[{"src": "/products/goool-tee.svg", "alt": "GOOOOOOOL!!! Tee — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    'casual', 'unassigned', true,
    false, null, null, 0, false, false, 0
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    'Vamos Portugooool Tee', 'vamos-tee',
    'For the ones who start the chant. Soft-touch blend built for watch parties.',
    4200, null, 'Emerald Green', '#0B3D2E',
    '180 GSM soft-touch cotton-poly blend. Holds color, holds shape, feels broken-in from day one. DTG/DTF print compatible.',
    'Relaxed fit. Between sizes? Stay true.',
    'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
    '[{"src": "/products/vamos-tee.svg", "alt": "Vamos Portugooool Tee — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    'casual', 'unassigned', true,
    false, null, null, 0, false, false, 0
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    'From Lisbon to the World Tee', 'lisbon-to-the-world-tee',
    'One city, every living room, every corner bar. This one travels.',
    4500, null, 'White', '#FFFFFF',
    '180 GSM soft-touch cotton-poly blend. Holds color, holds shape, feels broken-in from day one. DTG/DTF print compatible.',
    'Relaxed fit. Between sizes? Stay true.',
    'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
    '[{"src": "/products/lisbon-to-the-world-tee.svg", "alt": "From Lisbon to the World Tee — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    'casual', 'unassigned', true,
    false, null, null, 0, false, false, 0
  ),
  (
    '20000000-0000-4000-8000-000000000005',
    'Match Day Tee', 'match-day-tee',
    'Some days are just different. Dress accordingly.',
    3800, null, 'Smoke Grey', '#9CA3AF',
    '180 GSM soft-touch cotton-poly blend. Holds color, holds shape, feels broken-in from day one. DTG/DTF print compatible.',
    'Relaxed fit. Between sizes? Stay true.',
    'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
    '[{"src": "/products/match-day-tee.svg", "alt": "Match Day Tee — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    'casual', 'unassigned', true,
    false, null, null, 0, false, false, 0
  ),
  (
    '20000000-0000-4000-8000-000000000006',
    'We Don''t Whisper Goals Tee', 'we-dont-whisper-goals-tee',
    'Heavyweight, oversized, and honest about who you are during a match.',
    4800, null, 'Black', '#0A0A0A',
    '220 GSM heavyweight polyester blend. Soft-touch finish with real weight and structure. DTG/DTF print compatible.',
    'Oversized fit. Drops loose on purpose. Size down for a standard fit.',
    'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
    '[{"src": "/products/we-dont-whisper-goals-tee.svg", "alt": "We Don''t Whisper Goals Tee — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    'casual', 'unassigned', true,
    false, null, null, 0, false, false, 0
  ),

  -- ── Accessory Collection ────────────────────────────────────
  (
    '30000000-0000-4000-8000-000000000001',
    'Supporters Scarf', 'supporters-scarf',
    'Double-sided knit scarf. Raise it at kickoff, wear it home after.',
    2800, null, 'Red / Green', '#C1121F',
    'Double-sided acrylic knit with fringed ends. Stadium-weight.',
    'One size · 145 × 18 cm.',
    'Spot clean or hand wash cold. Lay flat to dry.',
    '[{"src": "/products/supporters-scarf.svg", "alt": "Supporters Scarf"}]'::jsonb,
    array['OS'],
    'accessory', 'unassigned', true,
    false, null, null, 0, false, false, 0
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    'GOOOOOL Cap', 'goool-cap',
    'Low-profile cap with the sound of victory stitched on the front.',
    3000, null, 'Black', '#0A0A0A',
    'Brushed cotton twill, embroidered front, adjustable strap.',
    'One size · adjustable.',
    'Spot clean or hand wash cold. Lay flat to dry.',
    '[{"src": "/products/goool-cap.svg", "alt": "GOOOOOL Cap"}]'::jsonb,
    array['OS'],
    'accessory', 'unassigned', true,
    false, null, null, 0, false, false, 0
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    'Sticker Pack', 'sticker-pack',
    'Six die-cut stickers. Laptops, bottles, and anything else that needs more noise.',
    600, null, 'Multi', '#C9A227',
    'Weatherproof vinyl, matte finish. Six designs per pack.',
    'One size · 5–8 cm each.',
    'Dishwasher-safe. Peel and place once.',
    '[{"src": "/products/sticker-pack.svg", "alt": "Sticker Pack — six die-cut stickers"}]'::jsonb,
    array['OS'],
    'accessory', 'unassigned', true,
    false, null, null, 0, false, false, 0
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    'Terrace Flag', 'terrace-flag',
    '90 × 150 cm of pure celebration. For balconies, backyards, and full-time whistles.',
    2400, null, 'Red / Green / Gold', '#0B3D2E',
    'Lightweight knitted polyester with reinforced grommets.',
    'One size · 90 × 150 cm.',
    'Spot clean or hand wash cold. Lay flat to dry.',
    '[{"src": "/products/terrace-flag.svg", "alt": "Terrace Flag"}]'::jsonb,
    array['OS'],
    'accessory', 'unassigned', true,
    false, null, null, 0, false, false, 0
  )
on conflict (slug) do nothing;

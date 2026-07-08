-- ─────────────────────────────────────────────────────────────
-- PORTUGOOOL — seed products (Drop 01)
-- Mirrors src/lib/products.ts exactly (same UUIDs), so the frontend
-- can switch from mock data to Supabase without any id churn.
-- ─────────────────────────────────────────────────────────────

insert into public.products
  (id, name, slug, description, price_cents, compare_at_price_cents,
   color, color_hex, fabric, fit, care_instructions, images, sizes,
   is_active, is_limited_drop, inventory_display_count,
   custom_name_available, custom_number_available)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Red Match Day Shirt',
    'red-match-day',
    'Lightweight, smooth, and built for the moment. A breathable performance-style shirt made for match day, watch parties, and every goal celebration.',
    4500, 5500,
    'Deep Red', '#C1121F',
    '150 GSM performance polyester (92–100% poly, up to 8% elastane). Moisture-wicking, sublimation-friendly, silky smooth hand feel.',
    'Athletic fit. True to size. Size up for a relaxed feel.',
    'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
    '[{"src": "/products/red-match-day.svg", "alt": "Red Match Day Shirt — front"}, {"src": "/products/red-match-day-back.svg", "alt": "Red Match Day Shirt — back"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    true, true, 40, true, true
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Black GOOOOOL Shirt',
    'black-goool',
    'The sound of the goal, printed in gold. Silky performance fabric that keeps up from kickoff to full time.',
    4500, null,
    'Black', '#0A0A0A',
    '150 GSM performance polyester (92–100% poly, up to 8% elastane). Moisture-wicking, sublimation-friendly, silky smooth hand feel.',
    'Athletic fit. True to size. Size up for a relaxed feel.',
    'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
    '[{"src": "/products/black-goool.svg", "alt": "Black GOOOOOL Shirt — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    true, true, 60, true, true
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'White Celebration Shirt',
    'white-celebration',
    'Clean, bright, and made to be seen. A crisp match-day shirt for the moment the whole room erupts.',
    4500, null,
    'White', '#FFFFFF',
    '150 GSM performance polyester (92–100% poly, up to 8% elastane). Moisture-wicking, sublimation-friendly, silky smooth hand feel.',
    'Athletic fit. True to size. Size up for a relaxed feel.',
    'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
    '[{"src": "/products/white-celebration.svg", "alt": "White Celebration Shirt — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    true, false, null, true, true
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Green Nation Shirt',
    'green-nation',
    'Dark green, gold detail, zero noise. A premium everyday shirt with match-day blood.',
    4200, null,
    'Dark Green', '#0B3D2E',
    '190 GSM soft-touch cotton-poly blend. DTG/DTF print compatible with a relaxed streetwear drape.',
    'Relaxed streetwear fit. Between sizes? Stay true.',
    'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
    '[{"src": "/products/green-nation.svg", "alt": "Green Nation Shirt — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    true, false, null, true, true
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Gold Voice Shirt',
    'gold-voice',
    'For the loudest voice in the room. Gold-accent performance shirt, light enough to wear until the final whistle.',
    4800, 5800,
    'Gold', '#C9A227',
    '150 GSM performance polyester (92–100% poly, up to 8% elastane). Moisture-wicking, sublimation-friendly, silky smooth hand feel.',
    'Athletic fit. True to size. Size up for a relaxed feel.',
    'Machine wash cold, inside out. No bleach. Hang dry. Do not iron the print.',
    '[{"src": "/products/gold-voice.svg", "alt": "Gold Voice Shirt — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    true, true, 25, true, true
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'Stadium Smoke Shirt',
    'stadium-smoke',
    'Soft grey, heavy presence. A relaxed streetwear shirt inspired by flare smoke over a full stadium.',
    4200, null,
    'Smoke Grey', '#9CA3AF',
    '190 GSM soft-touch cotton-poly blend. DTG/DTF print compatible with a relaxed streetwear drape.',
    'Relaxed streetwear fit. Between sizes? Stay true.',
    'Machine wash cold with like colors. Tumble dry low. Do not iron the print.',
    '[{"src": "/products/stadium-smoke.svg", "alt": "Stadium Smoke Shirt — front"}]'::jsonb,
    array['S','M','L','XL','XXL','3XL'],
    true, false, null, true, true
  )
on conflict (slug) do nothing;

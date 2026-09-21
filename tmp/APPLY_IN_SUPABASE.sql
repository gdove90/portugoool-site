-- ─────────────────────────────────────────────────────────────
-- 0026: Stripe webhook + Apliiq fulfillment integration.
--
-- Extends the existing orders/order_items tables (0001) with the
-- order snapshot the webhook persists, the Apliiq submission state
-- machine, webhook idempotency, and shipment tracking.
-- Apply via the Supabase dashboard SQL editor (established workflow).
-- ─────────────────────────────────────────────────────────────

-- Stripe webhook idempotency: first insert wins; replays are no-ops.
create table if not exists public.stripe_events (
  id text primary key,              -- Stripe event id (evt_…)
  type text not null,
  received_at timestamptz not null default now()
);
alter table public.stripe_events enable row level security;
-- service-role only (no public policies)

-- Order snapshot + Apliiq submission state.
alter table public.orders
  add column if not exists stripe_payment_intent text,
  add column if not exists amount_subtotal_cents integer,
  add column if not exists amount_shipping_cents integer,
  add column if not exists amount_tax_cents integer,
  add column if not exists currency text not null default 'usd',
  add column if not exists shipping_name text,
  add column if not exists shipping_address jsonb,
  add column if not exists apliiq_order_id text,
  add column if not exists submission_status text not null default 'not_submitted',
  add column if not exists submission_last_error text,
  -- payment mode from the Stripe event; gates real supplier submission
  add column if not exists livemode boolean not null default false,
  -- identity + start time of the submission attempt holding the lock:
  -- stale responses are discarded and live attempts are never reconciled
  add column if not exists submission_attempt_id text,
  add column if not exists submission_started_at timestamptz,
  add column if not exists paid_at timestamptz,
  add column if not exists submitted_at timestamptz,
  -- customer-facing lookup handle: unguessable, printed on confirmations
  add column if not exists lookup_token uuid not null default gen_random_uuid();

-- Submission state machine values (guarded in one place):
--   not_submitted      → order exists, payment not (yet) confirmed
--   pending_submission → paid, waiting to submit to Apliiq
--   submitting         → a worker holds the submission lock
--   submitted          → Apliiq returned 202 (received, NOT processed)
--   accepted           → Apliiq returned 200 with an order id
--   failed             → Apliiq rejected (4xx); manual fix then re-queue
--   needs_reconcile    → timeout/5xx; MUST reconcile before any retry
alter table public.orders
  drop constraint if exists orders_submission_status_check;
alter table public.orders
  add constraint orders_submission_status_check
  check (submission_status in (
    'not_submitted','pending_submission','submitting',
    'submitted','accepted','failed','needs_reconcile'));

create unique index if not exists orders_lookup_token_idx
  on public.orders (lookup_token);
create index if not exists orders_apliiq_idx
  on public.orders (apliiq_order_id);
create index if not exists orders_submission_idx
  on public.orders (submission_status);

-- Exact fulfillment identifiers per purchased line.
alter table public.order_items
  add column if not exists apliiq_product_id bigint,
  add column if not exists apliiq_sku text;

-- Shipments from Apliiq's fulfillment callback (partial shipments = rows).
create table if not exists public.order_shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status text not null default '',
  tracking_company text,
  tracking_numbers jsonb not null default '[]'::jsonb,
  tracking_urls jsonb not null default '[]'::jsonb,
  line_items jsonb not null default '[]'::jsonb,
  received_at timestamptz not null default now()
);
create index if not exists order_shipments_order_idx
  on public.order_shipments (order_id);
alter table public.order_shipments enable row level security;
-- service-role only (no public policies)
-- 0027: GOOOL Athletics concept line (three tees, Coming Soon, unpriced).
-- Idempotent: safe to run more than once. Mirrors src/lib/products.ts
-- (same UUIDs). Source: designs/16_goool_athletics/GOOOL_ATHLETICS_POD_Packet_v1.pdf
-- (v1, 18 Sep 2026, quoting stage: no blank, price, size range or supplier
-- confirmed). price_cents 0 = "Price to be announced"; the checkout route
-- refuses unpriced, unavailable and unmapped products server-side.
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
  0, null, 'Black', '#0A0A0A',
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
  0, null, 'Washed Black', '#2E2E30',
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
  0, null, 'Natural', '#E9E2D2',
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

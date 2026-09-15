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

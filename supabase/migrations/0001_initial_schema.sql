-- ─────────────────────────────────────────────────────────────
-- PORTUGOOOL — initial schema
-- Run against a NEW, dedicated Supabase project only.
-- Apply with: supabase db push   (or paste into the SQL editor)
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- ── products ─────────────────────────────────────────────────
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  compare_at_price_cents integer check (compare_at_price_cents >= 0),
  color text not null default '',
  color_hex text not null default '#000000',
  fabric text not null default '',
  fit text not null default '',
  care_instructions text not null default '',
  images jsonb not null default '[]'::jsonb,
  sizes text[] not null default array['S','M','L','XL','XXL','3XL'],
  product_category text not null default 'casual'
    check (product_category in ('jersey', 'casual', 'accessory')),
  -- Future fulfillment routing (Printful / Printify / Apliiq / Gelato / local).
  supplier_type text not null default 'unassigned'
    check (supplier_type in ('printful', 'printify', 'apliiq', 'gelato', 'local', 'unassigned')),
  is_active boolean not null default true,
  -- Limited drop: drop_limit units total, remaining = drop_limit - drop_sold_count.
  is_limited_drop boolean not null default false,
  drop_version text,
  drop_limit integer check (drop_limit > 0),
  drop_sold_count integer not null default 0 check (drop_sold_count >= 0),
  -- Customization upsell (jerseys: $15 name/number add-on).
  allow_custom_name boolean not null default false,
  allow_custom_number boolean not null default false,
  customization_price_cents integer not null default 0 check (customization_price_cents >= 0),
  created_at timestamptz not null default now()
);

create index if not exists products_active_idx
  on public.products (is_active, is_limited_drop);
create index if not exists products_category_idx
  on public.products (product_category);

-- ── orders ───────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  customer_email text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  -- Manual/supplier fulfillment pipeline — exportable for any print partner.
  fulfillment_status text not null default 'unfulfilled'
    check (fulfillment_status in ('unfulfilled', 'submitted', 'in_production', 'shipped', 'delivered', 'cancelled')),
  total_cents integer not null default 0 check (total_cents >= 0),
  created_at timestamptz not null default now()
);

create index if not exists orders_email_idx on public.orders (customer_email);
create index if not exists orders_status_idx on public.orders (status, fulfillment_status);

-- ── order_items ──────────────────────────────────────────────
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  size text not null,
  color text not null default '',
  quantity integer not null default 1 check (quantity > 0),
  custom_name text,
  custom_number text,
  unit_price_cents integer not null check (unit_price_cents >= 0)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ── newsletter_signups ───────────────────────────────────────
create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────
-- The storefront reads products with the anon key; everything else is
-- written server-side with the service role key (bypasses RLS).

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_signups enable row level security;

-- Anyone can read active products.
create policy "Public can read active products"
  on public.products for select
  using (is_active = true);

-- No public policies on orders / order_items / newsletter_signups:
-- they are service-role-only by default once RLS is enabled.

-- ── Admin-ready helpers (no dashboard yet — callable from SQL editor) ──
-- Mark units sold when a paid order lands (webhook will call this).
create or replace function public.increment_drop_sold(p_product_id uuid, p_quantity integer)
returns void
language sql
security definer
as $$
  update public.products
  set drop_sold_count = drop_sold_count + p_quantity
  where id = p_product_id and drop_limit is not null;
$$;

-- Flat order export for manual fulfillment (CSV via Supabase dashboard).
create or replace view public.order_export as
select
  o.id as order_id,
  o.created_at,
  o.customer_email,
  o.status,
  o.fulfillment_status,
  p.name as product_name,
  p.supplier_type,
  oi.size,
  oi.color,
  oi.quantity,
  oi.custom_name,
  oi.custom_number,
  oi.unit_price_cents
from public.orders o
join public.order_items oi on oi.order_id = o.id
left join public.products p on p.id = oi.product_id;

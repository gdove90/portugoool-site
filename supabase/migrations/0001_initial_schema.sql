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
  is_active boolean not null default true,
  is_limited_drop boolean not null default false,
  inventory_display_count integer,
  custom_name_available boolean not null default true,
  custom_number_available boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists products_active_idx
  on public.products (is_active, is_limited_drop);

-- ── orders ───────────────────────────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  customer_email text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'in_production', 'shipped', 'cancelled', 'refunded')),
  total_cents integer not null default 0 check (total_cents >= 0),
  created_at timestamptz not null default now()
);

create index if not exists orders_email_idx on public.orders (customer_email);
create index if not exists orders_status_idx on public.orders (status);

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

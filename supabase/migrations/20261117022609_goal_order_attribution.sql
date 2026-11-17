begin;
create table if not exists public.order_checkout_measurements (
  session_hash text primary key check (session_hash ~ '^[a-f0-9]{64}$'),
  verification boolean not null,
  channel text check (channel in ('direct','search','social','paid','email','referral')),
  campaign text check (campaign ~ '^[a-z][a-z0-9_-]{0,63}$'),
  source text check (source ~ '^[a-z][a-z0-9_-]{0,63}$'),
  medium text check (medium ~ '^[a-z][a-z0-9_-]{0,63}$'),
  checked_at timestamptz not null
);
alter table public.order_checkout_measurements enable row level security;
revoke all on table public.order_checkout_measurements from public, anon, authenticated, service_role;
grant select, insert, update on table public.order_checkout_measurements to service_role;
commit;

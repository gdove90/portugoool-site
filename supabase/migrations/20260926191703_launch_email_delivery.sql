begin;
alter table public.discount_codes drop constraint if exists discount_codes_email_hash_key;
create unique index if not exists discount_codes_email_mode_key on public.discount_codes(email_hash, livemode);
revoke all on public.discount_repeat_flags from public, anon, authenticated;
alter table public.discount_repeat_flags set (security_invoker = true);
alter table public.orders add column if not exists amount_discount_cents integer;

create table if not exists public.email_deliveries (
  key text primary key,
  kind text not null check (kind in ('discount', 'order')),
  order_id uuid references public.orders(id),
  livemode boolean not null,
  message jsonb not null,
  status text not null default 'pending' check (status in ('pending','sending','sent','needs_review')),
  attempts integer not null default 0,
  created_at timestamptz not null default now(),
  first_attempt_at timestamptz,
  next_attempt_at timestamptz not null default now(),
  lease_until timestamptz,
  claim_token uuid,
  sent_at timestamptz,
  provider_id text,
  last_error text
);
alter table public.email_deliveries enable row level security;
revoke all on public.email_deliveries from public, anon, authenticated;
grant select, insert, update on public.email_deliveries to service_role;
create index if not exists email_deliveries_pending_idx on public.email_deliveries(livemode,next_attempt_at) where status in ('pending','sending');

-- Atomic leased claim. A stalled attempt cannot hold delivery indefinitely.
-- Resend's idempotency window is 24 hours; never auto-retry outside 23 hours.
create or replace function public.claim_email_delivery(p_key text, p_token uuid)
returns setof public.email_deliveries language sql security invoker set search_path = '' as $$
  update public.email_deliveries
  set status='sending', claim_token=p_token, lease_until=now()+interval '2 minutes',
      first_attempt_at=coalesce(first_attempt_at,now()), attempts=attempts+1
  where key=p_key and next_attempt_at <= now()
    and (first_attempt_at is null or first_attempt_at > now()-interval '23 hours')
    and (status='pending' or (status='sending' and lease_until < now()))
  returning *;
$$;
revoke all on function public.claim_email_delivery(text,uuid) from public, anon, authenticated;
grant execute on function public.claim_email_delivery(text,uuid) to service_role;
commit;

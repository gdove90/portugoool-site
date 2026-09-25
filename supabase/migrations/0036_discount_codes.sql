-- 0036: GOOOL20 first-order discount codes (owner decision, 2026-09-25).
--
-- WHY THIS EXISTS: the 20%-off signup popup must hand out a discount that
-- one person can use once. A shared code cannot do that, so every signup
-- gets its own single-use Stripe promotion code in the GOOOL20 family
-- (GOOOL20-XXXX, max_redemptions 1). This table is the ledger that ties
-- each code to the email that earned it, so a repeat signup from the same
-- address gets the same code back (or "already used") instead of a fresh
-- one, and records who redeemed it so repeat people behind different
-- emails can be seen after the fact.
--
-- HONESTY NOTE: the same person signing up with a second email cannot be
-- blocked before payment with Stripe's hosted Checkout, because the name
-- and shipping address only arrive after the charge. What this table
-- gives ops is the evidence: discount_repeat_flags lists redemptions that
-- share a normalised name or address with an earlier one.
--
-- Apply via the Supabase dashboard SQL editor (the established workflow;
-- no local credentials). Service-role only: RLS on, no policies.

create table if not exists public.discount_codes (
  id                    uuid primary key default gen_random_uuid(),
  -- sha256 of the normalised email (lowercase, gmail dots and +tags
  -- removed). The raw address is not stored here; Mailchimp holds it.
  email_hash            text not null unique,
  code                  text not null unique,
  stripe_promotion_code_id text not null unique,
  stripe_coupon_id      text not null,
  livemode              boolean not null,
  issued_at             timestamptz not null default now(),
  expires_at            timestamptz,
  redeemed_at           timestamptz,
  redeemed_session_id   text unique,
  redeemed_email_hash   text,
  redeemed_name         text,
  -- normalised "lastname|first line|postal code" for repeat detection
  redeemed_address_key  text,
  redeemed_address      jsonb
);

create index if not exists discount_codes_redeemed_address_key_idx
  on public.discount_codes (redeemed_address_key)
  where redeemed_address_key is not null;

alter table public.discount_codes enable row level security;

-- Ops view: a redemption whose normalised address key or redeemed name
-- also appears on an earlier redemption. Same person, different email.
create or replace view public.discount_repeat_flags as
select
  later.code,
  later.redeemed_at,
  later.redeemed_name,
  later.redeemed_session_id,
  earlier.code        as matches_code,
  earlier.redeemed_at as matches_redeemed_at,
  case
    when later.redeemed_address_key = earlier.redeemed_address_key then 'address'
    else 'name'
  end as matched_on
from public.discount_codes later
join public.discount_codes earlier
  on earlier.redeemed_at < later.redeemed_at
 and earlier.livemode = later.livemode
 and (
      (later.redeemed_address_key is not null
       and later.redeemed_address_key = earlier.redeemed_address_key)
   or (later.redeemed_name is not null
       and lower(later.redeemed_name) = lower(earlier.redeemed_name))
 )
where later.redeemed_at is not null;

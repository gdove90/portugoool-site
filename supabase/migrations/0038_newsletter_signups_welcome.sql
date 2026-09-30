-- 0038: newsletter_signups becomes the list of record for email sign-ups
-- (owner decision 2026-09-29). Run in the Supabase SQL editor, project
-- oexibflpshttgzmdvhpr (the org-scoped MCP connector cannot see it).
--
-- The table existed since 0001 (email, created_at) and nothing wrote to
-- it. It now holds one row per address, keyed by the same sha256 email
-- hash the GOOOL20 ledger uses, so the welcome job can join
-- discount_codes on email_hash without that ledger ever storing an
-- address. Columns:
--   source            popup | footer | import (popup rows get the sequence)
--   subscribed_at     start of the welcome clock (UTC)
--   unsubscribed_at   set by /unsubscribe/<token>; marketing stops
--   sent_at_email1..3 written when each email is queued; idempotency
--   imported          true for the one-time Mailchimp import; never Email 1
--   unsubscribe_token random per row; the only thing in the unsubscribe URL
-- Service role only (RLS on, no policies), same as 0001.

create extension if not exists pgcrypto;

alter table public.newsletter_signups
  add column if not exists email_hash        text,
  add column if not exists source            text        not null default 'popup',
  add column if not exists subscribed_at     timestamptz not null default now(),
  add column if not exists unsubscribed_at   timestamptz,
  add column if not exists sent_at_email1    timestamptz,
  add column if not exists sent_at_email2    timestamptz,
  add column if not exists sent_at_email3    timestamptz,
  add column if not exists imported          boolean     not null default false,
  add column if not exists unsubscribe_token uuid        not null default gen_random_uuid();

-- Legacy rows (none expected): hash the lowercased address so the column
-- can be made required. The app hashes a normalised form (gmail dots and
-- +tags removed); any legacy row that differs is reconciled by the next
-- sign-up from that address.
update public.newsletter_signups
   set email_hash = encode(digest(lower(trim(email)), 'sha256'), 'hex'),
       subscribed_at = coalesce(created_at, now())
 where email_hash is null;

alter table public.newsletter_signups
  alter column email_hash set not null;

create unique index if not exists newsletter_signups_email_hash_key
  on public.newsletter_signups (email_hash);
create unique index if not exists newsletter_signups_unsubscribe_token_key
  on public.newsletter_signups (unsubscribe_token);
create index if not exists newsletter_signups_welcome_idx
  on public.newsletter_signups (source, subscribed_at)
  where unsubscribed_at is null;

alter table public.newsletter_signups
  drop constraint if exists newsletter_signups_source_check;
alter table public.newsletter_signups
  add constraint newsletter_signups_source_check
  check (source in ('popup', 'footer', 'import'));

alter table public.newsletter_signups enable row level security;
revoke all on public.newsletter_signups from anon, authenticated;
grant all on public.newsletter_signups to service_role;

-- 0032: one-shot guard for the order confirmation email.
--
-- Stripe redelivers events, and createOrder has a repair path that runs
-- on redelivery, so "send the email when we record the order" would mail
-- the customer again on every retry. A nullable timestamp plus a
-- conditional UPDATE (set ... where confirmation_sent_at is null) makes
-- the send a compare-and-set: exactly one delivery wins, and a failed
-- send leaves the column null so a later retry can still deliver.
--
-- Deliberately nullable with no default: null means "not yet sent",
-- which is also the correct state for every order that predates this.
--
-- Apply via the Supabase dashboard SQL editor (established workflow).

alter table public.orders
  add column if not exists confirmation_sent_at timestamptz;

comment on column public.orders.confirmation_sent_at is
  'When the GOOOL order confirmation email was accepted by the email provider. Null = never sent. Set via conditional UPDATE so redelivered Stripe events cannot double-send.';

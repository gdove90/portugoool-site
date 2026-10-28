-- What's Your GOAL? moderation states (owner brief 2026-10-28).
-- Adds the three review outcomes the campaign workflow needs on top of the
-- existing intake statuses: achieved (the submitter reached the goal),
-- rejected (not eligible for use) and archived (kept, out of rotation).
-- Existing rows and the other intake kinds are untouched; no data changes.
-- Apply in the Supabase SQL editor (project oexibflpshttgzmdvhpr) before the
-- admin dashboard that offers these statuses goes live.
begin;
alter table public.intake_submissions drop constraint if exists intake_submissions_status_check;
alter table public.intake_submissions add constraint intake_submissions_status_check
  check (status in ('new','reviewing','approved','featured','achieved','rejected','quoted','closed','archived'));
commit;

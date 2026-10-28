-- What's Your GOAL? moderation states (owner brief 2026-10-28).
-- Adds the three review outcomes the campaign workflow needs on top of the
-- existing intake statuses: achieved (the submitter reached the goal),
-- rejected (not eligible for use) and archived (kept, out of rotation).
--
-- Safety notes (release review 2026-10-28):
--   * Existing values new/reviewing/approved/featured/quoted/closed stay
--     valid, so every existing row passes the new check unchanged. No row is
--     read or rewritten; consent snapshots, files and RLS are untouched.
--   * Idempotent: "drop constraint if exists" then "add constraint" inside
--     one transaction, so re-running it is safe and ends in the same state.
--   * Rollback: re-create the original six-value check. That only succeeds
--     while no row carries achieved, rejected or archived; reset those rows
--     to closed first if any exist:
--       alter table public.intake_submissions drop constraint if exists intake_submissions_status_check;
--       alter table public.intake_submissions add constraint intake_submissions_status_check
--         check (status in ('new','reviewing','approved','featured','quoted','closed'));
--   * Until applied, saving one of the three new statuses in /admin fails
--     with the "private service is unavailable, retry" message; the public
--     page and submissions are unaffected.
-- Apply in the Supabase SQL editor (project oexibflpshttgzmdvhpr) only with
-- the owner's explicit go-ahead; verify with the select at the end.
begin;
alter table public.intake_submissions drop constraint if exists intake_submissions_status_check;
alter table public.intake_submissions add constraint intake_submissions_status_check
  check (status in ('new','reviewing','approved','featured','achieved','rejected','quoted','closed','archived'));
commit;
select conname, pg_get_constraintdef(oid) as definition from pg_constraint where conname = 'intake_submissions_status_check';

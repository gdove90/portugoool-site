-- 0037: rename the three Core Capsule tees (owner decision, 2026-09-25).
--
-- WHY THIS EXISTS: products.name is shown on order confirmations and the
-- ops views, and the order store's ensureProductRows only inserts a
-- missing row; it does not rename an existing one. This keeps the
-- database in step with src/lib/products.ts. Slugs, ids, prices, Apliiq
-- designs and SKUs are unchanged; only the display names move.
--
--   Casual Wordmark Tee · Red        → Terrace Tee · Red
--   Casual Wordmark Tee · Club Blue  → Terrace Tee · Club Blue
--   Athletics Modern Sport Performance Tee → Matchday Tee
--   Performance Badge Tee            → Core Badge Tee
--
-- Apply via the Supabase dashboard SQL editor (the established workflow;
-- no local credentials). Idempotent.

update public.products set name = 'GOOOL Terrace Tee · Red'
 where id = '70000000-0000-4000-8000-000000000003';
update public.products set name = 'GOOOL Terrace Tee · Club Blue'
 where id = '70000000-0000-4000-8000-000000000005';
update public.products set name = 'GOOOL Matchday Tee'
 where id = '80000000-0000-4000-8000-000000000006';
update public.products set name = 'GOOOL Core Badge Tee'
 where id = '70000000-0000-4000-8000-000000000001';

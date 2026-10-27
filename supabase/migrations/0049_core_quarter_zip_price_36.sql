-- 0049: Core Quarter Zip price to $36 (owner decision 2026-10-26, "final
-- offer"; supersedes 0048's $32). Idempotent. Applied 2026-10-26 in the
-- Supabase SQL editor.

update public.products
   set price_cents = 3600
 where id = '80000000-0000-4000-8000-000000000023';

select id, name, price_cents from public.products
 where id = '80000000-0000-4000-8000-000000000023';

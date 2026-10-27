-- 0051: Core Jogger price to $58 (owner decision 2026-10-27, "something
-- accommodating"; the 25% model said $64). Idempotent. Applied 2026-10-27
-- in the Supabase SQL editor.
update public.products set price_cents = 5800
 where id = '80000000-0000-4000-8000-000000000024';
select id, name, price_cents from public.products
 where id = '80000000-0000-4000-8000-000000000024';

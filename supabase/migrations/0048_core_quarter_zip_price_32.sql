-- 0048: Core Quarter Zip price to $32 (owner decision 2026-10-26, "it's 16
-- for us"). Catalog reads come from products.ts; this keeps the products
-- row in step for order records. Idempotent. Applied 2026-10-26 in the
-- Supabase SQL editor.

update public.products
   set price_cents = 3200
 where id = '80000000-0000-4000-8000-000000000023';

select id, name, price_cents from public.products
 where id = '80000000-0000-4000-8000-000000000023';

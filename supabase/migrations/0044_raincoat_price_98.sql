-- 0044: Core Everyday Raincoat price to $98 (owner decision 2026-10-26,
-- after the 2026-10-26 launch at $108). Sizes stay S to XXL. Idempotent;
-- matches src/lib/products.ts (priceCents 9800).
-- Applied 2026-10-26 in the Supabase SQL editor.

update public.products
   set price_cents = 9800,
       sizes = array['S','M','L','XL','XXL']
 where id = '80000000-0000-4000-8000-000000000016';

-- verify: expect one row at 9800, sizes S-XXL
select id, name, price_cents, sizes, product_category, is_active, available_for_sale
from public.products
where id = '80000000-0000-4000-8000-000000000016';

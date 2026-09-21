-- ─────────────────────────────────────────────────────────────
-- 0030: reconcile legacy catalog rows that are retired but still
-- flagged sellable.
--
-- Found 2026-09-21 in production (service-role view of public.products):
--
--   is_active | available_for_sale | rows
--   ----------+--------------------+------
--   true      | false              |    4
--   false     | true               |   50
--
-- A clean two-way split: every one of the 50 rows carrying
-- available_for_sale = true is ALREADY retired (is_active = false).
-- Migrations 0021-0024 retired those products by clearing is_active
-- but never cleared available_for_sale, leaving the two flags in
-- disagreement.
--
-- Current exposure is low, not zero:
--   · the RLS policy on products hides inactive rows from the anon
--     role (an anon read returns exactly the 4 active rows)
--   · nothing in src/ reads products from Supabase at all today --
--     the site serves the mock catalog in src/lib/products.ts
-- The trap is a future read-path switch on a service-role client,
-- which bypasses RLS and would see 50 rows claiming to be sellable
-- at legacy prices ($10.00-$65.00).
--
-- This statement only ever CLOSES availability; it can never open a
-- product for sale. No rows are deleted, no prices or images change.
-- Idempotent: re-running it matches nothing.
-- Apply via the Supabase dashboard SQL editor (established workflow).
-- ─────────────────────────────────────────────────────────────

update public.products
set available_for_sale = false
where is_active = false
  and available_for_sale = true;

-- Verification: expect legacy_still_sellable = 0 and active_sellable = 0
-- (the 4 active products stay unpurchasable until launch gates pass).
select
  count(*) filter (where is_active = false and available_for_sale) as legacy_still_sellable,
  count(*) filter (where is_active and available_for_sale)         as active_sellable,
  count(*) filter (where is_active)                                as active_rows,
  count(*)                                                          as total_rows
from public.products;

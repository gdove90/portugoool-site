-- Portugal jerseys (Drop 01) pulled from the storefront (owner,
-- 2026-07-08). Deactivated, not deleted.
update public.products set is_active = false
  where product_category = 'jersey' and drop_version = 'I';

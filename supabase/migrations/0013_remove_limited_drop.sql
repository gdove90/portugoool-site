-- 0013: POD honesty — retire limited-drop scarcity claims. Everything is
-- made to order (Printful/Printify), so "limited to 500 / never reprinted"
-- language and counters are removed. drop_version stays as collection
-- identity only.

update public.products
set is_limited_drop = false,
    drop_limit = null
where product_category = 'jersey';

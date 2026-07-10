-- Retire the England jerseys (recoverable, is_active flip only).

update public.products set is_active = false
where product_category = 'jersey' and slug like 'engoooland-%';

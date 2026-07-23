-- Retire all hats except the two GOOOL "Sound of Victory" caps
-- (recoverable, is_active flip only).

update public.products set is_active = false
where product_category = 'hat'
  and slug not in ('goool-cap-black', 'goool-cap-white');

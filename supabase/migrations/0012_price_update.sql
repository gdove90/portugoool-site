-- Pricing update (owner, 2026-07-09): round price points replace strict
-- 2x — jerseys $65 (2.13x), performance tees $35 (2.31x), caps $35 (2.39x).
update public.products set price_cents = 6500 where product_category = 'jersey' and is_active;
update public.products set price_cents = 3500 where supplier_type = 'printify' and is_active;
update public.products set price_cents = 3500 where slug in ('gol-cap-black','gol-cap-white');

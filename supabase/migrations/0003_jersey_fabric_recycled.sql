-- Jersey fabric copy aligned to the confirmed Printful garment
-- (All-Over Print Recycled Unisex Sports Jersey — 100% recycled polyester).
-- Removes the unconfirmed 95/5 elastane + four-way stretch + GSM claims.
-- Applied to production 2026-07-08 via Management API; kept here so the
-- migration history matches the live schema/data.

update public.products
set
  fabric = 'Lightweight performance knit. 100% recycled polyester. Moisture-wicking and breathable with a silky smooth finish, printed edge to edge.',
  description = replace(description, 'Silky, four-way stretch performance knit', 'Silky, breathable performance knit')
where product_category = 'jersey';

-- Pricing policy (owner, 2026-07-08): retail = 2x Printful base cost,
-- rounded to the nearest dollar. Bases: jersey $30.55 -> $61 · staple tee
-- $11.69 -> $23 · oversized heavy tee $16.49 -> $33 · dad hat $14.65 -> $29
-- · sticker sheet $5.05 -> $10. Scarf + flag keep prices (no Printful
-- base; pending specialty supplier quotes). Also aligns tee/sticker copy
-- to the adopted blanks (Bella 3001 / Bella 4810 / Yupoong 6245CM /
-- kiss-cut sheet) and marks mapped products supplier_type=printful.

update public.products set price_cents = 6100, supplier_type = 'printful'
  where product_category = 'jersey';

update public.products set price_cents = 2300, supplier_type = 'printful',
  fabric = 'Soft 100% ring-spun cotton staple tee. Lightweight and breathable — holds color, holds shape, feels broken-in from day one.'
  where slug in ('brush-script-tee','goool-tee','vamos-tee','lisbon-to-the-world-tee','match-day-tee');

update public.products set price_cents = 3300, supplier_type = 'printful',
  fabric = 'Heavyweight garment-dyed 100% cotton. Oversized cut with real weight and structure.'
  where slug = 'we-dont-whisper-goals-tee';

update public.products set price_cents = 2900, supplier_type = 'printful'
  where slug = 'goool-cap';

update public.products set price_cents = 1000, supplier_type = 'printful',
  fabric = 'Kiss-cut matte vinyl sticker sheet. Six designs on one sheet.',
  fit = 'One sheet · 5.83″ × 8.27″ · six stickers.',
  care_instructions = 'Peel and place once.'
  where slug = 'sticker-pack';

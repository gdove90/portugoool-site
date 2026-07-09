-- Design reset (owner, 2026-07-08): all casual tees pulled from the
-- storefront pending a new design round. Products deactivated, not
-- deleted — history, ids, and print files remain for reference.
update public.products set is_active = false where product_category = 'casual';

-- Retire the two GOL casual tees pending wordmark redesign
-- (recoverable, is_active flip only).

update public.products set is_active = false
where slug in ('gol-clean-sheet-tee', 'gol-gold-standard-tee');

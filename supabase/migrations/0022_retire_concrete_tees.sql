-- Retire all three GOL Concrete tees (recoverable, is_active flip only).

update public.products set is_active = false
where slug in (
  'gol-concrete-grey-tee',
  'gol-concrete-white-tee',
  'gol-concrete-black-tee'
);

-- 0014: Jersey galleries — forward-facing model as primary shot, plus a
-- ghost (product-only) view showing the exact fit, then the back.

update public.products set images = '[
  {"src": "/products/engoooland-home-white-jersey.webp", "alt": "ENGOOOLAND Home White Jersey — front, on model"},
  {"src": "/products/engoooland-home-white-jersey-ghost.webp", "alt": "ENGOOOLAND jersey — exact fit, front view"},
  {"src": "/products/engoooland-home-white-jersey-back.webp", "alt": "ENGOOOLAND Home White Jersey — back, ready for custom name and number"}
]'::jsonb where slug = 'engoooland-home-white-jersey';

update public.products set images = '[
  {"src": "/products/engoooland-away-red-jersey.webp", "alt": "ENGOOOLAND Away Red Jersey — front, on model"},
  {"src": "/products/engoooland-away-red-jersey-ghost.webp", "alt": "ENGOOOLAND jersey — exact fit, front view"},
  {"src": "/products/engoooland-away-red-jersey-back.webp", "alt": "ENGOOOLAND Away Red Jersey — back, ready for custom name and number"}
]'::jsonb where slug = 'engoooland-away-red-jersey';

update public.products set images = '[
  {"src": "/products/engoooland-navy-jersey.webp", "alt": "ENGOOOLAND Navy Jersey — front, on model"},
  {"src": "/products/engoooland-navy-jersey-ghost.webp", "alt": "ENGOOOLAND jersey — exact fit, front view"},
  {"src": "/products/engoooland-navy-jersey-back.webp", "alt": "ENGOOOLAND Navy Jersey — back, ready for custom name and number"}
]'::jsonb where slug = 'engoooland-navy-jersey';

-- Jersey product images: placeholder SVGs -> real Printful mockups
-- (front on-model, front detail, back). Applied to production 2026-07-08.

update public.products set images = '[
  {"src": "/products/home-red-jersey.webp", "alt": "Home Red Jersey — front, on model"},
  {"src": "/products/home-red-jersey-alt.webp", "alt": "Home Red Jersey — front detail"},
  {"src": "/products/home-red-jersey-back.webp", "alt": "Home Red Jersey — back, ready for custom name and number"}
]'::jsonb where slug = 'home-red-jersey';

update public.products set images = '[
  {"src": "/products/away-white-jersey.webp", "alt": "Away White Jersey — front, on model"},
  {"src": "/products/away-white-jersey-alt.webp", "alt": "Away White Jersey — front detail"},
  {"src": "/products/away-white-jersey-back.webp", "alt": "Away White Jersey — back, ready for custom name and number"}
]'::jsonb where slug = 'away-white-jersey';

update public.products set images = '[
  {"src": "/products/blackout-edition-jersey.webp", "alt": "Blackout Edition Jersey — front, on model"},
  {"src": "/products/blackout-edition-jersey-alt.webp", "alt": "Blackout Edition Jersey — front detail"},
  {"src": "/products/blackout-edition-jersey-back.webp", "alt": "Blackout Edition Jersey — back, ready for custom name and number"}
]'::jsonb where slug = 'blackout-edition-jersey';

update public.products set images = '[
  {"src": "/products/emerald-edition-jersey.webp", "alt": "Emerald Edition Jersey — front, on model"},
  {"src": "/products/emerald-edition-jersey-alt.webp", "alt": "Emerald Edition Jersey — front detail"},
  {"src": "/products/emerald-edition-jersey-back.webp", "alt": "Emerald Edition Jersey — back, ready for custom name and number"}
]'::jsonb where slug = 'emerald-edition-jersey';

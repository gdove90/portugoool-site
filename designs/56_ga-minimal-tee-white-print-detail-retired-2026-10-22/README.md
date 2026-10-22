# GA Minimal Tee, White · Black-Red: print-detail view retired (2026-10-22)

Owner instruction 2026-10-22: remove the print-detail close-up (the black
and red GA monogram on the white tee, under the model's chin) from the
site. It was the sixth image of the White · Black-Red gallery on the GA
Minimal Tee (catalog id `80000000-0000-4000-8000-000000000011`), deployed
2026-10-14 and cropped to 2:3 on 2026-10-20.

- `src/lib/products.ts`: the entry left the White · Black-Red gallery,
  which now has five views (product front, product back, model front,
  three-quarter, rear).
- `public/products/goal-ga-minimal-white-black-red-catalog-print-detail-20261014.webp`
  moved to `retired/` here, unchanged.
- `src/middleware.ts`: the path left the public-image allowlist;
  `scripts/test-customer-service-gate.cjs` now expects it gated.
- `docs/catalog/ga-minimal-white-black-red-20261014.json`: the image is
  annotated as retired; its checksums stay for the record.

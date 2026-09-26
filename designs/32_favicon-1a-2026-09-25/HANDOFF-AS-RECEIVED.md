# Handoff: new GOOOL favicon (1a), echo mark retired

Act as GOOOL's storefront lead. Replace the site favicon with option **1a**: the G from the slanted GOOOL wordmark, over the red rule, on an ink tile. Also remove the retired echo mark from the brand everywhere. The owner doesn't want it used, referenced or named anywhere.

Seller: GOOOL Athletics LLC.

## 1. Files in this package (drop into the repo as-is)

| File | Size | Use |
|---|---|---|
| `src/app/favicon.ico` | 16, 32 and 48 px in one file | Browser tabs, bookmarks |
| `src/app/icon.png` | 512 × 512 | Next.js app icon, Android and PWA |
| `src/app/apple-icon.png` | 180 × 180 | iOS home screen (replaces the echo version) |

The mark is cut from the real GA-01-F wordmark artwork: G in White #FFFFFF, rule in Red #C52D32, tile Ink #0A0A0A with rounded corners. Don't redraw it or retype the G.

## 2. Steps in repo `GOOOL/`

1. **Delete** `src/app/icon.svg`. It's the echo mark, and it would override the new PNG.
2. **Copy** the three files above into `src/app/`, replacing the old `apple-icon.png`.
3. Check `src/app/layout.tsx` (and any `metadata.icons`) for hard-coded icon paths. Remove any that point at `icon.svg` or old files, and let Next.js pick up the files by convention.
4. If `public/favicon.ico`, `public/icon*.png` or a `site.webmanifest` exist, replace or update them to use the same three files. Check the middleware matcher still excludes `favicon.ico` (it does today).

## 3. Remove the echo mark everywhere

- **Delete the logo files:** `designs/12_logos/svg/monogram-echo.svg` and `designs/12_logos/svg/monogram-echo-tile.svg`.
- **Delete the echo apparel:** `designs/05_jerseys/handoff_echo-apparel/`, `designs/06_tshirts/finals/tee-ET1-echo-hero-FRONT.png` and `-BACK.png`, and `public/print/drop02/tee-ET1-echo-hero-FRONT.png`.
- **Product `20000000-0000-4000-8000-000000000007`** ("ENGOOOLAND Echo Hero Tee", inactive): it's built around the echo mark. Remove the product entry from `src/lib/products.ts`, and delete `public/products/engoooland-echo-hero-tee.webp` and `-back.webp`. If anything references its slug (orders, fulfilment maps, sitemaps), remove the reference. If a past order exists, keep the order record and only drop it from the catalogue.
- **Product `20000000-0000-4000-8000-000000000010`** ("ENGOOOLAND Roar Tee", inactive): its description says "Echo badge at the breast". Check its images. If the artwork is the echo mark, remove the product as above. If it isn't, change the description to `"The badge at the breast, the moment stacked beneath. Navy, understated, ready."`
- **Archives:** delete `designs/_archive/imagery-pre-whitebg-2026-09-21/engoooland-echo-hero-tee*.webp`.
- **Sweep:** search the repo for `echo`, case-insensitive, including `C1121F` with `C9A227` arc SVGs. Remove anything that's the mark or names it. Leave unrelated code uses, such as shell `echo` in scripts.

## 4. Verify and report

- Production deploy ID.
- `/favicon.ico`, `/icon.png` and `/apple-icon.png` return 200 and show the G with the red rule. Hard-refresh a tab and check the new icon shows.
- The list of files deleted and products removed or edited.
- A final search showing no remaining echo-mark references.

Don't touch other products, prices or checkout.

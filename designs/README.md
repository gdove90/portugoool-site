# PORTUGOOOL Design System

Single source of truth for all visual assets, brand documentation, mockups,
tech packs, and product designs. **Start at [00_brand/](00_brand/README.md)**
— every design decision must trace back to a rule there.

## Map

| Folder | Contents |
|---|---|
| [00_brand/](00_brand/) | Brand guide, colors, typography, logo rules, voice, materials, principles |
| [01_moodboards/](01_moodboards/) | Visual inspiration boards |
| [02_homepage/](02_homepage/) · [03_shop/](03_shop/) · [04_product-pages/](04_product-pages/) | Page designs (desktop + mobile) |
| [05_jerseys/](05_jerseys/) · [06_tshirts/](06_tshirts/) | Apparel: concepts → finals → tech-packs |
| [07_accessories/](07_accessories/) | Hats, scarves, stickers, flags |
| [08_packaging/](08_packaging/) | Shipping, inserts, labels |
| [09_social-media/](09_social-media/) · [10_email/](10_email/) | Marketing surfaces |
| [11_icons/](11_icons/) · [12_logos/](12_logos/) · [13_ui/](13_ui/) | Design-system atoms |
| [14_mockups/](14_mockups/) | Full-page mockups + presentations |
| [15_reference/](15_reference/) | Inspiration, research, supplier assets (nothing here ships) |

## Working Rules
1. **Docs before pixels:** new colors/type/patterns get documented in
   `00_brand/` or `13_ui/` before they ship in code.
2. **Concepts → finals:** apparel art only enters a `finals/` folder after
   passing the legal guardrails in `00_brand/brand-guide.md`.
3. **Dated filenames** for explorations: `2026-07-08_hero-v2.png`.
4. **This folder never touches the app.** Production assets live in
   `public/`; this directory is documentation and source files.

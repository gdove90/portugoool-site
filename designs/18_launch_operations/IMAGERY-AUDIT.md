# Catalog imagery audit and approved direction

Owner approved implementing the recommendations after reviewing the audit. Scope: active product imagery and price-area marketing copy; no new model generation. Website implementation is pending Claude execution, not completed by this handoff.

Evidence:53 unique image references across10 active products/14 colorways;26 model views across9 products. All53 local source files matched SHA256 of publicly served goool.shop image responses. All are1122x1402 (approximately4:5). Modern Sport Performance has one front concept only. Most model views repeat the same-looking subject, pose and stadium; Varsity and Minimal Club differ in appearance. Some source texture/detail already appears soft. The audit did not isolate or measure any additional production optimizer degradation.

ProductDetail.tsx uses a square rounded bg-smoke frame with object-contain; portrait media leaves side panels. ProductCard.tsx uses the same square frame with object-cover, which crops portrait images, and hover scaling. Garment backgrounds also contain gray pixels. Therefore CSS-only removal is insufficient. Gallery thumbnails render80px but declare64px image sizing, worth correcting with responsive rendering verification.

Approved direction: garment-only front/back/detail; seamless white backgrounds, restrained shadows for light garments; consistent4:5 composition and category-appropriate scale; exact verified blanks, colors and production artwork. Preserve originals and concept disclosures. Real sample photographs should later supply fit/material evidence.

Remove Printed in the USA marketing badges from Performance Badge Tee, Core Hoodie and Casual Wordmark Tee cards/detail price areas. Do not replace with unsubstantiated manufacturing claims. Optional artwork-specific copy elsewhere: Original GOOOL artwork or Designed by GOOOL. Preserve accurate legal/supplier origin information. [FTC origin guidance](https://www.ftc.gov/business-guidance/resources/complying-made-usa-standard).

The consolidated root CLAUDE-LAUNCH-PRIORITY-PROMPT.md supersedes older requests to update generated model imagery. Casual placement remains3.00in collar-to-visible-art-top and6.75in width. Prices remain unpublished until costs are verified; imagery cleanup does not change sales/fulfillment gates.

Evidence files are in imagery-audit/: inventory, image metadata, live hash-match results and contact sheets. Contact sheets are review aids only, not production assets.

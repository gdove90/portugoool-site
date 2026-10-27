import studioBackgrounds from "@/v84/studio-backgrounds-v5.json";

const studioPaths = new Map(studioBackgrounds.map(image => [image.originalSrc, image.src]));

// Change this revision when replacing catalog image bytes at existing paths.
// Source records remain plain file paths for supplier/launch-folder tooling.
export function catalogImageSrc(src: string): string {
  if (!src.startsWith("/products/")) return src;
  const url = new URL(src, "https://goool.shop");
  const studioPath = studioPaths.get(url.pathname);
  if (studioPath) url.pathname = studioPath;
  const isRevisedBack = /^\/products\/GOOOL_MODERN_PERFORMANCE_(?:ROYAL_|WHITE_)?BACK_DETAIL_V6\.png$/.test(url.pathname);
  // Minimal Tee product shots replaced at their paths later on 2026-10-22
  // (the True Royal back twice, the True Royal front, both Black shots and
  // the True Red back, the later ones after they had gone live); the tags
  // keep every image cache from serving an earlier file.
  const replaced: Record<string, string> = {
    "/products/goal-ga-minimal-true-royal-catalog-product-back-20261022.webp": "true-royal-back-v3-20261022",
    "/products/goal-ga-minimal-true-royal-catalog-product-front-20261022.webp": "true-royal-front-v2-20261022",
    "/products/goal-ga-minimal-black-catalog-product-front-20261022.webp": "black-front-v2-20261022",
    "/products/goal-ga-minimal-black-catalog-product-back-20261022.webp": "black-back-v2-20261022",
    "/products/goal-ga-minimal-true-red-catalog-product-back-20261022.webp": "true-red-back-v2-20261022",
    // Heritage Hoodie Grey Heather: the owner's product shot replaced the
    // Apliiq render at this path the day both went live.
    "/products/goal-heritage-hoodie-grey-heather-catalog-product-front-20261022.webp": "grey-heather-front-photo-20261022",
    // Black front replaced again by the owner's v2 shot on 2026-10-26.
    "/products/goal-heritage-hoodie-black-catalog-product-front-20261022.webp": "black-front-photo-v2-20261026",
  "/products/goal-core-everyday-raincoat-black-catalog-product-front-20261026.webp": "owner-front-20261026",
  "/products/goal-core-everyday-raincoat-true-navy-catalog-product-front-20261026.webp": "owner-front-20261026",
  "/products/goal-core-everyday-raincoat-dark-grey-heather-catalog-product-front-20261026.webp": "owner-front-20261026",
    // TEMPO marks went to their smallest sizes on 2026-10-26 (GA 2.00 in on
    // the tee, hoodie and pants; pants rebuilt with the GA on the front);
    // every render at these paths was replaced.
    "/products/tempo-training-pants-deep-red-white-catalog-product-back-20261026.webp": "smallest-20261026",
    "/products/tempo-training-pants-true-navy-white-catalog-product-back-20261026.webp": "smallest-20261026",
    "/products/tempo-training-pants-black-white-catalog-product-back-20261026.webp": "smallest-20261026",
    "/products/tempo-training-pants-deep-red-white-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-training-pants-true-navy-white-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-training-pants-black-white-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-core-training-tee-black-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-core-training-tee-white-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-core-training-tee-iron-grey-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-warmup-hoodie-black-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-warmup-hoodie-vintage-white-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-warmup-hoodie-navy-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-quarter-zip-black-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-quarter-zip-white-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-quarter-zip-light-purple-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-training-tee-red-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-training-tee-purple-catalog-product-front-20261026.webp": "smallest-20261026",
    "/products/tempo-training-tee-white-catalog-product-front-20261026.webp": "smallest-20261026",
    // Core Quarter Zip: front mark became the GA monogram crest the day it launched.
    "/products/goal-core-quarter-zip-black-catalog-product-front-20261026.webp": "ga-crest-v2-20261026",
    "/products/goal-core-quarter-zip-white-catalog-product-front-20261026.webp": "ga-crest-v2-20261026",
    "/products/goal-core-quarter-zip-dark-gray-catalog-product-front-20261026.webp": "ga-crest-v2-20261026",
    "/products/goal-heritage-hoodie-navy-catalog-product-front-20261022.webp": "navy-front-photo-20261022",
    "/products/goal-heritage-hoodie-bone-catalog-product-front-20261022.webp": "bone-front-photo-v2-20261022",
    // Lockup Hoodie: the owner's product shots replaced the Apliiq renders.
    "/products/goal-lockup-hoodie-black-catalog-product-front-20261022.webp": "black-front-photo-20261022",
    "/products/goal-lockup-hoodie-navy-catalog-product-front-20261022.webp": "navy-front-photo-20261022",
    "/products/goal-lockup-hoodie-bone-catalog-product-front-20261022.webp": "bone-front-photo-v2-20261022",
    "/products/goal-lockup-hoodie-grey-heather-catalog-product-front-20261022.webp": "grey-heather-front-photo-20261022",
    // Match Day Tee Black and White · Black-Red: the owner's v2 product
    // fronts replaced the first ones at these paths on 2026-10-26.
    "/products/goal-ga-big-tee-black-catalog-product-front-20261022.webp": "black-front-v2-20261026",
    "/products/goal-ga-big-tee-white-black-red-catalog-product-front-20261022.webp": "white-black-red-front-v2-20261026",
    // Stacked Stadium Cap: the owner's clean fronts (no supplier sticker)
    // replaced the first product shots at these paths on 2026-10-23.
    "/products/goal-wordmark-cap-red-catalog-product-front-20261022.webp": "red-front-v2-20261023",
    "/products/goal-wordmark-cap-royal-catalog-product-front-20261022.webp": "royal-front-v2-20261023",
    "/products/goal-wordmark-cap-dark-green-catalog-product-front-20261022.webp": "dark-green-front-v2-20261023",
    "/products/goal-wordmark-cap-black-catalog-product-front-20261022.webp": "black-front-v2-20261023",
    // GA Matchday Cap Royal/Natural: the owner's product front replaced the
    // first shot at this path on 2026-10-26.
    "/products/goal-monogram-cap-royal-catalog-product-front-20261022.webp": "royal-front-v2-20261026",
  };
  const revision = replaced[url.pathname]
    ? replaced[url.pathname]
    : isRevisedBack
    ? "modern-back-v6-5in-20260925"
    : /^\/products\/GOOOL_MODERN_PERFORMANCE_(?:ROYAL_|WHITE_)?(?:FRONT|BACK_DETAIL)_V[36]\.png$/.test(url.pathname)
    ? "modern-print-20260925-v4"
    : /^\/products\/goal-ga-(?:big-tee-(?:black|true-royal|white-black-red)|minimal-true-red|minimal-white-black-red)-catalog-/.test(url.pathname)
    ? "frame-2x3-20261020"
    : "backdrop-20260925";
  url.searchParams.set("v", revision);
  return url.pathname + url.search + url.hash;
}

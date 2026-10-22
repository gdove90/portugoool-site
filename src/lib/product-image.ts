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
  // (the True Royal back for white lettering; the True Royal front and
  // both Black shots after they had gone live); the tags keep every image
  // cache from serving the first files.
  const replaced: Record<string, string> = {
    "/products/goal-ga-minimal-true-royal-catalog-product-back-20261022.webp": "true-royal-back-white-20261022",
    "/products/goal-ga-minimal-true-royal-catalog-product-front-20261022.webp": "true-royal-front-v2-20261022",
    "/products/goal-ga-minimal-black-catalog-product-front-20261022.webp": "black-front-v2-20261022",
    "/products/goal-ga-minimal-black-catalog-product-back-20261022.webp": "black-back-v2-20261022",
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

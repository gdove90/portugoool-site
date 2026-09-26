// Change this revision when replacing catalog image bytes at existing paths.
// Source records remain plain file paths for supplier/launch-folder tooling.
export function catalogImageSrc(src: string): string {
  if (!src.startsWith("/products/")) return src;
  const url = new URL(src, "https://goool.shop");
  const isRevisedBack = /^\/products\/GOOOL_MODERN_PERFORMANCE_(?:ROYAL_|WHITE_)?BACK_DETAIL_V6\.png$/.test(url.pathname);
  const revision = isRevisedBack
    ? "modern-back-v6-5in-20260925"
    : /^\/products\/GOOOL_MODERN_PERFORMANCE_(?:ROYAL_|WHITE_)?(?:FRONT|BACK_DETAIL)_V[36]\.png$/.test(url.pathname)
    ? "modern-print-20260925-v4"
    : "backdrop-20260925";
  url.searchParams.set("v", revision);
  return url.pathname + url.search + url.hash;
}

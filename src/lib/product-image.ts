// Change this revision when replacing catalog image bytes at existing paths.
// Source records remain plain file paths for supplier/launch-folder tooling.
export function catalogImageSrc(src: string): string {
  if (!src.startsWith("/products/")) return src;
  const url = new URL(src, "https://goool.shop");
  const isRevisedBack = /^\/products\/GOOOL_MODERN_PERFORMANCE_(?:ROYAL_)?BACK_DETAIL_V3\.png$/.test(url.pathname);
  const revision = isRevisedBack
    ? "modern-open-a-20260925-v5"
    : /^\/products\/GOOOL_MODERN_PERFORMANCE_(?:ROYAL_)?(?:FRONT|BACK_DETAIL)_V3\.png$/.test(url.pathname)
    ? "modern-print-20260925-v4"
    : "backdrop-20260925";
  url.searchParams.set("v", revision);
  return url.pathname + url.search + url.hash;
}

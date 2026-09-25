// Change this revision when replacing catalog image bytes at existing paths.
// Source records remain plain file paths for supplier/launch-folder tooling.
export function catalogImageSrc(src: string): string {
  if (!src.startsWith("/products/")) return src;
  const url = new URL(src, "https://goool.shop");
  url.searchParams.set("v", "backdrop-20260925");
  return url.pathname + url.search + url.hash;
}

import type { Product } from "@/lib/types";
import manifest from "./mens-on-body-v2.json";
import studioManifest from "./mens-studio-v3.json";

const directory = "/products/editorial/men-v2/";

export function productGalleryImages(product: Product, variantIndex: number): Product["images"] {
  const variant = product.colorVariants?.[variantIndex];
  const images = variant?.images || product.images;
  const color = variant?.name || product.color;
  const studio = studioManifest.find(entry => entry.productId === product.id
    && entry.slug === product.slug && entry.color === color);
  if (studio && images.length >= 2) {
    // Preserve the supplier cover and color-specific rear artwork. Matchday's
    // previous rear image was a detail crop, so use its complete rear view.
    return [images[0], studio.back || images[1], ...studio.images];
  }
  const entry = manifest.find(image => image.productId === product.id && image.slug === product.slug);
  // These two caps use Black/Natural for the supplied natural crown / black visor.
  const intendedColor = entry?.color === "Natural / Black" ? "Black/Natural" : entry?.color;
  if (!entry || color !== intendedColor || images.length < 2) return images;

  const src = directory + entry.webp.split("/").pop();
  const remaining = images.filter((image, index) => image.src !== src && !image.src.startsWith(directory)
    && (index < 2 || !/on[- ]body/i.test(image.alt)));
  const onBody = {
    src,
    alt: entry.alt,
    caption: "AI-generated on-body visualization. Not a photograph of a manufactured sample.",
  };
  return [...remaining.slice(0, 2), onBody, ...remaining.slice(2)];
}

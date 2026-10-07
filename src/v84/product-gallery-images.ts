import type { Product } from "@/lib/types";
import manifest from "./mens-on-body-v2.json";

const directory = "/products/editorial/men-v2/";

export function productGalleryImages(product: Product, variantIndex: number): Product["images"] {
  const variant = product.colorVariants?.[variantIndex];
  const images = variant?.images || product.images;
  const color = variant?.name || product.color;
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

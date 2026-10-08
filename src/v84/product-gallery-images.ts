import type { Product } from "@/lib/types";
import manifest from "./mens-on-body-v2.json";
import studioManifest from "./mens-studio-v3.json";
import latestStudioManifest from "./mens-studio-v4.json";

const directory = "/products/editorial/men-v2/";
type StudioGallery = {
  productId: string;
  slug: string;
  color: string;
  hasBackArtwork: boolean;
  back?: Product["images"][number];
  images: Product["images"];
};
const latestGalleries: StudioGallery[] = latestStudioManifest;

export function productGalleryImages(product: Product, variantIndex: number): Product["images"] {
  const variant = product.colorVariants?.[variantIndex];
  const images = variant?.images || product.images;
  const color = variant?.name || product.color;
  const latest = latestGalleries.find(entry => entry.productId === product.id
    && entry.slug === product.slug && entry.color === color);
  if (latest && images.length >= 1) {
    // Only decorated backs receive an isolated rear product view. All colors
    // then use three views of their assigned model and one decoration detail.
    const rear = latest.hasBackArtwork ? [latest.back || images[1]].filter(Boolean) : [];
    return [images[0], ...rear, ...latest.images];
  }
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

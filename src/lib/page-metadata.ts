import type { Metadata } from "next";
import { absolute } from "./seo";

/** Keep each public page's search, sharing and canonical signals together. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const shareTitle = `${title} · GOOOL`;
  const images = [{ url: absolute("/hero-crowd.webp"), width: 1376, height: 768, alt: "GOOOL Athletics" }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "GOOOL Athletics", title: shareTitle, description, url: path, images },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: images.map(image => image.url) },
  };
}

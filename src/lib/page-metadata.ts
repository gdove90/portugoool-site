import type { Metadata } from "next";
import { absolute, BRAND_NAME } from "./seo";

/** Keep each public page's search, sharing and canonical signals together. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const shareTitle = `${title} · ${BRAND_NAME}`;
  const images = [{ url: absolute("/opengraph-image"), width: 1200, height: 630, alt: BRAND_NAME }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: BRAND_NAME, title: shareTitle, description, url: path, images },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: images.map(image => image.url) },
  };
}

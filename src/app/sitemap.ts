import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";

// The sitemap is generated from the live catalog, not hand-listed, so a
// product added or retired in products.ts appears or disappears here on
// the next build without anyone remembering to update a list.
//
// getProducts() already filters on isActive, which is the same gate the
// shop and the homepage use. Retired routes are deliberately absent:
// /drop, /customize, /world-cup and the Minimal Club Tee all 301 from
// middleware, and listing a URL that redirects is a crawl budget waste
// and a mixed signal about which page is canonical.
//
// /cart and /success are absent too. /success carries a Stripe session id
// in its query string and must never be indexed; robots.ts disallows both.

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/track-order`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/refunds`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const products: MetadataRoute.Sitemap = getProducts().map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...pages, ...products].map((entry) => ({
    ...entry,
    lastModified: now,
  }));
}

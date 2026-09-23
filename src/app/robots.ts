import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// There was no robots.txt at all until 2026-09-23, so nothing pointed a
// crawler at a sitemap and nothing kept one out of the checkout tail.
//
// /success carries a Stripe session id in its query string. An indexed
// success URL is both useless in results and a way for one customer's
// order reference to end up in a search engine's cache, so it is the one
// entry here that is about privacy rather than crawl budget.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/success", "/cart", "/print/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

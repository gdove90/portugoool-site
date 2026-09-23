import { Product } from "./types";

// ─────────────────────────────────────────────────────────────
// Search metadata. Added 2026-09-23 after an audit found the store had
// no robots.txt, no sitemap, no canonical tags and no structured data,
// which meant Google could not render a price, an availability or a
// product card for any of the ten products on sale.
//
// EVERY value emitted from here has to be true, on the same standard the
// visible copy is held to. Structured data is a claim to a search engine
// rather than to a reader, and a wrong one is worse than none: it is the
// thing that gets a merchant delisted.
//
// Specifically checked when this was written:
//   price          products.ts priceCents / 100
//   currency       "usd", from the Stripe session in api/checkout
//   availability   InStock, meaning orderable. NOT MadeToOrder, which is
//                  accurate but which search engines surface as text, and
//                  CLAUDE.md line 148 forbids that language in front of a
//                  customer (owner decision, 2026-07-23).
//   returns        MerchantReturnNotPermitted. The FAQ and /terms both say
//                  all sales are final, with a 14 day replacement only for
//                  a defective, damaged or wrong item. A return window
//                  would be a nicer claim and a false one.
//   shipping       US, CA, GB, PT. Exactly the allowed_countries list in
//                  api/checkout/route.ts. This is the claim that was live
//                  and false as "Worldwide Shipping" until this morning.
// ─────────────────────────────────────────────────────────────

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://goool.shop";

export const LEGAL_NAME = "GOOOL Athletics LLC";
export const BRAND_NAME = "GOOOL";
export const CONTACT_EMAIL = "hello@goool.shop";

/** Exactly the countries Stripe Checkout will accept an address in. */
export const SHIPPING_COUNTRIES = ["US", "CA", "GB", "PT"] as const;

export function absolute(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

/** Organization + the site itself. Emitted once, in the root layout. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: BRAND_NAME,
        legalName: LEGAL_NAME,
        url: SITE_URL,
        logo: absolute("/brand/goool-athletics-lockup-white.png"),
        email: CONTACT_EMAIL,
        description:
          "Independent soccer sportswear. Original crests and wordmarks, never licensed.",
        // No sameAs. The brand has no account it actually posts from yet,
        // and pointing at a profile that does not exist is the kind of
        // claim this file exists to avoid.
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

/** One product, with its real price, availability and terms. */
export function productJsonLd(product: Product) {
  const url = `${SITE_URL}/shop/${product.slug}`;
  const images = product.images.map((i) => absolute(i.src));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    image: images,
    sku: product.slug,
    material: product.fabric,
    brand: { "@type": "Brand", name: BRAND_NAME },
    ...(product.color ? { color: product.color } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "USD",
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#organization` },
      shippingDetails: SHIPPING_COUNTRIES.map((country) => ({
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: country,
        },
      })),
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: [...SHIPPING_COUNTRIES],
        returnPolicyCategory:
          "https://schema.org/MerchantReturnNotPermitted",
      },
    },
  };
}

/** Breadcrumbs so search results show Shop > Product rather than a bare URL. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  };
}

/** Renders a JSON-LD block. Kept in one place so escaping is consistent. */
export function jsonLdScript(data: object) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

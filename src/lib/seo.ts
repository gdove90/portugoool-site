import { hasPrice, isAvailableForSale, isSoldOut, type Product, type Size } from "./types";
import { resolveApliiqSku } from "./fulfillment";
import { shippingCentsFor } from "./shipping";
import { defaultVariant } from "@/v84/catalog-data";
import { productGalleryImages } from "@/v84/product-gallery-images";
import { BRAND_SEARCH_DESCRIPTION } from "@/v84/brand-metadata";

// Search claims are derived from the approved catalog, displayed galleries,
// fulfillment mapping and checkout policies. Missing identifiers or delivery
// estimates must stay absent. Availability follows the existing sale gates.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://goool.shop";

export const LEGAL_NAME = "GOOOL Athletics LLC";
export const BRAND_NAME = "GOOOL Athletics";
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
        // Existing approved dark wordmark stays legible on Google's light background.
        logo: absolute("/brand/goool-wordmark-ink.png"),
        email: CONTACT_EMAIL,
        description: BRAND_SEARCH_DESCRIPTION,
        // No sameAs. The brand has no account it actually posts from yet,
        // and pointing at a profile that does not exist is the kind of
        // claim this file exists to avoid.
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND_NAME,
        alternateName: "GOOOL",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

/** Use the same selectable gallery and default color as the storefront. */
export function productSearchImages(product: Product) {
  return productGalleryImages(product, defaultVariant(product)?.index ?? 0);
}

function offer(product: Product, url: string, comingSoon: boolean) {
  if (!hasPrice(product)) return undefined;
  return {
    "@type": "Offer",
    url,
    priceCurrency: "USD",
    price: (product.priceCents / 100).toFixed(2),
    availability: `https://schema.org/${product.isActive && isAvailableForSale(product) && !comingSoon && !isSoldOut(product) ? "InStock" : "OutOfStock"}`,
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${SITE_URL}/#organization` },
    shippingDetails: SHIPPING_COUNTRIES.map(country => ({
      "@type": "OfferShippingDetails",
      shippingDestination: { "@type": "DefinedRegion", addressCountry: country },
      // The advertised shipping cost for one undiscounted item. Basket
      // combinations and discounts are still priced only by checkout.
      shippingRate: { "@type": "MonetaryAmount", value: (shippingCentsFor(product.priceCents) / 100).toFixed(2), currency: "USD" },
    })),
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: [...SHIPPING_COUNTRIES],
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      merchantReturnLink: absolute("/refunds"),
    },
  };
}

function variantJsonLd(product: Product, index: number, size: Size, canonical: string, grouped: boolean) {
  const color = product.colorVariants?.[index]?.name || product.color;
  const url = new URL(canonical);
  if (grouped) {
    url.searchParams.set("color", color);
    url.searchParams.set("size", size);
  }
  const sku = resolveApliiqSku(product.id, color, size)?.sku;
  const offers = offer(product, url.toString(), Boolean(product.colorVariants?.[index]?.comingSoon));
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    url: url.toString(),
    name: product.name,
    description: product.description,
    image: productGalleryImages(product, index).map(image => absolute(image.src)),
    ...(sku ? { sku } : {}),
    material: product.fabric,
    brand: { "@type": "Brand", name: BRAND_NAME },
    ...(color ? { color } : {}),
    size: size === "OS" ? "One size" : size,
    ...(offers ? { offers } : {}),
  };
}

/** Exact existing fulfillment SKUs, selectable sizes/colors and approved imagery.
 * No GTIN, review, preorder or delivery-time claims are inferred. */
export function productJsonLd(product: Product) {
  const url = `${SITE_URL}/shop/${product.slug}`;
  const colors = product.colorVariants?.length || 1;
  const grouped = colors > 1 || product.sizes.length > 1;
  if (!grouped) return {
    "@context": "https://schema.org",
    ...variantJsonLd(product, defaultVariant(product)?.index ?? 0, product.sizes[0], url, false),
  };
  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "@id": `${url}#product-group`,
    url,
    name: product.name,
    description: product.description,
    image: productSearchImages(product).map(image => absolute(image.src)),
    material: product.fabric,
    brand: { "@type": "Brand", name: BRAND_NAME },
    productGroupID: product.id,
    variesBy: [ ...(colors > 1 ? ["https://schema.org/color"] : []), ...(product.sizes.length > 1 ? ["https://schema.org/size"] : []) ],
    hasVariant: Array.from({ length: colors }, (_, index) => product.sizes.map(size => variantJsonLd(product, index, size, url, true))).flat(),
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

import { MIGRATION_PREVIEW } from "@/lib/migration-preview";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/v84/ProductDetail";
import { getProductBySlug, getProducts } from "@/lib/products";
import { hasPrice } from "@/lib/types";
import {
  productJsonLd,
  breadcrumbJsonLd,
  jsonLdScript,
  absolute,
  productSearchImages,
} from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (MIGRATION_PREVIEW) {
    const product = getProductBySlug((await params).slug);
    if (!product) return { title: "Not found", robots: { index: false, follow: false } };
    return { title: "Collection in development", alternates: { canonical: `/shop/${product.slug}` }, robots: { index: false, follow: false } };
  }
  const product = getProductBySlug((await params).slug);
  if (!product) return { title: "Not found" };

  // The title template appends " · GOAL", and every product name already
  // starts with GOOOL, so the raw name rendered as "GOOOL Touchline Cap
  // · GOAL". The brand is stripped here and the template puts it back
  // once, with the price, which is what a shopper scans for in a result.
  const short = product.name.replace(/^GOOOL\s+/, "");
  // An unpriced (Coming Soon) piece shows "Price to be announced" on the
  // page, so the title leaves the price out instead of claiming $0.
  const price = hasPrice(product) ? ` · $${(product.priceCents / 100).toFixed(0)}` : "";

  return {
    title: `${short}${price}`,
    description: product.description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name}${price}`,
      description: product.description,
      type: "website",
      url: `/shop/${product.slug}`,
      images: productSearchImages(product).slice(0, 1).map((i) => ({
        url: absolute(i.src),
        alt: i.alt,
      })),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();
  if (MIGRATION_PREVIEW) return <><h1 className="sr-only">Collection in development</h1><ProductDetail product={product} /></>;


  return (
    <>
      {/* Product and BreadcrumbList. This is what lets a result carry a
          price, an availability and a Shop > Product trail instead of a
          bare URL. Every value is built in lib/seo.ts from the catalog
          itself, so it cannot drift from what the page shows. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(productJsonLd(product))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.name, path: `/shop/${product.slug}` },
          ])
        )}
      />

      <ProductDetail key={product.id} product={product} />

    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductGrid from "@/components/ProductGrid";
import { getProductBySlug, getProducts } from "@/lib/products";
import {
  productJsonLd,
  breadcrumbJsonLd,
  jsonLdScript,
  absolute,
} from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return { title: "Not found" };

  // The title template appends " · GOOOL", and every product name already
  // starts with GOOOL, so the raw name rendered as "GOOOL Touchline Cap
  // · GOOOL". The brand is stripped here and the template puts it back
  // once, with the price, which is what a shopper scans for in a result.
  const short = product.name.replace(/^GOOOL\s+/, "");
  const price = `$${(product.priceCents / 100).toFixed(0)}`;

  return {
    title: `${short} · ${price}`,
    description: product.description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} · ${price}`,
      description: product.description,
      type: "website",
      url: `/shop/${product.slug}`,
      images: product.images.slice(0, 1).map((i) => ({
        url: absolute(i.src),
        alt: i.alt,
      })),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

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
            { name: "Shop", path: "/shop" },
            { name: product.name, path: `/shop/${product.slug}` },
          ])
        )}
      />

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mx-auto max-w-content px-4 pb-16 sm:px-6">
          <h2 className="mb-6 font-display text-2xl uppercase tracking-tightest text-ink">
            You might also like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}

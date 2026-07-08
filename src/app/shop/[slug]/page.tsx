import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductGrid from "@/components/ProductGrid";
import { getProductBySlug, getProducts } from "@/lib/products";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = getProducts()
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mx-auto max-w-content px-4 pb-16 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-tightest text-ink">
            You might also like
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}

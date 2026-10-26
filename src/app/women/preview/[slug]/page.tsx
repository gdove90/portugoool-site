import { notFound, redirect } from "next/navigation";
import ProductDetail from "@/v84/ProductDetail";
import { getProductBySlug } from "@/lib/products";
import { tempoHidden } from "@/lib/collection-launch";
import { verifiedOwner } from "@/lib/intake/auth";

// Owner-only product page for a gated collection (TEMPO while it is
// coming soon, 2026-10-26). The public /shop/<slug> route does not know
// these pieces, so the owner's /women grid links here instead; the same
// sign-in as /admin is required and the page is never indexed.
export const dynamic = "force-dynamic";
export const metadata = { title: "Collection preview", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const owner = await verifiedOwner().catch(() => null);
  if (!owner) redirect("/admin/sign-in");
  const product = getProductBySlug((await params).slug, { includeTempo: true });
  if (!product) notFound();
  if (!tempoHidden(product.id)) redirect(`/shop/${product.slug}`);
  return <><h1 className="sr-only">Collection preview</h1><ProductDetail key={product.id} product={product} /></>;
}

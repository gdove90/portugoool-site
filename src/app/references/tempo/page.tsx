import { redirect } from "next/navigation";
import { verifiedOwner } from "@/lib/intake/auth";
import { pageMetadata } from "@/lib/page-metadata";
import TempoProofs from "@/components/TempoProofs";

// TEMPO placement proofs (Claude Design "TEMPO Collection.dc.html",
// 26 Oct 2026), implemented 2026-10-26 on the owner's instruction as an
// owner-only reference page: off the public menus and sitemap, reachable
// after the same sign-in as /admin. The design's two toggles are query
// flags: ?grid=0 hides the 1 in grid, ?dims=0 hides the red dimension
// lines. Nothing here touches the catalog; the TEMPO handoff still has
// prices, supplier ids and photos to fill in.
export const dynamic = "force-dynamic";
export const metadata = {
  ...pageMetadata("/references/tempo", "TEMPO Placement Proofs", "TEMPO women's collection placement proofs: 7 products, 21 colourways, V1.3 artwork at production size."),
  robots: { index: false, follow: false },
};

const off = (v: string | string[] | undefined) => v === "0" || v === "false" || v === "off";

type Query = Record<string, string | string[] | undefined>;

export default async function Page({ searchParams }: { searchParams?: Promise<Query> }) {
  // The owner gate is the production rule. A local `next dev` run shows the
  // sheet without a sign-in so it can be checked in the preview; NODE_ENV is
  // fixed at build time, so a production build never takes this branch.
  const owner = process.env.NODE_ENV === "development" ? true : await verifiedOwner().catch(() => null);
  if (!owner) redirect("/admin/sign-in");
  const query = (await searchParams) ?? {};
  return <TempoProofs showGrid={!off(query.grid)} showDims={!off(query.dims)} />;
}

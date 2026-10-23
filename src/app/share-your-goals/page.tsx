import { redirect } from "next/navigation";
import { verifiedOwner } from "@/lib/intake/auth";
import { pageMetadata } from "@/lib/page-metadata";
import ReferencePage from "@/v84/ReferencePage";
// Owner-only since 2026-10-22 (owner): off the public menus and sitemap, kept
// in full, reachable after the same sign-in as /admin.
export const dynamic = "force-dynamic";
export const metadata = { ...pageMetadata("/share-your-goals", "Share Your GOALS!", "Share a soccer goal or a moment from the pitch with GOAL Athletics. View the submission guidelines and send your footage."), robots: { index: false, follow: false } };
export default async function Page() {
  const owner = await verifiedOwner().catch(() => null);
  if (!owner) redirect("/admin/sign-in");
  return <ReferencePage route="match" />;
}

import { redirect } from "next/navigation";
import { verifiedOwner } from "@/lib/intake/auth";
import { pageMetadata } from "@/lib/page-metadata";
import ReferencePage from "@/v84/ReferencePage";
// Owner-only since 2026-10-22 (owner): off the public menus and sitemap, kept
// in full, reachable after the same sign-in as /admin.
export const dynamic = "force-dynamic";
export const metadata = { ...pageMetadata("/whats-your-goool", "What's Your GOAL?", "Share your GOAL with GOAL Athletics. Tell us what the game means to you and the feeling you carry beyond the pitch."), robots: { index: false, follow: false } };
export default async function Page() {
  const owner = await verifiedOwner().catch(() => null);
  if (!owner) redirect("/admin/sign-in");
  return <ReferencePage route="story" />;
}

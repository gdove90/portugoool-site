import { pageMetadata } from "@/lib/page-metadata";
import ReferencePage from "@/v84/ReferencePage";
// Public again (owner brief 2026-10-28): the website is the canonical
// submission funnel for the "What's Your GOAL?" community campaign, so the
// page no longer requires the owner sign-in. It stays off the shared menus
// until the owner approves a navigation placement; social links point here.
export const metadata = pageMetadata("/whats-your-goool", "What's Your GOAL?", "Share your GOAL with GOAL Athletics. Tell us what the game means to you and the feeling you carry beyond the pitch.");
export default function Page() {
  return <ReferencePage route="story" />;
}

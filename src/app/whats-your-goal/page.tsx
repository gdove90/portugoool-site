import { pageMetadata } from "@/lib/page-metadata";
import { storyIntakeOpen } from "@/lib/intake/story-launch";
import ReferencePage from "@/v84/ReferencePage";
// Public "What's Your GOAL?" community campaign (owner brief 2026-10-28): the
// website is the canonical submission funnel, so this page needs no sign-in.
// Canonical route /whats-your-goal; the legacy /whats-your-goool slug 301s
// here from middleware. The page stays off the shared menus until the owner
// approves a navigation placement; social links point here.
// Submissions open only with STORY_INTAKE_OPEN=true (see story-launch.ts);
// the flag is read per request so a Netlify env change needs no code change.
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("/whats-your-goal", "What's Your GOAL?", "Share your GOAL with GOAL Athletics. Tell us what the game means to you and the feeling you carry beyond the pitch.");
export default function Page() {
  return <ReferencePage route="story" submissionsOpen={storyIntakeOpen()} />;
}

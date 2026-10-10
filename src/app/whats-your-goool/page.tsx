import { pageMetadata } from "@/lib/page-metadata";
import ReferencePage from "@/v84/ReferencePage";
export const metadata = pageMetadata("/whats-your-goool", "What's Your GOOOL?", "Share your GOOOL with GOOOL Athletics. Tell us what the game means to you and the feeling you carry beyond the pitch.");
export default function Page() { return <ReferencePage route="story" />; }

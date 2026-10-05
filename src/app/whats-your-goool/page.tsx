import type { Metadata } from "next";
import ReferencePage from "@/v84/ReferencePage";
export const metadata: Metadata = { title: "What's Your GOOOL?", alternates: { canonical: "/whats-your-goool" } };
export default function Page() { return <ReferencePage route="story" />; }

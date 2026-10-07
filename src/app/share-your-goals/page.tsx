import type { Metadata } from "next";
import ReferencePage from "@/v84/ReferencePage";
export const metadata: Metadata = { title: "Share Your GOOOLS!", alternates: { canonical: "/share-your-goals" } };
export default function Page() { return <ReferencePage route="match" />; }

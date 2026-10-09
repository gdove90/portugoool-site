import type { Metadata } from "next";
import Editorial from "@/v84/Editorial";
export const metadata: Metadata = { title: "Our World", description: "GOOOL Athletics takes its name from the roar of a goal. Born in Rhode Island, our independent athletic wear carries the feeling beyond the pitch. Wear the Feeling.", alternates: { canonical: "/about" } };
export default function Page() { return <Editorial route="about" />; }

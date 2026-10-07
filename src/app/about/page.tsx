import type { Metadata } from "next";
import Editorial from "@/v84/Editorial";
export const metadata: Metadata = { title: "Our World", alternates: { canonical: "/about" } };
export default function Page() { return <Editorial route="about" />; }

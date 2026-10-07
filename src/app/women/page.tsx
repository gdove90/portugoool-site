import type { Metadata } from "next";
import Editorial from "@/v84/Editorial";
export const metadata: Metadata = { title: "Women", alternates: { canonical: "/women" } };
export default function Page() { return <Editorial route="women" />; }

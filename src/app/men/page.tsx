import type { Metadata } from "next";
import Editorial from "@/v84/Editorial";
export const metadata: Metadata = { title: "Men", alternates: { canonical: "/men" } };
export default function Page() { return <Editorial route="men" />; }

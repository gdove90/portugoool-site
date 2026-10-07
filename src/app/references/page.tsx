import type { Metadata } from "next";
import Editorial from "@/v84/Editorial";
export const metadata: Metadata = { title: "From Board to Browser", alternates: { canonical: "/references" } };
export default function Page() { return <Editorial route="references" />; }

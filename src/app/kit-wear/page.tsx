import type { Metadata } from "next";
import ReferencePage from "@/v84/ReferencePage";
export const metadata: Metadata = { title: "Customize Kitwear", alternates: { canonical: "/kit-wear" } };
export default function Page() { return <ReferencePage route="kit" />; }

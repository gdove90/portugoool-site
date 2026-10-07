import type { Metadata } from "next";
import Editorial from "@/v84/Editorial";
export const metadata: Metadata = { title: "GOOOL Athletics | Wear the Feeling", description: "Heavyweight cotton tees, hoodies and embroidered caps from $32. Original soccer sportswear, never licensed. Ships to the US, Canada, the UK and Portugal.", alternates: { canonical: "/" } };
export default function Home() { return <Editorial route="home" />; }

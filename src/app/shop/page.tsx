import type { Metadata } from "next";
import { CollectionGrid } from "@/v84/Catalog";
import { MobileImage } from "@/v84/MobileImage";
export const metadata: Metadata = { title: "The Collection", description: "Explore the GOOOL Athletics collection of tees, hoodies and embroidered caps.", alternates: { canonical: "/shop" } };
export default function Shop() { return <><div className="collection-top collection-top--visual"><div className="collection-heading"><h1>Find your feeling.</h1></div><figure className="collection-moment"><MobileImage src="/v84/assets/collection-editorial.png" alt="Two athletes back to back on the pitch" fetchPriority="high" /></figure></div><CollectionGrid /></>; }

import { pageMetadata } from "@/lib/page-metadata";
import { CollectionGrid } from "@/v84/Catalog";
import { MobileImage } from "@/v84/MobileImage";
export const metadata = pageMetadata("/shop", "Soccer Apparel & Athletic Wear", "Explore GOOOL Athletics tees, hoodies and caps. Athletic wear rooted in futbol, made for on and off the pitch.");
export default function Shop() { return <><div className="collection-top collection-top--visual"><div className="collection-heading"><h1>Find your feeling.</h1></div><figure className="collection-moment"><MobileImage src="/v84/assets/collection-editorial.png" alt="Two athletes back to back on the pitch" fetchPriority="high" /></figure></div><CollectionGrid /></>; }

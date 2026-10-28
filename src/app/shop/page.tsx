import { pageMetadata } from "@/lib/page-metadata";
import { CollectionGrid } from "@/v84/Catalog";
import { MobileImage } from "@/v84/MobileImage";
export const metadata = pageMetadata("/shop", "Performance Athleticwear | The Collection", "Explore GOAL Athletics performance tees, training shorts and layers for training, warm-up and recovery.");
export default function Shop() { return <><div className="collection-top collection-top--visual"><div className="collection-heading"><h1>Train. Play. Recover.</h1></div><figure className="collection-moment"><MobileImage src="/v84/assets/collection-editorial.png" alt="Two athletes back to back on the pitch" fetchPriority="high" /></figure></div><CollectionGrid /></>; }

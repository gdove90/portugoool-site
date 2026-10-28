import { pageMetadata } from "@/lib/page-metadata";
import Editorial from "@/v84/Editorial";
export const metadata = pageMetadata("/about", "Our World", "Born in Rhode Island with soccer as our founding sport, GOAL Athletics creates performance athleticwear for training and performance across sports.");
export default function Page() { return <Editorial route="about" />; }

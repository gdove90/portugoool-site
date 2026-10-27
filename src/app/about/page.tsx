import { pageMetadata } from "@/lib/page-metadata";
import Editorial from "@/v84/Editorial";
export const metadata = pageMetadata("/about", "Our World", "Born in Rhode Island and rooted in soccer, GOAL Athletics creates athleticwear for training, movement, and everyday life. Discover our story.");
export default function Page() { return <Editorial route="about" />; }

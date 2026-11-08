import { pageMetadata } from "@/lib/page-metadata";
import Editorial from "@/v84/Editorial";
export const metadata = pageMetadata("/about", "Our Story", "Soccer is our heritage. Athleticwear is our identity. Movement is our purpose.");
export default function Page() { return <Editorial route="about" />; }

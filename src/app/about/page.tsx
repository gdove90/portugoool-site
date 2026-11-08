import { pageMetadata } from "@/lib/page-metadata";
import Editorial from "@/v84/Editorial";
import "@/v84/story-refresh.css";
export const metadata = pageMetadata("/about", "Our Story", "Soccer is our heritage. Athleticwear is our identity. Evolution is our purpose.");
export default function Page() { return <div className="our-world-page"><Editorial route="about" /></div>; }

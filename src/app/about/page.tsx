import { pageMetadata } from "@/lib/page-metadata";
import Editorial from "@/v84/Editorial";
export const metadata = pageMetadata("/about", "Our World", "GOOOL Athletics takes its name from the roar of a goal. Born in Rhode Island, our independent athletic wear carries the feeling beyond the pitch. Wear the Feeling.");
export default function Page() { return <Editorial route="about" />; }

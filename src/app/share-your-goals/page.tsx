import { pageMetadata } from "@/lib/page-metadata";
import ReferencePage from "@/v84/ReferencePage";
export const metadata = pageMetadata("/share-your-goals", "Share Your GOALS!", "Share a soccer goal or a moment from the pitch with GOAL Athletics. View the submission guidelines and send your footage.");
export default function Page() { return <ReferencePage route="match" />; }

import { pageMetadata } from "@/lib/page-metadata";
import ReferencePage from "@/v84/ReferencePage";
export const metadata = pageMetadata("/share-your-goals", "Share Your GOOOLS!", "Share a soccer goal or a moment from the pitch with GOOOL Athletics. View the submission guidelines and send your footage.");
export default function Page() { return <ReferencePage route="match" />; }

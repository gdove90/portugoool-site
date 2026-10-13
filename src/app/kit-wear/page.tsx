import { MIGRATION_PREVIEW } from "@/lib/migration-preview";
import CollectionComingSoon from "@/components/CollectionComingSoon";
import { pageMetadata } from "@/lib/page-metadata";
import ReferencePage from "@/v84/ReferencePage";
export const metadata = pageMetadata("/kit-wear", "Club Kitwear Inquiries", "Explore GOAL kitwear and submit a club kit inquiry with your design, colors and quantities.");
export default function Page() { if (MIGRATION_PREVIEW) return <><h1 className="sr-only">GOAL kitwear in development</h1><CollectionComingSoon /></>; return <ReferencePage route="kit" />; }

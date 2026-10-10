import { pageMetadata } from "@/lib/page-metadata";

// Same reason as /contact: page.tsx is a client component with a lookup
// form and cannot export metadata, so the segment layout carries it.
export const metadata = pageMetadata("/track-order", "Track Your Order", "Look up a GOOOL order with its reference and the email address used at checkout.");

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

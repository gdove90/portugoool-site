import type { Metadata } from "next";

// Same reason as /contact: page.tsx is a client component with a lookup
// form and cannot export metadata, so the segment layout carries it.
export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Look up a GOOOL order with its reference and the email address used at checkout.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from "next";

// page.tsx here is a client component (it has a form), and a client
// component cannot export metadata. A route segment layout can, and it
// wraps the same segment, so this is where /contact gets its title,
// description and canonical.
//
// Without this the page inherited the site-wide fallback description,
// which is written for the homepage and says nothing about contacting
// anyone.
export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions about an order, a size or a design. Reach GOOOL Athletics LLC at hello@goool.shop.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

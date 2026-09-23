import type { Metadata } from "next";
import { Anton, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { organizationJsonLd, jsonLdScript } from "@/lib/seo";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Display font (site-wide headings) — the planned upgrade recorded in
// designs/00_brand/typography.md. Single weight; loaded subsetted.
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

// Brush-script accent — used in exactly one place (hero wordmark).
const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marker",
  display: "swap",
});

// "Premium futbol fan apparel" stood in all three of these strings until
// 2026-09-23. "Premium Quality" was removed from the visible benefit bar
// that morning as an adjective with nothing behind it, but the same word
// kept shipping here - and metadata is what search results and link
// previews render, so it was the last place the claim was still public.
// "Original soccer sportswear" is what the About page and the footer
// already say, and it is a fact about the designs rather than a rating of
// them. Do not put an unearned adjective back in a title or description
// just because nobody sees it on the page.
export const metadata: Metadata = {
  title: {
    default: "GOOOL · Original Soccer Sportswear · Made for the Moment.",
    template: "%s · GOOOL",
  },
  // The default description is the FALLBACK, inherited by any page that
  // does not set its own. It read "The First Capsule is live." until
  // 2026-09-23, which meant /contact, /cart and /track-order each
  // announced a four-piece capsule in their search snippet. The capsule
  // framing belongs on /shop, which owns that language deliberately, and
  // sets its own description to say so. This one has to work for any page.
  description:
    "Independent soccer sportswear. Original crests and wordmarks, never licensed. Heavyweight cotton tees, hoodies and embroidered caps, shipped to the US, Canada, the UK and Portugal.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "GOOOL",
    title: "GOOOL · Original Soccer Sportswear",
    description:
      "Independent soccer sportswear. Original crests and wordmarks, never licensed. Made for the Moment.",
    type: "website",
    url: "/",
    locale: "en_US",
    // Existing hero art, not a purpose-built share card. One of those was
    // built and pulled on 2026-09-23 by owner decision. This makes a link
    // pasted into Instagram or Facebook, the two channels actually in use,
    // render with the brand on it rather than blank. 1376x768 is close to
    // the 1.91 ratio those previews crop to.
    images: [
      {
        url: "/hero-crowd.webp",
        width: 1376,
        height: 768,
        alt: "GOOOL",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${anton.variable} ${marker.variable}`}>
      <body>
        {/* Organization and WebSite, emitted once for the whole site.
            Product schema lives on the product pages. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd())}
        />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

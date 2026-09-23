import type { Metadata } from "next";
import { Anton, Permanent_Marker } from "next/font/google";
import "./globals.css";
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
    default: "GOOOL · Made for the Moment. Original soccer sportswear.",
    template: "%s · GOOOL",
  },
  description:
    "The sound every stadium screams, made wearable. Original soccer sportswear, never licensed. The First Capsule is live. Independent brand, our own designs and marks only.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "GOOOL",
    description: "Made for the Moment. Original soccer sportswear.",
    type: "website",
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
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

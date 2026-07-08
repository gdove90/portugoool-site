import type { Metadata } from "next";
import { Anton, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import AnnouncementBar from "@/components/AnnouncementBar";
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

export const metadata: Metadata = {
  title: {
    default: "PORTUGOOOL — The sound of the goal. The shirt for the moment.",
    template: "%s · PORTUGOOOL",
  },
  description:
    "Premium Portuguese-inspired soccer fan apparel. Lightweight, breathable game-day shirts released in limited drops. Independent fan brand — original designs only.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title: "PORTUGOOOL",
    description: "The sound of the goal. The shirt for the moment.",
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
          <AnnouncementBar />
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

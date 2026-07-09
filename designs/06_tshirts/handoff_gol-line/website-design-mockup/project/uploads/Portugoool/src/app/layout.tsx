import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <html lang="en">
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

import type { Metadata } from "next";
import { consentBootstrap } from "@/lib/marketing-consent";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/barlow-condensed/latin-400.css";
import "@fontsource/barlow-condensed/latin-500.css";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "./globals.css";
import "@/v84/style.css";
import "@/v84/kit-wear.css";
import "@/v84/integration.css";
import { organizationJsonLd, jsonLdScript } from "@/lib/seo";
import { CartProvider } from "@/lib/cart";
import Shell from "@/v84/Shell";

// Approved v84 families are self-hosted, including local/offline staging.

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
  // Meta Business domain verification (owner decision 2026-09-30): the
  // value lives in Netlify as META_DOMAIN_VERIFICATION; no tag when unset.
  ...(/^[a-zA-Z0-9]{20,100}$/.test(process.env.META_DOMAIN_VERIFICATION ?? "")
    ? { other: { "facebook-domain-verification": process.env.META_DOMAIN_VERIFICATION! } }
    : {}),
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: consentBootstrap }} />
        <style>{'[data-goool-consent]{display:none}html[data-goool-prompt="true"] [data-goool-consent]{display:block}[data-goool-us]{display:none}html[data-goool-region="US"] [data-goool-us]{display:block}html[data-goool-region="US"] [data-goool-nonus]{display:none}'}</style>
      </head>
      <body>
        {/* Organization and WebSite, emitted once for the whole site.
            Product schema lives on the product pages. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd())}
        />
        <CartProvider>
          <Shell>{children}</Shell>
        </CartProvider>
      </body>
    </html>
  );
}

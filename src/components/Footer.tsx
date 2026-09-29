import Link from "next/link";
import Image from "next/image";
import { CookieSettingsButton } from "./MarketingConsent";
import FooterSignup from "./FooterSignup";

// Footer design 2a "Merged" (Footer Options.dc.html).
// Copy rules: no "The Sound of Victory" (retired), never "football",
// Refunds listed once, no gold.

const INSTAGRAM_URL = "https://www.instagram.com/gooolathletics/";
// /size-guide shipped 2026-09-29 (design 3b).
const SIZE_GUIDE_LIVE = true;

type FooterLink = { href: string; label: string };

const COLUMNS: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Shop",
    links: [
      { href: "/#c-headwear", label: "Headwear" },
      { href: "/#c-performance", label: "Performance" },
      { href: "/#c-hoodies-layers", label: "Hoodies" },
      { href: "/#c-casual-tees", label: "Casual Tees" },
    ],
  },
  {
    heading: "Help",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
      { href: "/track-order", label: "Track order" },
      ...(SIZE_GUIDE_LIVE ? [{ href: "/size-guide", label: "Size guide" }] : []),
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/refunds", label: "Refunds" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

const TRUST = [
  "Secure checkout",
  "Ships to the US, Canada, UK & Portugal",
  "7–12 business days in the US",
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/75">
      {/* Gutters match Header.tsx (px-4 sm:px-6 lg:px-12). */}
      <div className="flex w-full flex-col gap-9 px-5 pb-8 pt-12 sm:px-6 md:gap-12 md:pb-9 md:pt-[72px] lg:px-12">
        <div className="flex flex-col gap-11 md:flex-row md:justify-between md:gap-16">
          <div className="flex flex-col gap-3 md:max-w-[460px]">
            <Image
              src="/brand/goool-athletics-lockup-white.png"
              alt="GOOOL Athletics"
              width={159}
              height={60}
              className="h-[60px] w-auto self-start"
            />
            <p className="font-display text-[26px] uppercase leading-tight text-paper">
              Wear the Feeling.
            </p>
            <FooterSignup />
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-[repeat(3,160px)] md:gap-12"
          >
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-1 md:gap-3">
                <p className="font-display text-sm uppercase tracking-[0.14em] text-paper/55">
                  {col.heading}
                </p>
                <ul className="flex flex-col md:gap-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex min-h-[44px] items-center text-base text-paper transition-colors hover:text-red md:min-h-0"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  {col.heading === "Legal" && (
                    <li className="inline-flex min-h-[44px] items-center text-base text-paper md:min-h-0">
                      <CookieSettingsButton />
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-y border-paper/10 py-5 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-col gap-2 text-[15px] text-paper/80 md:flex-row md:gap-7">
            {TRUST.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {INSTAGRAM_URL && (
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2.5 text-[15px] font-semibold text-paper transition-colors hover:text-red md:min-h-0"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              @gooolathletics
            </a>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-[13px] leading-relaxed text-paper/65">
          <p className="whitespace-nowrap">
            © {new Date().getFullYear()} GOOOL Athletics LLC. All rights reserved.
          </p>
          <p>
            GOOOL Athletics LLC is an independent brand. Not affiliated with,
            endorsed by, or connected to any soccer federation, club, league,
            or governing body. All designs and marks are original.
          </p>
        </div>
      </div>
    </footer>
  );
}

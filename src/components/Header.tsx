"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import MobileNav from "./MobileNav";

// One route to the garments: Collection. The logo is the Home link.
const NAV_LINKS = [
  { href: "/shop", label: "Collection" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6">
        {/* Wordmark — the approved underlined GOOOL mark */}
        <Link href="/" aria-label="GOOOL home" className="flex items-center">
          <Image
            src="/brand/goool-wordmark-white.png"
            alt="GOOOL"
            width={130}
            height={45}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:text-paper ${
                  active
                    ? "text-paper underline decoration-red decoration-2 underline-offset-8"
                    : "text-paper/75"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            aria-current={pathname.startsWith("/contact") ? "page" : undefined}
            className={`hidden rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors md:inline-block ${
              pathname.startsWith("/contact")
                ? "border-paper text-ink bg-paper"
                : "border-paper/40 text-paper hover:border-paper hover:bg-paper/10"
            }`}
          >
            Contact
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            {/* Bag icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 7h12l1 13H5L6 7z" />
              <path d="M9 7V5a3 3 0 0 1 6 0v2" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1 text-[11px] font-bold text-paper">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-paper transition-colors hover:bg-paper/10 md:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} />
    </header>
  );
}

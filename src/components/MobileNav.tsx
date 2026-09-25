"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export default function MobileNav({ open, onClose, links }: MobileNavProps) {
  // Lock body scroll while the menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-ink/60"
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={-1}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-ink shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-paper/10 px-4">
          <Image
            src="/brand/goool-wordmark-white.png"
            alt="GOOOL"
            width={130}
            height={45}
            className="h-auto w-24"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-paper hover:bg-paper/10"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-lg px-3 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              onClose();
              window.dispatchEvent(new Event("goool20:open"));
            }}
            className="mt-2 rounded-lg px-3 py-3 text-left text-sm font-semibold uppercase tracking-[0.1em] text-gold hover:bg-paper/10"
          >
            20% off your first order
          </button>
        </nav>

        <div className="mt-auto p-4">
          <Link
            href="/contact"
            onClick={onClose}
            className="block rounded-full border border-paper/40 px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.1em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

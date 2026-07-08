"use client";

import Link from "next/link";
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
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={-1}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-paper shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-ink/10 px-4">
          <span className="font-display text-lg font-bold uppercase tracking-tightest">
            PORTUG<span className="text-red">OOO</span>L
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-smoke"
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
              className="rounded-lg px-3 py-3 text-base font-medium text-ink transition-colors hover:bg-smoke"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <Link
            href="/drop"
            onClick={onClose}
            className="block rounded-full bg-red px-5 py-3 text-center text-sm font-semibold text-paper transition-colors hover:bg-red-dark"
          >
            Shop the Drop
          </Link>
        </div>
      </div>
    </div>
  );
}

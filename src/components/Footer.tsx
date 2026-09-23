import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink py-12 text-paper">
      {/* Gutters match Header.tsx exactly (px-4 sm:px-6 lg:px-12) so the
          footer content lines up with the nav at every breakpoint. The
          previous mx-auto max-w-content capped it at 1200px, which left
          the footer visibly inset from the full-width header on desktop. */}
      <div className="w-full px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {/* The full GOOOL Athletics lockup, not the plain wordmark.
                The footer is where the whole company name belongs, and at
                200px ATHLETICS is legible.

                Sourced from designs/_LIBRARY/2-logo-designs/lockups/, which
                is what lockups are for. A review suggested
                export/print-files/retail/1a-front.png instead: that is a
                PRINT file, the embroidery artwork for a 4.14 x 1.72in left
                chest placement. Pointing the website at it would mean a
                future thread or sizing revision silently changes the logo
                on every page. Print files and web assets stay separate.

                720x272 native, served at 200x76, same aspect. */}
            <Image
              src="/brand/goool-athletics-lockup-white.png"
              alt="GOOOL Athletics"
              width={200}
              height={76}
            />
            <p className="mt-2 max-w-xs text-sm text-paper/50">
              The Sound of Victory.
            </p>
          </div>

          <nav className="flex gap-16 sm:gap-20" aria-label="Footer">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-paper/40">
                Explore
              </p>
              <ul className="mt-2 space-y-0.5 text-sm">
                <li><Link href="/shop" className="inline-block py-2.5 text-paper/70 hover:text-paper">Collection</Link></li>
                <li><Link href="/about" className="inline-block py-2.5 text-paper/70 hover:text-paper">About</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-paper/40">
                Support
              </p>
              <ul className="mt-2 space-y-0.5 text-sm">
                <li><Link href="/contact" className="inline-block py-2.5 text-paper/70 hover:text-paper">Contact</Link></li>
                <li><Link href="/faq" className="inline-block py-2.5 text-paper/70 hover:text-paper">FAQ</Link></li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-10 border-t border-paper/10 pt-6">
          <nav className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-xs" aria-label="Legal">
            <Link href="/refunds" className="text-paper/50 hover:text-paper">Refund Policy</Link>
            <Link href="/terms" className="text-paper/50 hover:text-paper">Terms of Service</Link>
            <Link href="/privacy" className="text-paper/50 hover:text-paper">Privacy Policy</Link>
          </nav>
          <p className="text-xs leading-relaxed text-paper/40">
            © {new Date().getFullYear()} GOOOL Athletics LLC. All rights
            reserved. Original soccer sportswear. Built for the love of the
            game. Made for the Moment.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-paper/40">
            GOOOL Athletics LLC is an independent brand. Not affiliated with,
            endorsed by, or connected to any football federation, club, league,
            or governing body. All designs and marks are original.
          </p>
        </div>
      </div>
    </footer>
  );
}

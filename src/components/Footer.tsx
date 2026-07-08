import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink py-12 text-paper">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-2xl font-bold uppercase tracking-tightest">
              PORTUG<span className="text-red">OOO</span>L
            </p>
            <p className="mt-2 max-w-xs text-sm text-paper/50">
              The sound of the goal. The shirt for the moment.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm" aria-label="Footer">
            <Link href="/shop" className="text-paper/70 hover:text-paper">Shop</Link>
            <Link href="/about" className="text-paper/70 hover:text-paper">About</Link>
            <Link href="/drop" className="text-paper/70 hover:text-paper">Limited Editions</Link>
            <Link href="/faq" className="text-paper/70 hover:text-paper">FAQ</Link>
            <Link href="/customize" className="text-paper/70 hover:text-paper">Customize Your Jersey</Link>
            <Link href="/track-order" className="text-paper/70 hover:text-paper">Track Order</Link>
            <Link href="/world-cup" className="text-paper/70 hover:text-paper">Summer &apos;26</Link>
            <Link href="/contact" className="text-paper/70 hover:text-paper">Contact</Link>
          </nav>
        </div>

        <div className="mt-10 border-t border-paper/10 pt-6">
          <p className="text-xs leading-relaxed text-paper/40">
            © {new Date().getFullYear()} PORTUGOOOL. All rights reserved.
            PORTUGOOOL is an independent fan apparel brand. Not affiliated with,
            endorsed by, or connected to any football federation, club, league,
            or governing body. All designs and marks are original.
          </p>
        </div>
      </div>
    </footer>
  );
}

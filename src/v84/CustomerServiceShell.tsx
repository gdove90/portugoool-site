import type { ReactNode } from "react";
import Link from "next/link";
import { Brand } from "./Brand";
import { MAILING_STREET, MAILING_CITY_LINE } from "@/lib/business-address";
import styles from "./customer-service.module.css";

// `immersive`: the page brings its own transparent header with the same two
// links over a full-bleed photo (the payment-success page, owner-approved
// design 2026-10-23), so the shell renders no header and leaves the page's
// type styling alone; the footer stays.
export default function CustomerServiceShell({ children, immersive = false }: { children: ReactNode; immersive?: boolean }) {
  return <div className={`v84 ${styles.shell}`}>
    <a className="skip" href="#main">Skip to content</a>
    {!immersive && <header className={styles.header}>
      <Brand />
      <nav aria-label="Customer service">
        <Link href="/track-order">Track order</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>}
    <main id="main" tabIndex={-1} className={immersive ? undefined : "v84-existing-page"}>{children}</main>
    <footer className={styles.footer}>
      <nav aria-label="Help and policies">
        <Link href="/gate">Store updates</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/shipping-returns">Shipping &amp; returns</Link>
        <Link href="/refunds">Refund policy</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
      <p>GOAL Athletics · {MAILING_STREET}, {MAILING_CITY_LINE}</p>
    </footer>
  </div>;
}

import type { ReactNode } from "react";
import Link from "next/link";
import { Brand } from "./Brand";
import { MAILING_STREET, MAILING_CITY_LINE } from "@/lib/business-address";
import styles from "./customer-service.module.css";

export default function CustomerServiceShell({ children }: { children: ReactNode }) {
  return <div className={`v84 ${styles.shell}`}>
    <a className="skip" href="#main">Skip to content</a>
    <header className={styles.header}>
      <Brand />
      <nav aria-label="Customer service">
        <Link href="/track-order">Track order</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
    <main id="main" tabIndex={-1} className="v84-existing-page">{children}</main>
    <footer className={styles.footer}>
      <nav aria-label="Help and policies">
        <Link href="/gate">Store updates</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/shipping-returns">Shipping &amp; returns</Link>
        <Link href="/refunds">Refund policy</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
      <p>The Goal Brand Group LLC · {MAILING_STREET}, {MAILING_CITY_LINE}</p>
    </footer>
  </div>;
}

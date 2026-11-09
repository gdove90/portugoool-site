import type { ReactNode } from "react";
import Link from "next/link";
import { Brand } from "./Brand";
import { MAILING_STREET, MAILING_CITY_LINE } from "@/lib/business-address";
import styles from "./customer-service.module.css";

// `immersive`: the page brings its own transparent header with the same two
// links over a full-bleed photo (the payment-success page, owner-approved
// design 2026-10-23), so the shell renders no header and leaves the page's
// type styling alone; the footer stays.
export default function CustomerServiceShell({ children, immersive = false, helpPage }: { children: ReactNode; immersive?: boolean; helpPage?: "/track-order" | "/refunds" }) {
  const navigation = <>
    <Brand />
    <nav aria-label="Customer service">
      <Link href="/track-order" aria-current={helpPage === "/track-order" ? "page" : undefined}>Track order</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  </>;
  const footerLinks = <nav aria-label="Help and policies">
    <Link href="/gate">Store updates</Link>
    <Link href="/faq">FAQ</Link>
    <Link href="/shipping-returns">Shipping &amp; returns</Link>
    <Link href="/refunds" aria-current={helpPage === "/refunds" ? "page" : undefined}>Refund policy</Link>
    <Link href="/privacy">Privacy</Link>
    <Link href="/terms">Terms</Link>
  </nav>;

  return <div className={`v84 ${styles.shell}${helpPage ? " help-service-shell" : ""}`}>
    <a className="skip" href="#main">Skip to content</a>
    {!immersive && <header className={helpPage ? styles.helpHeader : styles.header}>
      {helpPage ? <div className={`help-wrap ${styles.helpHeaderInner}`}>{navigation}</div> : navigation}
    </header>}
    <main id="main" tabIndex={-1} className={immersive || helpPage ? undefined : "v84-existing-page"}>{children}</main>
    {helpPage ? <footer className={styles.helpFooter}>
      <div className={`help-wrap ${styles.helpFooterInner}`}>
        <div>
          <Brand />
          <address>GOAL Athletics<br />{MAILING_STREET}<br />{MAILING_CITY_LINE}</address>
        </div>
        {footerLinks}
      </div>
    </footer> : <footer className={styles.footer}>
      {footerLinks}
      <p>GOAL Athletics · {MAILING_STREET}, {MAILING_CITY_LINE}</p>
    </footer>}
  </div>;
}

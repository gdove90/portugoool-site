"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { TEMPO_COLLECTION_COMING_SOON } from "@/lib/collection-launch";

const groups = [
  { label: "Shop", links: [["/shop", "The collection"], ["/men", "Men"], ["/women", TEMPO_COLLECTION_COMING_SOON ? "Women · Coming soon" : "Women"], ["/the-goal-collective", "The Goal Collective"]] },
  { label: "Our world", links: [["/about", "Our story"], ["/whats-your-goool", "Your Story"], ["/share-your-goals", "Match Highlights"]] },
  { label: "Help", links: [["/contact", "Contact & support"], ["/track-order", "Track order"], ["/faq", "FAQ"], ["/shipping-returns", "Shipping & returns"], ["/size-guide", "Fit guide"]] },
];

export default function SiteNavigation({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const path = usePathname();
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    const close = () => nav.current?.querySelectorAll("details[open]").forEach(detail => detail.removeAttribute("open"));
    close();
    const outside = (event: PointerEvent) => { if (!nav.current?.contains(event.target as Node)) close(); };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", close);
    return () => { document.removeEventListener("pointerdown", outside); window.removeEventListener("resize", close); };
  }, [path]);
  const links = (items: string[][]) => items.map(([href, label]) => <Link key={href} href={href} prefetch={false} aria-current={path === href ? "page" : undefined} onClick={() => { nav.current?.querySelectorAll("details[open]").forEach(detail => detail.removeAttribute("open")); onNavigate?.(); }}>{label}</Link>);
  return <nav ref={nav} className={mobile ? "grouped-mobile-nav" : "grouped-desktop-nav"} aria-label={mobile ? "Mobile navigation" : "Main navigation"}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) event.currentTarget.querySelectorAll("details[open]").forEach(detail => detail.removeAttribute("open")); }}
    onKeyDown={event => { if (event.key !== "Escape") return; const detail = (event.target as Element).closest("details[open]"); if (detail) { event.preventDefault(); detail.removeAttribute("open"); detail.querySelector("summary")?.focus(); } }}>
    {groups.map(group => mobile ? <section key={group.label}><h2>{group.label}</h2>{links(group.links)}</section> : <details key={group.label} onToggle={event => { const active = event.currentTarget; if (active.open) nav.current?.querySelectorAll("details[open]").forEach(detail => { if (detail !== active) detail.removeAttribute("open"); }); }}><summary>{group.label}</summary><div className="navigation-panel">{links(group.links)}</div></details>)}
  </nav>;
}

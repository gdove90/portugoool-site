"use client";

import { MAILING_ADDRESS } from "@/lib/business-address";

import Link from "next/link";
import { MIGRATION_PREVIEW } from "@/lib/migration-preview";
import { TEMPO_COLLECTION_COMING_SOON } from "@/lib/collection-launch";
import CustomerServiceShell from "./CustomerServiceShell";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { getProducts } from "@/lib/products";
import { catalogImageSrc } from "@/lib/product-image";
import { formatPrice } from "@/lib/format";
import { MAX_LINE_QUANTITY } from "@/lib/types";
import { defaultVariant } from "./catalog-data";
import { Brand, Strike } from "./Brand";
import { InterfaceIcon } from "./InterfaceIcon";
import { useMobileDialogs } from "./useMobileDialogs";
import { mountDepth } from "./depth";
import DiscountPopup from "@/components/DiscountPopup";
import MarketingConsent, { CookieSettingsButton } from "@/components/MarketingConsent";

// Your Story (/whats-your-goool) and Match Highlights (/share-your-goals) left
// the public menus and footer on 2026-10-22 (owner); the pages stay, owner-only.
// From board to browser (/references) left the footer the same day (owner).
const navigation = [["/men", "Men"], ["/women", "Women"], ["/shop", "Collection"], ["/about", "Our world"], ["/the-goal-collective", "The Goal Collective"]];
export default function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  // Public service pages must not mount the store's searchable catalog,
  // shopping dialogs, or discount popup behind the renovation gate.
  if (path === "/gate") return <main id="main">{children}</main>;
  if (["/contact", "/support", "/faq", "/shipping-returns", "/track-order", "/success", "/privacy", "/terms", "/refunds"].includes(path)) {
    return <CustomerServiceShell immersive={path === "/success"}>{children}</CustomerServiceShell>;
  }
  return <StoreShell comingSoonOnly={path === "/women" && TEMPO_COLLECTION_COMING_SOON}>{children}</StoreShell>;
}

function StoreShell({ children, comingSoonOnly = false }: { children: ReactNode; comingSoonOnly?: boolean }) {
  const path = usePathname();
  const menuOpen = useMobileDialogs();
  const shell = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDialogElement>(null), bag = useRef<HTMLDialogElement>(null), search = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const cart = useCart();
  const { subtotalCents, removeItem, updateQuantity, notices } = cart;
  const items = (MIGRATION_PREVIEW || comingSoonOnly) ? [] : cart.items;
  const count = (MIGRATION_PREVIEW || comingSoonOnly) ? 0 : cart.count;
  const [signup, setSignup] = useState("");
  const [signupState, setSignupState] = useState("");
  const [joining, setJoining] = useState(false);
  const [popupReview, setPopupReview] = useState(false);
  useEffect(() => {
    setPopupReview(MIGRATION_PREVIEW && new URLSearchParams(window.location.search).get("discount-preview") === "1");
  }, []);
  const immersive = ["/", "/men", "/women", "/shop", "/about", "/whats-your-goool"].includes(path);
  // The Goal Collective's approved page brings its own header (owner brief,
  // 2026-10-23), so the site header stays out of that route; the footer remains.
  const collective = path === "/the-goal-collective";
  useEffect(() => {
    if (!shell.current) return;
    return mountDepth(shell.current);
  }, [path]);
  useEffect(() => {
    [menu, bag, search].forEach(ref => ref.current?.close());
    document.getElementById("header")?.classList.toggle("light", !immersive);
  }, [path, immersive]);
  useEffect(() => {
    const showBag = () => bag.current?.showModal();
    document.addEventListener("goool:open-bag", showBag);
    const click = (e: MouseEvent) => {
      const target = (e.target as Element).closest("[data-scroll]") as HTMLElement | null;
      if (target) { e.preventDefault(); document.getElementById(target.dataset.scroll!)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "instant" : "smooth" }); }
    };
    document.addEventListener("click", click);
    return () => { document.removeEventListener("goool:open-bag", showBag); document.removeEventListener("click", click); };
  }, []);
  const results = ((MIGRATION_PREVIEW || comingSoonOnly) ? [] : getProducts()).filter(p => `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query.toLowerCase().trim()));
  async function join(event: React.FormEvent) {
    event.preventDefault(); if (joining) return; setJoining(true); setSignupState("");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: signup }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Please try again.");
      setSignupState(result.message || "Welcome to GOAL! Check your inbox for your welcome email and code."); setSignup("");
    } catch (error) { setSignupState(error instanceof Error ? error.message : "Please try again."); }
    finally { setJoining(false); }
  }
  function backdrop(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const r = event.currentTarget.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) event.currentTarget.close();
  }
  if (path.startsWith("/admin")) return <>{children}</>;
  return <div className="v84" ref={shell}><a className="skip" href="#main">Skip to content</a>
    {!collective && <header id="header" className={immersive ? "" : "light"}><Brand /><nav aria-label="Main navigation">{navigation.map(([href, label]) => <Link key={href} className={path === href ? "active" : ""} href={href}>{label}</Link>)}</nav><div className="header-actions"><Link className="header-help nav-underline" href="/contact">Help</Link><button className="icon-button" aria-label="Search collection" onClick={() => search.current?.showModal()}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg></button><button className="bag-button" aria-label={`Open shopping bag, ${count} ${count === 1 ? "item" : "items"}`} onClick={() => bag.current?.showModal()}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l1 14H4L5 7ZM8 8V6a4 4 0 0 1 8 0v2" /></svg><span className="bag-count">{count}</span></button><button className="icon-button menu-button" aria-label="Open menu" aria-controls="menu-dialog" aria-expanded={menuOpen} onClick={() => menu.current?.showModal()}><span className="menu-lines" aria-hidden="true" /><InterfaceIcon name="menu" /></button></div></header>}
    <main id="main" tabIndex={-1} className={["/cart","/success","/track-order","/privacy","/terms","/refunds","/size-guide","/gate"].includes(path) ? "v84-existing-page" : undefined}>{children}</main>
    <footer id="site-footer"><div className="footer-grid"><div className="footer-community"><Brand footer /><form id="footer-signup" className="footer-signup" onSubmit={join}><h3 id="signup-title">Stay in the game.</h3><p className="signup-copy">A welcome email and 20% off your first order.</p><label className="sr-only" htmlFor="signup-email">Email address</label><div className="signup-field"><input id="signup-email" type="email" required maxLength={254} autoComplete="email" placeholder="Your email address" value={signup} onChange={e => setSignup(e.target.value)} /><button disabled={joining}>{joining ? "Joining..." : "Join the list"}</button></div><p className="signup-note">By joining, you agree to receive GOAL Athletics welcome, collection, and offer emails. Unsubscribe anytime. <a href="mailto:support@goalathletics.shop">Contact Support</a>. <a href="/privacy">Privacy</a>.</p><p className="signup-status" role="status">{signupState}</p></form></div><div><h3>SHOP</h3>{navigation.filter(([href]) => ["/men", "/women", "/shop", "/the-goal-collective"].includes(href)).map(([href,label]) => <Link href={href} key={href}>{href === "/shop" ? "The collection" : label}</Link>)}</div><div><h3>OUR WORLD</h3><Link href="/about">Our story</Link><Link href="/contact">Contact &amp; support</Link></div><div><h3>GOOD TO KNOW</h3><Link href="/faq">FAQ</Link><Link href="/shipping-returns">Shipping &amp; returns</Link><Link href="/size-guide">Fit guide</Link><Link href="/track-order">Track order</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/refunds">Refund policy</Link></div></div><div className="footer-legal"><span suppressHydrationWarning>&copy; {new Date().getFullYear()} The Goal Brand Group LLC · {MAILING_ADDRESS}</span><span className="footer-legal-end">Independent. Futbol inspired. Born in Rhode Island.<CookieSettingsButton /></span></div></footer>
    <dialog id="menu-dialog" className="side-dialog menu-dialog" aria-label="Site navigation" ref={menu} onClick={backdrop}><div className="dialog-head"><span className="menu-brand"><Brand /></span><button className="close-button" onClick={() => menu.current?.close()} aria-label="Close menu">Close <span className="menu-desktop-mark">&times;</span><InterfaceIcon name="close" /></button></div><nav aria-label="Mobile navigation">{navigation.map(([href,label],i) => <Link href={href} key={href} aria-current={path === href ? "page" : undefined} onClick={() => menu.current?.close()}>{label}<span className="menu-index">{String(i+1).padStart(2,"0")}</span><InterfaceIcon name="chevron-right" /></Link>)}<Link className="menu-reference" href="/contact" onClick={() => menu.current?.close()}>Contact &amp; support</Link></nav></dialog>
    {/* Closed dialogs must not preload catalog originals ahead of the visible hero. */}
    <dialog id="search-dialog" className="search-dialog" aria-label="Search collection" ref={search} onClick={backdrop}><div className="dialog-head"><h2>Find your next move.</h2><button className="close-button" onClick={() => search.current?.close()} aria-label="Close search">Close <span>&times;</span></button></div><label className="sr-only" htmlFor="search-input">Search products</label><input id="search-input" type="search" placeholder="Try tee, hoodie, cap..." value={query} onChange={e => setQuery(e.target.value)} /><div id="search-results" aria-live="polite">{results.map(p => { const variant = defaultVariant(p)?.variant; const image = variant?.cardImage || (variant?.images || p.images)[0]; return <Link key={p.id} className="search-result" href={`/shop/${p.slug}`} onClick={() => search.current?.close()}><img src={catalogImageSrc(image.src)} alt={image.alt} loading="lazy" /><span>{p.name}<br /><small className="fine">{p.color}</small></span><span>{formatPrice(p.priceCents)}</span></Link>; })}{!results.length && <p className="no-results">No pieces match that search.</p>}</div></dialog>
    <dialog id="bag-dialog" className="side-dialog" aria-label="Shopping bag" ref={bag} onClick={backdrop}><div className="dialog-head"><h2>Your bag <span className="bag-count">{count}</span></h2><button className="close-button" onClick={() => bag.current?.close()} aria-label="Close bag">Close <span>&times;</span></button></div><div id="bag-body">{notices.length > 0 && <p role="status" className="note">Your saved cart has updates. <Link href="/cart">Review changes</Link>.</p>}{!items.length ? <div className="empty-bag"><h3>Your next move<br />starts here.</h3><Link href="/shop" className="btn" onClick={() => bag.current?.close()}>Explore collection <Strike /></Link></div> : <>{items.map(item => <div className="cart-line" key={item.key}><img src={catalogImageSrc(item.image)} alt={item.name} loading="lazy" /><div><div className="cart-row"><Link href={`/shop/${item.slug}`}><h3>{item.name}</h3></Link><span className="fine">{formatPrice(item.unitPriceCents * item.quantity)}</span></div><p>{item.color} / {item.size}</p>{(item.customName || item.customNumber) && <p>{item.customName} {item.customNumber}</p>}<div className="cart-row"><div className="qty"><button onClick={() => updateQuantity(item.key,item.quantity-1)} aria-label={`Decrease ${item.name} quantity`}>-</button><span>{item.quantity}</span><button disabled={item.quantity >= MAX_LINE_QUANTITY} onClick={() => updateQuantity(item.key,item.quantity+1)} aria-label={`Increase ${item.name} quantity`}>+</button></div><button className="remove-item" onClick={() => removeItem(item.key)}>Remove</button></div></div></div>)}<div className="cart-total"><span>Subtotal</span><span>{formatPrice(subtotalCents)}</span></div><Link href="/cart" className="btn" onClick={() => bag.current?.close()}>Review bag &amp; checkout <Strike /></Link><p className="cart-note">Shipping and any applicable discounts are shown before checkout.</p></>}</div></dialog>
    {(!MIGRATION_PREVIEW || popupReview) && !comingSoonOnly && <DiscountPopup review={popupReview} />}
    {!MIGRATION_PREVIEW && <MarketingConsent />}
  </div>;
}

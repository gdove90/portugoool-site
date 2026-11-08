"use client";

import Image from "next/image";
import { catalogImageSrc } from "@/lib/product-image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { consentForServer, trackInitiateCheckout } from "@/lib/meta-pixel";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { SHIPPING_PRICE_COPY, shippingCentsFor } from "@/lib/shipping";
import { cartDelivery, IMPORT_DUTY_COPY } from "@/lib/delivery";
import { createQuoteRequests, quoteContext, type CheckoutQuote } from "@/lib/checkout-quote";
import { MAX_LINE_QUANTITY } from "@/lib/types";

export default function CartPage() {
  const { items, notices, dismissNotices, removeItem, updateQuantity, subtotalCents } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [applied, setApplied] = useState<CheckoutQuote | null>(null);
  const [applying, setApplying] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const requests = useRef(createQuoteRequests());
  const payload = items.map(i => ({ productId: i.productId, size: i.size,
    color: i.color, quantity: i.quantity, customName: i.customName ?? null,
    customNumber: i.customNumber ?? null }));
  const context = quoteContext(payload, email);
  const currentContext = useRef(context);
  currentContext.current = context;
  const quote = applied?.context === context ? applied : null;
  const quotePending = applying || Boolean(applied && !quote);
  const discountCents = quote?.discountCents ?? 0;
  const shippingCents = quote?.shippingCents ?? shippingCentsFor(subtotalCents);
  const totalCents = quote?.totalCents ?? subtotalCents + shippingCents;

  async function applyCode(codeToApply = codeInput): Promise<CheckoutQuote | null> {
    const code = codeToApply.trim();
    if (!code) return null;
    const request = requests.current.begin();
    if (!email.trim()) {
      setApplied(null);
      setApplying(false);
      setCodeError("Enter the email your code was sent to.");
      return null;
    }
    setApplying(true);
    setCodeError(null);
    const isCurrent = () => requests.current.current(request) && currentContext.current === context;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload, email: email.trim(), code, preview: true }),
      });
      const data = await res.json();
      if (!isCurrent()) return null;
      if (!res.ok) {
        setApplied(null);
        setCodeError(data.error ?? "That code could not be applied.");
        return null;
      }
      const next: CheckoutQuote = { code: data.code, discountCents: data.discountCents,
        subtotalCents: data.subtotalCents, shippingCents: data.shippingCents,
        totalCents: data.totalCents, context };
      setApplied(next);
      return next;
    } catch {
      if (isCurrent()) {
        setApplied(null);
        setCodeError("We could not check that code right now. Try again in a moment.");
      }
      return null;
    } finally {
      if (requests.current.current(request)) setApplying(false);
    }
  }

  function removeCode() {
    requests.current.invalidate();
    setApplying(false);
    setApplied(null);
    setCodeInput("");
    setCodeError(null);
  }

  useEffect(() => {
    if (!items.length) { removeCode(); return; }
    if (applied && applied.context !== context) void applyCode(applied.code);
    else { requests.current.invalidate(); setApplying(false); }
    // Revalidate variants and email too, including equal-price cart edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);
  useEffect(() => () => { requests.current.invalidate(); }, []);

  async function handleCheckout() {
    if (!items.length || checkingOut || quotePending) return;
    setCheckingOut(true);
    setError(null);
    let promo = quote;
    if (!promo && codeInput.trim()) {
      promo = await applyCode();
      if (!promo) { setCheckingOut(false); return; }
    }
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload, consent: consentForServer(),
          ...(email.trim() ? { email: email.trim() } : {}),
          ...(promo ? { code: promo.code } : {}) }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Something went wrong starting checkout. Try again.");
      if (currentContext.current !== context) throw new Error("Your bag changed. Check your updated total and try again.");
      // Recognize a successful handoff, with the server's final discounted total.
      // Checkout creation is never a purchase or revenue event.
      trackInitiateCheckout({ slugs: Array.from(new Set(items.map(i => i.slug))),
        value: data.totalCents / 100, currency: "USD",
        numItems: items.reduce((n, i) => n + i.quantity, 0) });
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-4xl uppercase tracking-tightest text-ink">
          Your cart is empty
        </h1>
        <p className="mt-3 text-ink/60">The next goal deserves a shirt.</p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-red px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-red-dark"
        >
          Shop the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="font-display text-4xl uppercase tracking-tightest text-ink sm:text-5xl">
        Cart
      </h1>

      {notices.length > 0 && (
        <div
          role="status"
          className="mt-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink"
        >
          <p className="font-semibold">Your saved cart was updated.</p>
          <ul className="mt-1.5 space-y-1 text-ink/80">
            {notices.map((n, i) => (
              <li key={i}>
                {n.removed ? (
                  <>
                    <span className="font-medium">{n.name}</span> is no longer available and was
                    removed.
                  </>
                ) : (
                  <>
                    <span className="font-medium">{n.name}</span> is now{" "}
                    {formatPrice(n.toCents ?? 0)}
                    {n.fromCents != null && (
                      <span className="text-ink/50"> · was {formatPrice(n.fromCents)}</span>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={dismissNotices}
            className="mt-2 text-sm underline underline-offset-2 hover:text-red"
          >
            Got it
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Line items */}
        <ul className="divide-y divide-ink/10">
          {items.map((item) => (
            <li key={item.key} className="flex gap-4 py-5">
              <Link
                href={`/shop/${item.slug}`}
                className="product-media relative h-28 w-24 shrink-0 overflow-hidden rounded-lg"
              >
                <Image src={catalogImageSrc(item.image)} alt={item.name} fill sizes="96px" className="object-contain" />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/shop/${item.slug}`} className="font-semibold text-ink hover:underline">
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-ink/50">
                      {item.color} · Size {item.size}
                    </p>
                    {(item.customName || item.customNumber) && (
                      <p className="mt-0.5 text-sm text-ink/50">
                        Custom: {item.customName}
                        {item.customName && item.customNumber ? " · " : ""}
                        {item.customNumber && `#${item.customNumber}`}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold text-ink">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  {/* Quantity stepper */}
                  <div className="flex items-center rounded-full border border-ink/20">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-ink/60 hover:text-ink"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      disabled={item.quantity >= MAX_LINE_QUANTITY}
                      className="flex h-9 w-9 items-center justify-center text-ink/60 hover:text-ink disabled:cursor-not-allowed disabled:text-ink/20 disabled:hover:text-ink/20"
                      aria-label="Increase quantity"
                      title={
                        item.quantity >= MAX_LINE_QUANTITY
                          ? `${MAX_LINE_QUANTITY} is the maximum per item`
                          : undefined
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="text-sm text-ink/50 underline-offset-2 hover:text-red hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <div className="h-fit rounded-xl bg-smoke p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl uppercase tracking-tightest text-ink">
            Summary
          </h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="font-semibold text-ink">{formatPrice(subtotalCents)}</dd>
            </div>
            {applied && (
              <div className="flex justify-between">
                <dt className="text-ink/60">Discount ({applied.code})</dt>
                <dd className="font-semibold text-red">-{formatPrice(discountCents)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink/60">Shipping</dt>
              <dd className={shippingCents === 0 ? "font-semibold text-ink" : "text-ink"}>
                {shippingCents === 0 ? "Free" : formatPrice(shippingCents)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-semibold text-ink">{formatPrice(totalCents)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-ink/50" role="status">
            {quotePending ? "Updating your discount and shipping…" : SHIPPING_PRICE_COPY}
          </p>

          <p className="mt-2 text-xs text-ink/50">Tax, if applicable, is shown separately at checkout.</p>

          {/* Email first: a code is tied to the address it was sent to. */}
          <div className="mt-5 border-t border-ink/10 pt-4">
            <label htmlFor="cart-email" className="block text-xs font-semibold text-ink">
              Email
            </label>
            <input
              id="cart-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="mt-1 w-full rounded-lg border border-ink/20 bg-paper px-3 py-2.5 text-base focus:border-ink focus:outline-none"
            />
            <label htmlFor="cart-code" className="mt-3 block text-xs font-semibold text-ink">
              Promotion code
            </label>
            {applied ? (
              <div className="mt-1 flex items-center justify-between rounded-lg border border-ink/20 bg-paper px-3 py-2.5 text-sm">
                <span className="font-semibold text-ink">{applied.code} applied</span>
                <button
                  type="button"
                  onClick={removeCode}
                  className="text-ink/60 underline underline-offset-2 hover:text-ink"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="mt-1 flex gap-2">
                <input
                  id="cart-code"
                  type="text"
                  autoComplete="off"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void applyCode();
                    }
                  }}
                  placeholder="Enter your discount code"
                  className="min-w-0 flex-1 rounded-lg border border-ink/20 bg-paper px-3 py-2.5 text-base uppercase focus:border-ink focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => void applyCode()}
                  disabled={applying || !codeInput.trim()}
                  className="shrink-0 rounded-lg border border-ink px-4 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {applying ? "Checking" : "Apply"}
                </button>
              </div>
            )}
            {codeError && (
              <p className="mt-2 text-xs text-red" role="alert">
                {codeError}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkingOut || quotePending}
            className="mt-6 w-full rounded-full bg-red px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-red-dark disabled:opacity-60"
          >
            {checkingOut ? "Redirecting…" : "Checkout"}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red" role="alert">
              {error}
            </p>
          )}

          <ul className="mt-5 space-y-1.5 text-xs text-ink/60">
            <li>✓ Secure checkout via Stripe</li>
            <li>✓ {cartDelivery(items)}</li>
            <li>✓ Original design</li>
          </ul>

          {/* The terms a buyer is agreeing to have to be readable BEFORE
              they hand off to Stripe, not only in the footer. Two things
              genuinely surprise people otherwise: all sales being final,
              and a customs bill arriving after a parcel that already
              looked paid for. Both are stated here, in the last block
              before the Checkout button's destination. */}
          <p className="mt-5 border-t border-ink/10 pt-4 text-xs leading-relaxed text-ink/50">
            {IMPORT_DUTY_COPY} All sales are final: see the{" "}
            <Link
              href="/refunds"
              className="font-medium text-ink/70 underline underline-offset-2"
            >
              Refund Policy
            </Link>{" "}
            for defects, damage and wrong items, which we replace free.
          </p>
        </div>
      </div>
    </div>
  );
}

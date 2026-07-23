"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotalCents } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (items.length === 0 || checkingOut) return;
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
            customName: i.customName ?? null,
            customNumber: i.customNumber ?? null,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Checkout is not available yet.");
      }
      window.location.href = data.url; // hand off to Stripe Checkout
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink">
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
      <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-5xl">
        Cart
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Line items */}
        <ul className="divide-y divide-ink/10">
          {items.map((item) => (
            <li key={item.key} className="flex gap-4 py-5">
              <Link
                href={`/shop/${item.slug}`}
                className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-smoke"
              >
                <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
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
                      className="flex h-9 w-9 items-center justify-center text-ink/60 hover:text-ink"
                      aria-label="Increase quantity"
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
          <h2 className="font-display text-xl font-bold uppercase tracking-tightest text-ink">
            Summary
          </h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="font-semibold text-ink">{formatPrice(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Shipping</dt>
              <dd className="text-ink/60">Calculated at checkout</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkingOut}
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
            <li>✓ Delivery within 5–7 business days</li>
            <li>✓ Original design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

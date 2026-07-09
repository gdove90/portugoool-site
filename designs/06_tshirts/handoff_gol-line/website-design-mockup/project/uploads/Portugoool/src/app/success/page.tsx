"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";

export default function SuccessPage() {
  const { clear } = useCart();

  // Stripe redirected back here after payment — the cart is done.
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
      <p className="font-display text-6xl font-bold uppercase tracking-tightest text-red sm:text-8xl">
        GOOOOOL!
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-ink">
        Order confirmed.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-ink/60">
        Your shirt goes into production now. You&apos;ll get a confirmation
        email, then tracking as soon as it ships.
      </p>
      <Link
        href="/shop"
        className="mt-10 inline-block rounded-full bg-ink px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-ink/80"
      >
        Keep shopping
      </Link>
    </div>
  );
}

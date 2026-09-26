"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

// ─────────────────────────────────────────────────────────────
// Post-checkout landing. The redirect alone proves nothing: this page
// verifies the Checkout Session server-side (/api/order-status) and
// only then confirms, clears the cart, and shows the order reference.
// Production is never claimed until Apliiq has accepted the order.
// ─────────────────────────────────────────────────────────────

type Status =
  | { kind: "loading" }
  | { kind: "paid"; reference: string | null; productionConfirmed: boolean; email: string | null }
  | { kind: "pending" }
  | { kind: "failed" }
  | { kind: "unknown" };

export default function SuccessPage() {
  const { clear } = useCart();
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setStatus({ kind: "unknown" });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/order-status?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setStatus({ kind: "unknown" });
          return;
        }
        if (data.state === "paid") {
          clear(); // only a verified payment empties the cart
          setStatus({
            kind: "paid",
            reference: data.reference ?? null,
            productionConfirmed: Boolean(data.productionConfirmed),
            email: data.email ?? null,
          });
        } else if (data.state === "pending") {
          setStatus({ kind: "pending" });
        } else {
          setStatus({ kind: "failed" });
        }
      } catch {
        if (!cancelled) setStatus({ kind: "unknown" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clear]);

  if (status.kind === "loading") {
    return (
      <div className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-ink">Confirming your payment…</h1>
        <p className="mx-auto mt-3 max-w-md text-ink/60">One moment while we verify with Stripe.</p>
      </div>
    );
  }

  if (status.kind === "paid") {
    return (
      <div className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-ink">Payment confirmed.</h1>
        <p className="mx-auto mt-3 max-w-md text-ink/60">
          {status.reference ? (
            <>
              Your order reference is{" "}
              <strong className="text-ink">{status.reference}</strong>.{" "}
            </>
          ) : null}
          {status.email ? <>A receipt is on its way to {status.email}. </> : null}
          {status.productionConfirmed
            ? "Your order is in production. Tracking appears on your order page as soon as it ships."
            : "We're getting your order into production. Tracking appears on your order page as soon as it ships."}
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

  if (status.kind === "pending") {
    return (
      <div className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-ink">Payment processing.</h1>
        <p className="mx-auto mt-3 max-w-md text-ink/60" role="status">
          Your payment method is still confirming. We&apos;ll email you the
          moment it clears; your cart is saved until then.
        </p>
        <Link
          href="/cart"
          className="mt-10 inline-block rounded-full border border-ink px-8 py-4 text-base font-semibold text-ink transition-colors hover:bg-smoke"
        >
          Back to cart
        </Link>
      </div>
    );
  }

  const failed = status.kind === "failed";
  return (
    <div className="mx-auto max-w-content px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-semibold text-ink">
        {failed ? "Payment didn't go through." : "We couldn't verify this order."}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-ink/60" role="alert">
        {failed
          ? "No charge was completed. Your cart is untouched, so you can try again whenever you're ready."
          : "If you completed a payment, it's safe: check your email for a Stripe receipt, or contact us and we'll sort it out."}
      </p>
      <Link
        href={failed ? "/cart" : "/contact"}
        className="mt-10 inline-block rounded-full bg-ink px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-ink/80"
      >
        {failed ? "Back to cart" : "Contact us"}
      </Link>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "./success.css";
import { Brand } from "@/v84/Brand";
import { useCart } from "@/lib/cart";
import { LEGAL_NAME, MAILING_CITY_LINE } from "@/lib/business-address";
import { metaPixelId, setKnownEmail, trackVerifiedPurchase } from "@/lib/meta-pixel";

// ─────────────────────────────────────────────────────────────
// Post-checkout landing. The redirect alone proves nothing: this page
// verifies the Checkout Session server-side (/api/order-status) and
// only then confirms, clears the cart, and shows the order reference.
// Production is never claimed until Apliiq has accepted the order.
//
// Design (owner-approved, 2026-10-23): Figma Make "Collective page design
// reference", PaymentSuccess, ported to the App Router. Elevated soccer
// field with goals and a deep-blue track, fully transparent header and
// confirmation panel, subdued "WORK CONTINUES." Only verified order data
// is rendered; the page carries its own header (production Brand logo at
// the storefront header's sizes, see success.css) and the customer-service
// shell keeps its footer. Every state's copy is unchanged from before.
// ─────────────────────────────────────────────────────────────

type Status =
  | { kind: "loading" }
  | { kind: "paid"; reference: string | null; productionConfirmed: boolean; email: string | null }
  | { kind: "pending" }
  | { kind: "failed" }
  | { kind: "unknown" };

const FIELD_PHOTO = "/assets/editorial/payment-athletic-field.jpg";
const navLink =
  "border-b border-white/75 pb-1 text-white no-underline transition-opacity hover:opacity-65";
const actionLink =
  "flex shrink-0 items-center justify-center gap-3 bg-white px-5 py-4 text-[9px] font-medium uppercase tracking-[0.16em] text-[#071526] no-underline transition-colors hover:bg-[#dce8f4]";

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none">
      <path d="M5 15 15 5M7 5h8v8" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none">
      <path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function SuccessPage() {
  const { clear } = useCart();
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    let sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (metaPixelId) {
      // Keep Checkout credentials out of the URL before loading any advertising code.
      try {
        if (sessionId) sessionStorage.setItem("goool_checkout_session", sessionId);
        else sessionId = sessionStorage.getItem("goool_checkout_session");
      } catch { /* payment verification still works without storage */ }
      if (sessionId) history.replaceState(history.state, "", window.location.pathname);
    }
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
          if (data.email) setKnownEmail(data.email);
          if (data.purchaseEvent) trackVerifiedPurchase(data.purchaseEvent);
          setStatus({
            kind: "paid",
            reference: data.reference ?? null,
            productionConfirmed: Boolean(data.productionConfirmed),
            email: data.email ?? null,
          });
          // Stripe can redirect before its webhook records the order. Retry only
          // optional tracking; payment confirmation and the cleared cart stay put.
          if (!data.recorded && !data.purchaseEvent) {
            void (async () => {
              for (let attempt = 0; attempt < 6 && !cancelled; attempt++) {
                await new Promise((resolve) => setTimeout(resolve, 1500));
                if (cancelled) return;
                const followup = await fetch(`/api/order-status?session_id=${encodeURIComponent(sessionId!)}`);
                if (!followup.ok) continue;
                const verified = await followup.json();
                if (cancelled) return;
                if (verified.purchaseEvent) { trackVerifiedPurchase(verified.purchaseEvent); return; }
                if (verified.recorded) return;
              }
            })().catch(() => { /* Optional advertising cannot change payment status. */ });
          }
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

  const paid = status.kind === "paid";
  const reference = paid ? status.reference : null;
  // The real order reference pre-fills the tracking form; without one the
  // link is the plain tracking page, never a half-built URL.
  const trackHref = reference ? `/track-order?reference=${encodeURIComponent(reference)}` : "/track-order";
  const city = MAILING_CITY_LINE.replace(/\s+\d{5}(?:-\d{4})?$/, "");

  return (
    <div className="order-complete relative min-h-screen overflow-hidden bg-[#11120f] text-white">
      <Image
        src={FIELD_PHOTO}
        alt="Elevated view of a soccer field with goals surrounded by a blue running track"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,22,.1)_0%,rgba(4,10,22,.02)_48%,rgba(4,10,22,.48)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,22,.28)_0%,transparent_38%,rgba(4,10,22,.58)_100%)]" />

      <header className="relative z-20 flex h-[78px] items-center justify-between border-b border-white/35 bg-transparent px-5 md:h-[92px] md:px-10 lg:px-14">
        <Brand />
        <nav
          aria-label="Order help"
          className="flex items-center gap-4 whitespace-nowrap text-[9px] font-normal uppercase tracking-[0.16em] md:gap-9 md:text-[10px]"
        >
          <Link className={navLink} href={trackHref}>Track order</Link>
          <Link className={navLink} href="/contact">Contact</Link>
        </nav>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-78px)] flex-col justify-between px-5 pb-5 pt-16 md:min-h-[calc(100vh-92px)] md:px-10 md:pb-8 md:pt-10 lg:px-14">
        <p className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#d7ff36]" aria-hidden="true" />
          <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-white/95">
            {paid ? "Order complete / 01" : "Checkout / 01"}
          </span>
        </p>

        <div className="grid items-end gap-10 lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_560px]">
          <div className="hidden pb-2 lg:block">
            {paid ? (
              <>
                <p className="text-[clamp(82px,10vw,158px)] font-semibold uppercase italic leading-[0.75] tracking-[-0.075em] text-white/20">
                  Work
                  <br />
                  continues.
                </p>
                <p className="mt-8 max-w-[280px] text-[10px] uppercase leading-[1.8] tracking-[0.2em] text-white/90">
                  Your order is in. We&rsquo;ll take it from here.
                </p>
              </>
            ) : null}
          </div>

          <article
            className="border border-white/55 bg-transparent px-6 py-7 text-white md:px-10 md:py-9 lg:px-12 lg:py-11"
            aria-live="polite"
          >
            <div className="mb-14 flex items-start justify-between md:mb-20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/10">
                {paid ? <CheckMark /> : null}
              </div>
              <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/90">
                {status.kind === "loading" && "Verifying"}
                {status.kind === "paid" && "Confirmed"}
                {status.kind === "pending" && "Processing"}
                {status.kind === "failed" && "Not completed"}
                {status.kind === "unknown" && "Unverified"}
              </span>
            </div>

            {status.kind === "loading" && (
              <>
                <h1 className="text-[43px] font-semibold uppercase italic leading-[0.9] tracking-[-0.055em] md:text-[58px]">
                  Confirming
                  <br />
                  your payment.
                </h1>
                <p className="mt-6 max-w-[430px] text-[12px] leading-[1.7] text-white/90 md:text-[13px]">
                  One moment while we verify with Stripe.
                </p>
              </>
            )}

            {status.kind === "paid" && (
              <>
                <h1 className="text-[43px] font-semibold uppercase italic leading-[0.9] tracking-[-0.055em] md:text-[58px]">
                  Payment
                  <br />
                  confirmed.
                </h1>
                <p className="mt-6 max-w-[430px] text-[12px] leading-[1.7] text-white/90 md:text-[13px]">
                  {status.reference ? (
                    <>
                      Your order reference is{" "}
                      <strong className="font-semibold text-white">{status.reference}</strong>.{" "}
                    </>
                  ) : null}
                  {status.email ? (
                    <>
                      A receipt is on its way to{" "}
                      <strong className="font-semibold text-white">{status.email}</strong>.{" "}
                    </>
                  ) : null}
                  {status.productionConfirmed
                    ? "Your order is in production."
                    : "We’re getting your order into production."}
                </p>
                <div className="mt-9 flex flex-col gap-3 border-t border-white/40 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[9px] uppercase leading-[1.6] tracking-[0.16em] text-white/75">
                    Tracking appears once your order ships
                  </p>
                  <Link href="/shop" className={actionLink}>
                    Keep shopping
                    <ArrowUpRight />
                  </Link>
                </div>
              </>
            )}

            {status.kind === "pending" && (
              <>
                <h1 className="text-[43px] font-semibold uppercase italic leading-[0.9] tracking-[-0.055em] md:text-[58px]">
                  Payment
                  <br />
                  processing.
                </h1>
                <p className="mt-6 max-w-[430px] text-[12px] leading-[1.7] text-white/90 md:text-[13px]" role="status">
                  Your payment method is still confirming. We&apos;ll email you the
                  moment it clears; your cart is saved until then.
                </p>
                <div className="mt-9 flex flex-col gap-3 border-t border-white/40 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[9px] uppercase leading-[1.6] tracking-[0.16em] text-white/75">
                    Nothing to do yet
                  </p>
                  <Link href="/cart" className={actionLink}>
                    Back to cart
                    <ArrowUpRight />
                  </Link>
                </div>
              </>
            )}

            {(status.kind === "failed" || status.kind === "unknown") && (
              <>
                <h1 className="text-[43px] font-semibold uppercase italic leading-[0.9] tracking-[-0.055em] md:text-[58px]">
                  {status.kind === "failed" ? (
                    <>
                      Payment didn&rsquo;t
                      <br />
                      go through.
                    </>
                  ) : (
                    <>
                      We couldn&rsquo;t
                      <br />
                      verify this order.
                    </>
                  )}
                </h1>
                <p className="mt-6 max-w-[430px] text-[12px] leading-[1.7] text-white/90 md:text-[13px]" role="alert">
                  {status.kind === "failed"
                    ? "No charge was completed. Your cart is untouched, so you can try again whenever you're ready."
                    : "If you completed a payment, it's safe: check your email for a Stripe receipt, or contact us and we'll sort it out."}
                </p>
                <div className="mt-9 flex flex-col gap-3 border-t border-white/40 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[9px] uppercase leading-[1.6] tracking-[0.16em] text-white/75">
                    {status.kind === "failed" ? "Your cart is waiting" : "We’re here to help"}
                  </p>
                  <Link href={status.kind === "failed" ? "/cart" : "/contact"} className={actionLink}>
                    {status.kind === "failed" ? "Back to cart" : "Contact us"}
                    <ArrowUpRight />
                  </Link>
                </div>
              </>
            )}
          </article>
        </div>

        <footer className="mt-10 flex items-end justify-between gap-6 border-t border-white/35 pt-4 text-white/85">
          <div>
            <p className="max-w-[210px] text-[8px] uppercase leading-[1.7] tracking-[0.14em] md:max-w-none">
              {LEGAL_NAME} · {city}
            </p>
            <p className="mt-1 text-[7px] tracking-[0.08em] text-white/60">Photo by Serhii Kalyn</p>
          </div>
          <p className="text-[8px] font-medium uppercase tracking-[0.2em]">Made for the pursuit</p>
        </footer>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ShipmentTracking from "@/components/ShipmentTracking";
import HelpPageHeading from "@/v84/HelpPageHeading";
import {
  normalizeCarrier,
  uniqueShipmentPackages,
  type TrackingDetails,
  type TrackingPackage,
} from "@/lib/carrier-tracking/presentation";

// ─────────────────────────────────────────────────────────────
// Real order tracking. The lookup calls /api/track-order with the
// order reference (GOOOL-XXXXXXXX, from the confirmation page) plus
// the checkout email; the server verifies both together. No fake
// "status is on its way" promises — every message reflects what the
// backend actually did.
//
// Carrier enrichment reads a separate authenticated cache after
// the original lookup succeeds; it cannot replace that lookup's result.
// ─────────────────────────────────────────────────────────────

interface Shipment {
  carrier: string | null;
  trackingNumbers: string[];
  trackingUrls: string[];
}

type Result =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "found"; status: string; shipments: Shipment[] }
  | { kind: "error"; message: string };

function abortLookups(
  generation: { current: number },
  lookup: { current: AbortController | null },
  details: { current: AbortController | null },
) {
  generation.current++;
  lookup.current?.abort();
  details.current?.abort();
}

export default function TrackOrderPage() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result>({ kind: "idle" });
  const [details, setDetails] = useState<TrackingDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const lookupGeneration = useRef(0);
  const lookupController = useRef<AbortController | null>(null);
  const detailsController = useRef<AbortController | null>(null);

  // The confirmation page links here with the real order reference; pre-fill
  // it so the customer only adds their email. Anything else is ignored.
  useEffect(() => {
    const given = new URLSearchParams(window.location.search).get("reference") ?? "";
    if (/^GOOOL-[0-9A-F]{8}$/i.test(given)) setReference(given.toUpperCase());
    return () => abortLookups(lookupGeneration, lookupController, detailsController);
  }, []);

  async function enrich(credentials: { reference: string; email: string }, generation: number) {
    const controller = new AbortController();
    detailsController.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    setDetailsLoading(true);
    try {
      const res = await fetch("/api/track-order-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        cache: "no-store",
        signal: controller.signal,
      });
      const data = await res.json();
      if (generation !== lookupGeneration.current) return;
      setDetails(res.ok && typeof data.available === "boolean" && Array.isArray(data.packages)
        ? data as TrackingDetails : { available: false, packages: [] });
    } catch {
      if (generation === lookupGeneration.current) setDetails({ available: false, packages: [] });
    } finally {
      window.clearTimeout(timeout);
      if (generation === lookupGeneration.current) setDetailsLoading(false);
    }
  }

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    const generation = ++lookupGeneration.current;
    lookupController.current?.abort();
    detailsController.current?.abort();
    const controller = new AbortController();
    lookupController.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    const credentials = { reference, email };
    setDetails(null);
    setDetailsLoading(false);
    setResult({ kind: "loading" });
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        cache: "no-store",
        signal: controller.signal,
      });
      const data = await res.json();
      if (generation !== lookupGeneration.current) return;
      if (!res.ok) {
        setResult({ kind: "error", message: data.error ?? "Lookup failed." });
        return;
      }
      setResult({ kind: "found", status: data.status, shipments: data.shipments ?? [] });
      void enrich(credentials, generation);
    } catch {
      if (generation !== lookupGeneration.current) return;
      setResult({
        kind: "error",
        message: "Order lookup isn't available right now. Email support@goalathletics.shop and we'll check for you.",
      });
    } finally {
      window.clearTimeout(timeout);
    }
  }

  const fallbackPackages = result.kind === "found" ? uniqueShipmentPackages(result.shipments) : [];
  const packageKey = (pkg: TrackingPackage) => `${(normalizeCarrier(pkg.carrier) ?? pkg.carrier ?? "").toLowerCase()}:${pkg.trackingNumber.replace(/\s/g, "").toUpperCase()}`;
  const enrichedPackages = new Map((details?.packages ?? []).map(pkg => [packageKey(pkg), pkg]));
  // Render every persisted package even when enrichment has only some of them.
  const packages = fallbackPackages.map(pkg => enrichedPackages.get(packageKey(pkg)) ?? pkg);

  return <div className="help-page help-wrap">
    <HelpPageHeading title="Track your order.">
      Use the reference from your order confirmation and the email address you used at checkout.
    </HelpPageHeading>

    <div className="help-track-layout">
      <section aria-labelledby="track-form-heading">
        <h2 className="help-section-title" id="track-form-heading">Check your order status</h2>
        <form className="help-track-form" onSubmit={lookup}>
          <div className="help-track-field">
            <label className="help-eyebrow" htmlFor="track-ref">Order reference</label>
            <input
              id="track-ref"
              type="text"
              required
              maxLength={32}
              value={reference}
              onChange={event => setReference(event.target.value)}
              placeholder="GOOOL-1A2B3C4D"
              autoCapitalize="characters"
              spellCheck={false}
            />
          </div>
          <div className="help-track-field">
            <label className="help-eyebrow" htmlFor="track-email">Order email</label>
            <input
              id="track-email"
              type="email"
              required
              maxLength={254}
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <button className="help-action help-check-status" type="submit" disabled={result.kind === "loading"}>
            {result.kind === "loading" ? "Checking…" : "Check status"}
          </button>
          {result.kind === "error" && <p className="help-track-error" role="alert">{result.message}</p>}
        </form>
      </section>

      <div className="help-track-side">
        {result.kind === "found" ? <section className="help-track-result" aria-labelledby="shipment-progress-title">
          <h2 className="help-section-title" id="shipment-progress-title">Shipment progress</h2>
          <div className="help-order-status" role="status">
            <p className="help-eyebrow">{["Refunded.", "Cancelled."].includes(result.status) ? "Order status" : "Supplier fulfillment status"}</p>
            <p className="help-subheading">{result.status}</p>
            {fallbackPackages.length > 0 && <p className="help-copy">See the carrier status for each package below. A shipment notice does not confirm carrier acceptance.</p>}
          </div>
          <ShipmentTracking packages={packages} loading={detailsLoading} available={details?.available ?? false} />
        </section> : <section aria-labelledby="track-timeline-heading">
          <h2 className="help-section-title" id="track-timeline-heading">From checkout to delivery</h2>
          <ol className="help-track-steps">
            {[
              ["Order confirmed", "Your confirmation email includes your order reference."],
              ["Shipped", "We email your tracking number when your order ships."],
              ["Delivered", "Orders arrive within 7–12 business days in the US. Canada, the UK and Portugal typically take 2 to 3 weeks."],
            ].map(([title, body], index) => <li key={title}>
              <span className="help-number" aria-hidden="true">0{index + 1}</span>
              <div><p className="help-track-step-title">{title}</p><p className="help-copy">{body}</p></div>
            </li>)}
          </ol>
        </section>}

        <div className="help-track-support">
          <p className="help-eyebrow">Still need help?</p>
          <p className="help-copy">Contact us and we’ll reply within one business day.</p>
          <Link className="help-action" href="/contact">Contact support</Link>
        </div>
      </div>
    </div>
  </div>;
}

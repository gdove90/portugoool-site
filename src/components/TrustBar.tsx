// Trust bar — website-bible §4.3 (dark variant, Iteration 01).
// Exactly 4 items. This section never links.
//
// Every claim here must be true of the WHOLE catalog, because this bar
// sits on the homepage above every product. That rule killed two earlier
// entries on 2026-09-23:
//
//   "Worldwide Shipping / For Fans Everywhere" was false. Checkout allows
//   US, CA, GB and PT only, so a visitor anywhere else read a promise the
//   cart could not keep. It now names the four countries.
//
//   "Premium Quality / Built to Perform" was an adjective asking to be
//   believed. It is replaced by the standard that produced d0c3a34, where
//   a finished shirt was pulled from the range over a 1.19mm letter
//   stroke. A fabric claim was considered and rejected: only 2 of 10
//   active products are 6.5oz garment-dyed cotton, so it belongs on those
//   product pages, not here.
//
// Homepage v2 (2026-09-29): "Made for the Moment" moved into the hero,
// where it already sat as the tagline, and its slot became "Secure
// Checkout / Card and wallet payments." Stripe Checkout takes cards plus
// Apple Pay, Google Pay and Link, so both halves hold. Icons went from
// gold to white to match the approved layout.

const ITEMS = [
  {
    title: "Original Designs",
    sub: "Ours. Never licensed.",
    icon: (
      // Box
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8" />
    ),
  },
  {
    title: "Secure Checkout",
    sub: "Card and wallet payments.",
    icon: (
      // Lock
      <path d="M7 11V8a5 5 0 0110 0v3M5 11h14v10H5zM12 15v2" />
    ),
  },
  {
    title: "US, Canada, UK & Portugal",
    sub: "7 to 12 business days in the US.",
    icon: (
      // Globe
      <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z" />
    ),
  },
  {
    title: "Measured, Not Eyeballed",
    sub: "Every print checked at actual size.",
    icon: (
      // Shield-check
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3zM9 12l2 2 4-4" />
    ),
  },
];

export default function TrustBar() {
  return (
    <section className="border-t border-paper/10 bg-ink py-7 text-paper">
      <div className="mx-auto grid max-w-content grid-cols-2 gap-x-6 gap-y-6 px-4 sm:px-6 lg:grid-cols-4 lg:gap-x-10">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-start gap-3.5">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            >
              {item.icon}
            </svg>
            <div>
              <p className="font-display text-sm uppercase tracking-widest">
                {item.title}
              </p>
              <p className="mt-1 text-sm text-paper/60">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Trust bar — website-bible §4.3 (dark variant, Iteration 01).
// Exactly 4 items. This section never links.

const ITEMS = [
  {
    title: "Original Designs",
    sub: "100% Independent",
    icon: (
      // Box
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8" />
    ),
  },
  {
    title: "Premium Quality",
    sub: "Built to Perform",
    icon: (
      // Shield-check
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3zM9 12l2 2 4-4" />
    ),
  },
  {
    title: "Worldwide Shipping",
    sub: "For Fans Everywhere",
    icon: (
      // Globe
      <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z" />
    ),
  },
  {
    title: "Made for the Moment",
    sub: "When It Hits Different",
    icon: (
      // Star
      <path d="M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.3 6.4 20.3l1.2-6.3L3 9.6l6.3-.8L12 3z" />
    ),
  },
];

export default function TrustBar() {
  return (
    <section className="border-t border-paper/10 bg-ink py-7">
      <div className="mx-auto grid max-w-content grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-center justify-center gap-3.5">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9A227"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="shrink-0"
              aria-hidden="true"
            >
              {item.icon}
            </svg>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-paper">
                {item.title}
              </p>
              <p className="text-[11px] text-paper/50">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

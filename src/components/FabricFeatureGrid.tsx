const FEATURES = [
  {
    title: "Lightweight & breathable",
    body: "100% recycled performance polyester. Air moves through it.",
  },
  {
    title: "Silky smooth feel",
    body: "Soft hand feel that doesn't cling. Comfortable for 90+ minutes.",
  },
  {
    title: "Moisture-wicking",
    body: "Sweat moves out, not in. Stay dry through extra time.",
  },
  {
    title: "Built for game day",
    body: "Made for the stadium, the bar, and the living room couch.",
  },
  {
    title: "Everyday comfortable",
    body: "Premium enough for match day. Easy enough for every day.",
  },
  {
    title: "Print that lasts",
    body: "Sublimation-friendly fabric keeps color sharp, wash after wash.",
  },
];

export default function FabricFeatureGrid() {
  return (
    <section className="bg-smoke py-16 sm:py-20">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <h2 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
          The fabric
        </h2>
        <p className="mt-2 max-w-lg text-ink/60">
          Performance-style shirts. No heavy cotton. No stiff prints.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl bg-paper p-6">
              <h3 className="font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

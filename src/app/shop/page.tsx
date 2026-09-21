import type { Metadata } from "next";
import ShopCollections from "@/components/ShopCollections";
import { resolveCollections } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "The First Capsule: everyday staples with athletic purpose, grouped into Off the Pitch, Warm-Up Club, Match Ready and Touchline Essentials. Coming soon.",
};

export default function ShopPage() {
  const collections = resolveCollections();

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 sm:py-14 xl:px-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-5xl">
          The First Capsule
        </h1>
        <p className="mt-2 max-w-lg text-ink/60">
          Everyday staples. Athletic purpose. The first GOOOL capsule.
        </p>
      </div>

      <ShopCollections collections={collections} />
    </div>
  );
}

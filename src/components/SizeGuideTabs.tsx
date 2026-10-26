"use client";

import { useEffect, useState } from "react";
import { SIZE_CHARTS, inches } from "@/lib/size-charts";
import { getProducts } from "@/lib/products";

// ─────────────────────────────────────────────────────────────
// The tabbed chart on /size-guide (design 3b). One config array drives
// the tabs, the panel titles and which blank's rows are shown; the
// numbers themselves come from SIZE_CHARTS and are never written here.
// GUIDE is exported so the product-page dialog (SizeGuide.tsx) can
// deep-link a product to its tab by product id. Each tab lists the
// catalog ids it covers; the panel title is the live names of those
// products, so a rename in products.ts renames the tab's heading too
// (2026-10-26: the raincoat landed on the Matchday Tee tab because the
// tabs were keyed by blank and titled by hand).
//
// The active tab lives in the URL hash (#performance, #hoodies, ...):
// read on mount, written with replaceState on click so the back button
// is not polluted, and followed on hashchange so in-page links work.
// ─────────────────────────────────────────────────────────────

export const GUIDE = [
  {
    id: "performance",
    label: "Performance Tees",
    chart: "st720",
    productIds: ["80000000-0000-4000-8000-000000000011", "80000000-0000-4000-8000-000000000012"],
  },
  {
    id: "hoodies",
    label: "Hoodies",
    chart: "ind4000",
    productIds: ["80000000-0000-4000-8000-000000000014", "80000000-0000-4000-8000-000000000015"],
  },
  {
    id: "shorts",
    label: "Shorts",
    chart: null,
    productIds: ["80000000-0000-4000-8000-000000000013"],
    blank: "Training shorts · split sides",
    // The letter sizes are the owner's waist mapping (fulfillment.ts); the
    // maker publishes no flat garment table we have verified, so none is
    // shown.
    note: "Sold S to XXL, and each letter is a waist size: S fits a 30 in waist, M 32 in, L 34 in, XL 36 in, XXL 38 in. Order the waist you wear in jeans.",
  },
  {
    id: "jackets",
    label: "Jackets",
    chart: "j333",
    productIds: ["80000000-0000-4000-8000-000000000016"],
  },
  {
    id: "caps",
    label: "Caps",
    chart: null,
    productIds: ["80000000-0000-4000-8000-000000000009", "80000000-0000-4000-8000-000000000010"],
    blank: "Structured cotton-blend twill cap",
    note: "One adjustable size.",
  },
  // TEMPO (women), 2026-10-26.
  {
    id: "women-tees",
    label: "Women's Tees",
    chart: "lst350",
    productIds: ["80000000-0000-4000-8000-000000000017"],
  },
  {
    id: "women-training-tee",
    label: "Training Tee",
    chart: null,
    productIds: ["80000000-0000-4000-8000-000000000021"],
    blank: "Women's lightweight polyester crew · 130 gsm",
    note: "Sold S to XXL. A regular women's fit that sits closer to the body than the Core tees; between sizes, go up. The maker's flat measurements are still to be published here.",
  },
  {
    id: "women-hoodies",
    label: "Women's Hoodies",
    chart: "bc7519",
    productIds: ["80000000-0000-4000-8000-000000000020"],
  },
  {
    id: "pants",
    label: "Pants",
    chart: "lpst800",
    productIds: ["80000000-0000-4000-8000-000000000019"],
  },
  {
    id: "women-shorts",
    label: "Women's Shorts",
    chart: null,
    productIds: ["80000000-0000-4000-8000-000000000022"],
    blank: "Women's stretch short · 86% polyester, 14% spandex",
    note: "Sold S to XXL. A women's cut with a wide, flat waistband that sits at the natural waist; order your usual size. The maker's flat measurements are still to be published here.",
  },
  {
    id: "layers",
    label: "Quarter Zip",
    chart: null,
    productIds: ["80000000-0000-4000-8000-000000000018"],
    blank: "Women's stretch quarter zip · 91% polyester, 9% spandex",
    note: "Sold S to XL, the maker's whole run. A close, body-skimming fit with thumbholes; size up for room to layer. The maker's flat measurements are still to be published here.",
  },
] as const;

export type GuideTabId = (typeof GUIDE)[number]["id"];

/** The tab's heading: the live names of the products it covers. */
export function guideTitle(tab: (typeof GUIDE)[number]): string {
  const names = getProducts()
    .filter((p) => (tab.productIds as readonly string[]).includes(p.id))
    .map((p) => p.name.replace(/^GOAL Athletics /, ""));
  return names.length ? names.join(" · ") : tab.label;
}

/** The /size-guide tab for a catalog product, or null when none covers it. */
export function guideTabFor(productId: string) {
  return GUIDE.find((g) => (g.productIds as readonly string[]).includes(productId)) ?? null;
}

const DEFAULT_TAB: GuideTabId = "performance";

function tabFromHash(): GuideTabId {
  const hash = window.location.hash.replace(/^#/, "");
  return GUIDE.some((g) => g.id === hash) ? (hash as GuideTabId) : DEFAULT_TAB;
}

export default function SizeGuideTabs() {
  const [active, setActive] = useState<GuideTabId>(DEFAULT_TAB);

  useEffect(() => {
    setActive(tabFromHash());
    const onHash = () => setActive(tabFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function select(id: GuideTabId) {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  const tab = GUIDE.find((g) => g.id === active) ?? GUIDE[0];

  return (
    <div className="flex flex-col gap-7">
      <div
        role="tablist"
        aria-label="Garment"
        className="-mr-5 flex gap-2 overflow-x-auto border-b border-ink/10 pb-5 md:mr-0 md:flex-wrap md:overflow-visible"
      >
        {GUIDE.map((g) => {
          const selected = g.id === active;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={selected}
              aria-controls={`panel-${g.id}`}
              onClick={() => select(g.id)}
              className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-full px-[18px] font-display text-sm uppercase tracking-[0.08em] ${
                selected ? "bg-ink text-paper" : "border border-ink/30 text-ink"
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab.id}`}
        aria-labelledby={`tab-${tab.id}`}
        className="flex flex-col gap-4"
      >
        <h2 className="font-display text-[28px] uppercase leading-tight">{guideTitle(tab)}</h2>
        {tab.chart === null ? (
          <>
            <p className="text-[15px] text-ink/60">{tab.blank}</p>
            <p className="max-w-[760px] text-[15px] leading-relaxed text-ink/75">{tab.note}</p>
          </>
        ) : (
          <ChartTable chartKey={tab.chart} />
        )}
      </div>
    </div>
  );
}

function ChartTable({ chartKey }: { chartKey: keyof typeof SIZE_CHARTS }) {
  const chart = SIZE_CHARTS[chartKey];
  const hasSleeve = chart.rows.some((r) => r.sleeveIn != null);
  const waist = chart.measure === "waist";
  const cols = hasSleeve
    ? "grid-cols-[70px_repeat(4,minmax(0,1fr))]"
    : "grid-cols-[70px_repeat(3,minmax(0,1fr))]";

  return (
    <>
      <p className="text-[15px] text-ink/60">{chart.blank}</p>

      <div className="overflow-x-auto">
        <div role="table" aria-label={`${chart.blank} measurements`} className="min-w-[460px] md:min-w-0">
          <div role="row" className={`grid ${cols} gap-3 border-b-2 border-ink py-3 text-[15px] font-bold`}>
            <span role="columnheader">Size</span>
            <span role="columnheader">
              {waist ? "Waist, flat" : "Chest, flat"}
              <span className="block text-xs font-medium text-ink/55">{waist ? "across the waistband" : "pit to pit"}</span>
            </span>
            <span role="columnheader">
              {waist ? "Waist, around" : "Chest, around"}
              <span className="block text-xs font-medium text-ink/55">measure yourself</span>
            </span>
            <span role="columnheader">
              {waist ? "Inseam" : "Length"}
              <span className="block text-xs font-medium text-ink/55">{waist ? "crotch to hem" : "shoulder to hem"}</span>
            </span>
            {hasSleeve && (
              <span role="columnheader">
                Sleeve
                <span className="block text-xs font-medium text-ink/55">from centre back</span>
              </span>
            )}
          </div>

          {chart.rows.map((r) => (
            <div
              key={r.size}
              role="row"
              className={`grid ${cols} gap-3 border-b border-ink/10 py-[13px] text-base text-ink/80`}
            >
              <span role="cell" className="font-bold text-ink">{r.size}</span>
              <span role="cell">{inches(r.chestIn)}″</span>
              <span role="cell">{inches(r.chestIn * 2)}″</span>
              <span role="cell">{inches(r.lengthIn)}″</span>
              {hasSleeve && (
                <span role="cell">{r.sleeveIn != null ? `${inches(r.sleeveIn)}″` : "—"}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {chart.note && (
        <p className="max-w-[760px] text-[15px] leading-relaxed text-ink/75">{chart.note}</p>
      )}
    </>
  );
}

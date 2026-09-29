"use client";

import { useEffect, useState } from "react";
import { SIZE_CHARTS, inches } from "@/lib/size-charts";

// ─────────────────────────────────────────────────────────────
// The tabbed chart on /size-guide (design 3b). One config array drives
// the tabs, the panel titles and which blank's rows are shown; the
// numbers themselves come from SIZE_CHARTS and are never written here.
// GUIDE is exported so the product-page dropdown (SizeGuide.tsx) can
// deep-link a product to its tab by blank key.
//
// The active tab lives in the URL hash (#performance, #casual, ...):
// read on mount, written with replaceState on click so the back button
// is not polluted, and followed on hashchange so in-page links work.
// ─────────────────────────────────────────────────────────────

export const GUIDE = [
  { id: "performance", label: "Performance Tees", title: "Core Badge Tee · Matchday Tee", chart: "st720" },
  { id: "casual", label: "Casual Tees", title: "Terrace Tee", chart: "bc3010" },
  { id: "hoodies", label: "Hoodies", title: "Core Hoodie", chart: "ind4000" },
  {
    id: "caps",
    label: "Caps",
    title: "Caps",
    chart: null,
    blank: "Structured cotton-blend twill cap",
    note: "One adjustable size.",
  },
] as const;

export type GuideTabId = (typeof GUIDE)[number]["id"];

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
        <h2 className="font-display text-[28px] uppercase leading-tight">{tab.title}</h2>
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
              Chest, flat
              <span className="block text-xs font-medium text-ink/55">pit to pit</span>
            </span>
            <span role="columnheader">
              Chest, around
              <span className="block text-xs font-medium text-ink/55">measure yourself</span>
            </span>
            <span role="columnheader">
              Length
              <span className="block text-xs font-medium text-ink/55">shoulder to hem</span>
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

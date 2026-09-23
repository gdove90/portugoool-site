"use client";

import { useEffect, useRef, useState } from "react";
import { ResolvedCollection } from "@/lib/collections";

// Sticky category bar for the homepage.
//
// The homepage stacks every collection vertically, so reaching the caps
// meant scrolling past seven other products. This pins a pill per
// collection under the header and jumps you there instead.
//
// STICKY OFFSET. Header.tsx is `sticky top-0 z-50`, so this sits at
// top-16 and at z-40: under the header rather than fighting it. The
// header measures 65px, not 64, because h-16 plus its border-b, so the
// header's own border covers this bar's first pixel and no strip of page
// shows between them. Nothing else sticky sits above the header, so 64 is
// the whole offset. There used to be an announcement bar above it, and the
// note here mattered because that bar was NOT sticky and must not have
// been counted; it was removed on 2026-09-23. If anything sticky is ever
// added above the header, this offset and the sections' scroll-mt both
// have to grow by its height.
//
// The scroll-spy line is measured from the live header rather than
// assumed, so a change to the header's height cannot silently desync it.
// The sections' scroll-mt in page.tsx is the one number still written by
// hand; keep it at or just above header + bar.
function headerHeight() {
  return document.querySelector("header")?.offsetHeight ?? 64;
}

export default function CategoryBar({
  collections,
}: {
  collections: ResolvedCollection[];
}) {
  const [active, setActive] = useState(collections[0]?.key ?? "");
  const barRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const sections = collections
      .map((c) => document.getElementById(`c-${c.key}`))
      .filter((el): el is HTMLElement => el != null);
    if (!sections.length) return;

    // Scroll-spy. IntersectionObserver alone picks whichever section
    // happens to cross the line first, which flickers when two are in
    // view at once and misses the last section entirely when it is
    // shorter than the viewport. So: measure on scroll and pick the last
    // section whose top has passed the bar. Cheap, and it cannot flicker.
    const lineFor = () =>
      headerHeight() + (barRef.current?.offsetHeight ?? 0) + 8;

    let frame = 0;
    const measure = () => {
      frame = 0;
      // Bottom of the page: the final section wins even if its top never
      // reaches the line, otherwise the last pill can never light up.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      const line = lineFor();
      let next = sections[0].id;
      if (atBottom) {
        next = sections[sections.length - 1].id;
      } else {
        for (const el of sections) {
          if (el.getBoundingClientRect().top <= line) next = el.id;
        }
      }
      const key = next.replace(/^c-/, "");
      if (key !== activeRef.current) setActive(key);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    // requestAnimationFrame does not fire while the page is hidden, so a
    // scroll that happens as someone switches away, or any drift while
    // they are gone, leaves the pill stale until the next scroll. Re-read
    // on the way back. Cheap, and it is the only path that runs measure()
    // outside a frame.
    const onVisible = () => {
      if (document.visibilityState === "visible") measure();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [collections]);

  if (collections.length < 2) return null;

  return (
    <div
      ref={barRef}
      className="sticky top-16 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80"
    >
      {/* Horizontally scrollable on narrow screens so four pills never
          wrap into a second row and change the bar's height under a
          sticky offset that assumes one row. */}
      <nav
        aria-label="Jump to a collection"
        className="mx-auto flex max-w-content gap-2 overflow-x-auto px-4 py-3 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {collections.map((c) => {
          const on = active === c.key;
          return (
            <a
              key={c.key}
              href={`#c-${c.key}`}
              aria-current={on ? "true" : undefined}
              className={`shrink-0 rounded-full border px-4 py-2 font-display text-[13px] uppercase leading-none tracking-[0.04em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                on
                  ? "border-red bg-red text-paper"
                  : "border-ink/20 text-ink/70 hover:border-ink/50 hover:text-ink"
              }`}
            >
              {c.filterLabel}{" "}
              <span className={on ? "text-paper/60" : "text-ink/40"}>
                {c.products.length}
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}

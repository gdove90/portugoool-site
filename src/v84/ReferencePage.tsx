"use client";

import { useEffect, useMemo, useRef } from "react";
import { referenceExperience } from "./reference-experience";
import { normalizeInterfaceMarkup, interfaceIconMarkup } from "./InterfaceIcon";
import { mobileImageMarkup } from "./MobileImage";

export type ReferenceRoute = "home" | "men" | "women" | "about" | "references" | "story" | "match" | "kit";

// Approved trusted templates only. User-entered values remain escaped in the controller.
export default function ReferencePage({ route, sample }: { route: ReferenceRoute; sample?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const markup = useMemo(() => mobileImageMarkup(normalizeInterfaceMarkup(referenceExperience().markup(route))), [route]);
  useEffect(() => {
    if (!root.current) return;
    const experience = referenceExperience(root.current);
    const cleanup = experience.mount(route, sample);
    const replaceIcons = () => root.current?.querySelectorAll("a span, button span, summary span").forEach(span => {
      const symbol = span.textContent?.trim() || "";
      if (/^[↗→←↓▾]$/.test(symbol) && span.childElementCount === 0) span.innerHTML = interfaceIconMarkup(symbol);
    });
    replaceIcons();
    const observer = new MutationObserver(replaceIcons);
    observer.observe(root.current, { childList: true, subtree: true });
    return () => { observer.disconnect(); cleanup(); };
  }, [route, sample]);
  return <div ref={root} dangerouslySetInnerHTML={{ __html: markup }} />;
}

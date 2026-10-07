"use client";

import { useEffect, useMemo, useRef } from "react";
import { referenceExperience } from "./reference-experience";

export type ReferenceRoute = "home" | "men" | "women" | "about" | "references" | "story" | "match" | "kit";

// Approved trusted templates only. User-entered values remain escaped in the controller.
export default function ReferencePage({ route, sample }: { route: ReferenceRoute; sample?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const markup = useMemo(() => referenceExperience().markup(route), [route]);
  useEffect(() => {
    if (!root.current) return;
    const experience = referenceExperience(root.current);
    return experience.mount(route, sample);
  }, [route, sample]);
  return <div ref={root} dangerouslySetInnerHTML={{ __html: markup }} />;
}

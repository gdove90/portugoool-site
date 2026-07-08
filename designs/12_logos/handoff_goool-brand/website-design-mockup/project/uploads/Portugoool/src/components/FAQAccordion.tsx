"use client";

import { useState } from "react";
import { FAQ_ITEMS, type FAQItem } from "@/lib/faq";

export default function FAQAccordion({ items = FAQ_ITEMS }: { items?: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-semibold text-ink">{item.question}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`shrink-0 text-ink/50 transition-transform ${isOpen ? "rotate-45" : ""}`}
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            {isOpen && (
              <p className="pb-5 pr-8 text-sm leading-relaxed text-ink/60">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { Size } from "@/lib/types";

interface SizeSelectorProps {
  sizes: Size[];
  selected: Size | null;
  onSelect: (size: Size) => void;
}

export default function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ink">Size</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
        {sizes.map((size) => {
          const isSelected = selected === size;
          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(size)}
              className={`min-w-[52px] rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                isSelected
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/20 bg-paper text-ink hover:border-ink/50"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

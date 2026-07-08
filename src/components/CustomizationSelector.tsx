"use client";

import { CUSTOMIZATION_PRICE_CENTS } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface CustomizationSelectorProps {
  nameAvailable: boolean;
  numberAvailable: boolean;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  customName: string;
  onNameChange: (v: string) => void;
  customNumber: string;
  onNumberChange: (v: string) => void;
}

export default function CustomizationSelector({
  nameAvailable,
  numberAvailable,
  enabled,
  onToggle,
  customName,
  onNameChange,
  customNumber,
  onNumberChange,
}: CustomizationSelectorProps) {
  if (!nameAvailable && !numberAvailable) return null;

  return (
    <div className="rounded-xl border border-ink/15 p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-ink/30 accent-red"
        />
        <span>
          <span className="block text-sm font-semibold text-ink">
            Add name &amp; number · +{formatPrice(CUSTOMIZATION_PRICE_CENTS)}
          </span>
          <span className="mt-0.5 block text-xs text-ink/50">
            Printed on the back. Optional.
          </span>
        </span>
      </label>

      {enabled && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {nameAvailable && (
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="custom-name" className="mb-1 block text-xs font-medium text-ink/60">
                Name (max 12 characters)
              </label>
              <input
                id="custom-name"
                type="text"
                maxLength={12}
                value={customName}
                onChange={(e) =>
                  onNameChange(e.target.value.toUpperCase().replace(/[^A-Z ]/g, ""))
                }
                placeholder="SILVA"
                className="w-full rounded-lg border border-ink/20 px-3 py-2.5 text-sm uppercase tracking-wider focus:border-ink focus:outline-none"
              />
            </div>
          )}
          {numberAvailable && (
            <div className="col-span-2 sm:col-span-1">
              <label htmlFor="custom-number" className="mb-1 block text-xs font-medium text-ink/60">
                Number (0–99)
              </label>
              <input
                id="custom-number"
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={customNumber}
                onChange={(e) => onNumberChange(e.target.value.replace(/\D/g, ""))}
                placeholder="10"
                className="w-full rounded-lg border border-ink/20 px-3 py-2.5 text-sm focus:border-ink focus:outline-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

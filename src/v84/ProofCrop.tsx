"use client";

import type { ProductImage } from "@/lib/types";

/**
 * GA-M04 presentation proof only. The uploaded owner's original design board
 * is divided into four exact views, without inventing production photography.
 * Replace this hosted proof with permanent local product assets before release.
 */
const positions = {
  "black-front": { x: 38, y: 90 },
  "black-back": { x: 603, y: 90 },
  "royal-front": { x: 38, y: 659 },
  "royal-back": { x: 603, y: 659 },
} as const;

export function ProofCrop({ image }: { image: ProductImage }) {
  const tile = image.proofCrop && positions[image.proofCrop];
  if (!tile) return null;
  return (
    <div className="ga-proof-frame" role="img" aria-label={image.alt} style={{
      position: "absolute", inset: 0, display: "flex", alignItems: "center",
      justifyContent: "center", overflow: "hidden", background: "#dedede",
    }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "558 / 535", overflow: "hidden" }}>
        {/* Remote proof is for review, not a finished supplier or studio asset. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt="" loading="lazy" decoding="async" style={{
          position: "absolute", width: "214.875%", maxWidth: "none", height: "auto",
          left: `${-(tile.x / 558) * 100}%`,
          top: `${-(tile.y / 535) * 100}%`,
        }} />
      </div>
    </div>
  );
}

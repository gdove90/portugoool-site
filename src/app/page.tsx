import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

// ─────────────────────────────────────────────────────────────
// PRE-LAUNCH MODE: the landing page is a coming-soon takeover while
// checkout is not yet live. The full store homepage (drops, fabric,
// customization, FAQ sections) is preserved in git history — launch day:
//   git log --oneline -- src/app/page.tsx   → revert this commit
// The store itself stays reachable at /shop, /drop, etc.
// ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "GOOOL — Coming Soon. The Sound of Victory.",
  description:
    "The England Drop — ENGOOOLAND. 500 jerseys per design. No reprints. Join the list for first access.",
};

export default function HomePage() {
  return <ComingSoon />;
}

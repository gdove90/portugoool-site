import type { SVGProps } from "react";

/** V1.3 GA vector monogram: owner-approved artwork recreation.
 * Paths match the stored master artwork; colors inherit from CSS. */
export default function GAMonogram(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="40 457 356 322" role="img" aria-label="GA" focusable="false" {...props}>
    <g fill="currentColor" fillRule="evenodd">
      <path d="M 390,462 L 189,464 C 105,465 45,528 45,611 C 44,655 64,693 106,719 L 154,676 C 121,662 104,637 105,609 C 104,558 139,521 191,521 L 330,520 Z" />
      <path d="M 206,559 L 288,559 L 227,618 L 146,618 Z" />
      <path d="M 316,558 L 365,558 L 294,755 L 238,755 L 271,661 L 72,773 Z" />
    </g>
  </svg>;
}

import Image from "next/image";
import Link from "next/link";

// The Goal Collective's mark for the site header and menu while visitors are on
// the Collective page (owner, 2026-10-23); it leads to the Collective's home.
export default function CollectiveBrand() {
  return (
    <Link className="brand" href="/the-goal-collective" aria-label="The Goal Collective home">
      <Image
        src="/assets/brand/goal-collective-halo-flow.png"
        alt=""
        width={44}
        height={44}
        loading="eager"
        className="h-8 w-8 shrink-0 object-contain min-[701px]:h-10 min-[701px]:w-10"
      />
      <span className="whitespace-nowrap text-[13px] font-semibold uppercase leading-none tracking-[-0.02em] max-[360px]:text-[11px] min-[701px]:text-[16px] min-[1280px]:text-[18px]">
        The Goal Collective
      </span>
    </Link>
  );
}

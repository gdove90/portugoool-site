import BrandWordmark from "./BrandWordmark";
import GAMonogram from "./GAMonogram";

/** Website use of the approved V1.3 reconstruction; legacy strike stays separate. */
export default function WebBrandLockup({ className = "" }: { className?: string }) {
  return <span className={`goal-horizontal-lockup ${className}`} data-brand-lockup="v1.3">
    <GAMonogram className="goal-web-ga" />
    <BrandWordmark className="goal-lockup-wordmark" />
  </span>;
}

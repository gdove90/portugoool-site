import BrandWordmark from "./BrandWordmark";

/** Website proof only. The V1.2 strike geometry must never be altered. */
export default function BrandLockup({ className = "" }: { className?: string }) {
  return <span className={`goal-horizontal-lockup ${className}`} data-brand-lockup="v1.2">
    <svg data-strike-version="1.2" viewBox="0 0 890.161617719 400" aria-hidden="true" className="goal-lockup-strike">
      <polygon points="0,400 360.161617719,0 550.161617719,0 190,400" />
      <polygon points="340,400 700.161617719,0 890.161617719,0 530,400" />
    </svg>
    <span className="goal-lockup-divider" aria-hidden="true" />
    <BrandWordmark className="goal-lockup-wordmark" />
  </span>;
}

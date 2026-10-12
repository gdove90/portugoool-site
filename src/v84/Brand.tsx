import Link from "next/link";
import Image from "next/image";

export function Strike() {
  return <svg className="strike" data-strike-version="1.2" viewBox="-21.979299203 -168.153261649 934.120216125 736.306523299" aria-hidden="true"><polygon points="0,400 360.161617719,0 550.161617719,0 190,400" /><polygon className="moving" points="340,400 700.161617719,0 890.161617719,0 530,400" /></svg>;
}

export function Brand({ footer = false }: { footer?: boolean }) {
  return <Link className={`brand${footer ? " footer-brand" : ""}`} href="/" aria-label="GOAL Athletics home"><span className="brand-strike"><Strike /></span><span className="goal-lockup-divider" aria-hidden="true" /><Image src="/brand-goal/goal-athletics-wordmark-reference-white.svg" alt="GOAL Athletics" width={427} height={104} unoptimized className="goal-athletics-wordmark" /></Link>;
}

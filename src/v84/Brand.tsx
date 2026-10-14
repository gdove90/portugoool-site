import Link from "next/link";
import BrandWordmark from "@/components/BrandWordmark";
import GAMonogram from "@/components/GAMonogram";

export function Strike() {
  return <svg className="strike" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m9 5 7 7-7 7" /></svg>;
}

export function Brand({ footer = false }: { footer?: boolean }) {
  return <Link className={`brand${footer ? " footer-brand" : ""}`} href="/" aria-label="GOAL Athletics home"><span className="brand-ga"><GAMonogram /></span><BrandWordmark inline={!footer} className="brand-wordmark" /></Link>;
}

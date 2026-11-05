import { pageMetadata } from "@/lib/page-metadata";
import SizeGuideTabs from "@/components/SizeGuideTabs";

export const metadata = pageMetadata("/size-guide", "Size Guide", "Find your fit with product-specific measurements in inches and centimeters for GOAL Athletics clothing and caps.");

export default function SizeGuidePage() {
  return <>
    <section className="border-t border-paper/10 bg-ink px-5 pb-10 pt-11 text-paper sm:px-6 md:pb-[60px] md:pt-[72px] lg:px-12">
      <p className="font-display text-sm uppercase tracking-[0.2em] text-paper/60">Help</p>
      <h1 className="mt-4 font-display text-[56px] uppercase leading-[0.92] md:text-[104px]">Size Guide</h1>
      <div aria-hidden className="mt-4 h-1.5 w-24 origin-left -skew-x-[30deg] bg-red" />
      <p className="mt-4 max-w-[560px] text-lg leading-relaxed text-paper/80">Select Men or Women, then tap a garment for its measurements and fit advice. Sizes vary by style.</p>
    </section>
    <div className="px-5 pb-12 pt-8 sm:px-6 md:pb-[88px] md:pt-14 lg:px-12"><SizeGuideTabs /></div>
  </>;
}

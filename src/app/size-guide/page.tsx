import { pageMetadata } from "@/lib/page-metadata";
import SizeGuideTabs from "@/components/SizeGuideTabs";
import HelpPageHeading from "@/v84/HelpPageHeading";

export const metadata = pageMetadata("/size-guide", "Size Guide", "Find your fit with product-specific measurements in inches and centimeters for GOAL Athletics clothing and caps.");

export default function SizeGuidePage() {
  return <div className="help-page help-wrap">
    <HelpPageHeading title="Fit guide.">
      Choose a garment to see its measurements and fit notes. Sizes vary by style.
    </HelpPageHeading>
    <SizeGuideTabs />
  </div>;
}

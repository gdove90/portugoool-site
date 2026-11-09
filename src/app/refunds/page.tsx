import { pageMetadata } from "@/lib/page-metadata";
import Link from "next/link";
import HelpPageHeading from "@/v84/HelpPageHeading";

export const metadata = pageMetadata("/refunds", "Refund Policy", "All sales are final. Defective or damaged items are replaced free.");

const CONTACT_EMAIL = "support@goalathletics.shop";

const STATS = [
  { value: "14 days", label: "To report a defect or damage, from delivery" },
  { value: "30 days", label: "To report a lost order, from the ship date" },
  { value: "Free replacement", label: "Or a full refund if we can't replace the item" },
];

const SECTIONS = [
  { id: "defects", title: "Defects & damage" },
  { id: "not-covered", title: "What doesn't qualify" },
  { id: "lost", title: "Lost in transit" },
  { id: "cancellations", title: "Cancellations" },
];

const NOT_COVERED = [
  "Wrong size ordered. Check the fit notes on each product page before buying.",
  "Change of mind or style preference.",
  "Normal wear, or damage from care outside the instructions.",
];

export default function RefundsPage() {
  const steps = [
    <>Contact us within <strong>14 days of delivery</strong>.</>,
    "Include your order number and a photo of the damage or defect.",
    "The item's tag must still be attached.",
    <>Email <a className="help-link" href={"mailto:" + CONTACT_EMAIL}>{CONTACT_EMAIL}</a> or use the <Link className="help-link" href="/contact">contact page</Link>.</>,
  ];
  const policyContent = [
    <>
      <p>If your order arrives defective, damaged, misprinted, or it&apos;s the wrong item, we make it right at no cost with a free replacement or a full refund if we can&apos;t replace it.</p>
      <ol className="help-policy-list">
        {steps.map((step, index) => <li key={index}><span className="help-number" aria-hidden="true">Step {index + 1}</span><span>{step}</span></li>)}
      </ol>
    </>,
    <ul className="help-policy-list">
      {NOT_COVERED.map(item => <li key={item}><span className="help-number" aria-hidden="true">–</span><span>{item}</span></li>)}
    </ul>,
    <p>If tracking shows your order never arrived, contact us within 30 days of the ship date and we&apos;ll replace it free.</p>,
    <p>Orders are processed fast. If you need to cancel, email us immediately, since we can only cancel before your order is processed.</p>,
  ];

  return <div className="help-page help-wrap">
    <HelpPageHeading title="Refund policy.">
      <strong>All sales are final.</strong> We don&apos;t accept returns or exchanges, but if anything arrives wrong, we make it right below.
    </HelpPageHeading>

    <dl className="help-refund-summary" aria-label="Refund policy at a glance">
      {STATS.map(stat => <div key={stat.value}><dt>{stat.value}</dt><dd>{stat.label}</dd></div>)}
    </dl>

    <div className="help-refund-layout">
      <aside>
        <nav className="help-policy-index" aria-label="On this page">
          <p className="help-eyebrow">On this page</p>
          <ol>
            {SECTIONS.map((section, index) => <li key={section.id}>
              <a href={"#" + section.id}><span className="help-number" aria-hidden="true">0{index + 1}</span> {section.title}</a>
            </li>)}
          </ol>
        </nav>
        <div className="help-refund-support">
          <p className="help-eyebrow">Something arrived wrong?</p>
          <p className="help-copy"><a className="help-link" href={"mailto:" + CONTACT_EMAIL}>{CONTACT_EMAIL}</a></p>
          <Link className="help-action" href="/contact">Contact support</Link>
        </div>
      </aside>

      <article className="help-policy">
        {SECTIONS.map((section, index) => <section key={section.id} aria-labelledby={section.id}>
          <div className="help-policy-heading">
            <span className="help-number" aria-hidden="true">0{index + 1}</span>
            <h2 className="help-section-title" id={section.id}>{section.title}</h2>
          </div>
          {policyContent[index]}
        </section>)}
        <p className="help-policy-date">This policy is linked from the cart before you pay, and from the footer of every page. It applies to all orders. Last updated September 2026.</p>
      </article>
    </div>
  </div>;
}

// FAQ content — plain data module so both server components (home page
// preview) and the client accordion can import it.

import { DELIVERY_OVERVIEW, IMPORT_DUTY_COPY } from "./delivery";

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "When will my order ship?",
    answer:
      DELIVERY_OVERVIEW,
  },
  {
    question: "Do I pay customs or import tax?",
    answer:
      IMPORT_DUTY_COPY,
  },
  {
    question: "How does sizing run?",
    answer:
      "Performance tees are an athletic fit and run true to size, so size up if you want a relaxed feel. The heavyweight and garment-dyed tees are a relaxed fit with a semi-dropped shoulder. Every product page lists the fit.",
  },
  {
    question: "Can I return or exchange?",
    answer:
      "All sales are final. If your order arrives damaged, defective, or wrong, we'll replace it free. Contact support within 14 days of delivery with your order number and a photo of the damage or defect, and make sure the tag is still attached. Double-check the fit notes and your size before ordering.",
  },
  {
    question: "How do drops work?",
    answer:
      "We release designs in drops: collections that land together. Designs can retire when the next drop lands.",
  },
  {
    question: "Is this official team merchandise?",
    answer:
      "No. GOAL Athletics is a brand. We are not affiliated with any federation, club, league, or governing body. Original designs and marks only: nothing official, nothing licensed, just love for the game.",
  },
];

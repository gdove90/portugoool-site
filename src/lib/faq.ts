// FAQ content — plain data module so both server components (home page
// preview) and the client accordion can import it.

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "When will my order ship?",
    answer:
      "Orders arrive within 7–12 business days in the US. Canada, Portugal and the UK take longer. You'll get tracking by email the moment yours ships.",
  },
  {
    question: "How does sizing run?",
    answer:
      "Performance tees are an athletic fit and run true to size, so size up if you want a relaxed feel. The heavyweight and garment-dyed tees are a relaxed fit with a semi-dropped shoulder. Every product page lists the fit.",
  },
  {
    question: "Can I return or exchange?",
    answer:
      "All sales are final. If your order arrives defective, damaged, or wrong, we replace it free: contact us within 14 days of delivery with photos. Double-check the fit notes and your size before ordering.",
  },
  {
    question: "How do drops work?",
    answer:
      "We release designs in drops: collections that land together. Designs can retire when the next drop lands.",
  },
  {
    question: "Is this official team merchandise?",
    answer:
      "No. GOOOL is an independent brand. We are not affiliated with any federation, club, league, or governing body. Original designs and marks only: nothing official, nothing licensed, just love for the game.",
  },
];

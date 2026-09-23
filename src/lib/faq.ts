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
      "Orders arrive within 7–12 business days in the US. Canada, the UK and Portugal typically take 3 to 5 weeks, because every order is made and shipped from the United States and customs can add time. Track yours anytime on the Track Order page with your order reference.",
  },
  {
    question: "Do I pay customs or import tax?",
    answer:
      "Not in the US. Orders to Canada, the UK and Portugal ship from the United States, so your country may charge import duty or VAT when the parcel arrives. That charge is set by your customs authority, is not collected by us, and is paid by the person receiving the order.",
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

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
      "Every shirt is made to order. Production takes 5–7 business days, then shipping takes 3–7 business days in the US. You'll get tracking by email the moment it ships.",
  },
  {
    question: "How does sizing run?",
    answer:
      "Jersey-style shirts are an athletic fit and run true to size — size up if you want a relaxed feel. Casual shirts are a relaxed streetwear fit. Every product page lists the fit.",
  },
  {
    question: "Can I return or exchange?",
    answer:
      "Unworn, unwashed shirts without customization can be returned within 30 days. Customized shirts (name/number) are made just for you and are final sale unless defective — defects are always replaced free.",
  },
  {
    question: "How does customization work?",
    answer:
      "Base shirts come clean, with no numbers. At checkout you can add a name and number to the back as an optional paid add-on. Pick any name up to 12 characters and any number 0–99.",
  },
  {
    question: "What does 'limited drop' mean?",
    answer:
      "We release designs in small batches. Once a drop sells out, it's gone — the next design launches in its place. No restocks, no reprints.",
  },
  {
    question: "Is this official Portugal team merchandise?",
    answer:
      "No. PORTUGOOOL is an independent fan apparel brand. We use our own original designs and marks — nothing official, nothing licensed, just love for the game.",
  },
];

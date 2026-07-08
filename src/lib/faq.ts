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
      "All sales are final — every piece is made to order, just for you. If your order arrives defective, damaged, or wrong, we replace it free: contact us within 14 days of delivery with photos. Double-check the fit notes and your customization spelling before ordering.",
  },
  {
    question: "How does customization work?",
    answer:
      "Jerseys come clean — no names, no numbers. On any jersey page you can add a name (up to 12 characters) and number (0–99) to the back for a flat $15. Casual shirts and accessories ship as designed.",
  },
  {
    question: "What does 'limited drop' mean?",
    answer:
      "Each jersey drop is limited to 500 units. The product page shows how many are left. Once this drop sells out, it will not be reprinted — the next version launches in its place.",
  },
  {
    question: "Is this official Portugal team merchandise?",
    answer:
      "No. GOOOL is an independent fan apparel brand — the Portugal Collection celebrates the fans, not the federation. Original designs and marks only: nothing official, nothing licensed, just love for the game.",
  },
];

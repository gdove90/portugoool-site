// Welcome sequence, Email 2: sign-up + 120 hours, marketing.
// Original product and blank gates remain in the welcome pass. Current copy
// uses approved brand language; legacy garment imagery is not republished.

import { buttonHtml, emailShell, escapeHtml, footerText, paragraphHtml } from "./footer";

export interface Welcome2Input {
  code: string;
  productUrl: string;
  imageUrl: string;
  imageAlt: string;
  unsubscribeUrl: string;
}

export function buildWelcome2(input: Welcome2Input): { subject: string; html: string; text: string } {
  const subject = "Built for the work.";
  const description = "Performance apparel built for the game. Every piece engineered for athletes who train hard and wear with intention.";
  const purpose = "Built for the work nobody sees.";
  const text = [
    "GOAL Athletics performance apparel.",
    description,
    purpose,
    `Your code ${input.code} is good for 9 more days.`,
    "",
    `See the tee: ${input.productUrl}`,
    "",
    ...footerText(input.unsubscribeUrl),
  ].join("\n");
  const bodyHtml = [
    paragraphHtml("GOAL Athletics performance apparel.", { strong: true }),
    paragraphHtml(escapeHtml(description)),
    paragraphHtml(escapeHtml(purpose)),
    paragraphHtml(`Your code <strong style="color:#FFFFFF;">${escapeHtml(input.code)}</strong> is good for 9 more days.`),
    buttonHtml("See the tee", input.productUrl),
  ].join("\n");
  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: "GOAL Athletics performance apparel.",
      bodyHtml,
      unsubscribeUrl: input.unsubscribeUrl,
    }),
  };
}

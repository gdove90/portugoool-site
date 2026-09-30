// Welcome sequence, Email 2: sign-up + 120 hours, marketing. Sent by the
// welcome pass only while the performance tee is live in the catalog;
// the button and the one product image come from that product. Copy is
// final (owner brief 2026-09-29).

import { buttonHtml, emailShell, escapeHtml, footerText, paragraphHtml } from "./footer";

export interface Welcome2Input {
  code: string;
  productUrl: string;
  imageUrl: string;
  imageAlt: string;
  unsubscribeUrl: string;
}

export function buildWelcome2(input: Welcome2Input): { subject: string; html: string; text: string } {
  const subject = "Why the shirt weighs nothing";
  const fabric =
    "It's a tri-blend: 50% poly, 25% ring-spun cotton, 25% rayon. The poly wicks and holds shape, the cotton keeps it from smelling like a gym bag, the rayon is why it drapes instead of hanging. 3.8 ounces. It gets softer every wash.";
  const colors = "Three colors: Charcoal, Grey, Navy. GA on the chest, GOOOL ATHLETICS on the back.";
  const text = [
    "Quick one about the performance tee.",
    fabric,
    colors,
    `Your code ${input.code} is good for 9 more days.`,
    "",
    `See the tee: ${input.productUrl}`,
    "",
    ...footerText(input.unsubscribeUrl),
  ].join("\n");
  const bodyHtml = [
    paragraphHtml("Quick one about the performance tee.", { strong: true }),
    `<a href="${input.productUrl}" target="_blank" style="text-decoration:none;"><img src="${input.imageUrl}" width="464" alt="${escapeHtml(input.imageAlt)}" border="0" style="display:block;width:100%;max-width:464px;height:auto;border:0;margin:0 0 22px;"></a>`,
    paragraphHtml(escapeHtml(fabric)),
    paragraphHtml(colors),
    paragraphHtml(`Your code <strong style="color:#FFFFFF;">${escapeHtml(input.code)}</strong> is good for 9 more days.`),
    buttonHtml("See the tee", input.productUrl),
  ].join("\n");
  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: "Quick one about the performance tee.",
      bodyHtml,
      unsubscribeUrl: input.unsubscribeUrl,
    }),
  };
}

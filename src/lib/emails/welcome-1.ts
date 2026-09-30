// Welcome sequence, Email 1: sent from /api/discount right after the
// GOOOL20 code is issued. Transactional (the code the customer asked
// for), so it carries no List-Unsubscribe headers; the footer still
// shows the address and the unsubscribe link. Copy is final (owner brief
// 2026-09-29). The cart has no code query parameter, so the button goes
// to the shop.

import { buttonHtml, codeBlockHtml, emailShell, escapeHtml, footerText, paragraphHtml, SITE_URL } from "./footer";

export interface Welcome1Input {
  code: string;
  unsubscribeUrl: string;
}

export function buildWelcome1(input: Welcome1Input): { subject: string; html: string; text: string } {
  const subject = "Your 20% is live";
  const shopUrl = `${SITE_URL}/shop`;
  const text = [
    `You're in. Here's your code: ${input.code}`,
    "20% off your first order, good for 14 days. One use, first order only.",
    "Tees $38. Hats $32. Hoodie $78. Free shipping at $70.",
    "",
    `Shop the drop: ${shopUrl}`,
    "",
    ...footerText(input.unsubscribeUrl),
  ].join("\n");
  const bodyHtml = [
    paragraphHtml("You're in. Here's your code:", { strong: true }),
    codeBlockHtml(input.code),
    paragraphHtml("20% off your first order, good for 14 days. One use, first order only."),
    paragraphHtml("Tees $38. Hats $32. Hoodie $78. Free shipping at $70."),
    buttonHtml("Shop the drop", shopUrl),
  ].join("\n");
  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: `Your code ${escapeHtml(input.code)}: 20% off your first order, good for 14 days.`,
      bodyHtml,
      unsubscribeUrl: input.unsubscribeUrl,
    }),
  };
}

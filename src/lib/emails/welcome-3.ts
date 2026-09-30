// Welcome sequence, Email 3: sign-up + 288 hours, marketing. Two days
// before the 14-day code lapses. Copy is final (owner brief 2026-09-29).
// The cart has no code query parameter, so the button goes to the shop.

import { buttonHtml, codeBlockHtml, emailShell, escapeHtml, footerText, paragraphHtml, SITE_URL } from "./footer";

export interface Welcome3Input {
  code: string;
  unsubscribeUrl: string;
}

export function buildWelcome3(input: Welcome3Input): { subject: string; html: string; text: string } {
  const subject = "48 hours";
  const shopUrl = `${SITE_URL}/shop`;
  const text = [
    "Your first-order code expires in two days.",
    `${input.code}, 20% off, gone after that.`,
    "",
    `Use it: ${shopUrl}`,
    "",
    ...footerText(input.unsubscribeUrl),
  ].join("\n");
  const bodyHtml = [
    paragraphHtml("Your first-order code expires in two days.", { strong: true }),
    codeBlockHtml(input.code),
    paragraphHtml("20% off, gone after that."),
    buttonHtml("Use it", shopUrl),
  ].join("\n");
  return {
    subject,
    text,
    html: emailShell({
      title: subject,
      preheader: `${escapeHtml(input.code)} expires in two days.`,
      bodyHtml,
      unsubscribeUrl: input.unsubscribeUrl,
    }),
  };
}

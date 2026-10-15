// Signup confirmations include a promotional offer, so they carry marketing
// unsubscribe headers as well as the visible Support and unsubscribe links.
import { listUnsubscribeHeaders } from "../email-subscription";
import { buttonHtml, codeBlockHtml, emailShell, footerText, paragraphHtml, SITE_URL } from "./footer";

export interface Welcome1Input {
  code: string | null;
  unsubscribeUrl: string;
}

export function buildWelcome1(input: Welcome1Input): { subject: string; html: string; text: string; headers: Record<string, string> } {
  const subject = input.code ? "Welcome to GOAL — your 20% is here" : "Welcome back to GOAL";
  const shopUrl = `${SITE_URL}/shop`;
  const greeting = "You're in. Welcome to GOAL Athletics!";
  const thanks = "Thanks for joining our community. We're glad you're here. You'll be first to hear about new collections, fresh ideas, and offers made for the list.";
  const offer = input.code
    ? "Enjoy 20% off your first order. Your code is valid for 14 days from when it was first issued. One use, first order only."
    : "Your first-order discount has already been used, but there's plenty more to look forward to. Stay tuned for new releases and future offers.";
  const text = [greeting, "", thanks, "", ...(input.code ? [`Your code: ${input.code}`] : []), offer,
    "", `Explore GOAL: ${shopUrl}`, "", ...footerText(input.unsubscribeUrl)].join("\n");
  const bodyHtml = [
    paragraphHtml(greeting, { strong: true }),
    paragraphHtml(thanks),
    ...(input.code ? [codeBlockHtml(input.code)] : []),
    paragraphHtml(offer),
    buttonHtml("Explore GOAL", shopUrl),
  ].join("\n");
  return { subject, text, headers: listUnsubscribeHeaders(input.unsubscribeUrl),
    html: emailShell({ title: subject, preheader: input.code
      ? `Thanks for joining us. Your first-order code: ${input.code}.`
      : "Thanks for joining us. We're glad you're part of the GOAL community.",
      bodyHtml, unsubscribeUrl: input.unsubscribeUrl }),
  };
}

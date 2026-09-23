"use client";

import { useState } from "react";
import Link from "next/link";

// Simple mailto-based contact for launch — no backend needed.
// TODO: swap for a Resend-powered /api/contact route when email is wired up.
const CONTACT_EMAIL = "hello@goool.shop"; // matches the primary domain

export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Message from ${name || "a fan"}`
  )}&body=${encodeURIComponent(message)}`;

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-4xl uppercase tracking-tightest text-ink sm:text-5xl">
        Contact
      </h1>
      <p className="mt-2 text-ink/60">
        Questions about an order, sizing, or a drop? Send it over and we reply
        within one business day.
      </p>

      <div className="mt-10 space-y-4">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-ink">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-ink/20 px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-ink">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
            className="w-full rounded-lg border border-ink/20 px-4 py-3 text-sm focus:border-ink focus:outline-none"
          />
        </div>

        {/* Labelled for what it actually does. This is a mailto: handoff,
            not a server-side send, and a button reading "Send message"
            told people their message was on its way when the click had in
            fact done nothing at all - which is exactly what happens on a
            phone with no mail app configured, or for anyone living in
            webmail. The copy button below is the escape hatch for them:
            whatever the browser does with mailto:, the customer always
            leaves this page holding the address and their own text. */}
        <a
          href={mailtoHref}
          className="block w-full rounded-full bg-red px-8 py-4 text-center text-base font-semibold text-paper transition-colors hover:bg-red-dark"
        >
          Open in your email app
        </a>

        <div className="text-center text-xs text-ink/50">
          <p>
            No mail app? Copy your message, then write to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-ink underline underline-offset-2"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  `To: ${CONTACT_EMAIL}\n\nFrom: ${name || "a fan"}\n\n${message}`
                );
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              } catch {
                // Clipboard is blocked outside a secure context and in
                // some embedded browsers. The address is already on
                // screen above, so there is nothing to recover from.
                setCopied(false);
              }
            }}
            className="mt-2 rounded-full border border-ink/20 px-4 py-2 font-medium text-ink/70 transition-colors hover:border-ink hover:text-ink"
          >
            {copied ? "Copied" : "Copy message and address"}
          </button>
          <span aria-live="polite" className="sr-only">
            {copied ? "Message and address copied to the clipboard" : ""}
          </span>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/faq" className="text-sm font-semibold text-ink underline-offset-4 hover:underline">
          Check the FAQ first →
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

// Simple mailto-based contact for launch — no backend needed.
// TODO: swap for a Resend-powered /api/contact route when email is wired up.
const CONTACT_EMAIL = "hello@goool.shop"; // matches the primary domain

export default function ContactPage() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Message from ${name || "a fan"}`
  )}&body=${encodeURIComponent(message)}`;

  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tightest text-ink sm:text-5xl">
        Contact
      </h1>
      <p className="mt-2 text-ink/60">
        Questions about an order, sizing, or a drop? Send it over — we reply
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

        <a
          href={mailtoHref}
          className="block w-full rounded-full bg-red px-8 py-4 text-center text-base font-semibold text-paper transition-colors hover:bg-red-dark"
        >
          Send message
        </a>

        <p className="text-center text-xs text-ink/50">
          Or email us directly:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-ink underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>

      <div className="mt-12 text-center">
        <Link href="/faq" className="text-sm font-semibold text-ink underline-offset-4 hover:underline">
          Check the FAQ first →
        </Link>
      </div>
    </div>
  );
}

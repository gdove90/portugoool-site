import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Gate from "@/components/Gate";
import { storeClosed } from "@/lib/store-status";

// The gate's own route. Middleware sends every un-cookied request here with
// the path they wanted in ?next=, so unlocking returns them where they were
// aiming rather than dumping everyone on the homepage.
//
// noindex/nofollow: while the store is closed for renovation, the only page
// a crawler can reach is this one, and a holding page is not what should be
// sitting in results under goool.shop when the store reopens.
export const metadata: Metadata = {
  title: "Closed for renovation",
  description: "GOAL Athletics is redesigning every piece. The store reopens soon.",
  robots: { index: false, follow: false },
};

function safeNext(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  // Only same-origin absolute paths. A value starting "//" or "/\" is
  // protocol-relative and would send someone off-site, which is how a
  // redirect parameter turns into an open redirect.
  if (!value || !value.startsWith("/")) return "/";
  if (value.startsWith("//") || value.startsWith("/\\")) return "/";
  if (value.startsWith("/gate")) return "/";
  return value;
}

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  // Once the store is open, links and bookmarks made while it was closed
  // (/gate?next=...) go straight to the page they were aiming for.
  if (!storeClosed()) redirect(safeNext(next));
  return <Gate next={safeNext(next)} />;
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...pageMetadata("/cart", "Your Bag", "Review your GOOOL Athletics bag before checkout."),
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function CartLayout({ children }: { children: ReactNode }) { return <>{children}</>; }

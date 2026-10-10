import type { Metadata } from "next";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = {
  ...pageMetadata("/success", "Order Confirmation", "Your GOOOL Athletics checkout confirmation."),
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function ConfirmationLayout({ children }: { children: ReactNode }) { return <>{children}</>; }

import { notFound, redirect } from "next/navigation";
import { verifiedOwner } from "@/lib/intake/auth";
import ReferencePage from "@/v84/ReferencePage";
export const dynamic = "force-dynamic";
export const metadata = { title: "Sample Submission", robots: { index: false, follow: false } };
export default async function Sample({ params }: { params: Promise<{ category: string }> }) {
 // Owner-only, like /share-your-goals itself (2026-10-22).
 const owner = await verifiedOwner().catch(() => null);
 if (!owner) redirect("/admin/sign-in");
 const { category } = await params;
 const samples: Record<string,string> = { goal: "Goals", highlight: "Highlights", save: "Saves" };
 if (!samples[category]) notFound();
 return <ReferencePage route="match" sample={samples[category]} />;
}

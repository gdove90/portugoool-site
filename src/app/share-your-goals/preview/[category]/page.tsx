import { notFound } from "next/navigation";
import ReferencePage from "@/v84/ReferencePage";
export const metadata = { title: "Sample Submission", robots: { index: false, follow: false } };
export default async function Sample({ params }: { params: Promise<{ category: string }> }) {
 const { category } = await params;
 const samples: Record<string,string> = { goal: "Goals", highlight: "Highlights", save: "Saves" };
 if (!samples[category]) notFound();
 return <ReferencePage route="match" sample={samples[category]} />;
}

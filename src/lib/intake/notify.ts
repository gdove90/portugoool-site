import "server-only";
import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/seo";

// Same internal address as the fulfillment alerts (src/lib/emails/fulfillment-alert.ts),
// repeated here so the intake bundle does not pull in the order store.
const OWNER_ALERT_TO = "gdove90@goalathletics.shop";

// Owner heads-up when a community submission is received (brief 2026-10-28).
// Private by design: the first name and goal only, never the submitter's
// email, handle or files. Review happens in /admin; nothing is published.
type Received = { id: string; kind: string; category: string; name: string; payload: Record<string, unknown> };
const escape = (s: string) => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

export async function notifyOwnerOfSubmission(row: Received, fileCount: number): Promise<void> {
  const story = row.kind === "story";
  const label = story ? "What's Your GOAL? story" : `${row.category} submission`;
  const goal = story ? String(row.payload.goal ?? "").slice(0, 100) : "";
  const link = `${SITE_URL}/admin#${row.id}`;
  const lines = [
    `New ${label} from ${row.name}.`,
    ...(goal ? [`Goal: ${goal}`] : []),
    `Files: ${fileCount}.`,
    `Review it in the private admin: ${link}`,
    "Nothing is published automatically. Approving a submission only marks it eligible for use.",
  ];
  const html = `<p>${lines.map(escape).join("</p><p>")}</p>`.replace(escape(link), `<a href="${escape(link)}">${escape(link)}</a>`);
  await sendEmail({ to: OWNER_ALERT_TO, subject: `New ${label}: ${row.name}`, html, text: lines.join("\n") }, `intake-received-${row.id}`);
}

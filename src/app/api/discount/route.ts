import { NextRequest, NextResponse } from "next/server";
import { clientIpFrom, sendMetaServerEvent } from "@/lib/meta-capi";
import { leadStableId, metaEventId } from "@/lib/meta-events";
import { EMAIL_RE } from "@/lib/signups";
import { signupWithWelcome } from "@/lib/signup-welcome";

// All signup forms share welcome delivery; popup advertising consent stays separate.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let email: string;
  let consent: string | null = null;
  try {
    const body = await req.json();
    consent = req.headers?.get?.("sec-gpc") === "1" || body.consent !== "granted" ? "denied" : "granted";
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const result = await signupWithWelcome(email, "popup");
  if (result.status !== 200) return NextResponse.json(result.body, { status: result.status });
  const { code } = result.body;
  if (code) {
    // Server-side Lead, same event_id the popup fires in the browser, so
    // Meta keeps one. Never blocks the sign-up.
    try {
    await sendMetaServerEvent({
      name: "Lead",
      eventId: await metaEventId("Lead", leadStableId(email, code)),
      email,
      clientIp: clientIpFrom({ get: (n) => req.headers?.get?.(n) ?? null }),
      userAgent: req.headers?.get?.("user-agent") ?? null,
      fbp: req.cookies?.get?.("_fbp")?.value ?? null,
      fbc: req.cookies?.get?.("_fbc")?.value ?? null,
      sourceUrl: "https://goool.shop/",
      consent,
      livemode: result.live,
      customData: { content_name: "GOOOL20 sign-up" },
    });
    } catch { console.error("[meta] Lead tracking failed; signup remains successful"); }
  }
  return NextResponse.json(result.body);
}

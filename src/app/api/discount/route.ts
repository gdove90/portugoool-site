import { NextRequest, NextResponse } from "next/server";
import { EMAIL_RE, subscribeToAudience } from "@/lib/mailchimp";
import { issueDiscountCode } from "@/lib/discount";
import { emailEnabled } from "@/lib/email";
import { queueEmail } from "@/lib/email-delivery";

// GOOOL20 popup: subscribe the address (tag "goool20"), then hand back
// that person's single-use code. The signup is saved before the code is
// issued, so a Stripe or ledger hiccup never loses the subscriber; the
// visitor is told plainly that the code is delayed rather than shown a
// code that does not exist.

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let email: string;
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  if (!emailEnabled()) return NextResponse.json(
    { error: "Code delivery is temporarily unavailable. Please try again shortly." }, { status: 503 });
  const sub = await subscribeToAudience(email, ["waitlist", "goool20"]);
  if (!sub.ok) return NextResponse.json({ error: sub.error }, { status: sub.status });

  try {
    const issued = await issueDiscountCode(email);
    if (issued.status === "unavailable") {
      console.error("[discount] code unavailable:", issued.reason);
      return NextResponse.json({ error: "Your signup is saved, but the code could not be created. Please try again." }, { status: 503 });
    }
    if (issued.status === "redeemed") {
      return NextResponse.json({ ok: true, subscribed: true, code: null, redeemed: true });
    }
    const live = /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "");
    await queueEmail(`discount/${live ? "live" : "test"}/${issued.code}`, "discount", {
      to: email, subject: "Your GOOOL first-order code",
      text: `Your 20% first-order code is ${issued.code}. Use it at https://goool.shop. One use; valid for 30 days from issue. Questions? Reply to hello@goool.shop.`,
      html: `<h1>Your GOOOL code</h1><p>Your 20% first-order code: <strong>${issued.code}</strong></p><p><a href="https://goool.shop">Shop GOOOL</a></p><p>One use; valid for 30 days from issue. Questions? Reply to hello@goool.shop.</p>`,
    }, live);
    return NextResponse.json({ ok: true, subscribed: true, code: issued.code });
  } catch {
    console.error("[discount] issue or durable delivery unavailable");
    return NextResponse.json({ error: "Your signup is saved. Please try again to finish getting your code." }, { status: 503 });
  }
}

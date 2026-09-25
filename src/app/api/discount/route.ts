import { NextRequest, NextResponse } from "next/server";
import { EMAIL_RE, subscribeToAudience } from "@/lib/mailchimp";
import { issueDiscountCode } from "@/lib/discount";

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

  const sub = await subscribeToAudience(email, ["waitlist", "goool20"]);
  if (!sub.ok) return NextResponse.json({ error: sub.error }, { status: sub.status });

  const issued = await issueDiscountCode(email);
  if (issued.status === "unavailable") {
    console.error("[discount] code unavailable:", issued.reason);
    return NextResponse.json(
      {
        ok: true,
        subscribed: true,
        code: null,
        message:
          "You're on the list. Your code is on its way by email; it can take a few minutes.",
      },
      { status: 200 }
    );
  }
  if (issued.status === "redeemed") {
    return NextResponse.json({ ok: true, subscribed: true, code: null, redeemed: true });
  }
  return NextResponse.json({ ok: true, subscribed: true, code: issued.code });
}

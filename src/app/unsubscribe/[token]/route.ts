import { NextRequest, NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/signups";

// One-click unsubscribe (owner decision 2026-09-29). The link in every
// welcome email and the List-Unsubscribe header both point here. GET is
// the footer link, POST is the RFC 8058 one-click call mail clients make;
// both set unsubscribed_at once, drop the address from the Resend
// Audience, and answer with a plain page. The URL carries only the row's
// random token, never the address.

export const dynamic = "force-dynamic";

const TOKEN_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function page(title: string, body: string, status: number) {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head>
<body style="margin:0;padding:48px 20px;background:#090909;color:#fff;font:16px/1.6 Helvetica,Arial,sans-serif;">
<div style="max-width:520px;margin:0 auto;">
<img src="https://goool.shop/brand/goool-athletics-lockup-white.png" width="160" alt="GOOOL Athletics" style="display:block;width:160px;height:auto;margin-bottom:28px;">
<h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;">${title}</h1>
<p style="margin:0 0 24px;color:#d6d6d6;">${body}</p>
<p style="margin:0;color:#d6d6d6;">GOOOL Athletics LLC · <a href="https://goool.shop" style="color:#fff;">goool.shop</a> · <a href="mailto:hello@goool.shop" style="color:#fff;">hello@goool.shop</a></p>
</div></body></html>`;
  return new NextResponse(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

async function handle(token: string) {
  if (!TOKEN_RE.test(token)) return page("That link is not valid.", "Write to hello@goool.shop and we will take you off the list by hand.", 404);
  let result;
  try {
    result = await unsubscribeByToken(token);
  } catch {
    return page("Please try again in a moment.", "We could not save that just now. Write to hello@goool.shop if it keeps happening.", 503);
  }
  if (!result) return page("That link is not valid.", "Write to hello@goool.shop and we will take you off the list by hand.", 404);
  return page(
    result.already ? "You were already unsubscribed." : "You're unsubscribed.",
    "No more marketing email from GOOOL Athletics. Order and shipping emails still arrive if you buy something.",
    200,
  );
}

// Next 15 route handlers receive params as a promise.
type Ctx = { params: Promise<{ token: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  return handle((await params).token);
}

export async function POST(_req: NextRequest, { params }: Ctx) {
  return handle((await params).token);
}

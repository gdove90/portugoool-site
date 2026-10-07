import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/intake/auth";
import { authClient, bodyJSON, errorResponse, fail, ownerIds, rateLimit, sameOrigin } from "@/lib/intake/server";

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const data = await bodyJSON(request, 4096), store = await cookies(), client = authClient();
    if (data.action === "signout") {
      const access = store.get(ACCESS_COOKIE)?.value, refresh = store.get(REFRESH_COOKIE)?.value;
      if (access && refresh) { await client.auth.setSession({ access_token: access, refresh_token: refresh }); await client.auth.signOut({ scope: "local" }); }
      const result = NextResponse.json({ signedOut: true }); result.cookies.delete(ACCESS_COOKIE); result.cookies.delete(REFRESH_COOKIE); return result;
    }
    if (data.action !== "refresh") await rateLimit(request,"owner-login");
    const result = data.action === "refresh"
      ? await client.auth.refreshSession({ refresh_token: store.get(REFRESH_COOKIE)?.value || "" })
      : await client.auth.signInWithPassword({ email: String(data.email || "").slice(0,254), password: String(data.password || "").slice(0,1024) });
    if (result.error || !result.data.user || !result.data.session || !ownerIds().includes(result.data.user.id)) {
      if (result.data.session) await client.auth.signOut({ scope: "local" });
      return fail(403,"Could not sign in to the owner workspace.");
    }
    const response = NextResponse.json({ signedIn: true }, { headers: {"Cache-Control":"no-store"} });
    const options = { httpOnly: true, secure: new URL(request.url).protocol === "https:", sameSite: "strict" as const, path: "/" };
    response.cookies.set(ACCESS_COOKIE,result.data.session.access_token,{...options,maxAge:result.data.session.expires_in});
    response.cookies.set(REFRESH_COOKIE,result.data.session.refresh_token,{...options,maxAge:30*86400});
    return response;
  } catch(error) { return errorResponse(error); }
}

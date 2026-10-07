import { adminRequest, cleanupExpired } from "@/lib/intake/admin";
import { errorResponse } from "@/lib/intake/server";
export const runtime = "nodejs";
async function handler(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try { const {path}=await params; const result=await adminRequest(request,path); if(path.length===1 && path[0]==="submissions") await cleanupExpired().catch(()=>{}); return result; }
  catch(error) { return errorResponse(error); }
}
export { handler as GET, handler as PATCH, handler as DELETE };

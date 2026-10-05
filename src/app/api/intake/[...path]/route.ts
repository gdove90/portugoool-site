import { errorResponse, fail, finishIntake, hash, refreshUpload, response, startIntake } from "@/lib/intake/server";
import { cleanupExpired } from "@/lib/intake/admin";
import { timingSafeEqual } from "node:crypto";
export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    if (path.length === 1 && path[0] === "maintenance") {
      const secret = process.env.INTAKE_MAINTENANCE_SECRET;
      if (!secret || secret.length < 32) return fail(503, "Maintenance is not configured.");
      const supplied = request.headers.get("authorization") || "";
      if (!timingSafeEqual(Buffer.from(hash(supplied)), Buffer.from(hash(`Bearer ${secret}`)))) return fail(403, "Not authorized.");
      await cleanupExpired();
      return response({ completed: true });
    }
    if (path.length === 1 && path[0] === "start") return await startIntake(request);
    if (path.length === 2 && /^[0-9a-f-]{36}$/i.test(path[0]) && path[1] === "finish") return await finishIntake(request,path[0]);
    if (path.length === 2 && /^[0-9a-f-]{36}$/i.test(path[0]) && path[1] === "refresh") return await refreshUpload(request,path[0]);
    return fail(404,"Not found.");
  } catch(error) { return errorResponse(error); }
}

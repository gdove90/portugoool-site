import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { SaxesParser } from "saxes";
import { cleanPayload, filesMeta, checkMagic } from "./validation.mjs";
import agreements from "./agreements.json";

export class IntakeError extends Error { constructor(public status: number, message: string) { super(message); } }
export const fail = (status: number, message: string): never => { throw new IntakeError(status, message); };
export const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export function intakeClient() {
  const url = process.env.INTAKE_SUPABASE_URL, key = process.env.INTAKE_SERVICE_ROLE_KEY;
  if (!url || !key) return fail(503, "Private submissions are not configured yet. Please try again later.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export function authClient() {
  const url = process.env.INTAKE_SUPABASE_URL, key = process.env.INTAKE_ANON_KEY;
  if (!url || !key) return fail(503, "Owner sign-in is not configured yet.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
export function ownerIds() { return (process.env.INTAKE_OWNER_IDS || "").split(",").map(s => s.trim()).filter(Boolean); }
export function sameOrigin(request: Request) {
  const url = new URL(request.url);
  // Next's local adapter may normalize request.url to localhost. Host retains the browser-facing origin.
  const expected = `${url.protocol}//${request.headers.get("host") || url.host}`;
  const configured = (process.env.INTAKE_SITE_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  const origin = request.headers.get("origin");
  if (!origin || !(configured.length ? configured.includes(origin) : origin === expected)) fail(403, "Please use the form on this website.");
}
export async function bodyJSON(request: Request, max = 50000) {
  if (!request.body) return fail(400, "Missing request.");
  const reader = request.body.getReader(), parts: Uint8Array[] = []; let length = 0;
  try { while (true) { const chunk = await reader.read(); if (chunk.done) break; length += chunk.value.length; if (length > max) { await reader.cancel(); return fail(413, "Request is too large."); } parts.push(chunk.value); } }
  finally { reader.releaseLock(); }
  try {
    const data = JSON.parse(Buffer.concat(parts).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) return fail(400, "Invalid request.");
    return data;
  } catch { return fail(400, "Invalid request."); }
}
export function checked<T>(result: { data: T; error: unknown }): T {
  if (result.error) return fail(503, "The private service is unavailable. Please retry.");
  return result.data;
}
export async function rateLimit(request: Request, scope = "intake") {
  const secret = process.env.INTAKE_RATE_SECRET;
  if (!secret) return fail(503, "Private submissions are not configured yet.");
  // Only Netlify's platform-owned connection header is trusted; local development shares one bucket.
  const ip = process.env.NETLIFY === "true" ? request.headers.get("x-nf-client-connection-ip") || "unknown" : "local";
  const key = createHmac("sha256", secret).update(`${scope}:${ip}:${Math.floor(Date.now()/3600000)}`).digest("hex");
  const count = checked(await intakeClient().rpc("intake_rate", { p_key: key }));
  if (Number(count) > 12) fail(429, "Too many requests. Please try again in an hour.");
}
export function response(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
export function errorResponse(error: unknown) {
  const e = error as { status?: number; message?: string };
  return response({ error: e.status ? e.message : "We could not complete that action. Your details are still here. Please retry." }, e.status || 503);
}
export async function startIntake(request: Request) {
  sameOrigin(request);
  const data = await bodyJSON(request);
  const record = cleanPayload(data), metadata = filesMeta(data.files, record) as { name: string; mime: string; size: number; purpose: string }[];
  if (process.env.INTAKE_ENABLED !== "true") return fail(503, "Private submissions are not ready yet. Your details have not been sent.");
  await rateLimit(request);
  const client = intakeClient(), bucket = process.env.INTAKE_BUCKET;
  const uploadApiKey = process.env.INTAKE_ANON_KEY;
  if (!uploadApiKey) return fail(503, "Private upload authorization is not configured.");
  if (!bucket) return fail(503, "Private upload storage is not configured.");
  const storage = checked(await client.storage.getBucket(bucket));
  if (!storage || storage.public || Number(storage.file_size_limit) < 104857600) return fail(503, "Private storage does not yet support the required file sizes.");
  const id = randomUUID(), token = randomBytes(32).toString("hex"), now = new Date().toISOString();
  const files = metadata.map(f => ({ ...f, id: randomUUID(), objectKey: "" }));
  for (const file of files) file.objectKey = `intake/${id}/${file.id}`;
  const consent: Record<string, unknown> = { ...record.consent, acceptedAt: now };
  if (record.kind !== "kit") {
    const terms = agreements[record.kind === "story" ? "story-participation-agreement.html" : "participation-agreement.html"];
    consent.termsSnapshot = terms; consent.termsHash = hash(terms);
  }
  const expiresAt = Date.now() + 24*60*60*1000;
  checked(await client.rpc("intake_begin", { p_record: { ...record, id, consent, upload_token_hash: hash(token), upload_expires_at: new Date(expiresAt).toISOString() }, p_files: files }));
  const uploads = [];
  for (const file of files) {
    const signed = checked(await client.storage.from(bucket).createSignedUploadUrl(file.objectKey));
    if (!signed) return fail(503, "Could not authorize the upload.");
    uploads.push({ ...file, signature: signed.token });
  }
  const endpoint = new URL(process.env.INTAKE_SUPABASE_URL!);
  if (endpoint.hostname.endsWith(".supabase.co")) endpoint.hostname = endpoint.hostname.replace(".supabase.co", ".storage.supabase.co");
  endpoint.pathname = "/storage/v1/upload/resumable/sign";
  return response({ id, token, files: uploads, bucket, uploadEndpoint: endpoint.href, uploadApiKey, expiresAt }, 201);
}
export async function authorizeUpload(request: Request, id: string) {
  const row = checked(await intakeClient().from("intake_submissions").select("*").eq("id",id).maybeSingle());
  const supplied = hash(request.headers.get("x-upload-token") || "");
  if (!row || !row.upload_token_hash || !timingSafeEqual(Buffer.from(row.upload_token_hash),Buffer.from(supplied))) return fail(403,"This upload session is not authorized.");
  if (row.state === "deleting") return fail(409,"This submission is being removed.");
  if (!row.submitted_at && Date.parse(row.upload_expires_at) < Date.now()) return fail(410,"This upload session expired. Please begin a new request.");
  return row;
}
export async function refreshUpload(request: Request, id: string) {
  sameOrigin(request);
  const row = await authorizeUpload(request, id);
  if (row.submitted_at) return response({ files: [] });
  const client = intakeClient(), bucket = process.env.INTAKE_BUCKET!;
  const files = checked(await client.from("intake_files").select("id,object_key").eq("submission_id", id)) || [];
  const uploads = [];
  for (const file of files) {
    const signed = checked(await client.storage.from(bucket).createSignedUploadUrl(file.object_key));
    if (!signed) return fail(503, "Could not renew the upload. Please retry.");
    uploads.push({ id: file.id, signature: signed.token });
  }
  return response({ files: uploads });
}
async function readBounded(result: Response, max: number) {
  if (!result.body) return fail(409,"File is incomplete.");
  const reader = result.body.getReader(); let length = 0; const parts: Uint8Array[] = [];
  // Next may tee fetch responses; awaiting cancellation can wait forever on its unread clone.
  try { while (true) { const item = await reader.read(); if(item.done) break; const needed = max-length; parts.push(item.value.slice(0,needed)); length += Math.min(needed,item.value.length); if(length>=max) { void reader.cancel().catch(()=>{}); break; } } } finally { reader.releaseLock(); }
  return Buffer.concat(parts);
}
export function safeSvg(text: string) {
  let valid = true, root = false;
  const parser = new SaxesParser({ xmlns: true });
  parser.on("doctype",() => {valid = false;});
  parser.on("processinginstruction",() => {valid = false;});
  parser.on("error",() => {valid = false;});
  parser.on("opentag",tag => {
    if (!root) { root = true; if(tag.local !== "svg" || tag.uri !== "http://www.w3.org/2000/svg") valid=false; }
    if (["script","foreignobject","iframe","object","embed","style","animate","set","animatemotion","animatetransform"].includes(tag.local.toLowerCase())) valid=false;
    for(const attr of Object.values(tag.attributes)) {
      if (/^on/i.test(attr.local) || /javascript:|@import|url\s*\(/i.test(attr.value) || (attr.local === "href" && !attr.value.startsWith("#"))) valid=false;
    }
  });
  try { parser.write(text).close(); } catch { valid=false; }
  return valid && root;
}
export async function finishIntake(request: Request, id: string) {
  sameOrigin(request);
  const row = await authorizeUpload(request,id);
  if(row.submitted_at) return response({ id, receivedAt: row.submitted_at });
  const client=intakeClient(), bucket=process.env.INTAKE_BUCKET!;
  const files=checked(await client.from("intake_files").select("*").eq("submission_id",id)) || [];
  for(const file of files) {
    const signed=checked(await client.storage.from(bucket).createSignedUrl(file.object_key,60));
    if(!signed) return fail(409,"File is not available yet.");
    const head=await fetch(signed.signedUrl,{method:"HEAD",cache:"no-store",signal:AbortSignal.timeout(20000)});
    const svg=file.mime === "image/svg+xml";
    if(!head.ok || (!svg && Number(head.headers.get("content-length"))!==file.size) || head.headers.get("content-type")?.split(";")[0]!==file.mime) return fail(409,"Upload every file completely before submitting.");
    // SVG may be compressed and omit Content-Length. Verify the complete decoded body instead.
    const limit=svg ? file.size+1 : Math.min(file.size,16384);
    const object=await fetch(signed.signedUrl,{headers:svg ? {} : {Range:`bytes=0-${limit-1}`},cache:"no-store",signal:AbortSignal.timeout(20000)});
    if(!object.ok) return fail(409,"Could not verify your file. Please retry.");
    const bytes=await readBounded(object,limit);
    if(svg && bytes.length!==file.size) return fail(409,"Upload every file completely before submitting.");
    if(!checkMagic(bytes,file.mime) || (file.mime === "image/svg+xml" && !safeSvg(bytes.toString("utf8")))) return fail(400,"File contents do not match a supported safe file. Export it again.");
  }
  // The transaction rechecks token, expiry and deletion state under a row lock.
  const receipt=checked(await client.rpc("intake_finish",{p_id:id,p_token_hash:row.upload_token_hash}));
  if(!receipt) return fail(409,"Could not complete this request. Please retry.");
  return response(receipt);
}

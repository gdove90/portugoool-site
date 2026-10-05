import "server-only";
import { requireOwner } from "./auth";
import { bodyJSON, checked, fail, intakeClient, response, sameOrigin } from "./server";
const states = ["new","reviewing","approved","featured","quoted","closed"];

export async function adminRequest(request: Request, path: string[]) {
  const user = await requireOwner();
  const client = intakeClient(), url = new URL(request.url);
  if (request.method !== "GET") sameOrigin(request);
  if(path.length === 1 && path[0] === "session" && request.method === "GET") return response({email:user.email,notifications:"not_configured"});
  if(path.length === 1 && path[0] === "submissions" && request.method === "GET") {
    const kind=url.searchParams.get("kind") || "", status=url.searchParams.get("status") || "", q=(url.searchParams.get("q") || "").slice(0,100);
    const offset=Math.max(0,Math.min(100000,Math.floor(Number(url.searchParams.get("offset")) || 0)));
    if(kind && !["kit","video","story","Goals","Highlights","Saves"].includes(kind)) return fail(400,"Invalid filter.");
    if(status && !states.includes(status)) return fail(400,"Invalid status.");
    let query=client.from("intake_submissions").select("id,kind,category,status,name,email,team,submitted_at,updated_at").eq("state","received").order("submitted_at",{ascending:false}).range(offset,offset+50);
    if(kind) query=query.eq(["kit","video","story"].includes(kind)?"kind":"category",kind);
    if(status) query=query.eq("status",status);
    // PostgREST filter syntax is not a user-input language. Strip its metacharacters.
    const search=q.replace(/[(),.%*\\"']/g," ").trim();
    if(search) query=query.or(`name.ilike.%${search}%,email.ilike.%${search}%,team.ilike.%${search}%`);
    const items=checked(await query) || [], counts=checked(await client.rpc("intake_counts"));
    return response({items:items.slice(0,50),hasMore:items.length>50,counts});
  }
  const id=path[1];
  if(path.length !== 2 || !/^[0-9a-f-]{36}$/i.test(id || "")) return fail(404,"Not found.");
  if(path[0] === "files" && request.method === "GET") {
    const file=checked(await client.from("intake_files").select("*,intake_submissions!inner(state)").eq("id",id).eq("state","ready").eq("intake_submissions.state","received").maybeSingle());
    if(!file) return fail(404,"File not found.");
    const inline=url.searchParams.get("view") === "1" && ["image/png","image/jpeg","video/mp4","video/webm","video/quicktime"].includes(file.mime);
    const signed=checked(await client.storage.from(process.env.INTAKE_BUCKET!).createSignedUrl(file.object_key,60,inline?{}:{download:file.name}));
    if(!signed) return fail(404,"File unavailable.");
    return new Response(null,{status:302,headers:{Location:signed.signedUrl,"Cache-Control":"private, no-store","Referrer-Policy":"no-referrer","X-Content-Type-Options":"nosniff"}});
  }
  if(path[0] !== "submissions") return fail(404,"Not found.");
  const row=checked(await client.from("intake_submissions").select("*").eq("id",id).in("state",request.method === "DELETE" ? ["received","deleting"] : ["received"]).maybeSingle());
  if(!row) return fail(404,"Submission not found.");
  if(request.method === "GET") {
    const files=checked(await client.from("intake_files").select("id,name,mime,size,purpose").eq("submission_id",id).eq("state","ready"));
    const {termsSnapshot: _snapshot,...consent}=row.consent;
    return response({id:row.id,kind:row.kind,category:row.category,status:row.status,payload:row.payload,consent,submittedAt:row.submitted_at,notes:row.notes,files});
  }
  if(request.method === "PATCH") {
    const data=await bodyJSON(request,24000);
    if(!states.includes(data.status) || typeof data.notes !== "string" || data.notes.length>5000) return fail(400,"Check the review fields.");
    const updated=checked(await client.from("intake_submissions").update({status:data.status,notes:data.notes,updated_at:new Date().toISOString()}).eq("id",id).eq("state","received").select("id").maybeSingle());
    if(!updated) return fail(409,"This submission changed. Refresh the inbox.");
    return response({saved:true});
  }
  if(request.method === "DELETE") {
    checked(await client.rpc("intake_mark_deleting",{p_id:id}));
    const files=checked(await client.from("intake_files").select("object_key").eq("submission_id",id)) || [];
    if(files.length) checked(await client.storage.from(process.env.INTAKE_BUCKET!).remove(files.map(f=>f.object_key)));
    // Retain private tombstones through upload expiry so cleanup can remove late uploads too.
    return response({deleted:true});
  }
  return fail(405,"Method not allowed.");
}

export async function cleanupExpired() {
  const client=intakeClient();
  const rows=checked(await client.from("intake_submissions").select("id").in("state",["draft","deleting"]).lt("upload_expires_at",new Date(Date.now()-86400000).toISOString()).limit(10)) || [];
  for(const row of rows) {
    checked(await client.rpc("intake_mark_deleting",{p_id:row.id}));
    const files=checked(await client.from("intake_files").select("object_key").eq("submission_id",row.id)) || [];
    if(files.length) checked(await client.storage.from(process.env.INTAKE_BUCKET!).remove(files.map(f=>f.object_key)));
    checked(await client.from("intake_submissions").delete().eq("id",row.id).eq("state","deleting"));
  }
  checked(await client.from("intake_rate_limits").delete().lt("expires_at",new Date().toISOString()));
}

import { redirect } from "next/navigation";
import { verifiedOwner } from "@/lib/intake/auth";
import Admin from "@/v84/Admin";
import "@/v84/admin.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "Private Admin",robots:{index:false,follow:false} };
export default async function Page() {
  const owner=await verifiedOwner().catch(()=>null);
  if(!owner) redirect("/admin/sign-in");
  return <Admin />;
}

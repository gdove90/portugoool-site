import "server-only";
import { cookies } from "next/headers";
import { authClient, fail, ownerIds } from "./server";

export const ACCESS_COOKIE = "goool-owner-access";
export const REFRESH_COOKIE = "goool-owner-refresh";
export async function verifiedOwner() {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  const { data, error } = await authClient().auth.getUser(token);
  if (error || !data.user || !ownerIds().includes(data.user.id)) return null;
  return data.user;
}
export async function requireOwner() {
  const user = await verifiedOwner();
  if (!user) return fail(403, "This dashboard is restricted to the site owner.");
  return user;
}

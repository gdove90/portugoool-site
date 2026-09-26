// Scheduled functions run only on published deploys. The authenticated API owns delivery.
declare const Netlify: { env: { get(name: string): string | undefined } };
export default async () => {
  const key = Netlify.env.get("FULFILLMENT_OPS_KEY");
  if (!key) throw new Error("Email worker ops key is missing.");
  const response = await fetch("https://goool.shop/api/fulfillment-ops", {
    method: "POST", headers: { "Content-Type": "application/json", "x-ops-key": key },
    body: JSON.stringify({ action: "deliver-emails" }), signal: AbortSignal.timeout(27000),
  });
  if (!response.ok) throw new Error("Email worker failed: " + response.status);
};
export const config = { schedule: "* * * * *" };

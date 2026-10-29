import buildContext from "../generated/build-context.json";
declare const Netlify: { env: { get(name: string): string | undefined } };
export default async () => {
  if (!buildContext.operational || Netlify.env.get("CARRIER_TRACKING_ENABLED") !== "true") return;
  const key = Netlify.env.get("CARRIER_TRACKING_OPS_KEY");
  if (!key || key.length < 32) throw new Error("Tracking worker secret is missing.");
  const response = await fetch("https://goalathletics.shop/api/carrier-tracking-ops", {
    method: "POST", headers: { "x-tracking-ops-key": key }, signal: AbortSignal.timeout(27000),
  });
  if (!response.ok) throw new Error("Tracking worker failed: " + response.status);
};
export const config = { schedule: "*/10 * * * *" };

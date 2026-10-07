declare const Netlify: { env: { get(name: string): string | undefined } };

export default async () => {
  if (Netlify.env.get("INTAKE_ENABLED") !== "true") return;
  const secret = Netlify.env.get("INTAKE_MAINTENANCE_SECRET");
  if (!secret || secret.length < 32) throw new Error("Intake maintenance is not configured.");
  const response = await fetch("https://goool.shop/api/intake/maintenance", {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}` },
    redirect: "error",
    signal: AbortSignal.timeout(27000),
  });
  if (!response.ok) throw new Error("Intake maintenance failed: " + response.status);
};

export const config = { schedule: "@hourly" };

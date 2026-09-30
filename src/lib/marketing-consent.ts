// Runs in the head before the banner is painted. No network or pixel loader.
// The same resolver is used by the browser helper and bootstrap.
export const CONSENT_KEY = "goool_marketing_consent_v1";
export type ConsentChoice = "granted" | "denied";
export function resolveConsent(gpc: boolean, stored: string | null, region: string | null, now: number) {
  let choice: ConsentChoice | null = null;
  try {
    const value = JSON.parse(stored ?? "null");
    if (value && Number.isFinite(value.at) && now >= value.at && now - value.at < 180 * 86400000 && ["granted", "denied"].includes(value.choice)) choice = value.choice;
  } catch { /* blocked or malformed storage uses the regional default */ }
  return { consent: gpc ? "denied" : choice ?? (region === "US" ? "granted" : "denied"), prompt: !gpc && choice === null };
}
export const consentBootstrap = String.raw`(function(){try{var stored=null;try{stored=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})}catch(e){}var m=document.cookie.match(/(?:^|;\s*)goool_geo=([A-Z]{2})(?:;|$)/);var region=m?m[1]:null;var state=(${resolveConsent.toString()})(!!navigator.globalPrivacyControl,stored,region,Date.now());document.documentElement.dataset.gooolPrompt=String(state.prompt);document.documentElement.dataset.gooolRegion=region||"XX";}catch(e){document.documentElement.dataset.gooolPrompt="false";}})();`;

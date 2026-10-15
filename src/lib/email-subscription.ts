import { SUPPORT_EMAIL } from "./email";

/** RFC 8058 headers for promotional mail, including the welcome discount. */
export function listUnsubscribeHeaders(url: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${url}>, <mailto:${SUPPORT_EMAIL}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

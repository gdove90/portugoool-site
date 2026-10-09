export type IconName = "arrow-right" | "arrow-left" | "arrow-up-right" | "arrow-down" | "chevron-down" | "chevron-left" | "chevron-right" | "close" | "menu";
const paths: Record<IconName, string> = {
  "arrow-right": "M4 12h16m-6-6 6 6-6 6",
  "arrow-left": "M20 12H4m6-6-6 6 6 6",
  "arrow-up-right": "M6 18 18 6M6 6h12v12",
  "arrow-down": "M12 4v16m-6-6 6 6 6-6",
  "chevron-down": "m6 9 6 6 6-6",
  "chevron-left": "m15 6-6 6 6 6",
  "chevron-right": "m9 6 6 6-6 6",
  close: "m6 6 12 12M18 6 6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
};
export function InterfaceIcon({ name }: { name: IconName }) {
  return <svg className="interface-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}

const arrows: Record<string, IconName> = { "↗": "arrow-up-right", "→": "arrow-right", "←": "arrow-left", "↓": "arrow-down", "▾": "chevron-down" };
export function interfaceIconMarkup(symbol: string) {
  return `<svg class="interface-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${paths[arrows[symbol]]}"/></svg>`;
}
// Only trusted template icon spans; keep copy and user-entered text intact.
export function normalizeInterfaceMarkup(markup: string) {
  return markup.replace(/<span(?: aria-hidden="true")?>\s*([↗→←↓▾])\s*<\/span>/g, (_, symbol: string) => interfaceIconMarkup(symbol));
}

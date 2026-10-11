import type { ImgHTMLAttributes } from "react";
import images from "./mobile-images.json";
import desktopImages from "./desktop-images.json";

const sources = images as Record<string, string>;
const desktopSources = desktopImages as Record<string, string>;
/** Approved photography: phone compression and pixel-identical desktop WebP.
 * Original PNGs remain as the fallback; dimensions, crop and styling stay intact. */
export function MobileImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const source = typeof props.src === "string" ? sources[props.src] : undefined;
  const desktop = typeof props.src === "string" ? desktopSources[props.src] : undefined;
  return source || desktop ? <picture style={{ display: "contents" }}>{source && <source media="(max-width: 1023px)" type="image/webp" srcSet={source} />}{desktop && <source type="image/webp" srcSet={desktop} />}<img {...props} alt={props.alt} /></picture> : <img {...props} alt={props.alt} />;
}
export function mobileImageMarkup(markup: string) {
  return markup.replace(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g, (tag, src: string) => sources[src] || desktopSources[src] ? `<picture style="display:contents">${sources[src] ? `<source media="(max-width:1023px)" type="image/webp" srcset="${sources[src]}">` : ""}${desktopSources[src] ? `<source type="image/webp" srcset="${desktopSources[src]}">` : ""}${tag}</picture>` : tag);
}

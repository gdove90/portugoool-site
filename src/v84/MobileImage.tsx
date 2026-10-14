import type { ImgHTMLAttributes } from "react";
import images from "./mobile-images.json";
import desktopImages from "./desktop-images.json";
import photographyImages from "./photography-images.json";

const sources = images as Record<string, string>;
const desktopSources = desktopImages as Record<string, string>;
const photographs = photographyImages as Record<string, { src: string; desktop: string; mobile: string }>;
export const photographySource = (src: string) => photographs[src]?.src ?? src;
/** Responsive photography, including the owner-requested V3.0 bolt edits.
 * Archived originals remain intact; every revised format uses the same image. */
export function MobileImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const photograph = typeof props.src === "string" ? photographs[props.src] : undefined;
  const source = photograph?.mobile ?? (typeof props.src === "string" ? sources[props.src] : undefined);
  const desktop = photograph?.desktop ?? (typeof props.src === "string" ? desktopSources[props.src] : undefined);
  return source || desktop ? <picture style={{ display: "contents" }}>{source && <source media="(max-width: 1023px)" type="image/webp" srcSet={source} />}{desktop && <source type="image/webp" srcSet={desktop} />}<img {...props} src={photograph?.src ?? props.src} alt={props.alt} /></picture> : <img {...props} alt={props.alt} />;
}
export function mobileImageMarkup(markup: string) {
  return markup.replace(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g, (tag, src: string) => {
    const photograph = photographs[src], mobile = photograph?.mobile ?? sources[src], desktop = photograph?.desktop ?? desktopSources[src];
    const fallback = photograph ? tag.replace(`src="${src}"`, `src="${photograph.src}"`) : tag;
    return mobile || desktop ? `<picture style="display:contents">${mobile ? `<source media="(max-width:1023px)" type="image/webp" srcset="${mobile}">` : ""}${desktop ? `<source type="image/webp" srcset="${desktop}">` : ""}${fallback}</picture>` : fallback;
  });
}

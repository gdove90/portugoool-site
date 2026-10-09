import type { ImgHTMLAttributes } from "react";
import images from "./mobile-images.json";

const sources = images as Record<string, string>;
/** Same approved photography, compressed for phones. Desktop keeps its original source. */
export function MobileImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const source = typeof props.src === "string" ? sources[props.src] : undefined;
  return source ? <picture style={{ display: "contents" }}><source media="(max-width: 1023px)" srcSet={source} /><img {...props} alt={props.alt} /></picture> : <img {...props} alt={props.alt} />;
}
export function mobileImageMarkup(markup: string) {
  return markup.replace(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/g, (tag, src: string) => sources[src] ? `<picture style="display:contents"><source media="(max-width:1023px)" srcset="${sources[src]}">${tag}</picture>` : tag);
}

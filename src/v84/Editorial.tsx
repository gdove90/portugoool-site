import { createElement, type ReactNode } from "react";
import { parseFragment, serializeOuter, type DefaultTreeAdapterMap } from "parse5";
import { getProducts } from "@/lib/products";
import { referenceExperience } from "./reference-experience";
import { CollectionGrid, ProductGrid } from "./Catalog";
import { featuredProductIds } from "./catalog-data";

export default function Editorial({ route }: { route: "home" | "men" | "women" | "about" | "references" }) {
  type Node = DefaultTreeAdapterMap["childNode"];
  const slot = (node: Node) => "attrs" in node && node.attrs.some(a => a.name === "data-v84-slot");
  const containsSlot = (node: Node): boolean => slot(node) || ("childNodes" in node && node.childNodes.some(containsSlot));
  // Parse the complete approved document so React's live catalog stays inside its original section.
  function render(node: Node, key: number): ReactNode {
    if (slot(node)) return route === "home"
      ? <ProductGrid key={key} products={getProducts().filter(p => featuredProductIds.includes(p.id))} />
      : <CollectionGrid key={key} audience={route === "men" ? "men" : "women"} />;
    if (containsSlot(node) && "tagName" in node) {
      const props = Object.fromEntries(node.attrs.map(a => [a.name === "class" ? "className" : a.name, a.value]));
      return createElement(node.tagName, { ...props, key }, node.childNodes.map(render));
    }
    return <div key={key} style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: serializeOuter(node) }} />;
  }
  return <>{parseFragment(referenceExperience().markup(route)).childNodes.map(render)}</>;
}

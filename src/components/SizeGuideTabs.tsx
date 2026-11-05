"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import SizeGuide from "./SizeGuide";
import { guideAudienceFor, guideProducts, productForGuideHash, sizeGuideHref, type GuideAudience } from "@/lib/size-guide";

export { GUIDE, guideTabFor } from "@/lib/size-guide";

const audiences: { id: GuideAudience; label: string }[] = [{ id: "men", label: "Men" }, { id: "women", label: "Women" }];

function moveTab(event: KeyboardEvent<HTMLButtonElement>) {
  const tabs = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
  const current = tabs.indexOf(event.currentTarget);
  const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : event.key === "ArrowRight" ? (current + 1) % tabs.length : event.key === "ArrowLeft" ? (current + tabs.length - 1) % tabs.length : -1;
  if (next < 0) return;
  event.preventDefault();
  tabs[next]?.click();
  tabs[next]?.focus();
}

export default function SizeGuideTabs() {
  const first = productForGuideHash("performance") ?? guideProducts("men")[0];
  const [{ audience, productId }, setSelection] = useState({ audience: guideAudienceFor(first?.id ?? ""), productId: first?.id ?? "" });
  const productRow = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onHash = () => {
      const product = productForGuideHash(window.location.hash.slice(1));
      if (product) setSelection({ audience: guideAudienceFor(product.id), productId: product.id });
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const row = productRow.current;
    const tab = row?.querySelector<HTMLButtonElement>('[aria-selected="true"]');
    if (!row || !tab) return;
    if (tab.offsetLeft < row.scrollLeft) row.scrollLeft = tab.offsetLeft;
    else if (tab.offsetLeft + tab.offsetWidth > row.scrollLeft + row.clientWidth) row.scrollLeft = tab.offsetLeft + tab.offsetWidth - row.clientWidth;
  }, [audience, productId]);

  const selected = productForGuideHash(sizeGuideHref(productId).split("#")[1] ?? "");
  const visibleProducts = guideProducts(audience);
  const options = selected && !visibleProducts.some(product => product.id === selected.id) ? [...visibleProducts, selected] : visibleProducts;

  function select(nextAudience: GuideAudience, id: string) {
    setSelection({ audience: nextAudience, productId: id });
    window.history.replaceState(null, "", sizeGuideHref(id));
  }

  return (
    <div className="size-guide-picker">
      <div className="size-guide-audiences" role="tablist" aria-label="Collection">
        {audiences.map(item => <button
          key={item.id} type="button" role="tab" id={`size-guide-audience-${item.id}`}
          aria-selected={audience === item.id} aria-controls="size-guide-audience-panel" tabIndex={audience === item.id ? 0 : -1}
          onKeyDown={moveTab} onClick={() => {
            const products = guideProducts(item.id);
            const product = products.find(product => product.id === productId) ?? products[0];
            if (product) select(item.id, product.id);
          }}
        >{item.label}</button>)}
      </div>
      <div role="tabpanel" id="size-guide-audience-panel" aria-labelledby={`size-guide-audience-${audience}`}>
        <div ref={productRow} className="size-guide-products" role="tablist" aria-label={`${audience === "men" ? "Men's" : "Women's"} garments`}>
          {options.map(product => <button
            key={product.id} type="button" role="tab" id={`size-guide-product-${product.id}`}
            aria-label={product.name} aria-selected={product.id === productId} aria-controls="size-guide-product-panel" tabIndex={product.id === productId ? 0 : -1}
            data-guide-product={product.id} onKeyDown={moveTab} onClick={() => select(audience, product.id)}
          >{product.name.replace(/^(GOAL Athletics |TEMPO )/, "")}</button>)}
        </div>
        <div className="size-guide-product-panel" role="tabpanel" id="size-guide-product-panel" aria-labelledby={`size-guide-product-${productId}`} tabIndex={0}>
          <SizeGuide key={productId} productId={productId} showGuideLink={false} showMeasuringInstructions={false} />
        </div>
      </div>
    </div>
  );
}

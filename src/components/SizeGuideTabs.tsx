"use client";

import { useEffect, useState } from "react";
import SizeGuide from "./SizeGuide";
import { guideProducts, productForGuideHash, sizeGuideHref } from "@/lib/size-guide";

export { GUIDE, guideTabFor } from "@/lib/size-guide";

export default function SizeGuideTabs() {
  const visibleProducts = guideProducts();
  const first = productForGuideHash("performance") ?? visibleProducts[0];
  const [productId, setProductId] = useState(first?.id ?? "");
  useEffect(() => {
    const onHash = () => {
      const product = productForGuideHash(window.location.hash.slice(1));
      if (product) setProductId(product.id);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const selected = productForGuideHash(sizeGuideHref(productId).split("#")[1] ?? "");
  const options = selected && !visibleProducts.some(product => product.id === selected.id) ? [...visibleProducts, selected] : visibleProducts;
  return (
    <div className="size-guide-picker">
      <label htmlFor="size-guide-product">Choose your product</label>
      <select id="size-guide-product" value={productId} onChange={event => {
        const id = event.target.value;
        setProductId(id);
        window.history.replaceState(null, "", sizeGuideHref(id));
      }}>
        {options.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
      </select>
      <SizeGuide key={productId} productId={productId} showGuideLink={false} />
    </div>
  );
}

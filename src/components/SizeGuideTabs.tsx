"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type KeyboardEvent } from "react";
import { catalogImageSrc } from "@/lib/product-image";
import { collectionLabel, defaultVariant } from "@/v84/catalog-data";
import { Strike } from "@/v84/Brand";
import FitDetails from "./FitDetails";
import SizeGuide from "./SizeGuide";
import { guideAudienceFor, guideProducts, productForGuideHash, sizeGuideFor, sizeGuideHref, type GuideAudience } from "@/lib/size-guide";

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
  useEffect(() => {
    const onHash = () => {
      const product = productForGuideHash(window.location.hash.slice(1));
      if (product) setSelection({ audience: guideAudienceFor(product.id), productId: product.id });
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const selected = productForGuideHash(sizeGuideHref(productId).split("#")[1] ?? "");
  const visibleProducts = guideProducts(audience);
  const publicProduct = visibleProducts.find(product => product.id === productId);
  const options = selected && !publicProduct ? [...visibleProducts, selected] : visibleProducts;
  const guide = sizeGuideFor(productId);
  const variant = publicProduct && defaultVariant(publicProduct)?.variant;
  const image = variant?.cardImage || (variant?.images || publicProduct?.images)?.[0];
  const [fitSummary, ...fitDetails] = guide?.fitFacts ?? [];

  function select(nextAudience: GuideAudience, id: string) {
    setSelection({ audience: nextAudience, productId: id });
    window.history.replaceState(null, "", sizeGuideHref(id));
  }

  return (
    <div className="help-fit">
      <div className="help-fit-controls">
        <div>
          <p className="help-eyebrow">Collection</p>
          <div className="help-fit-audiences" role="tablist" aria-label="Collection">
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
        </div>
        <div role="tabpanel" id="size-guide-audience-panel" aria-labelledby={`size-guide-audience-${audience}`}>
          <label className="help-eyebrow" htmlFor="fit-guide-garment">Choose a garment</label>
          <select id="fit-guide-garment" value={productId} onChange={event => select(audience, event.target.value)}>
            {options.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
        </div>
      </div>
      {selected && guide && <section className="help-fit-result" aria-labelledby="fit-guide-product-title">
        <div className={image ? "help-fit-info has-photo" : "help-fit-info"} key={productId}>
          {image && <Image className="help-fit-photo" src={catalogImageSrc(image.src)} alt={image.alt} width={360} height={270} sizes="(max-width: 585px) 25vw, 330px" loading="eager" />}
          <p className="help-eyebrow">{collectionLabel(selected)} collection</p>
          <h2 className="help-section-title" id="fit-guide-product-title" aria-live="polite">{guide.title}</h2>
          <div className="help-fit-copy">
            <p>{fitSummary?.value ?? guide.fit}</p>
            {fitSummary ? <details className="help-disclosure">
              <summary>Fit &amp; sizing <Strike /></summary>
              <FitDetails facts={fitDetails} fallbackFit={guide.fit} />
            </details> : <p>{guide.blank}</p>}
          </div>
          {publicProduct && <Link className="help-action" href={`/shop/${publicProduct.slug}`}>View product</Link>}
        </div>
        <SizeGuide productId={productId} showProductIntro={false} showGuideLink={false} showMeasuringInstructions={false} />
      </section>}
    </div>
  );
}

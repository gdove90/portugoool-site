"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { catalogImageSrc } from "@/lib/product-image";
import { hasPrice, type Product } from "@/lib/types";
import { audienceAssignments, defaultVariant, forAudience, orderedVariants, productType, type Audience } from "./catalog-data";
import { Strike } from "./Brand";

export function ProductCard({ product }: { product: Product }) {
  const variant = defaultVariant(product)?.variant;
  const image = (variant?.images || product.images)[0];
  return <Link className="product-card" href={`/shop/${product.slug}`}><div className="product-image"><Image className="asset" src={catalogImageSrc(image.src)} alt={image.alt} fill sizes="(max-width:700px) 46vw, 23vw" /><span className="product-tag">CORE</span></div><div className="product-meta"><h3>{product.name}</h3><span>{hasPrice(product) ? formatPrice(product.priceCents) : "Price to be announced"}</span></div><div className="product-sub">{orderedVariants(product).map(({ variant: v }) => <i key={v.name} className="swatch-small" style={{ background: v.hex }} />)} {variant?.name || product.color}</div></Link>;
}

export function ProductGrid({ products }: { products: Product[] }) {
  return <div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>;
}

export function CollectionGrid({ audience }: { audience?: Audience }) {
  const [type, setType] = useState("all");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("featured");
  const [open, setOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const list = audience ? forAudience(audience) : getProducts();
  const types = ["tees", "tanks", "leggings", "shorts", "hoodies", "hats"].filter(t => list.some(p => productType(p) === t));
  const options = [["featured", "Featured"], ["low", "Price: low to high"], ["high", "Price: high to low"]];
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const category = query.get("category");
    if (category) setType(category === "hoodie" ? "hoodies" : category === "hat" || category === "accessory" ? "hats" : "tees");
    const close = (event: PointerEvent) => { if (!sortRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  let visible = list.filter(p => (type === "all" || productType(p) === type) && (filter === "all" || audienceAssignments[p.id]?.includes(filter as Audience)));
  if (sort !== "featured") visible = [...visible].sort((a, b) => sort === "low" ? a.priceCents - b.priceCents : b.priceCents - a.priceCents);
  function tabKey(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const keys = ["all", ...types], current = keys.indexOf(type);
    const next = event.key === "Home" ? 0 : event.key === "End" ? keys.length - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + keys.length) % keys.length;
    setType(keys[next]); document.getElementById(`type-${keys[next]}`)?.focus();
  }
  return <section className={audience ? "landing-shop" : "section catalog"} id="next-section">
    {audience ? <div className="landing-collection-bar"><h2 className="landing-collection-name">The {audience === "men" ? "Core" : "Tempo"} Collection</h2><div className="landing-tab-bar" role="tablist" aria-label="Shop by clothing type">{["all", ...types].map(key => <button id={`type-${key}`} key={key} className={`activity-tab${type === key ? " active" : ""}`} role="tab" aria-selected={type === key} aria-controls="collection-products" tabIndex={type === key ? 0 : -1} onKeyDown={tabKey} onClick={() => setType(key)}><span className="activity-tab-label">{key === "all" ? "All pieces" : key[0].toUpperCase() + key.slice(1)}</span></button>)}</div></div> : <div className="collection-toolbar"><div className="filter-list" aria-label="Collection">{[["all", "All pieces"], ["women", "Women"], ["men", "Men"]].map(([key, label]) => <button key={key} className={`filter${filter === key ? " active" : ""}`} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}</div><div className="sort-control" ref={sortRef} onKeyDown={event => { if (event.key === "Escape") { setOpen(false); sortRef.current?.querySelector("button")?.focus(); } }}><button id="sort-trigger" className="sort-trigger" aria-expanded={open} aria-controls="sort-options" onClick={() => setOpen(!open)}>{options.find(o => o[0] === sort)?.[1]}<Strike /></button>{open && <div id="sort-options" className="sort-options">{options.map(([key, label]) => <button key={key} aria-pressed={sort === key} onClick={() => { setSort(key); setOpen(false); sortRef.current?.querySelector("button")?.focus(); }}>{label}</button>)}</div>}</div></div>}
    <div id="collection-products" role={audience ? "tabpanel" : undefined} aria-labelledby={audience ? `type-${type}` : undefined}><div className="activity-summary"><span>{type === "all" ? "All pieces" : type}</span><span>{visible.length} pieces</span></div><ProductGrid products={visible} />{!visible.length && <p className="note">No pieces in this selection.</p>}</div>
  </section>;
}

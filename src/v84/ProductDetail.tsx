"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { getProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { catalogImageSrc } from "@/lib/product-image";
import { trackAddToCart, trackViewContent } from "@/lib/meta-pixel";
import { hasPrice, isAvailableForSale, isSoldOut, remainingUnits, type Product, type Size } from "@/lib/types";
import SizeGuide from "@/components/SizeGuide";
import { defaultVariant, orderedVariants } from "./catalog-data";
import { ProductGrid } from "./Catalog";
import { Strike } from "./Brand";

function Detail({ title, children }: { title: string; children: ReactNode }) { return <details className="product-detail"><summary>{title}<Strike /></summary><div>{children}</div></details>; }
export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variantIndex,setVariantIndex] = useState(defaultVariant(product)?.index ?? 0);
  const [size,setSize] = useState<Size | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [imageIndex,setImageIndex] = useState(0);
  const [error,setError] = useState("");
  const [customName,setCustomName] = useState("");
  const [customNumber,setCustomNumber] = useState("");
  const fit = useRef<HTMLDialogElement>(null);
  const viewed = useRef<string | null>(null);
  const variant = product.colorVariants?.[variantIndex];
  const images = variant?.images || product.images;
  const color = variant?.name || product.color;
  const image = images[imageIndex] || images[0];
  const comingSoon = !isAvailableForSale(product) || variant?.comingSoon;
  const soldOut = isSoldOut(product);
  const custom = Boolean(customName.trim() || customNumber.trim());
  const price = product.priceCents + (custom ? product.customizationPriceCents : 0);
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("color");
    const selected = product.colorVariants?.findIndex(v => v.name.toLowerCase() === wanted?.toLowerCase());
    if (selected !== undefined && selected >= 0) setVariantIndex(selected);
    if (viewed.current !== product.slug && hasPrice(product)) {
      viewed.current = product.slug;
      trackViewContent({ slug: product.slug, name: product.name, value: product.priceCents / 100, currency: "USD" });
    }
  }, [product]);
  function add() {
    if (comingSoon || soldOut || !hasPrice(product)) return;
    if (!size) { setError("Please choose a size first."); document.querySelector<HTMLButtonElement>(".sizes button")?.focus(); return; }
    addItem({ productId: product.id, slug: product.slug, name: product.name, color, image: images[0].src, size, quantity: 1, unitPriceCents: price, customName: customName.trim() || undefined, customNumber: customNumber.trim() || undefined });
    trackAddToCart({ slug: product.slug, name: product.name, value: price / 100, currency: "USD", quantity: 1, lineKey: `${product.id}:${color}:${size}` });
    document.dispatchEvent(new Event("goool:open-bag"));
  }
  return <><div className="breadcrumb"><Link href="/">Home</Link> / <Link href="/shop">Collection</Link> / {product.name}</div><section className="pdp"><div><div className="gallery"><div className="thumbnails">{images.map((img,i) => <button key={img.src} className={`thumbnail${imageIndex === i ? " active" : ""}`} aria-pressed={imageIndex === i} aria-label={`View image ${i+1}: ${img.alt}`} onClick={() => setImageIndex(i)}><img src={catalogImageSrc(img.src)} alt="" /></button>)}</div><div className="gallery-main"><Image src={catalogImageSrc(image.src)} alt={image.alt} fill priority sizes="(max-width:700px) 90vw, 52vw" quality={90} /><span className="gallery-counter">{imageIndex+1} / {images.length}</span></div></div>{image.caption && <p className="note">{image.caption}</p>}</div><div className="pdp-info"><p className="eyebrow">CORE COLLECTION</p><h1>{product.name}</h1><p className="pdp-price">{hasPrice(product) ? formatPrice(price) : "Price to be announced"}{product.compareAtPriceCents && product.compareAtPriceCents > product.priceCents ? <del className="note"> {formatPrice(product.compareAtPriceCents)}</del> : null}</p><p className="pdp-description">{product.description}</p><div className="field-label color-label"><span>COLOR</span><Strike /><span>{color}</span></div><div className="color-options" role="group" aria-label="Choose color">{orderedVariants(product).map(({variant:v,index}) => <button key={v.name} className="color-swatch" style={{"--swatch":v.hex} as React.CSSProperties} aria-label={`${v.name}${v.comingSoon ? ", coming soon" : ""}`} aria-pressed={variantIndex === index} onClick={() => {setVariantIndex(index);setImageIndex(0);}} />)}</div><div className="field-label"><span>SELECT SIZE</span><button onClick={() => fit.current?.showModal()}>Fit guide</button></div><div className="sizes" role="group" aria-label="Choose size">{product.sizes.map(s => <button className="size" key={s} aria-pressed={size === s} onClick={() => {setSize(s);setError("");}}>{s === "OS" ? "One size" : s}</button>)}</div>{product.fitNote && <p className="note">{product.fitNote}</p>}{product.customNameAvailable && <label>Name<input maxLength={24} value={customName} onChange={e => setCustomName(e.target.value)} /></label>}{product.customNumberAvailable && <label>Number<input inputMode="numeric" maxLength={2} value={customNumber} onChange={e => setCustomNumber(e.target.value.replace(/\D/g,""))} /></label>}{custom && <p className="note">Customization: {formatPrice(product.customizationPriceCents)}</p>}<button className="btn add-button" onClick={add} disabled={Boolean(comingSoon || soldOut || !hasPrice(product))}>{soldOut ? "Sold out" : comingSoon ? "Coming soon" : "Add to bag"}<Strike /></button><p role="alert" className="form-error">{error}</p>{remainingUnits(product) !== null && <p className="note">{remainingUnits(product)} remaining</p>}{product.disclosure && <p className="pdp-note">{product.disclosure}</p>}{product.originLabel && <p className="note">{product.originLabel}</p>}<Detail title="FIT & SIZING"><p>{product.fit}</p><button className="text-link" onClick={() => fit.current?.showModal()}>View fit guide</button></Detail><Detail title="MATERIALS">{product.fabric}</Detail><Detail title="THE STRIKE">The two-stroke mark carries the GOOOL Athletics identity.</Detail><Detail title="CARE">{product.careInstructions}</Detail><Detail title="SHIPPING & RETURNS"><Link className="nav-underline" href="/shipping-returns">Delivery and shipping</Link><p>All sales are final. See the <Link className="nav-underline" href="/refunds">refund policy</Link> for damaged, defective or wrong items.</p></Detail></div></section><section className="editorial"><img src="/v84/assets/hero.png" alt="GOOOL Athletics stadium editorial" loading="lazy" /><div><p className="eyebrow">SAME FEELING. DIFFERENT PATHS.</p><h2>Built for<br />what moves you.</h2></div></section><section className="section"><div className="section-heading"><div><p className="eyebrow">MAKE IT YOUR ROTATION</p><h2>Goes with your day.</h2></div></div><ProductGrid products={getProducts().filter(p => p.id !== product.id).slice(0,4)} /></section><dialog className="info-dialog" ref={fit}><div className="dialog-head"><h2>Find your fit.</h2><button className="close-button" aria-label="Close fit guide" onClick={() => fit.current?.close()}>Close &times;</button></div><p>{product.fit}</p><SizeGuide productId={product.id} /><p><Link href="/size-guide" className="nav-underline">All size guides</Link></p></dialog></>;
}

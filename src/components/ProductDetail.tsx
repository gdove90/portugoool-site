"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Product, Size, remainingUnits, isSoldOut } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import SizeSelector from "./SizeSelector";
import CustomizationSelector from "./CustomizationSelector";

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();

  const singleSize = product.sizes.length === 1;
  const [selectedSize, setSelectedSize] = useState<Size | null>(
    singleSize ? product.sizes[0] : null
  );
  const variants = product.colorVariants;
  const [variantIdx, setVariantIdx] = useState(0);
  const activeVariant = variants?.[variantIdx];
  const images = activeVariant?.images ?? product.images;
  const colorName = activeVariant?.name ?? product.color;
  const [activeImage, setActiveImage] = useState(0);
  const [customize, setCustomize] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  const soldOut = isSoldOut(product);
  const remaining = remainingUnits(product);
  const customizable =
    product.customNameAvailable || product.customNumberAvailable;

  const hasCustomization =
    customize && (customName.trim() !== "" || customNumber.trim() !== "");
  const unitPriceCents =
    product.priceCents +
    (hasCustomization ? product.customizationPriceCents : 0);
  const onSale =
    product.compareAtPriceCents != null &&
    product.compareAtPriceCents > product.priceCents;

  function handleAddToCart(goToCart: boolean) {
    if (soldOut) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      color: colorName,
      image: images[0].src,
      size: selectedSize,
      quantity: 1,
      unitPriceCents,
      customName: hasCustomization ? customName.trim() : undefined,
      customNumber: hasCustomization ? customNumber.trim() : undefined,
    });
    if (goToCart) {
      router.push("/cart");
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-content px-4 py-6 sm:px-6 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Images */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-smoke">
            <Image
              src={images[activeImage].src}
              alt={images[activeImage].alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.isLimitedDrop && (
              <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
                {soldOut
                  ? "Sold Out"
                  : `Limited Drop${product.dropVersion ? ` · Version ${product.dropVersion}` : ""}`}
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-16 overflow-hidden rounded-lg bg-smoke ${
                    i === activeImage ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <Image src={img.src} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase panel — price, size, customization, CTA stay tight for mobile */}
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-tightest text-ink sm:text-4xl">
            {product.name}
          </h1>

          {variants ? (
            <div className="mt-3">
              <p className="text-sm text-ink/60">
                Color: <span className="font-semibold text-ink">{colorName}</span>
              </p>
              <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Select color">
                {variants.map((v, i) => (
                  <button
                    key={v.name}
                    type="button"
                    role="radio"
                    aria-checked={i === variantIdx}
                    aria-label={v.name}
                    onClick={() => {
                      setVariantIdx(i);
                      setActiveImage(0);
                    }}
                    className={`h-9 w-9 rounded-full border transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                      i === variantIdx
                        ? "border-ink ring-2 ring-ink ring-offset-2"
                        : "border-ink/20 hover:border-ink/50"
                    }`}
                    style={{ backgroundColor: v.hex }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-2 flex items-center gap-2 text-sm text-ink/50">
              <span
                className="inline-block h-3.5 w-3.5 rounded-full border border-ink/15"
                style={{ backgroundColor: product.colorHex }}
                aria-hidden="true"
              />
              {product.color}
            </p>
          )}

          <p className="mt-3 text-2xl font-semibold text-ink">
            {onSale && (
              <span className="mr-2 text-lg font-normal text-ink/40 line-through">
                {formatPrice(product.compareAtPriceCents!)}
              </span>
            )}
            {formatPrice(unitPriceCents)}
            {hasCustomization && (
              <span className="ml-2 text-sm font-normal text-ink/50">
                includes name &amp; number
              </span>
            )}
          </p>

          {/* Limited drop status */}
          {product.isLimitedDrop && product.dropLimit != null && (
            <div className="mt-4 rounded-xl bg-smoke p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink">
                  Drop Version {product.dropVersion ?? "I"} · {product.dropLimit} made
                </span>
                <span className={`font-bold ${soldOut ? "text-ink/50" : "text-red"}`}>
                  {soldOut ? "Sold out" : `${remaining} remaining`}
                </span>
              </div>
              {/* Remaining bar */}
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10"
                role="img"
                aria-label={`${remaining} of ${product.dropLimit} units remaining`}
              >
                <div
                  className="h-full rounded-full bg-red"
                  style={{ width: `${((remaining ?? 0) / product.dropLimit) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-ink/60">
                Once this drop sells out, it will not be reprinted.
              </p>
            </div>
          )}

          <p className="mt-4 text-base leading-relaxed text-ink/70">
            {product.description}
          </p>

          <div className="mt-6 space-y-5">
            {!singleSize && (
              <div>
                <SizeSelector
                  sizes={product.sizes}
                  selected={selectedSize}
                  onSelect={(s) => {
                    setSelectedSize(s);
                    setSizeError(false);
                  }}
                />
                {product.fitNote && (
                  <p className="mt-2 text-xs leading-relaxed text-ink/60">
                    {product.fitNote}
                  </p>
                )}
                {sizeError && (
                  <p className="mt-2 text-sm font-medium text-red" role="alert">
                    Select a size to continue.
                  </p>
                )}
              </div>
            )}

            {customizable && (
              <CustomizationSelector
                nameAvailable={product.customNameAvailable}
                numberAvailable={product.customNumberAvailable}
                priceCents={product.customizationPriceCents}
                enabled={customize}
                onToggle={setCustomize}
                customName={customName}
                onNameChange={setCustomName}
                customNumber={customNumber}
                onNumberChange={setCustomNumber}
              />
            )}

            {soldOut ? (
              <div className="rounded-xl border border-ink/15 p-5 text-center">
                <p className="font-display text-xl font-bold uppercase tracking-tightest text-ink">
                  This drop is gone.
                </p>
                <p className="mt-1 text-sm text-ink/60">
                  It will not be reprinted. Join the list to hear about Version{" "}
                  {product.dropVersion === "I" ? "II" : "next"} first.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  className="w-full rounded-full bg-red px-8 py-4 text-base font-semibold text-paper transition-colors hover:bg-red-dark"
                >
                  Buy Now · {formatPrice(unitPriceCents)}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  className="w-full rounded-full border border-ink px-8 py-4 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  {added ? "Added ✓" : "Add to Cart"}
                </button>
              </div>
            )}

            {/* Trust copy */}
            <ul className="grid grid-cols-2 gap-2 text-xs text-ink/60">
              <li className="flex items-center gap-1.5">
                <TrustIcon /> Secure checkout
              </li>
              <li className="flex items-center gap-1.5">
                <TrustIcon /> Made to order
              </li>
              <li className="flex items-center gap-1.5">
                <TrustIcon /> Ships after production
              </li>
              {product.isLimitedDrop && (
                <li className="flex items-center gap-1.5">
                  <TrustIcon /> Limited drop
                </li>
              )}
            </ul>
          </div>

          {product.disclosure && (
            <p className="mt-4 rounded-xl bg-smoke p-4 text-xs leading-relaxed text-ink/60">
              {product.disclosure}
            </p>
          )}

          {/* Details */}
          <div className="mt-8 divide-y divide-ink/10 border-t border-ink/10">
            <DetailRow label="Material" value={product.fabric} />
            <DetailRow label="Fit" value={product.fit} />
            <DetailRow label="Care" value={product.careInstructions} />
            {product.sizeGuide && (
              <div className="py-4">
                <h2 className="text-sm font-semibold text-ink">Size guide</h2>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full min-w-[420px] text-left text-sm text-ink/70">
                    <caption className="sr-only">
                      Garment measurements in inches per size
                    </caption>
                    <thead>
                      <tr className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/50">
                        <th scope="col" className="py-2 pr-4 font-semibold">
                          Measurement (in)
                        </th>
                        {product.sizes.map((s) => (
                          <th key={s} scope="col" className="py-2 pr-3 font-semibold">
                            {s === "XXL" ? "2XL" : s}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizeGuide.measurements.map((m) => (
                        <tr key={m.label} className="border-b border-ink/5">
                          <th scope="row" className="py-2 pr-4 font-medium text-ink">
                            {m.label}
                          </th>
                          {product.sizes.map((s) => (
                            <td key={s} className="py-2 pr-3">
                              {m.values[s] ?? "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4">
      <h2 className="text-sm font-semibold text-ink">{label}</h2>
      <p className="mt-1 text-sm leading-relaxed text-ink/60">{value}</p>
    </div>
  );
}

function TrustIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="shrink-0 text-green"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

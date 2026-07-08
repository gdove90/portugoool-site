"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Product, Size, CUSTOMIZATION_PRICE_CENTS } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import SizeSelector from "./SizeSelector";
import CustomizationSelector from "./CustomizationSelector";

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [customize, setCustomize] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);

  const hasCustomization =
    customize && (customName.trim() !== "" || customNumber.trim() !== "");
  const unitPriceCents =
    product.priceCents + (hasCustomization ? CUSTOMIZATION_PRICE_CENTS : 0);
  const onSale =
    product.compareAtPriceCents != null &&
    product.compareAtPriceCents > product.priceCents;

  function handleAddToCart(goToCart: boolean) {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      color: product.color,
      image: product.images[0].src,
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
              src={product.images[activeImage].src}
              alt={product.images[activeImage].alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.isLimitedDrop && (
              <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
                Limited Drop
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
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

          <p className="mt-2 flex items-center gap-2 text-sm text-ink/50">
            <span
              className="inline-block h-3.5 w-3.5 rounded-full border border-ink/15"
              style={{ backgroundColor: product.colorHex }}
              aria-hidden="true"
            />
            {product.color}
          </p>

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

          {product.isLimitedDrop && product.inventoryDisplayCount != null && (
            <p className="mt-2 text-sm font-semibold text-red">
              Only {product.inventoryDisplayCount} left in this drop
            </p>
          )}

          <p className="mt-4 text-base leading-relaxed text-ink/70">
            {product.description}
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onSelect={(s) => {
                  setSelectedSize(s);
                  setSizeError(false);
                }}
              />
              {sizeError && (
                <p className="mt-2 text-sm font-medium text-red" role="alert">
                  Select a size to continue.
                </p>
              )}
            </div>

            <CustomizationSelector
              nameAvailable={product.customNameAvailable}
              numberAvailable={product.customNumberAvailable}
              enabled={customize}
              onToggle={setCustomize}
              customName={customName}
              onNameChange={setCustomName}
              customNumber={customNumber}
              onNumberChange={setCustomNumber}
            />

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
              <li className="flex items-center gap-1.5">
                <TrustIcon /> Limited drop
              </li>
            </ul>
          </div>

          {/* Details */}
          <div className="mt-8 divide-y divide-ink/10 border-t border-ink/10">
            <DetailRow label="Fabric" value={product.fabric} />
            <DetailRow label="Fit" value={product.fit} />
            <DetailRow label="Care" value={product.careInstructions} />
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

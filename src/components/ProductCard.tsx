"use client";

import Link from "next/link";
import Image from "next/image";
import { catalogImageSrc } from "@/lib/product-image";
import { useState } from "react";
import { Product, isSoldOut, isAvailableForSale, remainingUnits, hasPrice } from "@/lib/types";
import { formatPrice } from "@/lib/format";

// Catalog card (design 6a, 2026-09-29). The display name drops the
// "GOOOL " prefix, owner decision 2026-09-29: every product carries it
// and the brand is already on the page. The full name stays in the
// image alt, the link label and the product page.
const displayName = (name: string) => name.replace(/^GOOOL\s+/, "");

export default function ProductCard({ product }: { product: Product }) {
  const onSale =
    product.compareAtPriceCents != null &&
    product.compareAtPriceCents > product.priceCents;
  const soldOut = isSoldOut(product);
  const comingSoon = !isAvailableForSale(product);
  const priced = hasPrice(product);
  const remaining = remainingUnits(product);
  // Only surface the countdown when it's actually getting scarce — honest urgency.
  const lowStock = !soldOut && remaining != null && remaining <= 150;
  const oneSize =
    product.sizes.length === 1 && /^(os|one size)$/i.test(String(product.sizes[0]));

  // Each card keeps its own colorway selection; the image swaps in place and
  // the selection rides along to the product page as ?color=.
  const variants = product.colorVariants;
  const [variantIdx, setVariantIdx] = useState(0);
  const activeVariant = variants?.[variantIdx];
  const href =
    variants && variantIdx > 0
      ? `/shop/${product.slug}?color=${encodeURIComponent(activeVariant!.name)}`
      : `/shop/${product.slug}`;

  return (
    <div className="group">
      <Link
        href={href}
        className="block"
        aria-label={
          priced
            ? `${product.name}, ${formatPrice(product.priceCents)}`
            : `${product.name}, price to be announced`
        }
      >
        <div
          className={`product-media relative aspect-[4/5] overflow-hidden ${
            product.imageBackdrop === "neutral" ? "bg-studio" : "bg-smoke"
          }`}
        >
          {/* Every variant image stays mounted so switching never flashes. */}
          {(variants ?? [null]).map((v, i) => {
            const img = v ? v.images[0] : product.images[0];
            const active = variants ? i === variantIdx : true;
            return (
              <Image
                key={img.src}
                src={catalogImageSrc(img.src)}
                alt={active ? img.alt : ""}
                fill
                sizes="(min-width: 1280px) 40vw, (min-width: 768px) 45vw, 72vw"
                quality={90}
                className={`object-contain ${
                  active ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={!active}
              />
            );
          })}
          {comingSoon && (
            <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-paper">
              Coming Soon
            </span>
          )}
          {product.isLimitedDrop && !soldOut && (
            <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-paper">
              Limited Drop
            </span>
          )}
          {lowStock && (
            <span className="absolute bottom-3 left-3 rounded-full bg-red px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-paper">
              {remaining} left
            </span>
          )}
          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
              <span className="rounded-full bg-paper px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink">
                Sold Out
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-3">
        <Link href={href} className="block">
          <h3 className="text-base font-semibold leading-tight text-ink md:text-lg">
            {displayName(product.name)}
          </h3>
        </Link>
        <Link href={href} className="block">
          {priced ? (
            <p className="text-base font-bold text-ink md:text-lg">
              {onSale && (
                <span className="mr-1.5 font-normal text-ink/40 line-through">
                  {formatPrice(product.compareAtPriceCents!)}
                </span>
              )}
              {formatPrice(product.priceCents)}
            </p>
          ) : (
            <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
              Price TBA
            </p>
          )}
        </Link>
      </div>

      {variants ? (
        <div
          className="mt-3 -ml-1.5 flex gap-1"
          role="radiogroup"
          aria-label={`${product.name} color`}
        >
          {variants.map((v, i) => (
            <button
              key={v.name}
              type="button"
              role="radio"
              aria-checked={i === variantIdx}
              aria-label={v.name}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setVariantIdx(i);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
            >
              <span
                className={`block h-[22px] w-[22px] rounded-full border border-ink/20 transition-shadow ${
                  i === variantIdx ? "shadow-[0_0_0_2px_#fff,0_0_0_4px_#0A0A0A]" : ""
                }`}
                style={{ backgroundColor: v.hex }}
              />
            </button>
          ))}
        </div>
      ) : oneSize ? (
        <p className="mt-3 flex h-8 items-center text-sm text-ink/60">One adjustable size</p>
      ) : null}
    </div>
  );
}

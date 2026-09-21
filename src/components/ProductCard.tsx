"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product, isSoldOut, isAvailableForSale, remainingUnits, hasPrice } from "@/lib/types";
import { formatPrice } from "@/lib/format";

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

  // Each card keeps its own colorway selection; the image swaps in place and
  // the selection rides along to the product page as ?color=.
  const variants = product.colorVariants;
  const [variantIdx, setVariantIdx] = useState(0);
  const activeVariant = variants?.[variantIdx];
  const cardImage = activeVariant?.images[0] ?? product.images[0];
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
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper">
          {/* Every variant image stays mounted so switching never flashes. */}
          {(variants ?? [null]).map((v, i) => {
            const img = v ? v.images[0] : product.images[0];
            const active = variants ? i === variantIdx : true;
            return (
              <Image
                key={img.src}
                src={img.src}
                alt={active ? img.alt : ""}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
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
            <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
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

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <Link href={href} className="block">
            <h3 className="text-sm font-semibold text-ink">{product.name}</h3>
          </Link>
          {variants ? (
            <div
              className="mt-1.5 flex items-center gap-1"
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
                  className="flex h-7 w-7 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink"
                >
                  <span
                    className={`block h-3.5 w-3.5 rounded-full border border-ink/25 transition-shadow ${
                      i === variantIdx ? "ring-2 ring-ink ring-offset-1" : ""
                    }`}
                    style={{ backgroundColor: v.hex }}
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-1.5 flex h-7 items-center">
              <span
                className="inline-block h-3.5 w-3.5 rounded-full border border-ink/25"
                style={{ backgroundColor: product.colorHex }}
                aria-hidden="true"
              />
              <span className="sr-only">{product.color}</span>
            </p>
          )}
        </div>
        <Link href={href} className="block text-right">
          {priced ? (
            <p className="text-sm font-semibold text-ink">
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
    </div>
  );
}

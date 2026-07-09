import Link from "next/link";
import Image from "next/image";
import { Product, isSoldOut, remainingUnits } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const onSale =
    product.compareAtPriceCents != null &&
    product.compareAtPriceCents > product.priceCents;
  const soldOut = isSoldOut(product);
  const remaining = remainingUnits(product);
  // Only surface the countdown when it's actually getting scarce — honest urgency.
  const lowStock = !soldOut && remaining != null && remaining <= 150;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block"
      aria-label={`${product.name}, ${formatPrice(product.priceCents)}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-smoke">
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
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

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-ink">{product.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/50">
            <span
              className="inline-block h-3 w-3 rounded-full border border-ink/15"
              style={{ backgroundColor: product.colorHex }}
              aria-hidden="true"
            />
            {product.color}
          </p>
        </div>
        <p className="text-sm font-semibold text-ink">
          {onSale && (
            <span className="mr-1.5 font-normal text-ink/40 line-through">
              {formatPrice(product.compareAtPriceCents!)}
            </span>
          )}
          {formatPrice(product.priceCents)}
        </p>
      </div>
    </Link>
  );
}

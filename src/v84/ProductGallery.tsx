"use client";
import Image from "next/image";
import { useRef } from "react";
import { catalogImageSrc } from "@/lib/product-image";
import type { Product } from "@/lib/types";

export function ProductGallery({ images, index, onChange }: { images: Product["images"]; index: number; onChange: (index: number) => void }) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const selectedIndex = index >= 0 && index < images.length ? index : 0;
  const image = images[selectedIndex];
  const move = (direction: number) => onChange((selectedIndex + direction + images.length) % images.length);
  if (!image) return null;
  return <div>
    <div className="gallery">
      <div className="thumbnails" role="group" aria-label="Product images">{images.map((img, i) => <button key={img.src} className={`thumbnail${selectedIndex === i ? " active" : ""}`} aria-pressed={selectedIndex === i} aria-label={`View image ${i + 1}: ${img.alt}`} onClick={() => onChange(i)}><img src={catalogImageSrc(img.src)} alt="" loading="lazy" /></button>)}</div>
      <div className="gallery-main" tabIndex={0} role="region" aria-label="Product gallery" aria-roledescription="carousel"
        onKeyDown={event => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          if (event.key === "Home") onChange(0);
          else if (event.key === "End") onChange(images.length - 1);
          else move(event.key === "ArrowRight" ? 1 : -1);
        }}
        onTouchStart={event => { start.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; }}
        onTouchCancel={() => { start.current = null; }}
        onTouchEnd={event => {
          const point = start.current, end = event.changedTouches[0]; start.current = null;
          if (!point || !end) return;
          const dx = end.clientX - point.x, dy = end.clientY - point.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
        }}>
        <Image src={catalogImageSrc(image.src)} alt={image.alt} fill priority={selectedIndex === 0} sizes="(max-width:700px) 90vw, 52vw" quality={90} />
        <span className="gallery-counter" aria-live="polite" aria-atomic="true">{selectedIndex + 1} / {images.length}</span>
      </div>
    </div>
    {image.caption && <p className="note">{image.caption}</p>}
  </div>;
}

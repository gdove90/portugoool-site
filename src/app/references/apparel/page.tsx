import Image from "next/image";
import { notFound } from "next/navigation";
import { MIGRATION_PREVIEW } from "@/lib/migration-preview";
import review from "@/data/apparel-rebrand-review.json";

export const metadata = { title: "Apparel artwork review · GOAL Athletics", robots: { index: false, follow: false } };

export default function ApparelArtworkReview() {
  if (!MIGRATION_PREVIEW) notFound();
  return <main style={{ padding: "150px clamp(18px, 4vw, 70px) 60px", background: "#efede7", color: "#111" }}>
    <p style={{ color: "#C1121F", fontWeight: 700 }}>ARTWORK &amp; PLACEMENT REVIEW</p>
    <h1 style={{ fontSize: "clamp(32px, 5vw, 68px)", margin: "12px 0" }}>Same garments. New identity.</h1>
    <p style={{ maxWidth: 760, lineHeight: 1.7 }}>Six existing apparel listings, sixteen existing color combinations. These are placement concepts using the supplied V1.3 paths. They are not studio photographs or manufacturer approvals.</p>
    <p style={{ maxWidth: 760, lineHeight: 1.7 }}>Matchday follows the new owner board: front 11 inches wide, top 3.5 inches below the collar; back GA 2.5 inches wide, top 1 inch below the back collar. Hoodies use front artwork with a full bar only. Remaining new placements await measured specifications.</p>
    <details style={{ marginTop: 24 }}><summary>Approved Matchday placement reference</summary><Image src="/brand/apparel-review/Matchday-Owner-Reference.png" alt="Owner Matchday placement reference: front 10.5–11 inches wide, 3.5 inches below collar; back GA 2.5 inches wide, 1 inch below collar" width={1153} height={1364} sizes="(max-width:900px) 95vw, 760px" style={{ maxWidth: 760, width: "100%", height: "auto" }} /><p>Owner reference only; confirm measurements on the actual ST720 garment.</p></details>
    <section aria-label="Garment placement concepts" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: 24, marginTop: 36 }}>
      {["Matchday-Tee", "Cotton-Tee", "Hoodie", "Performance-Tee"].map(name => <figure key={name} style={{ margin: 0, border: "1px solid #ccc", background: "#fff" }}>
        <Image src={`/brand/apparel-review/${name}-Concept.svg`} alt={`${name.replaceAll("-", " ")} front and back placement concept, not a production proof`} width={700} height={535} sizes="(max-width:900px) 95vw, 46vw" unoptimized />
        <figcaption style={{ padding: 18, lineHeight: 1.6 }}>{name.replaceAll("-", " ")} · {name === "Hoodie" ? "Front only; back blank." : "Front and back artwork placement concept."}</figcaption>
      </figure>)}
    </section>
    <section aria-label="Existing product migration inventory" style={{ marginTop: 48 }}>
      <h2>Existing products and colors</h2>
      {review.products.map(product => <article key={product.id} style={{ padding: "24px 0", borderTop: "1px solid #aaa" }}>
        <h3>{product.name} · ${(product.priceCents / 100).toFixed(2)}</h3>
        <p>{product.blank} · {product.variants.map(v => v.color).join(" / ")}</p>
        <p>{product.placementStatus}</p>
        <p style={{ fontSize: 13, overflowWrap: "anywhere" }}>Preserved route: /shop/{product.slug}</p>
        <p style={{ color: "#9d1420" }}>Supplier update and photography sync pending. Existing products, prices, SKUs and historical artwork remain intact.</p>
      </article>)}
    </section>
  </main>;
}

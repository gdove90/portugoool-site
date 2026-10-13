import Image from "next/image";
import { notFound } from "next/navigation";
import { MIGRATION_PREVIEW } from "@/lib/migration-preview";
import review from "@/data/cap-rebrand-review.json";

export const metadata = { title: "Cap concepts · GOAL Athletics", robots: { index: false, follow: false } };

export default function CapConceptReview() {
  if (!MIGRATION_PREVIEW) notFound();
  return <main style={{ padding: "150px clamp(18px,4vw,70px) 60px", background: "#efede7", color: "#111" }}>
    <p style={{ color: "#C1121F", fontWeight: 700 }}>OWNER CONCEPT REVIEW · NOT FOR SALE</p>
    <h1 style={{ fontSize: "clamp(32px,5vw,68px)", margin: "12px 0" }}>Caps. A new direction.</h1>
    <p style={{ maxWidth: 850, lineHeight: 1.7 }}>Two structured-cap directions remain: the GA monogram and compact GOAL ATHLETICS wordmark. The clean-badge concept has been withdrawn. Existing supplier designs and historical SKUs remain intact.</p>
    <p style={{ maxWidth: 850, lineHeight: 1.7 }}>These AI studio concepts reference the owner-approved V1.3 reconstruction paths. They illustrate appearance, not exact original-vector geometry, digitization, final dimensions or manufacturing approval. The original master and supplier embroidery proof are release requirements.</p>
    <section aria-label="Cap concept galleries">
      {review.galleries.map(g => <figure key={g.src} style={{ margin: "32px 0", background: "#fff", border: "1px solid #ccc" }}>
        <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="95vw" style={{ width: "100%", height: "auto" }} />
        <figcaption style={{ padding: 20, lineHeight: 1.6 }}>{g.caption}</figcaption>
      </figure>)}
    </section>
    <section aria-label="Staged product entries">
      <h2>Staged entries · sales disabled</h2>
      {review.products.map(p => <article key={p.key} style={{ padding: "24px 0", borderTop: "1px solid #aaa" }}>
        <h3>{p.name}</h3><p>{p.blank} · {p.color} · {p.size}</p>
        <p>{p.description}</p>
        <p>Retail price: {p.priceCents === null ? "awaiting approved costing" : `$${(p.priceCents / 100).toFixed(2)} (existing price preserved)`}</p>
        <p>Replacement supplier design: awaiting approval. Final decoration dimensions and stitch count: pending digitization.</p>
        <p style={{ fontSize: 13, overflowWrap: "anywhere" }}>{p.productId ? `Preserved product: ${p.productId} · legacy design ${p.legacyDesignId} · ${p.legacySku}` : "New dad-hat entry: no product UUID, supplier design or fulfillment SKU assigned."}</p>
      </article>)}
    </section>
    <section style={{ marginTop: 36, lineHeight: 1.7 }}><h2>Manufacturer verification still required</h2>
      <p>The dad-hat product page's embroidery table shows 4 × 4 inches; APLIIQ's hat-specific guidance says approximately 4 × 2 inches. Resolve this conflict before setting production dimensions. At final size, detail must support at least 2 mm stitches and small lettering needs vendor approval. Do not infer stitch counts from these images.</p>
      <p>Dad hat: black garment only. White and tonal-black thread concepts, plus a brand-red contrast concept awaiting physical thread approval. Side and rear remain blank. No rear separator bar.</p>
      <p>Owner concept approval, original artwork, vendor placement/digitization proof, replacement saved-design IDs, final costs and release approval remain outstanding. No sample orders or supplier submissions were made.</p>
    </section>
  </main>;
}

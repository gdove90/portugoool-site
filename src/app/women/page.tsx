import { pageMetadata } from "@/lib/page-metadata";
import TempoComingSoon from "@/components/TempoComingSoon";
import { TEMPO_COLLECTION_COMING_SOON } from "@/lib/collection-launch";
import { verifiedOwner } from "@/lib/intake/auth";
import Editorial from "@/v84/Editorial";

// The owner check reads a cookie, so the page renders per request.
export const dynamic = "force-dynamic";

export const metadata = TEMPO_COLLECTION_COMING_SOON
  ? pageMetadata("/women", "Tempo Women's Collection - Coming Soon", "The Tempo Collection by GOAL Athletics. Women's athletic wear, coming soon. A new rhythm.")
  : pageMetadata("/women", "Women's Athletic Wear | Tempo Collection", "Discover the Tempo Collection by GOAL Athletics. A new rhythm.");

// While the collection is coming soon the public gets the Tempo landing
// page; the signed-in owner (same cookie gate as /admin) gets the real
// /women editorial and grid so the line can be reviewed before it opens.
export default async function Page() {
  if (TEMPO_COLLECTION_COMING_SOON) {
    const owner = await verifiedOwner().catch(() => null);
    if (!owner) {
      return <TempoComingSoon collection="Tempo" audience="Women" image="/v84/assets/women.png" imageAlt="Woman in black athleticwear against warm stone" />;
    }
  }
  return <Editorial route="women" />;
}
